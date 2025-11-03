"use client";
import { useEffect, useState } from "react";

interface User {
  username: string;
  name?: string;
  bio?: string;
  image?: string;
  isPublic: boolean;
  isAcceptingMessages: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setFormData(data.user);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setIsEditing(false);
    } else alert("Update failed");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "user_profile_uploads");

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dz3unwrgt/image/upload",
      {
        method: "POST",
        body: formDataUpload,
      }
    );
    const data = await uploadRes.json();
    setFormData((prev) => ({ ...prev, image: data.secure_url }));
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Profile not found</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      {!isEditing ? (
        <>
          <div className="flex flex-col items-center">
            <img
              src={user.image || "/default-avatar.png"}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="text-xl font-semibold">{user.name || user.username}</h2>
            {user.bio && <p className="text-gray-600 text-center mt-2">{user.bio}</p>}
          </div>

          <div className="mt-4 border-t pt-4 space-y-2">
            <p>
              <strong>Public Profile:</strong> {user.isPublic ? "✅ Visible" : "🚫 Private"}
            </p>
            <p>
              <strong>Accepting Messages:</strong>{" "}
              {user.isAcceptingMessages ? "✅ Yes" : "🚫 No"}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-3">Edit Profile</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded p-2"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded p-2"
            />
            <div>
              <label className="block mb-1">Profile Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.image && (
                <img
                  src={formData.image}
                  className="w-20 h-20 rounded-full mt-2 object-cover"
                  alt="preview"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <label>Public Profile:</label>
              <input
                type="checkbox"
                checked={formData.isPublic || false}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
