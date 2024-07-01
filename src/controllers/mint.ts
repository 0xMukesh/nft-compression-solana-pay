import { Request, Response } from "express";
import { publicKey } from "@metaplex-foundation/umi";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";

import { mintCnft } from "@/helpers";
import { setupUmi } from "@/utils";
import { env } from "@/constants";

export const mintHandler = async (req: Request, res: Response) => {
  if (req.method === "GET") {
    return res.status(200).json({
      label: "compresiooooon",
      icon: "https://i.imgur.com/pOfoqIx.jpg",
    });
  }

  if (req.method === "POST") {
    const { account } = req.body;

    if (!account) {
      return res.status(400).json({
        error: "missing `account` field in request body",
      });
    }

    try {
      const umi = await setupUmi();
      umi.use(mplBubblegum());

      const reciever = publicKey(account);
      const collectionMint = publicKey(env.COLLECTION_MINT_ADDRESS);
      const merkleTree = publicKey(env.TREE_ADDRESS);

      const mintCnftBuilder = await mintCnft({
        reciever,
        collectionMint,
        merkleTree,
        metadata: {
          name: "Critter Capo",
          uri: "https://fcvngkzedh3z2lnklcr6emmdaj6hnh3jjtymlymhtcoaywz3luva.arweave.net/KKrTKyQZ950tqlij4jGDAnx2n2lM8MXhh5icDFs7XSo",
          sellerFeeBasisPoints: 0,
          collection: {
            key: collectionMint,
            verified: false,
          },
          creators: [
            {
              address: reciever,
              verified: false,
              share: 100,
            },
          ],
        },
      });

      if (!mintCnftBuilder) {
        return res.status(500).json({
          error: "failed to create mint cnft transaction",
        });
      }

      const instructions = [...mintCnftBuilder.getInstructions()];
      const { blockhash } = await umi.rpc.getLatestBlockhash();

      const transaction = umi.transactions.create({
        blockhash,
        instructions,
        payer: reciever,
      });
      const serializedTransaction = Buffer.from(
        umi.transactions.serialize(transaction)
      ).toString("base64");

      return res.status(200).json({
        transaction: serializedTransaction,
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
