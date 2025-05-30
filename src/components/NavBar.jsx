import React, { useState, useEffect } from 'react'
import walletconnectLogo from './walletconnectLogo.svg'
import coinbaseLogo from './icons8-coinbase.svg'
import { ethers } from "ethers";
import goldCoinABI from "../goldCoinABI.json";

import {
    Link
} from "react-router-dom";
export default function NavBar({ connectWallet, disconnectWallet, walletDetails, goldBalance, fetchGoldBalance, fetchEthBalance }) {
    const [toggle, setToggle] = useState(false)
    const [toggleMenu, setToggleMenu] = useState(false)
    const [toggleSidebar, setToggleSidebar] = useState(false)
    const goldTokenAddress = "0xd878E7C57Eb81a6182010672caA7C20bEDB7D847";
    const [ethToSpend, setEthToSpend] = useState();
    const [goldToSpend, setGoldToSpend] = useState();
    const [loading, setLoading] = useState(false);
    async function buyGold() {
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const goldToken = new ethers.Contract(goldTokenAddress, goldCoinABI, signer);
            console.log("--------------> ", ethers.parseEther(ethToSpend));

            const tx = await goldToken.buy({
                value: ethers.parseEther(ethToSpend),
            });
            await tx.wait();
            alert("✅ GOLD purchased!");
            await fetchGoldBalance();
            await fetchEthBalance();
        } catch (error) {
            console.error("Error buying GOLD:", error);
            alert("❌ Failed to buy GOLD");
        }
        setLoading(false);
    }
    async function sellGold() {
        if (goldToSpend < 100) {
            alert("Selling less than 100 GOLD is inefficient due to gas fees.");
            return;
        }
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const goldToken = new ethers.Contract(goldTokenAddress, goldCoinABI, signer);

            const sellInWei = ethers.parseUnits(goldToSpend, 18);

            const tx = await goldToken.sell(sellInWei);
            await tx.wait();

            alert("✅ GOLD sold for ETH");
            await fetchGoldBalance();
            await fetchEthBalance();
        } catch (err) {
            console.error("❌ Error selling GOLD:", err);
            alert("Failed to sell GOLD");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (walletDetails.account && typeof fetchGoldBalance === "function") {
            fetchGoldBalance();
        }
    }, [walletDetails.account]);



    return (
        <nav class="bg-gray-800">
            <div class="mx-auto px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center justify-between">
                    <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false" onClick={() => { setToggleMenu(!toggleMenu) }}>
                            <span class="absolute -inset-0.5"></span>
                            <span class="sr-only">Open main menu</span>
                            <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex flex-1 items-center justify-center sm:items-anchor-center sm:justify-start">
                        <div class="flex shrink-0 items-center">
                            <Link to='/'><img class="h-20 w-auto" src="https://img.icons8.com/?size=100&id=114415&format=png&color=000000" alt="Your Company" /></Link>
                            <span class="self-center text-(length:--my-text-size) font-semibold whitespace-nowrap dark:text-white">Task MarketPlace</span>
                        </div>
                        <div class="hidden sm:ml-6 sm:block">
                            <div class="flex space-x-4">
                                {walletDetails.account ? <Link to='/tasks' class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Explore Task</Link> : <button class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => { alert("Try to connect with MetaMask First!!") }}>Explore Task</button>}
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About Us</a>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div class="relative ml-3">
                            <div>
                                {walletDetails.account ?
                                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" data-drawer-target="drawer-right-example" data-drawer-show="drawer-right-example" onClick={() => { setToggleSidebar(true) }} data-drawer-placement="right" aria-controls="drawer-right-example">
                                        {walletDetails.account.substring(0, 6)}...{walletDetails.account.slice(-6)}
                                    </button>
                                    :
                                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true" onClick={() => { setToggle(!toggle) }}>Get started</button>
                                }


                            </div>
                            <div id="drawer-right-example" style={{ right: toggleSidebar ? "419px" : "0px", width: "26rem", padding: "0.2rem" }} class="fixed top-0 right-0 z-40 h-screen border-4  border-white rounded-l-lg p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label">
                                <div class="flex flex-1 items-center justify-center sm:items-anchor-center sm:justify-start">
                                    <div class="flex shrink-0 items-center">
                                        {walletDetails.account ?
                                            <h5 id="drawer-right-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                                                <img class="h-12 w-auto" src="https://img.icons8.com/?size=100&id=108639&format=png&color=000000" alt="Your Company" />
                                                {walletDetails.account.substring(0, 6)}...{walletDetails.account.slice(-6)}
                                            </h5>
                                            : "Connect to wallet"
                                        }
                                    </div>
                                    <button type="button" onClick={() => { setToggleSidebar(false) }} data-drawer-hide="drawer-right-example" aria-controls="drawer-right-example" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close menu</span>
                                    </button>
                                    <button type='button' onClick={disconnectWallet} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-12 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"><img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=91102&format=png&color=000000" alt="Your Company" /></button>

                                </div>

                                {walletDetails.account ?
                                    loading ? (
                                        <div class="text-center">
                                            <div role="status" style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}>
                                                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <p className='text-gray-400'>⏳ waiting for confirmation on-chain</p>
                                            </div>
                                        </div>

                                    ) :
                                        <div>

                                            <h1 className='dark:text-white text-2xl'><strong>Balance:</strong> {walletDetails.balance} ETH</h1>
                                            <h1 className='dark:text-yellow-500  text-2xl'><strong>Gold Balance:</strong> {Math.round(goldBalance * 100) / 100} GOLD</h1>
                                            <h1 className='dark:text-white text-2xl'><strong>Network:</strong> {walletDetails.network} <h5 className='text-sm'>(Chain ID: {walletDetails.chainId})</h5></h1>
                                            <div className="mt-2" style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "50px",
                                                marginBottom: "10px",
                                            }}>
                                                <input
                                                    type="number"
                                                    value={ethToSpend}
                                                    onChange={(e) => setEthToSpend(e.target.value)}
                                                    className="w-full rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white border border-gray-300"
                                                    placeholder="Etner ETH amount"
                                                />
                                                <button
                                                    onClick={buyGold}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                                                    style={{ width: "41%" }}
                                                >
                                                    Buy GOLD
                                                </button>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-200 dark:text-white flex items-center gap-2" style={{overflowWrap: "anywhere"}}>
                                                <span className="text-yellow-400">{ethToSpend ? ethToSpend : 1}&nbsp;ETH</span>
                                                <span className="text-gray-400">≙</span>
                                                <span>
                                                    {Intl.NumberFormat("en-US", {
                                                        maximumFractionDigits: 2,
                                                    }).format(ethToSpend ? ethToSpend*parseInt(walletDetails.Goldrate) : parseInt(walletDetails.Goldrate))}
                                                    &nbsp;<span className="text-yellow-500">GOLD</span>
                                                </span>
                                            </h2>
                                            <div className="mt-2" style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "50px",
                                                marginBottom: "10px",
                                            }}>
                                                <input
                                                    type="number"
                                                    value={goldToSpend}
                                                    onChange={(e) => setGoldToSpend(e.target.value)}
                                                    className="w-full rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white border border-gray-300"
                                                    placeholder="Etner Gold amount"
                                                />
                                                <button
                                                    onClick={sellGold}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                                                    style={{ width: "41%" }}
                                                >
                                                    Sell GOLD
                                                </button>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-200 dark:text-white flex items-center gap-2" style={{overflowWrap: "anywhere"}}>
                                                <span className="text-yellow-400">{goldToSpend ? goldToSpend : 1}&nbsp;GOLD</span>
                                                <span className="text-gray-400">≙</span>
                                                <span>
                                                    {Intl.NumberFormat("en-US", {
                                                        maximumFractionDigits: 18,
                                                    }).format(goldToSpend ? goldToSpend/parseInt(walletDetails.Goldrate) : 1.0 / parseInt(walletDetails.Goldrate))}
                                                    &nbsp;<span className="text-yellow-500">ETH</span>
                                                </span>
                                            </h2>

                                        </div>
                                    : (
                                        <button onClick={connectWallet}>Connect Wallet</button>
                                    )}

                            </div>

                            <div class="absolute right-0 dark:bg-gray-800 border z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1" style={{ display: walletDetails.account ? "none" : toggle ? "block" : "none" }}>
                                {/* <button class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0" onClick={connectWallet} >MetaMask</button> */}
                                <button type="button" onClick={connectWallet} class="text-gray-900 bg-white  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 ">
                                    <svg aria-hidden="true" class="w-6 h-5 me-2 -ms-1" viewBox="0 0 2405 2501" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1512_1323)"> <path d="M2278.79 1730.86L2133.62 2221.69L1848.64 2143.76L2278.79 1730.86Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M1848.64 2143.76L2123.51 1767.15L2278.79 1730.86L1848.64 2143.76Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M2065.2 1360.79L2278.79 1730.86L2123.51 1767.15L2065.2 1360.79ZM2065.2 1360.79L2202.64 1265.6L2278.79 1730.86L2065.2 1360.79Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1890.29 1081.17L2285.34 919.338L2265.7 1007.99L1890.29 1081.17ZM2253.21 1114.48L1890.29 1081.17L2265.7 1007.99L2253.21 1114.48Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M2253.21 1114.48L2202.64 1265.6L1890.29 1081.17L2253.21 1114.48ZM2332.34 956.82L2265.7 1007.99L2285.34 919.338L2332.34 956.82ZM2253.21 1114.48L2265.7 1007.99L2318.65 1052.01L2253.21 1114.48Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1542.24 2024.17L1641 2055.7L1848.64 2143.75L1542.24 2024.17Z" fill="#E2761B" stroke="#E2761B" stroke-width="5.94955" /> <path d="M2202.64 1265.6L2253.21 1114.48L2296.64 1147.8L2202.64 1265.6ZM2202.64 1265.6L1792.71 1130.55L1890.29 1081.17L2202.64 1265.6Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1987.86 617.696L1890.29 1081.17L1792.71 1130.55L1987.86 617.696Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M2285.34 919.338L1890.29 1081.17L1987.86 617.696L2285.34 919.338Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1987.86 617.696L2400.16 570.1L2285.34 919.338L1987.86 617.696Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M2202.64 1265.6L2065.2 1360.79L1792.71 1130.55L2202.64 1265.6Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M2382.31 236.33L2400.16 570.1L1987.86 617.696L2382.31 236.33Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M2382.31 236.33L1558.3 835.45L1547.59 429.095L2382.31 236.33Z" fill="#E2761B" stroke="#E2761B" stroke-width="5.94955" /> <path d="M934.789 380.309L1547.59 429.095L1558.3 835.449L934.789 380.309Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1792.71 1130.55L1558.3 835.449L1987.86 617.696L1792.71 1130.55Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1792.71 1130.55L2065.2 1360.79L1682.65 1403.04L1792.71 1130.55Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M1682.65 1403.04L1558.3 835.449L1792.71 1130.55L1682.65 1403.04Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M1987.86 617.696L1558.3 835.45L2382.31 236.33L1987.86 617.696Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M940.144 2134.24L1134.69 2337.11L869.939 2096.16L940.144 2134.24Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="5.94955" /> <path d="M1848.64 2143.75L1940.86 1793.33L2123.51 1767.15L1848.64 2143.75Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M151.234 1157.92L487.978 803.917L194.666 1115.67L151.234 1157.92Z" fill="#E2761B" stroke="#E2761B" stroke-width="5.94955" /> <path d="M2123.51 1767.15L1940.86 1793.33L2065.2 1360.79L2123.51 1767.15ZM1558.3 835.449L1230.48 824.74L934.789 380.309L1558.3 835.449Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M2065.2 1360.79L1940.86 1793.33L1930.74 1582.12L2065.2 1360.79Z" fill="#E4751F" stroke="#E4751F" stroke-width="5.94955" /> <path d="M1682.65 1403.04L2065.2 1360.79L1930.74 1582.12L1682.65 1403.04Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M1230.48 824.74L1558.3 835.449L1682.65 1403.04L1230.48 824.74Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1230.48 824.74L345.784 6.08252L934.79 380.309L1230.48 824.74ZM934.195 2258.58L165.513 2496.56L12.0146 1910.53L934.195 2258.58Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M265.465 1304.27L555.803 1076.41L799.14 1132.93L265.465 1304.27Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M799.139 1132.93L555.803 1076.41L686.098 538.567L799.139 1132.93Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M194.666 1115.67L555.803 1076.41L265.465 1304.27L194.666 1115.67Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1930.74 1582.12L1780.81 1506.56L1682.65 1403.04L1930.74 1582.12Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M194.666 1115.67L169.083 980.618L555.803 1076.41L194.666 1115.67Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1749.88 1676.72L1780.81 1506.56L1930.74 1582.12L1749.88 1676.72Z" fill="#233447" stroke="#233447" stroke-width="5.94955" /> <path d="M1940.86 1793.33L1749.88 1676.72L1930.74 1582.12L1940.86 1793.33Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M555.803 1076.41L169.082 980.618L137.55 866.982L555.803 1076.41ZM686.098 538.567L555.803 1076.41L137.55 866.982L686.098 538.567ZM686.098 538.567L1230.48 824.74L799.139 1132.93L686.098 538.567Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M799.14 1132.93L1230.48 824.74L1422.65 1411.96L799.14 1132.93ZM1422.65 1411.96L826.508 1399.47L799.14 1132.93L1422.65 1411.96Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M265.465 1304.27L799.14 1132.93L826.508 1399.47L265.465 1304.27ZM1682.65 1403.04L1422.65 1411.96L1230.48 824.74L1682.65 1403.04Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1780.81 1506.56L1749.88 1676.72L1682.65 1403.04L1780.81 1506.56Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M345.784 6.08252L1230.48 824.74L686.098 538.567L345.784 6.08252Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M12.0146 1910.53L758.088 1879.59L934.195 2258.58L12.0146 1910.53Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M934.194 2258.58L758.088 1879.59L1124.58 1861.75L934.194 2258.58Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M1749.88 1676.72L1940.86 1793.33L2046.16 2041.42L1749.88 1676.72ZM826.508 1399.47L12.0146 1910.53L265.465 1304.27L826.508 1399.47ZM758.088 1879.59L12.0146 1910.53L826.508 1399.47L758.088 1879.59ZM1682.65 1403.04L1731.43 1580.33L1495.83 1594.02L1682.65 1403.04ZM1495.83 1594.02L1422.65 1411.96L1682.65 1403.04L1495.83 1594.02Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1134.69 2337.11L934.194 2258.58L1631.48 2375.79L1134.69 2337.11Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="5.94955" /> <path d="M265.465 1304.27L151.234 1157.91L194.666 1115.67L265.465 1304.27Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1710.61 2288.92L1631.48 2375.79L934.194 2258.58L1710.61 2288.92Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-width="5.94955" /> <path d="M1748.09 2075.93L934.194 2258.58L1124.58 1861.75L1748.09 2075.93Z" fill="#E4761B" stroke="#E4761B" stroke-width="5.94955" /> <path d="M934.194 2258.58L1748.09 2075.93L1710.61 2288.92L934.194 2258.58Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-width="5.94955" /> <path d="M137.55 866.982L110.777 409.462L686.098 538.567L137.55 866.982ZM194.665 1115.67L115.536 1035.35L169.082 980.618L194.665 1115.67Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1289.38 1529.76L1422.65 1411.96L1403.61 1699.92L1289.38 1529.76Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M1422.65 1411.96L1289.38 1529.76L1095.43 1630.31L1422.65 1411.96Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M2046.16 2041.42L2009.87 2014.65L1749.88 1676.72L2046.16 2041.42Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1095.43 1630.31L826.508 1399.47L1422.65 1411.96L1095.43 1630.31Z" fill="#CD6116" stroke="#CD6116" stroke-width="5.94955" /> <path d="M1403.61 1699.92L1422.65 1411.96L1495.83 1594.02L1403.61 1699.92Z" fill="#E4751F" stroke="#E4751F" stroke-width="5.94955" /> <path d="M89.3589 912.199L137.55 866.982L169.083 980.618L89.3589 912.199Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1403.61 1699.92L1095.43 1630.31L1289.38 1529.76L1403.61 1699.92Z" fill="#233447" stroke="#233447" stroke-width="5.94955" /> <path d="M686.098 538.567L110.777 409.462L345.784 6.08252L686.098 538.567Z" fill="#763D16" stroke="#763D16" stroke-width="5.94955" /> <path d="M1631.48 2375.79L1664.2 2465.03L1134.69 2337.12L1631.48 2375.79Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="5.94955" /> <path d="M1124.58 1861.75L1095.43 1630.31L1403.61 1699.92L1124.58 1861.75Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M826.508 1399.47L1095.43 1630.31L1124.58 1861.75L826.508 1399.47Z" fill="#E4751F" stroke="#E4751F" stroke-width="5.94955" /> <path d="M1495.83 1594.02L1731.43 1580.33L2009.87 2014.65L1495.83 1594.02ZM826.508 1399.47L1124.58 1861.75L758.088 1879.59L826.508 1399.47Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1495.83 1594.02L1788.55 2039.64L1403.61 1699.92L1495.83 1594.02Z" fill="#E4751F" stroke="#E4751F" stroke-width="5.94955" /> <path d="M1403.61 1699.92L1788.55 2039.64L1748.09 2075.93L1403.61 1699.92Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M1748.09 2075.93L1124.58 1861.75L1403.61 1699.92L1748.09 2075.93ZM2009.87 2014.65L1788.55 2039.64L1495.83 1594.02L2009.87 2014.65Z" fill="#F6851B" stroke="#F6851B" stroke-width="5.94955" /> <path d="M2068.18 2224.07L1972.99 2415.05L1664.2 2465.03L2068.18 2224.07ZM1664.2 2465.03L1631.48 2375.79L1710.61 2288.92L1664.2 2465.03Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="5.94955" /> <path d="M1710.61 2288.92L1768.92 2265.72L1664.2 2465.03L1710.61 2288.92ZM1664.2 2465.03L1768.92 2265.72L2068.18 2224.07L1664.2 2465.03Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="5.94955" /> <path d="M2009.87 2014.65L2083.05 2059.27L1860.54 2086.04L2009.87 2014.65Z" fill="#161616" stroke="#161616" stroke-width="5.94955" /> <path d="M1860.54 2086.04L1788.55 2039.64L2009.87 2014.65L1860.54 2086.04ZM1834.96 2121.15L2105.66 2088.42L2068.18 2224.07L1834.96 2121.15Z" fill="#161616" stroke="#161616" stroke-width="5.94955" /> <path d="M2068.18 2224.07L1768.92 2265.72L1834.96 2121.15L2068.18 2224.07ZM1768.92 2265.72L1710.61 2288.92L1748.09 2075.93L1768.92 2265.72ZM1748.09 2075.93L1788.55 2039.64L1860.54 2086.04L1748.09 2075.93ZM2083.05 2059.27L2105.66 2088.42L1834.96 2121.15L2083.05 2059.27Z" fill="#161616" stroke="#161616" stroke-width="5.94955" /> <path d="M1834.96 2121.15L1860.54 2086.04L2083.05 2059.27L1834.96 2121.15ZM1748.09 2075.93L1834.96 2121.15L1768.92 2265.72L1748.09 2075.93Z" fill="#161616" stroke="#161616" stroke-width="5.94955" /> <path d="M1860.54 2086.04L1834.96 2121.15L1748.09 2075.93L1860.54 2086.04Z" fill="#161616" stroke="#161616" stroke-width="5.94955" /> </g> <defs> <clipPath id="clip0_1512_1323"> <rect width="2404" height="2500" fill="white" transform="translate(0.519043 0.132812)" /> </clipPath> </defs> </svg>
                                    Connect with MetaMask
                                </button>
                                <button type="button" class="text-gray-900 bg-white  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 " style={{
                                    width: "-webkit-fill-available",
                                    gap: "20px",
                                }}>
                                    <img class="w-6 h-5 me-2 -ms-1" src={walletconnectLogo} />
                                    WalletConnect</button>
                                <button type="button" class="text-gray-900 bg-white  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 " style={{
                                    width: "-webkit-fill-available",
                                    gap: "20px",
                                }}>
                                    <img class="w-6 h-7 me-2 -ms-1" src={coinbaseLogo} />
                                    Coinbase Wallet</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sm:hidden" id="mobile-menu" style={{ display: toggleMenu ? "block" : "none" }}>
                <div class="space-y-1 px-2 pt-2 pb-3">
                    {walletDetails ? <Link to='/tasks' class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Explore Task</Link> : <alert>Try to connect with MertaMask</alert>}
                    <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                    <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About Us</a>
                    {/* <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a> */}
                </div>
            </div>
        </nav>



    )
}
