import React from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useWeb3Auth } from "./Web3AuthProvider";
import styles from "./Home.module.css";
import { VStack, useDisclosure, Button, Text, HStack, Select, Input, Box, Flex, Tooltip } from "@chakra-ui/react";

const Main = () => {
  const {
    provider,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    web3Auth,
    chain
  } = useWeb3Auth();

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className={styles.card}>
        Get User Info
      </button>
      <button onClick={getAccounts} className={styles.card}>
        Get Accounts
      </button>
      <button onClick={getBalance} className={styles.card}>
        Get Balance
      </button>
      <button onClick={signMessage} className={styles.card}>
        Sign Message
      </button>
      {(web3Auth?.connectedAdapterName === WALLET_ADAPTERS.OPENLOGIN || chain === "solana") && (
        <button onClick={signTransaction} className={styles.card}>
          Sign Transaction
        </button>
      )}
      <button onClick={signAndSendTransaction} className={styles.card}>
        Sign and Send Transaction
      </button>
      <button onClick={logout} className={styles.card}>
        Log Out
      </button>

      <div className={styles.console} id="console">
        <p className={styles.code} />
      </div>
    </>
  );

  const unloggedInView = <Button onClick={login}>Login</Button>;

  return <div>{provider ? loggedInView : unloggedInView}</div>;
};

export default Main;
