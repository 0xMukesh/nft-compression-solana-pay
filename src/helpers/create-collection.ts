import {
  createAndMint,
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

import { setupUmi } from "@/utils";

export const createCollection = async ({
  config,
}: {
  config: Omit<
    Parameters<typeof createAndMint>[1],
    "amount" | "tokenStandard" | "mint"
  >;
}) => {
  try {
    const umi = await setupUmi();
    umi.use(mplTokenMetadata());

    const collectionMint = generateSigner(umi);

    const { signature } = await createNft(umi, {
      mint: collectionMint,
      ...config,
    }).sendAndConfirm(umi);
    const decodedSignature = base58.deserialize(signature)[0];

    return {
      signature: decodedSignature,
      mint: collectionMint,
    };
  } catch (err) {
    console.log(err);
  }
};
