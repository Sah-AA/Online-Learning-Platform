import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    slug: "",
    name: "",
    title: "",
    titleHighlight: "",
    titleSuffix: "",
    subtitle: "",
    description: "",
    instructor: "",
    price: "",
    image: null,
    tags: "",
    roadmap: "",
    youtubeUrl: "",
    learnButtonText: "Learn Free",
  });

  const [instructors, setInstructors] = useState([]); // State to store instructors
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch instructors from the backend
  useEffect(() => {
    const fetchInstructors = async () => {
      setError("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in as admin to load instructors.");
          setLoading(false);
          return;
        }
        const response = await fetch("http://localhost:3000/users/getAllUser", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch instructors");
        setInstructors((data || []).filter((u) => (u.role || "").toLowerCase() === "instructor"));
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []); // Empty dependency array ensures this runs only once

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCourseData({ ...courseData, image: files[0] });
    } else {
      setCourseData({ ...courseData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.instructor) {
      setError("Please select an instructor.");
      return;
    }
  
    try {
      setError("");
      // Prepare form data
      const formData = new FormData();
      formData.append("slug", courseData.slug);
      formData.append("name", courseData.name);
      formData.append("title", courseData.title);
      formData.append("titleHighlight", courseData.titleHighlight);
      formData.append("titleSuffix", courseData.titleSuffix);
      formData.append("subtitle", courseData.subtitle);
      formData.append("description", courseData.description);
      formData.append("roadmap", courseData.roadmap);
      formData.append("youtubeUrl", courseData.youtubeUrl);
      formData.append("learnButtonText", courseData.learnButtonText);
      formData.append("tags", courseData.tags);
      formData.append("instructorId", courseData.instructor);
      formData.append("price", courseData.price);
      if (courseData.image) formData.append("image", courseData.image);
  
      // Send POST request to backend
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/courses/add", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Course added successfully:", result);
        alert("Course added successfully!");
        navigate("/admin/courses"); // Redirect to courses list
      } else {
        const errorData = await response.json();
        console.error("Error adding course:", errorData);
        const msg = errorData.message || "Failed to add course.";
        setError(msg);
        alert(`Error: ${msg}`);
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      setError("An error occurred while adding the course.");
      alert("An error occurred while adding the course.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 text-white bg-black">
      <div className="w-full max-w-2xl p-8 border rounded-lg shadow-lg border-fuchsia-700 bg-stone-950">
        <h2 className="mb-6 text-3xl font-bold text-center">
          Add <span className="text-fuchsia-500">New Course</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {error && (
            <div className="p-3 text-sm text-red-300 border border-red-500 rounded bg-red-950">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-lg">Slug *</label>
              <input
                type="text"
                name="slug"
                value={courseData.slug}
                onChange={handleChange}
                required
                className="w-full p-3 text-black bg-white rounded"
                placeholder="web-dev-cohort"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">Course Name *</label>
              <input
                type="text"
                name="name"
                value={courseData.name}
                onChange={handleChange}
                required
                className="w-full p-3 text-black bg-white rounded"
                placeholder="Web Development Cohort"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-lg">Title *</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
                className="w-full p-3 text-black bg-white rounded"
                placeholder="Full-Stack Zero to Hero"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">Title Highlight</label>
              <input
                type="text"
                name="titleHighlight"
                value={courseData.titleHighlight}
                onChange={handleChange}
                className="w-full p-3 text-black bg-white rounded"
                placeholder="Placement Ready"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-lg">Title Suffix</label>
              <input
                type="text"
                name="titleSuffix"
                value={courseData.titleSuffix}
                onChange={handleChange}
                className="w-full p-3 text-black bg-white rounded"
                placeholder="2026 Edition"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={courseData.subtitle}
                onChange={handleChange}
                className="w-full p-3 text-black bg-white rounded"
                placeholder="Build & ship production apps"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg">Description</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="w-full p-3 text-black bg-white rounded min-h-[100px]"
              placeholder="Short marketing description"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-lg">Instructor *</label>
              <select
                name="instructor"
                value={courseData.instructor}
                onChange={handleChange}
                required
                className="w-full p-3 text-black bg-white rounded"
                disabled={loading || instructors.length === 0}
              >
                <option value="">
                  {loading ? "Loading instructors..." : "-- Select Instructor --"}
                </option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.username || instructor.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-lg">Course Price (₹)</label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-3 text-black bg-white rounded"
                placeholder="4999"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={courseData.tags}
              onChange={handleChange}
              className="w-full p-3 text-black bg-white rounded"
              placeholder="webdev, fullstack, react"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-lg">Roadmap Image URL</label>
              <input
                type="text"
                name="roadmap"
                value={courseData.roadmap}
                onChange={handleChange}
                className="w-full p-3 text-black bg-white rounded"
                placeholder="/uploads/roadmap.png"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">YouTube URL</label>
              <input
                type="text"
                name="youtubeUrl"
                value={courseData.youtubeUrl}
                onChange={handleChange}
                className="w-full p-3 text-black bg-white rounded"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg">Learn Button Text</label>
            <input
              type="text"
              name="learnButtonText"
              value={courseData.learnButtonText}
              onChange={handleChange}
              className="w-full p-3 text-black bg-white rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Course Image *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full p-3 text-white rounded bg-stone-900 file:bg-fuchsia-700 file:border-none file:px-4 file:py-2 file:cursor-pointer"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-6 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded bg-fuchsia-700 hover:bg-fuchsia-800"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
