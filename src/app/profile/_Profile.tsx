"use client";
import React, { useContext } from "react";
import { useState } from "react";
import { type User } from "./page";
import { FaUser, FaGraduationCap, FaLink, FaCode } from 'react-icons/fa';
import { SiCodeforces, SiLeetcode, SiCodechef } from 'react-icons/si';

const UserContext = React.createContext({} as User);

export default function Profile({ user, className }: { user: User, className?: string }) {
  const [activeTab, setActiveTab] = useState("cp");

  return (
    <UserContext.Provider value={user}>
      <div className={`profile-container ${className || ''}`}>
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
          <h2 className="text-lg font-medium">{user.name}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span>Birthdate:</span>
            <span className="info-value">{user.birthdate}</span>
          </div>
          <div>
            <span>Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div>
            <span>Location:</span>
            <span className="info-value">{user.location}</span>
          </div>
          <div>
            <span>Last Online:</span>
            <span className="info-value">{user.lastOnline}</span>
          </div>
        </div>
      </div>
      <div className="photo-section">
        <div className="photo-placeholder">
          <img 
            src={user.photopath} 
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/140?text=Profile"
            }}
          />
        </div>
        <div className="username">@{user.username}</div>
      </div>
    </div>
  );
}

function CP() {
  const user = useContext(UserContext);
  const platforms = [
    { name: "Codeforces", handle: user.codeforcesHandle, icon: <SiCodeforces /> },
    { name: "Vjudge", handle: user.vjudgeHandle },
    { name: "AtCoder", handle: user.atcoderHandle },
    { name: "CodeChef", handle: user.codechefHandle, icon: <SiCodechef /> },
    { name: "LeetCode", handle: user.leetCodeHandle, icon: <SiLeetcode /> },
  ];

  return (
    <div className="cp-section">
      {platforms.map((platform, index) => (
        <div key={index} className="platform">
          {platform.icon && <span className="platform-icon">{platform.icon}</span>}
          <span className="platform-name">{platform.name}</span>
          <span className="platform-handle">{platform.handle}</span>
        </div>
      ))}
    </div>
  );
}

function Socials() {
  const user = useContext(UserContext);
  const socials = [
    { name: "LinkedIn", link: user.linkedIn },
    { name: "Facebook", link: user.facebook },
    { name: "Telegram", link: user.telegram },
  ];

  return (
    <div className="socials-section">
      {socials.map((social, index) => (
        <div key={index} className="platform">
          <span className="platform-name">{social.name}</span>
          <a 
            href={social.link} 
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
    { label: "Institute", value: user.institute },
    { label: "Graduation Year", value: user.graduationYear },
    { label: "Academic Email", value: user.academicEmail },
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
