## Student and Course Subpages API Documentation

### Overview
This document describes the student-facing endpoints used by the frontend, the request/response formats, and the models referenced in the student learning journey. All endpoints require a valid `Authorization: Bearer <token>` header unless noted.

Base URL: `${NEXT_PUBLIC_API_URL}`

### Models

#### Course
- id: string (Mongo _id)
- title: string
- description: string
- instructorId: string
- modules: Module[] (optional in expanded views)

#### Module
- id: string
- title: string
- description: string
- lessons: Lesson[]

#### Lesson (Page)
- id: string
- moduleId: string
- title: string
- content: string (may be HTML/markdown)
- type: "page" | "assignment" | "quiz" | other
- order_index: number

#### Grade
- id: string
- studentId: string
- courseId: string
- assignmentId: string
- score: number
- max_points: number
- status: "Graded" | "Submitted" | "Not Submitted"
- feedback?: string
- due_date?: string (ISO)
- submitted_at?: string (ISO)

#### Submission
- id: string
- studentId: string
- assignmentId: string
- submittedAt: string (ISO)
- fileUrl?: string
- status: "pending" | "graded"

### Endpoints

#### 1) Student Dashboard
- GET `/api/student/dashboard`
  - Response: Array of enrollments or an object `{ enrollments: Enrollment[] }` where each enrollment includes `course_id`, `status`, `progress_percentage`, `completedLessons`, `totalLessons`, `lastAccessed`, `enrolled_at`.

#### 2) Course Progress
- GET `/api/student/courses/:courseId/progress`
  - Response: `{ progress_percentage: number, completedLessons: number, totalLessons: number, lastAccessed?: string }`

#### 3) Calendar (Deadlines)
- GET `/api/student/calendar`
  - Response: `Array<{ id: string, title: string, type: 'assignment' | 'quiz' | 'task', due_date: string, course_id?: string }>`

#### 4) Notifications
- GET `/api/student/notifications`
  - Response: `Array<{ id: string, type: 'message' | 'update' | 'announcement', title: string, content?: string, time?: string, read: boolean }>`

#### 5) Mark Lesson Complete (FormData)
- POST `/api/student/lessons/:lessonId/complete`
  - Request: multipart/form-data
    - completed: string("true")
    - progress_percentage?: string (0-100)
  - Response: `{ ok: true }` or updated progress object

#### 6) Enrolled Courses
- GET `/api/student/courses` (alias to GET `/api/enrollement`)
  - Response: `Array<{ _id: string, course_id: Course, status: string, enrolled_at: string }>`

#### 7) Grades (by Course)
- GET `/api/student/grades/:courseId`
  - Response: `Grade[]`

#### 8) Submissions (current student)
- GET `/api/student/submissions`
  - Response: `Submission[]`

### Course Subpages (Data Sources)

#### Assignments List
- GET `/api/assignments/:courseId`
  - Response: `Array<{ _id: string, title: string, points?: number, due_date?: string, status?: string, submitted?: boolean, type?: string }>`

#### Modules
- GET `/api/courses/:courseId/modules`
  - Response: `Array<{ _id: string, title: string, description?: string, items?: Lesson[], lessons?: Lesson[] }>`
- GET `/api/courses/modules/:moduleId/lessons`
  - Response: `Lesson[]`

#### Pages Index
- Sourced by fetching modules then flattening `items`/`lessons` with `type === 'page'`

#### Page Content
- Derived from module items/lessons by `pageId` (matches `item.url` or `_id`). Fallback content can come from a CMS or static content when needed.

#### Syllabus
- GET `/api/courses/:courseId`
  - Response: `Course` details; frontend renders course information and description.

### Notes
- Authentication: All student endpoints require JWT in `Authorization` header.
- Request Bodies: Prefer FormData for endpoints that modify state with potential file or future extensibility (e.g., lesson completion), otherwise JSON is acceptable for GETs.
- Error Handling: Standardize error payloads: `{ message: string, code?: string, details?: any }`.

