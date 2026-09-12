export type MockRole = "student" | "admin" | "instructor";

export interface MockUser {
  email: string;
  password: string;
  name: string;
  initials: string;
  role: MockRole;
}

// Frontend-only demo accounts — no backend/database involved. This is a
// mock session for exercising the login → role-based redirect → protected
// route flow, not real authentication. See TECHSTACK.md §5 for what the
// real (backend-issued JWT) auth is designed to look like.
export const MOCK_USERS: MockUser[] = [
  {
    email: "pathandavood123@gmail.com",
    password: "davood@123",
    name: "Asif khan",
    initials: "AK",
    role: "student",
  },
  {
    email: "pattandavood123@gmail.com",
    password: "davood@123",
    name: "Davood Khan",
    initials: "DK",
    role: "student",
  },
  {
    email: "lexonitservices@gmail.com",
    password: "admin123",
    name: "Lexon Administrator",
    initials: "LX",
    role: "admin",
  },
];

