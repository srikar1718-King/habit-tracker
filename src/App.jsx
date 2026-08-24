import { useState, useEffect, useRef } from "react";
import {
  Check,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  Apple,
  Home,
  User,
  Download,
  Upload,
  Menu,
  Archive,
  Info,
  Calculator,
  Car,
  Receipt,
  ShoppingBag,
  Briefcase,
  Laptop,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
// Namespace import to get every icon lucide-react ships (well over 500), so
// the "Other" expense category can offer icon suggestions that match
// whatever the user types, instead of being limited to a hand-picked set.
import * as LucideIcons from "lucide-react";

const ACCENT_GREEN = "#5FCB6C";

// To enable "Sign in with Google" (identity only — see the Account panel for
// why this alone doesn't sync data across devices), create a free OAuth
// Client ID at https://console.cloud.google.com/apis/credentials
// ("Create Credentials" -> "OAuth client ID" -> Application type: "Web
// application", and add your app's URL under "Authorized JavaScript
// origins"), then paste it here. Leave blank to keep sign-in disabled.
const GOOGLE_CLIENT_ID = "";

const MAX_DIFFICULTY = 5;
const HABITS_KEY = "habits";
const RECORDS_KEY = "day-records";
const PERCENT_KEY = "percent-records";
const NOTES_KEY = "day-notes";
const QUANTITY_KEY = "quantity-records";
const MILESTONES_KEY = "milestone-completions";
const MILESTONE_TARGETS_KEY = "milestone-daily-targets";
const MILESTONE_TIMES_KEY = "milestone-completion-times";
const EXPENSES_KEY = "expense-entries";
const CURRENCY_KEY = "expense-currency";
const INCOME_KEY = "income-entries";
const DAILY_BUDGET_KEY = "daily-budgets";
const WEEKS_COMPACT = 26;
const WEEKS_DETAIL = 52;
const LONG_PRESS_MS = 550;
const DEFAULT_COLOR = "#5FCB6C";
const DEFAULT_ICON = "target";
const YELLOW = "#F2C94C";

// Fixed fan of offsets/sizes for the "blast from the bottom" celebration
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
  { dx: -165, dy: -60, size: 6, delay: 0.06, shape: "square", rot: 100 },
  { dx: 165, dy: -60, size: 6, delay: 0.06, shape: "square", rot: -100 },
  { dx: -150, dy: -135, size: 7, delay: 0.04, shape: "circle", rot: 0 },
  { dx: 150, dy: -135, size: 7, delay: 0.04, shape: "circle", rot: 0 },
  { dx: -55, dy: -240, size: 6, delay: 0.1, shape: "square", rot: -90 },
  { dx: 55, dy: -240, size: 6, delay: 0.1, shape: "square", rot: 90 },
  { dx: 0, dy: -250, size: 8, delay: 0.06, shape: "circle", rot: 0 },
  { dx: -180, dy: -95, size: 5, delay: 0.13, shape: "circle", rot: 0 },
  { dx: 180, dy: -95, size: 5, delay: 0.13, shape: "circle", rot: 0 },
  { dx: -85, dy: -20, size: 4, delay: 0.18, shape: "square", rot: 30 },
  { dx: 85, dy: -20, size: 4, delay: 0.18, shape: "square", rot: -30 },
];

// Short affirmations shown briefly over a completion celebration
const CELEBRATION_WORDS = [
  "Nice!", "Great job!", "Crushing it!", "Well done!", "Keep going!",
  "You did it!", "Strong work!", "On a roll!", "Yes!", "Locked in!",
  "Boom!", "That's it!", "Way to go!", "Solid!", "Nailed it!",
  "Love that!", "Momentum!", "Let's go!", "Killing it!", "Stacking wins!",
  "Proud of you!", "Level up!", "Unstoppable!",
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

// --- Trophy celebration sound + haptics (synthesized, no audio files needed) ---
function playTone(ctx, freq, startTime, duration, gainPeak, type) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "triangle";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.03);
  } catch (e) {
    // audio isn't essential — fail silently
  }
}

// A bright ascending arpeggio into a shimmering top note — reads as a small
// triumphant fanfare for the trophy reveal
function playTrophyFanfare(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone(ctx, freq, now + i * 0.085, 0.5, 0.15, "triangle");
  });
  playTone(ctx, 1567.98, now + 0.3, 0.65, 0.07, "sine"); // shimmering G6 on top
}

function triggerHaptics(pattern) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {
    // haptics aren't essential — fail silently
  }
}

// A satisfying two-note rising "pop" for marking a habit done
function playCheckSound(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 660, now, 0.1, 0.13, "triangle");
  playTone(ctx, 880, now + 0.05, 0.14, 0.15, "triangle");
}

// A soft single descending tone for un-marking a habit
function playUncheckSound(ctx) {
  if (!ctx) return;
  playTone(ctx, 380, ctx.currentTime, 0.1, 0.08, "sine");
}

// A very short, quiet neutral tick for general button presses — subtle
// enough to not get old even when tapped a lot
function playClickSound(ctx) {
  if (!ctx) return;
  playTone(ctx, 720, ctx.currentTime, 0.035, 0.045, "square");
}

// A pleasant short rising chime for confirming/saving something
function playConfirmSound(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.12, 0.12, "triangle");
  playTone(ctx, 659.25, now + 0.06, 0.16, 0.13, "triangle");
}

// Two quick descending notes for deleting something
function playDeleteSound(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 480, now, 0.09, 0.1, "sawtooth");
  playTone(ctx, 300, now + 0.05, 0.13, 0.09, "sawtooth");
}

// A softer, gentler version for archiving (less harsh than delete — this
// isn't destructive, just tucked away)
function playArchiveSound(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 440, now, 0.11, 0.09, "sine");
  playTone(ctx, 330, now + 0.06, 0.16, 0.08, "sine");
}

const PERIODS = [
  { key: "daily", label: "Daily", days: 1 },
  { key: "weekly", label: "Weekly", days: 7 },
  { key: "monthly", label: "Monthly", days: 30 },
];

const HABIT_CATEGORIES = [
  "Health", "Fitness", "Productivity", "Mindfulness", "Learning",
  "Finance", "Social", "Creativity", "Home", "Sleep", "Nutrition", "Career",
];
const UNCATEGORIZED = "Uncategorized";

const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Bills", "Shopping", "Health", "Entertainment", "Other",
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Investment", "Gift", "Other",
];

// Icons for the money calculator's category chips + transaction list badges.
const EXPENSE_CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: Heart,
  Entertainment: Gamepad2,
  Other: Sparkles,
};
const INCOME_CATEGORY_ICONS = {
  Salary: Briefcase,
  Freelance: Laptop,
  Business: Wallet,
  Investment: TrendingUp,
  Gift: Gift,
  Other: Sparkles,
};

// A searchable index of every icon lucide-react exports, used to suggest
// icons for a custom "Other" expense based on whatever the user types.
// Built once at module load, not per render.
//
// lucide-react re-exports many icons under more than one name (most icons
// have a matching "...Icon"-suffixed alias, and a few have older/renamed
// aliases) — those aliases point to the exact same component. Indexing by
// name alone means one visual icon could turn up several times in a single
// search whenever more than one of its aliases matches the query. This
// index is deduplicated by the actual component reference, keeping only
// the shortest (cleanest) name per unique icon, so every entry — and every
// search result drawn from it — is a genuinely different icon. Even after
// dedup this comfortably covers 1000+ distinct icons spanning food, sport,
// travel, home, work, finance, nature, tech, and more.
const ICON_EXPORT_EXCLUDE = new Set(["createLucideIcon", "icons", "Icon", "LucideIcon", "default"]);
function isLikelyIconExport(name, value) {
  if (ICON_EXPORT_EXCLUDE.has(name)) return false;
  if (!/^[A-Z]/.test(name)) return false;
  return typeof value === "function" || (typeof value === "object" && value !== null);
}
function iconNameToLabel(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase();
}
const ICON_SEARCH_INDEX = (() => {
  const canonicalNameByComponent = new Map(); // component -> shortest name seen for it
  for (const name of Object.keys(LucideIcons)) {
    const value = LucideIcons[name];
    if (!isLikelyIconExport(name, value)) continue;
    const existing = canonicalNameByComponent.get(value);
    if (!existing || name.length < existing.length) {
      canonicalNameByComponent.set(value, name);
    }
  }
  return Array.from(canonicalNameByComponent.entries()).map(([Icon, name]) => ({
    name,
    label: iconNameToLabel(name),
    Icon,
  }));
})();

// Ranks icons by how well their (space-separated) name matches the query:
// exact word > starts-with > substring, each icon capped at its best score.
// Because ICON_SEARCH_INDEX has exactly one entry per unique icon, results
// here can never contain the same icon twice.
function searchIcons(query, limit = 30) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const item of ICON_SEARCH_INDEX) {
    const labelWords = item.label.split(" ");
    let score = 0;
    if (item.label === q) score = 100;
    else if (labelWords.some((w) => w === q)) score = 80;
    else if (item.label.startsWith(q)) score = 70;
    else if (labelWords.some((w) => w.startsWith(q))) score = 50;
    else if (words.length > 1 && words.every((w) => item.label.includes(w))) score = 30;
    else if (item.label.includes(q)) score = 20;
    if (score > 0) scored.push({ name: item.name, Icon: item.Icon, score });
  }
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, limit);
}

const COLORS = [
  "#5FCB6C", "#F2C94C", "#EE6C4D", "#E5484D", "#4EA8DE",
  "#9B5DE5", "#F15BB5", "#00BBF9", "#43AA8B", "#F3722C",
  "#FF9F1C", "#118AB2", "#06D6A0", "#EF476F", "#8338EC",
  "#3A86FF", "#FFBE0B", "#FB5607",
];

const ICON_CATEGORIES = [
  {
    label: "Fitness",
    icons: [
      { key: "dumbbell", Icon: Dumbbell },
      { key: "bike", Icon: Bike },
      { key: "footprints", Icon: Footprints },
      { key: "flame", Icon: Flame },
      { key: "zap", Icon: Zap },
    ],
  },
  {
    label: "Wellness & Sleep",
    icons: [
      { key: "heart", Icon: Heart },
      { key: "bath", Icon: Bath },
      { key: "bed", Icon: Bed },
      { key: "moon", Icon: Moon },
      { key: "sun", Icon: Sun },
    ],
  },
  {
    label: "Food & Drink",
    icons: [
      { key: "utensils", Icon: Utensils },
      { key: "salad", Icon: Salad },
      { key: "coffee", Icon: Coffee },
      { key: "droplet", Icon: Droplet },
      { key: "apple", Icon: Apple },
    ],
  },
  {
    label: "Mind & Learning",
    icons: [
      { key: "book", Icon: BookOpen },
      { key: "graduation", Icon: GraduationCap },
      { key: "pen", Icon: PenLine },
      { key: "brain", Icon: Brain },
      { key: "sparkles", Icon: Sparkles },
    ],
  },
  {
    label: "Creative & Fun",
    icons: [
      { key: "palette", Icon: Palette },
      { key: "guitar", Icon: Guitar },
      { key: "gamepad", Icon: Gamepad2 },
      { key: "music", Icon: Music2 },
      { key: "paw", Icon: PawPrint },
    ],
  },
  {
    label: "Life & Home",
    icons: [
      { key: "wallet", Icon: Wallet },
      { key: "home", Icon: Home },
      { key: "leaf", Icon: Leaf },
      { key: "smile", Icon: Smile },
      { key: "target", Icon: Target },
    ],
  },
];

// Flat list derived from the categories above — every existing lookup that
// searches icons by key (rendering a habit's icon, the random-pick helper)
// keeps working unchanged.
const ICONS = ICON_CATEGORIES.flatMap((c) => c.icons);


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
// Whether a habit had been created yet as of a given date — habits from
// before this field existed (sample habits, very old data) have no
// createdAt and are treated as always having existed, so nothing vanishes.
function habitExistsOn(habit, dateStr) {
  if (!habit.createdAt) return true;
  return dateStr >= fmt(new Date(habit.createdAt));
}

function isVisibleOn(habit, dateStr) {
  // A habit marked completed stays visible through the day it was completed
  // on, then disappears starting the next day — it's done, so it shouldn't
  // keep cluttering the daily list.
  if (habit.completed && habit.completedDate && dateStr > habit.completedDate) return false;
  if (!habitExistsOn(habit, dateStr)) return false;
  if (habit.frequency?.type === "once") return isScheduledOn(habit, dateStr);
  return true;
}

// Habits created before categories existed fall back to a single bucket so
// they still show up somewhere in the switcher instead of vanishing.
function habitCategory(habit) {
  return habit.category || UNCATEGORIZED;
}

// Percentage math needs a stricter check than list visibility: a "specific
// days" habit (e.g. gym on Mon/Tue) still shows in the list every day so it
// can be logged off-schedule. On its scheduled days it always pulls weight,
// done or not. On any other day it normally shouldn't move the number at
// all — but if the user goes ahead and does it anyway on an off-schedule
// day, that extra effort should count in its favor: it pulls weight in
// (and immediately counts as done) only when actually completed there,
// never as a missed day it wasn't asked to show up for.
function countsTowardPercentOn(habit, dateStr, val) {
  if (habit.completed && habit.completedDate && dateStr > habit.completedDate) return false;
  if (!habitExistsOn(habit, dateStr)) return false;
  if (isScheduledOn(habit, dateStr)) return true;
  return !!val;
}

// How much a habit's completion pulls on a day's overall percentage —
// combines difficulty (how hard it is) with importance (how much it
// matters), so a hard, high-importance habit moves the number more than an
// easy, low-importance one. Importance defaults to 3 ("medium") for habits
// created before this field existed.
function habitWeight(habit) {
  return habit.difficulty + (habit.importance || 3);
}

// A milestone-type habit only contributes to a day's percentage once the
// user has set a daily goal for that date (a specific set of milestone IDs
// they're aiming to finish that day) — otherwise it's excluded entirely,
// same spirit as countsTowardPercentOn. Its contribution is partial credit:
// how many of that day's targeted milestones were actually marked done on
// or before that date (milestone completion values are date-stamped, e.g.
// "2026-08-09", not just true/false, so this stays accurate for past days).
function milestoneDayContribution(habit, dateStr, milestoneTargets, milestoneCompletions) {
  const targetIds = milestoneTargets?.[dateStr]?.[habit.id];
  if (!targetIds || targetIds.length === 0) return null;
  const doneMap = milestoneCompletions[habit.id] || {};
  let done = 0;
  targetIds.forEach((mid) => {
    const val = doneMap[mid];
    if (val === true || (typeof val === "string" && val <= dateStr)) done++;
  });
  return { total: targetIds.length, done };
}

// A day's stored notes for a habit have gone through a few shapes over
// time: a legacy plain string, then a single { text, time } object, and now
// an array of { id, text, time } so a day can hold more than one note. This
// normalizes any of those into an array so callers never have to care which
// shape old data is in.
function getHabitNotesArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.trim() ? [{ id: "legacy", text: val, time: null }] : [];
  if (typeof val === "object" && val.text) return [{ id: "legacy", text: val.text, time: val.time || null }];
  return [];
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

// A longer, horizontally-scrollable stretch of days for the "this week"
// strip: starts at the Monday of the earliest week we have any signal for
// (first habit created, or first record on file), and runs through the
// Sunday of the current week — so the current week always sits fully
// visible at the trailing edge while scrolling left reveals past weeks.
function getScrollableDayRange(today, habits, records) {
  const todayDate = parseDate(today);
  const isoDow = (todayDate.getDay() + 6) % 7;
  const weekEnd = new Date(todayDate);
  weekEnd.setDate(todayDate.getDate() + (6 - isoDow));

  const candidateDates = [];
  habits.forEach((h) => {
    if (h.createdAt) candidateDates.push(fmt(new Date(h.createdAt)));
  });
  Object.keys(records).forEach((ds) => candidateDates.push(ds));

  let startDate;
  if (candidateDates.length > 0) {
    const earliest = candidateDates.reduce((min, ds) => (ds < min ? ds : min), candidateDates[0]);
    startDate = parseDate(earliest);
  } else {
    // No history yet — still show a few past weeks so there's somewhere to scroll.
    startDate = new Date(todayDate);
    startDate.setDate(todayDate.getDate() - 27);
  }
  const startIsoDow = (startDate.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - startIsoDow);

  const days = [];
  const cursor = new Date(startDate);
  while (cursor <= weekEnd) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function DayRing({ pct, size = 40, strokeWidth = 3, color = YELLOW }) {
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
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// Accepts either a "#rgb"/"#rrggbb" hex string or an "rgb(r,g,b)"/"rgba(r,g,b,a)"
// string (e.g. pctColor()'s output) and returns {r,g,b}. Routing every color
// helper below through this means passing pctColor() into any of them just
// works, instead of silently parsing as black (parseInt on a leading "r"
// from "rgb(...)" returns NaN, which bitwise-coerces to 0 for every channel).
function parseColorToRgb(color) {
  const str = String(color);
  if (str.startsWith("rgb")) {
    const parts = str.match(/[\d.]+/g) || [];
    return { r: Number(parts[0]) || 0, g: Number(parts[1]) || 0, b: Number(parts[2]) || 0 };
  }
  const clean = str.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(full, 16) || 0;
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = parseColorToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lightenColor(hex, amount) {
  const { r, g, b } = parseColorToRgb(hex);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `rgb(${nr},${ng},${nb})`;
}

function darkenColor(hex, amount) {
  const { r, g, b } = parseColorToRgb(hex);
  const nr = Math.round(r * (1 - amount));
  const ng = Math.round(g * (1 - amount));
  const nb = Math.round(b * (1 - amount));
  return `rgb(${nr},${ng},${nb})`;
}

function hexToHsl(hex) {
  const { r: r255, g: g255, b: b255 } = parseColorToRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1, g1, b1;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`.toUpperCase();
}

// Five shades per base color: two darker, the true base, and two lighter —
// the middle shade is returned unchanged so existing habit colors (and the
// swatch "selected" ring) still match exactly.
function getColorShades(baseHex) {
  const [h, s, l] = hexToHsl(baseHex);
  const deltas = [-26, -13, 0, 15, 30];
  return deltas.map((d) => (d === 0 ? baseHex : hslToHex(h, s, l + d)));
}

const DEFAULT_REMINDER = { enabled: false, time: "09:00", days: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] };

const seedHabits = [
  { id: 1, name: "Drink water", description: "Stay hydrated through the day", difficulty: 1, importance: 3, color: "#4EA8DE", icon: "droplet", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: false, label: "" } },
  { id: 2, name: "Read 20 pages", description: "", difficulty: 3, importance: 4, color: "#9B5DE5", icon: "book", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: true, label: "Pages read" } },
  { id: 3, name: "No phone after 10pm", description: "Wind down before bed", difficulty: 4, importance: 5, color: "#F3722C", icon: "moon", frequency: { type: "everyday" }, reminder: DEFAULT_REMINDER, usesPercentage: false, quantityTracking: { enabled: false, label: "" } },
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
function getYesterday(todayStr) {
  const d = parseDate(todayStr);
  d.setDate(d.getDate() - 1);
  return fmt(d);
}

// Splits an already time-sorted (newest first) list of money entries into
// day buckets, each carrying a label ("Today" / "Yesterday" / short date)
// and that day's running total — used to draw a separator between days in
// the expense/income lists instead of one unbroken feed.
function groupMoneyEntriesByDate(sortedEntries, todayStr) {
  const yesterday = getYesterday(todayStr);
  const groups = [];
  let currentDate = null;
  let currentGroup = null;
  sortedEntries.forEach((entry) => {
    if (entry.date !== currentDate) {
      currentDate = entry.date;
      const d = parseDate(entry.date);
      let label;
      if (entry.date === todayStr) label = "Today";
      else if (entry.date === yesterday) label = "Yesterday";
      else label = d.toLocaleDateString("default", { weekday: "short", month: "short", day: "numeric" });
      currentGroup = { date: entry.date, label, entries: [], total: 0 };
      groups.push(currentGroup);
    }
    currentGroup.entries.push(entry);
    currentGroup.total += entry.amount;
  });
  return groups;
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

function StarPicker({ value, onChange, label = "difficulty" }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_DIFFICULTY }, (_, i) => i + 1).map((i) => {
        const filled = i <= value;
        return (
          <button
            key={i}
            type="button"
            className="star-btn"
            aria-label={`Set ${label} to ${i}`}
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
function buildTrendSeries(habits, records, today, milestoneTargets, milestoneCompletions, categoryFilter) {
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
    let total = 0;
    let done = 0;
    if (rec) {
      Object.entries(rec).forEach(([hid, val]) => {
        const hb = habits.find((h) => String(h.id) === String(hid));
        if (!hb) return;
        if (categoryFilter && categoryFilter !== "All" && habitCategory(hb) !== categoryFilter) return;
        if (!countsTowardPercentOn(hb, ds, val)) return;
        const w = habitWeight(hb);
        total += w;
        if (val) done += w;
      });
    }
    habits.forEach((hb) => {
      if (hb.frequency?.type !== "milestone") return;
      if (categoryFilter && categoryFilter !== "All" && habitCategory(hb) !== categoryFilter) return;
      if (hb.completed && hb.completedDate && ds > hb.completedDate) return;
      const contribution = milestoneDayContribution(hb, ds, milestoneTargets, milestoneCompletions);
      if (!contribution || contribution.total === 0) return;
      const w = habitWeight(hb);
      total += w;
      done += w * (contribution.done / contribution.total);
    });
    const pct = total === 0 ? null : Math.round((done / total) * 100);
    series.push({ date: ds, pct });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

// Aggregates a daily {date, pct} series into one point per ISO week (Monday
// start): each week's pct is the average of that week's tracked days (days
// with no data are skipped, not counted as 0). `date` on each returned point
// is the Monday that starts that week, so it stays compatible with the same
// {date, pct} shape TrendGraph already expects.
function buildWeeklyTrendSeries(dailySeries) {
  const weeks = new Map();
  dailySeries.forEach((pt) => {
    const d = parseDate(pt.date);
    const isoDow = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - isoDow);
    const weekKey = fmt(monday);
    if (!weeks.has(weekKey)) weeks.set(weekKey, { sum: 0, count: 0 });
    if (pt.pct !== null) {
      const w = weeks.get(weekKey);
      w.sum += pt.pct;
      w.count += 1;
    }
  });
  return Array.from(weeks.keys())
    .sort()
    .map((weekKey) => {
      const w = weeks.get(weekKey);
      return { date: weekKey, pct: w.count === 0 ? null : Math.round(w.sum / w.count) };
    });
}

// Continuous, horizontally-scrollable line + area graph of completion
// percentage. Renders wide enough to fit one point per day (or per week, in
// "weekly" mode) and defaults its scroll position to today (the right edge)
// — scrolling left reveals earlier history, all the way back to the first
// tracked day/week.
function TrendGraph({ series, todayDate, mode = "daily" }) {
  const scrollRef = useRef(null);
  const pxPerDay = mode === "weekly" ? 30 : 14;
  const height = 160;
  const width = Math.max(series.length * pxPerDay, 320);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [series.length, mode]);

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

  // Sparse date labels so they don't collide — roughly weekly in daily mode,
  // roughly monthly in weekly mode (since each point already spans a week).
  const labelEvery = mode === "weekly" ? 4 : 7;

  // In weekly mode a point's `date` is the Monday that starts the week, so
  // "current" means today falls anywhere inside that 7-day span rather than
  // an exact date match.
  function isCurrentPeriod(pt) {
    if (mode === "weekly") {
      const start = parseDate(pt.date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return todayDate >= start && todayDate <= end;
    }
    return pt.date === fmt(todayDate);
  }

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
          const isCurrent = isCurrentPeriod(pt.pt);
          return <circle key={i} cx={pt.x} cy={pt.y} r={isCurrent ? 3.5 : 2} fill={isCurrent ? YELLOW : ACCENT_GREEN} />;
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

// A single transaction line in the money calculator's list — a colored
// left edge + icon badge signal expense vs. income at a glance, shared by
// both the expense and income tabs so the two lists stay visually consistent.
function MoneyEntryRow({ entry, currencySymbol, Icon, accentColor, onDelete, deleteLabel, onEdit, editLabel }) {
  return (
    <div
      className="money-row rounded-xl flex items-center gap-3 px-2.5 py-3"
      style={{
        background: "#111110",
        border: "1px solid #242422",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: "34px", height: "34px", background: hexToRgba(accentColor, 0.14), color: accentColor }}
      >
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="mono text-sm shrink-0" style={{ color: "#EDEDEA", fontWeight: 700 }}>
            {currencySymbol}
            {entry.amount.toFixed(2)}
          </span>
          {entry.description && (
            <span className="text-xs truncate min-w-0 flex-1" style={{ color: "#8A8A85" }}>
              {entry.description}
            </span>
          )}
        </div>
        <div className="mt-1">
          <span
            className="inline-block truncate text-xs rounded-full px-2 py-0.5"
            style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#8A8A85", maxWidth: "180px", verticalAlign: "top" }}
          >
            {entry.category}
          </span>
        </div>
        {entry.time && (
          <div className="text-xs mt-1" style={{ color: "#6E6E6A" }}>
            {new Date(entry.time).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit", hour12: true })}
          </div>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1">
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label={editLabel}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color: "#8A8A85" }}
          >
            <Pencil size={14} />
          </button>
        )}
        <button
          onClick={onDelete}
          aria-label={deleteLabel}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ color: "#8A8A85" }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// A slim divider between days in the expense/income lists — a label
// ("Today" / "Yesterday" / short date), a hairline rule, and that day's
// running total, so browsing the list makes it obvious where one day's
// transactions end and the next begin.
function MoneyDayHeader({ label, total, currencySymbol, accentColor, isFirst }) {
  return (
    <div className="flex items-center gap-2" style={{ marginTop: isFirst ? 0 : "16px", marginBottom: "8px" }}>
      <span className="text-xs mono" style={{ color: "#8A8A85", fontWeight: 700, letterSpacing: "0.05em" }}>
        {label.toUpperCase()}
      </span>
      <div style={{ flex: 1, height: "1px", background: "#1C1C19" }} />
      <span className="mono text-xs" style={{ color: accentColor, fontWeight: 700 }}>
        {currencySymbol}
        {total.toFixed(2)}
      </span>
    </div>
  );
}

export default function HabitTracker() {
  const today = fmt(new Date());

  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleSignInError, setGoogleSignInError] = useState("");
  const [backupMessage, setBackupMessage] = useState("");
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState({});
  const [percentRecords, setPercentRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [quantityRecords, setQuantityRecords] = useState({});
  const [milestoneCompletions, setMilestoneCompletions] = useState({});
  // { [dateStr]: { [habitId]: [milestoneId, ...] } } — which milestones the
  // user targeted to complete on a given day, for a milestone-type habit.
  const [milestoneTargets, setMilestoneTargets] = useState({});
  const [milestoneCompletionTimes, setMilestoneCompletionTimes] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expenseQuality, setExpenseQuality] = useState("bad"); // "good" | "bad" — was this a good or bad expense?
  const [otherExpenseLabel, setOtherExpenseLabel] = useState(""); // free-text label when category is "Other"
  const [otherExpenseIcon, setOtherExpenseIcon] = useState(null); // chosen lucide icon name for that label
  const [editingExpenseId, setEditingExpenseId] = useState(null); // id of the expense currently being edited, or null
  const [flashActive, setFlashActive] = useState(false); // gates the habit-card flash sweep so it starts cleanly
  const [currency, setCurrency] = useState(null); // "USD" | "INR" — null until the user picks one
  const [incomes, setIncomes] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeCategory, setIncomeCategory] = useState(INCOME_CATEGORIES[0]);
  const [calculatorTab, setCalculatorTab] = useState("expense"); // "expense" | "income"
  const [dailyBudgets, setDailyBudgets] = useState({}); // { [dateStr]: amount }
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState("");
  // Queue of milestone habits still needing today's goal set, shown one at a
  // time; [{ habit }] — first entry is the one currently prompted.
  const [milestoneGoalQueue, setMilestoneGoalQueue] = useState([]);
  const [goalFromId, setGoalFromId] = useState(null);
  const [goalToId, setGoalToId] = useState(null);
  const [statsHabit, setStatsHabit] = useState(null);
  const [infoHabit, setInfoHabit] = useState(null);
  const [noteModalHabit, setNoteModalHabit] = useState(null);
  const [noteInputValue, setNoteInputValue] = useState("");
  const [noteModalDate, setNoteModalDate] = useState(null);
  const [noteEditingId, setNoteEditingId] = useState(null);
  const [cameraNotice, setCameraNotice] = useState(false);
  const [period, setPeriod] = useState("weekly");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (selectedCategory === "All") return;
    const stillExists = habits.some((h) => habitCategory(h) === selectedCategory);
    if (!stillExists) setSelectedCategory("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [importance, setImportance] = useState(3);
  const [category, setCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
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
  const [trendGraphView, setTrendGraphView] = useState("daily"); // "daily" | "weekly"
  const [completeHabitConfirm, setCompleteHabitConfirm] = useState(null); // habit pending "mark completed" confirmation

  const pressRef = useRef({ timer: null, longPressed: false });
  const audioCtxRef = useRef(null);
  const googleButtonRef = useRef(null);
  const backupFileInputRef = useRef(null);
  const allowExitRef = useRef(false);
  const daysStripRef = useRef(null);
  const todayDayCellRef = useRef(null);
  const expenseFormRef = useRef(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  function getAudioContext() {
    if (!audioCtxRef.current) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      } catch (e) {
        audioCtxRef.current = null;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default the "this week" strip's scroll position to today, so opening the
  // app lands on the current day instead of the far-left (earliest) end of
  // its scrollable history. Set scrollLeft on the strip directly rather than
  // cell.scrollIntoView(): on mobile browsers, scrollIntoView on a nested
  // scroll container can bubble up and shift the whole page's scroll/zoom
  // before the viewport has settled on first paint, which is what was
  // causing the page to look mis-fit until the next navigation forced a
  // reflow. Setting scrollLeft touches only this one element.
  useEffect(() => {
    if (loading) return;
    const raf = requestAnimationFrame(() => {
      const container = daysStripRef.current;
      const cell = todayDayCellRef.current;
      if (container && cell) {
        const target = cell.offsetLeft - container.clientWidth / 2 + cell.clientWidth / 2;
        container.scrollLeft = Math.max(0, target);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [loading]);

  // The habit-card flash sweep starts paused (see .habit-flash's
  // animation-play-state in the stylesheet below) and only switches to
  // running here, after a confirmed first paint. Some mobile browsers fail
  // to start CSS animations that are already set to "running" on elements
  // present at initial paint — the animation stays visually frozen at its
  // first frame until something else forces a reflow (e.g. scrolling),
  // which is exactly the "stuck until I scroll" symptom. Flipping the
  // play-state on afterward, once layout has definitely settled, avoids
  // that stall. The nested rAF (rather than a single one) waits a full
  // extra frame to make sure that first paint has actually happened.
  useEffect(() => {
    if (loading) return;
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFlashActive(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [loading]);

  // Back-button handling: pressing back closes whatever's open on top
  // (a modal, the detail view, the Archive tab...) instead of leaving the
  // app. Only when nothing is open — the bare Home screen — does back
  // trigger an "Exit Strata?" confirmation, and only a "Yes" there lets the
  // browser actually navigate away.
  useEffect(() => {
    window.history.pushState({ strataGuard: true }, "");

    const closeTopmostView = () => {
      // Highest-priority (most "on top") first.
      if (showExitConfirm) {
        setShowExitConfirm(false);
        return true;
      }
      if (trophyUnlock) {
        setTrophyUnlock(null);
        return true;
      }
      if (percentPrompt) {
        declinePercentPrompt();
        return true;
      }
      if (completeHabitConfirm) {
        cancelCompleteHabit();
        return true;
      }
      if (deleteTarget) {
        setDeleteTarget(null);
        return true;
      }
      if (percentEditHabit) {
        setPercentEditHabit(null);
        return true;
      }
      if (quantityEditHabit) {
        setQuantityEditHabit(null);
        return true;
      }
      if (noteModalHabit) {
        setNoteModalHabit(null);
        setNoteModalDate(null);
        setNoteEditingId(null);
        return true;
      }
      if (milestoneGoalQueue.length > 0) {
        setMilestoneGoalQueue((q) => q.slice(1));
        return true;
      }
      if (showTrendGraph) {
        setShowTrendGraph(false);
        return true;
      }
      if (calendarHabit) {
        setCalendarHabit(null);
        return true;
      }
      if (statsHabit) {
        setStatsHabit(null);
        return true;
      }
      if (achievementsHabit) {
        setAchievementsHabit(null);
        return true;
      }
      if (showAccountModal) {
        setShowAccountModal(false);
        return true;
      }
      if (showNavMenu) {
        setShowNavMenu(false);
        return true;
      }
      if (showAddModal) {
        closeAddModal();
        return true;
      }
      if (detailHabit) {
        closeDetail();
        return true;
      }
      if (currentView !== "home") {
        setCurrentView("home");
        return true;
      }
      return false;
    };

    const handlePopState = () => {
      if (allowExitRef.current) return; // user already confirmed — let this one through

      const closedSomething = closeTopmostView();
      if (!closedSomething) {
        setShowExitConfirm(true);
      }
      // Re-plant a guard so the next back press is caught too.
      window.history.pushState({ strataGuard: true }, "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showExitConfirm,
    trophyUnlock,
    percentPrompt,
    completeHabitConfirm,
    deleteTarget,
    percentEditHabit,
    quantityEditHabit,
    noteModalHabit,
    milestoneGoalQueue,
    showTrendGraph,
    calendarHabit,
    statsHabit,
    achievementsHabit,
    showAccountModal,
    showNavMenu,
    showAddModal,
    detailHabit,
    currentView,
  ]);

  const confirmExit = () => {
    allowExitRef.current = true;
    window.history.back();
  };

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
    let mt = {};
    try {
      const mtRes = await window.storage.get(MILESTONE_TARGETS_KEY, false);
      if (mtRes) mt = JSON.parse(mtRes.value);
    } catch (e) {}
    let mct = {};
    try {
      const mctRes = await window.storage.get(MILESTONE_TIMES_KEY, false);
      if (mctRes) mct = JSON.parse(mctRes.value);
    } catch (e) {}
    let ex = [];
    try {
      const exRes = await window.storage.get(EXPENSES_KEY, false);
      if (exRes) ex = JSON.parse(exRes.value);
    } catch (e) {}
    let curr = null;
    try {
      const currRes = await window.storage.get(CURRENCY_KEY, false);
      if (currRes) curr = JSON.parse(currRes.value);
    } catch (e) {}
    let inc = [];
    try {
      const incRes = await window.storage.get(INCOME_KEY, false);
      if (incRes) inc = JSON.parse(incRes.value);
    } catch (e) {}
    let budgets = {};
    try {
      const budgetRes = await window.storage.get(DAILY_BUDGET_KEY, false);
      if (budgetRes) budgets = JSON.parse(budgetRes.value);
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
    setMilestoneTargets(mt);
    setMilestoneCompletionTimes(mct);
    setExpenses(ex);
    setCurrency(curr);
    setIncomes(inc);
    setDailyBudgets(budgets);
    setLoading(false);

    // Any milestone habit that still has milestones left, and doesn't have
    // today's goal set yet, gets queued to ask "which ones today?"
    const needsGoal = h.filter((hb) => {
      if (hb.frequency?.type !== "milestone") return false;
      if (hb.completed) return false;
      const msList = hb.milestones || [];
      if (msList.length === 0) return false;
      const doneMap = m[hb.id] || {};
      const allDone = msList.every((ms) => !!doneMap[ms.id]);
      if (allDone) return false;
      const todaysTarget = mt[today]?.[hb.id];
      return !todaysTarget || todaysTarget.length === 0;
    });
    if (needsGoal.length > 0) setMilestoneGoalQueue(needsGoal.map((hb) => ({ habit: hb })));

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

  async function persistMilestoneTargets(newTargets) {
    setMilestoneTargets(newTargets);
    try {
      await window.storage.set(MILESTONE_TARGETS_KEY, JSON.stringify(newTargets), false);
    } catch (e) {
      console.error("Failed to save milestone targets:", e);
    }
  }

  async function persistMilestoneCompletionTimes(newTimes) {
    setMilestoneCompletionTimes(newTimes);
    try {
      await window.storage.set(MILESTONE_TIMES_KEY, JSON.stringify(newTimes), false);
    } catch (e) {
      console.error("Failed to save milestone completion times:", e);
    }
  }

  async function persistExpenses(newExpenses) {
    setExpenses(newExpenses);
    try {
      await window.storage.set(EXPENSES_KEY, JSON.stringify(newExpenses), false);
    } catch (e) {
      console.error("Failed to save expenses:", e);
    }
  }

  async function persistCurrency(newCurrency) {
    playClickSound(getAudioContext());
    setCurrency(newCurrency);
    try {
      await window.storage.set(CURRENCY_KEY, JSON.stringify(newCurrency), false);
    } catch (e) {
      console.error("Failed to save currency:", e);
    }
  }

  const addExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) return;
    playConfirmSound(getAudioContext());
    const isOther = expenseCategory === "Other";
    const customLabel = isOther ? otherExpenseLabel.trim() : "";
    const category = customLabel || expenseCategory;
    const icon = isOther && otherExpenseIcon ? otherExpenseIcon : null;
    const description = expenseDescription.trim();

    if (editingExpenseId !== null) {
      persistExpenses(
        expenses.map((e) =>
          e.id === editingExpenseId ? { ...e, amount, description, category, icon, quality: expenseQuality } : e
        )
      );
      setEditingExpenseId(null);
    } else {
      const entry = {
        id: Date.now() + Math.random(),
        amount,
        description,
        category,
        icon,
        quality: expenseQuality,
        date: today,
        time: Date.now(),
      };
      persistExpenses([entry, ...expenses]);
    }
    setExpenseAmount("");
    setExpenseDescription("");
    setOtherExpenseLabel("");
    setOtherExpenseIcon(null);
  };

  // Populates the expense form with an existing entry's values so the user
  // can change them, instead of only being able to delete and re-add.
  const startEditExpense = (entry) => {
    playClickSound(getAudioContext());
    const isCustom = !EXPENSE_CATEGORIES.includes(entry.category);
    setEditingExpenseId(entry.id);
    setExpenseAmount(String(entry.amount));
    setExpenseDescription(entry.description || "");
    setExpenseQuality(entry.quality || "bad");
    if (isCustom) {
      setExpenseCategory("Other");
      setOtherExpenseLabel(entry.category);
      setOtherExpenseIcon(entry.icon || null);
    } else {
      setExpenseCategory(entry.category);
      setOtherExpenseLabel("");
      setOtherExpenseIcon(null);
    }
    if (expenseFormRef.current) {
      expenseFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const cancelEditExpense = () => {
    setEditingExpenseId(null);
    setExpenseAmount("");
    setExpenseDescription("");
    setExpenseCategory(EXPENSE_CATEGORIES[0]);
    setExpenseQuality("bad");
    setOtherExpenseLabel("");
    setOtherExpenseIcon(null);
  };

  const deleteExpense = (id) => {
    playDeleteSound(getAudioContext());
    if (editingExpenseId === id) cancelEditExpense();
    persistExpenses(expenses.filter((e) => e.id !== id));
  };

  async function persistIncomes(newIncomes) {
    setIncomes(newIncomes);
    try {
      await window.storage.set(INCOME_KEY, JSON.stringify(newIncomes), false);
    } catch (e) {
      console.error("Failed to save income:", e);
    }
  }

  const addIncome = () => {
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0) return;
    playConfirmSound(getAudioContext());
    const entry = {
      id: Date.now() + Math.random(),
      amount,
      description: incomeDescription.trim(),
      category: incomeCategory,
      date: today,
      time: Date.now(),
    };
    persistIncomes([entry, ...incomes]);
    setIncomeAmount("");
    setIncomeDescription("");
  };

  const deleteIncome = (id) => {
    playDeleteSound(getAudioContext());
    persistIncomes(incomes.filter((e) => e.id !== id));
  };

  async function persistDailyBudgets(newBudgets) {
    setDailyBudgets(newBudgets);
    try {
      await window.storage.set(DAILY_BUDGET_KEY, JSON.stringify(newBudgets), false);
    } catch (e) {
      console.error("Failed to save daily budget:", e);
    }
  }

  const setTodayBudget = () => {
    const amount = parseFloat(budgetInputValue);
    if (!amount || amount <= 0) return;
    playConfirmSound(getAudioContext());
    persistDailyBudgets({ ...dailyBudgets, [today]: amount });
    setBudgetInputValue("");
    setShowBudgetInput(false);
  };

  const clearTodayBudget = () => {
    playDeleteSound(getAudioContext());
    const next = { ...dailyBudgets };
    delete next[today];
    persistDailyBudgets(next);
  };

  // Bundles every piece of stored data into one downloadable file. This is
  // the actual working way to move progress to a new device: export here,
  // transfer the file however you like (email, Drive, AirDrop...), then
  // import it on the new device.
  function exportBackup() {
    const payload = {
      app: "strata-habit-tracker",
      exportedAt: new Date().toISOString(),
      data: {
        habits,
        records,
        percentRecords,
        notes,
        quantityRecords,
        milestoneCompletions,
        milestoneTargets,
        milestoneCompletionTimes,
        expenses,
        currency,
        incomes,
        dailyBudgets,
      },
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStamp = fmt(new Date());
      a.href = url;
      a.download = `strata-backup-${dateStamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMessage("Backup downloaded.");
    } catch (e) {
      console.error("Export failed:", e);
      setBackupMessage("Export failed — try again.");
    }
  }

  // Reads a previously exported file and restores it, overwriting whatever
  // is currently stored on this device.
  async function importBackup(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const d = parsed && parsed.data;
      if (!d || !Array.isArray(d.habits)) {
        setBackupMessage("That doesn't look like a Strata backup file.");
        return;
      }
      await persistHabits(d.habits || []);
      await persistRecords(d.records || {});
      await persistPercentRecords(d.percentRecords || {});
      await persistNotes(d.notes || {});
      await persistQuantityRecords(d.quantityRecords || {});
      await persistMilestoneCompletions(d.milestoneCompletions || {});
      await persistMilestoneTargets(d.milestoneTargets || {});
      await persistMilestoneCompletionTimes(d.milestoneCompletionTimes || {});
      await persistExpenses(d.expenses || []);
      if (d.currency) await persistCurrency(d.currency);
      await persistIncomes(d.incomes || []);
      await persistDailyBudgets(d.dailyBudgets || {});
      setBackupMessage("Backup restored.");
    } catch (e) {
      console.error("Import failed:", e);
      setBackupMessage("Couldn't read that file — make sure it's a Strata backup.");
    }
  }

  // Decodes the JWT Google hands back after sign-in (name/email/photo only
  // — this is identity, not a data channel; nothing here syncs habit data).
  function decodeJwtPayload(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    if (!showAccountModal || !GOOGLE_CLIENT_ID || googleUser) return;
    setGoogleSignInError("");

    const init = () => {
      try {
        if (!window.google?.accounts?.id) {
          setGoogleSignInError("Google sign-in couldn't load.");
          return;
        }
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const payload = decodeJwtPayload(response.credential);
            if (payload) {
              setGoogleUser({ name: payload.name, email: payload.email, picture: payload.picture });
            } else {
              setGoogleSignInError("Couldn't read your Google account details.");
            }
          },
        });
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            width: 280,
          });
        }
      } catch (e) {
        setGoogleSignInError("Google sign-in couldn't load.");
      }
    };

    if (document.getElementById("google-identity-script")) {
      init();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    script.onerror = () => setGoogleSignInError("Couldn't reach Google — check your connection.");
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAccountModal, googleUser]);

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

  // Drop any queued "set today's goal" prompt whose habit has since been
  // completed/archived or has no incomplete milestones left — otherwise a
  // stale entry could sit at the front of the queue forever.
  useEffect(() => {
    if (milestoneGoalQueue.length === 0) return;
    const head = milestoneGoalQueue[0];
    const liveHabit = habits.find((h) => h.id === head.habit.id);
    if (!liveHabit || liveHabit.completed) {
      setMilestoneGoalQueue((q) => q.slice(1));
      return;
    }
    const doneMap = milestoneCompletions[liveHabit.id] || {};
    const incomplete = (liveHabit.milestones || []).filter((m) => !doneMap[m.id]);
    if (incomplete.length === 0) {
      setMilestoneGoalQueue((q) => q.slice(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestoneGoalQueue, habits, milestoneCompletions]);

  // Reset the From/To range picker defaults whenever a new habit reaches
  // the front of the goal queue.
  useEffect(() => {
    const head = milestoneGoalQueue[0];
    if (!head) return;
    const liveHabit = habits.find((h) => h.id === head.habit.id) || head.habit;
    const doneMap = milestoneCompletions[liveHabit.id] || {};
    const incomplete = (liveHabit.milestones || []).filter((m) => !doneMap[m.id]);
    if (incomplete.length > 0) {
      setGoalFromId(String(incomplete[0].id));
      setGoalToId(String(incomplete[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestoneGoalQueue[0]?.habit?.id]);

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

    const habitTimes = { ...(milestoneCompletionTimes[habit.id] || {}) };
    if (willBeDone) {
      habitTimes[milestoneId] = Date.now();
    } else {
      delete habitTimes[milestoneId];
    }
    persistMilestoneCompletionTimes({ ...milestoneCompletionTimes, [habit.id]: habitTimes });

    const ctx = getAudioContext();
    if (willBeDone) {
      playCheckSound(ctx);
      const key = `${habit.id}-${milestoneId}`;
      setAnimatingMilestoneKey(key);
      setTimeout(() => setAnimatingMilestoneKey((k) => (k === key ? null : k)), 650);

      const newTotal = oldTotal + 1;
      const levels = getEffectiveLevels(habit);
      const crossed = levels.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTrophyUnlock({ id: Date.now() + Math.random(), habit, level });
      }

      // Once every milestone is checked off, there's nothing left to do —
      // move it to the archive automatically instead of leaving a "0 left"
      // habit sitting in the daily list.
      const totalMilestones = (habit.milestones || []).length;
      if (totalMilestones > 0 && newTotal >= totalMilestones && !habit.completed) {
        const newHabits = habits.map((h) =>
          h.id === habit.id ? { ...h, completed: true, completedDate: today, completedAt: Date.now() } : h
        );
        persistHabits(newHabits);
      }
    } else {
      playUncheckSound(ctx);
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

    const ctx = getAudioContext();
    if (willBeDone) {
      playCheckSound(ctx);
      setAnimatingId(habit.id);
      setTimeout(() => setAnimatingId(null), 660);
      const word = CELEBRATION_WORDS[Math.floor(Math.random() * CELEBRATION_WORDS.length)];
      setBurst({ id: Date.now() + Math.random(), color: habit.color, origin, word });
      setTimeout(() => setBurst(null), 1150);

      const newTotal = oldTotal + 1;
      const crossed = ACHIEVEMENT_LEVELS.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTimeout(() => {
          setTrophyUnlock({ id: Date.now() + Math.random(), habit, level });
        }, 350);
      }
    } else {
      playUncheckSound(ctx);
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

    const ctx = getAudioContext();
    if (willBeDone && habit) {
      playCheckSound(ctx);
      const newTotal = oldTotal + 1;
      const crossed = ACHIEVEMENT_LEVELS.filter((l) => oldTotal < l.threshold && newTotal >= l.threshold);
      if (crossed.length > 0) {
        const level = crossed[crossed.length - 1];
        setTrophyUnlock({ id: Date.now() + Math.random(), habit, level });
      }
    } else {
      playUncheckSound(ctx);
    }
  };

  // The trophy reveals immediately and automatically — no lock, no tapping,
  // no buildup. Sound + haptics fire right as it appears, then it holds for
  // a few seconds before auto-dismissing.
  useEffect(() => {
    if (!trophyUnlock) return;
    const ctx = getAudioContext();
    playTrophyFanfare(ctx);
    triggerHaptics([30, 40, 30, 40, 110]);
    const t = setTimeout(() => setTrophyUnlock(null), 3400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trophyUnlock?.id]);

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
    setImportance(3);
    setCategory("");
    setShowCustomCategoryInput(false);
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
    const trimmedCategory = category.trim();
    if (!trimmed || !trimmedCategory) return;
    playConfirmSound(getAudioContext());
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
          ? { ...h, name: trimmed, description: description.trim(), difficulty, importance, category: trimmedCategory, color, icon, frequency, reminder, quantityTracking, milestones }
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
      // If the number of milestones changed (added or removed one), today's
      // goal may no longer make sense — clear it and ask again.
      if (frequency.type === "milestone") {
        const oldCount = (existingHabitForEdit?.milestones || []).length;
        if (milestones.length !== oldCount) {
          const dayTargets = { ...(milestoneTargets[today] || {}) };
          delete dayTargets[editingHabitId];
          persistMilestoneTargets({ ...milestoneTargets, [today]: dayTargets });
          const updatedHabit = newHabits.find((h) => h.id === editingHabitId);
          if (updatedHabit && milestones.length > 0) {
            setMilestoneGoalQueue((q) => (q.some((it) => it.habit.id === editingHabitId) ? q : [...q, { habit: updatedHabit }]));
          }
        }
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
        importance,
        category: trimmedCategory,
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
      if (frequency.type === "milestone" && milestones.length > 0) {
        setMilestoneGoalQueue((q) => [...q, { habit: newHabit }]);
      }
    }
  };

  const openAddModal = () => {
    playClickSound(getAudioContext());
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
    setImportance(habit.importance || 3);
    setCategory(habit.category || "");
    setShowCustomCategoryInput(false);
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

  const openNoteModal = (habit, dateStr = today, existingNoteId = null) => {
    if (existingNoteId) {
      const notesForDay = getHabitNotesArray(notes[dateStr]?.[habit.id]);
      const existing = notesForDay.find((n) => n.id === existingNoteId);
      setNoteInputValue(existing ? existing.text : "");
      setNoteEditingId(existingNoteId);
    } else {
      setNoteInputValue("");
      setNoteEditingId(null);
    }
    setNoteModalHabit(habit);
    setNoteModalDate(dateStr);
  };

  const saveNote = () => {
    if (!noteModalHabit || !noteModalDate) return;
    const trimmed = noteInputValue.trim();
    const dayNotes = { ...(notes[noteModalDate] || {}) };
    const existingArray = getHabitNotesArray(dayNotes[noteModalHabit.id]);

    if (noteEditingId) {
      if (trimmed) {
        dayNotes[noteModalHabit.id] = existingArray.map((n) => (n.id === noteEditingId ? { ...n, text: trimmed } : n));
      } else {
        const filtered = existingArray.filter((n) => n.id !== noteEditingId);
        if (filtered.length > 0) {
          dayNotes[noteModalHabit.id] = filtered;
        } else {
          delete dayNotes[noteModalHabit.id];
        }
      }
    } else if (trimmed) {
      const newNote = { id: Date.now() + Math.random(), text: trimmed, time: Date.now() };
      dayNotes[noteModalHabit.id] = [...existingArray, newNote];
    }
    persistNotes({ ...notes, [noteModalDate]: dayNotes });
    setNoteModalHabit(null);
    setNoteModalDate(null);
    setNoteEditingId(null);
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
    playArchiveSound(getAudioContext());
    const newHabits = habits.map((h) =>
      h.id === habit.id ? { ...h, completed: true, completedDate: today, completedAt: Date.now() } : h
    );
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
    Object.entries(notes).forEach(([ds, dayNotes]) => {
      const notesForDay = getHabitNotesArray(dayNotes && dayNotes[habit.id]);
      notesForDay.forEach((n) => {
        events.push({ kind: "note", date: ds, noteId: n.id, text: n.text, time: n.time });
      });
    });
    events.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      const at = a.time || 0;
      const bt = b.time || 0;
      return bt - at;
    });

    const groups = [];
    let currentDateKey = null;
    let currentGroup = null;
    const yesterday = getYesterday(today);
    events.forEach((ev) => {
      if (ev.date !== currentDateKey) {
        currentDateKey = ev.date;
        const d = parseDate(ev.date);
        let label;
        if (ev.date === today) label = "Today";
        else if (ev.date === yesterday) label = "Yesterday";
        else label = d.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        currentGroup = { label, events: [] };
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
    let total = 0;
    let done = 0;
    if (rec) {
      Object.entries(rec).forEach(([hid, val]) => {
        const hb = habits.find((h) => String(h.id) === String(hid));
        if (!hb) return;
        if (selectedCategory !== "All" && habitCategory(hb) !== selectedCategory) return;
        if (!countsTowardPercentOn(hb, dateStr, val)) return;
        const w = habitWeight(hb);
        total += w;
        if (val) done += w;
      });
    }
    habits.forEach((hb) => {
      if (hb.frequency?.type !== "milestone") return;
      if (selectedCategory !== "All" && habitCategory(hb) !== selectedCategory) return;
      if (hb.completed && hb.completedDate && dateStr > hb.completedDate) return;
      const contribution = milestoneDayContribution(hb, dateStr, milestoneTargets, milestoneCompletions);
      if (!contribution || contribution.total === 0) return;
      const w = habitWeight(hb);
      total += w;
      done += w * (contribution.done / contribution.total);
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
  const categoriesInUse = Array.from(new Set(habits.map((h) => habitCategory(h)))).sort();

  // How "done" a habit is for a given day, on a 0-1 scale — used to sort the
  // list from most done to least done. Regular habits are binary (done or
  // not); percentage-tracked and milestone habits use their actual fraction
  // so a habit that's 80% there ranks above one that's 20% there.
  function habitDoneScore(h, dateStr, record) {
    if (h.frequency?.type === "milestone") {
      const total = (h.milestones || []).length;
      if (total === 0) return 0;
      return computeMilestoneCompletedCount(h) / total;
    }
    if (h.usesPercentage) {
      const dateKey = h.frequency?.type === "once" ? h.frequency.date : dateStr;
      const pct = percentRecords[dateKey]?.[h.id] ?? 0;
      return pct / 100;
    }
    return record[h.id] ? 1 : 0;
  }

  const visibleHabits = habits
    .filter((h) => isVisibleOn(h, selectedDate) && (selectedCategory === "All" || habitCategory(h) === selectedCategory))
    .sort((a, b) => {
      const aIsMilestone = a.frequency?.type === "milestone";
      const bIsMilestone = b.frequency?.type === "milestone";
      if (aIsMilestone !== bIsMilestone) return aIsMilestone ? 1 : -1; // milestone habits always sit at the bottom
      return habitDoneScore(b, selectedDate, selectedRecord) - habitDoneScore(a, selectedDate, selectedRecord);
    });
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
        position: "relative",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .fraunces { font-family: 'Fraunces', serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .habit-card { transition: transform 0.1s ease; user-select: none; -webkit-user-select: none; cursor: pointer; position: relative; }
        .habit-card:active { transform: scale(0.99); }
        @keyframes habitFlash {
          0% { transform: translateX(-160%) skewX(-10deg); opacity: 0; }
          8% { opacity: 0; }
          20% { opacity: 1; }
          32% { opacity: 0; }
          38% { transform: translateX(260%) skewX(-10deg); opacity: 0; }
          100% { transform: translateX(260%) skewX(-10deg); opacity: 0; }
        }
        .habit-flash {
          position: absolute;
          top: -40%;
          left: 0;
          width: 42%;
          height: 180%;
          pointer-events: none;
          filter: blur(7px);
          animation-name: habitFlash;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-play-state: paused;
        }
        .flash-on .habit-flash { animation-play-state: running; }
        @keyframes ambientDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -4%) scale(1.06); }
        }
        .ambient-glow { pointer-events: none; animation: ambientDrift 14s ease-in-out infinite; }
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
        .icon-action-btn {
          background-color: #0D0D0D;
          background-image: linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 55%);
          transition: transform 0.12s ease, border-color 0.15s ease;
        }
        .icon-action-btn:active { transform: scale(0.9); }
        .tick-btn:active { transform: scale(0.9); }
        @keyframes tickGlow {
          0% { box-shadow: 0 0 0 0 var(--glow-color); transform: scale(0.75); }
          40% { box-shadow: 0 0 26px 10px var(--glow-color); transform: scale(1.35); }
          100% { box-shadow: 0 0 0 0 transparent; transform: scale(1); }
        }
        .tick-glow { animation: tickGlow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes burstParticle {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.4); opacity: 1; }
          45% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.15); opacity: 0; }
        }
        .burst-particle {
          position: absolute;
          left: 0;
          top: 0;
          animation: burstParticle 1.2s cubic-bezier(0.12, 0.7, 0.25, 1) forwards;
        }
        @keyframes shockwave {
          0% { width: 10px; height: 10px; opacity: 0.95; border-width: 3px; }
          100% { width: 210px; height: 210px; opacity: 0; border-width: 0.5px; }
        }
        .shockwave-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 999px;
          border: 3px solid var(--ring-color);
          transform: translate(-50%, -50%);
          animation: shockwave 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes shockwave2 {
          0% { width: 6px; height: 6px; opacity: 0.6; }
          100% { width: 320px; height: 320px; opacity: 0; }
        }
        .shockwave-ring-2 {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 999px;
          border: 1.5px solid var(--ring-color);
          transform: translate(-50%, -50%);
          animation: shockwave2 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.06s;
        }
        @keyframes celebrateText {
          0% { transform: translate(-50%, 6px) scale(0.7); opacity: 0; }
          22% { transform: translate(-50%, -14px) scale(1.12); opacity: 1; }
          70% { transform: translate(-50%, -34px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -58px) scale(0.96); opacity: 0; }
        }
        .celebrate-text {
          position: absolute;
          left: 0;
          bottom: 18px;
          transform: translate(-50%, 0);
          white-space: nowrap;
          font-size: 17px;
          font-weight: 600;
          color: var(--text-color);
          text-shadow: 0 0 18px var(--text-color), 0 2px 6px rgba(0,0,0,0.6);
          animation: celebrateText 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes screenFlash {
          0% { opacity: 0.24; }
          100% { opacity: 0; }
        }
        .screen-flash { animation: screenFlash 0.4s ease-out forwards; }
        @keyframes cardCompletePop {
          0% { box-shadow: inset 0 0 0 0 var(--card-glow), 0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 18px -14px rgba(0,0,0,0.8); transform: scale(1); }
          30% { box-shadow: inset 0 0 48px 8px var(--card-glow), 0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 18px -14px rgba(0,0,0,0.8); transform: scale(1.016); }
          100% { box-shadow: inset 0 0 0 0 transparent, 0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 18px -14px rgba(0,0,0,0.8); transform: scale(1); }
        }
        .card-complete-pop { animation: cardCompletePop 0.65s cubic-bezier(0.22, 1, 0.36, 1); }
        .star-btn { transition: transform 0.12s ease; background: transparent; border: none; padding: 2px; cursor: pointer; }
        .star-btn:hover { transform: scale(1.15); }
        .period-btn { transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        @keyframes moneySheen {
          0% { transform: translateX(-120%) rotate(8deg); opacity: 0; }
          15% { opacity: 0.55; }
          60% { opacity: 0.12; }
          100% { transform: translateX(240%) rotate(8deg); opacity: 0; }
        }
        .money-sheen {
          position: absolute;
          top: -50%;
          left: 0;
          width: 34%;
          height: 200%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent);
          animation: moneySheen 1.7s ease-out forwards;
          pointer-events: none;
        }
        .money-row { transition: transform 0.12s ease, border-color 0.15s ease; }
        .money-row:active { transform: scale(0.99); }
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
        @keyframes spotlightIn {
          0% { opacity: 0; transform: translateX(-50%) scaleY(0.7); }
          20% { opacity: 1; }
          100% { opacity: 0.85; transform: translateX(-50%) scaleY(1); }
        }
        .spotlight-beam { animation: spotlightIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: top center; }
        @keyframes screenPunch {
          0% { transform: scale(1); }
          25% { transform: scale(1.045); }
          100% { transform: scale(1); }
        }
        .screen-punch { animation: screenPunch 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes impactRing {
          0% { width: 20px; height: 20px; opacity: 1; border-width: 7px; }
          100% { width: 280px; height: 280px; opacity: 0; border-width: 0px; }
        }
        .impact-ring { animation: impactRing 0.42s cubic-bezier(0.11, 0.85, 0.32, 1) forwards; }
        @keyframes trophyFlash {
          0% { opacity: 0; }
          12% { opacity: 0.78; }
          100% { opacity: 0; }
        }
        .trophy-flash { animation: trophyFlash 0.6s ease-out forwards; }
        @keyframes rayRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.55; }
          100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.5; }
        }
        .trophy-rays { animation: rayRotate 7s linear infinite; }
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
        @keyframes trophyIconIn {
          0% { transform: scale(0.4) rotate(-18deg); opacity: 0; }
          55% { transform: scale(1.2) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .trophy-icon-in { animation: trophyIconIn 0.55s 0.08s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes glowRing {
          0% { width: 16px; height: 16px; opacity: 1; border-width: 5px; }
          100% { width: 360px; height: 360px; opacity: 0; border-width: 1px; }
        }
        .glow-ring { animation: glowRing 1.45s ease-out forwards; }
        @keyframes badgeGlowPulse {
          0%, 100% { box-shadow: 0 0 60px var(--glow-c); }
          50% { box-shadow: 0 0 92px var(--glow-c); }
        }
        .badge-glow-pulse { animation: badgeGlowPulse 1.8s 1.1s ease-in-out infinite; }
        @keyframes shimmerSweep {
          0%, 55% { transform: translateX(-140%) rotate(22deg); opacity: 0; }
          64% { opacity: 0.9; }
          82% { opacity: 0; }
          100% { transform: translateX(140%) rotate(22deg); opacity: 0; }
        }
        .shimmer-sweep {
          position: absolute;
          top: -30%;
          left: 45%;
          width: 18%;
          height: 160%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent);
          animation: shimmerSweep 2.2s 0.85s ease-in-out infinite;
          pointer-events: none;
        }
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
        @keyframes trophyParticleFall {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.4); opacity: 1; }
          40% { opacity: 1; }
          62% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1); opacity: 1; }
          100% { transform: translate(calc(var(--dx) * 1.08), calc(var(--dy) + 74px)) rotate(calc(var(--rot) + 100deg)) scale(0.22); opacity: 0; }
        }
        .trophy-particle {
          position: fixed;
          animation: trophyParticleFall 1.35s cubic-bezier(0.15, 0.7, 0.25, 1) forwards;
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

      <div className={`app-content max-w-xl mx-auto px-3.5 py-10${flashActive ? " flash-on" : ""}`} style={{ paddingBottom: "110px" }}>
        {/* Header */}
        <div className="flex items-baseline mb-1" style={{ position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-30px",
              left: "-20px",
              width: "150px",
              height: "150px",
              borderRadius: "999px",
              background: hexToRgba(ACCENT_GREEN, 0.1),
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <div className="flex items-center gap-2.5" style={{ position: "relative" }}>
            <button
              onClick={() => {
                playClickSound(getAudioContext());
                setShowNavMenu(true);
              }}
              aria-label="Open menu"
              className="icon-action-btn"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #242422",
                color: "#EDEDEA",
              }}
            >
              <Menu size={18} />
            </button>
            <div className="flex flex-col gap-[3px]" aria-hidden="true">
              <div style={{ width: "16px", height: "3px", borderRadius: "2px", background: ACCENT_GREEN }} />
              <div style={{ width: "12px", height: "3px", borderRadius: "2px", background: "#9B5DE5" }} />
              <div style={{ width: "8px", height: "3px", borderRadius: "2px", background: "#F2C94C" }} />
            </div>
            <h1 className="fraunces text-3xl" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              Strata
            </h1>
          </div>
        </div>
        <p className="text-sm mb-6" style={{ color: "#9A9A94" }}>
          Every habit is a layer. Harder ones sit deeper.
        </p>

        <div style={{ display: currentView === "home" ? "block" : "none" }}>
        {/* This week */}
        <div className="text-xs mono tracking-wide mb-2.5 flex items-center gap-1.5" style={{ color: "#6E6E6A" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: ACCENT_GREEN, display: "inline-block" }} />
          THIS WEEK
          <span style={{ color: "#4A4A46", fontWeight: 500 }}>· swipe for past days</span>
        </div>
        <div
          className="rounded-lg mb-8 relative"
          style={{
            padding: "14px 10px 10px",
            backgroundColor: "#0D0D0D",
            backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 45%)",
            border: "1px solid #1C1C19",
          }}
        >
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}
        >
          <div
            className="ambient-glow"
            style={{
              position: "absolute",
              top: "-50px",
              right: "-30px",
              width: "130px",
              height: "130px",
              borderRadius: "999px",
              background: hexToRgba(pctColor(dayPct(selectedDate)), 0.12),
              filter: "blur(30px)",
            }}
          />
        </div>
        <div
          ref={daysStripRef}
          className="hide-scrollbar"
          style={{
            position: "relative",
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            scrollSnapType: "x proximity",
            paddingBottom: "2px",
          }}
        >
          {getScrollableDayRange(today, habits, records).map((d) => {
            const ds = fmt(d);
            const isToday = ds === today;
            const isFuture = ds > today;
            const isSelected = ds === selectedDate;
            const pct = dayPct(ds);
            return (
              <button
                key={ds}
                ref={isToday ? todayDayCellRef : null}
                onClick={() => !isFuture && setSelectedDate(ds)}
                disabled={isFuture}
                className="flex flex-col items-center gap-1.5"
                style={{
                  flex: "0 0 auto",
                  width: "44px",
                  opacity: isFuture ? 0.4 : 1,
                  cursor: isFuture ? "default" : "pointer",
                  scrollSnapAlign: "center",
                }}
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
                    maxWidth: "44px",
                    aspectRatio: "1 / 1",
                    margin: "0 auto",
                    borderRadius: "999px",
                    boxShadow: isSelected
                      ? `0 0 0 2px #000000, 0 0 0 4px ${YELLOW}`
                      : isToday
                        ? `0 0 10px -2px ${hexToRgba(pctColor(pct), 0.6)}`
                        : "none",
                  }}
                >
                  <DayRing pct={pct} size={44} strokeWidth={isToday ? 4 : 3.2} color={pctColor(pct)} />
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
        </div>

        {/* Average completion */}
        <div
          className="rounded-lg px-4 py-5 mb-6 relative"
          style={{
            backgroundColor: "#0D0D0D",
            backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 40%)",
            border: "1px solid #242422",
            boxShadow: `inset 0 2px 0 0 ${pctColor(avg)}, 0 10px 24px -18px rgba(0,0,0,0.9)`,
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}
          >
            <div
              className="ambient-glow"
              style={{
                position: "absolute",
                top: "-60px",
                left: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "999px",
                background: hexToRgba(pctColor(avg), 0.14),
                filter: "blur(32px)",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs mono flex items-center gap-1.5" style={{ color: "#8A8A85" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: pctColor(avg), display: "inline-block" }} />
              AVERAGE COMPLETION
            </span>
            <button
              onClick={() => setShowTrendGraph(true)}
              aria-label="View daily and weekly completion trend graph"
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: hexToRgba(pctColor(avg), 0.12), border: `1px solid ${hexToRgba(pctColor(avg), 0.4)}`, color: pctColor(avg) }}
            >
              <BarChart3 size={12} />
            </button>
          </div>
          <div className="flex gap-1.5 mb-4">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="period-btn flex-1 rounded-full px-2 py-1.5 text-xs"
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
          <div className="mono" style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1, color: pctColor(avg) }}>
            {avg === null ? "—" : `${avg}%`}
          </div>
          <div style={{ marginTop: "14px" }}>
            <div style={{ height: "8px", borderRadius: "999px", background: "#161614", overflow: "hidden" }}>
              <div
                style={{
                  width: `${avg ?? 0}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: `linear-gradient(90deg, ${lightenColor(pctColor(avg), 0.25)}, ${pctColor(avg)})`,
                  boxShadow: avg ? `0 0 10px ${hexToRgba(pctColor(avg), 0.5)}` : "none",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            </div>
          </div>
          <div className="text-xs mt-2" style={{ color: "#8A8A85" }}>
            {avg === null ? "No tracked days in this window yet" : `avg over the last ${PERIODS.find((p) => p.key === period).days} day${PERIODS.find((p) => p.key === period).days === 1 ? "" : "s"}`}
          </div>
          </div>
        </div>

        {/* Category picker */}
        {categoriesInUse.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowCategoryPicker((v) => !v)}
              className="w-full flex items-center justify-between rounded-lg px-4 py-3"
              style={{
                backgroundColor: "#0D0D0D",
                backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 40%)",
                border: "1px solid #242422",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs mono" style={{ color: "#8A8A85" }}>
                  CATEGORY
                </span>
                <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  {selectedCategory}
                </span>
              </div>
              {showCategoryPicker ? (
                <ChevronUp size={16} color="#8A8A85" />
              ) : (
                <ChevronDown size={16} color="#8A8A85" />
              )}
            </button>

            {showCategoryPicker && (
              <div
                className="hide-scrollbar mt-2 rounded-lg p-2 flex flex-col gap-1"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid #242422",
                  maxHeight: "240px",
                  overflowY: "auto",
                }}
              >
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowCategoryPicker(false);
                  }}
                  className="text-left rounded-md px-3 py-2.5 text-sm"
                  style={{
                    background: selectedCategory === "All" ? hexToRgba(ACCENT_GREEN, 0.16) : "transparent",
                    color: selectedCategory === "All" ? ACCENT_GREEN : "#EDEDEA",
                    fontWeight: selectedCategory === "All" ? 700 : 500,
                  }}
                >
                  All
                </button>
                {categoriesInUse.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      className="text-left rounded-md px-3 py-2.5 text-sm"
                      style={{
                        background: active ? hexToRgba(ACCENT_GREEN, 0.16) : "transparent",
                        color: active ? ACCENT_GREEN : "#EDEDEA",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Today / selected day */}
        <div
          className="rounded-lg px-2.5 py-5 mb-6 relative"
          style={{
            backgroundColor: "#0D0D0D",
            backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 40%)",
            border: "1px solid #242422",
            boxShadow: `inset 0 2px 0 0 ${pctColor(selectedPct)}, 0 10px 24px -18px rgba(0,0,0,0.9)`,
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}
          >
            <div
              className="ambient-glow"
              style={{
                position: "absolute",
                top: "-70px",
                right: "-50px",
                width: "180px",
                height: "180px",
                borderRadius: "999px",
                background: hexToRgba(pctColor(selectedPct), 0.16),
                filter: "blur(34px)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mb-3" style={{ position: "relative" }}>
            <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              {selectedDayLabel}
            </span>
            <span
              className="text-xs mono rounded-full px-2 py-0.5"
              style={{ background: hexToRgba(pctColor(selectedPct), 0.14), color: pctColor(selectedPct), fontWeight: 700 }}
            >
              {selectedDoneCount} of {selectedTotalCount} done
            </span>
          </div>
          <div
            className="mono"
            style={{ position: "relative", fontSize: "36px", fontWeight: 700, lineHeight: 1, color: pctColor(selectedPct) }}
          >
            {selectedPct === null ? "—" : `${selectedPct}%`}
          </div>
          <div style={{ position: "relative", marginTop: "14px" }}>
            <div style={{ height: "8px", borderRadius: "999px", background: "#161614", overflow: "hidden" }}>
              <div
                style={{
                  width: `${selectedPct ?? 0}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: `linear-gradient(90deg, ${lightenColor(pctColor(selectedPct), 0.25)}, ${pctColor(selectedPct)})`,
                  boxShadow: selectedPct ? `0 0 8px ${hexToRgba(pctColor(selectedPct), 0.5)}` : "none",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-4" style={{ position: "relative" }}>
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

            {visibleHabits.map((h, hIdx) => {
              const done = !!selectedRecord[h.id];
              const HabitIcon = getIcon(h.icon);
              const isMilestoneHabit = h.frequency?.type === "milestone";
              const isOffSchedule = h.frequency?.type === "specific_days" && !isScheduledOn(h, selectedDate);
              return (
                <div
                  key={h.id}
                  ref={(el) => {
                    if (el) cardRefs.current[h.id] = el;
                  }}
                  className={`habit-card rounded-xl px-3.5 py-2 flex gap-3 ${deletingId === h.id ? "deleting" : ""} ${animatingId === h.id ? "card-complete-pop" : ""}`}
                  style={{
                    width: "100%",
                    backgroundColor: "#141412",
                    backgroundImage: `radial-gradient(130% 100% at 0% 0%, ${hexToRgba(h.color, done ? 0.16 : 0.09)} 0%, transparent 58%), linear-gradient(150deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 45%)`,
                    borderTop: "1px solid #242422",
                    borderRight: "1px solid #242422",
                    borderBottom: "1px solid #242422",
                    borderLeft: `3px solid ${isOffSchedule ? hexToRgba(h.color, 0.4) : h.color}`,
                    boxShadow: isOffSchedule
                      ? "0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 10px -10px rgba(0,0,0,0.6)"
                      : done
                        ? `0 1px 0 rgba(255,255,255,0.05) inset, 0 10px 22px -14px rgba(0,0,0,0.85), 0 0 0 1px ${hexToRgba(h.color, 0.3)}, 0 0 22px -6px ${hexToRgba(h.color, 0.45)}`
                        : `0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 18px -14px rgba(0,0,0,0.8)`,
                    opacity: isOffSchedule ? 0.52 : 1,
                    transition: "transform 0.1s ease, opacity 0.25s ease, box-shadow 0.25s ease, background-image 0.25s ease",
                    "--card-glow": hexToRgba(h.color, 0.6),
                  }}
                  onPointerDown={handleCardDown}
                  onPointerUp={() => handleCardUp(h)}
                  onPointerLeave={handleCardLeave}
                  onPointerCancel={handleCardLeave}
                >
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}
                  >
                    <div
                      className="habit-flash"
                      style={{
                        background: `linear-gradient(100deg, transparent 0%, ${hexToRgba(h.color, 0.12)} 30%, ${hexToRgba(h.color, 0.4)} 50%, ${hexToRgba(h.color, 0.12)} 70%, transparent 100%)`,
                        animationDuration: `${5 + (hIdx % 4) * 0.8}s`,
                        animationDelay: `${(hIdx % 6) * 0.85}s`,
                      }}
                    />
                  </div>
                  <div className="shrink-0 flex flex-col items-center" style={{ width: "44px" }}>
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{
                        position: "relative",
                        backgroundColor: hexToRgba(h.color, 0.14),
                        backgroundImage: `radial-gradient(circle at 34% 28%, ${hexToRgba(h.color, 0.42)} 0%, ${hexToRgba(h.color, 0.1)} 72%)`,
                        boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.3)} inset, 0 0 14px -4px ${hexToRgba(h.color, done ? 0.75 : 0.4)}`,
                      }}
                    >
                      <HabitIcon size={20} color={h.color} />
                    </div>
                    {!isMilestoneHabit && (
                      <div
                        className="mono"
                        style={{
                          fontSize: "9px",
                          color: h.color,
                          fontWeight: 700,
                          marginTop: "4px",
                          whiteSpace: "nowrap",
                          background: hexToRgba(h.color, 0.16),
                          padding: "1px 5px",
                          borderRadius: "999px",
                          boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.35)} inset`,
                        }}
                      >
                        {computeTotalDays(h)}d
                      </div>
                    )}
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
                          (() => {
                            const totalMilestones = (h.milestones || []).length;
                            const completedCount = computeMilestoneCompletedCount(h);
                            const allDone = totalMilestones > 0 && completedCount === totalMilestones;
                            const todayTargetIds = milestoneTargets[today]?.[h.id];
                            const doneMap = milestoneCompletions[h.id] || {};

                            if (!allDone && (!todayTargetIds || todayTargetIds.length === 0)) {
                              return (
                                <button
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onPointerUp={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMilestoneGoalQueue((q) =>
                                      q.some((it) => it.habit.id === h.id) ? q : [{ habit: h }, ...q]
                                    );
                                  }}
                                  className="rounded-full px-3 py-1.5 mono text-xs"
                                  style={{
                                    backgroundImage: `linear-gradient(135deg, ${hexToRgba(YELLOW, 0.24)}, ${hexToRgba(YELLOW, 0.08)})`,
                                    border: `1px solid ${YELLOW}`,
                                    boxShadow: `0 0 0 1px ${hexToRgba(YELLOW, 0.15)} inset`,
                                    color: YELLOW,
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Set today's goal
                                </button>
                              );
                            }

                            const badgeLabel =
                              !allDone && todayTargetIds && todayTargetIds.length > 0
                                ? `${todayTargetIds.filter((mid) => {
                                    const val = doneMap[mid];
                                    return val === true || (typeof val === "string" && val <= today);
                                  }).length}/${todayTargetIds.length} today`
                                : `${completedCount}/${totalMilestones}`;

                            return (
                              <div
                                className="rounded-full px-3 py-1.5 mono text-xs"
                                style={{
                                  backgroundImage: `linear-gradient(135deg, ${hexToRgba(h.color, 0.24)}, ${hexToRgba(h.color, 0.08)})`,
                                  border: `1px solid ${h.color}`,
                                  boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.15)} inset`,
                                  color: h.color,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {badgeLabel}
                              </div>
                            );
                          })()
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
                                  backgroundImage: `linear-gradient(135deg, ${hexToRgba(h.color, 0.24)}, ${hexToRgba(h.color, 0.08)})`,
                                  border: `1px solid ${h.color}`,
                                  boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.15)} inset`,
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
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                                  toggle(h, origin);
                                }}
                                className={`tick-btn shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 ${animatingId === h.id ? "tick-glow" : ""}`}
                                style={{
                                  position: "relative",
                                  backgroundColor: done ? h.color : "transparent",
                                  backgroundImage: done
                                    ? `linear-gradient(150deg, ${lightenColor(h.color, 0.4)} 0%, ${h.color} 65%)`
                                    : `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
                                  borderColor: done ? h.color : "#4A4A45",
                                  boxShadow: done ? `0 2px 12px ${hexToRgba(h.color, 0.55)}` : "none",
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
                                {done && <Check size={17} color="#000000" strokeWidth={3} className={animatingId === h.id ? "check-pop" : ""} />}
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

                    {isOffSchedule && (
                      <div className="flex items-center gap-1 mt-1">
                        <span style={{ width: "4px", height: "4px", borderRadius: "999px", background: "#5A5A56", display: "inline-block" }} />
                        <span className="text-xs mono" style={{ color: "#6E6E6A", letterSpacing: "0.3px" }}>
                          Not scheduled today
                        </span>
                      </div>
                    )}

                    {!isMilestoneHabit && (
                      <>
                        <div className="mt-1.5">
                          <StarDisplay value={h.difficulty} />
                        </div>
                        <div className="mt-2">
                          <Heatmap habit={h} weeks={WEEKS_COMPACT} today={today} records={records} cellWidth={9} cellHeight={5} gap={1.5} />
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

        {/* Archive view */}
        {currentView === "archive" && (() => {
          const archivedMilestoneHabits = habits.filter((h) => h.frequency?.type === "milestone" && h.completed);
          const archivedRegularHabits = habits.filter((h) => h.frequency?.type !== "milestone" && h.completed);
          const nothingArchived = archivedMilestoneHabits.length === 0 && archivedRegularHabits.length === 0;
          return (
            <div>
              <div className="text-xs mono tracking-wide mb-4 flex items-center gap-1.5" style={{ color: "#6E6E6A" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: "#8A8A85", display: "inline-block" }} />
                ARCHIVE
              </div>

              {nothingArchived && (
                <div className="text-sm text-center py-10" style={{ color: "#6E6E6A" }}>
                  Nothing archived yet. Habits you archive, and milestone habits you finish, show up here.
                </div>
              )}

              {archivedMilestoneHabits.length > 0 && (
                <div className="mb-8">
                  <div className="text-sm mb-3" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                    Completed Milestones
                  </div>
                  <div className="flex flex-col gap-2">
                    {archivedMilestoneHabits.map((h) => {
                      const HabitIcon = getIcon(h.icon);
                      const totalMilestones = (h.milestones || []).length;
                      return (
                        <button
                          key={h.id}
                          onClick={() => openDetail(h)}
                          className="rounded-lg p-3 flex items-center gap-3 text-left w-full"
                          style={{ background: "#141412", border: "1px solid #242422" }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: hexToRgba(h.color, 0.14),
                              backgroundImage: `radial-gradient(circle at 34% 28%, ${hexToRgba(h.color, 0.4)} 0%, ${hexToRgba(h.color, 0.1)} 72%)`,
                              boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.3)} inset`,
                            }}
                          >
                            <HabitIcon size={17} color={h.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm truncate" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                              {h.name}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: "#8A8A85" }}>
                              {totalMilestones}/{totalMilestones} milestones
                              {h.completedAt &&
                                ` · ${parseDate(h.completedDate).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })} at ${new Date(
                                  h.completedAt
                                ).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit", hour12: true })}`}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {archivedRegularHabits.length > 0 && (
                <div>
                  <div className="text-sm mb-3" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                    Archived Habits
                  </div>
                  <div className="flex flex-col gap-2">
                    {archivedRegularHabits.map((h) => {
                      const HabitIcon = getIcon(h.icon);
                      return (
                        <div
                          key={h.id}
                          className="rounded-lg p-3 flex items-center gap-3"
                          style={{ background: "#141412", border: "1px solid #242422" }}
                        >
                          <button
                            onClick={() => openDetail(h)}
                            className="flex items-center gap-3 text-left flex-1 min-w-0"
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: hexToRgba(h.color, 0.14),
                                backgroundImage: `radial-gradient(circle at 34% 28%, ${hexToRgba(h.color, 0.4)} 0%, ${hexToRgba(h.color, 0.1)} 72%)`,
                                boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.3)} inset`,
                              }}
                            >
                              <HabitIcon size={17} color={h.color} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm truncate" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                                {h.name}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: "#8A8A85" }}>
                                Archived{" "}
                                {h.completedDate &&
                                  parseDate(h.completedDate).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => reopenHabit(h)}
                            className="text-xs shrink-0"
                            style={{ color: "#8A8A85", textDecoration: "underline" }}
                          >
                            Restore
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Expense calculator view */}
        {currentView === "calculator" &&
          (() => {
            if (!currency) {
              return (
                <div>
                  <div className="text-xs mono tracking-wide mb-4 flex items-center gap-1.5" style={{ color: "#6E6E6A" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: ACCENT_GREEN, display: "inline-block" }} />
                    CALCULATOR
                  </div>
                  <div
                    className="rounded-2xl px-6 py-7 text-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(160deg, #14140F 0%, #0A0A08 70%)",
                      border: "1px solid #262622",
                      boxShadow: `inset 0 1px 0 0 ${hexToRgba(YELLOW, 0.35)}, 0 20px 40px -28px rgba(0,0,0,0.9)`,
                    }}
                  >
                    <div className="money-sheen" />
                    <div
                      className="mx-auto mb-4 flex items-center justify-center"
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "16px",
                        background: hexToRgba(YELLOW, 0.12),
                        border: `1px solid ${hexToRgba(YELLOW, 0.35)}`,
                      }}
                    >
                      <Wallet size={22} color={YELLOW} />
                    </div>
                    <div className="text-base mb-1.5" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                      Which currency do you want to track?
                    </div>
                    <div className="text-xs mb-6" style={{ color: "#8A8A85" }}>
                      You can change this anytime.
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => persistCurrency("USD")}
                        className="flex-1 rounded-xl py-5 flex flex-col items-center gap-1.5"
                        style={{ background: "#151513", border: "1px solid #262622" }}
                      >
                        <span className="mono text-3xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                          $
                        </span>
                        <span className="text-xs" style={{ color: "#8A8A85" }}>
                          US Dollar
                        </span>
                      </button>
                      <button
                        onClick={() => persistCurrency("INR")}
                        className="flex-1 rounded-xl py-5 flex flex-col items-center gap-1.5"
                        style={{ background: "#151513", border: "1px solid #262622" }}
                      >
                        <span className="mono text-3xl" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                          ₹
                        </span>
                        <span className="text-xs" style={{ color: "#8A8A85" }}>
                          Indian Rupee
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const currencySymbol = currency === "INR" ? "₹" : "$";
            const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
            const totalIncome = incomes.reduce((sum, e) => sum + e.amount, 0);
            const netBalance = totalIncome - totalExpense;
            const monthKey = today.slice(0, 7); // "YYYY-MM"
            const monthExpense = expenses.filter((e) => e.date.startsWith(monthKey)).reduce((sum, e) => sum + e.amount, 0);
            const monthIncome = incomes.filter((e) => e.date.startsWith(monthKey)).reduce((sum, e) => sum + e.amount, 0);
            const monthNet = monthIncome - monthExpense;
            const sortedExpenses = [...expenses].sort((a, b) => (b.time || 0) - (a.time || 0));
            const sortedIncomes = [...incomes].sort((a, b) => (b.time || 0) - (a.time || 0));
            const todayExpense = expenses.filter((e) => e.date === today).reduce((sum, e) => sum + e.amount, 0);
            const todayBudget = dailyBudgets[today];
            const budgetRemaining = todayBudget !== undefined ? todayBudget - todayExpense : null;
            const totalFlow = totalIncome + totalExpense;
            const incomeShare = totalFlow > 0 ? (totalIncome / totalFlow) * 100 : 0;
            const expenseShare = totalFlow > 0 ? 100 - incomeShare : 0;

            return (
              <div>
                <div className="text-xs mono tracking-wide mb-4 flex items-center justify-between" style={{ color: "#6E6E6A" }}>
                  <span className="flex items-center gap-1.5">
                    <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: ACCENT_GREEN, display: "inline-block" }} />
                    CALCULATOR
                  </span>
                  <button
                    onClick={() => setCurrency(null)}
                    className="flex items-center gap-1.5 rounded-full pl-2 pr-2.5 py-1"
                    style={{ background: "#141412", border: "1px solid #242422", color: "#9A9A94" }}
                  >
                    <span className="mono" style={{ color: "#EDEDEA", fontWeight: 700 }}>
                      {currencySymbol}
                    </span>
                    {currency} · Change
                  </button>
                </div>

                {/* Balance hero — a ledger scale showing income vs. expense, not just a number */}
                <div
                  className="rounded-2xl px-4 py-5 mb-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, #14140F 0%, #0A0A08 65%)",
                    border: "1px solid #242422",
                    boxShadow: `inset 0 1px 0 0 ${hexToRgba(netBalance >= 0 ? ACCENT_GREEN : "#E5484D", 0.5)}, 0 20px 44px -30px rgba(0,0,0,0.9)`,
                  }}
                >
                  <div className="money-sheen" />
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-60px",
                      right: "-40px",
                      width: "160px",
                      height: "160px",
                      borderRadius: "999px",
                      background: hexToRgba(netBalance >= 0 ? ACCENT_GREEN : "#E5484D", 0.14),
                      filter: "blur(30px)",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative" }}>
                    <span className="text-xs mono" style={{ color: "#8A8A85", letterSpacing: "0.06em" }}>
                      NET BALANCE
                    </span>
                  </div>
                  <div style={{ position: "relative", marginTop: "6px" }}>
                    <span
                      className="text-xs rounded-full px-2 py-0.5 mono inline-block"
                      style={{
                        background: hexToRgba(monthNet >= 0 ? ACCENT_GREEN : "#E5484D", 0.14),
                        color: monthNet >= 0 ? ACCENT_GREEN : "#E5484D",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {monthNet < 0 ? "-" : "+"}
                      {currencySymbol}
                      {Math.abs(monthNet).toFixed(2)} this month
                    </span>
                  </div>
                  <div
                    className="mono"
                    style={{
                      position: "relative",
                      marginTop: "10px",
                      color: netBalance >= 0 ? "#EDEDEA" : "#E5484D",
                      fontWeight: 700,
                      fontSize: "38px",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {netBalance < 0 ? "-" : ""}
                    {currencySymbol}
                    {Math.abs(netBalance).toFixed(2)}
                  </div>

                  <div style={{ position: "relative", marginTop: "18px" }}>
                    <div style={{ display: "flex", height: "10px", borderRadius: "999px", overflow: "hidden", background: "#161614" }}>
                      <div style={{ width: `${incomeShare}%`, background: ACCENT_GREEN, transition: "width 0.4s ease" }} />
                      <div style={{ width: `${expenseShare}%`, background: "#E5484D", transition: "width 0.4s ease" }} />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8A8A85" }}>
                          <ArrowUpRight size={12} color={ACCENT_GREEN} />
                          Income
                        </span>
                        <span className="mono text-xs" style={{ color: ACCENT_GREEN, fontWeight: 700 }}>
                          {currencySymbol}
                          {totalIncome.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8A8A85" }}>
                          <ArrowDownRight size={12} color="#E5484D" />
                          Expense
                        </span>
                        <span className="mono text-xs" style={{ color: "#E5484D", fontWeight: 700 }}>
                          {currencySymbol}
                          {totalExpense.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense / Income segmented control */}
                <div
                  className="relative rounded-full mb-5"
                  style={{ background: "#0D0D0D", border: "1px solid #242422", height: "44px" }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "4px",
                      bottom: "4px",
                      left: calculatorTab === "expense" ? "4px" : "calc(50% + 2px)",
                      right: calculatorTab === "expense" ? "calc(50% + 2px)" : "4px",
                      borderRadius: "999px",
                      background: calculatorTab === "expense" ? "#E5484D" : ACCENT_GREEN,
                      transition: "left 0.25s ease, right 0.25s ease, background 0.25s ease",
                    }}
                  />
                  <div className="relative flex" style={{ height: "100%" }}>
                    <button
                      onClick={() => setCalculatorTab("expense")}
                      className="flex-1 rounded-full text-sm flex items-center justify-center gap-1.5"
                      style={{
                        color: calculatorTab === "expense" ? "#000000" : "#8A8A85",
                        fontWeight: calculatorTab === "expense" ? 700 : 500,
                      }}
                    >
                      <ArrowDownRight size={14} />
                      Expense
                    </button>
                    <button
                      onClick={() => setCalculatorTab("income")}
                      className="flex-1 rounded-full text-sm flex items-center justify-center gap-1.5"
                      style={{
                        color: calculatorTab === "income" ? "#000000" : "#8A8A85",
                        fontWeight: calculatorTab === "income" ? 700 : 500,
                      }}
                    >
                      <ArrowUpRight size={14} />
                      Income
                    </button>
                  </div>
                </div>

                {calculatorTab === "expense" ? (
                  <>
                    {todayBudget === undefined ? (
                      showBudgetInput ? (
                        <div className="rounded-xl px-3.5 py-4 mb-4" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                          <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: "#8A8A85" }}>
                            <Wallet size={13} />
                            What's your budget for today?
                          </div>
                          <div className="flex gap-2">
                            <div
                              className="flex items-center rounded-lg px-3 flex-1"
                              style={{ background: "#151513", border: "1px solid #262622" }}
                            >
                              <span className="mono" style={{ color: "#6E6E6A", flexShrink: 0, fontSize: "14px" }}>
                                {currencySymbol}
                              </span>
                              <input
                                autoFocus
                                value={budgetInputValue}
                                onChange={(e) => setBudgetInputValue(e.target.value)}
                                type="number"
                                inputMode="decimal"
                                placeholder="0.00"
                                className="w-full bg-transparent py-2.5 text-sm"
                                style={{ color: "#EDEDEA", outline: "none" }}
                              />
                            </div>
                            <button
                              onClick={setTodayBudget}
                              disabled={!budgetInputValue || parseFloat(budgetInputValue) <= 0}
                              className="rounded-lg px-4 text-sm"
                              style={{
                                background: !budgetInputValue || parseFloat(budgetInputValue) <= 0 ? "#1C1C19" : ACCENT_GREEN,
                                color: !budgetInputValue || parseFloat(budgetInputValue) <= 0 ? "#4A4A47" : "#000000",
                                fontWeight: 700,
                              }}
                            >
                              Set
                            </button>
                            <button
                              onClick={() => {
                                setShowBudgetInput(false);
                                setBudgetInputValue("");
                              }}
                              className="rounded-lg px-3 text-sm"
                              style={{ background: "transparent", border: "1px solid #3A3A35", color: "#8A8A85" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowBudgetInput(true)}
                          className="w-full rounded-xl px-3.5 py-4 mb-4 flex items-center justify-between"
                          style={{ background: "#0D0D0D", border: `1px dashed ${hexToRgba(YELLOW, 0.4)}` }}
                        >
                          <span className="text-sm flex items-center gap-2" style={{ color: "#8A8A85" }}>
                            <Wallet size={14} color={YELLOW} />
                            Want to set a budget for today?
                          </span>
                          <span className="text-xs" style={{ color: YELLOW, fontWeight: 700 }}>
                            Set budget
                          </span>
                        </button>
                      )
                    ) : (
                      <div
                        className="rounded-xl px-3.5 py-4 mb-4"
                        style={{
                          background: "#0D0D0D",
                          border: `1px solid ${budgetRemaining < 0 ? "#E5484D" : "#242422"}`,
                          boxShadow: `inset 0 1px 0 0 ${hexToRgba(budgetRemaining < 0 ? "#E5484D" : YELLOW, 0.35)}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs flex items-center gap-1.5" style={{ color: "#8A8A85" }}>
                            <Wallet size={13} color={budgetRemaining < 0 ? "#E5484D" : YELLOW} />
                            Today's budget · {currencySymbol}
                            {todayBudget.toFixed(2)}
                          </span>
                          <button onClick={clearTodayBudget} style={{ color: "#8A8A85", textDecoration: "underline", fontSize: "12px" }}>
                            Clear
                          </button>
                        </div>
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <div className="text-xs mb-0.5" style={{ color: "#8A8A85" }}>
                              {budgetRemaining < 0 ? "Over budget by" : "Left to spend"}
                            </div>
                            <div
                              className="mono text-2xl"
                              style={{ color: budgetRemaining < 0 ? "#E5484D" : ACCENT_GREEN, fontWeight: 700 }}
                            >
                              {currencySymbol}
                              {Math.abs(budgetRemaining).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-xs mono" style={{ color: "#6E6E6A" }}>
                            {currencySymbol}
                            {todayExpense.toFixed(2)} spent
                          </div>
                        </div>
                        <div className="rounded-full" style={{ height: "8px", background: "#1C1C19", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(100, (todayExpense / todayBudget) * 100)}%`,
                              background: budgetRemaining < 0 ? "#E5484D" : `linear-gradient(90deg, ${ACCENT_GREEN}, ${YELLOW})`,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      ref={expenseFormRef}
                      className="rounded-xl px-3.5 py-4 mb-5"
                      style={{
                        background: "#0D0D0D",
                        border: `1px solid ${editingExpenseId !== null ? YELLOW : "#242422"}`,
                        boxShadow: `inset 0 1px 0 0 ${hexToRgba(editingExpenseId !== null ? YELLOW : "#E5484D", 0.3)}`,
                      }}
                    >
                      {editingExpenseId !== null && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs flex items-center gap-1.5" style={{ color: YELLOW, fontWeight: 700 }}>
                            <Pencil size={12} />
                            Editing expense
                          </span>
                          <button
                            onClick={cancelEditExpense}
                            className="text-xs rounded-full px-2.5 py-1"
                            style={{ background: "#151513", border: "1px solid #262622", color: "#8A8A85" }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 mb-3">
                        <div
                          className="flex items-center rounded-lg px-3"
                          style={{ background: "#151513", border: "1px solid #262622", width: "112px" }}
                        >
                          <span className="mono" style={{ color: "#6E6E6A", flexShrink: 0, fontSize: "15px" }}>
                            {currencySymbol}
                          </span>
                          <input
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="mono w-full bg-transparent py-2.5 text-sm"
                            style={{ color: "#EDEDEA", outline: "none", fontWeight: 700 }}
                          />
                        </div>
                        <input
                          value={expenseDescription}
                          onChange={(e) => setExpenseDescription(e.target.value)}
                          placeholder="What was it for?"
                          className="flex-1 rounded-lg px-3 py-2.5 text-sm min-w-0"
                          style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {EXPENSE_CATEGORIES.map((cat) => {
                          const active = expenseCategory === cat;
                          const CatIcon = EXPENSE_CATEGORY_ICONS[cat] || Sparkles;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setExpenseCategory(cat);
                                if (cat !== "Other") {
                                  setOtherExpenseLabel("");
                                  setOtherExpenseIcon(null);
                                }
                              }}
                              className="rounded-full pl-2.5 pr-3 py-1.5 text-xs flex items-center gap-1.5"
                              style={{
                                background: active ? "#E5484D" : "#151513",
                                border: `1px solid ${active ? "#E5484D" : "#262622"}`,
                                color: active ? "#000000" : "#9A9A94",
                                fontWeight: active ? 700 : 500,
                                boxShadow: active ? `0 0 0 3px ${hexToRgba("#E5484D", 0.18)}` : "none",
                              }}
                            >
                              <CatIcon size={12} />
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                      {expenseCategory === "Other" && (
                        <div className="rounded-lg px-2.5 py-3 mb-3.5" style={{ background: "#111110", border: "1px solid #242422" }}>
                          <div className="text-xs mb-1.5" style={{ color: "#8A8A85" }}>
                            What is it?
                          </div>
                          <input
                            value={otherExpenseLabel}
                            onChange={(e) => {
                              setOtherExpenseLabel(e.target.value);
                              setOtherExpenseIcon(null);
                            }}
                            placeholder="e.g. Pizza, Haircut, Parking..."
                            className="w-full rounded-lg px-3 py-2 text-sm mb-2.5"
                            style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                          />
                          {otherExpenseLabel.trim() &&
                            (() => {
                              const suggestions = searchIcons(otherExpenseLabel, 24);
                              if (suggestions.length === 0) {
                                return (
                                  <div className="text-xs" style={{ color: "#6E6E6A" }}>
                                    No matching icons — try a different word.
                                  </div>
                                );
                              }
                              return (
                                <>
                                  <div className="text-xs mb-1.5" style={{ color: "#6E6E6A" }}>
                                    Pick an icon
                                  </div>
                                  <div className="flex flex-wrap gap-1.5" style={{ maxHeight: "132px", overflowY: "auto" }}>
                                    {suggestions.map(({ name, Icon: SuggestIcon }) => {
                                      const active = otherExpenseIcon === name;
                                      return (
                                        <button
                                          key={name}
                                          onClick={() => setOtherExpenseIcon(name)}
                                          aria-label={iconNameToLabel(name)}
                                          className="rounded-lg flex items-center justify-center shrink-0"
                                          style={{
                                            width: "34px",
                                            height: "34px",
                                            background: active ? "#E5484D" : "#151513",
                                            border: `1px solid ${active ? "#E5484D" : "#262622"}`,
                                            color: active ? "#000000" : "#9A9A94",
                                          }}
                                        >
                                          <SuggestIcon size={15} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                        </div>
                      )}
                      <div className="mb-3.5">
                        <div className="text-xs mb-1.5" style={{ color: "#6E6E6A" }}>
                          Was this a good or bad expense?
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setExpenseQuality("good")}
                            className="flex-1 rounded-lg py-2 text-xs flex items-center justify-center gap-1.5"
                            style={{
                              background: expenseQuality === "good" ? hexToRgba(ACCENT_GREEN, 0.16) : "#151513",
                              border: `1px solid ${expenseQuality === "good" ? ACCENT_GREEN : "#262622"}`,
                              color: expenseQuality === "good" ? ACCENT_GREEN : "#8A8A85",
                              fontWeight: expenseQuality === "good" ? 700 : 500,
                            }}
                          >
                            <ThumbsUp size={12} />
                            Good
                          </button>
                          <button
                            onClick={() => setExpenseQuality("bad")}
                            className="flex-1 rounded-lg py-2 text-xs flex items-center justify-center gap-1.5"
                            style={{
                              background: expenseQuality === "bad" ? hexToRgba("#E5484D", 0.16) : "#151513",
                              border: `1px solid ${expenseQuality === "bad" ? "#E5484D" : "#262622"}`,
                              color: expenseQuality === "bad" ? "#E5484D" : "#8A8A85",
                              fontWeight: expenseQuality === "bad" ? 700 : 500,
                            }}
                          >
                            <ThumbsDown size={12} />
                            Bad
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={addExpense}
                        disabled={!expenseAmount || parseFloat(expenseAmount) <= 0}
                        className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm"
                        style={{
                          background: !expenseAmount || parseFloat(expenseAmount) <= 0 ? "#1C1C19" : editingExpenseId !== null ? YELLOW : "#E5484D",
                          color: !expenseAmount || parseFloat(expenseAmount) <= 0 ? "#4A4A47" : "#000000",
                          fontWeight: 700,
                        }}
                      >
                        {editingExpenseId !== null ? (
                          <>
                            <Check size={15} strokeWidth={2.5} />
                            Save changes
                          </>
                        ) : (
                          <>
                            <Plus size={15} strokeWidth={2.5} />
                            Add expense
                          </>
                        )}
                      </button>
                    </div>

                    {sortedExpenses.length === 0 ? (
                      <div className="text-sm text-center py-10 flex flex-col items-center gap-2" style={{ color: "#6E6E6A" }}>
                        <Receipt size={22} color="#3A3A35" />
                        No expenses logged yet.
                      </div>
                    ) : (
                      <>
                        <div className="text-xs mono tracking-wide mb-2.5 flex items-center gap-1.5" style={{ color: "#6E6E6A" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: "#E5484D", display: "inline-block" }} />
                          RECENT EXPENSES
                        </div>
                        {groupMoneyEntriesByDate(sortedExpenses, today).map((group, gi) => (
                          <div key={group.date}>
                            <MoneyDayHeader
                              label={group.label}
                              total={group.total}
                              currencySymbol={currencySymbol}
                              accentColor="#E5484D"
                              isFirst={gi === 0}
                            />
                            <div className="flex flex-col gap-2">
                              {group.entries.map((e) => (
                                <MoneyEntryRow
                                  key={e.id}
                                  entry={e}
                                  currencySymbol={currencySymbol}
                                  Icon={(e.icon && LucideIcons[e.icon]) || EXPENSE_CATEGORY_ICONS[e.category] || Sparkles}
                                  accentColor={e.quality === "good" ? ACCENT_GREEN : "#E5484D"}
                                  onDelete={() => deleteExpense(e.id)}
                                  deleteLabel="Delete expense"
                                  onEdit={() => startEditExpense(e)}
                                  editLabel="Edit expense"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className="rounded-xl px-3.5 py-4 mb-5"
                      style={{ background: "#0D0D0D", border: "1px solid #242422", boxShadow: `inset 0 1px 0 0 ${hexToRgba(ACCENT_GREEN, 0.3)}` }}
                    >
                      <div className="flex gap-2 mb-3">
                        <div
                          className="flex items-center rounded-lg px-3"
                          style={{ background: "#151513", border: "1px solid #262622", width: "112px" }}
                        >
                          <span className="mono" style={{ color: "#6E6E6A", flexShrink: 0, fontSize: "15px" }}>
                            {currencySymbol}
                          </span>
                          <input
                            value={incomeAmount}
                            onChange={(e) => setIncomeAmount(e.target.value)}
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="mono w-full bg-transparent py-2.5 text-sm"
                            style={{ color: "#EDEDEA", outline: "none", fontWeight: 700 }}
                          />
                        </div>
                        <input
                          value={incomeDescription}
                          onChange={(e) => setIncomeDescription(e.target.value)}
                          placeholder="Where was it from?"
                          className="flex-1 rounded-lg px-3 py-2.5 text-sm min-w-0"
                          style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {INCOME_CATEGORIES.map((cat) => {
                          const active = incomeCategory === cat;
                          const CatIcon = INCOME_CATEGORY_ICONS[cat] || Sparkles;
                          return (
                            <button
                              key={cat}
                              onClick={() => setIncomeCategory(cat)}
                              className="rounded-full pl-2.5 pr-3 py-1.5 text-xs flex items-center gap-1.5"
                              style={{
                                background: active ? ACCENT_GREEN : "#151513",
                                border: `1px solid ${active ? ACCENT_GREEN : "#262622"}`,
                                color: active ? "#000000" : "#9A9A94",
                                fontWeight: active ? 700 : 500,
                                boxShadow: active ? `0 0 0 3px ${hexToRgba(ACCENT_GREEN, 0.18)}` : "none",
                              }}
                            >
                              <CatIcon size={12} />
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={addIncome}
                        disabled={!incomeAmount || parseFloat(incomeAmount) <= 0}
                        className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm"
                        style={{
                          background: !incomeAmount || parseFloat(incomeAmount) <= 0 ? "#1C1C19" : ACCENT_GREEN,
                          color: !incomeAmount || parseFloat(incomeAmount) <= 0 ? "#4A4A47" : "#000000",
                          fontWeight: 700,
                        }}
                      >
                        <Plus size={15} strokeWidth={2.5} />
                        Add income
                      </button>
                    </div>

                    {sortedIncomes.length === 0 ? (
                      <div className="text-sm text-center py-10 flex flex-col items-center gap-2" style={{ color: "#6E6E6A" }}>
                        <Wallet size={22} color="#3A3A35" />
                        No income logged yet.
                      </div>
                    ) : (
                      <>
                        <div className="text-xs mono tracking-wide mb-2.5 flex items-center gap-1.5" style={{ color: "#6E6E6A" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "999px", background: ACCENT_GREEN, display: "inline-block" }} />
                          RECENT INCOME
                        </div>
                        {groupMoneyEntriesByDate(sortedIncomes, today).map((group, gi) => (
                          <div key={group.date}>
                            <MoneyDayHeader
                              label={group.label}
                              total={group.total}
                              currencySymbol={currencySymbol}
                              accentColor={ACCENT_GREEN}
                              isFirst={gi === 0}
                            />
                            <div className="flex flex-col gap-2">
                              {group.entries.map((e) => (
                                <MoneyEntryRow
                                  key={e.id}
                                  entry={e}
                                  currencySymbol={currencySymbol}
                                  Icon={INCOME_CATEGORY_ICONS[e.category] || Sparkles}
                                  accentColor={ACCENT_GREEN}
                                  onDelete={() => deleteIncome(e.id)}
                                  deleteLabel="Delete income"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })()}
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
          backgroundColor: ACCENT_GREEN,
          backgroundImage: `linear-gradient(150deg, ${lightenColor(ACCENT_GREEN, 0.35)} 0%, ${ACCENT_GREEN} 55%, ${darkenColor(ACCENT_GREEN, 0.1)} 100%)`,
          color: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 20px ${hexToRgba(ACCENT_GREEN, 0.45)}, 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)`,
          border: "none",
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Account & backup button */}
      <button
        onClick={() => {
          playClickSound(getAudioContext());
          setBackupMessage("");
          setShowAccountModal(true);
        }}
        aria-label="Account and backup"
        className="icon-action-btn"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          width: "50px",
          height: "50px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #262622",
          boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        {googleUser?.picture ? (
          <img src={googleUser.picture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
        ) : (
          <User size={20} color="#EDEDEA" />
        )}
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

      {/* Completion celebration burst */}
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
            <div className="shockwave-ring-2" style={{ "--ring-color": burst.color }} />
            {burst.word && (
              <span className="celebrate-text fraunces" style={{ "--text-color": burst.color }}>
                {burst.word}
              </span>
            )}
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
                disabled={!name.trim() || !category.trim()}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: name.trim() && category.trim() ? ACCENT_GREEN : "#4A4A47", fontWeight: 600 }}
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

            <div className="mb-5">
              <div className="text-sm mb-2" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                Category <span style={{ color: "#E5484D" }}>*</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {HABIT_CATEGORIES.map((cat) => {
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCustomCategoryInput(false);
                      }}
                      className="rounded-full px-3 py-1.5 text-xs"
                      style={{
                        background: active ? ACCENT_GREEN : "#0D0D0D",
                        border: `1px solid ${active ? ACCENT_GREEN : "#242422"}`,
                        color: active ? "#000000" : "#EDEDEA",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
                {(() => {
                  const isCustomActive = !!category && !HABIT_CATEGORIES.includes(category);
                  const active = showCustomCategoryInput || isCustomActive;
                  return (
                    <button
                      onClick={() => setShowCustomCategoryInput((v) => !v)}
                      className="rounded-full px-3 py-1.5 text-xs"
                      style={{
                        background: active ? ACCENT_GREEN : "#0D0D0D",
                        border: `1px solid ${active ? ACCENT_GREEN : "#242422"}`,
                        color: active ? "#000000" : "#EDEDEA",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      Other…
                    </button>
                  );
                })()}
              </div>
              {(showCustomCategoryInput || (!!category && !HABIT_CATEGORIES.includes(category))) && (
                <input
                  autoFocus={showCustomCategoryInput && !category}
                  value={!HABIT_CATEGORIES.includes(category) ? category : ""}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Type a category name"
                  className="w-full rounded-lg px-4 py-2.5 text-sm mt-2"
                  style={{ background: "#0D0D0D", border: "1px solid #262622", color: "#EDEDEA" }}
                />
              )}
            </div>

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
              <div className="mb-5 p-3 rounded-lg" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                <div className="text-xs mb-2 px-1" style={{ color: "#6E6E6A" }}>
                  Scroll for more shades
                </div>
                <div className="hide-scrollbar flex flex-col gap-2" style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {COLORS.map((base) => (
                    <div key={base} className="flex items-center gap-2">
                      {getColorShades(base).map((c) => (
                        <button
                          key={c}
                          className="swatch-btn w-8 h-8 rounded-full shrink-0"
                          onClick={() => {
                            setColor(c);
                            setShowColorPicker(false);
                          }}
                          aria-label={`Choose color ${c}`}
                          style={{
                            background: c,
                            border: c === color ? "2px solid #EDEDEA" : "2px solid transparent",
                            boxShadow: c === color ? `0 0 0 2px ${hexToRgba(c, 0.5)}` : "none",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showIconPicker && (
              <div className="mb-5 p-3 rounded-lg" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
                <div className="hide-scrollbar flex flex-col gap-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {ICON_CATEGORIES.map((cat) => (
                    <div key={cat.label}>
                      <div className="text-xs mono mb-2 px-1" style={{ color: "#6E6E6A", letterSpacing: "1px" }}>
                        {cat.label.toUpperCase()}
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {cat.icons.map(({ key, Icon }) => (
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg p-4 mt-2 mb-5" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
              <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                Difficulty
              </span>
              <div className="mt-3">
                <StarPicker value={difficulty} onChange={setDifficulty} label="difficulty" />
              </div>
            </div>

            <div className="rounded-lg p-4 mb-5" style={{ background: "#0D0D0D", border: "1px solid #242422" }}>
              <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 500 }}>
                Importance
              </span>
              <div className="text-xs mt-0.5" style={{ color: "#8A8A85" }}>
                How much this habit matters to you — shown on the habit's own page, and factored into your daily
                percentage alongside difficulty.
              </div>
              <div className="mt-3">
                <StarPicker value={importance} onChange={setImportance} label="importance" />
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInfoHabit(h)}
                      aria-label="Habit info"
                      className="icon-action-btn w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ border: "1px solid #242422", color: "#EDEDEA" }}
                    >
                      <Info size={15} />
                    </button>
                    <button
                      onClick={() => openEditModal(h)}
                      aria-label="Edit habit"
                      className="icon-action-btn w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ border: "1px solid #242422", color: "#EDEDEA" }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </div>

                {/* Icon, name, status */}
                <div className="detail-fade-1 flex flex-col items-center mb-6">
                  <div
                    className={doneToday ? "badge-pulse" : ""}
                    style={{
                      width: "78px",
                      height: "78px",
                      borderRadius: "22px",
                      backgroundColor: h.color,
                      backgroundImage: `linear-gradient(155deg, ${lightenColor(h.color, 0.4)} 0%, ${h.color} 55%, ${darkenColor(h.color, 0.15)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      boxShadow: `0 0 36px ${hexToRgba(h.color, 0.55)}, inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.25)`,
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
                      className="rounded-full px-3 py-1.5 text-xs mono"
                      style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#8A8A85" }}
                    >
                      {habitCategory(h)}
                    </div>
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
                    {isMilestoneHabit &&
                      !h.completed &&
                      milestoneCompletedCount < (h.milestones || []).length &&
                      (() => {
                        const todayTargetIds = milestoneTargets[today]?.[h.id];
                        const doneMap = milestoneCompletions[h.id] || {};
                        if (!todayTargetIds || todayTargetIds.length === 0) {
                          return (
                            <button
                              onClick={() =>
                                setMilestoneGoalQueue((q) => (q.some((it) => it.habit.id === h.id) ? q : [{ habit: h }, ...q]))
                              }
                              className="rounded-full px-4 py-1.5 text-sm"
                              style={{ background: hexToRgba(YELLOW, 0.18), border: `1px solid ${YELLOW}`, color: YELLOW, fontWeight: 600 }}
                            >
                              Set today's goal
                            </button>
                          );
                        }
                        const doneToday = todayTargetIds.filter((mid) => {
                          const val = doneMap[mid];
                          return val === true || (typeof val === "string" && val <= today);
                        }).length;
                        return (
                          <div
                            className="rounded-full px-4 py-1.5 text-sm"
                            style={{ background: hexToRgba(h.color, 0.22), border: `1px solid ${h.color}`, color: h.color, fontWeight: 600 }}
                          >
                            {doneToday}/{todayTargetIds.length} today's goal
                          </div>
                        );
                      })()}
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
                      className="icon-action-btn w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ border: "1px solid #242422", color: YELLOW }}
                    >
                      <Trophy size={15} />
                    </button>
                    {!isMilestoneHabit && (
                      <button
                        onClick={() => setStatsHabit(h)}
                        aria-label="View stats"
                        className="icon-action-btn w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ border: "1px solid #242422", color: "#EDEDEA" }}
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
                      className="icon-action-btn w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ border: "1px solid #242422", color: "#EDEDEA" }}
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {!isMilestoneHabit && (
                <div className="detail-fade-3 grid grid-cols-2 gap-2 mb-5">
                  <div
                    className="stat-box rounded-lg py-4 text-center"
                    style={{
                      backgroundColor: "#0D0D0D",
                      backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%)",
                      border: "1px solid #242422",
                      boxShadow: `inset 0 -2px 0 0 ${streak > 0 ? "#F2994A" : "#242422"}`,
                    }}
                  >
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
                  <div
                    className="stat-box rounded-lg py-4 text-center"
                    style={{
                      backgroundColor: "#0D0D0D",
                      backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%)",
                      border: "1px solid #242422",
                      boxShadow: `inset 0 -2px 0 0 ${bestStreak > 0 ? YELLOW : "#242422"}`,
                    }}
                  >
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
                  <div
                    className="stat-box rounded-lg py-4 text-center"
                    style={{
                      backgroundColor: "#0D0D0D",
                      backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%)",
                      border: "1px solid #242422",
                      boxShadow: `inset 0 -2px 0 0 ${totalDays > 0 ? h.color : "#242422"}`,
                    }}
                  >
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
                  <div
                    className="stat-box rounded-lg py-4 text-center"
                    style={{
                      backgroundColor: "#0D0D0D",
                      backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%)",
                      border: "1px solid #242422",
                      boxShadow: `inset 0 -2px 0 0 ${score !== null ? h.color : "#242422"}`,
                    }}
                  >
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
                    style={{
                      backgroundColor: "#0D0D0D",
                      backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%)",
                      border: "1px solid #242422",
                      boxShadow: `inset 0 -2px 0 0 ${h.color}`,
                    }}
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
                                backgroundColor: isDone ? h.color : "transparent",
                                backgroundImage: isDone
                                  ? `linear-gradient(150deg, ${lightenColor(h.color, 0.4)} 0%, ${h.color} 65%)`
                                  : "none",
                                borderColor: isDone ? h.color : "#4A4A45",
                                boxShadow: isDone ? `0 2px 10px ${hexToRgba(h.color, 0.5)}` : "none",
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
                              {milestoneCompletionTimes[h.id]?.[m.id] &&
                                ` at ${new Date(milestoneCompletionTimes[h.id][m.id]).toLocaleTimeString("default", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}`}
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
                                {new Date(m.deadline).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}

                    {(() => {
                      const habitNotes = [];
                      Object.entries(notes).forEach(([ds, dayNotes]) => {
                        getHabitNotesArray(dayNotes && dayNotes[h.id]).forEach((n) => {
                          habitNotes.push({ date: ds, ...n });
                        });
                      });
                      habitNotes.sort((a, b) => {
                        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
                        return (b.time || 0) - (a.time || 0);
                      });
                      if (habitNotes.length === 0) return null;
                      return (
                        <div className="mt-4">
                          <div className="text-xs mb-2" style={{ color: "#6E6E6A" }}>
                            Notes
                          </div>
                          <div className="flex flex-col gap-2">
                            {habitNotes.map((note) => (
                              <button
                                key={`${note.date}-${note.id}`}
                                onClick={() => openNoteModal(h, note.date, note.id)}
                                className="text-left rounded-lg p-3 w-full"
                                style={{ background: "#0D0D0D", border: "1px solid #242422" }}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="text-xs" style={{ color: "#6E6E6A" }}>
                                    {parseDate(note.date).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
                                    {note.time &&
                                      ` at ${new Date(note.time).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit", hour12: true })}`}
                                  </div>
                                  <Pencil size={12} color="#6E6E6A" style={{ flexShrink: 0, marginTop: "2px" }} />
                                </div>
                                <div className="text-sm" style={{ color: "#EDEDEA", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                  {note.text}
                                </div>
                              </button>
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

                {h.completed ? (
                  <div
                    className="rounded-lg py-3 px-4 flex items-center justify-between gap-2 mb-8"
                    style={{ background: hexToRgba(h.color, 0.16), border: `1px solid ${h.color}` }}
                  >
                    <div className="flex items-center gap-2">
                      <Check size={16} color={h.color} strokeWidth={3} />
                      <span className="text-sm" style={{ color: h.color, fontWeight: 600 }}>
                        Archived
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
                      Restore
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openCompleteHabitConfirm(h)}
                    className="rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm mb-8"
                    style={{ background: "#0D0D0D", border: "1px solid #242422", color: "#8A8A85", fontWeight: 600 }}
                  >
                    <Archive size={15} />
                    Archive Habit
                  </button>
                )}

                {/* Notes */}
                {timelineGroups.length === 0 ? (
                  <div className="detail-fade-4 text-sm text-center py-8" style={{ color: "#6E6E6A" }}>
                    No notes yet — add one to start keeping track of how this habit's going.
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
                                <HabitIcon size={16} color="#000000" />
                              </div>
                              <div
                                onClick={() => openNoteModal(h, ev.date, ev.noteId)}
                                className="flex-1 rounded-lg px-4 py-3"
                                style={{
                                  background: "#0D0D0D",
                                  border: "1px solid #242422",
                                  cursor: "pointer",
                                }}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-sm truncate" style={{ color: h.color, fontWeight: 600 }}>
                                      {h.name}
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: "#EDEDEA", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                      {ev.text}
                                    </div>
                                  </div>
                                  <span className="text-xs shrink-0 text-right flex flex-col items-end gap-1" style={{ color: "#6E6E6A" }}>
                                    <Pencil size={11} color="#6E6E6A" />
                                    {ev.time && (
                                      <div>
                                        {new Date(ev.time).toLocaleTimeString("default", { hour: "numeric", minute: "2-digit", hour12: true })}
                                      </div>
                                    )}
                                  </span>
                                </div>
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

      {/* Info modal — creation date and a full summary of the habit's settings */}
      {infoHabit &&
        (() => {
          const h = habits.find((x) => x.id === infoHabit.id) || infoHabit;
          const HabitIcon = getIcon(h.icon);
          const isMs = h.frequency?.type === "milestone";

          let frequencyLabel = "Every day";
          if (h.frequency?.type === "once") {
            frequencyLabel = h.frequency.date
              ? `Once, on ${parseDate(h.frequency.date).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`
              : "Once";
          } else if (h.frequency?.type === "milestone") {
            frequencyLabel = "Milestone-based";
          } else if (h.frequency?.type === "specific_days") {
            frequencyLabel =
              h.frequency.days && h.frequency.days.length > 0
                ? h.frequency.days.map((d) => WEEKDAYS.find((w) => w.key === d)?.label || d).join(", ")
                : "No days selected";
          }

          const rows = [
            { label: "Created", value: h.createdAt ? new Date(h.createdAt).toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" }) : "Before this was tracked" },
            { label: "Category", value: habitCategory(h) },
            { label: "Frequency", value: frequencyLabel },
            ...(h.description ? [{ label: "Description", value: h.description }] : []),
            ...(h.reminder?.enabled
              ? [{ label: "Reminder", value: `${h.reminder.time || ""} on ${(h.reminder.days || []).map((d) => WEEKDAYS.find((w) => w.key === d)?.label || d).join(", ") || "no days set"}` }]
              : []),
            ...(h.quantityTracking?.enabled ? [{ label: "Tracks quantity", value: h.quantityTracking.label || "Yes" }] : []),
            ...(isMs ? [{ label: "Milestones", value: `${computeMilestoneCompletedCount(h)}/${(h.milestones || []).length} completed` }] : []),
            ...(h.completed
              ? [{ label: isMs ? "Completed" : "Archived", value: h.completedDate ? new Date(parseDate(h.completedDate)).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" }) : "Yes" }]
              : []),
          ];

          return (
            <div
              onClick={() => setInfoHabit(null)}
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
                  maxWidth: "380px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: hexToRgba(h.color, 0.14),
                        backgroundImage: `radial-gradient(circle at 34% 28%, ${hexToRgba(h.color, 0.4)} 0%, ${hexToRgba(h.color, 0.1)} 72%)`,
                        boxShadow: `0 0 0 1px ${hexToRgba(h.color, 0.3)} inset`,
                      }}
                    >
                      <HabitIcon size={17} color={h.color} />
                    </div>
                    <span className="text-sm truncate" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                      {h.name}
                    </span>
                  </div>
                  <button onClick={() => setInfoHabit(null)} aria-label="Close" style={{ color: "#8A8A85", flexShrink: 0 }}>
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <div className="text-xs mb-1.5" style={{ color: "#8A8A85" }}>
                      Difficulty
                    </div>
                    <StarDisplay value={h.difficulty} />
                  </div>
                  <div>
                    <div className="text-xs mb-1.5" style={{ color: "#8A8A85" }}>
                      Importance
                    </div>
                    <StarDisplay value={h.importance || 3} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {rows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <span className="text-xs shrink-0" style={{ color: "#8A8A85" }}>
                        {row.label}
                      </span>
                      <span className="text-sm text-right" style={{ color: "#EDEDEA" }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
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
                  <div className="text-xs mb-1.5" style={{ color: "#8A8A85" }}>
                    Difficulty
                  </div>
                  <StarDisplay value={h.difficulty} />
                  <div className="text-xs mb-1.5 mt-3" style={{ color: "#8A8A85" }}>
                    Importance
                  </div>
                  <StarDisplay value={h.importance || 3} />
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
          onClick={() => {
            setNoteModalHabit(null);
            setNoteModalDate(null);
            setNoteEditingId(null);
          }}
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
            <div className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
              {noteEditingId ? "Edit note" : "Add note"} for {noteModalHabit.name}
            </div>

            {noteEditingId ? (
              <div className="text-xs mt-1 mb-4" style={{ color: "#8A8A85" }}>
                {noteModalDate === today
                  ? "Today"
                  : parseDate(noteModalDate).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            ) : (
              <div className="flex gap-2 mt-3 mb-4">
                {[
                  { label: "Today", value: today },
                  { label: "Yesterday", value: getYesterday(today) },
                ].map((opt) => {
                  const active = noteModalDate === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setNoteModalDate(opt.value)}
                      className="flex-1 rounded-md py-2 text-xs"
                      style={{
                        background: active ? hexToRgba(noteModalHabit.color, 0.18) : "#151513",
                        border: `1px solid ${active ? noteModalHabit.color : "#262622"}`,
                        color: active ? noteModalHabit.color : "#8A8A85",
                        fontWeight: 600,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

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
                onClick={() => {
                  setNoteModalHabit(null);
                  setNoteModalDate(null);
                  setNoteEditingId(null);
                }}
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

      {/* Trophy unlock celebration — reveals immediately, no lock/tap mechanic */}
      {trophyUnlock && (
        <div
          key={trophyUnlock.id}
          className="trophy-backdrop screen-punch"
          style={{
            position: "fixed",
            inset: 0,
            background: "radial-gradient(circle at 50% 42%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.86) 55%, rgba(0,0,0,0.96) 100%)",
            zIndex: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            className="spotlight-beam"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "260px",
              height: "60vh",
              background: `linear-gradient(180deg, ${hexToRgba(trophyUnlock.level.color, 0.5)} 0%, ${hexToRgba(trophyUnlock.level.color, 0.12)} 55%, transparent 100%)`,
              clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />

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
              width: "480px",
              height: "480px",
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
                  "--dx": `${p.dx * 1.9}px`,
                  "--dy": `${p.dy * 1.9}px`,
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
                  "--dx": `${p.dx * 3}px`,
                  "--dy": `${p.dy * 3}px`,
                  "--rot": `${p.rot * 1.5}deg`,
                }}
              />
            ))}
            {BURST_PARTICLES.map((p, i) => (
              <div
                key={`w3-${i}`}
                className="trophy-particle"
                style={{
                  width: `${p.size + 1}px`,
                  height: `${p.size + 1}px`,
                  background: YELLOW,
                  borderRadius: p.shape === "square" ? "3px" : "999px",
                  animationDelay: `${0.44 + p.delay * 1.15}s`,
                  "--dx": `${p.dx * 2.4}px`,
                  "--dy": `${p.dy * 2.4}px`,
                  "--rot": `${p.rot * -1.2}deg`,
                }}
              />
            ))}
          </div>

          <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              className="impact-ring"
              style={{ position: "absolute", borderRadius: "999px", border: "7px solid #FFFFFF" }}
            />
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
                className="trophy-badge-in badge-glow-pulse"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "124px",
                  height: "124px",
                  borderRadius: "999px",
                  backgroundColor: hexToRgba(trophyUnlock.level.color, 0.2),
                  backgroundImage: `radial-gradient(circle at 35% 28%, ${hexToRgba(trophyUnlock.level.color, 0.4)}, ${hexToRgba(trophyUnlock.level.color, 0.15)} 70%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 60px ${hexToRgba(trophyUnlock.level.color, 0.7)}`,
                  "--glow-c": hexToRgba(trophyUnlock.level.color, 0.75),
                }}
              >
                <div className="shimmer-sweep" />
                <Trophy size={54} color={trophyUnlock.level.color} className="trophy-icon-in" />
              </div>
            </div>
          </div>

          <div className="trophy-text-in text-center mt-7 px-8" style={{ position: "relative" }}>
            <div className="mono text-xs" style={{ color: "#8A8A85", letterSpacing: "3px" }}>
              TROPHY UNLOCKED
            </div>
            <div
              className="level-pop text-3xl mt-1"
              style={{
                color: trophyUnlock.level.color,
                fontWeight: 700,
                textShadow: `0 0 26px ${hexToRgba(trophyUnlock.level.color, 0.75)}`,
              }}
            >
              {trophyUnlock.level.label}
            </div>
            <div className="text-sm mt-1.5" style={{ color: "#EDEDEA" }}>
              {trophyUnlock.habit.name} — {trophyUnlock.level.threshold} days
            </div>
          </div>
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

      {/* Set today's milestone goal — one habit at a time from the queue */}
      {milestoneGoalQueue.length > 0 &&
        (() => {
          const head = milestoneGoalQueue[0];
          const habit = habits.find((h) => h.id === head.habit.id) || head.habit;
          const doneMap = milestoneCompletions[habit.id] || {};
          const incomplete = (habit.milestones || []).filter((m) => !doneMap[m.id]);
          if (incomplete.length === 0) return null; // cleanup effect will drop this shortly

          const fromIdx = Math.max(0, incomplete.findIndex((m) => String(m.id) === goalFromId));
          const toIdx = Math.max(0, incomplete.findIndex((m) => String(m.id) === goalToId));
          const lo = Math.min(fromIdx, toIdx);
          const hi = Math.max(fromIdx, toIdx);
          const selected = incomplete.slice(lo, hi + 1);

          const skipGoal = () => setMilestoneGoalQueue((q) => q.slice(1));
          const confirmGoal = () => {
            const dayTargets = { ...(milestoneTargets[today] || {}), [habit.id]: selected.map((m) => m.id) };
            persistMilestoneTargets({ ...milestoneTargets, [today]: dayTargets });
            setMilestoneGoalQueue((q) => q.slice(1));
          };

          return (
            <div
              onClick={skipGoal}
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
                <div className="text-sm mb-1" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                  Today's goal for "{habit.name}"
                </div>
                <div className="text-xs mb-4" style={{ color: "#8A8A85" }}>
                  Which milestones do you want to complete today? Pick a range from your {incomplete.length}{" "}
                  remaining milestone{incomplete.length === 1 ? "" : "s"}.
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <div className="text-xs mb-1" style={{ color: "#6E6E6A" }}>
                      From
                    </div>
                    <select
                      value={goalFromId ?? ""}
                      onChange={(e) => setGoalFromId(e.target.value)}
                      className="w-full rounded-lg px-2 py-2 text-xs"
                      style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                    >
                      {incomplete.map((m, i) => (
                        <option key={m.id} value={String(m.id)}>
                          {i + 1}. {m.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs mb-1" style={{ color: "#6E6E6A" }}>
                      To
                    </div>
                    <select
                      value={goalToId ?? ""}
                      onChange={(e) => setGoalToId(e.target.value)}
                      className="w-full rounded-lg px-2 py-2 text-xs"
                      style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA" }}
                    >
                      {incomplete.map((m, i) => (
                        <option key={m.id} value={String(m.id)}>
                          {i + 1}. {m.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-xs mb-5" style={{ color: habit.color }}>
                  {selected.length} milestone{selected.length === 1 ? "" : "s"} selected for today — this will count
                  toward today's completion percentage.
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={skipGoal}
                    className="flex-1 rounded-md py-2 text-sm"
                    style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
                  >
                    Not today
                  </button>
                  <button
                    onClick={confirmGoal}
                    className="flex-1 rounded-md py-2 text-sm"
                    style={{ background: habit.color, color: "#000000", fontWeight: 600 }}
                  >
                    Set goal
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

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

      {/* Completion trend graph (daily / weekly) */}
      {showTrendGraph &&
        (() => {
          const dailySeries = buildTrendSeries(habits, records, today, milestoneTargets, milestoneCompletions, selectedCategory);
          const weeklySeries = buildWeeklyTrendSeries(dailySeries);
          const activeSeries = trendGraphView === "weekly" ? weeklySeries : dailySeries;
          const todayDate = parseDate(today);
          const trackedDays = dailySeries.filter((pt) => pt.pct !== null).length;
          const trackedWeeks = weeklySeries.filter((pt) => pt.pct !== null).length;
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} color={ACCENT_GREEN} />
                    <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                      {trendGraphView === "weekly" ? "Weekly completion" : "Daily completion"}
                    </span>
                  </div>
                  <button onClick={() => setShowTrendGraph(false)} aria-label="Close" style={{ color: "#8A8A85" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="flex gap-1 mb-4">
                  {[
                    { key: "daily", label: "Daily average" },
                    { key: "weekly", label: "Weekly average" },
                  ].map((v) => (
                    <button
                      key={v.key}
                      onClick={() => setTrendGraphView(v.key)}
                      className="period-btn rounded-full px-2.5 py-1 text-xs"
                      style={{
                        background: trendGraphView === v.key ? ACCENT_GREEN : "transparent",
                        color: trendGraphView === v.key ? "#000000" : "#9A9A94",
                        border: `1px solid ${trendGraphView === v.key ? ACCENT_GREEN : "#262622"}`,
                        fontWeight: 500,
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <div className="text-xs mb-4" style={{ color: "#6E6E6A" }}>
                  {trendGraphView === "weekly"
                    ? trackedWeeks === 0
                      ? "No tracked weeks yet — this fills in as you go."
                      : `Scroll left to see earlier weeks · ${trackedWeeks} week${trackedWeeks === 1 ? "" : "s"} tracked`
                    : trackedDays === 0
                      ? "No tracked days yet — this fills in as you go."
                      : `Scroll left to see earlier days · ${trackedDays} day${trackedDays === 1 ? "" : "s"} tracked`}
                </div>
                <TrendGraph series={activeSeries} todayDate={todayDate} mode={trendGraphView} />
              </div>
            </div>
          );
        })()}

      {/* Home / Archive nav menu */}
      {showNavMenu && (
        <div
          onClick={() => setShowNavMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 60,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
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
              padding: "10px",
              width: "200px",
              marginTop: "56px",
            }}
          >
            <button
              onClick={() => {
                setCurrentView("home");
                setShowNavMenu(false);
              }}
              className="w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
              style={{
                background: currentView === "home" ? hexToRgba(ACCENT_GREEN, 0.16) : "transparent",
                color: currentView === "home" ? ACCENT_GREEN : "#EDEDEA",
                fontWeight: currentView === "home" ? 700 : 500,
              }}
            >
              <Home size={16} />
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("archive");
                setShowNavMenu(false);
              }}
              className="w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 text-sm mt-1"
              style={{
                background: currentView === "archive" ? hexToRgba(ACCENT_GREEN, 0.16) : "transparent",
                color: currentView === "archive" ? ACCENT_GREEN : "#EDEDEA",
                fontWeight: currentView === "archive" ? 700 : 500,
              }}
            >
              <Archive size={16} />
              Archive
            </button>
            <button
              onClick={() => {
                setCurrentView("calculator");
                setShowNavMenu(false);
              }}
              className="w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 text-sm mt-1"
              style={{
                background: currentView === "calculator" ? hexToRgba(ACCENT_GREEN, 0.16) : "transparent",
                color: currentView === "calculator" ? ACCENT_GREEN : "#EDEDEA",
                fontWeight: currentView === "calculator" ? 700 : 500,
              }}
            >
              <Calculator size={16} />
              Calculator
            </button>
          </div>
        </div>
      )}

      {/* Account & backup */}
      {showAccountModal && (
        <div
          onClick={() => setShowAccountModal(false)}
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
              maxWidth: "380px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                Account &amp; Backup
              </span>
              <button onClick={() => setShowAccountModal(false)} aria-label="Close" style={{ color: "#8A8A85" }}>
                <X size={18} />
              </button>
            </div>

            <div className="mb-5">
              <div className="text-xs mb-2 mono" style={{ color: "#8A8A85" }}>
                GOOGLE ACCOUNT
              </div>
              {googleUser ? (
                <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: "#151513", border: "1px solid #262622" }}>
                  {googleUser.picture && (
                    <img
                      src={googleUser.picture}
                      alt=""
                      referrerPolicy="no-referrer"
                      style={{ width: "40px", height: "40px", borderRadius: "999px" }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate" style={{ color: "#EDEDEA", fontWeight: 600 }}>
                      {googleUser.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: "#8A8A85" }}>
                      {googleUser.email}
                    </div>
                  </div>
                  <button
                    onClick={() => setGoogleUser(null)}
                    className="text-xs shrink-0"
                    style={{ color: "#8A8A85", textDecoration: "underline" }}
                  >
                    Sign out
                  </button>
                </div>
              ) : GOOGLE_CLIENT_ID ? (
                <>
                  <div ref={googleButtonRef} />
                  {googleSignInError && (
                    <div className="text-xs mt-2" style={{ color: "#E5484D" }}>
                      {googleSignInError}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs rounded-lg p-3" style={{ background: "#151513", border: "1px solid #262622", color: "#8A8A85" }}>
                  Sign-in isn't set up yet — it needs a free Google Client ID added to the code (see the
                  GOOGLE_CLIENT_ID comment near the top of the file). Even once added, signing in only shows who
                  you are — it doesn't move your data anywhere, since this app has no server. Use the backup
                  below for that.
                </div>
              )}
            </div>

            <div>
              <div className="text-xs mb-2 mono" style={{ color: "#8A8A85" }}>
                MOVE YOUR PROGRESS TO A NEW DEVICE
              </div>
              <div className="text-xs mb-3" style={{ color: "#8A8A85" }}>
                Nothing syncs automatically here. Export a backup file, send it to your new device however you
                like (email, Drive, AirDrop), then import it there.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportBackup}
                  className="flex-1 rounded-md py-2.5 flex items-center justify-center gap-2 text-sm"
                  style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA", fontWeight: 600 }}
                >
                  <Download size={15} />
                  Export
                </button>
                <button
                  onClick={() => backupFileInputRef.current?.click()}
                  className="flex-1 rounded-md py-2.5 flex items-center justify-center gap-2 text-sm"
                  style={{ background: "#151513", border: "1px solid #262622", color: "#EDEDEA", fontWeight: 600 }}
                >
                  <Upload size={15} />
                  Import
                </button>
                <input
                  ref={backupFileInputRef}
                  type="file"
                  accept="application/json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    importBackup(f);
                    e.target.value = "";
                  }}
                />
              </div>
              {backupMessage && (
                <div className="text-xs mt-3" style={{ color: ACCENT_GREEN }}>
                  {backupMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              {completeHabitConfirm.frequency?.type === "milestone"
                ? `Mark "${completeHabitConfirm.name}" as completed?`
                : `Archive "${completeHabitConfirm.name}"?`}
            </div>
            <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
              It'll move to your Archive and won't show up in your daily list starting tomorrow. You can restore it later if you change your mind.
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

      {/* Exit app confirmation (back button on the bare Home screen) */}
      {showExitConfirm && (
        <div
          onClick={() => setShowExitConfirm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 90,
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
              Exit Strata?
            </div>
            <div className="text-xs mb-5" style={{ color: "#8A8A85" }}>
              Your progress is already saved — this just closes the app.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "transparent", border: "1px solid #3A3A35", color: "#EDEDEA" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 rounded-md py-2 text-sm"
                style={{ background: "#E5484D", color: "#000000", fontWeight: 600 }}
              >
                Yes, exit
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
                  playDeleteSound(getAudioContext());
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