import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminStudent = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Students", path: "/admin/students" },
    { name: "Instructors", path: "/admin/instructors" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/users/getAllUser", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log("Fetched data:", res.data);
        setStudentData(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/users/delete/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setStudentData(studentData.filter((student) => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      if (response.status === 200) {
        alert("Logout successful");
        localStorage.removeItem("token"); // Clear token if stored in localStorage
        navigate("/admin/login"); // Redirect to login page
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  // Calculate total students count
  const totalStudents = studentData.length;

  return (
    <div className="flex min-h-screen text-white bg-black">
      {/* Sidebar */}
      <nav className="w-64 min-h-screen p-6 border-r bg-stone-950 border-fuchsia-900 max-sm:hidden">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Admin<span className="text-fuchsia-500">Panel</span>
          </h2>
        </div>

        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="block px-4 py-2 text-xl transition duration-200 rounded hover:bg-fuchsia-700 hover:text-black"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-xl text-left transition duration-200 rounded hover:bg-fuchsia-700 hover:text-black"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navigation Bar */}
        <header className="flex items-center justify-center px-10 py-5 border-b border-solid bg-stone-950 border-b-fuchsia-900 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-sm:p-4">
          <h1 className="text-3xl font-bold text-white">
            <span>Code</span>
            <span className="text-fuchsia-500">Hub</span>
          </h1>
        </header>

        {/* Student Table */}
        <main className="flex-1 p-7 max-sm:p-4">
          <h2 className="text-4xl mb-9">Student List</h2>

          {/* Display total students */}
          <div className="mb-5 text-xl">
            <span>Total Students: </span>
            <span className="font-bold">{totalStudents}</span>
          </div>

          <section className="max-w-full overflow-x-auto border border-white border-solid rounded-lg bg-stone-950">
            <table className="min-w-full text-white table-auto">
              {/* Table Header */}
              <thead className="bg-fuchsia-900 bg-opacity-20">
                <tr>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Email ID
                  </th>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Password
                  </th>
                  <th className="px-6 py-4 text-xl font-semibold text-left max-sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {studentData.map((student) => (
                  <tr key={student._id} className="border-t border-white">
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      {student._id}
                    </td>
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      {student.username || student.name}
                    </td>
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      {student.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      {student.password || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-base max-sm:text-sm">
                      <div className="flex gap-3 max-sm:flex-col">
                        <button
                          className="px-4 py-2 text-sm text-white transition-colors rounded bg-stone-800 hover:bg-fuchsia-700 hover:text-black"
                          onClick={() =>
                            navigate(`/admin/students/edit/${student._id}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="px-4 py-2 text-sm text-white transition-colors rounded bg-stone-800 hover:bg-fuchsia-700 hover:text-black"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminStudent;
