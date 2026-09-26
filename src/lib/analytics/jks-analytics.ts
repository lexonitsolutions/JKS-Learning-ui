import { event, pageview } from "./gtag";

/**
 * Centralized, typed JKS Analytics Service.
 * Ensures consistent event names and parameter sanitization across the platform.
 * 
 * Strict Privacy Rule:
 * Never sends passwords, auth tokens, credit cards, or raw personal emails to GA4.
 */

export interface CourseEventData {
  course_id?: string;
  course_slug: string;
  course_name: string;
  track?: string;
  price?: number;
}

export interface PlatformEventData {
  event_id: string;
  event_slug?: string;
  event_name: string;
  mode?: string;
}

export interface AssignmentEventData {
  assignment_id: string;
  assignment_title: string;
  course_slug?: string;
  passed?: boolean;
  score?: number;
}

export const jksAnalytics = {
  /**
   * Track virtual page view for SPA route transitions
   */
  pageView: (path: string, title?: string) => {
    pageview(path, title);
  },

  /**
   * Track student / user sign-in
   */
  login: (method: string = "credentials") => {
    event("login", { method });
  },

  /**
   * Track new user registration / sign-up
   */
  signup: (method: string = "credentials") => {
    event("sign_up", { method });
  },

  /**
   * Track course catalog or course detail view
   */
  courseView: (data: CourseEventData) => {
    event("course_view", {
      course_id: data.course_id || data.course_slug,
      course_slug: data.course_slug,
      course_name: data.course_name,
      course_track: data.track || "GENERAL",
    });
  },

  /**
   * Track course enrollment action
   */
  courseEnrollment: (data: CourseEventData) => {
    event("course_enrollment", {
      course_id: data.course_id || data.course_slug,
      course_slug: data.course_slug,
      course_name: data.course_name,
      course_track: data.track || "GENERAL",
      value: data.price || 0,
      currency: "INR",
    });
  },

  /**
   * Track masterclass or event detail view
   */
  eventView: (data: PlatformEventData) => {
    event("event_view", {
      event_id: data.event_id,
      event_slug: data.event_slug || "",
      event_name: data.event_name,
      event_mode: data.mode || "ONLINE",
    });
  },

  /**
   * Track successful registration for a masterclass / event
   */
  eventRegistration: (data: PlatformEventData) => {
    event("event_registration", {
      event_id: data.event_id,
      event_slug: data.event_slug || "",
      event_name: data.event_name,
      event_mode: data.mode || "ONLINE",
    });
  },

  /**
   * Track student opening an assignment/assessment
   */
  assignmentView: (data: AssignmentEventData) => {
    event("assignment_view", {
      assignment_id: data.assignment_id,
      assignment_title: data.assignment_title,
      course_slug: data.course_slug || "general",
    });
  },

  /**
   * Track student submitting an assignment/assessment
   */
  assignmentSubmission: (data: AssignmentEventData) => {
    event("assignment_submission", {
      assignment_id: data.assignment_id,
      assignment_title: data.assignment_title,
      course_slug: data.course_slug || "general",
      passed: Boolean(data.passed),
      score: data.score ?? 0,
    });
  },

  /**
   * Track contact / enquiry / lead form submission
   */
  contactSubmission: (formType: string = "lead_inquiry") => {
    event("contact_form_submission", {
      form_type: formType,
    });
  },
};
