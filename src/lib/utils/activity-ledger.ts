// Utility for tracking daily student activity (logins, lesson completions, quiz submissions)
// and generating a GitHub-style 52-week activity contribution heatmap.

export type ActivityType = "login" | "lesson" | "assignment" | "assessment";

export interface ActivityDay {
  date: string; // e.g. "Sep 27, 2026"
  rawDate: string; // "YYYY-MM-DD"
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isFuture?: boolean;
}

export interface ActivityMatrix {
  weeks: ActivityDay[][];
  months: string[];
  totalActivities: number;
  currentStreakDays: number;
  longestStreakDays: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatPrettyDate(date: Date): string {
  const m = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

export function getStorageKey(email?: string): string {
  return `jks_activity_ledger_${email || "student"}`;
}

export function getActivityLedger(email?: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const ledger: Record<string, number> = {};
    if (parsed && typeof parsed === "object") {
      Object.keys(parsed).forEach((k) => {
        const val = parsed[k];
        if (typeof val === "number") {
          ledger[k] = val;
        } else if (val && typeof val === "object" && typeof val.total === "number") {
          ledger[k] = val.total;
        }
      });
    }
    return ledger;
  } catch {
    return {};
  }
}

export function recordDailyActivity(
  email?: string,
  type: ActivityType = "login",
  count = 1
): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date();
    const todayStr = formatYMD(today);
    const key = getStorageKey(email);
    const raw = localStorage.getItem(key);
    let ledger: Record<string, any> = {};

    if (raw) {
      try {
        ledger = JSON.parse(raw) || {};
      } catch {
        ledger = {};
      }
    }

    const current = ledger[todayStr];
    let newEntry: { total: number; [k: string]: number } = { total: 0 };

    if (typeof current === "number") {
      newEntry.total = current;
    } else if (current && typeof current === "object") {
      newEntry = { ...current };
    }

    newEntry[type] = (newEntry[type] || 0) + count;
    newEntry.total = (newEntry.total || 0) + count;

    ledger[todayStr] = newEntry;
    localStorage.setItem(key, JSON.stringify(ledger));

    window.dispatchEvent(
      new CustomEvent("jks_activity_updated", {
        detail: { email, date: todayStr, type, count, totalToday: newEntry.total },
      })
    );
  } catch (err) {
    console.warn("Could not record daily activity:", err);
  }
}

export function computeActivityMatrix(
  email?: string,
  fallbackLessons = 0,
  fallbackAssignments = 0
): ActivityMatrix {
  const rawLedger = getActivityLedger(email);
  const ledger: Record<string, number> = { ...rawLedger };

  const today = new Date();
  const todayStr = formatYMD(today);

  // If ledger is empty or has zero total, but student has real lesson/assignment completions,
  // seed them onto recent dates so their progress is immediately visible in the activity graph.
  const initialTotalInLedger = Object.values(ledger).reduce((a, b) => a + b, 0);
  const fallbackTotal = fallbackLessons + fallbackAssignments;

  if (initialTotalInLedger === 0 && fallbackTotal > 0) {
    // Distribute fallback contributions across today and recent active days
    const daysToDistribute = Math.min(5, fallbackTotal);
    let remaining = fallbackTotal;
    for (let i = 0; i < daysToDistribute; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = formatYMD(d);
      const allocated = i === 0 ? Math.ceil(remaining / (daysToDistribute - i)) : Math.max(1, Math.floor(remaining / (daysToDistribute - i)));
      ledger[k] = allocated;
      remaining -= allocated;
      if (remaining <= 0) break;
    }
  }

  // Ensure today has at least 1 activity (the active session/login)
  if (!ledger[todayStr] || ledger[todayStr] < 1) {
    ledger[todayStr] = Math.max(1, ledger[todayStr] || 0);
  }

  // Calculate 52 weeks (364 days) aligned to Sunday-Saturday
  const totalWeeks = 52;
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek)); // Ending Saturday of current week

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalWeeks * 7 - 1)); // 52 weeks back, starting on a Sunday

  const weeks: ActivityDay[][] = [];
  const monthLabels: { index: number; name: string }[] = [];
  let lastMonth = -1;

  let iterDate = new Date(startDate);
  let totalActivities = 0;

  for (let w = 0; w < totalWeeks; w++) {
    const currentWeek: ActivityDay[] = [];

    for (let d = 0; d < 7; d++) {
      const dateYMD = formatYMD(iterDate);
      const isFuture = iterDate.getTime() > today.getTime();
      const count = isFuture ? 0 : (ledger[dateYMD] || 0);

      if (!isFuture) {
        totalActivities += count;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (!isFuture && count > 0) {
        if (count === 1) level = 1;
        else if (count <= 3) level = 2;
        else if (count <= 6) level = 3;
        else level = 4;
      }

      // Check month boundary
      const currentMonth = iterDate.getMonth();
      if (currentMonth !== lastMonth && d === 0) {
        monthLabels.push({ index: w, name: MONTH_NAMES[currentMonth] });
        lastMonth = currentMonth;
      }

      currentWeek.push({
        date: formatPrettyDate(iterDate),
        rawDate: dateYMD,
        count,
        level,
        isFuture,
      });

      iterDate.setDate(iterDate.getDate() + 1);
    }

    weeks.push(currentWeek);
  }

  // Compute Streak: consecutive days ending today or yesterday with count > 0
  let currentStreakDays = 0;
  const checkDate = new Date(today);

  // If today has count > 0, start streak from today; otherwise if yesterday has count > 0, start from yesterday
  const countToday = ledger[formatYMD(checkDate)] || 0;
  if (countToday === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const ymd = formatYMD(checkDate);
    const c = ledger[ymd] || 0;
    if (c > 0) {
      currentStreakDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Compute Longest Streak across all days
  let longestStreakDays = 0;
  let tempStreak = 0;
  const scanDate = new Date(startDate);

  while (scanDate.getTime() <= today.getTime()) {
    const ymd = formatYMD(scanDate);
    const c = ledger[ymd] || 0;
    if (c > 0) {
      tempStreak++;
      if (tempStreak > longestStreakDays) {
        longestStreakDays = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    scanDate.setDate(scanDate.getDate() + 1);
  }

  // Standardize 12-month labels for header display across 52 weeks
  const displayMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Shift months so it starts around the month of startDate
  const startMonthIdx = startDate.getMonth();
  const orderedMonths: string[] = [];
  for (let i = 0; i < 12; i++) {
    orderedMonths.push(displayMonths[(startMonthIdx + i) % 12]);
  }

  return {
    weeks,
    months: orderedMonths,
    totalActivities,
    currentStreakDays: Math.max(currentStreakDays, totalActivities > 0 ? 1 : 0),
    longestStreakDays: Math.max(longestStreakDays, currentStreakDays),
  };
}
