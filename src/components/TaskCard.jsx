import React, { useState, useEffect } from 'react'

export default function TaskCard({ key, task, claimTask, userId, completeTask, submitWork }) {
    const [expanded, setExpanded] = useState(false);
    const [contentType, setContentType] = useState('');
    const [textContent, setTextContent] = useState('');
    const [submitedcontentType, setSubmitedContentType] = useState('');
    const [submitedtextContent, setSubmitedTextContent] = useState('');
    const [fileOpen, setFileOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    useEffect(() => {
        if (!task.fileURL) return;
        // Fetch headers to get content-type
        fetch(task.fileURL, { method: 'HEAD' })
            .then(res => {
                const type = res.headers.get('content-type') || '';
                setContentType(type);
                // If it's text, fetch content body
                if (type.startsWith('text/')) {
                    fetch(task.fileURL)
                        .then(r => r.text())
                        .then(text => setTextContent(text))
                        .catch(() => { });
                }
            })
            .catch(() => { });
    }, [task.fileURL]);
    useEffect(() => {
        if (!task.submissionURL) return;
        // Fetch headers to get content-type
        fetch(task.submissionURL, { method: 'HEAD' })
            .then(res => {
                const type = res.headers.get('content-type') || '';
                setSubmitedContentType(type);
                // If it's text, fetch content body
                if (type.startsWith('text/')) {
                    fetch(task.submissionURL)
                        .then(r => r.text())
                        .then(text => setSubmitedTextContent(text))
                        .catch(() => { });
                }
            })
            .catch(() => { });
    }, [task.submissionURL]);

    // Render file preview based on type
    const renderPreview = () => {
        if (!task.fileURL) return null

        if (contentType === 'application/pdf') {
            return (
                <iframe
                    src={task.fileURL}
                    title="PDF Preview"
                    className="w-3/4 h-[700px] mt-2 border rounded mx-auto"
                />
            )
        }
        if (contentType.startsWith('text/')) {
            return (
                <pre className="bg-gray-100 text-gray-800 p-2 rounded overflow-auto max-h-96 mt-2">
                    {textContent}
                </pre>
            )
        }
        // fallback for any other type
        return (
            <video
                src={task.fileURL}
                controls
                className="w-3/4 h-96 mt-2 rounded mx-auto"
            />
        )
    }
    const renderSubmissionPreview = () => {
        if (!task.submissionURL) return null

        if (submitedcontentType === 'application/pdf') {
            return (
                <iframe
                    src={task.submissionURL}
                    title="PDF Preview"
                    className="w-3/4 h-[700px] mt-2 border rounded mx-auto"
                />
            )
        }
        if (submitedcontentType.startsWith('text/')) {
            return (
                <pre className="bg-gray-100 text-gray-800 p-2 rounded overflow-auto max-h-96 mt-2">
                    {submitedtextContent}
                </pre>
            )
        }
        // fallback for any other type
        return (
            <video
                src={task.submissionURL}
                controls
                className="w-3/4 h-96 mt-2 rounded mx-auto"
            />
        )
    }
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
                    <p><strong>Claimed By:</strong> {task.worker == 0x0000000000000000000000000000000000000000 ? 'None' : task.worker}</p>
                    {/* File toggle */}
                    {task.fileURL && task.worker == userId && (
                        <div>
                            <button
                                onClick={() => setFileOpen(!fileOpen)}
                                className="text-blue-400 underline text-sm"
                            >
                                {fileOpen ? 'Hide Attachment' : 'Show Attachment'}
                            </button>
                            {fileOpen && renderPreview()}
                        </div>
                    )}
                    {task.submissionURL && task.owner == userId && (
                        <div>
                            <button
                                onClick={() => setFileOpen(!fileOpen)}
                                className="text-blue-400 underline text-sm"
                            >
                                {fileOpen ? 'Hide Attachment' : 'Show Attachment'}
                            </button>
                            {fileOpen && renderSubmissionPreview()}
                        </div>
                    )}
                </div>

            )}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-white">Reward: <span className="font-bold text-yellow-600">{task.reward} Gold Coins</span></p>
                {userId === task.owner ?
                    task.claimed && !task.completed ? (
                        <button
                            onClick={() => completeTask(task.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                            Mark as Completed
                        </button>
                    ) :
                        task.completed ? (
                            <span className="bg-gray-700 text-white px-4 py-1 rounded">Task Completed</span>
                        ) :
                            <button
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                                onClick={() => claimTask(task.id)}
                            // disabled
                            >
                                Not Yet Claimed
                            </button>
                    :
                    task.worker == 0x0000000000000000000000000000000000000000 ?
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            onClick={() => claimTask(task.id)}
                        >
                            Claim Task
                        </button>
                        :
                        task.worker == userId ?
                            task.claimed && !task.completed ? (
                                task.submitted ?
                                    <>
                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                onChange={e => setUploadFile(e.target.files[0] || null)}
                                                className="mb-2"
                                            />
                                            <button
                                                disabled={!uploadFile}
                                                onClick={() => submitWork(task.id, uploadFile)}
                                                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                                            >
                                                Submit Again
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => completeTask(task.id)}
                                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-800 "
                                            disabled
                                        >
                                            Submited
                                        </button>
                                    </>
                                    :
                                    <>
                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                onChange={e => setUploadFile(e.target.files[0] || null)}
                                                className="mb-2"
                                            />
                                            <button
                                                disabled={!uploadFile}
                                                onClick={() => submitWork(task.id, uploadFile)}
                                                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                                            >
                                                Submit Work
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => completeTask(task.id)}
                                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-800 "
                                            disabled
                                        >
                                            You Claimed it
                                        </button>
                                    </>
                            ) :
                                task.completed ? (
                                    <span
                                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded"
                                    >
                                        Excellent work! You got {task.reward} Gold coin.
                                    </span>
                                ) :
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                        onClick={() => claimTask(task.id)}
                                        disabled
                                    >
                                        You Claimed This Task
                                    </button>
                            :
                            <span className="bg-gray-700 text-white px-4 py-1 rounded">
                                Task Claimed by Another User
                            </span>

                }

            </div>

        </div>
    )
}
