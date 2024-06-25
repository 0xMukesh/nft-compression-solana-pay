module.exports = {
  validator: {
    commitment: "confirmed",
    programs: [
      {
        label: "MPL Bubblegum",
        programId: "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
        deployPath: `${__dirname}/programs/bubblegum.so`,
      },
      {
        label: "Token Metadata",
        programId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        deployPath: `${__dirname}/programs/token_metadata.so`,
      },
      {
        label: "SPL Account Compression",
        programId: "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK",
        deployPath: `${__dirname}/programs/account_compression.so`,
      },
      {
        label: "SPL Noop",
        programId: "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
        deployPath: `${__dirname}/programs/noop.so`,
      },
    ],
  },
};
