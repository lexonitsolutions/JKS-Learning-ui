export type MockRole = "student" | "admin";

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
    email: "student@jkslearning.dev",
    password: "student123",
    name: "Jordan Dsouza",
    initials: "JD",
    role: "student",
  },
  {
    email: "admin@jkslearning.dev",
    password: "admin123",
    name: "Ava Desai",
    initials: "AD",
    role: "admin",
  },
];
