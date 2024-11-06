export const formatSecondsToHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};
