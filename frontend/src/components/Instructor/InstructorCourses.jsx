import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const instructorId = useMemo(() => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id || payload?._id || null;
    } catch {
      return null;
    }
  }, [token]);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      if (!instructorId) return;
      try {
        const response = await fetch(`${API_URL}/courses/instructor/${instructorId}`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [API_URL, instructorId]);

  // Handle delete course (placeholder)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/courses/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Course deleted successfully!");
        setCourses((prev) => prev.filter((course) => course._id !== id));
      } else {
        alert("Error deleting course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/instructor/login");
  };

  return (
    <div className="flex min-h-screen text-white bg-black">
      {/* Sidebar */}
      <nav className="w-64 min-h-screen p-6 border-r bg-stone-950 border-fuchsia-900 max-sm:hidden">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Instructor<span className="text-fuchsia-500">Panel</span>
          </h2>
        </div>

        <ul className="space-y-6">
          {[
            { name: "Dashboard", path: "/instructor/dashboard" },
            { name: "My Courses", path: "/instructor/courses" },
            { name: "Students", path: "/instructor/students" },
          ].map((item) => (
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

        {/* Content */}
        <main className="flex-1 p-7 max-sm:p-4">
          <h2 className="text-4xl mb-9">My Courses</h2>

          <button
            className="mb-8 h-16 text-xl text-white border rounded-lg border-fuchsia-700 border-solid cursor-pointer bg-stone-950 w-[228px] max-sm:w-full hover:bg-fuchsia-700"
            onClick={() => navigate("/instructor/addcourses")} // Placeholder
          >
            Add new Course
          </button>

          {/* Course Table */}
          <div className="border border-white border-solid rounded-lg bg-stone-950 max-sm:overflow-x-auto">
            <div className="bg-fuchsia-900 bg-opacity-20 grid px-4 py-2 border-b border-solid border-b-white grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr] max-md:p-2 max-md:text-sm max-sm:min-w-[900px]">
              <div className="p-2 text-xl text-white">ID</div>
              <div className="p-2 text-xl text-white">Image</div>
              <div className="p-2 text-xl text-white">Course Name</div>
              <div className="p-2 text-xl text-white">Price</div>
              <div className="p-2 text-xl text-white">Status</div>
              <div className="p-2 text-xl text-white">Actions</div>
            </div>

            {courses.map((course) => (
              <div
                key={course._id}
                className="grid px-4 py-2 border-b border-solid border-b-white grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr] max-md:p-2 max-md:text-sm max-sm:min-w-[900px] hover:bg-stone-900"
              >
                <div className="p-2 text-base text-white">{course._id}</div>
                <div className="p-2">
                  <img
                    src={
                      course.image
                        ? (course.image.startsWith("http") ? course.image : `${API_URL}${course.image}`)
                        : course.imageUrl
                        ? (course.imageUrl.startsWith("http") ? course.imageUrl : `${API_URL}${course.imageUrl}`)
                        : ""
                    }
                    alt="Course"
                    className="w-16 h-16 rounded"
                  />
                </div>
                <div className="p-2 text-base text-white">{course.name}</div>
                <div className="p-2 text-base text-white">{course.price}</div>
                <div className="p-2 text-base text-white">Active</div>
                <div className="flex items-center p-2 text-base text-white">
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 text-sm text-white transition-colors rounded bg-stone-800 hover:bg-fuchsia-700 hover:text-black"
                      onClick={() => navigate(`/instructor/editcourse/${course._id}`)} // Placeholder
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 text-sm text-white transition-colors rounded bg-stone-800 hover:bg-red-600 hover:text-black"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorCourses;
