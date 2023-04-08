export const sleep = async (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
