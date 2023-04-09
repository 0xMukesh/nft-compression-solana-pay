import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createMintToCollectionV1Instruction,
  MetadataArgs,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import { PAYER, CONNECTION } from "@/constants";

export const mintCompressedNFT = async (
  payer: PublicKey,
  merkleTreeAddress: PublicKey,
  mintAccount: PublicKey,
  metadataAccount: PublicKey,
  masterEditionAccount: PublicKey,
  metadata: MetadataArgs,
  toAddress?: PublicKey
) => {
  try {
    const [treeAuthority, _] = PublicKey.findProgramAddressSync(
      [merkleTreeAddress.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
    );

    // derive a PDA which acts as signer for minting the compressed NFT
    const [bubblegumSigner, __] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_cpi", "utf8")],
      BUBBLEGUM_PROGRAM_ID
    );

    const mintInstruction = createMintToCollectionV1Instruction(
      {
        payer,
        merkleTree: merkleTreeAddress,
        treeAuthority,
        treeDelegate: payer,
        // reciever of the NFT
        leafOwner: toAddress || payer,
        leafDelegate: PAYER.publicKey,
        collectionAuthority: PAYER.publicKey,
        collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
        collectionMint: mintAccount,
        collectionMetadata: metadataAccount,
        editionAccount: masterEditionAccount,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        bubblegumSigner,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      },
      {
        metadataArgs: Object.assign(metadata, {
          collection: {
            key: mintAccount,
            verified: false,
          },
        }),
      }
    );

    mintInstruction.keys.push({
      pubkey: PAYER.publicKey,
      isSigner: true,
      isWritable: true,
    });

    const { blockhash, lastValidBlockHeight } =
      await CONNECTION.getLatestBlockhash({
        commitment: "confirmed",
      });

    const transaction = new Transaction().add(mintInstruction);
    transaction.feePayer = payer;
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.partialSign(PAYER);

    return transaction;
  } catch (err) {
    console.log("an error occured while minting the compressed nft");
    console.log(err);
  }
};
