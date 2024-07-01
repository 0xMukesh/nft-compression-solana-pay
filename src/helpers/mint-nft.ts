import {
  MetadataArgsArgs,
  mintToCollectionV1,
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@metaplex-foundation/umi";

import { setupUmi } from "@/utils";

export const mintCnft = async ({
  reciever,
  merkleTree,
  collectionMint,
  metadata,
}: {
  reciever: PublicKey;
  merkleTree: PublicKey;
  collectionMint: PublicKey;
  metadata: MetadataArgsArgs;
}) => {
  try {
    const umi = await setupUmi();
    umi.use(mplBubblegum());

    const transaction = mintToCollectionV1(umi, {
      leafOwner: reciever,
      leafDelegate: umi.identity.publicKey,
      merkleTree: merkleTree,
      collectionMint: collectionMint,
      metadata,
    });

    return transaction;
  } catch (err) {
    console.log(err);
  }
};
