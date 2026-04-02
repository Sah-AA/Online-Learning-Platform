import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./UnifiedNavbar";
import { useCourses } from "../context/CourseContext";
import Loader from "./Loader";

const CoursePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
        <h2 className="text-6xl font-semibold text-center">
          {course.titleParts.map((part, index) => (
            <span key={index} className={part.highlight ? "text-[#A21FB6]" : "text-white"}>
              {part.text}
            </span>
          ))}
        </h2>
      );
    }

    return (
      <>
        <h2 className="mt-20 text-white text-8xl max-md:mt-10 max-md:max-w-full max-md:text-4xl">
          {course.title} <span className="text-[#A21FB6]">{course.titleHighlight}</span>
          {course.titleSuffix && ` ${course.titleSuffix}`}
        </h2>
        {course.subtitle && (
          <h2 className="mt-10 text-white text-7xl max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            {course.subtitle}
          </h2>
        )}
      </>
    );
  };

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen px-6 text-white"
        style={{
          background: "radial-gradient(circle at top center, #410640 5%, #000000 50%)",
        }}
      >
        <Navbar />
        <section className="flex flex-col items-center">
          {course.titleParts ? (
            <>
              <h2 className="mt-24 text-center text-white text-7xl">{course.title}</h2>
              {renderTitle()}
            </>
          ) : (
            renderTitle()
          )}

          {course.description && (
            <p className="items-center ml-3 text-4xl text-white mt-14 max-md:mt-10 max-md:max-w-full">
              {course.description}
            </p>
          )}

          <div className="flex flex-wrap gap-5 justify-between mt-36 w-full text-3xl text-black max-w-[1222px] max-md:mt-10 max-md:max-w-full">
            {course.tags?.slice(0, 3).map((tag, index) => (
              <button
                key={index}
                className={`px-16 py-5 border-2 border-fuchsia-700 border-solid bg-stone-950 rounded-[50px] max-md:px-5 text-white hover:bg-fuchsia-900 transition-colors ${
                  index === 1 ? "mx-auto" : ""
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {course.tags?.length > 3 && (
            <div className="flex flex-wrap gap-5 justify-between mt-20 w-full text-3xl text-black max-w-[1222px] max-md:mt-10 max-md:max-w-full">
              {course.tags.slice(3).map((tag, index) => (
                <button
                  key={index}
                  className="px-16 py-5 border-2 border-fuchsia-700 border-solid bg-stone-950 rounded-[50px] max-md:px-5 text-white hover:bg-fuchsia-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-40 ml-20 w-full max-w-[1238px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-3/5 max-md:w-full">
            <article className="w-full px-px pt-px pb-12 mx-auto border border-solid rounded-xl border-fuchsia-700 bg-stone-950">
              <img
                loading="lazy"
                src={
                  course.image
                    ? (course.image.startsWith("http") ? course.image : `${API_URL}${course.image}`)
                    : course.imageUrl
                    ? (course.imageUrl.startsWith("http") ? course.imageUrl : `${API_URL}${course.imageUrl}`)
                    : ""
                }
                alt="Course preview"
                className="object-contain w-full rounded-md aspect-[1.89]"
              />
              <div className="flex flex-wrap gap-3.5 mt-14 ml-4 text-3xl text-white">
                <span className="grow px-11 py-5 border-2 border-fuchsia-700 border-solid bg-stone-950 rounded-[50px] w-fit hover:bg-fuchsia-900 transition-colors">
                  Language: Hindi
                </span>
                <div className="px-6 pt-3.5 pb-8 text-3xl text-white border-2 border-fuchsia-700 border-solid bg-stone-950 rounded-[50px] hover:bg-fuchsia-900 transition-colors">
                  Total Content: 150+
                  <br /> Hours
                </div>
              </div>
            </article>
          </div>
          <aside className="flex flex-col items-start self-stretch w-2/5 my-auto text-white ml-9 max-md:mt-10">
            <h3 className="self-stretch text-4xl">
              Price {course.displayPrice || course.price}{" "}
              <span className="text-2xl text-white">₹</span>
              <span className="text-2xl text-white line-through">{course.originalPrice}</span> (+
              GST)
            </h3>
            <p className="mt-2.5 text-xl">Limited Time Discount Applied!</p>
            <button
              className="px-4 py-1.5 mt-5 text-4xl text-white rounded-2xl border border-fuchsia-500 border-solid bg-fuchsia-950 bg-opacity-80 hover:bg-opacity-100 transition-colors"
              onClick={() => navigate(`/courses/${courseId}/payment`)}
            >
              Buy Now
            </button>
            <p className="mt-2.5 text-base">
              Batch Starts on <span className="text-[#A60AA3]">{course.batchDate || "Soon"}</span>
            </p>

            <button
              className="px-4 py-1.5 mt-12 text-4xl text-white rounded-2xl border border-fuchsia-500 border-solid bg-fuchsia-950 bg-opacity-80 hover:bg-opacity-100 transition-colors"
              onClick={() => window.open(course.youtubeUrl || "#", "_blank")}
            >
              {course.learnButtonText || "Learn Free"}
            </button>
          </aside>
        </div>
      </section>

      <section className="flex flex-col items-center w-full">
        <hr className="self-stretch w-full mt-20 border border-fuchsia-700 min-h-px" />
        <h2 className="mt-16 text-transparent text-9xl max-md:mt-10 max-md:text-4xl bg-gradient-to-t from-purple-200 to-purple-800 bg-clip-text">
          Zero To Job-Ready
        </h2>
        <p className="text-transparent text-8xl max-md:text-4xl bg-gradient-to-t from-purple-200 to-purple-800 bg-clip-text">
          in 7 months*
        </p>
        <h3 className="mt-32 text-5xl text-transparent max-md:mt-10 max-md:text-4xl bg-gradient-to-t from-purple-200 to-blue-800 bg-clip-text">
          What you will learn
        </h3>
        {course.roadmap && (
          <img
            loading="lazy"
            src={
              course.roadmap.startsWith("http")
                ? course.roadmap
                : `${API_URL}${course.roadmap}`
            }
            alt="Course curriculum overview"
            className="object-contain mt-14 w-full rounded-none aspect-[10.99] max-w-[1216px]"
          />
        )}
        <h2 className="text-white mt-14 text-9xl max-md:mt-10 max-md:text-4xl">Syllabus</h2>
        <p className="mt-2.5 text-5xl text-white max-md:text-4xl">
          Dominate. From <span className="text-[#A60AA3]">Start</span> to Victory.
        </p>
        <button
          className="px-10 py-7 mt-20 max-w-full text-2xl text-white border border-fuchsia-600 border-solid bg-fuchsia-900 bg-opacity-10 rounded-[101px] w-[365px] hover:bg-opacity-20 transition-colors"
          onClick={() => navigate(`/courses/${courseId}/syllabus`)}
        >
          View Complete Syllabus
        </button>
      </section>

      <section className="flex flex-col items-center w-full">
        <h2 className="text-white mt-36 text-8xl max-md:mt-10 max-md:text-4xl">
          More value,Less Cost.
        </h2>
        <p className="text-3xl text-white mt-11 max-md:mt-10">
          Quality and value drive us, delivering more for less cost
        </p>
      </section>
    </>
  );
};

export default CoursePage;

