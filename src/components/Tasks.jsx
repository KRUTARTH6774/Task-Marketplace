import React, { useState, useEffect } from 'react'
import TaskCard from './TaskCard';
import { ethers } from "ethers";
import contractABI from "../contractABI.json";
const contractAddress = "0x81D91ceC098A9C2a3dDe39f0a9FF341535C45E83";
// const tasks = [
//     { id: 1, title: "Build Landing Page", description: "Design and develop a modern, responsive React landing page with Tailwind CSS for our product launch.", reward: "0.05", deadline: "March 15, 2025", owner: "0x5B3C...EDD4", onClaim: (id) => console.log("Claim Task", id) },
//     { id: 2, title: "Write Smart Contract", description: "Develop a secure Ethereum smart contract for handling decentralized payments and escrow.", reward: "0.1", deadline: "March 20, 2025", owner: "0xAb8C...FE98", onClaim: (id) => console.log("Claim Task", id) },
//     { id: 3, title: "Fix UI Bugs", description: "Identify and fix layout inconsistencies and UI bugs in an existing React project.", reward: "0.02", deadline: "March 12, 2025", owner: "0x6D3F...A2C9", onClaim: (id) => console.log("Claim Task", id) },
//     { id: 4, title: "Fix UI Bugs", description: "Identify and fix layout inconsistencies and UI bugs in an existing React project.", reward: "0.02", deadline: "March 12, 2025", owner: "0x6D3F...A2C9", onClaim: (id) => console.log("Claim Task", id) }
// ];
export default function Tasks({ walletDetails }) {
    const [toggleDropdown, setToggleDropdown] = useState(false)
    const [searchbarValue, setSearchbarValue] = useState('')
    const [toggleCreatetask, setToggleCreatetask] = useState(false)
    const [taskID, setTaskID] = useState(0)
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    async function connectContract() {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = await provider.getSigner();
            return new ethers.Contract(contractAddress, contractABI, signer);
        }
    }
    async function createTask(title, description, reward, deadline, onSuccess = () => { }) {
        const contract = await connectContract();
        try {
            const tx = await contract.createTask(title, description, deadline, {
                value: reward // 👈 Send reward as ETH to contract
            });

            await tx.wait();
            console.log("Task created successfully!");
            onSuccess();
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    }
    useEffect(() => {
        fetchTasks();
    }, []);
    async function fetchTasks() {
        setLoading(true);
        const contract = await connectContract();
        try {
            const taskCount = await contract.taskCount();
            const taskArray = [];

            for (let i = 1; i <= Number(taskCount); i++) {
                const task = await contract.tasks(i);

                taskArray.push({
                    id: Number(task.id),
                    title: task.title,
                    description: task.description,
                    owner: task.owner,
                    worker: task.worker,
                    reward: ethers.formatEther(task.reward),
                    completed: task.completed,
                    claimed: task.claimed,
                    deadline: new Date(Number(task.deadline) * 1000).toLocaleString(),
                    onClaim: (id) => console.log("Claim Task", id)
                });
            }
            // const task = await contract.tasks(1);
            console.log("hello", taskArray);

            setTasks(taskArray);
            setFilteredTasks(taskArray);
        } catch (err) {
            console.error("❌ Error fetching tasks:", err);
        }
        setLoading(false);
    }
    useEffect(() => {
        setFilteredTasks(tasks);
        // console.log(filteredTasks);
    }, [taskID])
    useEffect(() => {
        setFilteredTasks(tasks.filter(task =>
            task.title.toLowerCase().includes(searchbarValue.toLowerCase()) ||
            task.description.toLowerCase().includes(searchbarValue.toLowerCase())
        ));
    }, [searchbarValue])
    useEffect(() => {
        setFilteredTasks(tasks.filter(task =>
            task.title.toLowerCase().includes(category.toLowerCase()) ||
            task.description.toLowerCase().includes(category.toLowerCase())
        ));
    }, [category])

    const [formData, setFormData] = useState({
        id: 5,
        title: '',
        description: '',
        file: null,
        reward: null,
        deadline: '',
        owner: walletDetails.account,
        onClaim: (id) => console.log("Claim Task", id)
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormData(prevData => ({
            ...prevData,
            ['id']: taskID
        }));
        console.log(formData);
        createTask(formData.title, formData.description, formData.reward, Math.floor(new Date(formData.deadline).getTime() / 1000), async () => {
            await fetchTasks(); // ✅ Fetch again only after confirmed
            // setToggleCreatetask(false); // Close modal
        });
        setLoading(true);
        // tasks.push(formData);
        // await fetchTasks();
        setTaskID(taskID + 1);
        setToggleCreatetask(false);
        // Add logic to send data to server or perform other actions
    };
    return (
        <>
            <div class="mx-auto" style={{
                minHeight: 'calc(100vh - 64px)',
                width: 'auto',
                backgroundColor: '#1f2937',
            }}>
                <div class="flex" style={{
                    paddingLeft: "10vw",
                    paddingRight: "10vw",
                    paddingTop: "22px",
                }}>
                    <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                    <button id="dropdown-button" onClick={() => { setToggleDropdown(!toggleDropdown) }} data-dropdown-toggle="dropdown" class="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">{category === '' ? "All categories" : category}<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                    </svg></button>

                    <div class="relative w-full">
                        <input type="search" id="search-dropdown" value={searchbarValue} onChange={(e) => { setSearchbarValue(e.target.value) }} class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." />
                        <button type="submit" class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span class="sr-only">Search</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-end items-center mt-4 -mb-4 w-[97vw]">
                    <button type='button' class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => { setToggleCreatetask(!toggleCreatetask) }}>Create Task +</button>
                </div>

                <div id="dropdown" style={{
                    marginLeft: "10vw",
                    marginTop: "-61px",
                    display: toggleDropdown ? "block" : "none"
                }} class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                    <ul onClick={() => { setToggleDropdown(false) }} class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                        <li>
                            <button type="button" onClick={() => { setCategory('') }} class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Clear Filter</button>
                        </li>
                        <li>
                            <button type="button" onClick={() => { setCategory('Blockchain') }} class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Blockchain</button>
                        </li>
                        <li>
                            <button type="button" onClick={() => { setCategory('React') }} class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">React</button>
                        </li>
                        <li>
                            <button type="button" onClick={() => { setCategory('Design') }} class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button>
                        </li>
                        <li>
                            <button type="button" onClick={() => { setCategory('App Development') }} class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">App Development</button>
                        </li>
                    </ul>
                </div>
                {loading ? (
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
                            <p className='text-gray-400'>⏳ Creating task... waiting for confirmation on-chain</p>
                        </div>
                    </div>

                ) :
                    <div className='pb-[3vw]'>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.slice().reverse().map(task => <TaskCard key={task.id} task={task} />)
                        ) : (
                            <p className="text-gray-500 col-span-full">No tasks found.</p>
                        )}
                    </div>
                }

            </div>
            <div id="default-modal" tabindex="-1" aria-hidden="true" class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style={{
                backdropFilter: "blur(2px)",
                display: toggleCreatetask ? "block" : "none"
            }}>
                <div class="relative p-4 w-full max-w-2xl max-h-ful m-auto top-[10vh]" >
                    <form class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700" onSubmit={handleSubmit}>

                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Create Task
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => { setToggleCreatetask(!toggleCreatetask) }}>
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div class="p-4 md:p-5 space-y-4" style={{
                            overflow: "auto",
                            height: "60vh"
                        }}>
                            <div>
                                <div class="grid gap-6 mb-6 md:grid-cols-2">
                                    <div>
                                        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                        <input type="text" id="first_name" name="title" value={formData.title} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="What kind of task..." required />
                                    </div>
                                </div>
                                <div class="mb-6">
                                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Description</label>
                                    <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                                            <label for="comment" class="sr-only">Your comment</label>
                                            <textarea id="comment" rows="4" name="description" value={formData.description} onChange={handleChange} class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Explain about this task..." required ></textarea>
                                        </div>
                                        <div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200">
                                            <div class="flex ps-0 p-0 items-center w-[70vw] space-x-1 rtl:space-x-reverse sm:ps-2">
                                                <label class="block mb-2 w-[20%] text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
                                                <input class="block w-full text-sm text-gray-900 border  border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" name="file" value={formData.file} onChange={handleChange} id="file_input" type="file" />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="mb-6">
                                    <label for="Reward" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reward</label>
                                    <div class="relative w-full">
                                        <input type="number" id="currency-input" name="reward" value={formData.reward} onChange={handleChange} class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Enter amount" required />
                                        <div class="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-6">
                                    <label for="Reward" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                                    <div class="relative max-w-sm">
                                        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                            </svg>
                                        </div>
                                        <input id="default-datepicker" type="date" name="deadline" value={formData.deadline} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
                                    </div>
                                </div>
                                {/* <div class="flex items-start mb-6">
                                    <div class="flex items-center h-5">
                                        <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                                    </div>
                                    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                                </div> */}
                            </div>

                        </div>
                        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button data-modal-hide="default-modal" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                            <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => { setToggleCreatetask(!toggleCreatetask) }}>Decline</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
