export const isMobileDevice = (): boolean => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};
