import React, { useEffect, useMemo, useState } from "react";

const decodeToken = (token) => {
  try {
    const base = token.split(".")[1];
    const payload = JSON.parse(atob(base));
    return payload;
  } catch (e) {
    return null;
  }
};

const InstructorStudents = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const instructorId = useMemo(() => {
    const p = token ? decodeToken(token) : null;
    return p?.id || p?._id;
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) {
        setError("No instructor session. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/courses/instructor/${instructorId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load courses");
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white bg-black">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-white bg-black">{error}</div>;

  return (
    <div className="flex min-h-screen text-white bg-black">
      <aside className="w-64 p-6 border-r bg-stone-950 border-fuchsia-900 max-sm:hidden">
        <h2 className="mb-8 text-2xl font-bold">Instructor</h2>
        <nav className="space-y-4">
          {[
            { name: "Dashboard", path: "/instructor/dashboard" },
            { name: "Courses", path: "/instructor/courses" },
            { name: "Students", path: "/instructor/students" },
            { name: "Profile", path: "/instructor/profile" },
          ].map((item) => (
            <a key={item.path} href={item.path} className="block px-3 py-2 rounded hover:bg-fuchsia-700">
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">My Students (by course enrollments)</h1>
        {courses.length === 0 ? (
          <p>No courses yet. Add a course to see enrollments.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="p-4 border rounded border-fuchsia-700 bg-stone-950">
                <h2 className="text-xl font-semibold">{course.name}</h2>
                <p className="text-sm text-gray-300">Enrollments shown on student dashboard.</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorStudents;
