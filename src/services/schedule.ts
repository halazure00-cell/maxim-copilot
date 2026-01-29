export type Strategy = 'maxim_morning' | 'shopee_noon' | 'maxim_evening' | 'off';

type ScheduleSlot = { start: number; end: number; strategy: Strategy };

const SCHEDULE: ScheduleSlot[] = [
  { start: 5 * 3600, end: 10 * 3600, strategy: 'maxim_morning' },
  { start: 10 * 3600, end: 16 * 3600, strategy: 'shopee_noon' },
  { start: 16 * 3600, end: 22 * 3600, strategy: 'maxim_evening' }
];

export const STRATEGY_LABELS: Record<Strategy, string> = {
  maxim_morning: 'Maxim Pagi',
  shopee_noon: 'Shopee Siang',
  maxim_evening: 'Maxim Sore',
  off: 'Di luar jam operasional'
};

export function getCurrentStrategy(date: Date = new Date()): Strategy {
  const seconds =
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds();
  for (const slot of SCHEDULE) {
    if (seconds >= slot.start && seconds < slot.end) return slot.strategy;
  }
  return 'off';
}
