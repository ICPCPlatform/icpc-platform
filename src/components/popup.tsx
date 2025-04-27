'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPopup() {
    const [showPopup, setShowPopup] = useState(true);
    const router = useRouter();

    const handleClose = () => {
        setShowPopup(false); // ✅ hide popup first

        // Then redirect after a short delay (optional but feels smooth)
        setTimeout(() => {
            router.push("/login");
        }, 300); // 300ms delay
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Protected Page</h1>

            {/* Show LoginPopup if needed */}
            <Logig visible={showPopup} onClose={handleClose} />
        </div>
    );
}

function Logig({
                   visible,
                   onClose,
               }: {
    visible: boolean;
    onClose: () => void;
}) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full">
                {/* Success Icon */}
                <svg
                    className="w-12 h-12 text-green-500 mx-auto mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>

                <p className="text-lg font-medium mb-4">Please log in to continue.</p>

                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Ok
                </button>
            </div>
        </div>
    );
}
