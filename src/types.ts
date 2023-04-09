import { PublicKey } from "@solana/web3.js";

export type Accounts = {
  TREE_ADDRESS: PublicKey;
  TREE_AUTHORITY: PublicKey;
  COLLECTION_MINT_ACCOUNT: PublicKey;
  COLLECTION_TOKEN_ACCOUNT: PublicKey;
  COLLECTION_METADATA_ACCOUNT: PublicKey;
  COLLECTION_MASTER_EDITION_ACCOUNT: PublicKey;
};
