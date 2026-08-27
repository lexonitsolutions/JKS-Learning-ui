import type { Track } from "./courses";

export interface AdminStudent {
  name: string;
  email: string;
  enrolledCourses: number;
  status: "Active" | "Inactive";
  joinedDate: string;
  aiInterviews: number;
}

export const ADMIN_STUDENTS: AdminStudent[] = [
  { name: "Priya Nair", email: "priya.nair@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-05-12", aiInterviews: 4 },
  { name: "Arjun Mehta", email: "arjun.mehta@example.com", enrolledCourses: 2, status: "Active", joinedDate: "2026-04-03", aiInterviews: 6 },
  { name: "Sneha Kulkarni", email: "sneha.kulkarni@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-06-18", aiInterviews: 3 },
  { name: "Rahul Verma", email: "rahul.verma@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-03-22", aiInterviews: 5 },
  { name: "Ananya Iyer", email: "ananya.iyer@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-07-01", aiInterviews: 2 },
  { name: "Karthik Reddy", email: "karthik.reddy@example.com", enrolledCourses: 2, status: "Active", joinedDate: "2026-02-14", aiInterviews: 7 },
  { name: "Divya Menon", email: "divya.menon@example.com", enrolledCourses: 1, status: "Inactive", joinedDate: "2026-01-09", aiInterviews: 1 },
  { name: "Vikram Shah", email: "vikram.shah@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-06-30", aiInterviews: 3 },
  { name: "Neha Kapoor", email: "neha.kapoor@example.com", enrolledCourses: 1, status: "Active", joinedDate: "2026-08-02", aiInterviews: 2 },
];

export interface AdminCourseRow {
  title: string;
  track: Track;
  status: "Published" | "Draft" | "Archived";
  price: number;
  enrolled: number;
  rating: number;
}

export const ADMIN_COURSES: AdminCourseRow[] = [
  { title: "Java Full Stack Developer Mastery", track: "Full Stack", status: "Published", price: 24999, enrolled: 2140, rating: 4.8 },
  { title: ".NET Full Stack Developer", track: "Full Stack", status: "Published", price: 22999, enrolled: 1380, rating: 4.7 },
  { title: "Modern Frontend Engineering with React", track: "Frontend", status: "Published", price: 15999, enrolled: 3020, rating: 4.9 },
  { title: "SAP ABAP Professional Track", track: "SAP", status: "Published", price: 28999, enrolled: 860, rating: 4.6 },
  { title: "SAP MM Functional Consultant", track: "SAP", status: "Published", price: 26999, enrolled: 640, rating: 4.7 },
  { title: "Advanced React Performance & Architecture", track: "Frontend", status: "Draft", price: 18999, enrolled: 0, rating: 0 },
  { title: "SAP FICO Foundations", track: "SAP", status: "Draft", price: 25999, enrolled: 0, rating: 0 },
];

export interface AdminInstructor {
  initials: string;
  name: string;
  role: string;
  assignedCourses: number;
  students: number;
  status: "Active" | "Inactive";
}

export const ADMIN_INSTRUCTORS: AdminInstructor[] = [
  { initials: "RK", name: "Rohit Kapoor", role: "Lead Trainer, Java Full Stack", assignedCourses: 2, students: 3520, status: "Active" },
  { initials: "MS", name: "Meera Subramaniam", role: "Lead Trainer, SAP", assignedCourses: 2, students: 1500, status: "Active" },
  { initials: "DP", name: "Dev Patil", role: "Lead Trainer, Frontend", assignedCourses: 1, students: 3020, status: "Active" },
  { initials: "AF", name: "Aisha Farooqui", role: "AI Interview Design Lead", assignedCourses: 0, students: 0, status: "Active" },
];

export interface AdminAssessmentRow {
  title: string;
  course: string;
  type: "MCQ" | "Assignment" | "Coding Test";
  submissions: number;
  avgScore: number;
  pendingReview: number;
}

export const ADMIN_ASSESSMENTS: AdminAssessmentRow[] = [
  { title: "Core Java & OOP — Module Test", course: "Java Full Stack Developer Mastery", type: "MCQ", submissions: 1840, avgScore: 78, pendingReview: 0 },
  { title: "Spring Boot & REST APIs — Module Test", course: "Java Full Stack Developer Mastery", type: "MCQ", submissions: 1620, avgScore: 71, pendingReview: 0 },
  { title: "Capstone Project Review", course: "Java Full Stack Developer Mastery", type: "Assignment", submissions: 940, avgScore: 82, pendingReview: 12 },
  { title: "Web Fundamentals — Module Test", course: "Modern Frontend Engineering with React", type: "MCQ", submissions: 2410, avgScore: 85, pendingReview: 0 },
  { title: "React Component Challenge", course: "Modern Frontend Engineering with React", type: "Coding Test", submissions: 1980, avgScore: 74, pendingReview: 34 },
  { title: "ABAP Foundations — Module Test", course: "SAP ABAP Professional Track", type: "MCQ", submissions: 690, avgScore: 69, pendingReview: 0 },
  { title: "RICEFW Development Assignment", course: "SAP ABAP Professional Track", type: "Assignment", submissions: 520, avgScore: 76, pendingReview: 8 },
];

export interface AdminAiInterviewRow {
  student: string;
  technology: string;
  type: "Technical" | "Scenario" | "HR" | "Experience";
  score: number;
  status: "Completed" | "Interrupted";
  date: string;
}

export const ADMIN_AI_INTERVIEWS: AdminAiInterviewRow[] = [
  { student: "Priya Nair", technology: "SAP MM", type: "Scenario", score: 89, status: "Completed", date: "2026-08-19" },
  { student: "Arjun Mehta", technology: "Java Full Stack", type: "Technical", score: 84, status: "Completed", date: "2026-08-18" },
  { student: "Sneha Kulkarni", technology: "React", type: "Technical", score: 91, status: "Completed", date: "2026-08-18" },
  { student: "Rahul Verma", technology: ".NET Full Stack", type: "Scenario", score: 80, status: "Completed", date: "2026-08-17" },
  { student: "Karthik Reddy", technology: "React", type: "HR", score: 93, status: "Completed", date: "2026-08-16" },
  { student: "Vikram Shah", technology: "Java Full Stack", type: "Experience", score: 0, status: "Interrupted", date: "2026-08-15" },
  { student: "Neha Kapoor", technology: "React", type: "Technical", score: 92, status: "Completed", date: "2026-08-14" },
];

export interface AdminCertificateRow {
  student: string;
  course: string;
  verificationId: string;
  issuedDate: string;
}

export const ADMIN_CERTIFICATES: AdminCertificateRow[] = [
  { student: "Priya Nair", course: "SAP MM Functional Consultant", verificationId: "CERT-8F21A9", issuedDate: "2026-07-30" },
  { student: "Arjun Mehta", course: "Java Full Stack Developer Mastery", verificationId: "CERT-3B77E2", issuedDate: "2026-07-22" },
  { student: "Sneha Kulkarni", course: "Modern Frontend Engineering with React", verificationId: "CERT-9C14D0", issuedDate: "2026-06-30" },
  { student: "Divya Menon", course: "SAP MM Functional Consultant", verificationId: "CERT-2A65F8", issuedDate: "2026-06-12" },
];

export interface AdminPaymentRow {
  id: string;
  student: string;
  course: string;
  amount: number;
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
}

export const ADMIN_PAYMENTS: AdminPaymentRow[] = [
  { id: "PAY-10293", student: "Priya Nair", course: "SAP MM Functional Consultant", amount: 26999, status: "Success", date: "2026-06-14" },
  { id: "PAY-10318", student: "Sneha Kulkarni", course: "Modern Frontend Engineering with React", amount: 15999, status: "Success", date: "2026-07-22" },
  { id: "PAY-10402", student: "Vikram Shah", course: "SAP ABAP Professional Track", amount: 28999, status: "Failed", date: "2026-08-05" },
  { id: "PAY-10455", student: "Arjun Mehta", course: "Java Full Stack Developer Mastery", amount: 24999, status: "Success", date: "2026-08-10" },
  { id: "PAY-10488", student: "Rahul Verma", course: ".NET Full Stack Developer", amount: 22999, status: "Success", date: "2026-08-12" },
  { id: "PAY-10502", student: "Neha Kapoor", course: "Modern Frontend Engineering with React", amount: 15999, status: "Pending", date: "2026-08-20" },
  { id: "PAY-10511", student: "Karthik Reddy", course: "Modern Frontend Engineering with React", amount: 15999, status: "Refunded", date: "2026-08-21" },
];
