import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const CapMint = ({
  setLoading,
  createdTokenPublicKey,
  setSupplyCapped,
  mintingWalletSecretKey,
}) => {
  const capSupplyHelper = async () => {
    try {
      setLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const createMintingWallet = await Keypair.fromSecretKey(
        Uint8Array.from(Object.values(JSON.parse(mintingWalletSecretKey)))
      );
      const fromAirDropSignature = await connection.requestAirdrop(
        createMintingWallet.publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);

      const creatorToken = new Token(
        connection,
        createdTokenPublicKey,
        TOKEN_PROGRAM_ID,
        createMintingWallet
      );
      await creatorToken.setAuthority(
        createdTokenPublicKey,
        null,
        "MintTokens",
        createMintingWallet.publicKey,
        [createMintingWallet]
      );

      setSupplyCapped(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={capSupplyHelper}>Cap Minting</button>
    </>
  );
};

export default CapMint;
