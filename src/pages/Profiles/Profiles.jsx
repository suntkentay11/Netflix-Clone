import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useLists } from "../../context/ListContext";
import "./Profiles.css";
import ManageProfiles from "../../components/ManageProfiles/ManageProfiles";

import Profile1 from "../../assets/avatars/Profile1.png";
import Profile2 from "../../assets/avatars/Profile2.jpg";
import Profile3 from "../../assets/avatars/Profile3.png";
import Profile4 from "../../assets/avatars/Profile4.jpg";
import Profile5 from "../../assets/avatars/Profile5.jpg";
import Profile6 from "../../assets/avatars/Profile6.jpg";
import Profile7 from "../../assets/avatars/Profile7.jpg";
import ProfileKids from "../../assets/avatars/ProfileKids.png";

const avatarOptions = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
  Profile7,
];

const Profiles = () => {
  const navigate = useNavigate();
  const { chooseProfile } = useLists();
  const [showManageProfiles, setShowManageProfiles] = useState(false);

  const userId = auth.currentUser?.uid;
  const profilesKey = userId ? `profiles_${userId}` : "profiles_guest";
  const userNameKey = userId ? `netflixUserName_${userId}` : "netflixUserName_guest";

  const storedUserName = localStorage.getItem(userNameKey) || "User";

  const defaultProfiles = [
    {
      id: "main-profile",
      name: storedUserName,
      avatar: Profile6,
      isKids: false,
    },
    {
      id: "kids-profile",
      name: "Kids",
      avatar: ProfileKids,
      isKids: true,
    },
  ];

  const [profiles, setProfiles] = useState([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem(profilesKey));

    if (savedProfiles && savedProfiles.length > 0) {
      setProfiles(savedProfiles);
    } else {
      setProfiles(defaultProfiles);
    }
  }, [profilesKey]);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(profilesKey, JSON.stringify(profiles));
    }
  }, [profiles, profilesKey]);

  const handleChooseProfile = (profile) => {
    chooseProfile(profile);
    navigate("/home");
  };

  const handleAddProfile = (e) => {
    e.preventDefault();

    if (!newProfileName.trim()) return;

    const newProfile = {
      id: crypto.randomUUID(),
      name: newProfileName,
      avatar: avatarOptions[Math.floor(Math.random() * avatarOptions.length)],
      isKids: false,
    };

    setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
    setNewProfileName("");
    setShowAddProfile(false);
  };

  return (
    <div className="profiles">
      <h1>Who's watching?</h1>

      <div className="profiles__list">
        {profiles.map((profile) => (
          <div
            className="profiles__card"
            key={profile.id}
            onClick={() => handleChooseProfile(profile)}
          >
            {profile.avatar ? (
              <img
                className="profiles__avatar"
                src={profile.avatar}
                alt={profile.name}
              />
            ) : (
              <div className="profiles__avatar profiles__avatar--add">
                {profile.name[0]}
              </div>
            )}

            <p>{profile.name}</p>
          </div>
        ))}

        <div
          className="profiles__card"
          onClick={() => setShowAddProfile(true)}
        >
          <div className="profiles__avatar profiles__avatar--add">+</div>
          <p>Add Profile</p>
        </div>
      </div>

      <button
        className="profiles__manage"
        onClick={() => setShowManageProfiles(true)}
      >
        Manage Profiles
      </button>

      {showAddProfile && (
        <div
          className="profile-modal__overlay"
          onClick={() => setShowAddProfile(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="profile-modal__close"
              onClick={() => setShowAddProfile(false)}
            >
              ✕
            </button>

            <h2>Add Profile</h2>

            <form onSubmit={handleAddProfile}>
              <input
                type="text"
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />

              <button type="submit">Create Profile</button>
            </form>
          </div>
        </div>
      )}

      {showManageProfiles && (
        <ManageProfiles
          profiles={profiles}
          setProfiles={setProfiles}
          avatarOptions={avatarOptions}
          kidsAvatar={ProfileKids}
          onClose={() => setShowManageProfiles(false)}
        />
      )}
    </div>
  );
};

export default Profiles;