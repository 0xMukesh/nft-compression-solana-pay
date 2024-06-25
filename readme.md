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

NOTE: if you've all the required variables mentioned in `.env.example` file then you skip the upcoming two steps and can follow along after that.

5. create a leaf delegate wallet (handles gas fees for creation of nft collection related accounts and merkle tree accounts) which would be used to sign all the transactions in future. store payer's private key in `.env` file (rename `.env.example` to `.env`)

   ```sh
   pnpm build && node dist/script/create-payer.js
   ```

6. setup all the required accounts for nft collection and merkle tree accounts. a new file named `accounts.json` would be created with public keys of all the accounts, copy and paste them accordingly in `.env` file

   ```sh
   pnpm build && node dist/script/setup.js
   ```

7. all the variables are now ready, start the server in development mode by running the following two commands in two different terminal windows

   ```sh
   tsup --watch
   ```

   ```sh
   pnpm dev
   ```
