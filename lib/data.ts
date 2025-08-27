import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Inbox,
  History,
  LifeBuoy,
  Home,
  Megaphone,
  ClipboardList,
  MessageSquare,
  GraduationCap,
  FileText,
  Book,
  HelpCircle,
  Link,
  MessageCircle,
  Briefcase,
  GemIcon as Gemini,
  File,
  Folder,
  User2,
} from "lucide-react"

// Main sidebar navigation items
export const mainNavItems = [
  {
    title: "Account",
    icon: User2,
    url: "#",
    subItems: [
      { title: "Notifications", url: "#" },
      { title: "Profile", url: "#" },
      { title: "Files", url: "#" },
      { title: "Settings", url: "#" },
      { title: "ePortfolios", url: "#" },
      { title: "Shared Content", url: "#" },
      { title: "QR for Login", url: "#" },
      { title: "Global Announcements", url: "#" },
    ],
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Courses",
    icon: BookOpen,
    url: "/courses",
  },
  {
    title: "Groups",
    icon: Users,
    url: "#",
  },
  {
    title: "Calendar",
    icon: Calendar,
    url: "#",
  },
  {
    title: "Inbox",
    icon: Inbox,
    url: "#",
  },
  {
    title: "History",
    icon: History,
    url: "#",
  },
  {
    title: "BigBlueButton",
    icon: Link,
    url: "#",
  },
  {
    title: "Group Work",
    icon: Users,
    url: "#",
  },
  {
    title: "Chat",
    icon: MessageCircle,
    url: "#",
  },
  {
    title: "Credentials",
    icon: GraduationCap,
    url: "#",
  },
  {
    title: "Help",
    icon: LifeBuoy,
    url: "#",
  },
]

// Mock data for dashboard "To Do" items
export const dashboardTodoItems = [
  {
    date: "Tomorrow, July 24",
    items: [{ title: "Nothing Planned Yet", type: "info" }],
  },
  {
    date: "Friday, July 25",
    items: [{ title: "Nothing Planned Yet", type: "info" }],
  },
  {
    date: "Saturday, July 26",
    items: [{ title: "Nothing Planned Yet", type: "info" }],
  },
  {
    date: "Sunday, July 27",
    items: [
      {
        title: "FOUNDATIONS PROJECT ASSIGNMENT",
        name: "Final Project Report",
        points: 40,
        dueDate: "DUE: 11:59 PM",
        icon: FileText,
      },
      {
        title: "FOUNDATIONS PROJECT ASSIGNMENT",
        name: "Presentation Slides",
        points: 35,
        dueDate: "DUE: 11:59 PM",
        icon: FileText,
      },
    ],
  },
  {
    date: "July 28 to July 30",
    items: [{ title: "Nothing Planned Yet", type: "info" }],
  },
]

// Mock data for course list sidebar
export const coursesList = [
  {
    id: 1,
    name: "BSE Programme HQ",
    cohort: "Cohort 9",
    term: "Term 2025 May Term",
  },
  {
    id: 2,
    name: "Communicating for Impact",
    cohort: "Cohort 9",
    term: "Term 2025 May Term",
  },
  {
    id: 3,
    name: "Employability Enhancement Program - 1",
    cohort: "May 2024",
    term: "Term 2025 May Term",
  },
  {
    id: 3,
    name: "Ethics Awareness Course",
    cohort: "Cohort 9",
    term: "Term 2025 May Term",
  },
  {
    id: 4,
    name: "Foundations Project",
    cohort: "Cohort 9",
    term: "Term 2025 May Term",
  },
  {
    id: 5,
    name: "Passport to Canvas",
    cohort: "Cohort 9",
    term: "Term 2025 May Term",
  },
]

// Mock data for course-specific navigation
export const courseNavigationItems = [
  { title: "Home", icon: Home, url: "home" },
  { title: "Announcements", icon: Megaphone, url: "announcements" },
  { title: "Assignments", icon: ClipboardList, url: "assignments" },
  { title: "Discussions", icon: MessageSquare, url: "discussions" },
  { title: "Grades", icon: GraduationCap, url: "grades" },
  { title: "People", icon: Users, url: "people" },
  { title: "Pages", icon: FileText, url: "pages" },
  { title: "Files", icon: File, url: "files" },
  { title: "Syllabus", icon: Book, url: "syllabus" },
  { title: "Quizzes", icon: ClipboardList, url: "quizzes" },
  { title: "Modules", icon: Folder, url: "modules" },
  { title: "BigBlueButton", icon: Link, url: "bigbluebutton" },
  { title: "Collaborations", icon: Users, url: "collaborations" },
  { title: "Chat", icon: MessageCircle, url: "chat" },
  { title: "Office 365", icon: Briefcase, url: "office365" },
  { title: "Google Drive", icon: Briefcase, url: "googledrive" },
  { title: "Credentials", icon: GraduationCap, url: "credentials" },
  { title: "Google Gemini", icon: Gemini, url: "googlegemini" },
  { title: "Help", icon: HelpCircle, url: "help" },
]

// Mock data for modules within a course
export const courseModules = [
  {
    id: "topic-1",
    title: "Topic 1: Academic Writing",
    prerequisites: "Communicating for Impact",
    items: [
      { type: "page", title: "Introduction to Academic Writing", url: "introduction-to-academic-writing",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "page", title: "The Writing Process", url: "the-writing-process",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "assignment", title: "Academic Writing Assignment", url: "academic-writing-assignment",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
    ],
  },
  {
    id: "topic-2",
    title: "Topic 2: Deep Dive Into Writing an Argumentative Essays",
    prerequisites: "Communicating for Impact",
    items: [
      { type: "page", title: "Understanding Argumentative Essays", url: "understanding-argumentative-essays",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Crafting a Strong Thesis Statement", url: "crafting-a-strong-thesis-statement",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "page", title: "Developing Arguments and Evidence", url: "developing-arguments-and-evidence",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "assignment", title: "Argumentative Essay Draft", url: "argumentative-essay-draft",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
    ],
  },
  {
    id: "topic-3",
    title: "Topic 3: Voice, Audience & Media Messages",
    prerequisites:
      "Communicating for Impact",
    items: [
      { type: "page", title: "Finding Your Voice", url: "finding-your-voice",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "page", title: "Understanding Your Audience", url: "understanding-your-audience",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending" },
      { type: "page", title: "Media Messages and Impact", url: "media-messages-and-impact",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
    ],
  },
  {
    id: "topic-4",
    title: "Topic 4: Plot Mapping for Storytelling",
    prerequisites: "Communicating for Impact",
    items: [
      { type: "page", title: "Introduction to Storytelling", url: "introduction-storytelling",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Elements of a Plot", url: "elements-of-a-plot",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Plot Mapping Techniques", url: "plot-mapping-techniques",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
    ],
  },
  {
    id: "topic-5",
    title: "Topic 5: Preparing and Delivering a Speech",
    prerequisites:
      "Communicating for Impact",
    items: [
      { type: "page", title: "Preparing & Delivering Impactful Speech", url: "preparing-delivering-impactful-speech",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Topic 5 Flow", url: "topic-5-flow",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Planning Your Speech with Purpose", url: "planning-your-speech-with-purpose",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Learning from the Masters", url: "learning-from-the-masters",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      { type: "page", title: "Building Blocks of a Powerful Speech", url: "building-blocks-of-a-powerful-speech",dueDate:"on 21st Jan" ,points:"out of 30" ,status:"Pending"},
      {
        type: "page",
        title: "From Page to Stage: Delivering with Confidence",
        url: "from-page-to-stage-delivering-with-confidence",
      },
      { type: "page", title: "Additional Resources", url: "additional-resources" },
      {
        type: "assignment",
        title: "Persuasive Mission Presentation_Formative Assignment",
        url: "persuasive-mission-presentation-formative-assignment",
        dueDate: "Jul 13",
        points: "20 pts",
      },
    ],
  },
  {
    id: "course-evaluation",
    title: "Course Evaluation",
    prerequisites: "Communicating for Impact",
    items: [{ type: "page", title: "Course Evaluation", url: "course-evaluation-page", status: "Marked done",dueDate:"on 21st Jan" ,points:"out of 30"}],
  },
]

// Mock data for a specific page content
export const pageContentData = {
  "introduction-storytelling": {
    title: "Introduction: Storytelling",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Storytelling is an ancient art form that has been used across cultures to transmit knowledge, values, and entertainment. In this module, we will explore the fundamental principles of effective storytelling and how they can be applied in various contexts, from academic writing to professional presentations.</p>
      <p>A compelling story can captivate an audience, convey complex ideas, and leave a lasting impression. We will delve into the elements that make a story powerful, including character development, plot structure, and thematic depth.</p>
      <h3>Key Concepts:</h3>
      <ul>
        <li>The narrative arc: exposition, rising action, climax, falling action, resolution.</li>
        <li>Character archetypes and their roles.</li>
        <li>The importance of conflict and resolution.</li>
        <li>Using sensory details to create vivid imagery.</li>
      </ul>
      <p>By the end of this section, you will be able to identify the core components of a well-crafted story and begin to apply these techniques in your own communication.</p>
    `,
    nextPage: {
      title: "Elements of a Plot",
      url: "elements-of-a-plot",
    },
    previousPage: null,
  },
  "elements-of-a-plot": {
    title: "Elements of a Plot",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Every compelling story is built upon a foundational structure known as the plot. Understanding the key elements of a plot is crucial for both analyzing existing narratives and crafting your own.</p>
      <h3>The Five Essential Elements of Plot:</h3>
      <ol>
        <li><strong>Exposition:</strong> The beginning of the story where characters, setting, and basic conflict are introduced.</li>
        <li><strong>Rising Action:</strong> A series of events that build suspense and lead to the climax. This is where the main conflict develops.</li>
        <li><strong>Climax:</strong> The turning point of the story, where the main conflict is confronted directly. It's the moment of highest tension.</li>
        <li><strong>Falling Action:</strong> The events that occur after the climax, leading to the resolution. Loose ends are tied up.</li>
        <li><strong>Resolution:</strong> The conclusion of the story, where the main conflict is resolved, and the story comes to a close.</li>
      </ol>
      <p>These elements work together to create a cohesive and engaging narrative flow, guiding the audience through the story's journey.</p>
    `,
    nextPage: {
      title: "Plot Mapping Techniques",
      url: "plot-mapping-techniques",
    },
    previousPage: {
      title: "Introduction: Storytelling",
      url: "introduction-storytelling",
    },
  },
  "plot-mapping-techniques": {
    title: "Plot Mapping Techniques",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Once you understand the elements of a plot, various techniques can help you map out your story effectively. These tools provide a visual or structural framework to organize your ideas and ensure a coherent narrative.</p>
      <h3>Common Plot Mapping Techniques:</h3>
      <ul>
        <li><strong>Freytag's Pyramid:</strong> A classic five-part structure (exposition, rising action, climax, falling action, denouement/resolution) that visually represents the dramatic arc.</li>
        <li><strong>The Hero's Journey:</strong> A monomythical structure identified by Joseph Campbell, involving a hero's departure, initiation, and return. It's widely used in mythology and modern storytelling.</li>
        <li><strong>Snowflake Method:</strong> A step-by-step process that starts with a single sentence and gradually expands into a full novel, focusing on character, plot, and theme development.</li>
        <li><strong>Three-Act Structure:</strong> Divides the story into a setup, confrontation, and resolution, with key plot points marking transitions between acts.</li>
      </ul>
      <p>Experiment with these techniques to find what works best for your creative process. The goal is to create a roadmap for your story that allows for both structure and flexibility.</p>
    `,
    nextPage: {
      title: "Preparing & Delivering Impactful Speech",
      url: "preparing-delivering-impactful-speech",
    },
    previousPage: {
      title: "Elements of a Plot",
      url: "elements-of-a-plot",
    },
  },
  "preparing-delivering-impactful-speech": {
    title: "Preparing & Delivering Impactful Speech",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Public speaking is one of the most powerful forms of communication. When done effectively, it can inspire, persuade, and move audiences to action. This module will guide you through the process of preparing and delivering speeches that leave a lasting impact.</p>
      <h3>Key Components of Impactful Speech Preparation:</h3>
      <ul>
        <li><strong>Audience Analysis:</strong> Understanding who you're speaking to and what they need to hear.</li>
        <li><strong>Clear Structure:</strong> Organizing your content with a compelling introduction, body, and conclusion.</li>
        <li><strong>Powerful Opening:</strong> Capturing attention from the very first words.</li>
        <li><strong>Memorable Closing:</strong> Leaving your audience with a lasting impression.</li>
      </ul>
      <p>Effective speech delivery combines preparation with authentic presentation. We'll explore techniques for managing nervousness, using voice and body language effectively, and connecting with your audience.</p>
    `,
    nextPage: {
      title: "Topic 5 Flow",
      url: "topic-5-flow",
    },
    previousPage: {
      title: "Plot Mapping Techniques",
      url: "plot-mapping-techniques",
    },
  },
  "topic-5-flow": {
    title: "Topic 5 Flow",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Understanding the flow of Topic 5 is essential for mastering the art of speech preparation and delivery. This overview will guide you through the logical progression of concepts and skills you'll develop.</p>
      <h3>Topic 5 Learning Flow:</h3>
      <ol>
        <li><strong>Foundation:</strong> Understanding the basics of impactful speech preparation</li>
        <li><strong>Planning:</strong> Learning to structure your speech with purpose and clarity</li>
        <li><strong>Inspiration:</strong> Studying master speakers and their techniques</li>
        <li><strong>Building Blocks:</strong> Mastering the essential components of powerful speeches</li>
        <li><strong>Delivery:</strong> Bringing your speech from page to stage with confidence</li>
        <li><strong>Resources:</strong> Accessing additional materials and references</li>
        <li><strong>Practice:</strong> Applying your skills through formative assignments</li>
      </ol>
      <p>Each step builds upon the previous one, creating a comprehensive understanding of effective public speaking. Follow this flow to maximize your learning and skill development.</p>
    `,
    nextPage: {
      title: "Planning Your Speech with Purpose",
      url: "planning-your-speech-with-purpose",
    },
    previousPage: {
      title: "Preparing & Delivering Impactful Speech",
      url: "preparing-delivering-impactful-speech",
    },
  },
  "planning-your-speech-with-purpose": {
    title: "Planning Your Speech with Purpose",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Every great speech begins with a clear purpose. Understanding why you're speaking and what you want to achieve is the foundation of effective communication. This module will teach you how to plan speeches that serve a specific purpose and achieve your intended outcomes.</p>
      <h3>Elements of Purposeful Speech Planning:</h3>
      <ul>
        <li><strong>Clear Objectives:</strong> Defining what you want your audience to think, feel, or do</li>
        <li><strong>Audience-Centered Approach:</strong> Tailoring your message to your specific audience</li>
        <li><strong>Strategic Structure:</strong> Organizing content to support your purpose</li>
        <li><strong>Persuasive Elements:</strong> Incorporating techniques that move your audience toward your goal</li>
      </ul>
      <p>Purpose-driven speeches are more engaging, memorable, and effective. Learn to identify your core message and structure your speech to serve that purpose throughout.</p>
    `,
    nextPage: {
      title: "Learning from the Masters",
      url: "learning-from-the-masters",
    },
    previousPage: {
      title: "Topic 5 Flow",
      url: "topic-5-flow",
    },
  },
  "learning-from-the-masters": {
    title: "Learning from the Masters",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Throughout history, master speakers have demonstrated the power of effective communication. By studying their techniques, strategies, and approaches, we can learn valuable lessons that apply to our own speaking endeavors.</p>
      <h3>Key Lessons from Master Speakers:</h3>
      <ul>
        <li><strong>Authenticity:</strong> Being genuine and true to yourself in your delivery</li>
        <li><strong>Emotional Connection:</strong> Creating bonds with your audience through shared experiences</li>
        <li><strong>Clear Structure:</strong> Organizing ideas in ways that are easy to follow and remember</li>
        <li><strong>Powerful Language:</strong> Choosing words that inspire and motivate</li>
        <li><strong>Confident Delivery:</strong> Projecting authority and credibility through voice and presence</li>
      </ul>
      <p>We'll examine speeches from various contexts - political, business, education, and entertainment - to extract universal principles that you can apply to your own speaking situations.</p>
    `,
    nextPage: {
      title: "Building Blocks of a Powerful Speech",
      url: "building-blocks-of-a-powerful-speech",
    },
    previousPage: {
      title: "Planning Your Speech with Purpose",
      url: "planning-your-speech-with-purpose",
    },
  },
  "building-blocks-of-a-powerful-speech": {
    title: "Building Blocks of a Powerful Speech",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Powerful speeches are built upon fundamental building blocks that work together to create impact. Understanding and mastering these components will enable you to construct speeches that resonate with your audience and achieve your objectives.</p>
      <h3>Essential Building Blocks:</h3>
      <ul>
        <li><strong>Compelling Introduction:</strong> Hooking your audience and establishing your credibility</li>
        <li><strong>Clear Thesis:</strong> Stating your main point in a memorable way</li>
        <li><strong>Supporting Evidence:</strong> Providing facts, stories, and examples that strengthen your argument</li>
        <li><strong>Logical Organization:</strong> Structuring your ideas in a coherent, easy-to-follow manner</li>
        <li><strong>Emotional Appeal:</strong> Connecting with your audience on a human level</li>
        <li><strong>Strong Conclusion:</strong> Reinforcing your message and calling for action</li>
      </ul>
      <p>Each building block serves a specific purpose in your speech. Learn to identify which blocks you need and how to assemble them effectively for maximum impact.</p>
    `,
    nextPage: {
      title: "From Page to Stage: Delivering with Confidence",
      url: "from-page-to-stage-delivering-with-confidence",
    },
    previousPage: {
      title: "Learning from the Masters",
      url: "learning-from-the-masters",
    },
  },
  "from-page-to-stage-delivering-with-confidence": {
    title: "From Page to Stage: Delivering with Confidence",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>The transition from written speech to live delivery is where many speakers face their greatest challenges. This module focuses on the practical aspects of confident speech delivery, helping you bridge the gap between preparation and performance.</p>
      <h3>Confidence-Building Techniques:</h3>
      <ul>
        <li><strong>Voice Projection:</strong> Speaking clearly and audibly to reach your entire audience</li>
        <li><strong>Body Language:</strong> Using posture, gestures, and movement to enhance your message</li>
        <li><strong>Eye Contact:</strong> Connecting with individual audience members</li>
        <li><strong>Pacing and Pauses:</strong> Using timing to emphasize key points and allow for audience processing</li>
        <li><strong>Managing Nervousness:</strong> Channeling energy into enthusiasm rather than anxiety</li>
      </ul>
      <p>Confidence comes from preparation, practice, and understanding that your audience wants you to succeed. Learn techniques to transform nervous energy into powerful delivery.</p>
    `,
    nextPage: {
      title: "Additional Resources",
      url: "additional-resources",
    },
    previousPage: {
      title: "Building Blocks of a Powerful Speech",
      url: "building-blocks-of-a-powerful-speech",
    },
  },
  "additional-resources": {
    title: "Additional Resources",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>To further develop your public speaking skills, we've compiled a comprehensive collection of additional resources. These materials will help you continue your learning journey and refine your speaking abilities.</p>
      <h3>Recommended Resources:</h3>
      <ul>
        <li><strong>Books:</strong> Classic and contemporary texts on public speaking and communication</li>
        <li><strong>Videos:</strong> Recorded speeches and presentations from master communicators</li>
        <li><strong>Practice Exercises:</strong> Activities to build specific speaking skills</li>
        <li><strong>Online Tools:</strong> Digital resources for speech preparation and delivery</li>
        <li><strong>Community Forums:</strong> Opportunities to connect with other learners and share experiences</li>
      </ul>
      <p>Remember that public speaking is a skill that improves with practice. Use these resources to continue developing your abilities and finding your unique voice as a speaker.</p>
    `,
    nextPage: null,
    previousPage: {
      title: "From Page to Stage: Delivering with Confidence",
      url: "from-page-to-stage-delivering-with-confidence",
    },
  },
  "course-evaluation-page": {
    title: "Course Evaluation",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Thank you for completing this course on Communicating for Impact. Your feedback is valuable and will help us improve the learning experience for future students.</p>
      <h3>Course Evaluation Components:</h3>
      <ul>
        <li><strong>Content Quality:</strong> How well did the course materials meet your learning objectives?</li>
        <li><strong>Instructor Effectiveness:</strong> How helpful was the instructor's guidance and feedback?</li>
        <li><strong>Course Structure:</strong> How well was the course organized and paced?</li>
        <li><strong>Practical Application:</strong> How useful were the assignments and practical exercises?</li>
        <li><strong>Overall Experience:</strong> Your general satisfaction with the course</li>
      </ul>
      <p>Please take a few minutes to complete this evaluation. Your honest feedback helps us maintain high standards and continuously improve our educational offerings.</p>
    `,
    nextPage: null,
    previousPage: {
      title: "Additional Resources",
      url: "additional-resources",
    },
  },
  "introduction-to-academic-writing": {
    title: "Introduction to Academic Writing",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Academic writing is a formal style of writing used in universities and scholarly publications. It's characterized by evidence-based arguments, logical structure, and clear, precise language.</p>
      <h3>Key Characteristics of Academic Writing:</h3>
      <ul>
        <li><strong>Formal Tone:</strong> Using appropriate language for scholarly communication</li>
        <li><strong>Evidence-Based:</strong> Supporting claims with credible sources and research</li>
        <li><strong>Clear Structure:</strong> Organizing ideas in a logical, coherent manner</li>
        <li><strong>Objective Perspective:</strong> Presenting balanced viewpoints and avoiding bias</li>
        <li><strong>Precise Language:</strong> Using specific, accurate terminology</li>
      </ul>
      <p>This module will help you develop the skills necessary for effective academic writing across various disciplines and formats.</p>
    `,
    nextPage: {
      title: "The Writing Process",
      url: "the-writing-process",
    },
    previousPage: null,
  },
  "the-writing-process": {
    title: "The Writing Process",
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>The writing process is a series of steps that writers follow to produce clear, effective, and well-organized written work. Understanding this process helps you approach writing tasks systematically and produce better results.</p>
      <h3>Stages of the Writing Process:</h3>
      <ol>
        <li><strong>Prewriting:</strong> Brainstorming, researching, and planning your content</li>
        <li><strong>Drafting:</strong> Creating your initial version, focusing on getting ideas down</li>
        <li><strong>Revising:</strong> Improving content, structure, and clarity</li>
        <li><strong>Editing:</strong> Correcting grammar, punctuation, and formatting</li>
        <li><strong>Publishing:</strong> Finalizing and submitting your work</li>
      </ol>
      <p>Each stage is important and should not be rushed. Good writing is the result of careful attention to each step of the process.</p>
    `,
    nextPage: {
      title: "Understanding Argumentative Essays",
      url: "understanding-argumentative-essays",
    },
    previousPage: {
      title: "Introduction to Academic Writing",
      url: "introduction-to-academic-writing",
    },
  },
}

// Mock data for recent feedback in the "To Do" section
export const recentFeedback = [
  {
    id: "formative-assignment",
    title: "Create Your First Podcast: Formative Assignment",
    status: "16 out of 20",
    comment:
      '"First of all, thank you for attempting to do this podcast. While I didn\'t expect the approach you used, I liked the..."',
  },
  {
    id: "essay-outline",
    title: "Essay Outline_Formative Assignment",
    status: "Incomplete",
    comment: '"Hi Dushimana, thank you for submitting your assignment. You have..."',
  },
]

export const courseToDoItems = [
  {
    title: "Term Paper: Module Summative",
    points: 20,
    dueDate: "Jul 31 at 11:59pm",
    courseGroups: ["C9 Group 11"],
  },
]

export const courseAssignments = [
  {
    id: "term-paper-summative",
    title: "Term Paper_Module Summative",
    status: "Available until Aug 4 at 11:59pm",
    dueDate: "Jul 31 at 11:59pm",
    points: "20 pts",
    type: "upcoming",
  },
  {
    id: "roll-call-attendance",
    title: "Roll Call Attendance",
    status: "-100 pts | Not Yet Graded",
    type: "undated",
  },
  {
    id: "persuasive-mission-presentation",
    title: "Persuasive Mission Presentation_Formative Assignment",
    status: "Closed | Due Jul 11 at 11:59pm | Not Yet Graded",
    type: "past",
  },
  {
    id: "reflection-activity",
    title: "Reflection Activity",
    status: "Due Jul 8 at 10:59pm",
    type: "past",
  },
  {
    id: "create-your-first-podcast",
    title: "Create Your First Podcast_Formative Assignment",
    status: "Due Jun 29 at 11:59pm | 16/20 pts",
    type: "past",
  },
  {
    id: "essay-outline",
    title: "Essay Outline_Formative Assignment",
    status: "Closed | Due Jun 18 at 11:59pm | Incomplete",
    type: "past",
  },
]
