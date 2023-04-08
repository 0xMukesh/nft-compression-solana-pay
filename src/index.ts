import { Connection, Keypair } from "@solana/web3.js";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import base58 from "bs58";
import * as dotenv from "dotenv";

import {
  createCollection,
  createMerkleTree,
  mintCompressedNFT,
} from "@/helpers";

dotenv.config();

const main = async () => {
  try {
    const connection = new Connection(process.env.RPC_URL!);
    const payer = Keypair.fromSecretKey(
      base58.decode(process.env.PAYER_PRIVATE_KEY!)
    );
    const testWallet = Keypair.generate();
    const treeKeypair = Keypair.generate();

    console.log(`payer - ${payer.publicKey.toString()}`);
    console.log(`test wallet - ${testWallet.publicKey.toString()}`);
    console.log(`merkle tree - ${treeKeypair.publicKey.toString()}`);

    const depthSizePair: ValidDepthSizePair = {
      maxDepth: 14,
      maxBufferSize: 64,
    };
    const canopyDepth = depthSizePair.maxDepth - 5;

    const tree = await createMerkleTree(
      connection,
      payer,
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
            address: payer.publicKey,
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

    const collection = await createCollection(
      connection,
      payer,
      collectionMetadata
    );

    const nftMetadata: MetadataArgs = {
      name: "Compressiooooon #1",
      symbol: collectionMetadata.data.symbol,
      uri: "https://nftstorage.link/ipfs/bafkreibtsmyhmx6lcg45uus6ov3bvg5yqzdcp2n7w3nksezh5mqzp5gmoa",
      creators: [
        {
          address: payer.publicKey,
          verified: false,
          share: 100,
        },
        {
          address: testWallet.publicKey,
          verified: false,
          share: 0,
        },
      ],
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
    };

    await mintCompressedNFT(
      connection,
      payer,
      // @ts-ignore
      tree?.address,
      // @ts-ignore
      collection?.mint,
      collection?.metadata,
      collection?.masterEdition,
      nftMetadata,
      payer.publicKey
    );
  } catch (err) {
    process.exit(1);
  }
};

main();
