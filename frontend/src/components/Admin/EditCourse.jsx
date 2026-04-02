import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { courseId } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState({
    name: "",
    instructor: "",
    price: "",
    imageUrl: "",
  });

  const [instructors, setInstructors] = useState([]); // List of instructors

  // Fetch course and instructor data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Fetching course with ID:", courseId);

        // Fetch course details
        const courseResponse = await axios.get(`${API_URL}/courses/get/${courseId}`);
        console.log("Course Response:", courseResponse.data);
        const fetchedCourse = courseResponse.data.course;

        setCourse({
          name: fetchedCourse.name || "",
          instructor: fetchedCourse.instructor?._id || "",
          price: fetchedCourse.price || "",
          imageUrl: fetchedCourse.image || fetchedCourse.imageUrl || "",
        });

        // Fetch instructors for the dropdown
        const instructorResponse = await axios.get(`${API_URL}/users/getAllUser`);
        const instructorList = (instructorResponse.data || []).filter((u) => u.role === "instructor");
        console.log("Instructors Response:", instructorList);
        setInstructors(instructorList);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course or instructors:", error);
        alert("Failed to load course data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field: ${name}, Value: ${value}`);
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCourse((prev) => ({ ...prev, imageUrl: file }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!course.name || !course.price || !course.instructor) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Submitting course data:", course);

    try {
      const formData = new FormData();
      formData.append("name", course.name);
      formData.append("price", course.price);
      formData.append("instructor", course.instructor); // Ensure the instructor ID is included in the formData
      if (course.imageUrl instanceof File) {
        formData.append("image", course.imageUrl);
      }

      // Make sure the request is sent to the correct endpoint and the data is being passed properly
      const response = await axios.put(`http://localhost:3000/courses/edit/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", response.data);

      alert("Course updated successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Update failed", error);
      alert("An error occurred while updating the course.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <p className="text-2xl">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-white bg-black">
      <h2 className="mb-10 text-4xl">Edit Course</h2>
      <form
        onSubmit={handleSave}
        className="w-full max-w-md p-8 border rounded shadow-lg bg-stone-950 border-fuchsia-800"
      >
        <label className="block mb-4">
          <span className="text-xl">Course Name</span>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 bg-black border border-white rounded"
            placeholder="Enter course name"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xl">Instructor</span>
          <select
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            className="w-full p-2 mt-2 bg-black border border-white rounded"
          >
            <option value="">Select Instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.username || instructor.name || instructor.email}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-xl">Price</span>
          <input
            type="text"
            name="price"
            value={course.price}
            onChange={handleChange}
            className="w-full p-2 mt-2 bg-black border border-white rounded"
            placeholder="Enter course price"
          />
        </label>

        <label className="block mb-6">
          <span className="text-xl">Upload Course Image</span>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 mt-2 bg-black border border-white rounded"
          />
          {course.imageUrl && !(course.imageUrl instanceof File) && (
            <div className="mt-4">
              <img
                src={
                  course.imageUrl.startsWith("http")
                    ? course.imageUrl
                    : `${API_URL}${course.imageUrl}`
                }
                alt="Course Preview"
                className="object-cover w-32 h-32 rounded"
              />
            </div>
          )}
        </label>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-5 py-2 text-white rounded bg-fuchsia-600 hover:bg-fuchsia-800"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="px-5 py-2 text-white border border-white rounded hover:bg-stone-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
