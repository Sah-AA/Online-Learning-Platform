import React, { useEffect } from "react";
import profile from "/images/profile.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UnifiedNavbar";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  console.log("User data in Profile:", user);
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6 text-white"
      style={{
        background:
          "radial-gradient(circle at top center, #410640 5%, #000000 50%)",
      }}
    >
      <Navbar />
      <main className="w-full min-h-screen py-12">
        {/* Profile Section */}
        <section className="relative max-w-[500px] mx-auto bg-stone-900 p-10 rounded-lg shadow-md mt-12">
          {/* Profile Info */}
          <div className="flex items-center gap-8">
            <img
              src={user?.profileImage || profile}
              alt="Profile"
              className="w-[110px] h-[110px] rounded-full border-4 border-fuchsia-700"
            />
            <div className="text-white">
              <h2 className="text-3xl">Profile</h2>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mt-8">
            <h3 className="text-2xl text-fuchsia-500">Personal Details</h3>
            <div className="grid grid-cols-2 gap-6 mt-4 text-white">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <div className="p-4 text-lg border rounded-lg bg-stone-800 border-fuchsia-700">
                  {user?.username || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <div className="p-4 text-lg border rounded-lg bg-stone-800 border-fuchsia-700">
                  {user?.email || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Password</label>
                <div className="p-4 text-lg border rounded-lg bg-stone-800 border-fuchsia-700">
                  ••••••
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <div className="p-4 text-lg border rounded-lg bg-stone-800 border-fuchsia-700">
                  {user?.phone || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Edit and Logout Buttons */}
          <div className="flex justify-between mt-8">
            {/* Edit Button */}
            <button
              onClick={() => navigate("/editprofile")}
              className="px-10 py-3 text-white transition rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600"
            >
              Edit
            </button>
            
            {/* Logout Button */}
            <button
              className="px-10 py-3 text-white transition rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
