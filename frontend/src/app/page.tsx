"use client";

import { ethers, providers } from "ethers";
import {
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  isAddressEqual,
} from "viem";
import { useState, useEffect } from "react";
import {
  NETWORK_CONFIG,
  NetworkOptions,
  NetworkOption,
  networkChain,
  NetworkName,
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
import { localhost, sepolia } from "wagmi/chains";

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
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [publicClient, setPublicClient] = useState<any | null>(null);
  const [walletClient, setWalletClient] = useState<any | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [tokenMasterContract, setTokenMasterContract] =
    useState<ethers.Contract | null>(null);
  const [contractOwnerConnected, setContractOwnerConnected] =
    useState<boolean>(false);
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [modalContent, setModalContent] = useState<modalOptions>(
    modalOptions.addEvent,
  );
  const [contractListenerAdded, setContractListenerAdded] =
    useState<boolean>(false);

  const mappedNetworkChain = (chainId: NetworkOption) => {
    switch (networkChain[chainId]) {
      case NetworkName.LOCALHOST:
        return localhost;
      case NetworkName.SEPOLIA:
        return sepolia;
      default:
        return;
    }
  };

  const loadBlockchainData = async () => {
    const provider = new providers.Web3Provider((window as any).ethereum);

    console.log("chain: ", (window as any).ethereum.chainId);

    const chainId2 = (window as any).ethereum.chainId as NetworkOption;

    const publicClient = createPublicClient({
      chain: mappedNetworkChain(chainId2),
      transport: custom((window as any).ethereum),
    });

    setPublicClient(publicClient);

    const walletClient = createWalletClient({
      chain: mappedNetworkChain(chainId2),
      transport: custom((window as any).ethereum),
    });

    setWalletClient(walletClient);

    const [address] = await walletClient.getAddresses();

    const wagmiContractConfig = {
      abi: TOKENMASTER_CONTRACT_ABI,
      address: NetworkOptions[networkChain[chainId2]] as `0x${string}`,
    };

    setProvider(provider);

    const { chainId } = await provider.getNetwork();

    const tokenMasterContract = new ethers.Contract(
      NETWORK_CONFIG[chainId.toString()].address,
      TOKENMASTER_CONTRACT_ABI,
      provider,
    );
    setTokenMasterContract(tokenMasterContract);

    const supply = (await publicClient.readContract({
      ...wagmiContractConfig,
      functionName: "totalOccasions",
    })) as bigint;

    const occasions: Occasion[] = [];

    for (let i = 1n; i <= Number(supply); i++) {
      const singleOccasion = await publicClient.readContract({
        ...wagmiContractConfig,
        functionName: "getOccasion",
        args: [i],
      });
      occasions.push(singleOccasion as Occasion);
    }

    setOccasions(occasions);

    (window as any).ethereum.on("accountsChanged", async () => {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = getAddress(accounts[0]);
      setAccount(account);
    });
  };

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
        return (
          <CreateEvent
            tokenMasterContract={tokenMasterContract!}
            provider={provider!}
          />
        );

      default:
        return;
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  useEffect(() => {
    if (tokenMasterContract && !contractListenerAdded) {
      tokenMasterContract.on("OccasionCreated", async (occasionId) => {
        const occasion: Occasion = await tokenMasterContract.getOccasion(
          occasionId,
        );
        setOccasions((prevOccasions) => [...prevOccasions, occasion]);
      });
      setContractListenerAdded(true);
    }
  }, [tokenMasterContract, contractListenerAdded]);

  useEffect(() => {
    const fetchContractOwner = async () => {
      if (publicClient && account !== null) {
        const chainId2 = (window as any).ethereum.chainId as NetworkOption;

        const wagmiContractConfig = {
          abi: TOKENMASTER_CONTRACT_ABI,
          address: NetworkOptions[networkChain[chainId2]] as `0x${string}`,
        };
        // const contractOwner = await tokenMasterContract.owner();
        const contractOwner = await publicClient.readContract({
          ...wagmiContractConfig,
          functionName: "owner",
        });

        isAddressEqual(contractOwner, account as `0x${string}`)
          ? setContractOwnerConnected(true)
          : setContractOwnerConnected(false);
      }
    };

    fetchContractOwner();
  }, [tokenMasterContract, account]);

  return (
    <>
      <header className='bg-gradient-banner from-indigo-900 via-blue-500 to-indigo-900 min-h-[25vh] relative'>
        <Navbar
          account={account}
          setAccount={setAccount}
        />
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
          contractOwnerConnected={contractOwnerConnected}
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
