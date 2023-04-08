import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  CreateMetadataAccountArgsV3,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import * as Token from "@solana/spl-token";

import { sleep } from "@/utils";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const createCollection = async (
  connection: Connection,
  payer: Keypair,
  metadata: CreateMetadataAccountArgsV3
) => {
  try {
    console.log("creating collection's mint account...");
    const mintAccount = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      0,
      undefined,
      {
        commitment: "confirmed",
      },
      TOKEN_PROGRAM_ID
    );
    console.log(`mint account - ${mintAccount.toString()}`);

    sleep(1000);

    console.log("creating token account...");
    const tokenAccount = await Token.getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintAccount,
      payer.publicKey,
      true,
      "confirmed",
      {
        commitment: "confirmed",
      },
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log(`token account - ${tokenAccount.address.toString()}`);

    console.log("minting 1 token for the collection...");
    const mintSignature = await Token.mintTo(
      connection,
      payer,
      mintAccount,
      tokenAccount.address,
      payer,
      1,
      [],
      {
        commitment: "confirmed",
      },
      TOKEN_PROGRAM_ID
    );
    console.log(`mint signature - ${mintSignature}`);

    // deriving PDA for metadata account
    const [metadataAccount, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAccount.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log(`metadata account - ${metadataAccount.toString()}`);

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mintAccount,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: metadata,
      }
    );

    // deriving PDA for master edition account
    const [masterEditionAccount, __] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAccount.toBuffer(),
        Buffer.from("edition", "utf8"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log(`master edition account - ${masterEditionAccount.toString()}`);

    const createMasterEditionInstruction =
      createCreateMasterEditionV3Instruction(
        {
          edition: masterEditionAccount,
          mint: mintAccount,
          mintAuthority: payer.publicKey,
          payer: payer.publicKey,
          updateAuthority: payer.publicKey,
          metadata: metadataAccount,
        },
        {
          createMasterEditionArgs: {
            maxSupply: 0,
          },
        }
      );

    const collectionSizeInstruction = createSetCollectionSizeInstruction(
      {
        collectionMetadata: metadataAccount,
        collectionAuthority: payer.publicKey,
        collectionMint: mintAccount,
      },
      {
        setCollectionSizeArgs: { size: 10 },
      }
    );

    const transaction = new Transaction()
      .add(createMetadataInstruction)
      .add(createMasterEditionInstruction)
      .add(collectionSizeInstruction);
    transaction.feePayer = payer.publicKey;

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer],
      {
        commitment: "confirmed",
      }
    );

    console.log(`create collection signature - ${signature}`);
    return {
      mint: mintAccount,
      token: tokenAccount.address,
      metadata: metadataAccount,
      masterEdition: masterEditionAccount,
    };
  } catch (err) {
    console.log("an error occured while creating collection");
    console.log(err);
  }
};
