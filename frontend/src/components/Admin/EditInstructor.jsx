import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("instructor");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const loadUser = async () => {
      setError("");
      try {
        const res = await fetch(`http://localhost:3000/users/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load user");
        setRole(data.role || "instructor");
        setEmail(data.email || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");
      alert("Role updated successfully");
      navigate("/admin/instructors");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-white bg-black">
      <h2 className="mb-10 text-4xl">Update Role</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border rounded shadow-lg bg-stone-950 border-fuchsia-800"
      >
        {error && <p className="mb-3 text-red-500">{error}</p>}

        <label className="block mb-6">
          <span className="text-xl">Email</span>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 mt-2 text-gray-400 border border-white rounded cursor-not-allowed bg-stone-900"
          />
        </label>

        <label className="block mb-6">
          <span className="text-xl">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mt-2 bg-black border border-white rounded text-white"
          >
            <option value="user">User</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-5 py-2 text-white rounded bg-fuchsia-600 hover:bg-fuchsia-800"
          >
            Save Role
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/instructors")}
            className="px-5 py-2 text-white border border-white rounded hover:bg-stone-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstructor;
