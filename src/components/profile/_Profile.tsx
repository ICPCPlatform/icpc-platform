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
import { useUserContext } from "@/providers/user";
import "@/styles/components/profile/profile-view.css";

const UserContext = React.createContext(
  {} as UserProfile<true> | UserProfile<false>,
);

export default function Profile<T extends boolean>({
  user,
  className,
}: {
  user: UserProfile<T>;
  className?: string;
}) {
  const userContent = userData(user);
  const [activeTab, setActiveTab] = useState<keyof typeof userContent>("cp");
  const allowEdit = useUserContext()?.username === user.username;

  return (
    <UserContext.Provider value={user}>
      <div className={`profile-wrapper ${className || ""}`}>
        <div className="profile-content">
          <Info />

          <div className="profile-tabs">
            <button
              className={`profile-tab ${
                activeTab === "cp" ? "profile-tab-active" : "profile-tab-inactive"
              }`}
              onClick={() => setActiveTab("cp")}
            >
              <FaCode className="inline-block mr-1.5" />
              <span>Competitive Programming</span>
            </button>
            <button
              className={`profile-tab ${
                activeTab === "academics" ? "profile-tab-active" : "profile-tab-inactive"
              }`}
              onClick={() => setActiveTab("academics")}
            >
              <FaGraduationCap className="inline-block mr-1.5" />
              <span>Academic</span>
            </button>
            <button
              className={`profile-tab ${
                activeTab === "socials" ? "profile-tab-active" : "profile-tab-inactive"
              }`}
              onClick={() => setActiveTab("socials")}
            >
              <FaLink className="inline-block mr-1.5" />
              <span>Social Links</span>
            </button>
            {allowEdit && (
              <Link className="profile-tab" href="/protected/edit-profile">
                <FaUserEdit className="inline-block mr-1.5" />
                <span>edit profile</span>
              </Link>
            )}
          </div>
        </div>

        <div className="profile-tab-content">
          <div className="profile-section">
            {userContent[activeTab].map((data, index) => {
              if (!data?.value) return null;
              return (
                <div key={index} className="profile-platform-card">
                  <div className="profile-platform">
                    <div className="profile-platform-icon">
                      {data.icon || <FaCode className="text-lg md:text-xl" />}
                    </div>
                    <div className="profile-platform-content">
                      <div className="profile-platform-label">{data.name}</div>
                      <div className="profile-platform-value">{data.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

function Info() {
  const user = useContext<UserProfile<true> | UserProfile<false>>(UserContext);
  return (
    <div className="profile-user-info">
      <div className="profile-photo-section">
        <div className="profile-photo">
          <Image
            src={user.imageUrl ?? "/window.svg"}
            alt={`${user.firstNameEn} ${user.lastNameEn}`}
            width={140}
            height={140}
            className="profile-photo-image"
            unoptimized
          />
        </div>
        <div className="profile-username">@{user.username}</div>
      </div>

      <div className="profile-info-section">
        <div className="profile-name">
          {`${user.firstNameEn ?? ""} ${user.lastNameEn ?? ""}`}
          {user.nameAR1 && (
            <div className="profile-name-ar">
              {`${user.nameAR1} ${user.nameAR2 ?? ""} ${user.nameAR3 ?? ""} ${user.nameAR4 ?? ""}`}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {user.country && (
            <div className="profile-location">
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

function userData(user: UserProfile<true> | UserProfile<false>): {
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
