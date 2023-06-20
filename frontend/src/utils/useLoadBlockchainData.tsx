"use client";

import { useState, useEffect } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  isAddressEqual,
  Log,
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

type LogWithArg = Log & { args: { latestOccasionIndex: bigint } };

export type WalletClientType = ReturnType<typeof createWalletClient>;
export type PublicClientType = ReturnType<typeof createPublicClient>;

const useLoadBlockchainData = () => {
  const [account, setAccount] = useState<Address | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [contractOwnerConnected, setContractOwnerConnected] =
    useState<boolean>(false);
  const [publicClient, setPublicClient] = useState<PublicClientType>();
  const [walletClient, setWalletClient] = useState<WalletClientType>();
  const [contractListenerAdded, setContractListenerAdded] =
    useState<boolean>(false);
  const [wagmiContractConfig, setwagmiContractConfig] = useState<any>({});

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

    setwagmiContractConfig({
      ...wagmiContractConfig,
    });

    const publicClient = createPublicClient({
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    setPublicClient(publicClient);

    if (account) {
      const walletClient = createWalletClient({
        account: account !== null ? account : undefined,
        chain: mappedChain[chainId],
        transport: custom(window.ethereum),
      });
      setWalletClient(walletClient);
    }

    const balance = await publicClient.getBalance({
      address: wagmiContractConfig.address,
    });

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

  useEffect(() => {
    if (publicClient && !contractListenerAdded) {
      publicClient.watchContractEvent({
        ...wagmiContractConfig,
        eventName: "OccasionCreated",
        onLogs: async (logs) => {
          const emittedLog = logs[0] as LogWithArg;
          const occasion: Occasion = (await publicClient.readContract({
            ...wagmiContractConfig,
            functionName: "getOccasion",
            args: [emittedLog.args.latestOccasionIndex],
          })) as Occasion;
          setOccasions((prevOccasions) => [...prevOccasions, occasion]);
        },
      });

      setContractListenerAdded(true);
    }
  }, [publicClient, wagmiContractConfig, contractListenerAdded]);

  return {
    account,
    setAccount,
    occasions,
    contractOwnerConnected,
    publicClient,
    walletClient,
    address: wagmiContractConfig?.address,
  };
};

export default useLoadBlockchainData;
