const sleepMs = async (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });

export default sleepMs;
