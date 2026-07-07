export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (inThrottle) {
      return;
    }

    fn(...args);
    inThrottle = true;

    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
};
