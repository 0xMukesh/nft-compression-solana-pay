import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { connection } from "@/constants";

const createLeafDelegate = async () => {
  try {
    const leafDelegate = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      leafDelegate.publicKey,
      10 * LAMPORTS_PER_SOL
    );

    console.log(`airdrop signature - ${airdropSignature}`);
    console.log(`leaf delegate public key - ${leafDelegate.publicKey}`);
    console.log(`leaf delegate secret key - ${leafDelegate.secretKey}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

createLeafDelegate();
