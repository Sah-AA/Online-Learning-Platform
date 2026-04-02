import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddInstructor = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users/getAllUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteToInstructor = async (userId) => {
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "instructor" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");
      // refresh list
      await fetchUsers();
      alert("User promoted to instructor");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 text-white bg-black">
      <div className="w-full max-w-5xl p-8 border rounded-lg shadow-lg border-fuchsia-700 bg-stone-950">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Promote <span className="text-fuchsia-500">User</span> to Instructor
          </h2>
          <button
            onClick={() => navigate("/admin/instructors")}
            className="px-4 py-2 text-sm font-semibold text-white rounded border border-fuchsia-700 hover:bg-fuchsia-700"
          >
            Back
          </button>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="overflow-x-auto border border-white rounded-lg">
          <table className="w-full text-left bg-stone-950">
            <thead>
              <tr className="text-lg bg-fuchsia-900 bg-opacity-20">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t border-white">
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      {user.role === "instructor" ? (
                        <span className="text-green-400">Already instructor</span>
                      ) : (
                        <button
                          onClick={() => promoteToInstructor(user._id)}
                          className="px-4 py-2 text-sm font-medium text-white rounded bg-fuchsia-700 hover:bg-fuchsia-600"
                        >
                          Make Instructor
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddInstructor;
