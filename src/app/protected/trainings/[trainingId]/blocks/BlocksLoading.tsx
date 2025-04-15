// components/TrainingBlocksLoading.tsx

import React from "react";

const TrainingBlocksLoading = (
        <div className="flex items-center justify-center h-screen flex-col space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Loading blocks...</p>
        </div>
    );

export default TrainingBlocksLoading;
