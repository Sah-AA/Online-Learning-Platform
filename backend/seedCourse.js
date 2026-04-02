require('dotenv').config();
const mongoose = require('mongoose');
const dbconnection = require('./config/dbconnection');
const Course = require('./models/courseModel');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');

// Sample instructors data
const instructorsData = [
  {
    username: 'Ashok Kumar',
    email: 'ashok.kumar@example.com',
    password: 'password123',
    phone: '9876543210',
    gender: 'male',
    role: 'instructor',
  },
  {
    username: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    phone: '9876543211',
    gender: 'female',
    role: 'instructor',
  },
  {
    username: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    password: 'password123',
    phone: '9876543212',
    gender: 'male',
    role: 'instructor',
  },
];

// Course data matching frontend CourseData.js structure
const getCoursesData = (instructors) => [
  {
    slug: "web-dev-cohort",
    name: "Web Dev Cohort",
    title: "WEB DEV",
    titleHighlight: "COHORT",
    image: "/images/Group7.png",
    roadmap: "/images/Group67.png",
    price: 5999,
    originalPrice: 6000,
    displayPrice: 3000,
    batchDate: "21st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=yG8JMlldoCE",
    learnButtonText: "Learn basic of WebDev",
    tags: ["HTML", "CSS", "JAVASCRIPT", "NEXT.JS", "NODE", "DATABASE"],
    baseAmount: 3529,
    platformFees: 2471,
    gst: 1080,
    instructor: instructors[0]._id,
    syllabus: [
      {
        title: "Networking",
        items: [
          "Introduction to networking",
          "Networking concepts",
          "Networking protocols",
          "Types of networking",
          "What is TCP and how does it work?",
          "Network Protocols",
          "How does internet works?",
          "OSI vs TCP/IP model",
          "Domain name and DNS records",
        ],
      },
      {
        title: "Linux",
        items: [
          "What is Linux?",
          "Basic Linux commands (Practical)",
          "Cool Features of Linux",
          "Advance Linux commands (Practical)",
          "Basic File System of Linux",
          "Getting Familiar with Linux OS",
        ],
      },
      {
        title: "Setting Up Ethical Hacking Lab",
        items: [
          "Setting Up Lab",
          "Installing Kali or Parrot OS in VMware or VirtualBox",
          "Install VMware or Virtual Box",
          "Downloading a good wordlist for Kali Linux",
        ],
      },
      {
        title: "Footprinting And Reconnaissance",
        items: [
          "Introduction to Footprinting & Reconnaissance",
          "Types of Footprinting",
          "Website footprinting using Netcraft, Wappalyzer, 3rd party sources",
          "DNS footprinting using DNSenum, DNS lookup, MX lookup, NS lookup",
          "Email footprinting using Email Tracker Pro",
          "Entities of information gathering",
          "Source of information gathering",
          "WHOIS footprinting",
          "Performing information gathering using search engines",
          "Footprinting through OSINT framework",
          "Information gathering using Google Dorking and ASO",
          "Footprinting using Kali Linux",
          "DNSenum, DNSRecon, Sublister tools for footprinting",
        ],
      },
      {
        title: "Network Scanning",
        items: [
          "What is network scanning?",
          "Checking for software with versions",
          "Network scanning methodology",
          "OS fingerprinting and banner grabbing countermeasures",
          "Types of network scans",
          "Saving XML report for Metasploit & Conversion",
          "Checking for live systems and Buffer size",
          "Checking for open ports",
          "Checking for services on ports",
        ],
      },
    ],
  },
  {
    slug: "flutter",
    name: "Online Flutter App Development Course",
    title: "Online Flutter",
    titleHighlight: "App",
    subtitle: "Development Course",
    image: "/images/Group35.png",
    roadmap: "/images/Group109.png",
    price: 6999,
    originalPrice: 15000,
    displayPrice: 7000,
    batchDate: "21st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=jqxz7QvdWk8&list=PLjVLYmrlmjGfGLShoW0vVX_tcyT8u1Y3E",
    learnButtonText: "Learn basic of Flutter",
    tags: ["Basics of Dart", "Flutter", "Firebase Components"],
    baseAmount: 3529,
    platformFees: 2471,
    gst: 1080,
    instructor: instructors[1]._id,
    syllabus: [
      {
        title: "Introduction and Flutter Installation",
        items: [
          "Flutter Introduction Demo 1",
          "Flutter Introduction Demo 2",
          "Setup Flutter & IDE",
          "Running App on Real Device and Creating Virtual Device",
        ],
      },
      {
        title: "Basics of Dart",
        items: [
          "Dart Introduction",
          "Fundamentals",
          "Variables",
          "Data Types and Input/Output Dart",
          "Using Functions",
          "Asynchronous calls and classes",
        ],
      },
      {
        title: "Knowing Flutter Architecture and Lifecycle",
        items: [
          "Stepping into Flutter, Architecture, All About Widgets",
          "How Request Occurs, Intro of Stateless Widgets, Explaining main.dart",
        ],
      },
      {
        title: "Flutter Basics UI elements",
        items: [
          "Basic Widgets: Container, Center, Padding, SizedBox",
          "Buttons & its kinds",
          "State & Stateless, Align, Card",
          "Creating your own Scaffold App UI",
        ],
      },
      {
        title: "Introduction to Stateful Widgets",
        items: [
          "What is Stateful Widget?",
          "Understanding Stateful Widget",
          "Text and Image",
        ],
      },
      {
        title: "Creating Multi Screen App",
        items: [
          "Navigation, Multiple Pages, UI Implementation",
          "Splash screen & Stateless Handling",
        ],
      },
    ],
  },
  {
    slug: "hacking",
    name: "Online Ethical Hacking Courses",
    title: "Online Ethical",
    titleHighlight: "Hacking",
    titleSuffix: "Courses",
    description: "Learn the basics of ethical hacking and cyber security with the best online ethical hacker course in India. This training program is designed for beginners and covers core concepts, hacking methodologies, tools, techniques, and more.",
    image: "/images/Group34.png",
    roadmap: "/images/Group107.png",
    price: 3000,
    originalPrice: 6000,
    displayPrice: 3000,
    batchDate: "21st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=vK4Mno4QYqk",
    learnButtonText: "Learn basic of Hacking",
    tags: ["Networking", "Linux", "Network Scanning"],
    baseAmount: 1764,
    platformFees: 1236,
    gst: 540,
    instructor: instructors[2]._id,
    syllabus: [
      {
        title: "Networking",
        items: [
          "Introducing to networking",
          "Networking concepts",
          "Networking Protocols",
          "Types of networking",
          "What is TCP and how does it work?",
          "Network Protocols",
          "How does internet work?",
          "OSI vs TCP/IP model",
          "Domain name and Dns records",
          "Role of networking ports",
        ],
      },
      {
        title: "Linux",
        items: [
          "What is Linux?",
          "Basic Linux commands (Practical)",
          "Cool Feature of Linux",
          "Advanced Linux commands (Practical)",
          "Basic File system of Linux",
          "Getting Familiar with Linux OS",
        ],
      },
      {
        title: "Setting Up Ethical Hacking Lab",
        items: [
          "Setting Up Lab",
          "Installing Kali or Parrot OS in VMware or VirtualBox",
          "Install VMware or Virtual Box",
          "Downloading a good wordlist for Kali Linux",
        ],
      },
    ],
  },
  {
    slug: "nodejs",
    name: "Complete Node.js + Express.js + MongoDB",
    title: "Complete",
    titleHighlight: "Node.js",
    titleParts: [
      { text: "Node.js", highlight: true },
      { text: " + ", highlight: false },
      { text: "Express.js", highlight: true },
      { text: " + ", highlight: false },
      { text: "MongoDB", highlight: true },
    ],
    image: "/images/Group32.png",
    roadmap: "/images/Group67.png",
    price: 5999,
    originalPrice: 11999,
    displayPrice: 5999,
    batchDate: "27st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=ohIAiuHMKMI",
    learnButtonText: "Learn basic of Nodejs",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Project-focused"],
    baseAmount: 3529,
    platformFees: 2471,
    gst: 1080,
    instructor: instructors[0]._id,
    syllabus: [
      {
        title: "API Testing & Documentation",
        items: [
          "Using Postman for API Testing",
          "Writing API Documentation with Swagger",
          "Error Handling & Logging",
        ],
      },
      {
        title: "File Uploads & Handling Images",
        items: [
          "Uploading Files with Multer",
          "Storing Images in MongoDB vs Cloud Storage (Cloudinary, AWS S3)",
          "Serving Static Files in Express",
        ],
      },
      {
        title: "Payment Integration",
        items: [
          "Introduction to Payment Gateways (Stripe, PayPal, Razorpay)",
          "Implementing Stripe Checkout",
          "Handling Webhooks for Payment Confirmation",
        ],
      },
      {
        title: "Email & SMS Notifications",
        items: [
          "Sending Emails with Nodemailer",
          "Setting Up Twilio for SMS Notifications",
          "Scheduling Automated Emails & Messages",
        ],
      },
      {
        title: "Background Jobs & Task Scheduling",
        items: [
          "Using Node.js with cron jobs",
          "Implementing Queue Processing with BullMQ",
          "Running Asynchronous Background Tasks",
        ],
      },
      {
        title: "Web Scraping with Node.js",
        items: [
          "Introduction to Web Scraping",
          "Using Puppeteer & Cheerio for Scraping Data",
          "Storing & Displaying Scraped Data",
        ],
      },
      {
        title: "Performance Optimization & Caching",
        items: [
          "Caching Data with Redis",
          "Load Balancing & Scaling Node.js Apps",
          "Optimizing MongoDB Queries",
        ],
      },
      {
        title: "Real-time Features",
        items: [
          "Implementing WebSockets for Live Chat",
          "Creating Live Notifications with Socket.io",
          "Building a Collaborative Document Editing Feature",
        ],
      },
    ],
  },
  {
    slug: "web-development",
    name: "Job Ready AI Powered Cohort: Complete Web Development + DSA + Aptitude",
    title: "Job Ready",
    titleHighlight: "AI",
    titleSuffix: "Powered Cohort:",
    subtitle: "Complete Web Development + DSA + Aptitude",
    image: "/images/Group30.png",
    roadmap: "/images/Group67.png",
    price: 5999,
    originalPrice: 11999,
    displayPrice: 5999,
    batchDate: "27st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=l1EssrLxt7E",
    learnButtonText: "Learn basic of Web Development",
    tags: ["MERN STACK", "DSA With JS", "AI Powered", "Placement Focus", "Aptitude"],
    baseAmount: 3529,
    platformFees: 2471,
    gst: 1080,
    instructor: instructors[1]._id,
    syllabus: [
      {
        title: "Generate AI & Application",
        items: [
          "Overview of Generative AI",
          "Building Application with Generative AI",
          "Longcahin for Generative AI",
          "Real-world projects (Resume reviewer, virtual Interviewer)",
        ],
      },
      {
        title: "Frontend Development",
        items: [
          "HTML",
          "CSS",
          "JavaScript",
          "REACT.JS",
          "Response Web Design",
        ],
      },
      {
        title: "Backend Development",
        items: [
          "Node.js",
          "Database",
          "API Development (REST)",
          "Authentication & Authorization",
          "Real-time Communication",
        ],
      },
      {
        title: "DSA",
        items: [
          "Fundamentals",
          "Pattern Programming",
          "Time and Space Complexity",
          "Recursion",
          "Math problem and Algorithms",
        ],
      },
      {
        title: "Data Structures",
        items: [
          "Arrays (1-D, Multi-D)",
          "String",
          "Linked Lists",
          "Stacks and Queues",
          "Trees (Binary Trees, BST)",
          "Hashing (Sets and Maps)",
        ],
      },
      {
        title: "Aptitude & Reasoning",
        items: [
          "Percentage",
          "Profit & Loss",
          "Compound Interest",
          "Ratio & Proportion",
          "Number System",
          "HCF & LCM",
          "Average",
          "Work and Time",
          "Pipes and Cisterns",
        ],
      },
    ],
  },
  {
    slug: "web-development-master",
    name: "Web Development Master Course @dot 1.0 Batch",
    title: "Web Development",
    titleHighlight: "Master",
    subtitle: "Course @dot 1.0 Batch",
    image: "/images/Group31.png",
    roadmap: "/images/Group67.png",
    price: 5999,
    originalPrice: 11999,
    displayPrice: 5999,
    batchDate: "27st May, 25",
    youtubeUrl: "https://www.youtube.com/watch?v=tVzUXW6siu0&list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w",
    learnButtonText: "Learn basic of Web Development Master",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Project-focused"],
    baseAmount: 3529,
    platformFees: 2471,
    gst: 1080,
    instructor: instructors[2]._id,
    syllabus: [
      {
        title: "HTML Basics",
        items: [
          "Setting up tools to Web Development, Basics of HTML",
          "Understanding and Handling Forms and Input",
          "Selectors and Introduction to Styling, Different type of CSS",
        ],
      },
      {
        title: "CSS Basics",
        items: [
          "Selectors, Box Model, Styling Fonts and Images",
          "Learn About Height-Width",
        ],
      },
      {
        title: "Flex Box and Grid",
        items: [
          "CSS Flexbox, Responsiveness, Grid Container",
          "Minor Project based on HTML and CSS",
        ],
      },
      {
        title: "Animation and Responsiveness",
        items: [
          "Animation and keyframes, Transition, Shorthand Animation",
          "Media Query, Responsive Design of Text and Images",
          "Responsive Mini Project",
        ],
      },
      {
        title: "Tailwind Project",
        items: ["A Mini Project with Tailwind"],
      },
      {
        title: "JavaScript Basics",
        items: [
          "Introduction to JS, Variable, Datatypes, Operator Precedence",
          "Control Statements if else, loops, Switch Case, Array and Strings",
          "Scope Chaining, this keyword, Functions, Callback, Arrow Functions",
          "Fill, Filter, Map, Slice, Splice",
        ],
      },
      {
        title: "DOM Manipulation and Modern JS",
        items: [
          "DOM, BOM, Window Object, Mini Project",
          "Async-Await, Event Loop, Event Listeners",
          "Classes and Exports, Getters and Setters, Promises, Fetch",
        ],
      },
      {
        title: "JS Mini Project",
        items: ["Mini Project with HTML, CSS and JS"],
      },
    ],
  },
];

// Function to delete all previous data
const clearDatabase = async () => {
  try {
    const deletedCourses = await Course.deleteMany({});
    console.log(`Deleted ${deletedCourses.deletedCount} courses`);

    const deletedInstructors = await User.deleteMany({ role: 'instructor' });
    console.log(`Deleted ${deletedInstructors.deletedCount} instructors`);

    console.log('✅ Previous data cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Function to seed instructors
const seedInstructors = async () => {
  try {
    const instructorsWithHashedPasswords = await Promise.all(
      instructorsData.map(async (instructor) => {
        const hashedPassword = await bcrypt.hash(instructor.password, 10);
        return {
          ...instructor,
          password: hashedPassword,
        };
      })
    );

    const instructors = await User.insertMany(instructorsWithHashedPasswords);
    console.log(`${instructors.length} instructors seeded successfully`);
    return instructors;
  } catch (error) {
    console.error('Error seeding instructors:', error);
    throw error;
  }
};

// Function to seed courses
const seedCourses = async (instructors) => {
  try {
    const coursesData = getCoursesData(instructors);
    const courses = await Course.insertMany(coursesData);
    console.log(`${courses.length} courses seeded successfully`);
    return courses;
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    dbconnection();

    await new Promise((resolve) => {
      mongoose.connection.on('connected', resolve);
    });

    console.log('Starting database seeding...');

    await clearDatabase();
    const instructors = await seedInstructors();
    await seedCourses(instructors);

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
