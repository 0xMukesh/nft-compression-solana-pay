import { Keypair } from "@solana/web3.js";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import base58 from "bs58";
import fs from "node:fs";
import "dotenv/config";

import { createMerkleTree, createCollection } from "@/helpers";
import { leafDelegate } from "@/constants";

const setup = async () => {
  try {
    const testWallet = Keypair.generate();
    const treeKeypair = Keypair.generate();

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
            address: leafDelegate.publicKey,
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

    if (tree === undefined) {
      process.exit(1);
    }

    if (collection === undefined) {
      process.exit(1);
    }

    const data = {
      payerPrivateKey: base58.encode(leafDelegate.secretKey),
      treeAddress: tree.address.toString(),
      treeAuthority: tree.authority.toString(),
      collectionMintAccount: collection.mint.toString(),
      collectionTokenAccount: collection.token.toString(),
      collectionMetadataAccount: collection.metadata.toString(),
      collectionMasterEditionAccoun: collection.masterEdition.toString(),
    };

    fs.writeFileSync("accounts.json", JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

setup();
