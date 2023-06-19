"use client";

import { ethers, providers } from "ethers";
import { Address, isAddressEqual } from "viem";
import { useState, useEffect } from "react";
import {
  NetworkOptions,
  NetworkOption,
  networkChain,
  TOKENMASTER_CONTRACT_ABI,
} from "../../constants";
import {
  Card,
  Navbar,
  Sort,
  SeatChart,
  Modal,
  CreateEvent,
} from "./components";
import { modalOptions } from "@/utils/modalOptions";
import useLoadBlockchainData from "@/utils/useLoadBlockchainData";

export interface Occasion {
  id: bigint;
  name: string;
  cost: bigint;
  tickets: bigint;
  maxTickets: bigint;
  date: string;
  time: string;
  location: string;
}

const Home = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [tokenMasterContract, setTokenMasterContract] =
    useState<ethers.Contract | null>(null);
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [modalContent, setModalContent] = useState<modalOptions>(
    modalOptions.addEvent,
  );
  const [contractListenerAdded, setContractListenerAdded] =
    useState<boolean>(false);

  const { occasions, contractOwnerConnected } = useLoadBlockchainData();

  const fetchBalance = async () => {
    if (tokenMasterContract && provider) {
      const balance = await provider.getBalance(tokenMasterContract.address);
      const formattedBalance = ethers.utils.formatEther(balance);
      setContractBalance(formattedBalance);
    }
  };

  const displayModalContent = () => {
    switch (modalContent) {
      case modalOptions.viewSeats:
        return (
          <SeatChart
            occasion={occasion!}
            tokenMasterContract={tokenMasterContract!}
            provider={provider!}
            setToggle={setToggle}
            fetchBalance={fetchBalance}
          />
        );
      case modalOptions.addEvent:
        return <CreateEvent />;

      default:
        return;
    }
  };

  // useEffect(() => {
  //   if (tokenMasterContract && !contractListenerAdded) {
  //     tokenMasterContract.on("OccasionCreated", async (occasionId) => {
  //       const occasion: Occasion = await tokenMasterContract.getOccasion(
  //         occasionId,
  //       );
  //       setOccasions((prevOccasions) => [...prevOccasions, occasion]);
  //     });
  //     setContractListenerAdded(true);
  //   }
  // }, [tokenMasterContract, contractListenerAdded]);

  return (
    <>
      <header className='bg-gradient-banner from-indigo-900 via-blue-500 to-indigo-900 min-h-[25vh] relative'>
        <Navbar />
        <div className='absolute bottom-5 left-20 text-white text-2xl sm:text-5xl md:text-3xl font-light'>
          {contractOwnerConnected && (
            <h3>Contract Balance: {contractBalance} ETH</h3>
          )}
          <h2>
            <strong>Event</strong> Tickets
          </h2>
        </div>
      </header>

      <div className='items-center max-w-7xl h-75 mx-auto relative transition-all duration-250 ease'>
        <Sort
          setModalContent={setModalContent}
          toggle={toggle}
          setToggle={setToggle}
        />
      </div>

      <div className='items-center max-w-7xl h-75 mx-auto relative transition-all duration-250 ease'>
        {occasions.map((occasion, index) => (
          <Card
            key={occasion.id.toString()}
            id={index + 1}
            occasion={occasion}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            setModalContent={setModalContent}
          />
        ))}
      </div>

      <Modal
        isOpen={toggle}
        setToggle={setToggle}
        occasionName={occasion?.name || null}
        modalContent={modalContent}
      >
        {displayModalContent()}
      </Modal>
    </>
  );
};

export default Home;
