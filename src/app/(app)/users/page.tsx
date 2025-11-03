"use client";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  name?: string;
  bio?: string;
  image?: string;
}

export default function PublicUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError("Failed to load users");
        }
      } catch (err) {
        setError("API error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  if (users.length === 0)
    return <p className="text-center p-4">No public users found.</p>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-3">
      {users.map((u) => (
        <div key={u._id} className="border rounded-lg p-4 shadow">
          <img
            src={u.image || "/default-avatar.png"}
            alt={u.username}
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
          <h3 className="text-center mt-2 font-semibold">
            {u.name || u.username}
          </h3>
          {u.bio && (
            <p className="text-center text-sm text-gray-600">{u.bio}</p>
          )}
          <button
  onClick={async () => {
    const content = prompt(`Write your message for ${u.username}:`);
    if (!content) return;

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUsername: u.username,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Message sent successfully!");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Something went wrong");
    }
  }}
  className="mt-3 block mx-auto bg-blue-500 text-white px-3 py-1 rounded"
>
  Send Message
</button>

        </div>
      ))}
    </div>
  );
}
