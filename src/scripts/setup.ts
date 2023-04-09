import { Keypair } from "@solana/web3.js";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import fs from "node:fs";
import "dotenv/config";

import { createMerkleTree, createCollection } from "@/helpers";
import { PAYER } from "@/constants";

const setup = async () => {
  try {
    const testWallet = Keypair.generate();
    const treeKeypair = Keypair.generate();

    console.log(`payer - ${PAYER.publicKey.toString()}`);
    console.log(`test wallet - ${testWallet.publicKey.toString()}`);
    console.log(`merkle tree - ${treeKeypair.publicKey.toString()}`);

    const depthSizePair: ValidDepthSizePair = {
      maxDepth: 14,
      maxBufferSize: 64,
    };
    const canopyDepth = depthSizePair.maxDepth - 5;

    const tree = await createMerkleTree(
      treeKeypair,
      depthSizePair,
      canopyDepth
    );

    const collectionMetadata: CreateMetadataAccountArgsV3 = {
      data: {
        name: "Compressiooooon",
        symbol: "CMPN",
        uri: "https://nftstorage.link/ipfs/bafkreibtsmyhmx6lcg45uus6ov3bvg5yqzdcp2n7w3nksezh5mqzp5gmoa",
        sellerFeeBasisPoints: 100,
        creators: [
          {
            address: PAYER.publicKey,
            verified: false,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      },
      isMutable: false,
      collectionDetails: null,
    };

    const collection = await createCollection(collectionMetadata);

    const data = {
      treeAddress: tree?.address.toString(),
      treeAuthority: tree?.authority.toString(),
      collectionMintAccount: collection?.mint.toString(),
      collectionTokenAccount: collection?.token.toString(),
      collectionMetadataAccount: collection?.metadata.toString(),
      collectionMasterEditionAccoun: collection?.masterEdition.toString(),
    };

    fs.writeFileSync("accounts.json", JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

setup();
