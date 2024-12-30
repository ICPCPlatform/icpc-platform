import './ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './_Sidebar';
import Profile from './_Profile';

const user = {
  id: 1,
  photopath: './profile.jpg',
  name: 'Mohamed Reda',
  birthdate: '1/1/2003',
  email: 'mhassa@yahoo.com',
  location: 'Egypt, Cairo',
  lastOnline: '2 hours ago',
  username: 'cgmoreda',
  codeforcesHandle: 'moreda',
  vjudgeHandle: 'moreda',
  atcoderHandle: 'moreda',
  codechefHandle: 'moreda',
  leetCodeHandle: 'moreda',
  institute: 'Assiut University',
  graduationYear: '2021',
  academicEmail: 'exampleacamain@institute.edu.eg',
  linkedIn: 'linkedin.com/in/cgmoreda',
  facebook: 'facebook.com/cgmoreda',
  telegram: 't.me/cgmoreda'
}
const ID = 1;
const ProfilePage = () => {
  

  return (
    <div className="ProfilePage">

      <nav style={{ background: '#333', color: 'white', padding: '10px' }}>
        <h1>Profile Page</h1>
      </nav>

      <div style={{ display: 'flex' }}>
        <Profile user={user} />
        <Sidebar />
      </div>
    </div>
  );
};

export default ProfilePage;
