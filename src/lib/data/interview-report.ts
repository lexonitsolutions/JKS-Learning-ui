export const SAMPLE_REPORT = {
  overallScore: 78,
  readinessVerdict: "Interview Ready" as const,
  categories: [
    { label: "Technical Knowledge", score: 82 },
    { label: "Problem Solving", score: 76 },
    { label: "Communication", score: 85 },
    { label: "Answer Quality", score: 74 },
    { label: "Confidence", score: 71 },
  ],
  strengths: [
    "Strong grasp of Spring Boot dependency injection and REST design",
    "Clear, structured answers with good use of concrete examples",
    "Correctly identified trade-offs between synchronous and async processing",
  ],
  weaknesses: [
    "Inconsistent depth on database indexing strategy questions",
    "Hesitation when asked to reason about system scaling under load",
  ],
  recommendedTopics: [
    "Database indexing & query optimization",
    "Horizontal scaling patterns",
    "Caching strategies (Redis)",
  ],
  questions: [
    {
      question: "How would you design a REST API for course enrollment with idempotent purchase handling?",
      answerSummary:
        "Described using unique order IDs and checking existing enrollment before creating a new record.",
      score: 85,
      feedback:
        "Solid answer. Could strengthen by mentioning webhook-driven confirmation over client-side redirect trust.",
    },
    {
      question: "Explain how you'd add a composite index for a high-traffic enrollment lookup query.",
      answerSummary: "Mentioned indexing userId but did not address composite (userId, courseId) indexing.",
      score: 58,
      feedback:
        "Missed the composite index opportunity — review indexing strategy for multi-column WHERE clauses.",
    },
    {
      question: "How would you keep a dashboard fast if analytics events grow to millions of rows?",
      answerSummary: "Suggested caching but did not mention pre-aggregation or background rollups.",
      score: 65,
      feedback:
        "Good instinct on caching. Add pre-aggregated rollup tables to the mental model for this pattern.",
    },
  ],
  improvementPlan: [
    "Review database indexing fundamentals — composite indexes, query plans.",
    "Practice explaining horizontal scaling out loud, 5 minutes daily this week.",
    "Retake a scenario-based interview after completing the recommended topics.",
  ],
};
