import {
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
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { sleep } from "@/utils";
import { CONNECTION, PAYER } from "@/constants";

export const createCollection = async (
  metadata: CreateMetadataAccountArgsV3
) => {
  try {
    console.log("creating collection's mint account...");
    const mintAccount = await createMint(
      CONNECTION,
      PAYER,
      PAYER.publicKey,
      PAYER.publicKey,
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
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      PAYER,
      mintAccount,
      PAYER.publicKey,
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
    const mintSignature = await mintTo(
      CONNECTION,
      PAYER,
      mintAccount,
      tokenAccount.address,
      PAYER,
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
        mintAuthority: PAYER.publicKey,
        payer: PAYER.publicKey,
        updateAuthority: PAYER.publicKey,
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
          mintAuthority: PAYER.publicKey,
          payer: PAYER.publicKey,
          updateAuthority: PAYER.publicKey,
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
        collectionAuthority: PAYER.publicKey,
        collectionMint: mintAccount,
      },
      {
        setCollectionSizeArgs: { size: 1 },
      }
    );

    const transaction = new Transaction()
      .add(createMetadataInstruction)
      .add(createMasterEditionInstruction)
      .add(collectionSizeInstruction);
    transaction.feePayer = PAYER.publicKey;

    const signature = await sendAndConfirmTransaction(
      CONNECTION,
      transaction,
      [PAYER],
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
