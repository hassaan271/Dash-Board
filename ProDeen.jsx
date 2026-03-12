import { useState, useEffect, useRef, memo } from "react";

const STATIC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&family=Orbitron:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root[data-theme="dark"] {
  --bg: #060810;
  --accent: #00e5ff;
  --accent2: #7c3aed;
  --accent-dim: rgba(0,229,255,0.35);
  --border: rgba(0,229,255,0.14);
  --card-bg: rgba(6,10,26,0.65);
  --header-bg: rgba(6,8,20,0.92);
  --text-1: #e0f7ff;
  --text-2: #7dd3fc;
  --text-3: #94a3b8;
  --text-4: #475569;
  --prog-bg: rgba(255,255,255,0.06);
  --input-bg: rgba(6,10,26,0.80);
  --glow-c: 0,229,255;
}

:root[data-theme="light"] {
  --bg: #f0f4ff;
  --accent: #0369a1;
  --accent2: #7c3aed;
  --accent-dim: rgba(3,105,161,0.45);
  --border: rgba(3,105,161,0.22);
  --card-bg: rgba(240,248,255,0.70);
  --header-bg: rgba(240,244,255,0.92);
  --text-1: #0c4a6e;
  --text-2: #0369a1;
  --text-3: #475569;
  --text-4: #94a3b8;
  --prog-bg: rgba(0,0,0,0.08);
  --input-bg: rgba(240,248,255,0.90);
  --glow-c: 3,105,161;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes clockGlow {
  0%, 100% { text-shadow: 0 0 16px rgba(var(--glow-c),0.7); }
  50% { text-shadow: 0 0 36px rgba(var(--glow-c),1); }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(2); opacity: 0.5; }
}

@keyframes progIn {
  from { width: 0; }
}

.glass {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  animation: fadeUp 0.5s ease-out both;
}

.glass-pulse {
  box-shadow: 0 0 20px rgba(var(--glow-c),0.22);
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--accent-dim);
  color: var(--text-3);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.nav-btn.active {
  background: rgba(0,229,255,0.1);
  color: var(--accent);
  border-color: var(--accent);
}

input[type="time"] {
  background: var(--input-bg);
  border: 1px solid var(--accent-dim);
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  padding: 5px 10px;
  border-radius: 6px;
}

.toggle-track {
  width: 56px;
  height: 28px;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--accent-dim), rgba(124,58,237,0.35));
  border: 1px solid var(--accent-dim);
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px;
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  transition: transform 0.32s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.stat-num {
  font-family: 'Orbitron', monospace;
}

.divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--accent-dim), transparent);
}
`;

const CyberBg = memo(({ dark }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let animId;
    const animate = () => {
      ctx.fillStyle = dark ? "#060810" : "#f0f4ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [dark]);

  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
});

export default function ProDeen() {
  const [tab, setTab] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [prayers, setPrayers] = useState({
    fajr: "05:00",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:00",
    isha: "19:30",
  });
  const [goals, setGoals] = useState([
    { id: 1, icon: "🧠", label: "Master Python", sub: "Advanced AI", progress: 65, color: "#00e5ff" },
    { id: 2, icon: "📚", label: "Read Quran", sub: "Daily practice", progress: 78, color: "#34d399" },
    { id: 3, icon: "💪", label: "Fitness", sub: "Calisthenics", progress: 52, color: "#fb923c" },
  ]);
  const [streaks, setStreaks] = useState({
    fajr: 23,
    quran: 47,
    python: 12,
    gym: 8,
  });

  const CAT_COLOR = {
    work: "#00e5ff",
    learn: "#34d399",
    health: "#fb923c",
    faith: "#7c3aed",
  };
  const CAT_LABEL = {
    work: "WORK",
    learn: "LEARN",
    health: "HEALTH",
    faith: "FAITH",
  };
  const SCHEDULE = [
    { id: "1", time: "05:00", icon: "🌅", label: "Fajr", cat: "faith" },
    { id: "2", time: "06:00", icon: "💪", label: "Gym", cat: "health" },
    { id: "3", time: "08:00", icon: "🍽️", label: "Breakfast", cat: "health" },
    { id: "4", time: "09:00", icon: "💻", label: "Code", cat: "work" },
    { id: "5", time: "12:30", icon: "🕌", label: "Dhuhr", cat: "faith" },
  ];

  const current = SCHEDULE[3];
  const next = SCHEDULE[4];

  const d = (i) => ({ animation: `fadeUp 0.5s ease-out ${i * 80}ms both` });
  const toMin = (t) => +t.split(":")[0] * 60 + +t.split(":")[1];
  const nowStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!document.getElementById("cyber-css")) {
      const style = document.createElement("style");
      style.id = "cyber-css";
      style.textContent = STATIC_CSS;
      document.head.appendChild(style);
    }
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const Tag = ({ color, children }) => (
    <span style={{
      display: "inline-block",
      fontSize: "8px",
      color,
      border: `1px solid ${color}50`,
      padding: "2px 8px",
      borderRadius: "4px",
      letterSpacing: "1px",
      marginRight: "6px",
    }}>
      {children}
    </span>
  );

  const CardTitle = ({ icon, children }) => (
    <div style={{
      fontSize: "13px",
      fontWeight: "700",
      color: "var(--text-1)",
      marginBottom: "14px",
      letterSpacing: "1px",
    }}>
      {icon} {children}
    </div>
  );

  const ProgBar = ({ pct, color }) => (
    <div style={{ height: "6px", background: "var(--prog-bg)", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: pct + "%",
        background: color,
        boxShadow: `0 0 12px ${color}88`,
        animation: "progIn 0.6s ease-out",
      }} />
    </div>
  );

  const LiveClock = () => {
    const [time, setTime] = useState(nowStr());
    useEffect(() => {
      const iv = setInterval(() => setTime(nowStr()), 1000);
      return () => clearInterval(iv);
    }, []);
    return (
      <div className="stat-num" style={{
        fontSize: "20px",
        color: "var(--accent)",
        animation: "clockGlow 2.5s ease-in-out infinite",
      }}>
        {time}
      </div>
    );
  };

  const Grid = ({ cols, children, single }) => (
    <div style={{
      position: "relative",
      zIndex: 10,
      display: "grid",
      gridTemplateColumns: cols || "1fr 1fr 1fr",
      gap: "20px",
      padding: "24px 32px",
      maxWidth: single ? "880px" : "1440px",
      margin: "0 auto",
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', monospace",
      color: "var(--text-3)",
      background: "var(--bg)",
      position: "relative",
    }}>
      <CyberBg dark={dark} />

      {/* HEADER */}
      <div style={{
        position: "relative",
        zIndex: 10,
        background: "var(--header-bg)",
        backdropFilter: "blur(24px)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "22px",
              fontWeight: "900",
              color: "var(--accent)",
              letterSpacing: "5px",
            }}>
              PRO
            </div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "22px",
              fontWeight: "900",
              color: "var(--accent2)",
              letterSpacing: "5px",
            }}>
              DEEN
            </div>
          </div>
        </div>

        <LiveClock />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "13px",
            color: "var(--text-2)",
            letterSpacing: "2px",
          }}>
            Mohammed Hassaan
          </div>
          <div style={{ fontSize: "9px", color: "var(--text-4)", letterSpacing: "2px" }}>
            BTECH · MJCET · HYDERABAD
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "3px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-4)" }}>
              {dark ? "DARK" : "LIGHT"}
            </span>
            <div className="toggle-track" onClick={() => setDark((d) => !d)}>
              <div
                className="toggle-thumb"
                style={{ transform: `translateX(${dark ? "28px" : "0px"})` }}
              >
                {dark ? "🌙" : "☀️"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        gap: "6px",
        padding: "12px 32px",
        background: "var(--header-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        {[
          ["dashboard", "⌂", "DASHBOARD"],
          ["schedule", "◈", "SCHEDULE"],
          ["goals", "◎", "GOALS"],
          ["streaks", "◉", "STREAKS"],
          ["settings", "⚙", "SETTINGS"],
        ].map(([k, ic, l]) => (
          <button
            key={k}
            className={`nav-btn ${tab === k ? "active" : ""}`}
            onClick={() => setTab(k)}
          >
            {ic} {l}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === "dashboard" && (
        <Grid>
          <div className="glass glass-pulse" style={{ gridColumn: "span 2", ...d(0), padding: "24px" }}>
            <CardTitle icon="⚡">Active Block</CardTitle>
            <p style={{ color: "var(--text-3)", fontSize: "13px" }}>
              {current.icon} {current.label}
            </p>
          </div>

          <div className="glass" style={{ ...d(1), padding: "22px" }}>
            <CardTitle icon="🕌">Prayers</CardTitle>
            {Object.keys(prayers).map((k) => (
              <div key={k} style={{ fontSize: "11px", padding: "4px 0" }}>
                {k}
              </div>
            ))}
          </div>

          <div className="glass" style={{ gridColumn: "span 2", ...d(2), padding: "24px" }}>
            <CardTitle icon="◎">Goals</CardTitle>
            {goals.map((g) => (
              <div key={g.id} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", marginBottom: "4px" }}>{g.icon} {g.label}</div>
                <ProgBar pct={g.progress} color={g.color} />
              </div>
            ))}
          </div>

          <div className="glass" style={{ ...d(3), padding: "22px" }}>
            <CardTitle icon="◉">Streaks</CardTitle>
            {Object.entries(streaks).map(([k, v]) => (
              <div key={k} style={{ fontSize: "11px", padding: "4px 0" }}>
                {k}: {v}
              </div>
            ))}
          </div>
        </Grid>
      )}

      {tab === "schedule" && (
        <Grid>
          <div className="glass" style={{ gridColumn: "span 3", ...d(0), padding: "24px" }}>
            <CardTitle icon="◈">Schedule</CardTitle>
            {SCHEDULE.map((task) => (
              <div key={task.id} style={{ fontSize: "12px", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                {task.time} - {task.icon} {task.label}
              </div>
            ))}
          </div>
        </Grid>
      )}

      {tab === "goals" && (
        <Grid cols="1fr 1fr">
          {goals.map((g, i) => (
            <div key={g.id} className="glass" style={{ ...d(i), padding: "26px" }}>
              <CardTitle icon={g.icon}>{g.label}</CardTitle>
              <div style={{ fontSize: "12px", marginBottom: "12px", color: "var(--text-3)" }}>
                {g.sub}
              </div>
              <ProgBar pct={g.progress} color={g.color} />
              <div style={{ fontSize: "11px", marginTop: "8px", color: g.color }}>
                {g.progress}%
              </div>
            </div>
          ))}
        </Grid>
      )}

      {tab === "streaks" && (
        <Grid cols="1fr 1fr 1fr 1fr">
          {[
            { k: "fajr", l: "Fajr", i: "🌅", c: "#38bdf8" },
            { k: "quran", l: "Quran", i: "📖", c: "#34d399" },
            { k: "python", l: "Python", i: "🐍", c: "#00e5ff" },
            { k: "gym", l: "Gym", i: "💪", c: "#fb923c" },
          ].map(({ k, l, i, c }, idx) => (
            <div key={k} className="glass" style={{ ...d(idx), padding: "34px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "46px", marginBottom: "12px" }}>{i}</div>
              <div style={{ fontSize: "9px", marginBottom: "12px", color: "var(--text-4)" }}>
                {l.toUpperCase()}
              </div>
              <div className="stat-num" style={{ fontSize: "48px", fontWeight: "900", color: c }}>
                {streaks[k]}
              </div>
            </div>
          ))}
        </Grid>
      )}

      {tab === "settings" && (
        <Grid cols="1fr 1fr">
          <div className="glass" style={{ ...d(0), padding: "24px" }}>
            <CardTitle icon="🕌">Prayer Times</CardTitle>
            {Object.entries(prayers).map(([name, t]) => (
              <div key={name} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-4)", marginBottom: "4px" }}>
                  {name.toUpperCase()}
                </div>
                <input
                  type="time"
                  value={t}
                  onChange={(e) => setPrayers((p) => ({ ...p, [name]: e.target.value }))}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>

          <div className="glass" style={{ ...d(1), padding: "24px" }}>
            <CardTitle icon="👤">Profile</CardTitle>
            <div style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.8 }}>
              <div>Mohammed Hassaan</div>
              <div>BTECH · MJCET</div>
              <div>Hyderabad, India</div>
            </div>
          </div>
        </Grid>
      )}
    </div>
  );
}
