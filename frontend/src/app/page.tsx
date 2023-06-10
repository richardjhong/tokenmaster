"use client";

import { ethers, providers, BigNumber } from "ethers";
import { useState, useEffect } from "react";
import { NETWORK_CONFIG, TOKENMASTER_CONTRACT_ABI } from "../../constants";
import { Card, Navbar, Sort } from "./components";

export interface Occasion {
  id: BigNumber;
  name: string;
  cost: BigNumber;
  tickets: BigNumber;
  maxTickets: BigNumber;
  date: string;
  time: string;
  location: string;
}

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  const loadBlockchainData = async () => {
    const provider = new providers.Web3Provider((window as any).ethereum);
    setProvider(provider);

    const { chainId } = await provider.getNetwork();
    console.log("chainId: ", chainId);

    const tokenMasterContract = new ethers.Contract(
      NETWORK_CONFIG[chainId.toString()].address,
      TOKENMASTER_CONTRACT_ABI,
      provider,
    );

    const totalOccasions = await tokenMasterContract.totalOccasions();
    const occasions: Occasion[] = [];

    for (let i = 1; i <= totalOccasions; i++) {
      const singleOccasion = await tokenMasterContract.getOccasion(i);
      occasions.push(singleOccasion);
    }

    setOccasions(occasions);

    console.log("occasions: ", occasions);

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
    <>
      <header className='bg-gradient-banner from-indigo-900 via-blue-500 to-indigo-900 min-h-[25vh] relative'>
        <Navbar
          account={account}
          setAccount={setAccount}
        />
        <h2 className='absolute bottom-5 left-20 text-white text-2xl sm:text-5xl md:text-3xl font-light'>
          <strong>Event</strong> Tickets
        </h2>
      </header>

      <Sort />

      <div className='items-center w-65 max-w-550 h-75 mx-auto relative transition-all duration-250 ease'>
        {occasions.map((occasion, index) => (
          <Card
            key={occasion.id.toString()}
            id={index + 1}
            occasion={occasion}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
