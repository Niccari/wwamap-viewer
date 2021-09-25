export const sleepMs = async (milliseconds: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
