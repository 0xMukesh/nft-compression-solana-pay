import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

import { env } from "@/constants";

export const setupUmi = async () => {
  const umi = createUmi(env.RPC_URL);
  const payer = umi.eddsa.createKeypairFromSecretKey(
    base58.serialize(env.PRIVATE_KEY)
  );
  umi.use(keypairIdentity(payer));

  return umi;
};

export const sleep = async (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
