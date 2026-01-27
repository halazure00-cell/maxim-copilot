export type Strategy = 'maxim_morning' | 'shopee_noon' | 'maxim_evening' | 'off';

const SCHEDULE = [
  { start: 5 * 60, end: 10 * 60, strategy: 'maxim_morning' },
  { start: 10 * 60, end: 16 * 60, strategy: 'shopee_noon' },
  { start: 16 * 60, end: 22 * 60, strategy: 'maxim_evening' }
] as const;

export function getCurrentStrategy(date: Date = new Date()): Strategy {
  const minutes = date.getHours() * 60 + date.getMinutes();
  for (const slot of SCHEDULE) {
    if (minutes >= slot.start && minutes < slot.end) return slot.strategy;
  }
  return 'off';
}
