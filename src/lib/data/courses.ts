export type Track = "Full Stack" | "Frontend" | "SAP";

export interface Course {
  slug: string;
  title: string;
  track: Track;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  price: number;
  rating: number;
  studentsEnrolled: number;
  summary: string;
  modules: { title: string; topics: string[] }[];
}

export const COURSES: Course[] = [
  {
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    track: "Full Stack",
    level: "Intermediate",
    durationWeeks: 16,
    price: 24999,
    rating: 4.8,
    studentsEnrolled: 2140,
    summary:
      "Core Java, Spring Boot, REST APIs, React, and production deployment — built around real enterprise project work.",
    modules: [
      {
        title: "Core Java & OOP Foundations",
        topics: ["Java syntax & collections", "OOP principles", "Exception handling"],
      },
      {
        title: "Spring Boot & REST APIs",
        topics: ["Spring core & DI", "Building REST services", "Spring Data JPA"],
      },
      {
        title: "Frontend with React",
        topics: ["Component architecture", "State management", "API integration"],
      },
      {
        title: "Deployment & Capstone Project",
        topics: ["CI/CD basics", "Cloud deployment", "Capstone project review"],
      },
    ],
  },
  {
    slug: "dotnet-full-stack-developer",
    title: ".NET Full Stack Developer",
    track: "Full Stack",
    level: "Intermediate",
    durationWeeks: 14,
    price: 22999,
    rating: 4.7,
    studentsEnrolled: 1380,
    summary: "C#, ASP.NET Core, Entity Framework, and Angular — enterprise-grade full stack training.",
    modules: [
      { title: "C# Fundamentals", topics: ["Language basics", "OOP in C#", "LINQ"] },
      { title: "ASP.NET Core APIs", topics: ["Web API design", "Entity Framework Core", "Auth"] },
      { title: "Angular Frontend", topics: ["Components & services", "RxJS", "Routing"] },
    ],
  },
  {
    slug: "modern-frontend-engineering",
    title: "Modern Frontend Engineering with React",
    track: "Frontend",
    level: "Beginner",
    durationWeeks: 10,
    price: 15999,
    rating: 4.9,
    studentsEnrolled: 3020,
    summary: "HTML/CSS/JS fundamentals through advanced React, TypeScript, and performance optimization.",
    modules: [
      { title: "Web Fundamentals", topics: ["Semantic HTML", "Modern CSS", "JS essentials"] },
      { title: "React & TypeScript", topics: ["Hooks", "Typed components", "State management"] },
      { title: "Performance & Testing", topics: ["Core Web Vitals", "Testing Library", "Deployment"] },
    ],
  },
  {
    slug: "sap-abap-professional",
    title: "SAP ABAP Professional Track",
    track: "SAP",
    level: "Intermediate",
    durationWeeks: 12,
    price: 28999,
    rating: 4.6,
    studentsEnrolled: 860,
    summary: "ABAP programming, module pool, RICEFW objects, and S/4HANA extensibility for enterprise consulting roles.",
    modules: [
      { title: "ABAP Foundations", topics: ["Data dictionary", "Reports & modularization"] },
      { title: "RICEFW Development", topics: ["Interfaces", "Conversions", "Enhancements", "Forms"] },
      { title: "S/4HANA Extensibility", topics: ["CDS views", "OData services"] },
    ],
  },
  {
    slug: "sap-mm-consultant",
    title: "SAP MM Functional Consultant",
    track: "SAP",
    level: "Intermediate",
    durationWeeks: 10,
    price: 26999,
    rating: 4.7,
    studentsEnrolled: 640,
    summary: "Procurement, inventory management, and MM integration points for aspiring SAP consultants.",
    modules: [
      { title: "Procure-to-Pay", topics: ["Purchase requisitions", "Purchase orders", "Invoice verification"] },
      { title: "Inventory Management", topics: ["Goods movement", "Stock valuation"] },
    ],
  },
];

export const TRACKS: Track[] = ["Full Stack", "Frontend", "SAP"];

export function getCourseBySlug(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}
