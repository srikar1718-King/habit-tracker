import { useState, useEffect, useRef } from "react";
import {
  Check,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  X,
  Dumbbell,
  Droplet,
  BookOpen,
  Moon,
  Sun,
  Heart,
  Flame,
  Coffee,
  Brain,
  Bike,
  Music2,
  Utensils,
  Smile,
  Leaf,
  Target,
  PenLine,
  Pencil,
  TrendingUp,
  Trophy,
  Lock,
  Calendar,
  BarChart3,
  RotateCcw,
  StickyNote,
  Camera,
  Sparkles,
  Zap,
  Footprints,
  Bath,
  Salad,
  Wallet,
  GraduationCap,
  Bed,
  Guitar,
  PawPrint,
  Gamepad2,
  Palette,
} from "lucide-react";

const ACCENT_GREEN = "#5FCB6C";
const MAX_DIFFICULTY = 5;
const HABITS_KEY = "habits";
const RECORDS_KEY = "day-records";
const PERCENT_KEY = "percent-records";
const NOTES_KEY = "day-notes";
const QUANTITY_KEY = "quantity-records";
const MILESTONES_KEY = "milestone-completions";
const WEEKS_COMPACT = 26;
const WEEKS_DETAIL = 52;
const LONG_PRESS_MS = 550;
const DEFAULT_COLOR = "#5FCB6C";
const DEFAULT_ICON = "target";
const YELLOW = "#F2C94C";

// Fixed fan of offsets/sizes for the wordless "blast from the bottom" celebration
const BURST_PARTICLES = [
  { dx: -95, dy: -150, size: 8, delay: 0, shape: "square", rot: 140 },
  { dx: -70, dy: -185, size: 6, delay: 0.02, shape: "circle", rot: 0 },
  { dx: -40, dy: -205, size: 9, delay: 0.05, shape: "square", rot: -110 },
  { dx: -12, dy: -215, size: 7, delay: 0.01, shape: "circle", rot: 0 },
  { dx: 12, dy: -215, size: 7, delay: 0.01, shape: "circle", rot: 0 },
  { dx: 40, dy: -205, size: 9, delay: 0.05, shape: "square", rot: 110 },
  { dx: 70, dy: -185, size: 6, delay: 0.02, shape: "circle", rot: 0 },
  { dx: 95, dy: -150, size: 8, delay: 0, shape: "square", rot: -140 },
  { dx: -120, dy: -95, size: 6, delay: 0.08, shape: "circle", rot: 0 },
  { dx: -100, dy: -50, size: 5, delay: 0.12, shape: "square", rot: 60 },
  { dx: -60, dy: -30, size: 4, delay: 0.14, shape: "circle", rot: 0 },
  { dx: -25, dy: -110, size: 6, delay: 0.07, shape: "square", rot: -70 },
  { dx: 25, dy: -110, size: 6, delay: 0.07, shape: "square", rot: 70 },
  { dx: 60, dy: -30, size: 4, delay: 0.14, shape: "circle", rot: 0 },
  { dx: 100, dy: -50, size: 5, delay: 0.12, shape: "square", rot: -60 },
  { dx: 120, dy: -95, size: 6, delay: 0.08, shape: "circle", rot: 0 },
  { dx: 0, dy: -70, size: 8, delay: 0.03, shape: "circle", rot: 0 },
  { dx: -140, dy: -20, size: 5, delay: 0.16, shape: "circle", rot: 0 },
  { dx: 140, dy: -20, size: 5, delay: 0.16, shape: "circle", rot: 0 },
  { dx: -15, dy: -160, size: 5, delay: 0.09, shape: "square", rot: 45 },
  { dx: 15, dy: -160, size: 5, delay: 0.09, shape: "square", rot: -45 },
];

// Fragments scattered across a habit card's own footprint (relX/relY as 0-1
// fractions of its width/height) that fly outward + fall as it's deleted.
const SHATTER_FRAGMENTS = [
  { relX: 0.03, relY: 0.9, dx: 55, dy: -60, rot: -110, size: 8 },
  { relX: 0.08, relY: 0.6, dx: 65, dy: -85, rot: 160, size: 6 },
  { relX: 0.05, relY: 0.3, dx: 80, dy: -70, rot: -70, size: 7 },
  { relX: 0.18, relY: 0.85, dx: 70, dy: -95, rot: 200, size: 6 },
  { relX: 0.22, relY: 0.55, dx: 90, dy: -100, rot: 50, size: 8 },
  { relX: 0.15, relY: 0.2, dx: 95, dy: -80, rot: -140, size: 5 },
  { relX: 0.32, relY: 0.75, dx: 85, dy: -110, rot: 80, size: 7 },
  { relX: 0.38, relY: 0.4, dx: 100, dy: -95, rot: 130, size: 6 },
  { relX: 0.3, relY: 0.1, dx: 105, dy: -70, rot: -90, size: 8 },
  { relX: 0.48, relY: 0.65, dx: 95, dy: -120, rot: 170, size: 6 },
  { relX: 0.55, relY: 0.85, dx: 80, dy: -105, rot: -60, size: 7 },
  { relX: 0.5, relY: 0.3, dx: 115, dy: -85, rot: 100, size: 6 },
  { relX: 0.65, relY: 0.5, dx: 105, dy: -110, rot: -150, size: 8 },
  { relX: 0.6, relY: 0.15, dx: 110, dy: -65, rot: 90, size: 5 },
  { relX: 0.75, relY: 0.7, dx: 90, dy: -100, rot: -120, size: 5 },
  { relX: 0.82, relY: 0.35, dx: 100, dy: -75, rot: 140, size: 6 },
];

// Small radial burst representing the padlock cracking apart mid coin-flip
const LOCK_SHATTER_PARTICLES = [
  { dx: -38, dy: -22, rot: -80, size: 5 },
  { dx: 38, dy: -22, rot: 80, size: 5 },
  { dx: -26, dy: 32, rot: 120, size: 4 },
  { dx: 26, dy: 32, rot: -120, size: 4 },
  { dx: 0, dy: -42, rot: 40, size: 5 },
  { dx: 0, dy: 42, rot: -40, size: 5 },
  { dx: -42, dy: 6, rot: 160, size: 4 },
  { dx: 42, dy: 6, rot: -160, size: 4 },
  { dx: -18, dy: -36, rot: 60, size: 4 },
  { dx: 18, dy: -36, rot: -60, size: 4 },
];

// Tiny burst used for each of the 3 taps while cracking the lock open
const SPARK_PARTICLES = [
  { dx: -22, dy: -15 },
  { dx: 22, dy: -15 },
  { dx: -16, dy: 20 },
  { dx: 16, dy: 20 },
  { dx: -26, dy: 4 },
  { dx: 26, dy: 4 },
  { dx: 0, dy: -24 },
  { dx: 0, dy: 22 },
];

const PERIODS = [
  { key: "daily", label: "Daily", days: 1 },
  { key: "weekly", label: "Weekly", days: 7 },
  { key: "monthly", label: "Monthly", days: 30 },
];

const COLORS = [
  "#5FCB6C", "#F2C94C", "#EE6C4D", "#E5484D", "#4EA8DE",
  "#9B5DE5", "#F15BB5", "#00BBF9", "#43AA8B", "#F3722C",
  "#FF9F1C", "#118AB2", "#06D6A0", "#EF476F", "#8338EC",
  "#3A86FF", "#FFBE0B", "#FB5607",
];

const ICONS = [
  { key: "target", Icon: Target },
  { key: "dumbbell", Icon: Dumbbell },
  { key: "droplet", Icon: Droplet },
  { key: "book", Icon: BookOpen },
  { key: "moon", Icon: Moon },
  { key: "sun", Icon: Sun },
  { key: "heart", Icon: Heart },
  { key: "flame", Icon: Flame },
  { key: "coffee", Icon: Coffee },
  { key: "brain", Icon: Brain },
  { key: "bike", Icon: Bike },
  { key: "music", Icon: Music2 },
  { key: "utensils", Icon: Utensils },
  { key: "smile", Icon: Smile },
  { key: "leaf", Icon: Leaf },
  { key: "pen", Icon: PenLine },
  { key: "sparkles", Icon: Sparkles },
  { key: "zap", Icon: Zap },
  { key: "footprints", Icon: Footprints },
  { key: "bath", Icon: Bath },
  { key: "salad", Icon: Salad },
  { key: "wallet", Icon: Wallet },
  { key: "graduation", Icon: GraduationCap },
  { key: "bed", Icon: Bed },
  { key: "guitar", Icon: Guitar },
  { key: "paw", Icon: PawPrint },
  { key: "gamepad", Icon: Gamepad2 },
  { key: "palette", Icon: Palette },
];

const WEEKDAYS = [
  { key: "MO", label: "Mon" },
  { key: "TU", label: "Tue" },
  { key: "WE", label: "Wed" },
  { key: "TH", label: "Thu" },
  { key: "FR", label: "Fri" },
  { key: "SA", label: "Sat" },
  { key: "SU", label: "Sun" },
];

function isScheduledOn(habit, dateStr) {
  const freq = habit.frequency;
  if (!freq || freq.type === "everyday") return true;
  if (freq.type === "once") {
    return !!freq.date && freq.date === dateStr;
  }
  if (freq.type === "specific_days") {
    if (!freq.days || freq.days.length === 0) return false;
    const d = parseDate(dateStr);
    const isoDow = (d.getDay() + 6) % 7; // 0 = Monday
    return freq.days.includes(WEEKDAYS[isoDow].key);
  }
  return true;
}

// Visibility differs from scheduling: "specific days" habits still show every day
// (the day selection only affects streak math), but a "once" habit is truly one-off
// and should only ever appear on its single designated date.
function isVisibleOn(habit, dateStr) {
  // A habit marked completed stays visible through the day it was completed
  // on, then disappears starting the next day — it's done, so it shouldn't
  // keep cluttering the daily list.
  if (habit.completed && habit.completedDate && dateStr > habit.completedDate) return false;
  if (habit.frequency?.type === "once") return isScheduledOn(habit, dateStr);
  return true;
}

const ACHIEVEMENT_LEVELS = [
  { key: "bronze", label: "Bronze", threshold: 3, color: "#CD7F32" },
  { key: "silver", label: "Silver", threshold: 7, color: "#C0C0C0" },
  { key: "gold", label: "Gold", threshold: 14, color: "#FFD700" },
  { key: "sapphire", label: "Sapphire", threshold: 30, color: "#2F6FED" },
  { key: "emerald", label: "Emerald", threshold: 60, color: "#50C878" },
  { key: "ruby", label: "Ruby", threshold: 100, color: "#E0115F" },
  { key: "platinum", label: "Platinum", threshold: 180, color: "#9FD8EF" },
  { key: "diamond", label: "Diamond", threshold: 365, color: "#B9F2FF" },
];

// For milestone habits, the day-based thresholds above don't make sense —
// scale them to the habit's own milestone count (or use 1..8 once there are
// 8 or more milestones, since that already exhausts our 8 tiers).
function getMilestoneThresholds(totalMilestones) {
  if (totalMilestones <= 0) return ACHIEVEMENT_LEVELS.map((_, i) => i + 1);
  if (totalMilestones < 8) {
    return ACHIEVEMENT_LEVELS.map((_, i) => Math.max(1, Math.ceil(((i + 1) * totalMilestones) / 8)));
  }
  // 8 or more milestones: spread the 8 trophy tiers evenly across the full
  // milestone count instead of always maxing out at 8 done. E.g. 12
  // milestones -> 12/8 = 1.5, rounded to 2 milestones per trophy, so the
  // tiers land at 2, 4, 6, 8, 10, 12, 14, 16 (the last couple may end up
  // out of reach if the count doesn't divide evenly — that's expected).
  const perTrophy = Math.max(1, Math.round(totalMilestones / 8));
  return ACHIEVEMENT_LEVELS.map((_, i) => (i + 1) * perTrophy);
}

function getEffectiveLevels(habit) {
  if (habit.frequency?.type !== "milestone") return ACHIEVEMENT_LEVELS;
  const thresholds = getMilestoneThresholds((habit.milestones || []).length);
  return ACHIEVEMENT_LEVELS.map((l, i) => ({ ...l, threshold: thresholds[i] }));
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return null;
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

function getIcon(key) {
  return (ICONS.find((i) => i.key === key) || ICONS[0]).Icon;
}

function pctColor(pct) {
  if (pct === null || pct === undefined) return "#6E6E6A";
  const p = Math.max(0, Math.min(100, pct)) / 100;
  const red = [229, 72, 77]; // #E5484D
  const green = [95, 203, 108]; // #5FCB6C
  const r = Math.round(red[0] + (green[0] - red[0]) * p);
  const g = Math.round(red[1] + (green[1] - red[1]) * p);
  const b = Math.round(red[2] + (green[2] - red[2]) * p);
  return `rgb(${r},${g},${b})`;
}

function getWeekStarts(weeks, today) {
  const todayDate = parseDate(today);
  const isoDow = (todayDate.getDay() + 6) % 7;
  const mondayThisWeek = new Date(todayDate);
  mondayThisWeek.setDate(todayDate.getDate() - isoDow);
  const starts = [];
  for (let c = 0; c < weeks; c++) {
    const weekStart = new Date(mondayThisWeek);
    weekStart.setDate(mondayThisWeek.getDate() - (weeks - 1 - c) * 7);
    starts.push(weekStart);
  }
  return starts;
}

function getMonthLabels(weeks, today) {
  const starts = getWeekStarts(weeks, today);
  const labels = new Array(weeks).fill(null);
  let lastMonth = null;
  starts.forEach((d, i) => {
    const m = d.getMonth();
    if (m !== lastMonth) {
      labels[i] = d.toLocaleString("default", { month: "short" });
      lastMonth = m;
    }
  });
  return labels;
}

function getCurrentWeekDates(today) {
  const todayDate = parseDate(today);
  const isoDow = (todayDate.getDay() + 6) % 7;
  const monday = new Date(todayDate);
  monday.setDate(todayDate.getDate() - isoDow);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function DayRing({ pct, size = 40, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const p = pct === null ? 0 : Math.max(0, Math.min(100, pct));
  const offset = circumference * (1 - p / 100);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", transform: "rotate(-90deg)" }}
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#242422" strokeWidth={strokeWidth} />
      {p > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F2C94C"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function lightenColor(hex, amount) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `rgb(${nr},${ng},${nb})`;
}

function darkenColor(hex, amount) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const nr = Math.round(r * (1 - amount));
  const ng = Math.round(g * (1 - amount));
  const nb = Math.round(b * (1 - amount));
  return `rgb(${nr},${ng},${nb})`;
}

const DEFAULT_REMINDER = { enabled: false, time: "09:00", days: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] };

const seedHabits = [
  { id: 1, name: "Drink water", description: "Stay hydrated through the day", difficulty: 1, color: "#4EA8DE", icon: "droplet", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: false, label: "" } },
  { id: 2, name: "Read 20 pages", description: "", difficulty: 3, color: "#9B5DE5", icon: "book", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: true, label: "Pages read" } },
  { id: 3, name: "No phone after 10pm", description: "Wind down before bed", difficulty: 4, color: "#F3722C", icon: "moon", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: false, label: "" } },
];

function fmt(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function StarDisplay({ value, color = YELLOW, mutedColor = "#4A4A47" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_DIFFICULTY }, (_, i) => i + 1).map((i) => {
        const filled = i <= value;
        return (
          <Star
            key={i}
            size={13}
            color={filled ? color : mutedColor}
            fill={filled ? color : "transparent"}
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_DIFFICULTY }, (_, i) => i + 1).map((i) => {
        const filled = i <= value;
        return (
          <button
            key={i}
            type="button"
            className="star-btn"
            aria-label={`Set difficulty to ${i}`}
            onClick={() => onChange(i)}
          >
            <Star
              size={20}
              color={filled ? YELLOW : "#5A5A56"}
              fill={filled ? YELLOW : "transparent"}
              strokeWidth={filled ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, color = ACCENT_GREEN }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="toggle-switch"
      style={{
        width: "46px",
        height: "26px",
        borderRadius: "999px",
        background: checked ? color : "#242422",
        border: `1px solid ${checked ? color : "#3A3A35"}`,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "21px" : "2px",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: "#FFFFFF",
          transition: "left 0.18s ease",
        }}
      />
    </button>
  );
}

// GitHub-style heatmap: columns = weeks (oldest -> newest, left -> right), rows = Mon..Sun.
// Always ends flush at the current week on the right.
function buildHeatmap(habit, weeks, today, records) {
  const todayDate = parseDate(today);
  const isoDow = (todayDate.getDay() + 6) % 7; // 0 = Monday
  const mondayThisWeek = new Date(todayDate);
  mondayThisWeek.setDate(todayDate.getDate() - isoDow);

  const columns = [];
  for (let c = 0; c < weeks; c++) {
    const weekStart = new Date(mondayThisWeek);
    weekStart.setDate(mondayThisWeek.getDate() - (weeks - 1 - c) * 7);
    const col = [];
    for (let r = 0; r < 7; r++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + r);
      const ds = fmt(d);
      const rec = records[ds];
      let state = "none";
      if (rec && habit.id in rec) state = rec[habit.id] ? "done" : "notdone";
      col.push({ date: ds, state });
    }
    columns.push(col);
  }
  return columns;
}

function Heatmap({
  habit,
  weeks,
  today,
  records,
  cellRadius = 2,
  cellHeight = 7,
  cellWidth = 9,
  gap = 2,
  showMonthLabels = false,
}) {
  const columns = buildHeatmap(habit, weeks, today, records);
  const monthLabels = showMonthLabels ? getMonthLabels(weeks, today) : null;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const totalWidth = weeks * cellWidth + (weeks - 1) * gap;

  return (
    <div ref={scrollRef} className="hide-scrollbar" style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ width: `${totalWidth}px` }}>
        {showMonthLabels && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${weeks}, ${cellWidth}px)`,
              gap: `${gap}px`,
              marginBottom: "4px",
            }}
          >
            {monthLabels.map((lbl, i) => (
              <div key={i} className="mono" style={{ fontSize: "9px", color: "#6E6E6A", whiteSpace: "nowrap" }}>
                {lbl || ""}
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${weeks}, ${cellWidth}px)`,
            gridTemplateRows: `repeat(7, ${cellHeight}px)`,
            gridAutoFlow: "column",
            gap: `${gap}px`,
          }}
        >
          {columns.flatMap((col, ci) =>
            col.map((cell, ri) => (
              <div
                key={`${ci}-${ri}`}
                title={cell.date}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: `${cellRadius}px`,
                  background:
                    cell.state === "done"
                      ? habit.color
                      : cell.state === "notdone"
                      ? hexToRgba(habit.color, 0.22)
                      : hexToRgba(habit.color, 0.1),
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Builds one {date, pct} point per day, starting from the earliest day we
// have any signal for (first habit created, or first record on file —
// whichever is earlier) through today. This feeds the continuous trend
// graph, so it naturally grows as the user's history grows.
function buildTrendSeries(habits, records, today) {
  const candidateDates = [];
  habits.forEach((h) => {
    if (h.createdAt) candidateDates.push(fmt(new Date(h.createdAt)));
  });
  Object.keys(records).forEach((ds) => candidateDates.push(ds));

  const todayDate = parseDate(today);
  let startDate = todayDate;
  if (candidateDates.length > 0) {
    const earliest = candidateDates.reduce((min, ds) => (ds < min ? ds : min), candidateDates[0]);
    const earliestDate = parseDate(earliest);
    if (earliestDate < startDate) startDate = earliestDate;
  } else {
    // No data at all yet — still show a short recent window so the graph
    // isn't a single empty point.
    startDate = new Date(todayDate);
    startDate.setDate(todayDate.getDate() - 13);
  }

  const series = [];
  const cursor = new Date(startDate);
  while (cursor <= todayDate) {
    const ds = fmt(cursor);
    const rec = records[ds];
    let pct = null;
    if (rec) {
      let total = 0;
      let done = 0;
      Object.entries(rec).forEach(([hid, val]) => {
        const hb = habits.find((h) => String(h.id) === String(hid));
        if (!hb) return;
        if (!isVisibleOn(hb, ds)) return;
        total += hb.difficulty;
        if (val) done += hb.difficulty;
      });
      pct = total === 0 ? null : Math.round((done / total) * 100);
    }
    series.push({ date: ds, pct });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

// Continuous, horizontally-scrollable line + area graph of daily completion
// percentage. Renders wide enough to fit one point per day and defaults its
// scroll position to today (the right edge) — scrolling left reveals earlier
// history, all the way back to the first tracked day.
function TrendGraph({ series, todayDate }) {
  const scrollRef = useRef(null);
  const pxPerDay = 14;
  const height = 160;
  const width = Math.max(series.length * pxPerDay, 320);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [series.length]);

  const points = series.map((pt, i) => {
    const x = i * pxPerDay + pxPerDay / 2;
    const p = pt.pct === null ? 0 : pt.pct;
    const y = height - (p / 100) * (height - 16) - 8;
    return { x, y, pt };
  });

  const linePath = points.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
      : "";

  // Sparse date labels so they don't collide — roughly weekly.
  const labelEvery = 7;

  return (
    <div ref={scrollRef} className="hide-scrollbar" style={{ overflowX: "auto", width: "100%" }}>
      <svg width={width} height={height + 22} style={{ display: "block" }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT_GREEN} stopOpacity="0.35" />
            <stop offset="100%" stopColor={ACCENT_GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((gridPct) => {
          const y = height - (gridPct / 100) * (height - 16) - 8;
          return <line key={gridPct} x1={0} y1={y} x2={width} y2={y} stroke="#1C1C19" strokeWidth={1} />;
        })}
        {areaPath && <path d={areaPath} fill="url(#trendFill)" />}
        {linePath && <path d={linePath} fill="none" stroke={ACCENT_GREEN} strokeWidth={2} />}
        {points.map((pt, i) => {
          if (pt.pt.pct === null) return null;
          const isToday = pt.pt.date === fmt(todayDate);
          return <circle key={i} cx={pt.x} cy={pt.y} r={isToday ? 3.5 : 2} fill={isToday ? YELLOW : ACCENT_GREEN} />;
        })}
        {series.map((pt, i) => {
          if (i % labelEvery !== 0 && i !== series.length - 1) return null;
          const d = parseDate(pt.date);
          return (
            <text
              key={pt.date}
              x={i * pxPerDay + pxPerDay / 2}
              y={height + 16}
              textAnchor="middle"
              fontSize="9"
              fontFamily="'IBM Plex Mono', monospace"
              fill="#6E6E6A"
            >
              {d.toLocaleDateString("default", { month: "short", day: "numeric" })}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function buildFullMonthGrid(monthCursor) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekdayIso = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstWeekdayIso);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export default function HabitTracker() {
  const today = fmt(new Date());

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState({});
  const [percentRecords, setPercentRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [quantityRecords, setQuantityRecords] = useState({});
  const [milestoneCompletions, setMilestoneCompletions] = useState({});
  const [statsHabit, setStatsHabit] = useState(null);
  const [noteModalHabit, setNoteModalHabit] = useState(null);
  const [noteInputValue, setNoteInputValue] = useState("");
  const [cameraNotice, setCameraNotice] = useState(false);
  const [period, setPeriod] = useState("weekly");
  const [selectedDate, setSelectedDate] = useState(today);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [frequencyType, setFrequencyType] = useState("everyday");
  const [frequencyDays, setFrequencyDays] = useState([]);
  const [onceDate, setOnceDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderDays, setReminderDays] = useState(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [quantityLabel, setQuantityLabel] = useState("");
  const [milestoneInputs, setMilestoneInputs] = useState([{ id: null, text: "", deadline: "" }]);
  const lastRandomPickRef = useRef({ color: null, icon: null });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [shatter, setShatter] = useState(null);
  const cardRefs = useRef({});
  const doneBtnRef = useRef(null);

  const [percentPrompt, setPercentPrompt] = useState(null); // { habit } | null
  const [percentPromptStep, setPercentPromptStep] = useState("ask"); // 'ask' | 'enter'
  const [percentInputValue, setPercentInputValue] = useState("");
  const [percentEditHabit, setPercentEditHabit] = useState(null); // habit currently being edited via badge tap
  const [quantityEditHabit, setQuantityEditHabit] = useState(null);
  const [quantityInputValue, setQuantityInputValue] = useState("");
  const [animatingId, setAnimatingId] = useState(null);
  const [animatingMilestoneKey, setAnimatingMilestoneKey] = useState(null);
  const [burst, setBurst] = useState(null);

  const [detailHabit, setDetailHabit] = useState(null);
  const [achievementsHabit, setAchievementsHabit] = useState(null);
  const [calendarHabit, setCalendarHabit] = useState(null);
  const [trophyUnlock, setTrophyUnlock] = useState(null);
  const [detailMonthCursor, setDetailMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [milestoneToast, setMilestoneToast] = useState(null); // { id, title, body } | null
  const [showTrendGraph, setShowTrendGraph] = useState(false);
  const [completeHabitConfirm, setCompleteHabitConfirm] = useState(null); // habit pending "mark completed" confirmation

  const pressRef = useRef({ timer: null, longPressed: false });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    let h = seedHabits;
    let r = {};
    let p = {};
    try {
      const hRes = await window.storage.get(HABITS_KEY, false);
      if (hRes) h = JSON.parse(hRes.value);
    } catch (e) {}
    try {
      const rRes = await window.storage.get(RECORDS_KEY, false);
      if (rRes) r = JSON.parse(rRes.value);
    } catch (e) {}
    try {
      const pRes = await window.storage.get(PERCENT_KEY, false);
      if (pRes) p = JSON.parse(pRes.value);
    } catch (e) {}
    let n = {};
    try {
      const nRes = await window.storage.get(NOTES_KEY, false);
      if (nRes) n = JSON.parse(nRes.value);
    } catch (e) {}
    let q = {};
    try {
      const qRes = await window.storage.get(QUANTITY_KEY, false);
      if (qRes) q = JSON.parse(qRes.value);
    } catch (e) {}
    let m = {};
    try {
      const mRes = await window.storage.get(MILESTONES_KEY, false);
      if (mRes) m = JSON.parse(mRes.value);
    } catch (e) {}

    const todayRecord = { ...(r[today] || {}) };
    h.forEach((hb) => {
      if (hb.frequency?.type === "milestone") return;
      if (hb.frequency?.type === "once" && hb.frequency.date && hb.frequency.date !== today) return;
      if (!(hb.id in todayRecord)) todayRecord[hb.id] = false;
    });
    r = { ...r, [today]: todayRecord };

    setHabits(h);
    setRecords(r);
    setPercentRecords(p);
    setNotes(n);
    setQuantityRecords(q);
    setMilestoneCompletions(m);
    setLoading(false);

    try {
      await window.storage.set(HABITS_KEY, JSON.stringify(h), false);
      await window.storage.set(RECORDS_KEY, JSON.stringify(r), false);
    } catch (e) {
      console.error("Storage error while initializing:", e);
    }
  }

  async function persistHabits(newHabits) {
    setHabits(newHabits);
    try {
      await window.storage.set(HABITS_KEY, JSON.stringify(newHabits), false);
    } catch (e) {
      console.error("Failed to save habits:", e);
    }
  }

  async function persistRecords(newRecords) {
    setRecords(newRecords);
    try {
      await window.storage.set(RECORDS_KEY, JSON.stringify(newRecords), false);
    } catch (e) {
      console.error("Failed to save records:", e);
    }
  }

  async function persistPercentRecords(newPercentRecords) {
    setPercentRecords(newPercentRecords);
    try {
      await window.storage.set(PERCENT_KEY, JSON.stringify(newPercentRecords), false);
    } catch (e) {
      console.error("Failed to save percent records:", e);
    }
  }

  async function persistNotes(newNotes) {
    setNotes(newNotes);
    try {
      await window.storage.set(NOTES_KEY, JSON.stringify(newNotes), false);
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }

  async function persistQuantityRecords(newQuantityRecords) {
    setQuantityRecords(newQuantityRecords);
    try {
      await window.storage.set(QUANTITY_KEY, JSON.stringify(newQuantityRecords), false);
    } catch (e) {
      console.error("Failed to save quantity records:", e);
    }
  }

  async function persistMilestoneCompletions(newCompletions) {
    setMilestoneCompletions(newCompletions);
    try {
      await window.storage.set(MILESTONES_KEY, JSON.stringify(newCompletions), false);
    } catch (e) {
      console.error("Failed to save milestone completions:", e);
    }
  }

  // ---- Milestone deadline reminders (10h and 4h before due) ----
  // These fire while the app is open: a real browser Notification when
  // permission has been granted, and always an in-app toast as a fallback
  // (browser notifications can't be delivered once the tab is closed since
  // there's no push server behind this app).
  function notifyMilestoneDeadline(habit, milestone, hoursLabel) {
    const title = `${hoursLabel} left`;
    const body = `"${milestone.text}" (${habit.name}) is due soon.`;
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch (e) {
        console.error("Notification failed:", e);
      }
    }
    setMilestoneToast({ id: Date.now() + Math.random(), title, body, color: habit.color });
  }

  useEffect(() => {
    if (milestoneToast === null) return;
    const t = setTimeout(() => setMilestoneToast(null), 6000);
    return () => clearTimeout(t);
  }, [milestoneToast]);

  useEffect(() => {
    const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
    const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

    const checkDeadlines = () => {
      const now = Date.now();
      let anyChanged = false;
      const nextHabits = habits.map((h) => {
        if (h.frequency?.type !== "milestone" || !h.milestones || h.milestones.length === 0) return h;
        const doneMap = milestoneCompletions[h.id] || {};
        let habitChanged = false;
        const nextMilestones = h.milestones.map((m) => {
          if (!m.deadline || doneMap[m.id]) return m;
          const deadlineTime = new Date(m.deadline).getTime();
          if (isNaN(deadlineTime)) return m;
          const msLeft = deadlineTime - now;
          let next = m;
          if (!next.notified10h && msLeft <= TEN_HOURS_MS && msLeft > FOUR_HOURS_MS) {
            notifyMilestoneDeadline(h, m, "10 hours");
            next = { ...next, notified10h: true };
            habitChanged = true;
          }
          if (!next.notified4h && msLeft <= FOUR_HOURS_MS && msLeft > 0) {
            notifyMilestoneDeadline(h, m, "4 hours");
            next = { ...next, notified4h: true };
            habitChanged = true;
          }
          return next;
        });
        if (habitChanged) {
          anyChanged = true;
          return { ...h, milestones: nextMilestones };
        }
        return h;
      });
      if (anyChanged) persistHabits(nextHabits);
    };

    checkDeadlines();
    const intervalId = setInterval(checkDeadlines, 60 * 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, milestoneCompletions]);

  function computeMilestoneCompletedCount(habit) {
    const done = milestoneCompletions[habit.id] || {};
    return (habit.milestones || []).filter((m) => done[m.id]).length;
  }

  // Unified "progress" number that feeds the trophy/badge system: total days
  // done for normal habits, milestones completed for milestone-type habits.
  function computeAchievementProgress(habit) {
    if (habit.frequency?.type === "milestone") return computeMilestoneCompletedCount(habit);
    return computeTotalDays(habit);
  }

  const toggleMilestone = (habit, milestoneId) => {
    const habitDone = { ...(milestoneCompletions[habit.id] || {}) };
    const wasDone = !!habitDone[milestoneId];
    const willBeDone = !wasDone;
    const oldTotal = computeMilestoneCompletedCount(habit);
    habitDone[milestoneId] = willBeDone ? today : false;
    persistMilestoneCompletions({ ...milestoneCompletions, [habit.id]: habitDone });

    if (willBeDone) {
      const key = `${habit.id}-${milestoneId}`;
      setAnimatingMilestoneKey(key);
      setTimeout(() => setAnimatingMilestoneKey((k) => (k === key ? null : k)), 650);

      const newTotal = oldTotal + 1;
      const levels = getEffectiveLevels(habit);
      const crossed = levels.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTrophyUnlock({ id: Date.now() + Math.random(), habit, level, phase: "tap", taps: 0, tapKey: 0 });
      }
    }
  };

  const updateQuantity = (habitId, dateStr, value) => {
    const num = value === "" ? "" : Math.max(0, Number(value) || 0);
    const dayQty = { ...(quantityRecords[dateStr] || {}) };
    if (value === "") {
      delete dayQty[habitId];
    } else {
      dayQty[habitId] = num;
    }
    persistQuantityRecords({ ...quantityRecords, [dateStr]: dayQty });
  };

  const openQuantityEdit = (habit) => {
    setQuantityInputValue(String(quantityRecords[selectedDate]?.[habit.id] ?? ""));
    setQuantityEditHabit(habit);
  };

  const saveQuantityEdit = () => {
    if (!quantityEditHabit) return;
    updateQuantity(quantityEditHabit.id, selectedDate, quantityInputValue);
    setQuantityEditHabit(null);
  };

  const toggle = (habit, origin) => {
    if (selectedDate > today) return; // can't edit the future
    const rec = { ...(records[selectedDate] || {}) };
    const willBeDone = !rec[habit.id];
    const oldTotal = computeTotalDays(habit);
    rec[habit.id] = willBeDone;
    persistRecords({ ...records, [selectedDate]: rec });

    if (willBeDone) {
      setAnimatingId(habit.id);
      setTimeout(() => setAnimatingId(null), 620);
      setBurst({ id: Date.now() + Math.random(), color: habit.color, origin });
      setTimeout(() => setBurst(null), 1150);

      const newTotal = oldTotal + 1;
      const crossed = ACHIEVEMENT_LEVELS.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTimeout(() => {
          setTrophyUnlock({ id: Date.now() + Math.random(), habit, level, phase: "tap", taps: 0, tapKey: 0 });
        }, 350);
      }
    }
  };

  const toggleForDate = (habitId, dateStr) => {
    if (dateStr > today) return; // can't edit the future
    const habit = habits.find((h) => h.id === habitId);
    const rec = { ...(records[dateStr] || {}) };
    const willBeDone = !rec[habitId];
    const oldTotal = habit ? computeTotalDays(habit) : 0;
    rec[habitId] = willBeDone;
    persistRecords({ ...records, [dateStr]: rec });

    if (willBeDone && habit) {
      const newTotal = oldTotal + 1;
      const crossed = ACHIEVEMENT_LEVELS.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTrophyUnlock({ id: Date.now() + Math.random(), habit, level, phase: "tap", taps: 0, tapKey: 0 });
      }
    }
  };

  const handleLockTap = () => {
    setTrophyUnlock((prev) => {
      if (!prev || prev.phase !== "tap") return prev;
      const newTaps = prev.taps + 1;
      if (newTaps >= 3) {
        setTimeout(() => {
          setTrophyUnlock((p) => (p ? { ...p, phase: "celebrate" } : p));
          setTimeout(() => setTrophyUnlock(null), 3400);
        }, 500);
      }
      return { ...prev, taps: newTaps, tapKey: prev.tapKey + 1 };
    });
  };

  const remove = (habitId) => {
    const newHabits = habits.filter((h) => h.id !== habitId);
    persistHabits(newHabits);
    const newRecords = {};
    Object.keys(records).forEach((date) => {
      const rec = { ...records[date] };
      delete rec[habitId];
      newRecords[date] = rec;
    });
    persistRecords(newRecords);
  };

  function pickRandomColorAndIcon() {
    const prev = lastRandomPickRef.current;
    let nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (COLORS.length > 1) {
      while (nextColor === prev.color) {
        nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    }
    let nextIcon = ICONS[Math.floor(Math.random() * ICONS.length)].key;
    if (ICONS.length > 1) {
      while (nextIcon === prev.icon) {
        nextIcon = ICONS[Math.floor(Math.random() * ICONS.length)].key;
      }
    }
    lastRandomPickRef.current = { color: nextColor, icon: nextIcon };
    return { color: nextColor, icon: nextIcon };
  }

  function resetAddForm() {
    setEditingHabitId(null);
    setName("");
    setDescription("");
    setDifficulty(1);
    const { color: randColor, icon: randIcon } = pickRandomColorAndIcon();
    setColor(randColor);
    setIcon(randIcon);
    setShowColorPicker(false);
    setShowIconPicker(false);
    setFrequencyType("everyday");
    setFrequencyDays([]);
    setOnceDate("");
    setReminderEnabled(false);
    setReminderTime("09:00");
    setReminderDays(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
    setTrackQuantity(false);
    setQuantityLabel("");
    setMilestoneInputs([{ id: null, text: "", deadline: "" }]);
  }

  const toggleFrequencyDay = (key) => {
    setFrequencyDays((days) => (days.includes(key) ? days.filter((d) => d !== key) : [...days, key]));
  };

  const addMilestoneInput = () => setMilestoneInputs((prev) => [...prev, { id: null, text: "", deadline: "" }]);
  const updateMilestoneInput = (idx, text) =>
    setMilestoneInputs((prev) => prev.map((m, i) => (i === idx ? { ...m, text } : m)));
  const updateMilestoneDeadline = (idx, deadline) => {
    setMilestoneInputs((prev) => prev.map((m, i) => (i === idx ? { ...m, deadline } : m)));
    if (deadline && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  };
  const removeMilestoneInput = (idx) => setMilestoneInputs((prev) => prev.filter((_, i) => i !== idx));

  const toggleReminderDay = (key) => {
    setReminderDays((days) => (days.includes(key) ? days.filter((d) => d !== key) : [...days, key]));
  };

  const addHabit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const frequency =
      frequencyType === "everyday"
        ? { type: "everyday" }
        : frequencyType === "once"
        ? { type: "once", date: onceDate || today }
        : frequencyType === "milestone"
        ? { type: "milestone" }
        : { type: "specific_days", days: frequencyDays };
    const reminder = { enabled: reminderEnabled, time: reminderTime, days: reminderDays };
    const quantityTracking = { enabled: trackQuantity && !!quantityLabel.trim(), label: quantityLabel.trim() };
    const existingHabitForEdit = editingHabitId ? habits.find((h) => h.id === editingHabitId) : null;
    const milestones =
      frequencyType === "milestone"
        ? milestoneInputs
            .filter((m) => m.text.trim())
            .map((m, i) => {
              const id = m.id ?? Date.now() + i;
              const deadline = m.deadline || null;
              const prevMilestone = existingHabitForEdit?.milestones?.find((pm) => pm.id === id);
              // Only carry over "already notified" flags if this milestone's
              // deadline hasn't changed — a new/edited deadline should be
              // able to trigger fresh reminders.
              const deadlineUnchanged = !!prevMilestone && (prevMilestone.deadline || null) === deadline;
              return {
                id,
                text: m.text.trim(),
                deadline,
                notified10h: deadlineUnchanged ? !!prevMilestone.notified10h : false,
                notified4h: deadlineUnchanged ? !!prevMilestone.notified4h : false,
              };
            })
        : [];

    if (editingHabitId) {
      const newHabits = habits.map((h) =>
        h.id === editingHabitId
          ? { ...h, name: trimmed, description: description.trim(), difficulty, color, icon, frequency, reminder, quantityTracking, milestones }
          : h
      );
      persistHabits(newHabits);
      if (frequency.type !== "milestone") {
        const targetDate = frequency.type === "once" ? frequency.date : today;
        const rec = { ...(records[targetDate] || {}) };
        if (!(editingHabitId in rec)) {
          rec[editingHabitId] = false;
        }
        persistRecords({ ...records, [targetDate]: rec });
      }
      resetAddForm();
      setShowAddModal(false);
    } else {
      const id = Date.now();
      const newHabit = {
        id,
        name: trimmed,
        description: description.trim(),
        difficulty,
        color,
        icon,
        frequency,
        reminder,
        usesPercentage: false,
        quantityTracking,
        milestones,
        createdAt: Date.now(),
      };
      persistHabits([...habits, newHabit]);
      if (frequency.type !== "milestone") {
        const targetDate = frequency.type === "once" ? frequency.date : today;
        const rec = { ...(records[targetDate] || {}), [id]: false };
        persistRecords({ ...records, [targetDate]: rec });
      }

      resetAddForm();
      setShowAddModal(false);

      if (frequency.type === "once") {
        setPercentPromptStep("ask");
        setPercentInputValue("");
        setPercentPrompt({ habit: newHabit });
      }
    }
  };

  const openAddModal = () => {
    resetAddForm();
    setSelectedDate(today);
    setShowAddModal(true);
  };
  const closeAddModal = () => {
    resetAddForm();
    setShowAddModal(false);
  };

  const openEditModal = (habit) => {
    setEditingHabitId(habit.id);
    setName(habit.name);
    setDescription(habit.description || "");
    setDifficulty(habit.difficulty);
    setColor(habit.color);
    setIcon(habit.icon);
    setShowColorPicker(false);
    setShowIconPicker(false);
    setFrequencyType(habit.frequency?.type || "everyday");
    setFrequencyDays(habit.frequency?.days || []);
    setOnceDate(habit.frequency?.date || today);
    setReminderEnabled(habit.reminder?.enabled || false);
    setReminderTime(habit.reminder?.time || "09:00");
    setReminderDays(habit.reminder?.days || ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
    setTrackQuantity(habit.quantityTracking?.enabled || false);
    setQuantityLabel(habit.quantityTracking?.label || "");
    setMilestoneInputs(
      habit.milestones && habit.milestones.length > 0
        ? habit.milestones.map((m) => ({ id: m.id, text: m.text, deadline: m.deadline || "" }))
        : [{ id: null, text: "", deadline: "" }]
    );
    setDetailHabit(null);
    setShowAddModal(true);
  };

  const declinePercentPrompt = () => setPercentPrompt(null);

  const acceptPercentPrompt = () => {
    setPercentInputValue("");
    setPercentPromptStep("enter");
  };

  const savePercentPrompt = () => {
    if (!percentPrompt) return;
    const habit = percentPrompt.habit;
    const val = Math.max(0, Math.min(100, Number(percentInputValue) || 0));
    const newHabits = habits.map((h) => (h.id === habit.id ? { ...h, usesPercentage: true } : h));
    persistHabits(newHabits);
    const dateKey = habit.frequency?.type === "once" ? habit.frequency.date : today;
    const dayPercents = { ...(percentRecords[dateKey] || {}), [habit.id]: val };
    persistPercentRecords({ ...percentRecords, [dateKey]: dayPercents });
    setPercentPrompt(null);
  };

  const savePercentEdit = () => {
    if (!percentEditHabit) return;
    const val = Math.max(0, Math.min(100, Number(percentInputValue) || 0));
    const dateKey = percentEditHabit.frequency?.type === "once" ? percentEditHabit.frequency.date : selectedDate;
    const dayPercents = { ...(percentRecords[dateKey] || {}), [percentEditHabit.id]: val };
    persistPercentRecords({ ...percentRecords, [dateKey]: dayPercents });
    setPercentEditHabit(null);
  };

  const openNoteModal = (habit) => {
    setNoteInputValue(notes[today]?.[habit.id] || "");
    setNoteModalHabit(habit);
  };

  const saveNote = () => {
    if (!noteModalHabit) return;
    const trimmed = noteInputValue.trim();
    const dayNotes = { ...(notes[today] || {}) };
    if (trimmed) {
      dayNotes[noteModalHabit.id] = trimmed;
    } else {
      delete dayNotes[noteModalHabit.id];
    }
    persistNotes({ ...notes, [today]: dayNotes });
    setNoteModalHabit(null);
  };

  const openDetail = (habit) => {
    setDetailHabit(habit);
    const d = new Date();
    setDetailMonthCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const closeDetail = () => setDetailHabit(null);

  const openCompleteHabitConfirm = (habit) => setCompleteHabitConfirm(habit);
  const cancelCompleteHabit = () => setCompleteHabitConfirm(null);
  const confirmCompleteHabit = () => {
    const habit = completeHabitConfirm;
    if (!habit) return;
    const newHabits = habits.map((h) => (h.id === habit.id ? { ...h, completed: true, completedDate: today } : h));
    persistHabits(newHabits);
    setCompleteHabitConfirm(null);
    setDetailHabit(null);
  };
  const reopenHabit = (habit) => {
    const newHabits = habits.map((h) => (h.id === habit.id ? { ...h, completed: false, completedDate: null } : h));
    persistHabits(newHabits);
  };

  function computeCurrentStreak(habit) {
    const isDone = (ds) => {
      const rec = records[ds];
      return rec && habit.id in rec ? !!rec[habit.id] : false;
    };
    const scheduled = (d) => isScheduledOn(habit, fmt(d));

    const cursor = parseDate(today);
    let count = 0;
    let safety = 0;
    while (safety < 3650) {
      safety++;
      const ds = fmt(cursor);
      const isTodayDate = ds === today;
      const done = isDone(ds);

      if (done) {
        count++;
      } else if (scheduled(cursor) && !isTodayDate) {
        // a required day was missed in the past -> streak ends
        break;
      }
      // otherwise: either today (still in progress) or a non-required day that
      // wasn't done — neither counts nor breaks the streak, just move on

      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function computeBestStreak(habit) {
    const isDone = (ds) => {
      const rec = records[ds];
      return rec && habit.id in rec ? !!rec[habit.id] : false;
    };
    const scheduled = (d) => isScheduledOn(habit, fmt(d));

    const LOOKBACK_DAYS = 400;
    const start = parseDate(today);
    start.setDate(start.getDate() - (LOOKBACK_DAYS - 1));

    let best = 0;
    let running = 0;
    for (let i = 0; i < LOOKBACK_DAYS; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = fmt(d);
      const isTodayDate = ds === today;
      const done = isDone(ds);

      if (done) {
        running++;
        best = Math.max(best, running);
      } else if (scheduled(d) && !isTodayDate) {
        running = 0;
      }
      // non-required day left undone, or today still in progress: no change
    }
    return best;
  }

  function computeTotalDays(habit) {
    let total = 0;
    Object.values(records).forEach((rec) => {
      if (rec && rec[habit.id]) total++;
    });
    return total;
  }

  function computeQuantityTotal(habit) {
    let total = 0;
    Object.values(quantityRecords).forEach((dayQty) => {
      if (dayQty && typeof dayQty[habit.id] === "number") total += dayQty[habit.id];
    });
    return total;
  }

  function computeHabitScore(habit) {
    let total = 0;
    let done = 0;
    Object.entries(records).forEach(([ds, rec]) => {
      if (!rec || !(habit.id in rec)) return;
      total++;
      if (rec[habit.id]) done++;
    });
    if (total === 0) return null;
    return Math.round((done / total) * 100);
  }

  // Walks the habit's history day-by-day and returns completed streak segments
  // (most recent first), each either "ongoing" (still alive, includes today) or
  // "ended" (broken by a missed required day).
  function computeStreakSegments(habit) {
    const isDone = (ds) => {
      const rec = records[ds];
      return rec && habit.id in rec ? !!rec[habit.id] : false;
    };
    const scheduled = (d) => isScheduledOn(habit, fmt(d));

    const LOOKBACK_DAYS = 400;
    const start = parseDate(today);
    start.setDate(start.getDate() - (LOOKBACK_DAYS - 1));

    const segments = [];
    let runStart = null;
    let runLen = 0;
    let lastDoneDate = null;

    for (let i = 0; i < LOOKBACK_DAYS; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = fmt(d);
      const isTodayDate = ds === today;
      const done = isDone(ds);

      if (done) {
        if (runLen === 0) runStart = ds;
        runLen++;
        lastDoneDate = ds;
      } else if (scheduled(d) && !isTodayDate) {
        if (runLen > 0) {
          segments.push({ length: runLen, startDate: runStart, endDate: lastDoneDate, ongoing: false });
        }
        runLen = 0;
        runStart = null;
      }
    }
    if (runLen > 0) {
      segments.push({ length: runLen, startDate: runStart, endDate: lastDoneDate, ongoing: true });
    }
    return segments.reverse();
  }

  function buildTimelineGroups(habit) {
    const events = [];
    computeStreakSegments(habit).forEach((seg) => {
      events.push({
        kind: seg.ongoing ? "ongoing" : "ended",
        date: seg.ongoing ? today : seg.endDate,
        length: seg.length,
      });
    });
    Object.entries(notes).forEach(([ds, dayNotes]) => {
      if (dayNotes && dayNotes[habit.id]) {
        events.push({ kind: "note", date: ds, text: dayNotes[habit.id] });
      }
    });
    events.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const groups = [];
    let currentMonthKey = null;
    let currentGroup = null;
    events.forEach((ev) => {
      const d = parseDate(ev.date);
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthKey !== currentMonthKey) {
        currentMonthKey = monthKey;
        currentGroup = { label: d.toLocaleString("default", { month: "long", year: "numeric" }), events: [] };
        groups.push(currentGroup);
      }
      currentGroup.events.push(ev);
    });
    return groups;
  }

  const handleCardDown = () => {
    pressRef.current.longPressed = false;
    pressRef.current.timer = setTimeout(() => {
      pressRef.current.longPressed = true;
    }, LONG_PRESS_MS);
  };
  const handleCardUp = (habit) => {
    if (pressRef.current.timer) {
      clearTimeout(pressRef.current.timer);
      pressRef.current.timer = null;
    }
    if (pressRef.current.longPressed) {
      setDeleteTarget(habit);
    } else {
      openDetail(habit);
    }
    pressRef.current.longPressed = false;
  };
  const handleCardLeave = () => {
    if (pressRef.current.timer) {
      clearTimeout(pressRef.current.timer);
      pressRef.current.timer = null;
    }
    pressRef.current.longPressed = false;
  };

  function dayPct(dateStr) {
    const rec = records[dateStr];
    if (!rec) return null;
    let total = 0;
    let done = 0;
    Object.entries(rec).forEach(([hid, val]) => {
      const hb = habits.find((h) => String(h.id) === String(hid));
      if (!hb) return;
      if (!isVisibleOn(hb, dateStr)) return;
      total += hb.difficulty;
      if (val) done += hb.difficulty;
    });
    if (total === 0) return null;
    return Math.round((done / total) * 100);
  }

  function periodAverage() {
    const p = PERIODS.find((p) => p.key === period);
    const base = parseDate(today);
    let sum = 0;
    let count = 0;
    for (let i = 0; i < p.days; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const pct = dayPct(fmt(d));
      if (pct !== null) {
        sum += pct;
        count++;
      }
    }
    return count === 0 ? null : Math.round(sum / count);
  }

  if (loading) {
    return (
      <div
        style={{
          background: "#000000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A8A85",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        Loading your habits…
      </div>
    );
  }

  const avg = periodAverage();
  const selectedPct = dayPct(selectedDate);
  const selectedRecord = records[selectedDate] || {};
  const visibleHabits = habits.filter((h) => isVisibleOn(h, selectedDate));
  const selectedDoneCount = visibleHabits.filter((h) => !!selectedRecord[h.id]).length;
  const selectedTotalCount = visibleHabits.length;
  const selectedIsToday = selectedDate === today;
  const selectedDayLabel = selectedIsToday
    ? "Today"
    : parseDate(selectedDate).toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div
      className="app-root"
      style={{
        background: "#000000",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .fraunces { font-family: 'Fraunces', serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .habit-card { transition: transform 0.1s ease; user-select: none; -webkit-user-select: none; cursor: pointer; }
        .habit-card:active { transform: scale(0.99); }
        @keyframes deleteAway {
          0% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); opacity: 1; filter: blur(0px); }
          100% { clip-path: polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%); opacity: 0; filter: blur(3px); }
        }
        .deleting { animation: deleteAway 0.6s ease-in forwards; pointer-events: none; }
        @keyframes shatterPiece {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.3); opacity: 0; }
          18% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.2); opacity: 0; }
        }
        .shatter-piece {
          position: fixed;
          border-radius: 2px;
          opacity: 0;
          animation: shatterPiece 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
        }
        .name-text { transition: color 0.25s ease; }
        .tick-btn { transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease; }
        .tick-btn:active { transform: scale(0.9); }
        @keyframes tickGlow {
          0% { box-shadow: 0 0 0 0 var(--glow-color); transform: scale(0.75); }
          40% { box-shadow: 0 0 26px 10px var(--glow-color); transform: scale(1.35); }
          100% { box-shadow: 0 0 0 0 transparent; transform: scale(1); }
        }
        .tick-glow { animation: tickGlow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes burstParticle {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.4); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.15); opacity: 0; }
        }
        .burst-particle {
          position: absolute;
          left: 0;
          top: 0;
          animation: burstParticle 1.05s cubic-bezier(0.12, 0.7, 0.25, 1) forwards;
        }
        @keyframes shockwave {
          0% { width: 10px; height: 10px; opacity: 0.9; }
          100% { width: 140px; height: 140px; opacity: 0; }
        }
        .shockwave-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 999px;
          border: 2px solid var(--ring-color);
          transform: translate(-50%, -50%);
          animation: shockwave 0.6s ease-out forwards;
        }
        @keyframes screenFlash {
          0% { opacity: 0.16; }
          100% { opacity: 0; }
        }
        .screen-flash { animation: screenFlash 0.35s ease-out forwards; }
        .star-btn { transition: transform 0.12s ease; background: transparent; border: none; padding: 2px; cursor: pointer; }
        .star-btn:hover { transform: scale(1.15); }
        .period-btn { transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .fab { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .fab:active { transform: scale(0.92); }
        .add-page { animation: fadeIn 0.15s ease-out; }
        @keyframes detailFadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .detail-fade-1 { animation: detailFadeUp 0.45s 0.04s ease-out both; }
        .detail-fade-2 { animation: detailFadeUp 0.45s 0.12s ease-out both; }
        .detail-fade-3 { animation: detailFadeUp 0.45s 0.2s ease-out both; }
        .detail-fade-4 { animation: detailFadeUp 0.45s 0.28s ease-out both; }
        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 36px var(--pulse-color); }
          50% { box-shadow: 0 0 54px var(--pulse-color); }
        }
        .badge-pulse { animation: softPulse 2.2s ease-in-out infinite; }
        .stat-box { transition: transform 0.15s ease, border-color 0.15s ease; }
        .stat-box:active { transform: scale(0.97); }
        @keyframes donePop {
          0% { transform: scale(1); box-shadow: 0 0 0 0 var(--glow-color); }
          35% { transform: scale(1.06); box-shadow: 0 0 0 10px var(--glow-color); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
        }
        .done-pop { animation: donePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes doneRingPulse {
          0% { width: 16px; height: 16px; opacity: 0.85; border-width: 3px; }
          100% { width: 150px; height: 150px; opacity: 0; border-width: 1px; }
        }
        .done-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          border-style: solid;
          pointer-events: none;
          animation: doneRingPulse 0.6s ease-out forwards;
        }
        @keyframes checkPop {
          0% { transform: scale(0.3) rotate(-25deg); opacity: 0; }
          55% { transform: scale(1.35) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes rippleFillScale {
          0% { transform: translate(-50%, -50%) scale(0); }
          100% { transform: translate(-50%, -50%) scale(40); }
        }
        .ripple-fill { animation: rippleFillScale 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes localFlash {
          0% { opacity: 0.55; transform: scale(0.85); }
          100% { opacity: 0; transform: scale(1.7); }
        }
        .done-local-flash {
          position: absolute;
          inset: -24px;
          border-radius: 999px;
          pointer-events: none;
          animation: localFlash 0.5s ease-out forwards;
        }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes milestoneFlash {
          0% { transform: scale(1); box-shadow: 0 0 0 0 var(--glow-color); }
          40% { transform: scale(1.015); box-shadow: 0 0 18px 3px var(--glow-color); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
        }
        .milestone-row-flash { animation: milestoneFlash 0.6s ease-out; }
        .modal-pop { animation: modalPop 0.18s ease-out; }
        @keyframes modalPop { 0% { transform: scale(0.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .swatch-btn { transition: transform 0.12s ease; }
        .swatch-btn:hover { transform: scale(1.08); }
        .month-nav-btn { transition: transform 0.12s ease; }
        .month-nav-btn:active { transform: scale(0.9); }
        .month-day-cell { transition: transform 0.12s ease, background 0.15s ease; user-select: none; -webkit-user-select: none; }
        .month-day-cell:active { transform: scale(0.9); }
        @keyframes trophyBackdropIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .trophy-backdrop { animation: trophyBackdropIn 0.2s ease-out forwards; }
        @keyframes tapBounce {
          0% { transform: scale(1); }
          35% { transform: scale(1.22); }
          65% { transform: scale(0.93); }
          100% { transform: scale(1); }
        }
        .tap-bounce { animation: tapBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes crackLineIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scaleY(0); }
          100% { opacity: 0.9; transform: translate(-50%, -50%) scaleY(1); }
        }
        .crack-line { animation: crackLineIn 0.2s ease-out forwards; }
        @keyframes sparkPop {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2); opacity: 0; }
        }
        .spark-piece { position: absolute; top: 50%; left: 50%; border-radius: 999px; animation: sparkPop 0.5s ease-out forwards; }
        @keyframes dotFillIn {
          0% { transform: scale(0.5); opacity: 0.3; }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .dot-fill { animation: dotFillIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes lockRingPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .lock-ring-pulse { animation: lockRingPulse 1.8s ease-in-out infinite; }
        @keyframes trophyFlash {
          0% { opacity: 0; }
          12% { opacity: 0.65; }
          100% { opacity: 0; }
        }
        .trophy-flash { animation: trophyFlash 0.55s ease-out forwards; }
        @keyframes rayRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
          15% { opacity: 0.55; }
          100% { transform: translate(-50%, -50%) rotate(220deg); opacity: 0.4; }
        }
        .trophy-rays { animation: rayRotate 3.2s ease-out forwards; }
        @keyframes badgeShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-4px, 2px) rotate(-4deg); }
          40% { transform: translate(4px, -2px) rotate(4deg); }
          60% { transform: translate(-3px, 1px) rotate(-3deg); }
          80% { transform: translate(3px, -1px) rotate(3deg); }
        }
        .badge-shake { animation: badgeShake 0.4s 0.42s ease-in-out; }
        @keyframes trophyBadgeIn {
          0% { transform: scale(0.15) rotate(-30deg); opacity: 0; }
          50% { transform: scale(1.4) rotate(10deg); opacity: 1; }
          68% { transform: scale(0.85) rotate(-5deg); }
          82% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .trophy-badge-in { animation: trophyBadgeIn 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes coinFlip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        .coin-flip { animation: coinFlip 0.7s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
        .badge-face {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
        .badge-face-back { transform: rotateY(180deg); }
        @keyframes lockShatterPiece {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.2); opacity: 0; }
        }
        .lock-shatter-piece {
          position: absolute;
          border-radius: 2px;
          opacity: 0;
          animation: lockShatterPiece 0.55s cubic-bezier(0.15, 0.7, 0.25, 1) forwards;
        }
        @keyframes glowRing {
          0% { width: 16px; height: 16px; opacity: 1; border-width: 5px; }
          100% { width: 300px; height: 300px; opacity: 0; border-width: 1px; }
        }
        .glow-ring { animation: glowRing 1.3s ease-out forwards; }
        @keyframes trophyTextIn {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .trophy-text-in { animation: trophyTextIn 0.4s 0.5s ease-out both; }
        @keyframes levelPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .level-pop { animation: levelPop 0.5s 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .trophy-particle {
          position: fixed;
          animation: burstParticle 1.1s cubic-bezier(0.15, 0.7, 0.25, 1) forwards;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .app-root, .app-root * { text-shadow: 0 0 1px currentColor; }
        input:focus, button:focus-visible { outline: 2px solid #5FCB6C; outline-offset: 2px; }
        input::placeholder { color: #6E6E6A; }
        html, body { overflow-x: hidden; max-width: 100%; }
        /* Slightly zoom the habit detail screen out on small phones so the
           whole layout comfortably fits without any side-to-side scrolling. */
        @media (max-width: 480px) {
          .detail-zoom { zoom: 0.92; }
        }
        @keyframes toastSlideIn {
          0% { transform: translate(-50%, -12px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .milestone-toast { animation: toastSlideIn 0.25s ease-out; }
      `}</style>

      {milestoneToast && (
        <div
          className="milestone-toast"
          onClick={() => setMilestoneToast(null)}
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            zIndex: 80,
            width: "calc(100% - 32px)",
            maxWidth: "380px",
            background: "#0D0D0D",
            border: `1px solid ${milestoneToast.color || ACCENT_GREEN}`,
            borderRadius: "12px",
            padding: "12px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <Flame size={13} color={milestoneToast.color || ACCENT_GREEN} />
            <span className="text-xs" style={{ color: milestoneToast.color || ACCENT_GREEN, fontWeight: 700 }}>
              {milestoneToast.title}
            </span>
          </div>
          <div className="text-xs" style={{ color: "#C9C9C4" }}>
            {milestoneToast.body}
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-5 py-10" style={{ paddingBottom: "110px" }}>
        {/* Header */}
        <div className="flex items-baseline justify-between mb-1">
          <h1 className="fraunces text-3xl" style={{ color: "#EDEDEA", fontWeight: 600 }}>
            Strata
          </h1>
          <span className="mono text-xs tracking-wide" style={{ color: "#8A8A85" }}>
            HABIT TRACKER
          </span>
        </div>
        <p className="text-sm mb-6" style={{ color: "#9A9A94" }}>
          Every habit is a layer. Harder ones sit deeper.
        </p>

        {/* This week */}
        <div className="grid grid-cols-7 gap-1 mb-8">
          {getCurrentWeekDates(today).map((d) => {
            const ds = fmt(d);
            const isToday = ds === today;
            const isFuture = ds > today;
            const isSelected = ds === selectedDate;
            const pct = dayPct(ds);
            return (
              <button
                key={ds}
                onClick={() => !isFuture && setSelectedDate(ds)}
                disabled={isFuture}
                className="flex flex-col items-center gap-1.5"
                style={{ opacity: isFuture ? 0.4 : 1, cursor: isFuture ? "default" : "pointer" }}
              >
                <span
                  className="text-xs"
                  style={{ color: isToday || isSelected ? "#EDEDEA" : "#6E6E6A", fontWeight: isToday || isSelected ? 700 : 500 }}
                >
                  {d.toLocaleDateString("default", { weekday: "short" }).slice(0, 3)}
                </span>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    margin: "0 auto",
                    borderRadius: "999px",
                    boxShadow: isSelected ? `0 0 0 2px #000000, 0 0 0 4px ${YELLOW}` : "none",
                  }}
                >
                  <DayRing pct={pct} size={40} strokeWidth={isToday ? 3.5 : 3} />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: isToday ? 700 : 500 }}>
                      {d.getDate()}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Average completion */}
        <div className="rounded-lg p-5 mb-6" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs mono" style={{ color: "#8A8A85" }}>
                AVERAGE COMPLETION
              </span>
              <button
                onClick={() => setShowTrendGraph(true)}
                aria-label="View daily completion trend graph"
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "transparent", border: "1px solid #262622", color: "#8A8A85" }}
              >
                <BarChart3 size={12} />
              </button>
            </div>
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className="period-btn rounded-full px-2.5 py-1 text-xs"
                  style={{
                    background: period === p.key ? ACCENT_GREEN : "transparent",
                    color: period === p.key ? "#000000" : "#9A9A94",
                    border: `1px solid ${period === p.key ? ACCENT_GREEN : "#262622"}`,
                    fontWeight: 500,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ flex: 1, height: "10px", borderRadius: "999px", background: "#161614", overflow: "hidden" }}>
              <div
                style={{
                  width: `${avg ?? 0}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: pctColor(avg),
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            </div>
            <span
              className="mono text-2xl"
              style={{ color: pctColor(avg), fontWeight: 600, minWidth: "3.4em", textAlign: "right" }}
            >
              {avg === null ? "—" : `${avg}%`}
            </span>
          </div>
          <div className="text-xs mt-2" style={{ color: "#8A8A85" }}>
            {avg === null ? "No tracked days in this window yet" : `avg over the last ${PERIODS.find((p) => p.key === period).days} day${PERIODS.find((p) => p.key === period).days === 1 ? "" : "s"}`}
          </div>
        </div>

        {/* Today / selected day */}
        <div className="rounded-lg p-4 mb-6" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              {selectedDayLabel}
            </span>
            <span className="mono text-sm" style={{ color: "#8A8A85" }}>
              {selectedPct === null ? "—" : `${selectedPct}%`}
            </span>
          </div>
          <div className="text-xs" style={{ color: "#8A8A85" }}>
            {selectedDoneCount} of {selectedTotalCount} habit{selectedTotalCount === 1 ? "" : "s"} done
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {habits.length === 0 && (
              <div className="text-sm text-center py-4" style={{ color: "#6E6E6A" }}>
                No habits yet. Tap + to add your first one.
              </div>
            )}

            {habits.length > 0 && visibleHabits.length === 0 && (
              <div className="text-sm text-center py-4" style={{ color: "#6E6E6A" }}>
                Nothing scheduled for this day.
              </div>
            )}

            {visibleHabits.map((h) => {
              const done = !!selectedRecord[h.id];
              const HabitIcon = getIcon(h.icon);
              const isMilestoneHabit = h.frequency?.type === "milestone";
              return (
                <div
                  key={h.id}
                  ref={(el) => {
                    if (el) cardRefs.current[h.id] = el;
                  }}
                  className={`habit-card rounded-lg p-3 flex gap-3 ${deletingId === h.id ? "deleting" : ""}`}
                  style={{ background: "#141412", border: "1px solid #242422" }}
                  onPointerDown={handleCardDown}
                  onPointerUp={() => handleCardUp(h)}
                  onPointerLeave={handleCardLeave}
                  onPointerCancel={handleCardLeave}
                >
                  <div className="shrink-0 flex flex-col items-center" style={{ width: "40px" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ position: "relative", background: hexToRgba(h.color, 0.15) }}
                    >
                      <HabitIcon size={19} color={h.color} />
                      {(() => {
                        const unlockedCount = getEffectiveLevels(h).filter((l) => computeAchievementProgress(h) >= l.threshold).length;
                        return (
                          <div
                            className="flex items-center gap-0.5"
                            style={{
                              position: "absolute",
                              top: "-6px",
                              right: "-8px",
                              background: unlockedCount > 0 ? "#0D0D0D" : "#141412",
                              border: `1px solid ${unlockedCount > 0 ? YELLOW : "#242422"}`,
                              borderRadius: "999px",
                              padding: "1px 5px",
                            }}
                          >
                            <Trophy size={9} color={unlockedCount > 0 ? YELLOW : "#4A4A45"} />
                            <span className="mono" style={{ fontSize: "9px", color: unlockedCount > 0 ? YELLOW : "#4A4A45", fontWeight: 700 }}>
                              {unlockedCount}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    {(() => {
                      const totalDaysDone = computeAchievementProgress(h);
                      const unlocked = getEffectiveLevels(h).filter((l) => totalDaysDone >= l.threshold);
                      const topLevel = unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
                      if (!topLevel) return null;
                      return (
                        <div className="flex flex-col items-center" style={{ marginTop: "5px" }}>
                          <div
                            style={{
                              width: "24px",
                              height: "26px",
                              clipPath: "polygon(50% 0%, 100% 20%, 100% 68%, 50% 100%, 0% 68%, 0% 20%)",
                              background: `linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 38%), linear-gradient(150deg, ${lightenColor(topLevel.color, 0.5)}, ${topLevel.color})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: `0 2px 6px ${hexToRgba(topLevel.color, 0.55)}, inset 1px 1px 2px rgba(255,255,255,0.55), inset -1px -1px 2px rgba(0,0,0,0.35)`,
                            }}
                          >
                            <Star size={11} color={darkenColor(topLevel.color, 0.55)} fill={darkenColor(topLevel.color, 0.55)} strokeWidth={2.5} />
                          </div>
                          <span
                            className="mono"
                            style={{ fontSize: "8px", color: topLevel.color, fontWeight: 700, marginTop: "2px", whiteSpace: "nowrap" }}
                          >
                            {topLevel.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="name-text text-sm truncate"
                        style={{ color: done ? h.color : "#EDEDEA", fontWeight: 500 }}
                      >
                        {h.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {isMilestoneHabit ? (
                          <div
                            className="rounded-full px-3 py-1.5 mono text-xs"
                            style={{ background: hexToRgba(h.color, 0.15), border: `1px solid ${h.color}`, color: h.color, fontWeight: 600 }}
                          >
                            {computeMilestoneCompletedCount(h)}/{(h.milestones || []).length}
                          </div>
                        ) : (
                          <>
                            {h.usesPercentage && (
                              <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerUp={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPercentEditHabit(h);
                                  const dateKey = h.frequency?.type === "once" ? h.frequency.date : selectedDate;
                                  setPercentInputValue(String(percentRecords[dateKey]?.[h.id] ?? 0));
                                }}
                                className="shrink-0 rounded-full px-2 py-1 mono text-xs"
                                style={{
                                  background: hexToRgba(h.color, 0.15),
                                  border: `1px solid ${h.color}`,
                                  color: h.color,
                                  fontWeight: 600,
                                }}
                              >
                                {(() => {
                                  const dateKey = h.frequency?.type === "once" ? h.frequency.date : selectedDate;
                                  return percentRecords[dateKey]?.[h.id] ?? 0;
                                })()}
                                %
                              </button>
                            )}
                            <div className="flex flex-col items-center gap-1">
                              <button
                                aria-label={done ? `Mark ${h.name} as not done` : `Mark ${h.name} as done`}
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerUp={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggle(h);
                                }}
                                className={`tick-btn shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${animatingId === h.id ? "tick-glow" : ""}`}
                                style={{
                                  position: "relative",
                                  background: done ? h.color : "transparent",
                                  borderColor: done ? h.color : "#4A4A45",
                                  overflow: "visible",
                                  "--glow-color": h.color,
                                }}
                              >
                                {animatingId === h.id && (
                                  <>
                                    <span className="done-ring" style={{ borderColor: h.color }} />
                                    <span className="done-ring" style={{ borderColor: h.color, animationDelay: "0.12s" }} />
                                  </>
                                )}
                                {done && <Check size={16} color="#000000" strokeWidth={3} className={animatingId === h.id ? "check-pop" : ""} />}
                              </button>
                              {h.quantityTracking?.enabled && (
                                <button
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openQuantityEdit(h);
                                  }}
                                  title={h.quantityTracking.label}
                                  aria-label={`Enter ${h.quantityTracking.label}`}
                                  className="mono text-xs text-center rounded-md"
                                  style={{
                                    width: "40px",
                                    padding: "2px 0",
                                    background: "#151513",
                                    border: "1px solid #262622",
                                    color: quantityRecords[selectedDate]?.[h.id] != null ? h.color : "#6E6E6A",
                                  }}
                                >
                                  {quantityRecords[selectedDate]?.[h.id] ?? "0"}
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {h.description && (
                      <div className="text-xs truncate mt-0.5" style={{ color: "#8A8A85" }}>
                        {h.description}
                      </div>
                    )}

                    {!isMilestoneHabit && (
                      <>
                        <div className="mt-2">
                          <StarDisplay value={h.difficulty} />
                        </div>
                        <div className="mt-3">
                          <Heatmap habit={h} weeks={WEEKS_COMPACT} today={today} records={records} cellWidth={9} cellHeight={7} gap={2} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating add button */}
      <button
        onClick={openAddModal}
        aria-label="Add a habit"
        className="fab"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "56px",
          height: "56px",
          borderRadius: "999px",
          background: ACCENT_GREEN,
          color: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
          border: "none",
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Shatter particles when a habit is deleted */}
      {shatter && (
        <div style={{ position: "fixed", inset: 0, zIndex: 45, pointerEvents: "none" }}>
          {SHATTER_FRAGMENTS.map((f, i) => {
            // 0 at bottom-left corner, 1 at top-right corner
            const diagProgress = (f.relX + (1 - f.relY)) / 2;
            const delay = diagProgress * 0.6;
            return (
              <div
                key={i}
                className="shatter-piece"
                style={{
                  left: `${shatter.x + f.relX * shatter.width}px`,
                  top: `${shatter.y + f.relY * shatter.height}px`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  background: shatter.color,
                  animationDelay: `${delay}s`,
                  "--dx": `${f.dx}px`,
                  "--dy": `${f.dy}px`,
                  "--rot": `${f.rot}deg`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Wordless celebration burst */}
      {burst && (
        <>
          <div key={`flash-${burst.id}`} className="screen-flash" style={{ position: "fixed", inset: 0, background: burst.color, zIndex: 39, pointerEvents: "none" }} />
          <div
            key={burst.id}
            style={{
              position: "fixed",
              top: burst.origin ? `${burst.origin.y}px` : undefined,
              bottom: burst.origin ? undefined : "90px",
              left: burst.origin ? `${burst.origin.x}px` : "50%",
              width: 0,
              height: 0,
              zIndex: 40,
              pointerEvents: "none",
            }}
          >
            <div className="shockwave-ring" style={{ "--ring-color": burst.color }} />
            {BURST_PARTICLES.map((p, i) => (
              <div
                key={i}
                className="burst-particle"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: burst.color,
                  borderRadius: p.shape === "square" ? "3px" : "999px",
                  animationDelay: `${p.delay}s`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--rot": `${p.rot}deg`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Add habit — full page form */}
      {showAddModal && (
        <div className="add-page" style={{ position: "fixed", inset: 0, background: "#000000", zIndex: 50, overflowY: "auto" }}>
          <div className="max-w-xl mx-auto px-5 py-6" style={{ paddingBottom: "60px" }}>
            <div className="flex items-center justify-between mb-7">
              <button onClick={closeAddModal} aria-label="Cancel" style={{ color: "#EDEDEA" }}>
                <ArrowLeft size={22} />
              </button>
              <span className="text-lg" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                {editingHabitId ? "Edit Habit" : "Add Habit"}
              </span>
              <button
                onClick={addHabit}
                disabled={!name.trim()}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: name.trim() ? ACCENT_GREEN : "#4A4A47", fontWeight: 600 }}
              >
                Save
                <Check size={16} strokeWidth={3} />
              </button>
            </div>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit title"
              className="w-full rounded-lg px-4 py-3 text-sm mb-3"
              style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full rounded-lg px-4 py-3 text-sm mb-5"
              style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
            />

            <div className="flex gap-3 mb-3">
              <button
                onClick={() => {
                  setShowColorPicker((v) => !v);
                  setShowIconPicker(false);
                }}
                className="flex items-center gap-2 rounded-full px-3 py-2"
                style={{ background: "#0D0D0D", border: "1px solid #242422" }}
              >
                <span className="w-6 h-6 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Color
                </span>
              </button>

              <button
                onClick={() => {
                  setShowIconPicker((v) => !v);
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-2 rounded-full px-3 py-2"
                style={{ background: "#0D0D0D", border: "1px solid #242422" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: hexToRgba(color, 0.2) }}
                >
                  {(() => {
                    const IconPreview = getIcon(icon);
                    return <IconPreview size={13} color={color} />;
                  })()}
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Icon
                </span>
              </button>
            </div>

            {showColorPicker && (
              <div className="flex flex-wrap gap-3 mb-5 p-4 rounded-lg" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className="swatch-btn w-9 h-9 rounded-full shrink-0"
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                    }}
                    aria-label={`Choose color ${c}`}
                    style={{
                      background: c,
                      border: c === color ? "2px solid #EDEDEA" : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            )}

            {showIconPicker && (
              <div className="grid grid-cols-5 gap-3 mb-5 p-4 rounded-lg" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                {ICONS.map(({ key, Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setIcon(key);
                      setShowIconPicker(false);
                    }}
                    className="swatch-btn w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: icon === key ? hexToRgba(color, 0.22) : "#000000",
                      border: icon === key ? `2px solid ${color}` : "1px solid #242422",
                    }}
                    aria-label={`Choose icon ${key}`}
                  >
                    <Icon size={18} color={icon === key ? color : "#9A9A94"} />
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-lg p-4 mt-2 mb-5" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
              <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                Difficulty
              </span>
              <div className="mt-3">
                <StarPicker value={difficulty} onChange={setDifficulty} />
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
              <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                Frequency
              </span>

              <button
                onClick={() => setFrequencyType("everyday")}
                className="flex items-center gap-3 py-2.5 mt-2 w-full text-left"
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: `2px solid ${frequencyType === "everyday" ? color : "#4A4A45"}`,
                  }}
                >
                  {frequencyType === "everyday" && (
                    <span
                      style={{ width: "10px", height: "10px", borderRadius: "999px", background: color }}
                    />
                  )}
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Everyday
                </span>
              </button>

              <button
                onClick={() => {
                  setFrequencyType("once");
                  if (!onceDate) setOnceDate(today);
                }}
                className="flex items-center gap-3 py-2.5 w-full text-left"
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: `2px solid ${frequencyType === "once" ? color : "#4A4A45"}`,
                  }}
                >
                  {frequencyType === "once" && (
                    <span
                      style={{ width: "10px", height: "10px", borderRadius: "999px", background: color }}
                    />
                  )}
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Once
                </span>
              </button>

              {frequencyType === "once" && (
                <div className="pl-8 mt-1 mb-2">
                  <input
                    type="date"
                    value={onceDate || today}
                    onChange={(e) => setOnceDate(e.target.value)}
                    className="rounded-lg px-3 py-2 text-sm"
                    style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                  />
                </div>
              )}

              <button
                onClick={() => setFrequencyType("specific_days")}
                className="flex items-center gap-3 py-2.5 w-full text-left"
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: `2px solid ${frequencyType === "specific_days" ? color : "#4A4A45"}`,
                  }}
                >
                  {frequencyType === "specific_days" && (
                    <span
                      style={{ width: "10px", height: "10px", borderRadius: "999px", background: color }}
                    />
                  )}
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Specific Days of Week
                </span>
              </button>

              {frequencyType === "specific_days" && (
                <div className="flex flex-wrap gap-2 mt-2 pl-8">
                  {WEEKDAYS.map((w) => {
                    const selected = frequencyDays.includes(w.key);
                    return (
                      <button
                        key={w.key}
                        onClick={() => toggleFrequencyDay(w.key)}
                        className="rounded-full px-3 py-1.5 text-xs"
                        style={{
                          background: selected ? color : "transparent",
                          border: `1px solid ${selected ? color : "#262622"}`,
                          color: selected ? "#000000" : "#9A9A94",
                          fontWeight: 500,
                        }}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setFrequencyType("milestone")}
                className="flex items-center gap-3 py-2.5 w-full text-left"
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: `2px solid ${frequencyType === "milestone" ? color : "#4A4A45"}`,
                  }}
                >
                  {frequencyType === "milestone" && (
                    <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: color }} />
                  )}
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA" }}>
                  Create a Milestone
                </span>
              </button>

              {frequencyType === "milestone" && (
                <div className="pl-8 mt-2 flex flex-col gap-2">
                  <div className="text-xs mb-1" style={{ color: "#8A8A85" }}>
                    Add as many milestones as you want for this habit. Deadlines are optional — set one and we'll remind you 10 hours and 4 hours before it's due.
                  </div>
                  {milestoneInputs.map((m, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          value={m.text}
                          onChange={(e) => updateMilestoneInput(idx, e.target.value)}
                          placeholder={`Milestone ${idx + 1}`}
                          className="flex-1 rounded-lg px-3 py-2 text-sm"
                          style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                        />
                        {milestoneInputs.length > 1 && (
                          <button
                            onClick={() => removeMilestoneInput(idx)}
                            aria-label="Remove milestone"
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ color: "#8A8A85" }}
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pl-1">
                        <Calendar size={13} color="#6E6E6A" style={{ flexShrink: 0 }} />
                        <input
                          type="datetime-local"
                          value={m.deadline || ""}
                          onChange={(e) => updateMilestoneDeadline(idx, e.target.value)}
                          className="flex-1 rounded-lg px-3 py-1.5 text-xs"
                          style={{ background: "#151513", border: "1px solid #262622", color: m.deadline ? "#EDEDEA" : "#6E6E6A" }}
                        />
                        {m.deadline && (
                          <button
                            onClick={() => updateMilestoneDeadline(idx, "")}
                            aria-label="Clear deadline"
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ color: "#6E6E6A" }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addMilestoneInput}
                    className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs mt-1"
                    style={{ background: "transparent", border: `1px dashed ${color}`, color, fontWeight: 600 }}
                  >
                    <Plus size={13} />
                    Add another milestone
                  </button>
                </div>
              )}
            </div>

            {frequencyType !== "milestone" && (
              <div className="rounded-lg p-4 mt-5" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                    Track a number too?
                  </span>
                  <ToggleSwitch checked={trackQuantity} onChange={setTrackQuantity} color={color} />
                </div>
                {trackQuantity && (
                  <>
                    <div className="text-xs mt-3 mb-2" style={{ color: "#8A8A85" }}>
                      What should we ask for each time you check it off?
                    </div>
                    <input
                      value={quantityLabel}
                      onChange={(e) => setQuantityLabel(e.target.value)}
                      placeholder="e.g., Hours worked, Pages read"
                      className="w-full rounded-lg px-4 py-3 text-sm"
                      style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                    />
                  </>
                )}
              </div>
            )}

            <div className="rounded-lg p-4 mt-5" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                  Set Reminder
                </span>
                <ToggleSwitch checked={reminderEnabled} onChange={setReminderEnabled} color={color} />
              </div>

              {reminderEnabled && (
                <>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm" style={{ color: "#EDEDEA" }}>
                      Time
                    </span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="rounded-full px-3 py-1.5 text-sm"
                      style={{ background: color, color: "#000000", border: "none", fontWeight: 600 }}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="text-sm mb-2" style={{ color: "#EDEDEA" }}>
                      Day
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((w) => {
                        const selected = reminderDays.includes(w.key);
                        return (
                          <button
                            key={w.key}
                            onClick={() => toggleReminderDay(w.key)}
                            className="rounded-full px-3 py-1.5 text-xs"
                            style={{
                              background: selected ? color : "transparent",
                              border: `1px solid ${selected ? color : "#262622"}`,
                              color: selected ? "#000000" : "#9A9A94",
                              fontWeight: 600,
                            }}
                          >
                            {w.label.slice(0, 2)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Habit detail — profile-style page matching the reference layout */}
      {detailHabit &&
        (() => {
          const h = habits.find((x) => x.id === detailHabit.id) || detailHabit;
          const HabitIcon = getIcon(h.icon);
          const isMilestoneHabit = h.frequency?.type === "milestone";
          const streak = computeCurrentStreak(h);
          const bestStreak = computeBestStreak(h);
          const score = computeHabitScore(h);
          const totalDays = computeTotalDays(h);
          const milestoneCompletedCount = isMilestoneHabit ? computeMilestoneCompletedCount(h) : 0;
          const achievementProgress = computeAchievementProgress(h);
          const quantityTotal = h.quantityTracking?.enabled ? computeQuantityTotal(h) : null;
          const unlockedCount = getEffectiveLevels(h).filter((l) => achievementProgress >= l.threshold).length;
          const doneToday = !!(records[today] || {})[h.id];
          const freqLabel =
            h.frequency?.type === "once"
              ? "Once"
              : h.frequency?.type === "specific_days"
              ? "Specific Days"
              : h.frequency?.type === "milestone"
              ? "Milestone"
              : "Everyday";
          const timelineGroups = buildTimelineGroups(h);

          return (
            <div className="add-page detail-zoom" style={{ position: "fixed", inset: 0, background: "#000000", zIndex: 50, overflowY: "auto", overflowX: "hidden" }}>
              <div
                className="max-w-xl mx-auto px-5 py-6"
                style={{
                  paddingBottom: "60px",
                  backgroundImage: `linear-gradient(180deg, ${hexToRgba(h.color, 0.55)} 0%, transparent 100%)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 560px",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                  <button onClick={closeDetail} aria-label="Back" style={{ color: "#EDEDEA" }}>
                    <ArrowLeft size={22} />
                  </button>
                  <button
                    onClick={() => openEditModal(h)}
                    aria-label="Edit habit"
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
                  >
                    <Pencil size={15} />
                  </button>
                </div>

                {/* Icon, name, status */}
                <div className="detail-fade-1 flex flex-col items-center mb-6">
                  <div
                    className={doneToday ? "badge-pulse" : ""}
                    style={{
                      width: "78px",
                      height: "78px",
                      borderRadius: "22px",
                      background: h.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      boxShadow: `0 0 36px ${hexToRgba(h.color, 0.55)}`,
                      "--pulse-color": hexToRgba(h.color, 0.6),
                    }}
                  >
                    <HabitIcon size={34} color="#000000" />
                  </div>
                  <div className="text-2xl text-center" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                    {h.name}
                  </div>
                  {h.description && (
                    <div className="text-xs text-center mt-1 px-6" style={{ color: "#8A8A85" }}>
                      {h.description}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                    <div
                      className="rounded-full px-4 py-1.5 text-sm"
                      style={{
                        background: (isMilestoneHabit ? milestoneCompletedCount > 0 : doneToday) ? hexToRgba(h.color, 0.22) : "#0D0D0D",
                        border: `1px solid ${(isMilestoneHabit ? milestoneCompletedCount > 0 : doneToday) ? h.color : "#242422"}`,
                        color: (isMilestoneHabit ? milestoneCompletedCount > 0 : doneToday) ? h.color : "#8A8A85",
                        fontWeight: 600,
                      }}
                    >
                      {isMilestoneHabit
                        ? `${milestoneCompletedCount}/${(h.milestones || []).length} milestones`
                        : doneToday
                        ? "Completed"
                        : "Not completed yet"}
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                      style={{ background: "#0D0D0D", border: `1px solid ${unlockedCount > 0 ? YELLOW : "#242422"}` }}
                    >
                      <Trophy size={12} color={unlockedCount > 0 ? YELLOW : "#4A4A45"} />
                      <span className="mono text-xs" style={{ color: unlockedCount > 0 ? YELLOW : "#6E6E6A", fontWeight: 700 }}>
                        {unlockedCount}/{ACHIEVEMENT_LEVELS.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frequency + icon actions */}
                <div className="detail-fade-2 flex items-center justify-between mb-5 flex-wrap gap-2">
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-2"
                    style={{ background: "#0D0D0D", border: "1px solid #242422" }}
                  >
                    <RotateCcw size={13} color="#8A8A85" />
                    <span className="text-xs" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                      {freqLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAchievementsHabit(h)}
                      aria-label="View achievements"
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "#0D0D0D", border: "1px solid #242422", color: YELLOW }}
                    >
                      <Trophy size={15} />
                    </button>
                    {!isMilestoneHabit && (
                      <button
                        onClick={() => setStatsHabit(h)}
                        aria-label="View stats"
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
                      >
                        <BarChart3 size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCalendarHabit(h);
                        setDetailMonthCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                      }}
                      aria-label="View calendar"
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {!isMilestoneHabit && (
                <div className="detail-fade-3 grid grid-cols-2 gap-2 mb-5">
                  <div className="stat-box rounded-lg py-4 text-center" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <Flame size={14} color={streak > 0 ? "#F2994A" : "#6E6E6A"} fill={streak > 0 ? "#F2994A" : "transparent"} />
                      <span className="text-2xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                        {streak}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#8A8A85" }}>
                      Current Streak
                    </div>
                  </div>
                  <div className="stat-box rounded-lg py-4 text-center" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp size={14} color={bestStreak > 0 ? YELLOW : "#6E6E6A"} />
                      <span className="text-2xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                        {bestStreak}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#8A8A85" }}>
                      Best Streak
                    </div>
                  </div>
                  <div className="stat-box rounded-lg py-4 text-center" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <Check size={14} color={h.color} strokeWidth={3} />
                      <span className="text-2xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                        {totalDays}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#8A8A85" }}>
                      Total Days Done
                    </div>
                  </div>
                  <div className="stat-box rounded-lg py-4 text-center" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <BarChart3 size={14} color={h.color} />
                      <span className="text-2xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                        {score === null ? "—" : `${score}%`}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#8A8A85" }}>
                      Score
                    </div>
                  </div>
                </div>
                )}

                {quantityTotal !== null && (
                  <div
                    className="detail-fade-3 rounded-lg py-4 px-5 mb-5 flex items-center justify-between"
                    style={{ background: "#0D0D0D", border: "1px solid #242422" }}
                  >
                    <span className="text-sm" style={{ color: "#8A8A85" }}>
                      Total {h.quantityTracking.label}
                    </span>
                    <span className="text-2xl mono" style={{ color: h.color, fontWeight: 700 }}>
                      {quantityTotal}
                    </span>
                  </div>
                )}

                {isMilestoneHabit ? (
                  <div className="detail-fade-4 flex flex-col gap-2">
                    {h.createdAt && (
                      <div className="text-xs text-center mb-2" style={{ color: "#6E6E6A" }}>
                        Created {formatTimeAgo(h.createdAt)}
                      </div>
                    )}

                    {h.completed ? (
                      <div
                        className="rounded-lg py-3 px-4 flex items-center justify-between gap-2 mb-1"
                        style={{ background: hexToRgba(h.color, 0.16), border: `1px solid ${h.color}` }}
                      >
                        <div className="flex items-center gap-2">
                          <Check size={16} color={h.color} strokeWidth={3} />
                          <span className="text-sm" style={{ color: h.color, fontWeight: 600 }}>
                            Completed
                            {h.completedDate
                              ? ` ${parseDate(h.completedDate).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`
                              : ""}
                          </span>
                        </div>
                        <button
                          onClick={() => reopenHabit(h)}
                          className="text-xs shrink-0"
                          style={{ color: "#8A8A85", textDecoration: "underline" }}
                        >
                          Reopen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openCompleteHabitConfirm(h)}
                        className="rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm mb-1"
                        style={{ background: h.color, color: "#000000", fontWeight: 700 }}
                      >
                        <Trophy size={15} />
                        Mark Habit as Completed
                      </button>
                    )}

                    <button
                      onClick={() => openNoteModal(h)}
                      className="rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm mb-1"
                      style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA", fontWeight: 600 }}
                    >
                      <StickyNote size={15} />
                      Add Note
                    </button>

                    {(h.milestones || []).length === 0 && (
                      <div className="text-sm text-center py-8" style={{ color: "#6E6E6A" }}>
                        No milestones yet — edit this habit to add some.
                      </div>
                    )}
                    {(h.milestones || []).map((m) => {
                      const doneVal = (milestoneCompletions[h.id] || {})[m.id];
                      const isDone = !!doneVal;
                      const key = `${h.id}-${m.id}`;
                      const isAnimating = animatingMilestoneKey === key;
                      return (
                        <div
                          key={m.id}
                          className={isAnimating ? "milestone-row-flash" : ""}
                          style={{
                            borderRadius: "10px",
                            padding: "12px",
                            background: isDone ? hexToRgba(h.color, 0.18) : "#0D0D0D",
                            border: `1px solid ${isDone ? h.color : "#242422"}`,
                            transition: "background 0.4s ease, border-color 0.4s ease",
                            "--glow-color": h.color,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleMilestone(h, m.id)}
                              aria-label={isDone ? `Mark ${m.text} as not done` : `Mark ${m.text} as done`}
                              className={`tick-btn shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${isAnimating ? "tick-glow" : ""}`}
                              style={{
                                position: "relative",
                                overflow: "visible",
                                background: isDone ? h.color : "transparent",
                                borderColor: isDone ? h.color : "#4A4A45",
                                "--glow-color": h.color,
                              }}
                            >
                              {isAnimating && (
                                <>
                                  <span className="done-ring" style={{ borderColor: h.color }} />
                                  <span className="done-ring" style={{ borderColor: h.color, animationDelay: "0.12s" }} />
                                </>
                              )}
                              {isDone && <Check size={16} color="#000000" strokeWidth={3} className={isAnimating ? "check-pop" : ""} />}
                            </button>
                            <span className="text-sm flex-1" style={{ color: isDone ? h.color : "#EDEDEA", fontWeight: 500 }}>
                              {m.text}
                            </span>
                          </div>
                          {isDone && typeof doneVal === "string" && (
                            <div className="text-xs mt-1.5" style={{ color: hexToRgba(h.color, 0.8), marginLeft: "44px" }}>
                              Completed{" "}
                              {parseDate(doneVal).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          )}
                          {!isDone && m.deadline && (() => {
                            const deadlineTime = new Date(m.deadline).getTime();
                            const overdue = !isNaN(deadlineTime) && deadlineTime < Date.now();
                            return (
                              <div
                                className="text-xs mt-1.5 flex items-center gap-1"
                                style={{ color: overdue ? "#E5484D" : "#6E6E6A", marginLeft: "44px" }}
                              >
                                <Calendar size={11} />
                                {overdue ? "Was due " : "Due "}
                                {new Date(m.deadline).toLocaleDateString("default", { month: "short", day: "numeric" })}
                                {" at "}
                                {new Date(m.deadline).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit" })}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}

                    {(() => {
                      const habitNotes = Object.entries(notes)
                        .filter(([, dayNotes]) => dayNotes && dayNotes[h.id])
                        .sort((a, b) => (a[0] < b[0] ? 1 : -1));
                      if (habitNotes.length === 0) return null;
                      return (
                        <div className="mt-4">
                          <div className="text-xs mb-2" style={{ color: "#6E6E6A" }}>
                            Notes
                          </div>
                          <div className="flex flex-col gap-2">
                            {habitNotes.map(([ds, dayNotes]) => (
                              <div key={ds} className="rounded-lg p-3" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                                <div className="text-xs mb-1" style={{ color: "#6E6E6A" }}>
                                  {parseDate(ds).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                                <div className="text-sm" style={{ color: "#EDEDEA" }}>
                                  {dayNotes[h.id]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <>
                {/* Actions */}
                <div className="detail-fade-4 grid gap-2 mb-8" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                  <button
                    ref={doneBtnRef}
                    onClick={() => {
                      const rect = doneBtnRef.current?.getBoundingClientRect();
                      const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
                      toggle(h, origin);
                    }}
                    className={`rounded-lg py-3 flex items-center justify-center gap-2 text-sm ${animatingId === h.id ? "done-pop" : ""}`}
                    style={{
                      position: "relative",
                      background: "#0D0D0D",
                      border: `1px solid ${doneToday ? h.color : "#242422"}`,
                      color: doneToday ? "#000000" : "#EDEDEA",
                      fontWeight: 700,
                      overflow: "visible",
                      "--glow-color": h.color,
                    }}
                  >
                    <span style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
                      {doneToday && (
                        <span
                          key={animatingId === h.id ? "filling" : "filled"}
                          className={animatingId === h.id ? "ripple-fill" : ""}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "10px",
                            height: "10px",
                            borderRadius: "999px",
                            background: h.color,
                            transform: animatingId === h.id ? "translate(-50%, -50%) scale(0)" : "translate(-50%, -50%) scale(40)",
                          }}
                        />
                      )}
                    </span>
                    {animatingId === h.id && (
                      <>
                        <span className="done-local-flash" style={{ background: h.color }} />
                        <span className="done-ring" style={{ borderColor: h.color }} />
                        <span className="done-ring" style={{ borderColor: h.color, animationDelay: "0.12s" }} />
                      </>
                    )}
                    <span
                      className="relative flex items-center gap-2"
                      style={{ zIndex: 1, animation: animatingId === h.id ? "checkPop 0.4s 0.22s cubic-bezier(0.34,1.56,0.64,1) both" : "none" }}
                    >
                      <Check size={16} strokeWidth={3} />
                      Done
                    </span>
                  </button>
                  <button
                    onClick={() => openNoteModal(h)}
                    className="rounded-lg py-3 flex items-center justify-center gap-2 text-sm"
                    style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA", fontWeight: 600 }}
                  >
                    <StickyNote size={15} />
                    Add Note
                  </button>
                  <button
                    onClick={() => {
                      setCameraNotice(true);
                      setTimeout(() => setCameraNotice(false), 2200);
                    }}
                    aria-label="Attach photo"
                    className="w-12 rounded-lg flex items-center justify-center"
                    style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#EDEDEA" }}
                  >
                    <Camera size={16} />
                  </button>
                </div>
                {cameraNotice && (
                  <div className="text-xs text-center -mt-6 mb-8" style={{ color: "#6E6E6A" }}>
                    Photo attachments aren't supported here.
                  </div>
                )}

                {/* Timeline */}
                {timelineGroups.length === 0 ? (
                  <div className="detail-fade-4 text-sm text-center py-8" style={{ color: "#6E6E6A" }}>
                    No history yet — complete this habit to start building your timeline.
                  </div>
                ) : (
                  <div className="detail-fade-4 flex flex-col gap-6">
                    {timelineGroups.map((group, gi) => (
                      <div key={gi}>
                        <div className="text-sm text-center mb-4" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                          {group.label}
                        </div>
                        <div className="flex flex-col gap-3">
                          {group.events.map((ev, ei) => (
                            <div key={ei} className="flex items-center gap-3">
                              <div
                                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: h.color }}
                              >
                                {ev.kind === "note" ? (
                                  <HabitIcon size={16} color="#000000" />
                                ) : (
                                  <HabitIcon size={16} color="#000000" />
                                )}
                              </div>
                              <div
                                className="flex-1 rounded-lg px-4 py-3"
                                style={{ background: "#0D0D0D", border: "1px solid #242422" }}
                              >
                                {ev.kind === "note" ? (
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-sm truncate" style={{ color: h.color, fontWeight: 600 }}>
                                        {h.name}
                                      </div>
                                      <div className="text-sm mt-1" style={{ color: "#EDEDEA" }}>
                                        {ev.text}
                                      </div>
                                    </div>
                                    <span className="text-xs shrink-0" style={{ color: "#6E6E6A" }}>
                                      {parseDate(ev.date).toLocaleDateString("default", { day: "numeric", month: "short" })}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Flame size={14} color={YELLOW} fill={YELLOW} />
                                      <span className="text-sm truncate" style={{ color: YELLOW, fontWeight: 600 }}>
                                        {ev.length} day{ev.length === 1 ? "" : "s"} {ev.kind === "ongoing" ? "ongoing streak" : "streak ended"}
                                      </span>
                                    </div>
                                    <span className="text-xs shrink-0" style={{ color: "#6E6E6A" }}>
                                      {parseDate(ev.date).toLocaleDateString("default", { day: "numeric", month: "short" })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                  </>
                )}
              </div>
            </div>
          );
        })()}

      {/* Stats modal — difficulty + heatmap, tucked behind the bar-chart icon */}
      {statsHabit &&
        (() => {
          const h = habits.find((x) => x.id === statsHabit.id) || statsHabit;
          return (
            <div
              onClick={() => setStatsHabit(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                zIndex: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="modal-pop"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid #242422",
                  borderRadius: "14px",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "400px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                    Stats
                  </span>
                  <button onClick={() => setStatsHabit(null)} aria-label="Close" style={{ color: "#8A8A85" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="mb-4">
                  <StarDisplay value={h.difficulty} />
                </div>
                <Heatmap
                  habit={h}
                  weeks={WEEKS_DETAIL}
                  today={today}
                  records={records}
                  cellRadius={3}
                  cellHeight={10}
                  cellWidth={13}
                  gap={2}
                  showMonthLabels
                />
              </div>
            </div>
          );
        })()}

      {/* Add note modal */}
      {noteModalHabit && (
        <div
          onClick={() => setNoteModalHabit(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "360px",
            }}
          >
            <div className="text-sm mb-4" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              Note for {noteModalHabit.name} — Today
            </div>
            <textarea
              autoFocus
              value={noteInputValue}
              onChange={(e) => setNoteInputValue(e.target.value)}
              placeholder="How did it go?"
              rows={4}
              className="w-full rounded-lg px-4 py-3 text-sm mb-5"
              style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA", resize: "none" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setNoteModalHabit(null)}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: noteModalHabit.color, color: "#000000", fontWeight: 600 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar modal — opened via the calendar icon in a habit's detail view */}
      {calendarHabit &&
        (() => {
          const h = habits.find((x) => x.id === calendarHabit.id) || calendarHabit;
          const isMilestoneHabit = h.frequency?.type === "milestone";
          const monthCells = buildFullMonthGrid(detailMonthCursor);
          return (
            <div
              onClick={() => setCalendarHabit(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                zIndex: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="modal-pop"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid #242422",
                  borderRadius: "14px",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "380px",
                  maxHeight: "85vh",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg truncate" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                    {h.name}
                  </span>
                  <button onClick={() => setCalendarHabit(null)} aria-label="Close" style={{ color: "#8A8A85" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="text-xs mb-4" style={{ color: "#6E6E6A" }}>
                  {isMilestoneHabit ? "Days with a milestone completed are highlighted" : "Tap a day to mark it done or not done"}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <button
                    className="month-nav-btn w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ color: "#9A9A94" }}
                    onClick={() => setDetailMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                    {detailMonthCursor.toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    className="month-nav-btn w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ color: "#9A9A94" }}
                    onClick={() => setDetailMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="text-center text-xs mono" style={{ color: "#6E6E6A" }}>
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {monthCells.map((d, i) => {
                    const ds = fmt(d);
                    const inMonth = d.getMonth() === detailMonthCursor.getMonth();
                    const isToday = ds === today;
                    const isFuture = ds > today;

                    let done = false;
                    let cellTitle = undefined;
                    if (isMilestoneHabit) {
                      const habitDone = milestoneCompletions[h.id] || {};
                      const completedNames = (h.milestones || [])
                        .filter((m) => habitDone[m.id] === ds)
                        .map((m) => m.text);
                      done = completedNames.length > 0;
                      cellTitle = completedNames.length > 0 ? completedNames.join(", ") : undefined;
                    } else {
                      const rec = records[ds];
                      done = rec ? !!rec[h.id] : false;
                    }
                    const clickable = !isMilestoneHabit && inMonth && !isFuture;
                    return (
                      <div
                        key={i}
                        title={cellTitle}
                        onClick={() => clickable && toggleForDate(h.id, ds)}
                        className={clickable ? "month-day-cell" : ""}
                        style={{
                          aspectRatio: "1 / 1",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: done ? h.color : isToday ? hexToRgba(h.color, 0.2) : "transparent",
                          border: isToday && !done ? `1.5px solid ${h.color}` : "1.5px solid transparent",
                          cursor: clickable ? "pointer" : "default",
                          opacity: isFuture ? 0.35 : 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: !inMonth ? "#4A4A47" : done ? "#000000" : isToday ? h.color : "#EDEDEA",
                            fontWeight: isToday || done ? 600 : 400,
                          }}
                        >
                          {d.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      {/* Trophy unlock celebration */}
      {trophyUnlock && (
        <div
          key={trophyUnlock.id}
          onClick={handleLockTap}
          className="trophy-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {trophyUnlock.phase === "tap" && (
            <>
              <div
                className="lock-ring-pulse"
                style={{
                  position: "absolute",
                  top: "42%",
                  left: "50%",
                  width: "170px",
                  height: "170px",
                  borderRadius: "999px",
                  border: `1px solid ${trophyUnlock.level.color}`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                  key={trophyUnlock.tapKey}
                  aria-label="Tap anywhere to crack the lock"
                  className="tap-bounce"
                  style={{
                    position: "relative",
                    width: "112px",
                    height: "112px",
                    borderRadius: "999px",
                    background: hexToRgba(trophyUnlock.level.color, 0.1 + trophyUnlock.taps * 0.06),
                    border: `2px solid ${hexToRgba(trophyUnlock.level.color, 0.35 + trophyUnlock.taps * 0.2)}`,
                    boxShadow: `0 0 ${24 + trophyUnlock.taps * 14}px ${hexToRgba(trophyUnlock.level.color, 0.25 + trophyUnlock.taps * 0.15)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock size={38} color="#EDEDEA" />
                  {[0, 1, 2].map(
                    (i) =>
                      trophyUnlock.taps > i && (
                        <div
                          key={i}
                          className="crack-line"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "2px",
                            height: `${28 + i * 6}px`,
                            background: "#EDEDEA",
                            transformOrigin: "center",
                            transform: `translate(-50%, -50%) rotate(${[22, -28, 55][i]}deg)`,
                          }}
                        />
                      )
                  )}
                  {trophyUnlock.taps > 0 && (
                    <div key={`spark-${trophyUnlock.tapKey}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                      {SPARK_PARTICLES.map((p, i) => (
                        <div
                          key={i}
                          className="spark-piece"
                          style={{
                            width: "4px",
                            height: "4px",
                            background: trophyUnlock.level.color,
                            "--dx": `${p.dx}px`,
                            "--dy": `${p.dy}px`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              </div>

              <div className="text-center mt-7 px-8">
                <div className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  Tap anywhere to unlock your reward
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={trophyUnlock.taps > i ? "dot-fill" : ""}
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "999px",
                        background: trophyUnlock.taps > i ? trophyUnlock.level.color : "#3A3A35",
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {trophyUnlock.phase === "celebrate" && (
            <>
          <div
            className="trophy-flash"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 42%, ${trophyUnlock.level.color}, transparent 65%)`,
              pointerEvents: "none",
            }}
          />

          <div
            className="trophy-rays"
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              width: "420px",
              height: "420px",
              background: `repeating-conic-gradient(${hexToRgba(trophyUnlock.level.color, 0.35)} 0deg 8deg, transparent 8deg 24deg)`,
              borderRadius: "999px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "absolute", top: "42%", left: "50%", width: 0, height: 0, pointerEvents: "none" }}>
            {BURST_PARTICLES.map((p, i) => (
              <div
                key={`w1-${i}`}
                className="trophy-particle"
                style={{
                  width: `${p.size + 2}px`,
                  height: `${p.size + 2}px`,
                  background: trophyUnlock.level.color,
                  borderRadius: p.shape === "square" ? "3px" : "999px",
                  animationDelay: `${0.35 + p.delay}s`,
                  "--dx": `${p.dx * 1.7}px`,
                  "--dy": `${p.dy * 1.7}px`,
                  "--rot": `${p.rot}deg`,
                }}
              />
            ))}
            {BURST_PARTICLES.map((p, i) => (
              <div
                key={`w2-${i}`}
                className="trophy-particle"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: "#FFFFFF",
                  borderRadius: p.shape === "square" ? "3px" : "999px",
                  animationDelay: `${0.55 + p.delay * 1.3}s`,
                  "--dx": `${p.dx * 2.6}px`,
                  "--dy": `${p.dy * 2.6}px`,
                  "--rot": `${p.rot * 1.5}deg`,
                }}
              />
            ))}
          </div>

          <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              className="glow-ring"
              style={{ position: "absolute", borderRadius: "999px", border: `4px solid ${trophyUnlock.level.color}` }}
            />
            <div
              className="glow-ring"
              style={{
                position: "absolute",
                borderRadius: "999px",
                border: `3px solid ${trophyUnlock.level.color}`,
                animationDelay: "0.18s",
              }}
            />
            <div
              className="glow-ring"
              style={{
                position: "absolute",
                borderRadius: "999px",
                border: `2px solid ${trophyUnlock.level.color}`,
                animationDelay: "0.36s",
              }}
            />

            <div className="badge-shake">
              <div
                className="trophy-badge-in"
                style={{
                  width: "112px",
                  height: "112px",
                  borderRadius: "999px",
                  background: hexToRgba(trophyUnlock.level.color, 0.2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 60px ${hexToRgba(trophyUnlock.level.color, 0.7)}`,
                }}
              >
                <div style={{ position: "relative", width: "56px", height: "56px", perspective: "300px" }}>
                  <div className="coin-flip" style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
                    <div className="badge-face">
                      <Lock size={38} color="#6E6E6A" />
                    </div>
                    <div className="badge-face badge-face-back">
                      <Trophy size={46} color={trophyUnlock.level.color} />
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, pointerEvents: "none" }}>
                    {LOCK_SHATTER_PARTICLES.map((p, i) => (
                      <div
                        key={i}
                        className="lock-shatter-piece"
                        style={{
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          background: i % 2 === 0 ? "#9A9A94" : trophyUnlock.level.color,
                          animationDelay: "0.33s",
                          "--dx": `${p.dx}px`,
                          "--dy": `${p.dy}px`,
                          "--rot": `${p.rot}deg`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="trophy-text-in text-center mt-7 px-8" style={{ position: "relative" }}>
            <div className="mono text-xs" style={{ color: "#8A8A85", letterSpacing: "2px" }}>
              TROPHY UNLOCKED
            </div>
            <div className="level-pop text-2xl mt-1" style={{ color: trophyUnlock.level.color, fontWeight: 700 }}>
              {trophyUnlock.level.label}
            </div>
            <div className="text-sm mt-1" style={{ color: "#EDEDEA" }}>
              {trophyUnlock.habit.name} — {trophyUnlock.level.threshold} days
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {/* Achievements — total days + locked/unlocked levels */}
      {achievementsHabit &&
        (() => {
          const h = habits.find((x) => x.id === achievementsHabit.id) || achievementsHabit;
          const totalDays = computeAchievementProgress(h);
          const isMilestoneHabit = h.frequency?.type === "milestone";
          return (
            <div
              onClick={() => setAchievementsHabit(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                zIndex: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="modal-pop"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid #242422",
                  borderRadius: "14px",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "360px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                    Achievements
                  </span>
                  <button onClick={() => setAchievementsHabit(null)} aria-label="Close" style={{ color: "#8A8A85" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="text-xs mb-5 truncate" style={{ color: "#8A8A85" }}>
                  {h.name}
                </div>

                <div className="mono text-3xl mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  {totalDays}
                </div>
                <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
                  {isMilestoneHabit ? "milestones completed" : "total days completed"}
                </div>

                <div className="flex flex-col gap-2">
                  {getEffectiveLevels(h).map((level) => {
                    const unlocked = totalDays >= level.threshold;
                    return (
                      <div
                        key={level.key}
                        className="flex items-center gap-3 rounded-lg p-3"
                        style={{
                          background: "#141412",
                          border: `1px solid ${unlocked ? level.color : "#242422"}`,
                        }}
                      >
                        <div
                          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: unlocked ? hexToRgba(level.color, 0.18) : "#1A1A18" }}
                        >
                          {unlocked ? (
                            <Trophy size={18} color={level.color} />
                          ) : (
                            <Lock size={15} color="#4A4A45" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm"
                            style={{ color: unlocked ? "#EDEDEA" : "#6E6E6A", fontWeight: 600 }}
                          >
                            {level.label}
                          </div>
                          <div className="text-xs" style={{ color: "#8A8A85" }}>
                            {unlocked ? "Unlocked" : `${totalDays}/${level.threshold} days`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      {/* Percentage prompt after creating a "Once" habit */}
      {percentPrompt && (
        <div
          onClick={declinePercentPrompt}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            {percentPromptStep === "ask" ? (
              <>
                <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  Track by percentage?
                </div>
                <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
                  "{percentPrompt.habit.name}" only happens once, so it may not be all-or-nothing. Want to log how
                  much of it you completed, next to the checkbox?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={declinePercentPrompt}
                    className="flex-1 rounded-md py-2 text-sm"
                    style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
                  >
                    No, use checkbox
                  </button>
                  <button
                    onClick={acceptPercentPrompt}
                    className="flex-1 rounded-md py-2 text-sm"
                    style={{ background: percentPrompt.habit.color, color: "#000000", fontWeight: 600 }}
                  >
                    Yes, add %
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  How much did you complete?
                </div>
                <div className="text-xs mb-4" style={{ color: "#8A8A85" }}>
                  Enter a percentage from 0 to 100.
                </div>
                <input
                  autoFocus
                  type="number"
                  min={0}
                  max={100}
                  value={percentInputValue}
                  onChange={(e) => setPercentInputValue(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm mb-5"
                  style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                />
                <button
                  onClick={savePercentPrompt}
                  className="w-full rounded-md py-2.5 text-sm"
                  style={{ background: percentPrompt.habit.color, color: "#000000", fontWeight: 600 }}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit percentage via the badge on the main list */}
      {percentEditHabit && (
        <div
          onClick={() => setPercentEditHabit(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <div className="text-sm mb-4" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              {percentEditHabit.name} — % completed
            </div>
            <input
              autoFocus
              type="number"
              min={0}
              max={100}
              value={percentInputValue}
              onChange={(e) => setPercentInputValue(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm mb-5"
              style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPercentEditHabit(null)}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={savePercentEdit}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: percentEditHabit.color, color: "#000000", fontWeight: 600 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enter a custom quantity via the box under the checkbox */}
      {quantityEditHabit && (
        <div
          onClick={() => setQuantityEditHabit(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              {quantityEditHabit.name}
            </div>
            <div className="text-xs mb-4" style={{ color: "#8A8A85" }}>
              {quantityEditHabit.quantityTracking.label}
            </div>
            <input
              autoFocus
              type="number"
              min={0}
              value={quantityInputValue}
              onChange={(e) => setQuantityInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveQuantityEdit()}
              placeholder="0"
              className="w-full rounded-lg px-4 py-3 text-sm mb-5"
              style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setQuantityEditHabit(null)}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={saveQuantityEdit}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: quantityEditHabit.color, color: "#000000", fontWeight: 600 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily completion trend graph */}
      {showTrendGraph &&
        (() => {
          const series = buildTrendSeries(habits, records, today);
          const todayDate = parseDate(today);
          const trackedDays = series.filter((pt) => pt.pct !== null).length;
          return (
            <div
              onClick={() => setShowTrendGraph(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                zIndex: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="modal-pop"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid #242422",
                  borderRadius: "14px",
                  padding: "18px",
                  width: "100%",
                  maxWidth: "420px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} color={ACCENT_GREEN} />
                    <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                      Daily completion
                    </span>
                  </div>
                  <button onClick={() => setShowTrendGraph(false)} aria-label="Close" style={{ color: "#8A8A85" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="text-xs mb-4" style={{ color: "#6E6E6A" }}>
                  {trackedDays === 0
                    ? "No tracked days yet — this fills in as you go."
                    : `Scroll left to see earlier days · ${trackedDays} day${trackedDays === 1 ? "" : "s"} tracked`}
                </div>
                <TrendGraph series={series} todayDate={todayDate} />
              </div>
            </div>
          );
        })()}

      {/* Mark habit completed confirmation */}
      {completeHabitConfirm && (
        <div
          onClick={cancelCompleteHabit}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              Mark "{completeHabitConfirm.name}" as completed?
            </div>
            <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
              It'll be archived and won't show up in your daily list starting tomorrow. You can reopen it later if you change your mind.
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelCompleteHabit}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #262622", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmCompleteHabit}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: completeHabitConfirm.color, color: "#000000", fontWeight: 600 }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal (long-press) */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop"
            style={{
              background: "#0D0D0D",
              border: "1px solid #242422",
              borderRadius: "14px",
              padding: "20px",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              Delete "{deleteTarget.name}"?
            </div>
            <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
              This removes it and its full history.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #262622", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const idToDelete = deleteTarget.id;
                  const habitColor = deleteTarget.color;
                  const node = cardRefs.current[idToDelete];
                  const rect = node ? node.getBoundingClientRect() : null;
                  setDeleteTarget(null);
                  setDeletingId(idToDelete);
                  if (rect) {
                    setShatter({
                      id: Date.now() + Math.random(),
                      color: habitColor,
                      x: rect.left,
                      y: rect.top,
                      width: rect.width,
                      height: rect.height,
                    });
                  }
                  setTimeout(() => {
                    remove(idToDelete);
                    setDeletingId(null);
                    setShatter(null);
                  }, 1400);
                }}
                className="flex-1 rounded-md py-2 text-sm flex items-center justify-center gap-1.5"
                style={{ background: "#E5484D", color: "#FFFFFF", fontWeight: 600 }}
              >
                <Trash2 size={14} />
                Delete habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}