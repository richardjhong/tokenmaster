"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);

  const loadBlockchainData = async () => {
    (window as any).ethereum.on("accountsChanged", async () => {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <header className='bg-gradient-banner from-indigo-900 via-blue-500 to-indigo-900 bg-contain bg-right bg-no-repeat bg-grey min-h-[25vh] relative'>
      <Navbar
        account={account}
        setAccount={setAccount}
      />
      <h2 className='absolute bottom-5 left-20 text-white text-2xl sm:text-5xl md:text-3xl font-light'>
        <strong>Event</strong> Tickets
      </h2>
    </header>
  );
};

export default Home;
