"use client";

import { useState, useEffect } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  isAddressEqual,
} from "viem";
import {
  NetworkOptions,
  NetworkOption,
  networkChain,
  TOKENMASTER_CONTRACT_ABI,
} from "../../constants";
import { localhost, sepolia } from "viem/chains";

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

type WalletClientType = ReturnType<typeof createWalletClient>
type PublicClientType = ReturnType<typeof createPublicClient>

const useLoadBlockchainData = () => {
  const [account, setAccount] = useState<Address>();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [contractOwnerConnected, setContractOwnerConnected] =
    useState<boolean>(false);
  const [publicClient, setPublicClient] = useState<PublicClientType>();
  const [walletClient, setWalletClient] = useState<WalletClientType>();

  const mappedChain = {
    "0x539": localhost,
    "0xaa36a7": sepolia,
  };

  const loadBlockchainData = async () => {
    const chainId = window.ethereum.chainId as NetworkOption;

    const wagmiContractConfig = {
      abi: TOKENMASTER_CONTRACT_ABI,
      address: NetworkOptions[networkChain[chainId]] as `0x${string}`,
    };

    const [connectedAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(connectedAccount);

    const publicClient = createPublicClient({
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    setPublicClient(publicClient);

    const walletClient = createWalletClient({
      account: connectedAccount,
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    setWalletClient(walletClient);

    const balance = await publicClient.getBalance({
      address: wagmiContractConfig.address,
    });

    console.log("balance: ", balance);

    const totalOccasions = (await publicClient.readContract({
      ...wagmiContractConfig,
      functionName: "totalOccasions",
    })) as bigint;

    const fetchedOccasions: Occasion[] = [];

    for (let i = 1n; i <= Number(totalOccasions); i++) {
      const singleOccasion = await publicClient.readContract({
        ...wagmiContractConfig,
        functionName: "getOccasion",
        args: [i],
      });
      fetchedOccasions.push(singleOccasion as Occasion);
    }

    setOccasions(fetchedOccasions);

    const contractOwner = (await publicClient.readContract({
      ...wagmiContractConfig,
      functionName: "owner",
    })) as Address;

    if (account) {
      isAddressEqual(contractOwner as `0x${string}`, account as `0x${string}`)
        ? setContractOwnerConnected(true)
        : setContractOwnerConnected(false);

      console.log("testing: ", contractOwnerConnected);
    }

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  return {
    account,
    setAccount,
    occasions,
    contractOwnerConnected,
    publicClient,
    walletClient,
  };
};

export default useLoadBlockchainData;
