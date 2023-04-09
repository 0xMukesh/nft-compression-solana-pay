import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import base58 from "bs58";

import { env } from "@/utils";

export const CONNECTION = new Connection(env.RPC_URL);
export const PAYER = Keypair.fromSecretKey(
  base58.decode(env.PAYER_PRIVATE_KEY)
);
export const TREE_ADDRESS = new PublicKey(env.TREE_ADDRESS);
export const TREE_AUTHORITY = new PublicKey(env.TREE_AUTHORITY);
export const COLLECTION_MINT_ACCOUNT = new PublicKey(
  env.COLLECTION_MINT_ACCOUNT
);
export const COLLECTION_TOKEN_ACCOUNT = new PublicKey(
  env.COLLECTION_TOKEN_ACCOUNT
);
export const COLLECTION_METADATA_ACCOUNT = new PublicKey(
  env.COLLECTION_METADATA_ACCOUNT
);
export const COLLECTION_MASTER_EDITION_ACCOUNT = new PublicKey(
  env.COLLECTION_MASTER_EDITION_ACCOUNT
);
