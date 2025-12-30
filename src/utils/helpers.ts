import { API_BASE_URL } from '../state/config';

export const getUrl = (): string => {
  return API_BASE_URL;
};

export const getFormattedTime = (duration: number) => {
  let totalSeconds = duration;
  // let hours: string | number = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes: string | number = Math.floor(totalSeconds / 60);
  let seconds: string | number = totalSeconds % 60;

  minutes = String(minutes).padStart(2, '0');
  // hours = String(hours).padStart(2, '0');
  seconds = String(seconds.toFixed()).padStart(2, '0');
  return `${minutes && minutes + ':'}${seconds}`;
};

export const addAlpha = (color: string, alpha: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};