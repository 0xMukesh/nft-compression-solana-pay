import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import base58 from "bs58";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RPC_URL: string;
      LEAF_DELEGATE_PRIVATE_KEY: string;
      TREE_ADDRESS: string;
      TREE_AUTHORITY: string;
      COLLECTION_MINT_ACCOUNT: string;
      COLLECTION_TOKEN_ACCOUNT: string;
      COLLECTION_METADATA_ACCOUNT: string;
      COLLECTION_MASTER_EDITION_ACCOUNT: string;
    }
  }
}

export const connection = new Connection(process.env.RPC_URL);
export const leafDelegate = Keypair.fromSecretKey(
  base58.decode(process.env.LEAF_DELEGATE_PRIVATE_KEY)
);
export const treeAddress = new PublicKey(process.env.TREE_ADDRESS);
export const treeAuthority = new PublicKey(process.env.TREE_AUTHORITY);
export const collectionMintAccount = new PublicKey(
  process.env.COLLECTION_MINT_ACCOUNT
);
export const collectionTokenAccount = new PublicKey(
  process.env.COLLECTION_TOKEN_ACCOUNT
);
export const collectionMetadataAccount = new PublicKey(
  process.env.COLLECTION_METADATA_ACCOUNT
);
export const collectionMasterEditionAccount = new PublicKey(
  process.env.COLLECTION_MASTER_EDITION_ACCOUNT
);
