import React from "react";
import { useState } from "react";
import { Web3AuthProvider } from "./Web3AuthProvider";
import Setting from "./Web3AuthSetting";
import Main from "./Web3AuthMain";
import styles from "./Home.module.css";

function Web3AuthComponent() {
  const [web3AuthNetwork, setWeb3AuthNetwork] = useState("mainnet");
  const [chain, setChain] = useState("mainnet");

  return (
    <div className={styles.container}>
      <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
        <Main />
        <Setting setNetwork={setWeb3AuthNetwork} setChain={setChain} />
      </Web3AuthProvider>
    </div>
  );
}

export default Web3AuthComponent;
