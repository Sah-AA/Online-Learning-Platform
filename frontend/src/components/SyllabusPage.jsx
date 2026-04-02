import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./UnifiedNavbar";
import { useCourses } from "../context/CourseContext";
import Loader from "./Loader";

const SyllabusPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourseById, isLoading } = useCourses();
  
  const course = getCourseById(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-4xl">Course not found</h1>
      </div>
    );
  }

  const renderTitle = () => {
    if (course.titleParts) {
      return (
        <>
          <h2 className="mt-32 text-center text-white text-7xl">{course.title}</h2>
          <h2 className="text-6xl font-semibold text-center">
            {course.titleParts.map((part, index) => (
              <span key={index} className={part.highlight ? "text-[#A21FB6]" : "text-white"}>
                {part.text}
              </span>
            ))}
          </h2>
        </>
      );
    }

    if (course.subtitle) {
      return (
        <>
          <h2 className="text-white mt-44 text-7xl max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            {course.id === "web-development" ? (
              <>
                <span className="ml-20">
                  {course.title} <span className="text-[#A21FB6]">{course.titleHighlight}</span>{" "}
                  {course.titleSuffix}
                </span>
                <br />
                <span className="ml-96">Complete</span>
                <br /> {course.subtitle?.replace("Complete ", "")}
              </>
            ) : (
              <>
                <span className="ml-8 text-8xl">
                  {course.title} <span className="text-[#A21FB6]">{course.titleHighlight}</span>
                </span>
                <br />
                <span className="ml-40">{course.subtitle}</span>
              </>
            )}
          </h2>
        </>
      );
    }

    return (
      <>
        <h2 className="text-white mt-44 text-8xl max-md:mt-10 max-md:max-w-full max-md:text-4xl">
          {course.title} <span className="text-[#A21FB6]">{course.titleHighlight}</span>
          {course.titleSuffix && ` ${course.titleSuffix}`}
        </h2>
        {course.subtitle && (
          <h2 className="mt-10 text-white text-8xl max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            {course.subtitle}
          </h2>
        )}
      </>
    );
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6 text-white"
      style={{
        background: "radial-gradient(circle at top center, #410640 5%, #000000 25%)",
      }}
    >
      <Navbar />
      <div className="flex flex-col items-center">
        {renderTitle()}
        <div className="w-full max-w-4xl mt-32 space-y-6">
          {course.syllabus?.map((section, index) => (
            <div key={index} className="p-6 bg-gray-800 shadow-lg rounded-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">{section.title}</h2>
              <ul className="space-y-2 text-gray-300">
                {section.items?.map((item, idx) => (
                  <li key={idx} className="list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusPage;

