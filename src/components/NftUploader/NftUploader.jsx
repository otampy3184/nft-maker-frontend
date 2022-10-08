import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";

const NftUploader = () => {
  // Store of user's wallet account
  const [ currentAccount, setCurrentAccount ] = useState("");
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
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png"  />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png"/>
      </Button>
    </div>
  );
};

export default NftUploader;