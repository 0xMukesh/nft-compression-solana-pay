import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { generateSigner } from "@metaplex-foundation/umi";

import { setupUmi } from "@/utils";
import { base58 } from "@metaplex-foundation/umi/serializers";

export const createMerkleTree = async ({
  maxDepth,
  maxBufferSize,
}: {
  maxDepth: number;
  maxBufferSize: number;
}) => {
  try {
    const umi = await setupUmi();
    umi.use(mplBubblegum());

    const merkleTree = generateSigner(umi);

    const transactionBuilder = await createTree(umi, {
      merkleTree,
      maxDepth,
      maxBufferSize,
    });

    const { signature } = await transactionBuilder.sendAndConfirm(umi, {
      confirm: {
        commitment: "confirmed",
      },
    });
    const decodedSignature = base58.deserialize(signature)[0];

    return {
      signature: decodedSignature,
      tree: merkleTree,
    };
  } catch (err) {
    console.log(err);
  }
};
