"use client";
import React, { JSX, useContext } from "react";
import { useState } from "react";
import Image from "next/image";
import { type UserProfile } from "@/lib/types/userProfileType";
import {
  FaGraduationCap,
  FaLink,
  FaCode,
  FaMapMarkerAlt,
  FaGithub,
  FaTwitter,
  FaUserEdit,
  FaTelegram,
  FaFacebook,
  FaLinkedin,
  FaUniversity,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import Link from "next/link";

const activeButtonStyle = "text-primary border-b-2 border-primary";
const unactiveButtonStyle =
  "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300";
const tabStyle = "tab px-3 md:px-4 py-2 font-medium text-sm md:text-base";

const UserContext = React.createContext(
  {} as UserProfile<true> | UserProfile<false>,
);

export default function Profile<T extends boolean>({
  user,
  className,
  allowEdit = false,
}: {
  user: UserProfile<T>;
  className?: string;
  allowEdit: boolean;
}) {
  const userContent = userData(user);
  const [activeTab, setActiveTab] = useState<keyof typeof userContent>("cp");

  return (
    <UserContext.Provider value={user}>
      <div
        className={`profile-container bg-gray-50/50 dark:bg-gray-900/20 rounded-xl ${className || ""}`}
      >
        <div className="p-4 md:p-6">
          <Info />

          <div className="tabs flex flex-wrap md:flex-nowrap space-x-4 mt-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`${
                tabStyle +
                (activeTab === "cp" ? activeButtonStyle : unactiveButtonStyle)
              }`}
              onClick={() => setActiveTab("cp")}
            >
              <FaCode className="inline-block mr-1.5" />
              <span>Competitive Programming</span>
            </button>
            <button
              className={`${
                tabStyle +
                (activeTab === "academics"
                  ? activeButtonStyle
                  : unactiveButtonStyle)
              }`}
              onClick={() => setActiveTab("academics")}
            >
              <FaGraduationCap className="inline-block mr-1.5" />
              <span>Academic</span>
            </button>
            <button
              className={`${
                tabStyle +
                (activeTab === "socials"
                  ? activeButtonStyle
                  : unactiveButtonStyle)
              }`}
              onClick={() => setActiveTab("socials")}
            >
              <FaLink className="inline-block mr-1.5" />
              <span>Social Links</span>
            </button>
            {allowEdit && (
              <Link className={tabStyle} href="/edit-profile">
                <FaUserEdit className="inline-block mr-1.5" />
                <span>edit profile</span>
              </Link>
            )}
          </div>
        </div>

        <div className="tab-content px-4 md:px-6 pt-4">
          <div className="mb-6 md:mb-8">
            <div className="profile-section grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {userContent[activeTab].map((data, index) => {
                if (!data?.value) return null;
                return (
                  <div key={index} className="h-[72px]">
                    <div className="platform group hover:shadow-md transition-all duration-200 flex items-center h-full space-x-4 px-4 md:px-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                        {data.icon || <FaCode className="text-lg md:text-xl" />}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center py-3">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {data.name}
                        </div>
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                          {data.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

function Info() {
  const user = useContext<User>(UserContext);
  return (
    <div className="user-info flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="photo-section flex md:block items-center gap-4 md:gap-0">
        <div className="photo-placeholder flex-shrink-0">
          <Image
            src={user.imageUrl ?? "/window.svg"}
            alt={`${user.firstNameEn} ${user.lastNameEn}`}
            width={140}
            height={140}
            className="object-cover rounded-lg w-24 h-24 md:w-[140px] md:h-[140px]"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE5OD5FREI/RUdGTEVMTUz/2wBDAR"
            unoptimized
          />
        </div>
        <div className="username mt-2 text-center font-medium text-gray-700 dark:text-gray-300 md:mt-2">
          @{user.username}
        </div>
      </div>
      <div className="info-section flex-1">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{`${user.firstNameEn ?? ""} ${user.lastNameEn ?? ""}`}</h2>
          {user.nameAR1 && (
            <h3 className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-1 font-arabic">
              {`${user.nameAR1} ${user.nameAR2 ?? ""} ${user.nameAR3 ?? ""} ${user.nameAR4 ?? ""}`}
            </h3>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {user.country && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="truncate">{`${user.city ?? ""}, ${user.country ?? ""}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
type EntryType = {
  name: string;
  value: string | number | null;
  icon: JSX.Element;
};

function userData(user: User): {
  socials: EntryType[];
  academics: EntryType[];
  cp: EntryType[];
} {
  return {
    socials: [
      {
        name: "LinkedIn",
        value: user.linkedIn,
        icon: <FaLinkedin className="text-xl" />,
      },
      {
        name: "Facebook",
        value: user.facebook,
        icon: <FaFacebook className="text-xl" />,
      },
      {
        name: "Twitter",
        value: user.twitter,
        icon: <FaTwitter className="text-xl" />,
      },
      {
        name: "GitHub",
        value: user.github,
        icon: <FaGithub className="text-xl" />,
      },
      {
        name: "Telegram",
        value: user.telegram,
        icon: <FaTelegram className="text-xl" />,
      },
    ],
    academics: [
      {
        name: "Institute",
        value: user.institute,
        icon: <FaUniversity className="text-xl" />,
      },
      {
        name: "Faculty",
        value: user.faculty,
        icon: <FaGraduationCap className="text-xl" />,
      },
      {
        name: "Department",
        value: user.department,
        icon: <FaGraduationCap className="text-xl" />,
      },
      {
        name: "Academic Year",
        value: user.academicYear,
        icon: <FaGraduationCap className="text-xl" />,
      },
      {
        name: "Expected Graduation",
        value: user.graduationDate
          ? new Date(user.graduationDate).getFullYear()
          : null,
        icon: <FaGraduationCap className="text-xl" />,
      },
    ],

    cp: [
      {
        name: "Codeforces",
        value: user.codeforces,
        icon: <SiCodeforces className="text-xl" />,
      },
      {
        name: "Vjudge",
        value: user.vjudge,
        icon: <FaCode className="text-xl" />,
      },
      {
        name: "AtCoder",
        value: user.atcoder,
        icon: <FaCode className="text-xl" />,
      },
      {
        name: "CodeChef",
        value: user.codechef,
        icon: <SiCodechef className="text-xl" />,
      },
      {
        name: "LeetCode",
        value: user.leetcode,
        icon: <SiLeetcode className="text-xl" />,
      },
    ],
  };
}
