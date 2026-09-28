"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { GooglePhoneModal } from "./google-phone-modal";
import { fetchMyProfile } from "@/lib/data/students-api";

export function StudentPhoneGuard() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const session = useMockSession();
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const email = (
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    session?.email ||
    ""
  )
    .toLowerCase()
    .trim();

  const userName =
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    session?.name ||
    email.split("@")[0] ||
    "Student";

  const isStaff =
    email === "lexonitservices@gmail.com" ||
    email.includes("admin") ||
    session?.role === "admin" ||
    session?.role === "instructor";

  const checkPhoneRequirement = useCallback(async () => {
    if (!email || isStaff) {
      setChecked(true);
      return;
    }

    // 1. First check localStorage for fast synchronous validation
    if (typeof window !== "undefined") {
      const cachedPhone =
        localStorage.getItem("jks_student_profile_phone_v3") ||
        localStorage.getItem(`jks_student_profile_phone_v3_${email}`) ||
        localStorage.getItem("jks_student_phone");

      if (cachedPhone && cachedPhone.replace(/[^0-9]/g, "").length >= 10) {
        setIsOpen(false);
        setChecked(true);
        return;
      }

      const rawAuth = localStorage.getItem("jks_auth_user");
      if (rawAuth) {
        try {
          const parsed = JSON.parse(rawAuth);
          if (parsed?.phone && String(parsed.phone).replace(/[^0-9]/g, "").length >= 10) {
            setIsOpen(false);
            setChecked(true);
            return;
          }
        } catch {}
      }
    }

    // 2. Query backend profile to check real database record
    try {
      const profile = await fetchMyProfile();
      if (profile) {
        const phoneDigits = String(profile.phone || "").replace(/[^0-9]/g, "");
        if (phoneDigits.length >= 10) {
          // Phone exists in database; cache it locally
          if (typeof window !== "undefined") {
            localStorage.setItem("jks_student_profile_phone_v3", profile.phone!);
            localStorage.setItem(`jks_student_profile_phone_v3_${email}`, profile.phone!);
          }
          setIsOpen(false);
          setChecked(true);
          return;
        }
      }

      // No phone in profile — trigger prompt modal
      setIsOpen(true);
    } catch {
      // If network fails, re-check later
    } finally {
      setChecked(true);
    }
  }, [email, isStaff]);

  useEffect(() => {
    if (!isClerkLoaded && !session) return;
    if (email) {
      void checkPhoneRequirement();
    }
  }, [isClerkLoaded, session, email, checkPhoneRequirement]);

  // Listen for profile updates
  useEffect(() => {
    const handleUpdated = () => {
      setIsOpen(false);
    };
    window.addEventListener("jks_profile_updated", handleUpdated);
    return () => window.removeEventListener("jks_profile_updated", handleUpdated);
  }, []);

  if (!isOpen || isStaff || !email) return null;

  return (
    <GooglePhoneModal
      isOpen={isOpen}
      userEmail={email}
      userName={userName}
      onSuccess={(_savedPhone) => {
        setIsOpen(false);
      }}
    />
  );
}
