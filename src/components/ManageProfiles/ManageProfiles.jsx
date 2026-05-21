import React, { useState } from 'react'
import "./ManageProfiles.css";

const ManageProfiles = ({
    profiles,
    setProfiles,
    avatarOptions,
    kidsAvatar,
    onClose,
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState("");

    const startEdit = (profile) => {
        setEditingId(profile.id);
        setEditedName(profile.name);
    };

    const saveName = (profileId) => {
        if (!editedName.trim()) return;

        setProfiles((prev) =>
            prev.map((profile) =>
                profile.id === profileId ? { ...profile, name: editedName } : profile
            )
        );
        setEditingId(null);
        setEditedName("");
    }

    const deleteProfile = (profileId) => {
        const confirmed = window.confirm("Are you sure you want to delete this profile?");
        if (!confirmed) return;

        setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
    }

    const changeAvatar = (profileId, avatar) => {
        setProfiles((prev) =>
            prev.map((profile) =>
                profile.id === profileId ? { ...profile, avatar } : profile
            )
        );
    };

  return (
    <div className="manage-profiles__overlay" onClick={onClose}>
        <div className="manage-profiles" onClick={(e) => e.stopPropagation()}>
            <button className="manage-profiles__close" onClick={onClose}>X</button>
            <h2>Manage Profiles</h2>
            <div className="manage-profiles__list">
                {profiles.map((profile) => (
                    <div className="manage-profile" key={profile.id}>
                        <img className="manage-profile__avatar" src={profile.avatar}  alt={profile.name} />
                        <div className="manage-profile__content">
                            {editingId === profile.id ? (
                                <div className="manage-profile__edit">
                                    <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                    <button onClick={() => saveName(profile.id)}>Save</button>
                                </div>
                            ) : (
                                <div className="manage-profile__top">
                                    <h3>{profile.name}</h3>
                                    <button onClick={() => startEdit(profile)}>Rename</button>
                                </div>
                            )}
                            <div className="manage-profile__avatars">
                                {profile.isKids ? (
                                    <button
                                    className='manage-profile__avatar-option active' onClick={() => changeAvatar(profile.id, kidsAvatar)}>
                                        <img
                                        className="manage-profile__avatar-option-img"
                                        src={kidsAvatar}
                                        alt="Kids avatar"
                                        />
                                    </button>
                                ) : (
                                    avatarOptions.map((avatar) => (
                                        <button
                                            key={avatar}
                                            className={`manage-profile__avatar-option ${profile.avatar === avatar ? "active" : ""}`}
                                            onClick={() => changeAvatar(profile.id, avatar)}
                                        >
                                            <img
                                            className="manage-profile__avatar-option-img"
                                            src={avatar}
                                            alt="Avatar option"
                                            />
                                        </button>
                                    ))
                                )}
                            </div>

                            {!profile.isKids && (
                                <button className="manage-profile__delete" onClick={() => deleteProfile(profile.id)}>
                                    Delete Profile
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button className='manage-profiles__done' onClick={onClose}>Done</button>
        </div>
    </div>
)
}

export default ManageProfiles