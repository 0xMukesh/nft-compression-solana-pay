import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  createAllocTreeIx,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";

import { connection, leafDelegate } from "@/constants";

export const createMerkleTree = async (
  merkleTreeKeypair: Keypair,
  depthSizePair: ValidDepthSizePair,
  canopyDepth: number
) => {
  console.log("creating merkle tree...");

  const [merkleTreeAuthority, _] = PublicKey.findProgramAddressSync(
    [merkleTreeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  console.log(`merkle tree authority - ${merkleTreeAuthority.toString()}`);

  // allocates merkle tree's account
  const allocTreeInstruction = await createAllocTreeIx(
    connection,
    merkleTreeKeypair.publicKey,
    leafDelegate.publicKey,
    depthSizePair,
    canopyDepth
  );

  // creates merkle tree
  const createTreeInstruction = createCreateTreeInstruction(
    {
      payer: leafDelegate.publicKey,
      treeCreator: leafDelegate.publicKey,
      treeAuthority: merkleTreeAuthority,
      merkleTree: merkleTreeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: depthSizePair.maxBufferSize,
      maxDepth: depthSizePair.maxDepth,
      public: true,
    },
    BUBBLEGUM_PROGRAM_ID
  );

  try {
    const transaction = new Transaction()
      .add(allocTreeInstruction)
      .add(createTreeInstruction);
    transaction.feePayer = leafDelegate.publicKey;

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      // both `merkleTreeKeypair` and `payer` must be the signers of the transaction
      [merkleTreeKeypair, leafDelegate],
      {
        commitment: "confirmed",
      }
    );

    console.log(`create merkle tree signature - ${signature}`);

    return {
      authority: merkleTreeAuthority,
      address: merkleTreeKeypair.publicKey,
    };
  } catch (err) {
    console.log("an error occured while creating merkle tree");
    console.log(err);
  }
};
