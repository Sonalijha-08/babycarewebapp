import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import "./profile.css";

const Profile = () => {
  const [isEditing, setIsEditing]             = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [saving, setSaving]                   = useState(false);
  const [alert, setAlert]                     = useState({ show: false, type: "", message: "" });
  const [profile, setProfile]                 = useState({
    name: "", email: "", phone: "", babyName: "", babyDOB: "", profilePicture: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [selectedFile, setSelectedFile]       = useState(null);
  const [preview, setPreview]                 = useState("");
  const fileInputRef                          = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/auth/profile");
      const profileData = {
        name:           data.name           || "",
        email:          data.email          || "",
        phone:          data.phone          || "",
        babyName:       data.babyName       || "",
        babyDOB:        data.babyDOB ? data.babyDOB.split("T")[0] : "",
        profilePicture: data.profilePicture || "",
      };
      setProfile(profileData);
      setOriginalProfile(profileData);
      setPreview(data.profilePicture || "");
    } catch (err) {
      console.error("Fetch profile error:", err);
      showAlert("error", "Couldn't load your profile");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  const handleChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert("error", "Image must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      showAlert("error", "Please select a valid image file");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile.name.trim())  { showAlert("error", "Name is required");  return; }
    if (!profile.email.trim()) { showAlert("error", "Email is required"); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name",     profile.name.trim());
      formData.append("email",    profile.email.trim());
      formData.append("phone",    profile.phone ? profile.phone.trim() : "");
      formData.append("babyName", profile.babyName ? profile.babyName.trim() : "");
      formData.append("babyDOB",  profile.babyDOB || "");

      // ← KEY: only append if a new file was actually chosen
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      // Do NOT manually set Content-Type — let browser set multipart boundary
      const { data } = await axios.put("/auth/profile", formData);

      const updated = {
        name:           data.name           || profile.name,
        email:          data.email          || profile.email,
        phone:          data.phone          || profile.phone,
        babyName:       data.babyName       || profile.babyName,
        babyDOB:        data.babyDOB ? data.babyDOB.split("T")[0] : profile.babyDOB,
        profilePicture: data.profilePicture || profile.profilePicture,
      };

      setProfile(updated);
      setOriginalProfile(updated);
      // Use the URL returned by server (not the local blob) for persistence
      setPreview(data.profilePicture || preview);
      setSelectedFile(null);
      setIsEditing(false);
      showAlert("success", "Profile saved! ✨");
    } catch (err) {
      console.error("Save error:", err);
      showAlert("error", err.response?.data?.message || "Something went wrong. Try again?");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setPreview(originalProfile.profilePicture || "");
    setSelectedFile(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="pr-page">
        <div className="pr-loading">
          <div className="pr-dots"><span /><span /><span /></div>
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="pr-page">

      {/* ── Alert ── */}
      {alert.show && (
        <div className={`pr-alert pr-alert--${alert.type}`}>
          <span className="pr-alert__icon">{alert.type === "success" ? "✓" : "!"}</span>
          {alert.message}
        </div>
      )}

      {/* ── Hero header — peach gradient with avatar ── */}
      <div className="pr-hero">
        <div className="pr-hero__inner">
          {/* Avatar */}
          <div
            className={`pr-avatar-wrap${isEditing ? " is-editable" : ""}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {preview
              ? <img src={preview} alt="Profile" className="pr-avatar-img" />
              : <div className="pr-avatar-initials">{initials}</div>
            }
            {isEditing && (
              <div className="pr-avatar-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Change photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Name + subtitle */}
          <h1 className="pr-hero__name">{profile.name || "Your Name"} 👋</h1>
          <p className="pr-hero__sub">Let's keep your info fresh and fun!</p>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="pr-body">

        {/* Edit button (view mode) */}
        {!isEditing && (
          <div className="pr-edit-bar">
            <button className="pr-btn pr-btn--edit" onClick={() => setIsEditing(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          </div>
        )}

        {/* ── Parent Info section ── */}
        <section className="pr-section">
          <h2 className="pr-section-title">
            <span className="pr-section-icon">👨‍👩‍👧</span> Parent Info
          </h2>

          <div className="pr-grid">
            <div className="pr-field">
              <label className="pr-label" htmlFor="name">
                <span className="pr-label-icon">✨</span> Your Name
                <span className="pr-req">*</span>
              </label>
              <input id="name" className="pr-input" type="text" name="name"
                value={profile.name} disabled={!isEditing}
                onChange={handleChange} placeholder="Your full name" />
            </div>

            <div className="pr-field">
              <label className="pr-label" htmlFor="email">
                <span className="pr-label-icon">🔵</span> Email
                <span className="pr-req">*</span>
              </label>
              <input id="email" className="pr-input" type="email" name="email"
                value={profile.email} disabled={!isEditing}
                onChange={handleChange} placeholder="you@email.com" />
            </div>
          </div>

          <div className="pr-field pr-field--full">
            <label className="pr-label" htmlFor="phone">
              <span className="pr-label-icon">📟</span> Phone Number
            </label>
            <input id="phone" className="pr-input" type="tel" name="phone"
              value={profile.phone} disabled={!isEditing}
              onChange={handleChange} placeholder="+91 00000 00000" />
          </div>
        </section>

        {/* ── Baby Info section ── */}
        <section className="pr-section">
          <h2 className="pr-section-title">
            <span className="pr-section-icon">👶</span> Baby Info
          </h2>

          <div className="pr-grid">
            <div className="pr-field">
              <label className="pr-label" htmlFor="babyName">
                <span className="pr-label-icon">🍼</span> Baby's Name
              </label>
              <input id="babyName" className="pr-input" type="text" name="babyName"
                value={profile.babyName} disabled={!isEditing}
                onChange={handleChange} placeholder="Your little one's name" />
            </div>

            <div className="pr-field">
              <label className="pr-label" htmlFor="babyDOB">
                <span className="pr-label-icon">🎂</span> Baby's Birthday
              </label>
              <input id="babyDOB" className="pr-input" type="date" name="babyDOB"
                value={profile.babyDOB} disabled={!isEditing}
                onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* ── Save / Cancel (edit mode) ── */}
        {isEditing && (
          <div className="pr-actions">
            <button className="pr-btn pr-btn--cancel" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
            <button className="pr-btn pr-btn--save" onClick={handleSave} disabled={saving}>
              {saving
                ? <><div className="pr-spinner" /> Saving…</>
                : "Save Changes"
              }
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;