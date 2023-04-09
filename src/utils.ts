import { cleanEnv, url, str } from "envalid";
import "dotenv/config";

export const sleep = async (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const env = cleanEnv(process.env, {
  RPC_URL: url(),
  PAYER_PRIVATE_KEY: str(),
  TREE_ADDRESS: str(),
  TREE_AUTHORITY: str(),
  COLLECTION_MINT_ACCOUNT: str(),
  COLLECTION_TOKEN_ACCOUNT: str(),
  COLLECTION_METADATA_ACCOUNT: str(),
  COLLECTION_MASTER_EDITION_ACCOUNT: str(),
});
