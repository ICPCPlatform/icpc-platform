import React from "react";
import { FaUserFriends, FaRobot, FaChalkboardTeacher } from "react-icons/fa";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={`p-5 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm ${className || ""}`}
    >
      <div className="friends-section mb-8">
        <div className="section-header flex items-center gap-2.5 mb-5 text-lg font-medium text-gray-800 dark:text-gray-200">
          <FaUserFriends className="text-primary text-xl" />
          <span>Friends</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
          Friends feature coming soon!
        </div>
      </div>

      <div className="chatbot-section mb-8 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <FaRobot className="text-primary text-xl" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            AI Assistant
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 ml-2">
            • Online
          </span>
        </div>
      </div>

      <div className="mentors-section">
        <div className="section-header flex items-center gap-2.5 mb-5 text-lg font-medium text-gray-800 dark:text-gray-200">
          <FaChalkboardTeacher className="text-primary text-xl" />
          <span>Available Mentors</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
          Mentors feature coming soon!
        </div>
      </div>
    </aside>
  );
}
