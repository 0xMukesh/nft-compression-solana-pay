import {
  Connection,
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

export const createMerkleTree = async (
  connection: Connection,
  payer: Keypair,
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
    payer.publicKey,
    depthSizePair,
    canopyDepth
  );

  // creates merkle tree
  const createTreeInstruction = createCreateTreeInstruction(
    {
      payer: payer.publicKey,
      treeCreator: payer.publicKey,
      treeAuthority: merkleTreeAuthority,
      merkleTree: merkleTreeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      // used for on-chain logging
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: depthSizePair.maxBufferSize,
      maxDepth: depthSizePair.maxDepth,
      public: false,
    },
    BUBBLEGUM_PROGRAM_ID
  );

  try {
    const transaction = new Transaction()
      .add(allocTreeInstruction)
      .add(createTreeInstruction);
    transaction.feePayer = payer.publicKey;

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      // both `merkleTreeKeypair` PDA and `payer` must be the signers of the transaction
      [merkleTreeKeypair, payer],
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
