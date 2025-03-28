import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import { ethers } from "ethers";
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

  useEffect(() => {
    const savedDetails = localStorage.getItem("walletDetails");
    if (savedDetails) {
      setWalletDetails(JSON.parse(savedDetails));
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={[<NavBar connectWallet={connectWallet} disconnectWallet={disconnectWallet} walletDetails={walletDetails}/>, <LandingPage walletDetails={walletDetails} />]} />
        <Route path="/tasks" element={[<NavBar connectWallet={connectWallet} disconnectWallet={disconnectWallet} walletDetails={walletDetails} />, <Tasks walletDetails={walletDetails}/>]} />
      </Routes>
    </Router>
  );
}

export default App;
