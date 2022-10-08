import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import { ethers } from "ethers";
import Web3Mint from "../../utils/Web3Mint.json";
import { Web3Storage } from 'web3.storage'

const NftUploader = () => {
  // Store of user's wallet account
  const [ currentAccount, setCurrentAccount ] = useState("");

  //const API_KEY = process.env.WEB3STORAGE_API_KEY;
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ"

  console.log("currentAccount:", currentAccount);

  const checkWalletIsConnected = async() => {
    // Metamsk wallet check
    const { ethereum } = window;
    if (!window) {
      console.log("Make sure you hava Metamask");
      return;
    } else {
      console.log("Connected ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts"});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    }else {
      console.log("No authorized account are founded");
    }
  };

  const connectWallet = async() => {
    try {
      const { ethereum } = window;
      if(!window) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (error){
      console.log(error);
    }
  }

  const askContractToMintNFT = async(ipfs) => {
    const CONTRACT_ADDRESS = "0xD6DEf2805C4D6f36C6129ea55A3Cbde0B82a0d0e";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas");
        // 非同期にMint処理を実行
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Minting now....");
        // 非同期にMint結果のTransactionを取得
        await nftTxn.wait();
        console.log(`Mint completed, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error){
      console.log(error);
    }
  }

  const imageToNFT = async(e) => {
    const client = new Web3Storage({ token: API_KEY})
    const image = e.target
    console.log(image);

    const rootCid = await client.put(image.files, {
      name: 'experiment',
      maxRetries: 3
    })

    const res = await client.get(rootCid)
    const files = await res.files()
    for (const file of files) {
      console.log("file.cid:",file.cid)
      askContractToMintNFT(file.cid)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT}/>
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </Button>
    </div>
  );
};

export default NftUploader;