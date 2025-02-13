"use client";
import React, { useContext } from "react";
import { useState } from "react";
import Image from "next/image";
import { type User } from "./page";
import { FaUser, FaGraduationCap, FaLink, FaCode } from "react-icons/fa";
import { SiCodeforces, SiLeetcode, SiCodechef } from "react-icons/si";

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
      <div className={`profile-container ${className || ""}`}>
        <Info />

        <div className="tabs">
          <button
            className={`tab ${activeTab === "cp" ? "active" : ""}`}
            onClick={() => setActiveTab("cp")}
          >
            <FaCode className="inline-block mr-1.5" />
            <span>Competitive Programming</span>
          </button>
          <button
            className={`tab ${activeTab === "academic" ? "active" : ""}`}
            onClick={() => setActiveTab("academic")}
          >
            <FaGraduationCap className="inline-block mr-1.5" />
            <span>Academic</span>
          </button>
          <button
            className={`tab ${activeTab === "socials" ? "active" : ""}`}
            onClick={() => setActiveTab("socials")}
          >
            <FaLink className="inline-block mr-1.5" />
            <span>Social Links</span>
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "cp" && <CP />}
          {activeTab === "academic" && <Academic />}
          {activeTab === "socials" && <Socials />}
        </div>
      </div>
    </UserContext.Provider>
  );
}

function Info() {
  const user = useContext(UserContext);
  return (
    <div className="user-info">
      <div className="info-section">
        <div className="section-header">
          <FaUser />
          <h2 className="text-lg font-medium">{user.nameEnFirst}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4"></div>
      </div>
      <div className="photo-section">
        <div className="photo-placeholder">
          <Image
            src={user.imageURL ?? "/window.svg"}
            alt={user.nameEnFirst ?? ""}
            width={140}
            height={140}
            className="object-cover rounded-lg"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE5OD5FREI/RUdGTEVMTUz/2wBDAR"
            unoptimized
          />
        </div>
        <div className="username">@{user.nameEnFirst ?? ""}</div>
      </div>
    </div>
  );
}

function CP() {
  const user = useContext(UserContext);
  const platforms = [
    { name: "Vjudge", handle: user.vjudge },
    { name: "AtCoder", handle: user.atcoder },
    { name: "CodeChef", handle: user.codechef, icon: <SiCodechef /> },
    { name: "LeetCode", handle: user.leetcode, icon: <SiLeetcode /> },
  ];

  return (
    <div className="cp-section">
      {platforms.map((platform, index) => {
        if (platform.handle) return null;
        else
          <div key={index} className="platform">
            {platform.icon && (
              <span className="platform-icon">{platform.icon}</span>
            )}
            <span className="platform-name">{platform.name}</span>
            <span className="platform-handle">{platform.handle}</span>
          </div>;
      })}
    </div>
  );
}

function Socials() {
  const user = useContext(UserContext);
  const socials = [
    { name: "LinkedIn", link: user.linkedIn },
    { name: "Facebook", link: user.facebook },
  ];

  return (
    <div className="socials-section">
      {socials.map((social, index) => (
        <div key={index} className="platform">
          <span className="platform-name">{social.name}</span>
          <a
            href={social.link ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {social.link}
          </a>
        </div>
      ))}
    </div>
  );
}

function Academic() {
  const user = useContext(UserContext);
  const academic = [
    { label: "Institute", value: user.university },
    { label: "Graduation Year", value: user.graduationYear },
  ];

  return (
    <div className="academic-section">
      {academic.map((item, index) => (
        <div key={index} className="platform">
          <span className="platform-name">{item.label}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
