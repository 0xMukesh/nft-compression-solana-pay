import { percentAmount } from "@metaplex-foundation/umi";

import { createCollection, createMerkleTree } from "@/helpers";

const setup = async () => {
  try {
    const createMerkleTreeTxnResult = await createMerkleTree({
      maxDepth: 14,
      maxBufferSize: 64,
    });

    const createCollectionTxnResult = await createCollection({
      config: {
        name: "Critters Cult",
        uri: "https://53fy5rm6l356eoslw2d6uk3n7t7gdflvdl455dmcoon5apzuxn5a.arweave.net/7suOxZ5e--I6S7aH6itt_P5hlXUa-d6NgnOb0D80u3o",
        sellerFeeBasisPoints: percentAmount(0),
        isCollection: true,
      },
    });

    if (
      createMerkleTreeTxnResult === undefined ||
      createCollectionTxnResult === undefined
    ) {
      throw new Error("failed to create required transactions");
    }

    console.log(
      `merkle tree address - ${createMerkleTreeTxnResult.tree.publicKey.toString()}`
    );
    console.log(
      `collection mint address - ${createCollectionTxnResult.mint.publicKey.toString()}`
    );
    console.log(
      `merkle tree signature - ${createMerkleTreeTxnResult.signature}`
    );
    console.log(
      `create collection signature - ${createCollectionTxnResult.signature}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

setup();
