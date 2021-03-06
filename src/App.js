import React from "react";
import { useState } from "react";
import Airdrop from "./Airdrop";
import Minting from "./Minting";
import "./styles.css";

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState();
  const [loading, setLoading] = useState();

  const getProvider = async () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    } else {
      window.open("https://www.phantom.app/", "_blank");
    }
  };

  const walletConnectionHelper = async () => {
    if (walletConnected) {
      //Disconnect Wallet
      setProvider();
      setWalletConnected(false);
    } else {
      const userWallet = await getProvider();
      if (userWallet) {
        await userWallet.connect();
        userWallet.on("connect", async () => {
          setProvider(userWallet);
          setWalletConnected(true);
        });
      }
    }
  };

  return (
    <div>
      <h1>Create your own token using JavaScript</h1>
      {walletConnected ? (
        <p>
          <strong>Public Key:</strong> {provider.publicKey.toString()}
        </p>
      ) : (
        <p></p>
      )}

      <button onClick={walletConnectionHelper} disabled={loading}>
        {!walletConnected ? "Connect Wallet" : "Disconnect Wallet"}
      </button>

      <Airdrop
        loading={loading}
        setLoading={setLoading}
        provider={provider}
        walletConnected={walletConnected}
      />

      <Minting
        loading={loading}
        walletConnected={walletConnected}
        setLoading={setLoading}
        provider={provider}
      />
    </div>
  );
};

export default App;
