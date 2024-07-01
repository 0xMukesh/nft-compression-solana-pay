# nft-compression-solana-pay

PoC of usage of compressed nfts along with solana pay

## how to run

NOTE: this project uses [amman](https://github.com/metaplex-foundation/amman) for testing, so make sure you've solana development tool suite installed on your system

1. change your configured RPC on solana CLI to mainnet. replace `<mainnet-rpc-url>` with any mainnet RPC URL of your choice, preferably helius

   ```sh
   solana config set --url <mainnet-rpc-url>
   ```

2. run `setup.sh` file to download all the required solana programs files for local testing

   ```sh
   chmod +x ./setup.sh
   ./setup.sh
   ```

3. install all the required node dependencies using pnpm

   ```sh
   pnpm install
   ```

4. start solana local validator, along with amman relay

   ```sh
   pnpm validator
   ```

5. create a merkle tree account and collection mint account via running the following command

   ```sh
   pnpm build && node dist/index.js
   ```

6. copy the addresses of merkle tree and collection mint accounts and put them into `.env` along with `RPC_URL` and `PRIVATE_KEY` (private key of wallet which would be used for paying gas fees for creation of merkle tree and collection mint accounts)

7. all the variables are now ready, start the server in development mode by running the following two commands in two different terminal windows

   ```sh
   tsup --watch
   ```

   ```sh
   pnpm dev
   ```
