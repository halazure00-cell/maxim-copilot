import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- 1. Fix Leaflet Default Icon ---
// We reference the images from the public folder now
const iconDefaultProto = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: () => string;
};
delete iconDefaultProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// --- 1b. Avoid Chrome warning on non-cancelable touchmove events ---
const domEventAny = L.DomEvent as typeof L.DomEvent & {
  __maximPreventDefaultPatched?: boolean;
};
if (!domEventAny.__maximPreventDefaultPatched) {
  const originalPreventDefault = domEventAny.preventDefault;
  domEventAny.preventDefault = function (this: typeof L.DomEvent, e: Event) {
    if (e.cancelable) {
      return originalPreventDefault.call(this, e);
    }
    return this;
  };
  domEventAny.__maximPreventDefaultPatched = true;
}
const ZONES = [
  {
    id: 1,
    name: 'Zona Pendidikan (Unpad/ITB)',
    color: '#FEEC00', // Maxim Yellow
    description: 'Permintaan tinggi jam 07:00 - 16:00',
    // Area Dipati Ukur / Dago
    coords: [
      [-6.8858, 107.6100],
      [-6.8950, 107.6150],
      [-6.8900, 107.6250],
    ] as [number, number][]
  },
  {
    id: 2,
    name: 'Zona Kuliner (Riau/Progo)',
    color: '#F97316', // Orange
    description: 'Ramai saat makan siang & malam minggu',
    // Area Riau
    coords: [
      [-6.9000, 107.6150],
      [-6.9100, 107.6150],
      [-6.9100, 107.6300],
      [-6.9000, 107.6300],
    ] as [number, number][]
  },
  {
    id: 3,
    name: 'Zona Perkantoran (Asia Afrika)',
    color: '#3B82F6', // Blue
    description: 'Target karyawan pulang kerja jam 17:00',
    // Area Alun-alun / Asia Afrika
    coords: [
      [-6.9180, 107.6050],
      [-6.9250, 107.6050],
      [-6.9250, 107.6150],
      [-6.9180, 107.6150],
    ] as [number, number][]
  }
];

// Component to handle map movement
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export const ZoneMap: React.FC = () => {
  // Default Center: Gedung Sate, Bandung
  const defaultCenter: [number, number] = [-6.9024, 107.6188];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // --- 3. Get User Location ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback handled by keeping userPosition null
        }
      );
    }
  }, []);

  return (
    // UPDATED: Added min-h-[50vh] as insurance policy against collapse
    <div className="w-full h-full min-h-[50vh] rounded-2xl overflow-hidden relative shadow-inner border border-brand-gray/50 isolate">
      {/* --- 4. Dark Mode Style Injection --- */}
      <style>
        {`
          .dark-map-tiles {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
          /* Fix popup text color in dark mode context */
          .leaflet-popup-content-wrapper, .leaflet-popup-tip {
            background: #1E1E1E;
            color: white;
            border: 1px solid #333;
          }
        `}
      </style>

      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#121212' }}
        zoomControl={false} // Hide default zoom for cleaner mobile look
      >
        {/* --- 5. Tile Layer with Dark Mode Class --- */}
        <TileLayer
          className="dark-map-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Move map if user is located */}
        <MapController center={userPosition || defaultCenter} />

        {/* --- 6. Render Zones --- */}
        {ZONES.map((zone) => (
          <Polygon 
            key={zone.id} 
            positions={zone.coords}
            pathOptions={{ 
              color: zone.color, 
              fillColor: zone.color, 
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm" style={{ color: zone.color }}>{zone.name}</h3>
                <p className="text-xs text-gray-300 mt-1">{zone.description}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* --- 7. User Marker --- */}
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>
              Lokasi Anda
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay Info */}
      <div className="absolute top-4 right-4 z-[400] bg-black/70 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
        <div className="flex flex-col space-y-2">
          {ZONES.map(z => (
            <div key={z.id} className="flex items-center text-[10px] text-white">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: z.color }}></span>
              {z.name.split('(')[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneMap;
