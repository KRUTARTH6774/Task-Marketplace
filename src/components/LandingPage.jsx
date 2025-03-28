import React from 'react'

export default function LandingPage({ walletDetails }) {
    return (
        // <div style={{
        //     minHeight: 'calc(100vh - 64px)',
        //     display: 'flex',
        //     flexDirection: 'column',
        //     justifyContent: 'space-between',
        //     backgroundColor: '#1f2937',
        // }}>
        //     <div className="p-6 flex justify-center flex-col items-center">
        //         <h1 class="mb-6 text-5xl font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">{account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}</h1>
        //         <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Assign Tasks</h1>
        //         <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">oR Do Tasks & Earn</p>
        //         <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Cryptocurrency</p>
        //     </div>
            // <div className="p-6 text-center">
            //     {/* <div className="p-6 text-center">
            //         <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            //             Connect to Wallet
            //         </button>
            //     </div> */}
            //     <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            //         Learn More
            //     </button>
            // </div>
        // </div>
        <section class="bg-white dark:bg-gray-900" style={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#1f2937',
             }}>
            <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 class="mb-6 text-5xl font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">{walletDetails.account ? `Connected: ${walletDetails.account.substring(0, 6)}...` : "Connect Wallet"}</h1>
                <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Assign Tasks oR Do Tasks & Earn</h1>
                <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Cryptocurrency</p>
                <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                    <a href="#" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                        Get started
                        <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a>
                    <a href="#" class="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Learn more
                    </a>
                </div>
            </div>
        </section>
    )
}
