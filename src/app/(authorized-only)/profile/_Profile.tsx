"use client";
import React, { useContext } from "react";
import { useState } from "react";
import Image from "next/image";
import { type User } from "./page";
import { FaGraduationCap, FaLink, FaCode, FaMapMarkerAlt, FaGithub, FaTwitter } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";

const UserContext = React.createContext({} as User);

export default function Profile({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState("cp");

  return (
    <UserContext.Provider value={user}>
      <div className={`profile-container bg-gray-50/50 dark:bg-gray-900/20 rounded-xl ${className || ""}`}>
        <div className="p-4 md:p-6">
        <Info />

          <div className="tabs flex flex-wrap md:flex-nowrap space-x-4 mt-6 border-b border-gray-200 dark:border-gray-700">
          <button
              className={`tab px-3 md:px-4 py-2 font-medium text-sm md:text-base ${
                activeTab === "cp"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            onClick={() => setActiveTab("cp")}
          >
            <FaCode className="inline-block mr-1.5" />
            <span>Competitive Programming</span>
          </button>
          <button
              className={`tab px-3 md:px-4 py-2 font-medium text-sm md:text-base ${
                activeTab === "academic"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            onClick={() => setActiveTab("academic")}
          >
            <FaGraduationCap className="inline-block mr-1.5" />
            <span>Academic</span>
          </button>
          <button
              className={`tab px-3 md:px-4 py-2 font-medium text-sm md:text-base ${
                activeTab === "socials"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            onClick={() => setActiveTab("socials")}
          >
            <FaLink className="inline-block mr-1.5" />
            <span>Social Links</span>
          </button>
          </div>
        </div>

        <div className="tab-content px-4 md:px-6 pt-4">
          <div className="mb-6 md:mb-8">
          {activeTab === "cp" && <CP />}
          {activeTab === "academic" && <Academic />}
          {activeTab === "socials" && <Socials />}
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

function Info() {
  const user = useContext(UserContext);
  return (
    <div className="user-info flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="photo-section flex md:block items-center gap-4 md:gap-0">
        <div className="photo-placeholder flex-shrink-0">
          <Image
            src={user.imageURL ?? "/window.svg"}
            alt={`${user.nameEnFirst} ${user.nameEnLast}`}
            width={140}
            height={140}
            className="object-cover rounded-lg w-24 h-24 md:w-[140px] md:h-[140px]"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE5OD5FREI/RUdGTEVMTUz/2wBDAR"
            unoptimized
          />
        </div>
        <div className="username mt-2 text-center font-medium text-gray-700 dark:text-gray-300 md:mt-2">@{user.username}</div>
      </div>
      <div className="info-section flex-1">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{`${user.nameEnFirst} ${user.nameEnLast}`}</h2>
          {user.nameAR1 && (
            <h3 className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-1 font-arabic">
              {`${user.nameAR1} ${user.nameAR2} ${user.nameAR3} ${user.nameAR4}`}
            </h3>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {user.country && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="truncate">{`${user.city}, ${user.country}`}</span>
            </div>
          )}
          {user.cfHandle && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <SiCodeforces className="mr-2 flex-shrink-0" />
              <span className="truncate">{user.cfHandle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CP() {
  const user = useContext(UserContext);
  const platforms = [
    { name: "Codeforces", handle: user.cfHandle, icon: <SiCodeforces className="text-xl" /> },
    { name: "Vjudge", handle: user.vjudge },
    { name: "AtCoder", handle: user.atcoder },
    { name: "CodeChef", handle: user.codechef, icon: <SiCodechef className="text-xl" /> },
    { name: "LeetCode", handle: user.leetcode, icon: <SiLeetcode className="text-xl" /> },
    { name: "SPOJ", handle: user.spoj },
    { name: "CSES", handle: user.cses },
    { name: "TopCoder", handle: user.topcoder },
    { name: "CS Academy", handle: user.csacademy },
  ];

  return (
    <div className="cp-section grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {platforms.map((platform, index) => {
        if (!platform.handle) return null;
        return (
          <div key={index} className="h-[72px]">
            <div className="platform group hover:shadow-md transition-all duration-200 flex items-center h-full space-x-4 px-4 md:px-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                {platform.icon || <FaCode className="text-lg md:text-xl" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{platform.name}</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                  {platform.handle}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Socials() {
  const user = useContext(UserContext);
  const socials = [
    { name: "LinkedIn", link: user.linkedIn, icon: <FaGithub className="text-xl" /> },
    { name: "Facebook", link: user.facebook, icon: <FaGithub className="text-xl" /> },
    { name: "Twitter", link: user.twitter, icon: <FaTwitter className="text-xl" /> },
    { name: "GitHub", link: user.github, icon: <FaGithub className="text-xl" /> },
  ];

  return (
    <div className="socials-section grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {socials.map((social, index) => {
        if (!social.link) return null;
        return (
          <div key={index} className="h-[72px]">
            <a
              href={social.link}
            target="_blank"
            rel="noopener noreferrer"
              className="platform group hover:shadow-md transition-all duration-200 flex items-center h-full space-x-4 px-4 md:px-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                {social.icon}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{social.name}</div>
                <div className="text-base font-semibold text-primary truncate group-hover:underline">
                  {social.link.replace(/^https?:\/\/(www\.)?/, '')}
                </div>
              </div>
          </a>
        </div>
        );
      })}
    </div>
  );
}

function Academic() {
  const user = useContext(UserContext);
  const academic = [
    { 
      label: "University", 
      value: user.university,
      icon: <FaGraduationCap className="text-xl" />
    },
    { 
      label: "Faculty", 
      value: user.faculty,
      icon: <FaGraduationCap className="text-xl" />
    },
    { 
      label: "Department", 
      value: user.department,
      icon: <FaGraduationCap className="text-xl" />
    },
    { 
      label: "Academic Year", 
      value: user.academicYear,
      icon: <FaGraduationCap className="text-xl" />
    },
    { 
      label: "Expected Graduation", 
      value: user.graduationYear ? new Date(user.graduationYear).getFullYear() : null,
      icon: <FaGraduationCap className="text-xl" />
    },
  ];

  return (
    <div className="academic-section grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {academic.map((item, index) => {
        if (!item.value) return null;
        return (
          <div key={index} className="h-[72px]">
            <div className="platform group hover:shadow-md transition-all duration-200 flex items-center h-full space-x-4 px-4 md:px-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {item.value}
                </div>
              </div>
            </div>
        </div>
        );
      })}
    </div>
  );
}
