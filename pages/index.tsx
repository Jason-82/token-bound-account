import type { NextPage } from "next";
import styles from "../styles/Main.module.css";
import NFTGrid from "../components/NFT/NFTGrid";
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { nftDropAddress } from "../const/constants";
import Container from "../components/Container/Container";
import toast from "react-hot-toast";
import toastStyle from "../util/toastConfig";
import useSWR from 'swr';


type NFTData = {
  imageUrl: string;
  name: string;
  description: string;
  tokenBoundAddress: string;
  tokenBoundNFTs: Array<{ imageUrl: string; name: string; }>;
};





const fetchNFTData = async (tokenId: number) => {
  const url = `https://7qtmb25wrg.execute-api.us-west-2.amazonaws.com/prod/work-nfts/a-lifes-journey/metadata/${tokenId}.json`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch NFT for tokenId: ${tokenId}`);
  }

  return response.json();
};

const fetchAllNFTs = async () => {
  const tokenIds = [1, 2, 3, 4];
  
  const allNFTs = await Promise.all(tokenIds.map(fetchNFTData));

  const allTokenBoundNFTs = await Promise.all(tokenIds.map(() => fetchTokenBoundNFTData(1)));

  allNFTs.forEach((nft, index) => {
    nft.tokenBoundNFTs = allTokenBoundNFTs[index];
  });

  return allNFTs;
};

const fetchTokenBoundNFTData = async (tokenId: number) => {
  // This example uses a different endpoint and always fetches tokenId '1' for tokenBoundNFTs.
  const url = `https://7qtmb25wrg.execute-api.us-west-2.amazonaws.com/prod/work-nfts/badges/metadata/${tokenId}.json`; 

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch TokenBound NFT for tokenId: ${tokenId}`);
  }

  return response.json();
};

const Home: NextPage = () => {
  const { data: nfts, error } = useSWR('/api/fetchNFTs', fetchAllNFTs);

  if (error) {
    return <div>Failed to load NFTs.</div>
  }

  if (!nfts) {
    return <div>Loading...</div>
  }

  const journeyNFTs: NFTData[] = nfts.map(nft => ({
    tokenId: nft.tokenId,
    imageUrl: nft.image,
    name: nft.name,
    description: nft.description,
    tokenBoundAddress: nft.tokenBoundAddress || "",  // Use default if not provided
    tokenBoundNFTs: Array.isArray(nft.tokenBoundNFTs) ? 
      nft.tokenBoundNFTs.map(tbNft => ({
        imageUrl: tbNft.image,
        name: tbNft.image_name
      })) : nft.tokenBoundNFTs ? [{
        imageUrl: nft.tokenBoundNFTs.image,
        name: nft.tokenBoundNFTs.image_name
      }] : []
  }));

  console.log(`JourneyNFTs: ${JSON.stringify(journeyNFTs)}`);
  console.log(`\n${journeyNFTs.map((nft, index) => (
    nft.tokenBoundAddress,
  ))}`);


  return (
    <Container maxWidth="lg">
      <div className={styles.container}>
        <h1 className={styles.title}>Your Journey NFTs</h1>

        <div className={styles.nftWrapper}>
          {journeyNFTs.map((nft, index) => (
            <div key={index} className={styles.nftContainer}>
              <img src={nft.imageUrl} alt={nft.name} className={styles.nftImage} />
              <h2>{nft.name}</h2>
              <h3>Token Bound Address: {nft.tokenBoundAddress}</h3>
              <h3>Bound NFTs:</h3>
              <div className={styles.boundNFTs}>
                {nft.tokenBoundNFTs.map((boundNft, idx) => (
                  <div key={idx} className={styles.boundNftContainer}>
                    <img src={boundNft.imageUrl} alt={boundNft.name} className={styles.boundNftImage} />
                    <h4>{boundNft.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
);
};

export default Home;