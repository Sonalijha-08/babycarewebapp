import { useState, useEffect } from "react";
import axios from "../api/axios";
import "./profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    babyName: "",
    babyDOB: "",
    profilePicture: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/auth/profile");
      const userData = response.data;
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        babyName: userData.babyName || "",
        babyDOB: userData.babyDOB ? userData.babyDOB.split('T')[0] : "",
        profilePicture: userData.profilePicture || "",
      });
      setPreview(userData.profilePicture || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("babyName", profile.babyName);
      formData.append("babyDOB", profile.babyDOB);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      await axios.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      setSelectedFile(null);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {preview ? (
              <img src={preview} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            ) : (
              "👩‍🍼"
            )}
          </div>
          <h2>My Profile</h2>
          <p>Manage your personal & baby details</p>
        </div>

        <div className="profile-form">
          {[
            ["Parent Name", "name"],
            ["Email", "email"],
            ["Phone", "phone"],
            ["Baby Name", "babyName"],
          ].map(([label, field]) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              <input
                type="text"
                name={field}
                value={profile[field]}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Baby Date of Birth</label>
            <input
              type="date"
              name="babyDOB"
              value={profile.babyDOB}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!isEditing}
            />
          </div>

          <button
            className="edit-btn"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes 💾" : "Edit Profile ✏️"}
          </button>
          {isEditing && (
            <button
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false);
                setSelectedFile(null);
                setPreview(profile.profilePicture);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
