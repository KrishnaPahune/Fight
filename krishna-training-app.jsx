
import { useState, useEffect, useRef } from "react";

// ─── SUPABASE CONFIG ───────────────────────────────────────────────────────────
// Paste your Supabase project URL and anon key here
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USER_ID = "krishna"; // unique identifier for your data

const db = {
  async get(key) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/training_store?user_id=eq.${USER_ID}&key=eq.${encodeURIComponent(key)}&select=value`, {
        headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const data = await res.json();
      if (data && data[0]) return JSON.parse(data[0].value);
      return null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/training_store`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({ user_id: USER_ID, key, value: JSON.stringify(value), updated_at: new Date().toISOString() })
      });
    } catch {}
  }
};
// ──────────────────────────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  name: "Krishna",
  goal: "Para SF / IMA",
  run1_5km: "7:30",
  pullups: 8,
  pushups: 40,
  plank: 60,
  week: 1,
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INITIAL_PLAN = {
  Monday: {
    theme: "Speed + Push + Core",
    track: [
      { id: "dyn", name: "Dynamic Stretching", sets: 1, reps: "5 mins", done: false },
      { id: "run", name: "1.5km Timed Run", sets: 1, reps: "Push PR", done: false },
      { id: "spr1", name: "Sprint 1 — 100m Accelerating", sets: 1, reps: "1x", done: false },
      { id: "lunge", name: "Lunges (during recovery)", sets: 3, reps: "12 each leg", done: false },
      { id: "spr2", name: "Sprint 2 — 300m Full Effort", sets: 1, reps: "1x", done: false },
      { id: "ub", name: "Uthak Baithak (during recovery)", sets: 3, reps: "20", done: false },
      { id: "spr3", name: "Sprint 3 — 60m Absolute Max", sets: 1, reps: "1x", done: false },
      { id: "plank", name: "Plank", sets: 3, reps: "60 sec", done: false },
      { id: "lr", name: "Leg Raises", sets: 3, reps: "15", done: false },
      { id: "pu_n", name: "Push-ups — Normal", sets: 1, reps: "Max", done: false },
      { id: "pu_d", name: "Push-ups — Diamond", sets: 1, reps: "Max", done: false },
      { id: "pu_da", name: "Push-ups — Danda", sets: 1, reps: "Max", done: false },
    ],
    gym: [
      { id: "pul", name: "Pull-ups", sets: 3, reps: "Max", done: false },
      { id: "neg", name: "Negative Pull-ups", sets: 5, reps: "5 slow", done: false },
      { id: "ohp", name: "Overhead Dumbbell Press", sets: 3, reps: "12", done: false },
      { id: "row", name: "Bent Over Rows", sets: 3, reps: "12", done: false },
      { id: "hkr", name: "Hanging Knee Raises", sets: 3, reps: "15", done: false },
    ],
  },
  Tuesday: {
    theme: "Legs + Core Focus",
    track: [
      { id: "dyn", name: "Dynamic Stretching", sets: 1, reps: "5 mins", done: false },
      { id: "run_e", name: "1.5km Easy Pace", sets: 1, reps: "Recovery run", done: false },
      { id: "ub", name: "Uthak Baithak", sets: 4, reps: "20", done: false },
      { id: "lunge", name: "Lunges", sets: 3, reps: "12 each leg", done: false },
      { id: "calf", name: "Calf Raises", sets: 3, reps: "25", done: false },
      { id: "plank", name: "Plank", sets: 3, reps: "60 sec", done: false },
      { id: "lr", name: "Leg Raises", sets: 3, reps: "15", done: false },
      { id: "rt", name: "Russian Twists", sets: 3, reps: "20", done: false },
    ],
    gym: [
      { id: "pul", name: "Pull-ups", sets: 3, reps: "Max", done: false },
      { id: "neg", name: "Negative Pull-ups", sets: 5, reps: "5 slow", done: false },
      { id: "dip", name: "Bench Dips", sets: 3, reps: "Max", done: false },
      { id: "hkr", name: "Hanging Knee Raises", sets: 3, reps: "15", done: false },
    ],
  },
  Wednesday: {
    theme: "Speed + Pull + Core",
    track: [
      { id: "dyn", name: "Dynamic Stretching", sets: 1, reps: "5 mins", done: false },
      { id: "run", name: "1.5km Timed Run", sets: 1, reps: "Match or beat Monday", done: false },
      { id: "int1", name: "400m Interval Sprint", sets: 3, reps: "Walk 200m between", done: false },
      { id: "ub", name: "Uthak Baithak (during walk recovery)", sets: 3, reps: "15", done: false },
      { id: "plank", name: "Plank", sets: 3, reps: "60 sec", done: false },
      { id: "pu", name: "Push-ups", sets: 2, reps: "Max", done: false },
    ],
    gym: [
      { id: "pul", name: "Pull-ups", sets: 4, reps: "Max", done: false },
      { id: "neg", name: "Negative Pull-ups", sets: 5, reps: "5 slow", done: false },
      { id: "dip", name: "Bench Dips", sets: 3, reps: "Max", done: false },
      { id: "row", name: "Bent Over Rows", sets: 3, reps: "12", done: false },
      { id: "hlr", name: "Hanging Leg Raises", sets: 3, reps: "10", done: false },
    ],
  },
  Thursday: {
    theme: "Active Recovery",
    track: [],
    gym: [],
    recovery: [
      { id: "walk", name: "1km Easy Walk", sets: 1, reps: "Anytime", done: false },
      { id: "pu_day", name: "100 Push-ups Throughout Day", sets: 5, reps: "20 each", done: false },
      { id: "ub_day", name: "50 Uthak Baithak Throughout Day", sets: 5, reps: "10 each", done: false },
      { id: "plank", name: "Plank", sets: 2, reps: "60 sec", done: false },
      { id: "stretch", name: "Full Body Stretching", sets: 1, reps: "15 mins", done: false },
    ],
  },
  Friday: {
    theme: "Power + Strength",
    track: [
      { id: "dyn", name: "Dynamic Stretching", sets: 1, reps: "5 mins", done: false },
      { id: "run", name: "1.5km Timed Run", sets: 1, reps: "Push hard", done: false },
      { id: "spr", name: "6x100m Full Effort Sprints", sets: 6, reps: "Calf raises in recovery", done: false },
      { id: "plank", name: "Plank", sets: 3, reps: "90 sec", done: false },
      { id: "lr", name: "Leg Raises", sets: 3, reps: "15", done: false },
      { id: "pu_n", name: "Push-ups — Normal", sets: 1, reps: "Max", done: false },
      { id: "pu_d", name: "Push-ups — Diamond", sets: 1, reps: "Max", done: false },
      { id: "pu_da", name: "Push-ups — Danda", sets: 1, reps: "Max", done: false },
    ],
    gym: [
      { id: "pul", name: "Pull-ups", sets: 3, reps: "Max", done: false },
      { id: "neg", name: "Negative Pull-ups", sets: 5, reps: "5 slow", done: false },
      { id: "row", name: "Bent Over Rows", sets: 3, reps: "12", done: false },
      { id: "ohp", name: "Overhead Press", sets: 3, reps: "12", done: false },
      { id: "dip", name: "Bench Dips", sets: 3, reps: "Max", done: false },
      { id: "hlr", name: "Hanging Leg Raises", sets: 3, reps: "10", done: false },
    ],
  },
  Saturday: {
    theme: "Endurance + Full Body",
    track: [
      { id: "dyn", name: "Dynamic Stretching", sets: 1, reps: "5 mins", done: false },
      { id: "run3", name: "3km Comfortable Pace", sets: 1, reps: "No pressure on speed", done: false },
      { id: "walk", name: "Walk 1 Lap", sets: 1, reps: "Recovery", done: false },
      { id: "ub", name: "Uthak Baithak", sets: 4, reps: "20", done: false },
      { id: "lunge", name: "Lunges", sets: 3, reps: "12 each", done: false },
      { id: "rt", name: "Russian Twists", sets: 3, reps: "20", done: false },
      { id: "plank", name: "Plank", sets: 3, reps: "60 sec", done: false },
      { id: "pu_n", name: "Push-ups — Normal", sets: 1, reps: "Max", done: false },
      { id: "pu_d", name: "Push-ups — Diamond", sets: 1, reps: "Max", done: false },
    ],
    gym: [
      { id: "pul", name: "Pull-ups", sets: 3, reps: "Max", done: false },
      { id: "neg", name: "Negative Pull-ups", sets: 5, reps: "5 slow", done: false },
      { id: "dip", name: "Bench Dips", sets: 3, reps: "Max", done: false },
      { id: "hlr", name: "Hanging Leg Raises", sets: 3, reps: "10", done: false },
    ],
  },
  Sunday: {
    theme: "Full Rest",
    track: [],
    gym: [],
    recovery: [
      { id: "rest", name: "Complete Rest", sets: 1, reps: "All day", done: false },
      { id: "walk", name: "Light Walk (optional)", sets: 1, reps: "If you feel like it", done: false },
    ],
  },
};

const EXERCISE_TIPS = {
  "Pull-ups": {
    tip: "Before pulling, squeeze shoulder blades DOWN and BACK first. Drive elbows toward hips — not just arms. Full range: dead hang to chin over bar. No swinging.",
    common_mistake: "Using only arms instead of activating back muscles.",
  },
  "Negative Pull-ups": {
    tip: "Jump to top position (chin above bar), then lower as SLOWLY as possible — 5-7 seconds going down. This is where real strength is built.",
    common_mistake: "Dropping too fast. The slower the better.",
  },
  "Uthak Baithak": {
    tip: "Full depth squat — go all the way down. Keep chest up, knees tracking over toes. This is better than gym squats for functional military strength.",
    common_mistake: "Partial depth. Go all the way down every rep.",
  },
  "Plank": {
    tip: "Body in straight line — hips neither up nor sagging. Squeeze core, glutes, and quads together. Breathe normally. Don't hold breath.",
    common_mistake: "Hips too high or sagging lower back.",
  },
  "Lunges": {
    tip: "Step forward, lower back knee toward ground without touching. Front knee stays over ankle. Keep torso upright.",
    common_mistake: "Front knee caving inward.",
  },
  "Hanging Knee Raises": {
    tip: "Dead hang, then pull knees to chest slowly. Lower with control. Engages core AND grip simultaneously.",
    common_mistake: "Swinging and using momentum instead of core.",
  },
  "Bench Dips": {
    tip: "Hands on bench behind you, feet forward. Lower until elbows at 90 degrees. Keep back close to bench.",
    common_mistake: "Not going deep enough. 90 degrees minimum.",
  },
  "Bent Over Rows": {
    tip: "Hinge at hips, back flat, pull weight to lower chest. Squeeze shoulder blades together at top. This builds the back needed for rucking.",
    common_mistake: "Rounding the back. Keep it flat always.",
  },
};

const MOTIVATIONAL_QUOTES = [
  "The surgical strikes across LoC were done by Para SF. That could be you.",
  "Every pull-up today is one step closer to the maroon beret.",
  "IMA Dehradun is waiting. The only question is — are you?",
  "Pain is temporary. The commission is permanent.",
  "A Para SF operator is not born. He is forged — rep by rep.",
  "Your 1.5km today is someone else's warmup. Close the gap.",
  "Discipline is choosing what you want most over what you want now.",
  "The track doesn't care about your mood. Show up anyway.",
];

const WEEKLY_TARGETS = [
  { week: 1, run: "7:30", pullups: 8, plank: "60s" },
  { week: 2, run: "7:15", pullups: 9, plank: "65s" },
  { week: 3, run: "7:00", pullups: 10, plank: "70s" },
  { week: 4, run: "6:45", pullups: 11, plank: "75s" },
  { week: 6, run: "6:30", pullups: 13, plank: "80s" },
  { week: 8, run: "6:15", pullups: 14, plank: "90s" },
  { week: 10, run: "6:00", pullups: 15, plank: "100s" },
  { week: 16, run: "5:30", pullups: 18, plank: "120s" },
  { week: 20, run: "5:00", pullups: 20, plank: "150s" },
];

export default function TrainingApp() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState(today in INITIAL_PLAN ? today : "Monday");
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [logs, setLogs] = useState([]);
  const [cloudReady, setCloudReady] = useState(false);
  const [aiChat, setAiChat] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [logForm, setLogForm] = useState({ run: "", pullups: "", pushups: "", plank: "", notes: "" });
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  const [editingExercise, setEditingExercise] = useState(null);
  const chatEndRef = useRef(null);

  // Sync to Supabase on change (debounced)
  useEffect(() => { db.set("plan", plan); }, [plan]);
  useEffect(() => { db.set("profile", profile); }, [profile]);
  useEffect(() => { db.set("logs", logs); }, [logs]);

  // Load from Supabase on mount
  useEffect(() => {
    const load = async () => {
      const [savedPlan, savedProfile, savedLogs] = await Promise.all([
        db.get("plan"), db.get("profile"), db.get("logs")
      ]);
      if (savedPlan) setPlan(savedPlan);
      if (savedProfile) setProfile(savedProfile);
      if (savedLogs) setLogs(savedLogs);
      setCloudReady(true);
    };
    if (SUPABASE_URL !== "YOUR_SUPABASE_URL") load();
    else setCloudReady(true);
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  const toggleExercise = (day, section, id) => {
    setPlan(prev => {
      const updated = { ...prev };
      const items = updated[day][section];
      updated[day] = {
        ...updated[day],
        [section]: items.map(e => e.id === id ? { ...e, done: !e.done } : e),
      };
      return updated;
    });
  };

  const getProgress = (day) => {
    const d = plan[day];
    const all = [...(d.track || []), ...(d.gym || []), ...(d.recovery || [])];
    if (all.length === 0) return 100;
    return Math.round((all.filter(e => e.done).length / all.length) * 100);
  };

  const saveLog = () => {
    const entry = { date: new Date().toLocaleDateString(), ...logForm };
    setLogs(prev => [entry, ...prev.slice(0, 29)]);
    setLogForm({ run: "", pullups: "", pushups: "", plank: "", notes: "" });
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiLoading(true);

    const history = aiChat.map(m => ({ role: m.role, content: m.content }));
    const newHistory = [...history, { role: "user", content: userMsg }];
    setAiChat(prev => [...prev, { role: "user", content: userMsg }]);

    const systemPrompt = `You are a tough but caring military fitness coach and CDS exam mentor for Krishna, a final-year B.E. IT student from Loni, Ahilyanagar who wants to crack CDS, join IMA, and ultimately become a Para SF operator.

Krishna's current stats:
- 1.5km run: ${profile.run1_5km} mins
- Pull-ups max: ${profile.pullups} reps
- Push-ups max: ${profile.pushups} reps  
- Plank: ${profile.plank} seconds
- Current training week: ${profile.week}

His training setup:
- Runs on a college 400m track (uneven, 1km walk from room)
- Small college gym (no mat, limited equipment)
- Has: pull-up bar, bench for dips, dumbbells, barbell
- No farmer's carry possible
- Does bench dips (not parallel bar dips)
- Core and leg work done on small grass area at track
- Vegetarian, hostel life, limited budget
- Eats: soyabean chilli outside, peanuts, bananas, roasted chana, mess food
- No cooking facility

His current weekly plan is structured with speed days, leg/core days, pull days, active recovery Thursday, and full rest Sunday.

Key exercises in his plan: 1.5km timed runs, sprints (100m, 300m, 60m, 400m intervals), uthak baithak, lunges, calf raises, push-up circuit (normal/diamond/danda), pull-ups with negatives, overhead press, bent over rows, bench dips, hanging knee/leg raises, planks, leg raises, Russian twists.

Goals: CDS written exam + SSB + IMA → Para SF

Be direct, military-style but warm. Give specific, actionable advice. If asked to modify the plan, give concrete changes. If asked about exercises, give form cues. If asked about CDS exam, give study tips. Keep responses concise and punchy. Use military metaphors when appropriate.

CRITICAL RULE - YOUTUBE LINKS: Whenever the user asks about ANY exercise or how to do something physically, you MUST include a YouTube search link at the very end of your response in this EXACT format on its own line:
YOUTUBE: https://www.youtube.com/results?search_query=exercise+name+proper+form+tutorial

Replace "exercise+name" with the actual exercise. Always use + between words. This is mandatory for every exercise question.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "placeholder",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Could not get response.";
      setAiChat(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setAiChat(prev => [...prev, { role: "assistant", content: "Connection error. Try again." }]);
    }
    setAiLoading(false);
  };

  const currentDay = plan[selectedDay];
  const sections = [
    { key: "track", label: "🏃 Track" },
    { key: "gym", label: "💪 Gym" },
    { key: "recovery", label: "🔄 Recovery" },
  ].filter(s => currentDay[s.key]?.length > 0);

  const latestLog = logs[0];
  const currentTarget = WEEKLY_TARGETS.find(t => t.week >= profile.week) || WEEKLY_TARGETS[WEEKLY_TARGETS.length - 1];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e4d9",
      fontFamily: "'Courier New', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #0a0a0f 60%)",
        borderBottom: "1px solid #3a2a1a",
        padding: "16px 20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#ff6b1a", letterSpacing: "3px", marginBottom: "2px" }}>OPERATION</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff8c42", letterSpacing: "1px" }}>PARA SF ZERO</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#666", letterSpacing: "2px" }}>WEEK {profile.week}</div>
            <div style={{ fontSize: "12px", color: "#ff6b1a" }}>{profile.goal}</div>
          </div>
        </div>

        {/* Quote ticker */}
        <div style={{
          marginTop: "10px",
          padding: "6px 10px",
          background: "rgba(255,107,26,0.08)",
          borderLeft: "2px solid #ff6b1a",
          fontSize: "10px",
          color: "#cc7a3a",
          letterSpacing: "0.5px",
          fontStyle: "italic",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span>"{quote}"</span>
          <span style={{ fontSize: "8px", letterSpacing: "1px", color: SUPABASE_URL !== "YOUR_SUPABASE_URL" ? (cloudReady ? "#3a8a3a" : "#666") : "#553a1a", marginLeft: "8px", flexShrink: 0 }}>
            {SUPABASE_URL !== "YOUR_SUPABASE_URL" ? (cloudReady ? "☁ SYNCED" : "☁ SYNCING...") : "⚠ LOCAL"}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "#1a1a2a",
        borderBottom: "1px solid #2a2a3a",
      }}>
        {[
          { label: "1.5KM", value: profile.run1_5km, unit: "min", target: currentTarget.run },
          { label: "PULL-UPS", value: profile.pullups, unit: "reps", target: currentTarget.pullups },
          { label: "PUSH-UPS", value: profile.pushups, unit: "reps", target: "50+" },
          { label: "PLANK", value: profile.plank, unit: "sec", target: currentTarget.plank },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#0d0d18",
            padding: "10px 8px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", marginBottom: "3px" }}>{stat.label}</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff8c42" }}>{stat.value}</div>
            <div style={{ fontSize: "8px", color: "#444" }}>{stat.unit}</div>
            <div style={{ fontSize: "8px", color: "#3a6a3a", marginTop: "2px" }}>→ {stat.target}</div>
          </div>
        ))}
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: "flex",
        background: "#0d0d18",
        borderBottom: "1px solid #1a1a2a",
        overflowX: "auto",
      }}>
        {[
          { id: "today", label: "TODAY" },
          { id: "week", label: "WEEK" },
          { id: "coach", label: "COACH AI" },
          { id: "log", label: "LOG" },
          { id: "stats", label: "STATS" },
          { id: "profile", label: "PROFILE" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: "0 0 auto",
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: activeTab === tab.id ? "2px solid #ff6b1a" : "2px solid transparent",
            color: activeTab === tab.id ? "#ff8c42" : "#444",
            fontSize: "10px",
            letterSpacing: "2px",
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>

        {/* TODAY TAB */}
        {activeTab === "today" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "4px" }}>TODAY</div>
              <div style={{ fontSize: "22px", fontWeight: "bold", color: "#e8e4d9" }}>{selectedDay}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{currentDay.theme}</div>

              {/* Progress bar */}
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#555", letterSpacing: "1px" }}>MISSION PROGRESS</span>
                  <span style={{ fontSize: "9px", color: "#ff6b1a" }}>{getProgress(selectedDay)}%</span>
                </div>
                <div style={{ height: "4px", background: "#1a1a2a", borderRadius: "2px" }}>
                  <div style={{
                    height: "100%",
                    width: `${getProgress(selectedDay)}%`,
                    background: "linear-gradient(90deg, #ff6b1a, #ff8c42)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)} style={{
                  flex: "0 0 auto",
                  padding: "5px 10px",
                  background: selectedDay === d ? "#ff6b1a" : "#1a1a2a",
                  border: "1px solid",
                  borderColor: selectedDay === d ? "#ff6b1a" : "#2a2a3a",
                  color: selectedDay === d ? "#000" : "#555",
                  borderRadius: "4px",
                  fontSize: "9px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                }}>{d.slice(0, 3).toUpperCase()}</button>
              ))}
            </div>

            {sections.map(section => (
              <div key={section.key} style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "11px",
                  color: "#ff6b1a",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                  paddingBottom: "4px",
                  borderBottom: "1px solid #1a1a2a",
                }}>{section.label}</div>

                {currentDay[section.key].map(exercise => (
                  <div key={exercise.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    marginBottom: "4px",
                    background: exercise.done ? "rgba(255,107,26,0.08)" : "#0d0d18",
                    border: "1px solid",
                    borderColor: exercise.done ? "#3a2a1a" : "#1a1a2a",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }} onClick={() => toggleExercise(selectedDay, section.key, exercise.id)}>
                    <div style={{
                      width: "18px",
                      height: "18px",
                      border: "1px solid",
                      borderColor: exercise.done ? "#ff6b1a" : "#333",
                      borderRadius: "3px",
                      background: exercise.done ? "#ff6b1a" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "10px",
                    }}>{exercise.done ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "12px",
                        color: exercise.done ? "#666" : "#e8e4d9",
                        textDecoration: exercise.done ? "line-through" : "none",
                      }}>{exercise.name}</div>
                      <div style={{ fontSize: "10px", color: "#444", marginTop: "1px" }}>
                        {exercise.sets > 1 ? `${exercise.sets} sets × ` : ""}{exercise.reps}
                      </div>
                    </div>
                    {EXERCISE_TIPS[exercise.name] && (
                      <button onClick={(e) => { e.stopPropagation(); setSelectedExercise(exercise.name); }} style={{
                        background: "none",
                        border: "1px solid #2a2a3a",
                        color: "#555",
                        padding: "3px 7px",
                        borderRadius: "3px",
                        fontSize: "9px",
                        cursor: "pointer",
                        letterSpacing: "1px",
                        fontFamily: "'Courier New', monospace",
                      }}>TIP</button>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {getProgress(selectedDay) === 100 && (
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255,107,26,0.08)",
                border: "1px solid #3a2a1a",
                borderRadius: "8px",
                marginTop: "10px",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>🎖️</div>
                <div style={{ fontSize: "12px", color: "#ff8c42", letterSpacing: "2px" }}>MISSION COMPLETE</div>
                <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>Para SF doesn't take days off. Log your stats.</div>
              </div>
            )}
          </div>
        )}

        {/* WEEK TAB */}
        {activeTab === "week" && (
          <div>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "16px" }}>WEEKLY OVERVIEW</div>
            {DAYS.map(day => (
              <div key={day} style={{
                padding: "12px 14px",
                marginBottom: "6px",
                background: "#0d0d18",
                border: "1px solid #1a1a2a",
                borderRadius: "6px",
                cursor: "pointer",
              }} onClick={() => { setSelectedDay(day); setActiveTab("today"); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#e8e4d9" }}>{day}</div>
                    <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{plan[day].theme}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", color: "#ff6b1a" }}>{getProgress(day)}%</div>
                    <div style={{ fontSize: "8px", color: "#333", marginTop: "2px" }}>DONE</div>
                  </div>
                </div>
                <div style={{ marginTop: "8px", height: "3px", background: "#1a1a2a", borderRadius: "2px" }}>
                  <div style={{
                    height: "100%",
                    width: `${getProgress(day)}%`,
                    background: "#ff6b1a",
                    borderRadius: "2px",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COACH AI TAB */}
        {activeTab === "coach" && (
          <div style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "12px" }}>
              COACH AI — YOUR PERSONAL PARA SF MENTOR
            </div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "12px" }}>
              Ask anything — form tips, plan changes, CDS prep, nutrition, motivation.
            </div>

            <div style={{
              flex: 1,
              overflowY: "auto",
              background: "#0d0d18",
              border: "1px solid #1a1a2a",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "10px",
            }}>
              {aiChat.length === 0 && (
                <div style={{ color: "#333", fontSize: "11px", textAlign: "center", marginTop: "20px" }}>
                  Ask your coach anything.<br /><br />
                  <span style={{ color: "#2a2a3a" }}>
                    "My pull-ups are stuck at 8, what do I do?"<br />
                    "How do I prepare for CDS GK?"<br />
                    "Modify my Tuesday plan — my legs are sore"<br />
                    "What should I eat before training?"
                  </span>
                </div>
              )}
              {aiChat.map((msg, i) => {
                const ytRegex = /YOUTUBE:\s*(https:\/\/www\.youtube\.com\/\S+)/g;
                const links = [];
                let m;
                while ((m = ytRegex.exec(msg.content)) !== null) links.push(m[1]);
                const cleanText = msg.content.replace(/YOUTUBE:\s*https:\/\/www\.youtube\.com\/\S+/g, "").trim();
                return (
                  <div key={i} style={{ marginBottom: "12px", display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%",
                      padding: "10px 12px",
                      background: msg.role === "user" ? "rgba(255,107,26,0.15)" : "#141420",
                      border: "1px solid",
                      borderColor: msg.role === "user" ? "#3a2a1a" : "#1a1a2a",
                      borderRadius: "6px",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      color: msg.role === "user" ? "#ff8c42" : "#c8c4b9",
                      whiteSpace: "pre-wrap",
                    }}>{cleanText}</div>
                    {links.map((url, j) => (
                      <a key={j} href={url} target="_blank" rel="noopener noreferrer" style={{
                        marginTop: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 14px",
                        background: "rgba(220,30,30,0.12)",
                        border: "1px solid rgba(220,30,30,0.35)",
                        borderRadius: "6px",
                        color: "#ff5555",
                        fontSize: "11px",
                        textDecoration: "none",
                        letterSpacing: "1px",
                        fontFamily: "'Courier New', monospace",
                        maxWidth: "85%",
                        cursor: "pointer",
                      }}>
                        <span style={{ fontSize: "15px" }}>▶</span>
                        <span>WATCH ON YOUTUBE</span>
                        <span style={{ fontSize: "9px", color: "#993333", marginLeft: "auto" }}>↗ OPEN</span>
                      </a>
                    ))}
                  </div>
                );
              })}
              {aiLoading && (
                <div style={{ color: "#ff6b1a", fontSize: "11px" }}>Coach is thinking...</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                placeholder="Ask your coach..."
                style={{
                  flex: 1,
                  background: "#0d0d18",
                  border: "1px solid #2a2a3a",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  color: "#e8e4d9",
                  fontSize: "12px",
                  fontFamily: "'Courier New', monospace",
                  outline: "none",
                }}
              />
              <button onClick={sendAiMessage} disabled={aiLoading} style={{
                padding: "10px 16px",
                background: "#ff6b1a",
                border: "none",
                borderRadius: "6px",
                color: "#000",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1px",
              }}>SEND</button>
            </div>
          </div>
        )}

        {/* LOG TAB */}
        {activeTab === "log" && (
          <div>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "16px" }}>LOG TODAY'S PERFORMANCE</div>

            {[
              { key: "run", label: "1.5KM TIME", placeholder: "e.g. 7:15" },
              { key: "pullups", label: "MAX PULL-UPS", placeholder: "e.g. 9" },
              { key: "pushups", label: "MAX PUSH-UPS", placeholder: "e.g. 35" },
              { key: "plank", label: "PLANK (seconds)", placeholder: "e.g. 65" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "4px" }}>{field.label}</div>
                <input
                  value={logForm[field.key]}
                  onChange={e => setLogForm(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "#0d0d18",
                    border: "1px solid #2a2a3a",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "#e8e4d9",
                    fontSize: "13px",
                    fontFamily: "'Courier New', monospace",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "4px" }}>NOTES</div>
              <textarea
                value={logForm.notes}
                onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="How did it feel? Any pain? Weather? Mood?"
                rows={3}
                style={{
                  width: "100%",
                  background: "#0d0d18",
                  border: "1px solid #2a2a3a",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  color: "#e8e4d9",
                  fontSize: "12px",
                  fontFamily: "'Courier New', monospace",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button onClick={saveLog} style={{
              width: "100%",
              padding: "12px",
              background: "#ff6b1a",
              border: "none",
              borderRadius: "6px",
              color: "#000",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "2px",
              fontFamily: "'Courier New', monospace",
            }}>SAVE LOG ENTRY</button>

            {logs.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "12px" }}>RECENT LOGS</div>
                {logs.slice(0, 5).map((log, i) => (
                  <div key={i} style={{
                    padding: "10px 12px",
                    background: "#0d0d18",
                    border: "1px solid #1a1a2a",
                    borderRadius: "6px",
                    marginBottom: "6px",
                  }}>
                    <div style={{ fontSize: "10px", color: "#ff6b1a", marginBottom: "6px" }}>{log.date}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[
                        { label: "RUN", value: log.run },
                        { label: "PULLUPS", value: log.pullups },
                        { label: "PUSHUPS", value: log.pushups },
                        { label: "PLANK", value: log.plank },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "8px", color: "#444" }}>{s.label}</div>
                          <div style={{ fontSize: "13px", color: "#e8e4d9" }}>{s.value || "—"}</div>
                        </div>
                      ))}
                    </div>
                    {log.notes && <div style={{ fontSize: "10px", color: "#555", marginTop: "6px", fontStyle: "italic" }}>"{log.notes}"</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "16px" }}>PERFORMANCE TARGETS</div>

            <div style={{ marginBottom: "20px" }}>
              {WEEKLY_TARGETS.map(target => (
                <div key={target.week} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  marginBottom: "4px",
                  background: profile.week >= target.week ? "rgba(255,107,26,0.08)" : "#0a0a0f",
                  border: "1px solid",
                  borderColor: profile.week === target.week ? "#ff6b1a" : "#1a1a2a",
                  borderRadius: "4px",
                }}>
                  <div style={{ fontSize: "9px", color: profile.week >= target.week ? "#ff6b1a" : "#333", width: "45px", letterSpacing: "1px" }}>
                    {profile.week >= target.week ? "✓ " : ""}WK {target.week}
                  </div>
                  <div style={{ flex: 1, display: "flex", gap: "16px" }}>
                    <span style={{ fontSize: "10px", color: "#666" }}>🏃 {target.run}</span>
                    <span style={{ fontSize: "10px", color: "#666" }}>💪 {target.pullups}</span>
                    <span style={{ fontSize: "10px", color: "#666" }}>⏱ {target.plank}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "12px" }}>PARA SF FINAL TARGETS</div>
            {[
              { label: "1.5km Run", current: profile.run1_5km, target: "Under 5:00 min", done: false },
              { label: "Pull-ups", current: `${profile.pullups} reps`, target: "20+ reps", done: false },
              { label: "5km Run", current: "Build to this", target: "Under 25 min", done: false },
              { label: "Push-ups", current: `${profile.pushups} reps`, target: "80-100 reps", done: false },
              { label: "Plank", current: `${profile.plank}s`, target: "150+ seconds", done: false },
            ].map(item => (
              <div key={item.label} style={{
                padding: "10px 12px",
                background: "#0d0d18",
                border: "1px solid #1a1a2a",
                borderRadius: "6px",
                marginBottom: "6px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#e8e4d9" }}>{item.label}</span>
                  <span style={{ fontSize: "10px", color: "#3a6a3a" }}>{item.target}</span>
                </div>
                <div style={{ fontSize: "10px", color: "#ff6b1a", marginTop: "3px" }}>Current: {item.current}</div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "16px" }}>UPDATE YOUR STATS</div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "16px" }}>Update after each milestone to keep your plan accurate.</div>

            {[
              { key: "run1_5km", label: "BEST 1.5KM TIME", placeholder: "e.g. 7:30" },
              { key: "pullups", label: "MAX PULL-UPS (1 set)", placeholder: "e.g. 8", type: "number" },
              { key: "pushups", label: "MAX PUSH-UPS (1 set)", placeholder: "e.g. 40", type: "number" },
              { key: "plank", label: "PLANK (seconds)", placeholder: "e.g. 60", type: "number" },
              { key: "week", label: "CURRENT WEEK", placeholder: "e.g. 1", type: "number" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "4px" }}>{field.label}</div>
                <input
                  type={field.type || "text"}
                  value={profile[field.key]}
                  onChange={e => setProfile(p => ({ ...p, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "#0d0d18",
                    border: "1px solid #2a2a3a",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "#e8e4d9",
                    fontSize: "13px",
                    fontFamily: "'Courier New', monospace",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div style={{
              marginTop: "20px",
              padding: "14px",
              background: "rgba(255,107,26,0.06)",
              border: "1px solid #3a2a1a",
              borderRadius: "6px",
            }}>
              <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "1px", marginBottom: "8px" }}>YOUR MISSION</div>
              <div style={{ fontSize: "11px", color: "#888", lineHeight: "1.7" }}>
                CDS Written Exam → IMA Dehradun → Lieutenant → Para Regiment → SF Selection → <span style={{ color: "#ff6b1a" }}>Maroon Beret</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Exercise Tip Modal */}
      {selectedExercise && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "flex-end",
          zIndex: 200,
          padding: "0",
        }} onClick={() => setSelectedExercise(null)}>
          <div style={{
            background: "#0d0d18",
            border: "1px solid #2a2a3a",
            borderRadius: "12px 12px 0 0",
            padding: "20px",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "10px", color: "#ff6b1a", letterSpacing: "2px", marginBottom: "8px" }}>EXERCISE TIP</div>
            <div style={{ fontSize: "16px", color: "#e8e4d9", marginBottom: "14px", fontWeight: "bold" }}>{selectedExercise}</div>
            <div style={{ fontSize: "12px", color: "#c8c4b9", lineHeight: "1.7", marginBottom: "12px" }}>
              {EXERCISE_TIPS[selectedExercise]?.tip}
            </div>
            <div style={{
              padding: "10px 12px",
              background: "rgba(255,60,60,0.08)",
              border: "1px solid #3a1a1a",
              borderRadius: "6px",
              marginBottom: "16px",
            }}>
              <div style={{ fontSize: "9px", color: "#aa3a3a", letterSpacing: "1px", marginBottom: "4px" }}>COMMON MISTAKE</div>
              <div style={{ fontSize: "11px", color: "#884a4a" }}>{EXERCISE_TIPS[selectedExercise]?.common_mistake}</div>
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedExercise + " proper form tutorial")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "11px",
                background: "rgba(220,30,30,0.12)",
                border: "1px solid rgba(220,30,30,0.35)",
                borderRadius: "6px",
                color: "#ff5555",
                fontSize: "11px",
                textDecoration: "none",
                letterSpacing: "1px",
                fontFamily: "'Courier New', monospace",
                marginBottom: "8px",
                cursor: "pointer",
                boxSizing: "border-box",
              }}>
              <span style={{ fontSize: "15px" }}>▶</span>
              <span>WATCH ON YOUTUBE</span>
              <span style={{ fontSize: "9px", color: "#993333", marginLeft: "auto" }}>↗ OPEN</span>
            </a>
            <button onClick={() => setSelectedExercise(null)} style={{
              width: "100%",
              padding: "12px",
              background: "#ff6b1a",
              border: "none",
              borderRadius: "6px",
              color: "#000",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "2px",
            }}>GOT IT</button>
          </div>
        </div>
      )}
    </div>
  );
}
