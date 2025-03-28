import React, { useState } from 'react'

export default function TaskCard({ key, task }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="bg-white shadow-lg rounded-lg p-5 w-95vw md:w-80 border border-gray-200" style={{
            width: "95vw",
            margin: "auto",
            marginTop: "30px",
            backgroundColor: "rgb(247 232 152 / 0%)"
        }}>
            <h3 className="text-lg font-semibold text-white">{task.title}</h3>

            {/* Short Description */}
            <p className="text-white text-sm">
                {expanded ? task.description : task.description.substring(0, 50) + "..."}
            </p>

            {/* Expand Button */}
            <button
                className="text-blue-500 text-sm mt-2 hover:underline focus:outline-none"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Show Less ▲" : "Show More ▼"}
            </button>

            {/* Task Details (Only Visible When Expanded) */}
            {expanded && (
                <div className="mt-3 text-white text-sm">
                    <p><strong>Deadline:</strong> {task.deadline}</p>
                    <p><strong>Owner:</strong> {task.owner}</p>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-white">Reward: <span className="font-bold text-yellow-600">{task.reward} Gold Coins</span></p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => task.onClaim(task.id)}
                >
                    Claim
                </button>
            </div>
        </div>
    )
}
