"use client";
import React, { useContext } from "react";
import { useState } from "react";
const UserContext = React.createContext({} as any);

export default function Profile({ user }: any) {
  const [activeTab, setActiveTab] = useState("cp");

  return (
    <UserContext.Provider value={user}>
      <div className="profile-container">
        <Info />

        <div className="tabs">
          <button className="tab" onClick={() => setActiveTab("cp")}>
            CP
          </button>
          <button className="tab" onClick={() => setActiveTab("academic")}>
            Academic
          </button>
          <button className="tab" onClick={() => setActiveTab("socials")}>
            Socials
          </button>
        </div>

        {activeTab === "cp" && <CP />}
        {activeTab === "academic" && <Academic />}
        {activeTab === "socials" && <Socials />}
      </div>
    </UserContext.Provider>
  );
}

function Info() {
  const user = useContext(UserContext);
  return (
    <div className="user-info">
      <div className="info-section">
        <div>Name: {user.name};</div>
        <div>Birthdate: {user.birthdate};</div>
        <div>Email: {user.email};</div>
        <div className="location">{user.location}</div>
        <div className="last-online">Last Online</div>
      </div>
      <div className="photo-section">
        <div className="photo-placeholder">Photo</div>
        <div className="username">&lt;username&gt;</div>
      </div>
    </div>
  );
}

function CP() {
  const { codeforcesHandle } = useContext(UserContext);
  return (
    <div className="cp-section">
      {codeforcesHandle && (
        <div className="platform">Codeforces Handle: {codeforcesHandle};</div>
      )}
      <div className="platform">vjudge Handle: &lt;Handle&gt;</div>
      <div className="platform">Atcoder Handle: &lt;Handle&gt;</div>
      <div className="platform">CodeChef Handle: &lt;Handle&gt;</div>
      <div className="platform">LeetCode Handle: &lt;Handle&gt;</div>
    </div>
  );
}
function Socials() {
  return (
    <div className="socials-section">
      <div>LinkedIn: &lt;Link&gt;</div>
      <div>Facebook: &lt;Link&gt;</div>
      <div>Telegram: &lt;Link&gt;</div>
    </div>
  );
}
function Academic() {
  return (
    <div className="academic-section">
      <div>Institute: &lt;Institute Name&gt;</div>
      <div>Graduation Year: &lt;Year&gt;</div>
      <div>Academic Email: &lt;Email&gt;</div>
    </div>
  );
}
