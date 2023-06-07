"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    console.log("accounts", accounts);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>Hello world</h1>
      <p>{account}</p>
    </div>
  );
};

export default Home;
