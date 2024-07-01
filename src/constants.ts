import { cleanEnv, str, url } from "envalid";
import "dotenv/config";

export const env = cleanEnv(process.env, {
  RPC_URL: url(),
  PRIVATE_KEY: str(),
  TREE_ADDRESS: str(),
  COLLECTION_MINT_ADDRESS: str(),
});
