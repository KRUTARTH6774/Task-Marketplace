import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import { ethers } from "ethers";
import goldCoinABI from "./goldCoinABI.json";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Tasks from './components/Tasks';

function App() {
  const [walletDetails, setWalletDetails] = useState({
    account: null,
    balance: null,
    network: null,
    chainId: null
  });
  const goldTokenAddress = "0xbC50a5e1f63d239f30B0C9Bf35cfD39697b9b9Ae";

  useEffect( () =>  {
    const fetchData = async (savedDetails) => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const newBalance = await provider.getBalance(address);
  
        setWalletDetails((prev) => ({
          ...prev,
          balance: ethers.formatEther(newBalance),
        }));
  
        const updated = {
          ...savedDetails,
          balance: ethers.formatEther(newBalance),
        };
  
        localStorage.setItem("walletDetails", JSON.stringify(updated));
        // setWalletDetails(JSON.parse(updated));
        setWalletDetails(updated);
      } catch (err) {
        console.error("Error fetching ETH balance:", err);
      }
    };
  
    // fetchData();
    const savedDetails = localStorage.getItem("walletDetails");
    if (savedDetails) {
      // fetchEthBalance();
      fetchData(JSON.parse(savedDetails));
      // setWalletDetails((prev) => ({
      //   ...prev,
      //   balance: ethers.formatEther(newBalance),
      // }));

      // Optional: update localStorage too if needed
      // const updated = {
      //   ...JSON.parse(savedDetails),
      //   balance: ethers.formatEther(walletDetails.b),
      // };

      // localStorage.setItem("walletDetails", JSON.stringify(updated));

      // setWalletDetails(JSON.stringify(savedDetails));
    }

    if (window.ethereum) {
      // Listen for Account Changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      // Listen for Network Changes
      window.ethereum.on("chainChanged", (chainId) => {
        setWalletDetails((prev) => ({ ...prev, chainId: parseInt(chainId, 16).toString() }));
        window.location.reload();
      });
    }
  }, []);
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        const checksumAddress = ethers.getAddress(accounts[0]);
        const userBalance = await provider.getBalance(checksumAddress);
        const networkInfo = await provider.getNetwork();

        const details = {
          account: checksumAddress,
          balance: ethers.formatEther(userBalance), // Convert Wei to ETH
          network: networkInfo.name,
          chainId: networkInfo.chainId.toString()
        };

        setWalletDetails(details);
        localStorage.setItem("walletDetails", JSON.stringify(details));
        await fetchGoldBalance();
      } catch (error) {
        console.error("User denied wallet connection", error);
      }
    } else {
      alert("Metamask not installed");
    }
  }
  function disconnectWallet() {
    setWalletDetails({
      account: null,
      balance: null,
      network: null,
      chainId: null
    });
    localStorage.removeItem("walletDetails");
    window.location.reload();
  }
  const [goldBalance, setGoldBalance] = useState("0");

  async function fetchEthBalance() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const newBalance = await provider.getBalance(address);

      setWalletDetails((prev) => ({
        ...prev,
        balance: ethers.formatEther(newBalance),
      }));

      // Optional: update localStorage too if needed
      const updated = {
        ...walletDetails,
        balance: ethers.formatEther(newBalance),
      };

      localStorage.setItem("walletDetails", JSON.stringify(updated));
    } catch (err) {
      console.error("Error fetching ETH balance:", err);
    }
  }

  async function fetchGoldBalance() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const goldToken = new ethers.Contract(goldTokenAddress, goldCoinABI, signer);
      const userAddress = await signer.getAddress();
      const raw = await goldToken.balanceOf(userAddress);
      setGoldBalance(ethers.formatUnits(raw, 18));
    } catch (err) {
      console.error("Error fetching GOLD balance:", err);
    }
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={[<NavBar connectWallet={connectWallet} disconnectWallet={disconnectWallet} walletDetails={walletDetails} goldBalance={goldBalance} fetchGoldBalance={fetchGoldBalance} fetchEthBalance={fetchEthBalance}/>, <LandingPage walletDetails={walletDetails} goldBalance={goldBalance} fetchGoldBalance={fetchGoldBalance} />]} />
        <Route path="/tasks" element={[<NavBar connectWallet={connectWallet} disconnectWallet={disconnectWallet} walletDetails={walletDetails} goldBalance={goldBalance} fetchGoldBalance={fetchGoldBalance} fetchEthBalance={fetchEthBalance} />, <Tasks walletDetails={walletDetails} fetchGoldBalance={fetchGoldBalance} goldBalance={goldBalance} fetchEthBalance={fetchEthBalance}/>]} />
      </Routes>
    </Router>
  );
}

export default App;
