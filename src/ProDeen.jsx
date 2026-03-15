import { useState, useEffect, useRef, memo, useCallback } from "react";

// ============================================
// ICONS (Inline SVG for zero dependencies)
// ============================================
const Icons = {
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  flame: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  sun: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  book: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  trendingUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  award: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
};

// ============================================
// STYLES
// ============================================
const STATIC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #060810;
  --bg-elevated: #0a0f1a;
  --accent: #00e5ff;
  --accent2: #7c3aed;
  --accent3: #34d399;
  --accent-dim: rgba(0,229,255,0.35);
  --border: rgba(0,229,255,0.14);
  --card-bg: rgba(10,15,30,0.75);
  --header-bg: rgba(6,8,20,0.95);
  --text-1: #e0f7ff;
  --text-2: #7dd3fc;
  --text-3: #94a3b8;
  --text-4: #475569;
  --prog-bg: rgba(255,255,255,0.06);
  --input-bg: rgba(10,15,30,0.90);
  --glow-c: 0,229,255;
  --success: #34d399;
  --warning: #fb923c;
  --danger: #f87171;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes textGlow {
  0%, 100% { text-shadow: 0 0 10px rgba(var(--glow-c),0.5), 0 0 20px rgba(var(--glow-c),0.3); }
  50% { text-shadow: 0 0 20px rgba(var(--glow-c),0.8), 0 0 40px rgba(var(--glow-c),0.5); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.glass {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  animation: fadeUp 0.5s ease-out both;
  transition: all 0.3s ease;
}

.glass:hover {
  border-color: rgba(0,229,255,0.3);
  box-shadow: 0 8px 32px rgba(var(--glow-c),0.15);
}

.glass-elevated {
  background: linear-gradient(135deg, rgba(10,15,30,0.9), rgba(6,10,20,0.85));
  border: 1px solid rgba(0,229,255,0.2);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}

.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-3);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.nav-btn:hover {
  color: var(--accent);
  background: rgba(0,229,255,0.08);
  border-color: var(--accent-dim);
}

.nav-btn.active {
  background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.1));
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(var(--glow-c),0.2);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none;
  color: #000;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--glow-c),0.4);
}

.btn-secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(0,229,255,0.1);
  border-color: var(--accent-dim);
}

.btn-icon {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--text-3);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(0,229,255,0.1);
  color: var(--accent);
  border-color: var(--accent);
}

input[type="time"], input[type="text"], input[type="number"] {
  background: var(--input-bg);
  border: 1px solid var(--border);
  color: var(--text-1);
  font-family: 'JetBrains Mono', monospace;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s ease;
}

input[type="time"]:focus, input[type="text"]:focus, input[type="number"]:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0,229,255,0.1);
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--prog-bg);
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,229,255,0.5);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(0,229,255,0.8);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(0,229,255,0.5);
}

.stat-num {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
}

.text-animate {
  animation: textGlow 3s ease-in-out infinite;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
}

.progress-bar {
  height: 8px;
  background: var(--prog-bg);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: rgba(255,255,255,0.03);
}

.checkbox:hover {
  border-color: var(--accent-dim);
}

.checkbox.checked {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--card-bg);
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-1);
  font-size: 13px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(var(--glow-c),0.2);
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .glass:hover, .card-hover:hover {
    transform: none;
  }

  .nav-btn {
    font-size: 10px;
    padding: 8px 12px;
  }

  .nav-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .nav-btn span {
    display: none;
  }

  .nav-btn {
    padding: 10px;
  }
}
`;

// ============================================
// ANIMATED BACKGROUND
// ============================================
const ParticleBg = memo(() => {
  const ref = useRef(null);
  const particlesRef = useRef([]);

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

    // Initialize particles
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let animId;
    const animate = () => {
      ctx.fillStyle = "#060810";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, "rgba(0,229,255,0.03)");
      gradient.addColorStop(0.5, "transparent");
      gradient.addColorStop(1, "rgba(124,58,237,0.02)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
const nowStr = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const getNextPrayer = (prayers) => {
  const now = toMin(nowStr());
  const prayerList = Object.entries(prayers).map(([name, time]) => ({
    name,
    time,
    minutes: toMin(time),
  }));

  const next = prayerList.find(p => p.minutes > now);
  return next || prayerList[0];
};

const getCurrentPrayer = (prayers) => {
  const now = toMin(nowStr());
  const prayerList = Object.entries(prayers).map(([name, time]) => ({
    name,
    time,
    minutes: toMin(time),
  }));

  for (let i = prayerList.length - 1; i >= 0; i--) {
    if (prayerList[i].minutes <= now) {
      return prayerList[i];
    }
  }
  return prayerList[prayerList.length - 1];
};

// ============================================
// COMPONENTS
// ============================================
const LiveClock = () => {
  const [time, setTime] = useState(nowStr());
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(nowStr());
      setDate(d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ textAlign: "right" }}>
      <div className="stat-num" style={{ fontSize: "28px", color: "var(--accent)", animation: "textGlow 2.5s ease-in-out infinite" }}>
        {time}
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>
        {date}
      </div>
    </div>
  );
};

const ProgressBar = ({ pct, color, showLabel }) => (
  <div style={{ marginTop: "8px" }}>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
    {showLabel && (
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "11px", color: "var(--text-3)" }}>
        <span>Progress</span>
        <span style={{ color, fontWeight: 600 }}>{pct}%</span>
      </div>
    )}
  </div>
);

const Card = ({ children, style, delay = 0, elevated }) => (
  <div className={elevated ? "glass-elevated card-hover" : "glass card-hover"} style={{
    padding: "24px",
    animationDelay: `${delay}ms`,
    ...style
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon, title, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>
      <span style={{ color: "var(--accent)" }}>{icon}</span>
      {title}
    </div>
    {action}
  </div>
);

const StatCard = ({ icon, label, value, subtext, color, delay }) => (
  <Card delay={delay} style={{ textAlign: "center" }}>
    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
    <div style={{ fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
      {label}
    </div>
    <div className="stat-num" style={{ fontSize: "36px", fontWeight: 900, color, marginBottom: "4px" }}>
      {value}
    </div>
    {subtext && <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{subtext}</div>}
  </Card>
);

const PrayerCard = ({ name, time, isCurrent, isNext, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      marginBottom: "8px",
      borderRadius: "12px",
      background: isCurrent ? "rgba(0,229,255,0.1)" : isNext ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${isCurrent ? "var(--accent)" : isNext ? "var(--accent2)" : "var(--border)"}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: isCurrent ? "var(--accent)" : isNext ? "var(--accent2)" : "var(--text-4)",
        boxShadow: isCurrent ? "0 0 10px var(--accent)" : isNext ? "0 0 10px var(--accent2)" : "none",
        animation: isCurrent ? "pulse 2s infinite" : "none",
      }} />
      <span style={{
        fontSize: "13px",
        fontWeight: 500,
        color: isCurrent ? "var(--accent)" : "var(--text-1)",
        textTransform: "capitalize",
      }}>
        {name}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-2)" }}>
        {time}
      </span>
      {isCurrent && <span style={{ fontSize: "10px", color: "var(--accent)", background: "rgba(0,229,255,0.15)", padding: "2px 8px", borderRadius: "4px" }}>NOW</span>}
      {isNext && <span style={{ fontSize: "10px", color: "var(--accent2)", background: "rgba(124,58,237,0.15)", padding: "2px 8px", borderRadius: "4px" }}>NEXT</span>}
    </div>
  </div>
);

const ScheduleItem = ({ time, icon, label, cat, isDone, onToggle }) => {
  const colors = { work: "#00e5ff", learn: "#34d399", health: "#fb923c", faith: "#7c3aed" };
  const labels = { work: "WORK", learn: "LEARN", health: "HEALTH", faith: "FAITH" };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 0",
      borderBottom: "1px solid var(--border)",
      opacity: isDone ? 0.6 : 1,
      transition: "opacity 0.2s ease",
    }}>
      <div
        className={`checkbox ${isDone ? "checked" : ""}`}
        onClick={onToggle}
        style={{
          flexShrink: 0,
          width: "22px",
          height: "22px",
          border: `2px solid ${isDone ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          background: isDone ? "var(--accent)" : "rgba(255,255,255,0.03)",
          color: "#000",
        }}
      >
        {isDone && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <span style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-1)",
            textDecoration: isDone ? "line-through" : "none",
          }}>
            {label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
          <span style={{ fontSize: "9px", color: colors[cat], border: `1px solid ${colors[cat]}50`, padding: "1px 6px", borderRadius: "4px" }}>
            {labels[cat]}
          </span>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({ goal, onUpdate, onDelete, delay }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newProgress, setNewProgress] = useState(goal.progress);

  const handleUpdate = () => {
    onUpdate(goal.id, newProgress);
    setIsEditing(false);
  };

  const incrementProgress = () => {
    const newVal = Math.min(100, goal.progress + 5);
    onUpdate(goal.id, newVal);
  };

  const decrementProgress = () => {
    const newVal = Math.max(0, goal.progress - 5);
    onUpdate(goal.id, newVal);
  };

  return (
    <Card delay={delay}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${goal.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}>
            {goal.icon}
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-1)", marginBottom: "2px" }}>{goal.label}</div>
            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>{goal.sub}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button className="btn-icon" onClick={() => setIsEditing(!isEditing)} title="Edit">{Icons.edit}</button>
          <button className="btn-icon" onClick={() => onDelete(goal.id)} style={{ color: "var(--danger)" }} title="Delete">{Icons.trash}</button>
        </div>
      </div>

      {isEditing ? (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="range"
            min="0"
            max="100"
            value={newProgress}
            onChange={(e) => setNewProgress(Number(e.target.value))}
            style={{ flex: 1, minWidth: "150px", accentColor: goal.color }}
          />
          <span style={{ fontSize: "14px", fontWeight: 600, color: goal.color, minWidth: "40px", textAlign: "center" }}>
            {newProgress}%
          </span>
          <button className="btn-primary" onClick={handleUpdate}>Save</button>
          <button className="btn-secondary" onClick={() => { setIsEditing(false); setNewProgress(goal.progress); }}>Cancel</button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Progress</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                className="btn-icon"
                onClick={decrementProgress}
                title="-5%"
                style={{ width: "28px", height: "28px" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span style={{ fontSize: "14px", fontWeight: 600, color: goal.color, minWidth: "36px", textAlign: "center" }}>
                {goal.progress}%
              </span>
              <button
                className="btn-icon"
                onClick={incrementProgress}
                title="+5%"
                style={{ width: "28px", height: "28px" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
          <ProgressBar pct={goal.progress} color={goal.color} />
        </div>
      )}
    </Card>
  );
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <div className="toast-icon">{Icons.check}</div>
      <span>{message}</span>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProDeen() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ icon: "🎯", label: "", sub: "", progress: 0, color: "#00e5ff" });

  // Load from localStorage or use defaults
  const [prayers, setPrayers] = useState(() => {
    const saved = localStorage.getItem("prodeen_prayers");
    return saved ? JSON.parse(saved) : {
      fajr: "05:00",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:00",
      isha: "19:30",
    };
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("prodeen_goals");
    return saved ? JSON.parse(saved) : [
      { id: 1, icon: "🧠", label: "Master Python", sub: "Advanced AI & ML", progress: 65, color: "#00e5ff" },
      { id: 2, icon: "📚", label: "Read Quran", sub: "Daily 30 minutes", progress: 78, color: "#34d399" },
      { id: 3, icon: "💪", label: "Fitness", sub: "Calisthenics & Cardio", progress: 52, color: "#fb923c" },
    ];
  });

  const [streaks, setStreaks] = useState(() => {
    const saved = localStorage.getItem("prodeen_streaks");
    return saved ? JSON.parse(saved) : {
      fajr: 23,
      quran: 47,
      python: 12,
      gym: 8,
    };
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem("prodeen_schedule");
    return saved ? JSON.parse(saved) : [
      { id: "1", time: "05:00", icon: "🌅", label: "Fajr Prayer", cat: "faith", done: false },
      { id: "2", time: "06:00", icon: "💪", label: "Morning Workout", cat: "health", done: false },
      { id: "3", time: "08:00", icon: "🍽️", label: "Breakfast", cat: "health", done: false },
      { id: "4", time: "09:00", icon: "💻", label: "Deep Work - Coding", cat: "work", done: false },
      { id: "5", time: "12:30", icon: "🕌", label: "Dhuhr Prayer", cat: "faith", done: false },
      { id: "6", time: "13:00", icon: "📖", label: "Quran Reading", cat: "faith", done: false },
      { id: "7", time: "15:45", icon: "🕌", label: "Asr Prayer", cat: "faith", done: false },
      { id: "8", time: "18:00", icon: "🕌", label: "Maghrib Prayer", cat: "faith", done: false },
      { id: "9", time: "19:30", icon: "🕌", label: "Isha Prayer", cat: "faith", done: false },
      { id: "10", time: "20:00", icon: "📚", label: "Study / Review", cat: "learn", done: false },
    ];
  });

  // Save to localStorage
  useEffect(() => { localStorage.setItem("prodeen_prayers", JSON.stringify(prayers)); }, [prayers]);
  useEffect(() => { localStorage.setItem("prodeen_goals", JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem("prodeen_streaks", JSON.stringify(streaks)); }, [streaks]);
  useEffect(() => { localStorage.setItem("prodeen_schedule", JSON.stringify(schedule)); }, [schedule]);

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById("cyber-css")) {
      const style = document.createElement("style");
      style.id = "cyber-css";
      style.textContent = STATIC_CSS;
      document.head.appendChild(style);
    }
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const updateGoalProgress = (id, progress) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress } : g));
    showToast("Goal progress updated!");
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    showToast("Goal deleted");
  };

  const addGoal = () => {
    if (!newGoal.label) return;
    setGoals([...goals, { ...newGoal, id: Date.now() }]);
    setNewGoal({ icon: "🎯", label: "", sub: "", progress: 0, color: "#00e5ff" });
    setShowAddGoal(false);
    showToast("New goal added!");
  };

  const toggleScheduleItem = (id) => {
    setSchedule(schedule.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const incrementStreak = (key) => {
    setStreaks({ ...streaks, [key]: streaks[key] + 1 });
    showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} streak increased!`);
  };

  const currentPrayer = getCurrentPrayer(prayers);
  const nextPrayer = getNextPrayer(prayers);
  const completedTasks = schedule.filter(s => s.done).length;
  const totalTasks = schedule.length;

  const d = (i) => ({ animationDelay: `${i * 80}ms` });

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Inter', 'JetBrains Mono', sans-serif",
      color: "var(--text-3)",
      background: "var(--bg)",
      position: "relative",
    }}>
      <ParticleBg />

      {/* HEADER */}
      <header style={{
        position: "relative",
        zIndex: 10,
        background: "var(--header-bg)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        padding: "20px 24px",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 8px 24px rgba(0,229,255,0.3)",
            }}>
              ⚡
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "var(--accent)",
                  letterSpacing: "2px",
                }}>PRO</span>
                <span style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "var(--accent2)",
                  letterSpacing: "2px",
                }}>DEEN</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                Productivity & Faith Dashboard
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>Mohammed Hassaan</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)" }}>B.Tech · MJCET · Hyderabad</div>
            </div>
            <LiveClock />
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav style={{
        position: "relative",
        zIndex: 10,
        background: "var(--header-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", gap: "8px" }}>
          {[
            ["dashboard", Icons.home, "Dashboard"],
            ["schedule", Icons.calendar, "Schedule"],
            ["goals", Icons.target, "Goals"],
            ["streaks", Icons.flame, "Streaks"],
            ["settings", Icons.settings, "Settings"],
          ].map(([k, ic, l]) => (
            <button
              key={k}
              className={`nav-btn ${tab === k ? "active" : ""}`}
              onClick={() => setTab(k)}
            >
              {ic}
              <span>{l}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ position: "relative", zIndex: 10, padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {/* Welcome Card */}
            <Card delay={0} elevated style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--accent)", marginBottom: "8px", fontWeight: 500 }}>Welcome back</div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-1)", marginBottom: "8px" }}>
                    {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"}, Mohammed
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-3)" }}>
                    You have completed {completedTasks}/{totalTasks} tasks today. Keep going!
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(0,229,255,0.1)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)" }}>{completedTasks}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase" }}>Done</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(124,58,237,0.1)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent2)" }}>{totalTasks - completedTasks}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase" }}>Left</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Prayer Times */}
            <Card delay={100}>
              <CardHeader icon={Icons.moon} title="Prayer Times" />
              {Object.entries(prayers).map(([name, time]) => (
                <PrayerCard
                  key={name}
                  name={name}
                  time={time}
                  isCurrent={name === currentPrayer?.name}
                  isNext={name === nextPrayer?.name}
                />
              ))}
            </Card>

            {/* Today's Schedule */}
            <Card delay={200}>
              <CardHeader
                icon={Icons.calendar}
                title="Today's Schedule"
                action={<button className="btn-secondary" onClick={() => setTab("schedule")}>View All</button>}
              />
              {schedule.slice(0, 5).map((task) => (
                <ScheduleItem
                  key={task.id}
                  {...task}
                  onToggle={() => toggleScheduleItem(task.id)}
                />
              ))}
            </Card>

            {/* Active Goals */}
            <Card delay={300}>
              <CardHeader
                icon={Icons.target}
                title="Active Goals"
                action={<button className="btn-secondary" onClick={() => setTab("goals")}>Manage</button>}
              />
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{goal.icon}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)" }}>{goal.label}</span>
                    </div>
                    <span style={{ fontSize: "12px", color: goal.color, fontWeight: 600 }}>{goal.progress}%</span>
                  </div>
                  <ProgressBar pct={goal.progress} color={goal.color} />
                </div>
              ))}
            </Card>

            {/* Quick Stats */}
            <Card delay={400}>
              <CardHeader icon={Icons.activity} title="Quick Stats" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🔥</div>
                  <div className="stat-num" style={{ fontSize: "24px", color: "var(--warning)", marginBottom: "2px" }}>{streaks.gym}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)" }}>Gym Streak</div>
                </div>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>📖</div>
                  <div className="stat-num" style={{ fontSize: "24px", color: "var(--accent3)", marginBottom: "2px" }}>{streaks.quran}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)" }}>Quran Streak</div>
                </div>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🌅</div>
                  <div className="stat-num" style={{ fontSize: "24px", color: "var(--accent)", marginBottom: "2px" }}>{streaks.fajr}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)" }}>Fajr Streak</div>
                </div>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🐍</div>
                  <div className="stat-num" style={{ fontSize: "24px", color: "var(--accent2)", marginBottom: "2px" }}>{streaks.python}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)" }}>Code Streak</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Card delay={0} elevated>
              <CardHeader icon={Icons.calendar} title="Daily Schedule" />
              <div style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(0,229,255,0.05)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-3)" }}>Progress</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>{Math.round((completedTasks / totalTasks) * 100)}%</span>
                </div>
                <div className="progress-bar" style={{ marginTop: "8px" }}>
                  <div className="progress-fill" style={{ width: `${(completedTasks / totalTasks) * 100}%`, background: "var(--accent)" }} />
                </div>
              </div>
              {schedule.map((task) => (
                <ScheduleItem
                  key={task.id}
                  {...task}
                  onToggle={() => toggleScheduleItem(task.id)}
                />
              ))}
            </Card>
          </div>
        )}

        {/* GOALS TAB */}
        {tab === "goals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-1)", marginBottom: "4px" }}>Your Goals</div>
                <div style={{ fontSize: "14px", color: "var(--text-3)" }}>Track your progress and achieve more</div>
              </div>
              <button className="btn-primary" onClick={() => setShowAddGoal(!showAddGoal)}>
                {Icons.plus} Add Goal
              </button>
            </div>

            {showAddGoal && (
              <Card delay={0} style={{ marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="Goal name..."
                    value={newGoal.label}
                    onChange={(e) => setNewGoal({...newGoal, label: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Description..."
                    value={newGoal.sub}
                    onChange={(e) => setNewGoal({...newGoal, sub: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Progress %"
                    min="0"
                    max="100"
                    value={newGoal.progress}
                    onChange={(e) => setNewGoal({...newGoal, progress: Number(e.target.value)})}
                  />
                  <select
                    value={newGoal.color}
                    onChange={(e) => setNewGoal({...newGoal, color: e.target.value})}
                    style={{
                      background: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-1)",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                    }}
                  >
                    <option value="#00e5ff">Cyan (Tech)</option>
                    <option value="#34d399">Green (Health)</option>
                    <option value="#fb923c">Orange (Fitness)</option>
                    <option value="#7c3aed">Purple (Faith)</option>
                    <option value="#f87171">Red (Urgent)</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-primary" onClick={addGoal}>Create Goal</button>
                  <button className="btn-secondary" onClick={() => setShowAddGoal(false)}>Cancel</button>
                </div>
              </Card>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {goals.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={updateGoalProgress}
                  onDelete={deleteGoal}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>
        )}

        {/* STREAKS TAB */}
        {tab === "streaks" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-1)", marginBottom: "8px" }}>Your Streaks</div>
              <div style={{ fontSize: "14px", color: "var(--text-3)" }}>Build habits, one day at a time</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              {[
                { k: "fajr", l: "Fajr Prayer", i: "🌅", c: "#38bdf8", desc: "Start your day with blessings" },
                { k: "quran", l: "Quran Reading", i: "📖", c: "#34d399", desc: "Daily spiritual nourishment" },
                { k: "python", l: "Python Study", i: "🐍", c: "#00e5ff", desc: "Master the language of AI" },
                { k: "gym", l: "Gym Workout", i: "💪", c: "#fb923c", desc: "Build strength and discipline" },
              ].map(({ k, l, i, c, desc }, idx) => (
                <Card key={k} delay={idx * 80} style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${c}, transparent)`
                  }} />
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>{i}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-1)", marginBottom: "4px" }}>{l}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "16px" }}>{desc}</div>
                  <div className="stat-num" style={{ fontSize: "48px", fontWeight: 900, color: c, marginBottom: "16px" }}>
                    {streaks[k]}
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button className="btn-icon" onClick={() => incrementStreak(k)} title="+1 Day">
                      {Icons.plus}
                    </button>
                    <button className="btn-icon" onClick={() => { setStreaks({...streaks, [k]: Math.max(0, streaks[k] - 1)}); }} title="-1 Day">
                      {Icons.minus}
                    </button>
                  </div>
                  <div style={{ marginTop: "16px", padding: "8px 16px", background: `${c}15`, borderRadius: "20px", display: "inline-block" }}>
                    <span style={{ fontSize: "12px", color: c, fontWeight: 500 }}>🔥 {streaks[k]} day streak</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Card delay={0} elevated>
              <CardHeader icon={Icons.moon} title="Prayer Times" />
              <div style={{ marginBottom: "8px" }}>
                {Object.entries(prayers).map(([name, time]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-1)", textTransform: "capitalize" }}>{name}</span>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setPrayers({ ...prayers, [name]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card delay={100} style={{ marginTop: "20px" }}>
              <CardHeader icon={Icons.user} title="Profile Information" />
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Name</label>
                  <input type="text" value="Mohammed Hassaan" readOnly style={{ width: "100%", opacity: 0.7 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Education</label>
                  <input type="text" value="B.Tech - MJCET Hyderabad" readOnly style={{ width: "100%", opacity: 0.7 }} />
                </div>
              </div>
            </Card>

            <Card delay={200} style={{ marginTop: "20px" }}>
              <CardHeader icon={Icons.activity} title="Data Management" />
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (confirm("Reset all data to defaults?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                >
                  Reset All Data
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const data = JSON.stringify({ prayers, goals, streaks, schedule });
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "prodeen-backup.json";
                    a.click();
                    showToast("Data exported!");
                  }}
                >
                  Export Data
                </button>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
