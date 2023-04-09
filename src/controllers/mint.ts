import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";

import { mintCompressedNFT } from "@/helpers";
import {
  CONNECTION,
  PAYER,
  TREE_ADDRESS,
  COLLECTION_MINT_ACCOUNT,
  COLLECTION_METADATA_ACCOUNT,
  COLLECTION_MASTER_EDITION_ACCOUNT,
} from "@/constants";

export const mintHandler = async (req: Request, res: Response) => {
  if (req.method === "GET") {
    return res.status(200).json({
      label: "Compresiooooon",
      icon: "https://i.imgur.com/pOfoqIx.jpg",
    });
  }

  if (req.method === "POST") {
    const { account } = req.body;

    if (!account) {
      return res.status(400).json({
        error: "Missing `account` field in request body",
      });
    }

    try {
      const nftMetadata: MetadataArgs = {
        name: "Compressiooooon #1",
        symbol: "CMPN",
        uri: "https://nftstorage.link/ipfs/bafkreibtsmyhmx6lcg45uus6ov3bvg5yqzdcp2n7w3nksezh5mqzp5gmoa",
        creators: [
          {
            address: PAYER.publicKey,
            verified: false,
            share: 100,
          },
          {
            address: new PublicKey(account),
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

      const transaction = await mintCompressedNFT(
        new PublicKey(account),
        TREE_ADDRESS,
        COLLECTION_MINT_ACCOUNT,
        COLLECTION_METADATA_ACCOUNT,
        COLLECTION_MASTER_EDITION_ACCOUNT,
        nftMetadata,
        new PublicKey(account)
      );

      if (!transaction) {
        return res.status(400).json({
          error: "Got empty transaction",
        });
      }

      const { blockhash, lastValidBlockHeight } =
        await CONNECTION.getLatestBlockhash({
          commitment: "confirmed",
        });
      transaction.feePayer = new PublicKey(account);
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      transaction.partialSign(PAYER);

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
      });
      const base64 = serializedTransaction.toString("base64");

      return res.status(200).json({
        transaction: base64,
        message: "compresiooooon!!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};
