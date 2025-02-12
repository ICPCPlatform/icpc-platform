import "@/app/globals.css";

import Sidebar from "./_Sidebar";
import Profile from "./_Profile";

const user = {
  id: 1,
  photopath: "./profile.jpg",
  name: "Mohamed Reda",
  birthdate: "1/1/2003",
  email: "mhassa@yahoo.com",
  location: "Egypt, Cairo",
  lastOnline: "2 hours ago",
  username: "cgmoreda",
  codeforcesHandle: "moreda",
  vjudgeHandle: "moreda",
  atcoderHandle: "moreda",
  codechefHandle: "moreda",
  leetCodeHandle: "moreda",
  institute: "Assiut University",
  graduationYear: "2021",
  academicEmail: "exampleacamain@institute.edu.eg",
  linkedIn: "linkedin.com/in/cgmoreda",
  facebook: "facebook.com/cgmoreda",
  telegram: "t.me/cgmoreda",
};
export type User = typeof user;

export default async function ProfilePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-8">
        <Profile user={user} />
        <Sidebar />
      </div>
    </div>
  );
}
