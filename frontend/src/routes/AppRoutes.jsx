import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";

// Public pages
import { About, Home, Courses, Login, PrivacyPolicy, Profile, EditProfile, MyCourses } from "../pages/Index";

// Admin & instructor areas
import { AddCourse, AdminCourse, AdminDashboard, AdminInstructor, AdminStudent, EditStudent, AddInstructors, EditCourse, EditInstructor } from "../components/Admin/Index";
import { InstructorDashboard, InstructorCourses, InstructorProfile, InstructorStudents } from "../components/Instructor/Index";

// Dynamic course views
import CoursePage from "../components/CoursePage";
import PaymentPage from "../components/PaymentPage";
import SyllabusPage from "../components/SyllabusPage";
import PayScannerPage from "../components/PayScannerPage";

const PublicLayout = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

const AdminLayout = ({ children }) => <>{children}</>;
const InstructorLayout = ({ children }) => <>{children}</>;

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/course" element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
        <Route path="/editprofile" element={<PublicLayout><EditProfile /></PublicLayout>} />
        <Route path="/my-courses" element={<PublicLayout><MyCourses /></PublicLayout>} />

        {/* Dynamic course pages */}
        <Route path="/courses/:courseId" element={<PublicLayout><CoursePage /></PublicLayout>} />
        <Route path="/courses/:courseId/syllabus" element={<PublicLayout><SyllabusPage /></PublicLayout>} />
        <Route path="/courses/:courseId/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />
        <Route path="/courses/:courseId/checkout" element={<PublicLayout><PayScannerPage /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/courses" element={<AdminLayout><AdminCourse /></AdminLayout>} />
        <Route path="/admin/students" element={<AdminLayout><AdminStudent /></AdminLayout>} />
        <Route path="/admin/instructors" element={<AdminLayout><AdminInstructor /></AdminLayout>} />
        <Route path="/admin/students/edit/:id" element={<AdminLayout><EditStudent /></AdminLayout>} />
        <Route path="/admin/addcourses" element={<AdminLayout><AddCourse /></AdminLayout>} />
        <Route path="/admin/addinstructors" element={<AdminLayout><AddInstructors /></AdminLayout>} />
        <Route path="/admin/editcourse/:courseId" element={<AdminLayout><EditCourse /></AdminLayout>} />
        <Route path="/admin/editinstructor/:id" element={<AdminLayout><EditInstructor /></AdminLayout>} />

        {/* Instructor */}
        <Route path="/instructor/dashboard" element={<InstructorLayout><InstructorDashboard /></InstructorLayout>} />
        <Route path="/instructor/courses" element={<InstructorLayout><InstructorCourses /></InstructorLayout>} />
        <Route path="/instructor/profile" element={<InstructorLayout><InstructorProfile /></InstructorLayout>} />
        <Route path="/instructor/students" element={<InstructorLayout><InstructorStudents /></InstructorLayout>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
