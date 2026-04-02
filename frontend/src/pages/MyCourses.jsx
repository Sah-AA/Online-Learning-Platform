import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UnifiedNavbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CourseContext";

const MyCourses = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getEnrolledCourses, getCourseById, isLoading: coursesLoading } = useCourses();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      const data = await getEnrolledCourses();
      setEnrollments(data);
      setIsLoading(false);
    };
    load();
  }, [authLoading, isAuthenticated, navigate, getEnrolledCourses]);

  if (authLoading || isLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 pt-32 pb-16 text-white bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600"
              onClick={() => navigate("/course")}
            >
              Browse courses
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-6 text-center border rounded-xl border-fuchsia-700 bg-stone-950">
              <p className="text-lg">You haven't enrolled in any courses yet.</p>
              <button
                className="px-5 py-2 mt-4 text-white rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600"
                onClick={() => navigate("/course")}
              >
                Find a course
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {enrollments.map((enroll) => {
                const base = enroll.course || enroll; // backend might return {course: {...}}
                const course = base.image ? base : getCourseById(base.slug || base._id || base.id) || base;
                return (
                  <article
                    key={course._id || course.id || course.slug}
                    className="flex gap-4 p-4 border rounded-xl border-fuchsia-700 bg-stone-950"
                  >
                    <img
                      src={`http://localhost:3000${course.image}`}
                      alt={course.name}
                      className="object-cover w-32 h-24 rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{course.name}</h2>
                      <p className="mt-1 text-sm text-gray-300 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-400">
                          Enrolled on {new Date(enroll.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600"
                          onClick={() => navigate(`/courses/${course.slug || course._id || course.id}`)}
                        >
                          Go to course
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MyCourses;
