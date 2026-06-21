import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard, MessageSquare, AlertTriangle, Clock, BookOpen,
  BarChart3, Settings, Search, Bell, ChevronRight, ChevronDown,
  Activity, FileText, Wrench, CheckCircle2, XCircle, AlertCircle,
  CalendarClock, Cpu, Send, Bot, Loader2, Filter, Database, Shield,
  Users, Zap, Plus, TrendingUp, TrendingDown, X, Download, Factory,
  CheckCheck, Thermometer, Package, Eye, Layers, Globe, Sliders,
  BookMarked, Network, Gauge, RefreshCw, ArrowRight, List, Grid3X3,
  MapPin, MoreHorizontal, ChevronLeft, Play, Star, Flame, Info, Mail,
  GitBranch, Link2, MessageCircle, Radio, Wifi,
  BarChart2, FileBarChart, Lightbulb, AlertOctagon, ClipboardList,
  Timer, ArrowUpRight, ArrowDownRight,
  ChevronUp, ExternalLink, Clock3, Hash, Tag
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ── Palette ────────────────────────────────────────────────────────────────
const P = {
  bg:       "#0B0F14",
  card:     "#1A2430",
  elevated: "#2F435A",
  muted:    "#78899A",
  fg:       "#E4E9EE",
  accent:   "#4D87A8",
  accentSub:"rgba(77,135,168,0.12)",
  border:   "rgba(120,137,154,0.15)",
  success:  "#5A8A6E",
  warning:  "#C4973A",
  danger:   "#C0392B",
};

type NavPage = "Dashboard"|"Digital Twin"|"Ask EchoTwin"|"Incident Memory"|"Timeline"|"Manual Explorer"|"Analytics"|"Reports"|"Settings";

// ── Loading Hook ───────────────────────────────────────────────────────────
function useLoading(ms = 1100) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), ms); return () => clearTimeout(t); }, [ms]);
  return loading;
}

// ── Shared Components ──────────────────────────────────────────────────────
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`rounded-2xl border ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ background: P.card, borderColor: P.border }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: P.muted }}>{children}</div>;
}

function Badge({ label, v = "neutral" }: { label: string; v?: "neutral"|"success"|"warn"|"danger"|"info" }) {
  const c = { neutral:[P.elevated,P.muted], success:["rgba(90,138,110,0.15)",P.success], warn:["rgba(196,151,58,0.15)",P.warning], danger:["rgba(192,57,43,0.15)",P.danger], info:[P.accentSub,P.accent] }[v];
  return <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider" style={{ background: c[0], color: c[1] }}>{label}</span>;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: P.elevated }} />;
}

function PulseIndicator({ color = P.success, size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: color }} />
      <span className="relative rounded-full" style={{ width: size, height: size, background: color }} />
    </span>
  );
}

function TrendArrow({ value, suffix = "" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const color = up ? P.success : P.danger;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color }}>
      <Icon size={11} />{up ? "+" : ""}{value}{suffix}
    </span>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 80 ? P.success : score >= 60 ? P.warning : P.danger;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${color}22`, color }}>
      <span className="w-1 h-1 rounded-full" style={{ background: color }} />{score}% confidence
    </span>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0,1,2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: P.accent, animationDelay:`${i*120}ms`, animationDuration:"0.9s" }} />
      ))}
    </div>
  );
}

const TOOLTIP_STYLE = { background: P.card, border: `1px solid ${P.border}`, borderRadius: "10px", fontSize: "11px", color: P.fg, boxShadow:"0 4px 20px rgba(0,0,0,0.3)" };

// ── Dashboard ──────────────────────────────────────────────────────────────
const healthData = [
  { t:"00:00", vib:4.2, temp:62 }, { t:"04:00", vib:5.1, temp:65 },
  { t:"08:00", vib:7.8, temp:70 }, { t:"10:00", vib:9.1, temp:73 },
  { t:"12:00", vib:10.4, temp:76 }, { t:"14:00", vib:11.9, temp:78 },
  { t:"16:00", vib:12.4, temp:79 }, { t:"18:00", vib:13.1, temp:81 },
  { t:"19:55", vib:14.8, temp:84 },
];

const KPIS = [
  { label:"Active Machines", value:"142", sub:"of 148 total", trend:2.1, color:P.success, icon:Factory },
  { label:"Incidents This Week", value:"17", sub:"vs 23 last week", trend:-26.1, color:P.danger, icon:AlertTriangle, suffix:"%" },
  { label:"Mean Time Between Failures", value:"312 h", sub:"90-day rolling avg", trend:6.1, color:P.accent, icon:Timer },
  { label:"Predicted Risk Score", value:"6.4", sub:"3 machines at high risk", trend:0, color:P.warning, icon:Gauge },
];

const TIMELINE_EVENTS = [
  { t:"08:12", e:"Bearing replacement", m:"CNC-04", type:"ok", desc:"Drive-end bearing SKF 6310 replaced per PM. Torque verified at 85 Nm." },
  { t:"11:47", e:"Temperature rise", m:"Pump-12", type:"warn", desc:"Coolant temp exceeded 78°C threshold. Operator notified." },
  { t:"14:03", e:"Vibration anomaly", m:"Compressor-07", type:"warn", desc:"Axial vibration 12.4 mm/s — above ISO 10816 Zone C." },
  { t:"16:30", e:"Lubrication warning", m:"CNC-04", type:"warn", desc:"Grease level sensor: refill required within 48 h." },
  { t:"19:55", e:"Failure event", m:"Compressor-07", type:"fail", desc:"Motor tripped on overcurrent. Production halted." },
];

const CAUSES = [
  { label:"Shaft misalignment", pct:85 }, { label:"Bearing defect", pct:72 },
  { label:"Loose mounting bolts", pct:58 }, { label:"Lubrication issue", pct:31 },
];

const KNOWLEDGE = [
  { type:"Maintenance Log", title:"Compressor-07 Service Record — Feb 2024", snippet:"Vibration 9.1 mm/s. Tech D. Reyes flagged bearing play. Overhaul 420 h ago.", score:94, src:"CMMS / SAP PM" },
  { type:"OEM Manual", title:"Atlas Copco GA-55 §6.4 Alignment Tolerances", snippet:"Shaft tolerance ±0.05 mm radial, ±0.02 mm angular. Misalignment causes bearing wear.", score:91, src:"Manual Explorer" },
  { type:"Technician Note", title:"Field Note — R. Obasi, 2024-02-28", snippet:"Low-frequency hum on CMP-07 during start-up. Coupling wear suspected.", score:87, src:"Incident Memory" },
  { type:"SOP", title:"SOP-MAINT-041: Rotating Equipment Alignment", snippet:"Perform laser alignment after coupling replacement or vibration exceeds Zone B.", score:82, src:"Document Library" },
];

const INCIDENTS_TABLE = [
  { id:"CMP-07", issue:"Shaft misalignment / bearing wear", sev:"Critical", status:"Open", rec:"Immediate laser alignment + bearing replacement" },
  { id:"PMP-12", issue:"Coolant temperature exceedance", sev:"High", status:"In Progress", rec:"Inspect heat exchanger fouling" },
  { id:"CNC-04", issue:"Lubrication level low", sev:"Medium", status:"Scheduled", rec:"Grease replenishment within 48 h" },
  { id:"CVY-03", issue:"Belt tension anomaly", sev:"Low", status:"Monitoring", rec:"Tension check at next PM window" },
  { id:"HYD-09", issue:"Pressure fluctuation", sev:"Medium", status:"Open", rec:"Inspect relief valve and accumulator" },
];

const ACTIONS = [
  { icon: CalendarClock, title:"Alignment inspection", freq:"Every 30 days", m:"All rotating equipment" },
  { icon: Activity, title:"Weekly vibration checks", freq:"Every 7 days", m:"Compressor-07, CMP-02" },
  { icon: Wrench, title:"Lubrication schedule", freq:"Every 14 days", m:"CNC-04, CNC-08" },
  { icon: Cpu, title:"Bearing replacement", freq:"At 500 h runtime", m:"Compressor-07" },
];

function Dashboard() {
  const loading = useLoading();
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 space-y-5 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: P.fg }}>Operations Dashboard</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <PulseIndicator color={P.success} size={6} />
              <p className="text-xs" style={{ color: P.muted }}>Brno Facility 2 · Live monitoring · Updated 19:58 UTC</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs" style={{ background: P.elevated, color: P.muted }}>
              <RefreshCw size={11} /> Refresh
            </button>
            <span className="text-[10px]" style={{ color: P.muted }}>Last sync 2 min ago</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {KPIS.map(k => {
            const Icon = k.icon;
            return (
              <Card key={k.label} className="p-5 hover:border-[#4D87A8]/25 transition-colors group">
                {loading ? (
                  <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-16" /><Skeleton className="h-3 w-32" /></div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <SectionLabel>{k.label}</SectionLabel>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity" style={{ background: P.elevated }}>
                        <Icon size={13} style={{ color: k.color }} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</div>
                    <div className="text-[11px] mt-1" style={{ color: P.muted }}>{k.sub}</div>
                    <div className="mt-3">
                      {k.trend !== 0 ? <TrendArrow value={k.trend} suffix={k.suffix} /> : <span className="text-[11px]" style={{ color: P.muted }}>— Stable</span>}
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>

        {/* Timeline + Root Cause */}
        <div className="grid grid-cols-[1fr_320px] gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Failure Timeline · Compressor-07 · 2024-03-14</SectionLabel>
              <span className="text-[10px]" style={{ color: P.muted }}>Brno F2</span>
            </div>
            {loading ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="flex gap-4"><Skeleton className="w-3 h-3 rounded-full" /><div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-48" /><Skeleton className="h-2.5 w-64" /></div></div>)}</div>
            ) : (
              <div className="relative pl-5">
                <div className="absolute left-[6px] top-0 bottom-0 w-px" style={{ background: P.border }} />
                <div className="space-y-5">
                  {TIMELINE_EVENTS.map((ev, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="absolute left-0 mt-0.5 z-10" style={{ background: P.card }}>
                        {ev.type==="ok" ? <CheckCircle2 size={13} style={{ color: P.success }} /> : ev.type==="fail" ? <XCircle size={13} style={{ color: P.danger }} /> : <AlertCircle size={13} style={{ color: P.warning }} />}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: P.fg }}>{ev.e}</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: P.elevated, color: P.muted }}>{ev.m}</span>
                          <span className="text-[11px]" style={{ color: P.muted }}>{ev.t}</span>
                        </div>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: P.muted }}>{ev.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>AI Root Cause Analysis</SectionLabel>
              <ConfidenceBadge score={87} />
            </div>
            <p className="text-[11px] mb-5" style={{ color: P.muted }}>Compressor-07 · Updated 19:56</p>
            {loading ? (
              <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="space-y-1.5"><Skeleton className="h-3 w-full" /><Skeleton className="h-1.5 w-full" /></div>)}</div>
            ) : (
              <div className="space-y-4 flex-1">
                {CAUSES.map(c => {
                  const col = c.pct>80 ? P.danger : c.pct>60 ? P.warning : P.muted;
                  return (
                    <div key={c.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium" style={{ color: P.fg }}>{c.label}</span>
                        <span className="text-xs font-bold tabular-nums" style={{ color: col }}>{c.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: P.elevated }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${c.pct}%` }} transition={{ duration:0.8, delay:0.2, ease:"easeOut" }}
                          className="h-full rounded-full" style={{ background: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-5 pt-4 text-[11px] flex items-center gap-1.5" style={{ color: P.muted, borderTop:`1px solid ${P.border}` }}>
              <Info size={11} />Based on 312 h telemetry · 47 records retrieved
            </div>
          </Card>
        </div>

        {/* Knowledge Retrieval */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>Knowledge Retrieval · 4 documents retrieved</SectionLabel>
            <button className="text-[11px] flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: P.accent }}>View all <ChevronRight size={11} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-20" />) :
            KNOWLEDGE.map((k, i) => (
              <div key={i} className="rounded-xl p-4 border cursor-pointer hover:border-[#4D87A8]/30 transition-all group" style={{ border:`1px solid ${P.border}`, background: P.bg }}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: P.elevated }}>
                    <FileText size={12} style={{ color: P.muted }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SectionLabel>{k.type}</SectionLabel>
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: k.score>=90 ? "rgba(90,138,110,0.15)" : P.elevated, color: k.score>=90 ? P.success : P.muted }}>{k.score}% match</span>
                    </div>
                    <div className="text-[11px] font-semibold mb-1" style={{ color: P.fg }}>{k.title}</div>
                    <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: P.muted }}>{k.snippet}</p>
                    <div className="text-[10px] mt-2 uppercase tracking-wider" style={{ color: P.muted }}>{k.src}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart + Actions */}
        <div className="grid grid-cols-[1fr_300px] gap-4">
          <Card className="p-6">
            <SectionLabel>Machine Health · Compressor-07 · 2024-03-14</SectionLabel>
            <div className="flex gap-4 mt-2 mb-5">
              {[["#4D87A8","Vibration (mm/s)","Zone C: 11.2"],["#C0392B","Temperature (°C)","Threshold: 78°C"]].map(([c,l,sub])=>(
                <div key={l} className="flex items-center gap-1.5">
                  <span className="w-5 h-0.5 rounded-full" style={{ background: c as string }} />
                  <div>
                    <div className="text-[11px]" style={{ color: P.muted }}>{l}</div>
                    <div className="text-[10px]" style={{ color: P.muted }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={healthData} margin={{ top:4, right:4, left:-24, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                <ReferenceLine y={11.2} stroke={P.danger} strokeDasharray="4 3" strokeOpacity={0.5} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line id="dash-vib" type="monotone" dataKey="vib" stroke="#4D87A8" strokeWidth={2} dot={false} activeDot={{ r:3, fill:"#4D87A8" }} />
                <Line id="dash-temp" type="monotone" dataKey="temp" stroke="#C0392B" strokeWidth={2} dot={false} activeDot={{ r:3, fill:"#C0392B" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 flex flex-col">
            <SectionLabel>AI Preventive Actions</SectionLabel>
            <div className="space-y-3 mt-5 flex-1">
              {ACTIONS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border hover:border-[#4D87A8]/30 transition-colors group" style={{ border:`1px solid ${P.border}`, background: P.bg }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: P.accentSub }}>
                      <Icon size={14} style={{ color: P.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold" style={{ color: P.fg }}>{a.title}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: P.muted }}>{a.freq} · {a.m}</div>
                    </div>
                    <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: P.muted }} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${P.border}` }}>
            <div className="flex items-center gap-3">
              <SectionLabel>Recent Incidents</SectionLabel>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(192,57,43,0.15)", color: P.danger }}>2 open</span>
            </div>
            <button className="text-[11px] flex items-center gap-1 hover:opacity-80" style={{ color: P.accent }}>Full report <ChevronRight size={11} /></button>
          </div>
          <table className="w-full text-xs">
            <thead><tr style={{ borderBottom:`1px solid ${P.border}` }}>
              {["Machine","Issue","Severity","Status","Recommendation"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-semibold" style={{ color: P.muted }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {INCIDENTS_TABLE.map((r, i) => {
                const sv = r.sev==="Critical"?"danger":r.sev==="High"?"warn":r.sev==="Medium"?"info":"neutral";
                const st = r.status==="Open"?"danger":r.status==="In Progress"?"info":r.status==="Scheduled"?"success":"neutral";
                return (
                  <tr key={i} className="hover:bg-[#1A2430]/80 transition-colors cursor-pointer" style={{ borderBottom: i<INCIDENTS_TABLE.length-1?`1px solid ${P.border}`:undefined }}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.sev==="Critical" && <PulseIndicator color={P.danger} size={6} />}
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: P.elevated, color: P.fg }}>{r.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5" style={{ color: P.fg }}>{r.issue}</td>
                    <td className="px-6 py-3.5"><Badge label={r.sev} v={sv as any} /></td>
                    <td className="px-6 py-3.5"><Badge label={r.status} v={st as any} /></td>
                    <td className="px-6 py-3.5 max-w-[220px] truncate" style={{ color: P.muted }}>{r.rec}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ── Digital Twin ───────────────────────────────────────────────────────────
const DT_MACHINES = [
  { id:"CMP-07", name:"Compressor 07", status:"critical", vib:12.4, temp:84, pressure:145, rul:12, riskPct:89, hours:4821, lastPM:"2024-03-06" },
  { id:"PMP-12", name:"Pump 12", status:"warning", vib:4.1, temp:78, pressure:8.2, rul:45, riskPct:62, hours:2310, lastPM:"2024-02-20" },
  { id:"CNC-04", name:"CNC Machine 04", status:"ok", vib:2.8, temp:52, pressure:null, rul:180, riskPct:18, hours:3104, lastPM:"2024-03-01" },
  { id:"CVY-03", name:"Conveyor 03", status:"ok", vib:1.2, temp:38, pressure:null, rul:290, riskPct:8, hours:1890, lastPM:"2024-02-15" },
  { id:"HYD-09", name:"Hydraulic Unit 09", status:"warning", vib:3.4, temp:61, pressure:142, rul:67, riskPct:45, hours:5204, lastPM:"2024-01-28" },
  { id:"CMP-02", name:"Compressor 02", status:"ok", vib:5.9, temp:68, pressure:138, rul:155, riskPct:24, hours:3890, lastPM:"2024-02-28" },
];

const RUL_HISTORY: Record<string, { i: number; v: number }[]> = {
  "CMP-07": [200,180,155,120,90,60,30,12].map((v,i)=>({i,v})),
  "PMP-12": [200,195,185,165,140,110,80,45].map((v,i)=>({i,v})),
  "CNC-04": [200,200,198,195,192,188,185,180].map((v,i)=>({i,v})),
};

function DigitalTwin() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string|null>(null);
  const loading = useLoading(900);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 2500);
    return () => clearInterval(interval);
  }, []);

  const jitter = (base: number, scale = 0.03) =>
    (base * (1 + Math.sin(tick * 1.7 + base) * scale)).toFixed(1);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 space-y-5 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: P.fg }}>Digital Twin</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <PulseIndicator color={P.accent} size={6} />
              <p className="text-xs" style={{ color: P.muted }}>Live sensor feed · 6 machines monitored · Brno Facility 2</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: P.muted }}>
            <Radio size={11} className="animate-pulse" style={{ color: P.accent }} /> Streaming at 1 Hz
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-2xl border" style={{ background: P.card, borderColor: P.border }}>
          {[
            { label:"Running", count:4, color:P.success },
            { label:"Warning", count:2, color:P.warning },
            { label:"Critical", count:1, color:P.danger },
            { label:"Offline", count:0, color:P.muted },
          ].map((s, si) => (
            <div key={s.label} className="flex items-center gap-2 pr-4" style={{ borderRight: si < 3 ? `1px solid ${P.border}` : undefined }}>
              <PulseIndicator color={s.color} size={7} />
              <div>
                <div className="text-base font-bold tabular-nums" style={{ color: s.color }}>{s.count}</div>
                <div className="text-[10px]" style={{ color: P.muted }}>{s.label}</div>
              </div>
            </div>
          ))}
          <div className="ml-auto text-xs flex items-center gap-2" style={{ color: P.muted }}>
            <Wifi size={11} /> Live · {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {DT_MACHINES.map(m => {
            const statusColor = m.status==="critical" ? P.danger : m.status==="warning" ? P.warning : P.success;
            const isSelected = selected === m.id;
            const vibLive = parseFloat(jitter(m.vib));
            const tempLive = parseFloat(jitter(m.temp, 0.01));
            const rulColor = m.rul < 24 ? P.danger : m.rul < 100 ? P.warning : P.success;

            return (
              <Card key={m.id} onClick={() => setSelected(isSelected ? null : m.id)}
                className={`p-5 cursor-pointer transition-all hover:border-[#4D87A8]/30 ${isSelected ? "!border-[#4D87A8]/50" : ""}`}>
                {loading ? (
                  <div className="space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-20" /><Skeleton className="h-1.5 w-full" /></div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <PulseIndicator color={statusColor} size={7} />
                          <span className="font-mono text-[10px] font-bold" style={{ color: P.muted }}>{m.id}</span>
                        </div>
                        <div className="text-sm font-bold" style={{ color: P.fg }}>{m.name}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: P.muted }}>{m.hours.toLocaleString()} h · PM: {m.lastPM}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded capitalize" style={{ background:`${statusColor}22`, color: statusColor }}>{m.status}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { label:"Vibration", value: String(vibLive), unit:"mm/s", alert: vibLive > 10 },
                        { label:"Temp", value: String(tempLive), unit:"°C", alert: tempLive > 80 },
                        { label: m.pressure !== null ? "Pressure" : "Load", value: m.pressure !== null ? String(m.pressure) : "—", unit: m.pressure !== null ? "bar" : "", alert: false },
                      ].map((s, si) => (
                        <div key={si} className="p-2.5 rounded-xl text-center" style={{ background: P.bg }}>
                          <div className="text-[10px] mb-1" style={{ color: P.muted }}>{s.label}</div>
                          <motion.div key={`${si}-${tick}`} initial={{ scale:1.06 }} animate={{ scale:1 }} transition={{ duration:0.3 }}
                            className="text-sm font-bold tabular-nums" style={{ color: s.alert ? P.danger : P.success }}>
                            {s.value}
                          </motion.div>
                          <div className="text-[9px]" style={{ color: P.muted }}>{s.unit}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between mb-1.5 text-[11px]">
                        <span style={{ color: P.muted }}>Risk Score</span>
                        <span className="font-bold" style={{ color: m.riskPct>70?P.danger:m.riskPct>40?P.warning:P.success }}>{m.riskPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: P.elevated }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${m.riskPct}%` }} transition={{ duration:0.8, ease:"easeOut" }}
                          className="h-full rounded-full" style={{ background: m.riskPct>70?P.danger:m.riskPct>40?P.warning:P.success }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl" style={{ background: P.bg }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-medium" style={{ color: P.muted }}>Remaining Useful Life</span>
                        <span className="text-xs font-bold" style={{ color: rulColor }}>{m.rul} h</span>
                      </div>
                      {m.rul < 48 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px]" style={{ color: P.danger }}>
                          <AlertOctagon size={10} /> Action required within {m.rul}h
                        </div>
                      )}
                    </div>

                    {isSelected && RUL_HISTORY[m.id] && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.2 }} className="mt-3 overflow-hidden">
                        <div className="text-[10px] mb-2" style={{ color: P.muted }}>RUL Trend (last 8 periods)</div>
                        <ResponsiveContainer width="100%" height={60}>
                          <AreaChart data={RUL_HISTORY[m.id]} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                            <Area id={`rul-${m.id}`} type="monotone" dataKey="v" stroke={rulColor} fill={`${rulColor}22`} strokeWidth={1.5} dot={false} />
                            <YAxis tick={false} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    )}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Ask EchoTwin ───────────────────────────────────────────────────────────
const CONVERSATIONS = [
  { id:1, title:"Compressor-07 vibration after bearing replacement", time:"19:55", active:true },
  { id:2, title:"Pump-12 temperature exceedance root cause", time:"14:30", active:false },
  { id:3, title:"CNC-04 lubrication schedule optimization", time:"Yesterday", active:false },
  { id:4, title:"MTBF degradation trend — Brno Facility", time:"Mon", active:false },
  { id:5, title:"Hydraulic pressure fluctuations HYD-09", time:"Mon", active:false },
];

const AI_SECTIONS = [
  { id:"symptoms", title:"Symptoms Detected", icon:Activity, type:"bullets" as const,
    items:["Axial vibration spike to 12.4 mm/s — exceeds ISO 10816 Zone C","Bearing temperature elevated to 84°C within 4h of replacement","Low-frequency resonance at 43 Hz on drive-end bearing","Oil discoloration in post-replacement lubricant sample"] },
  { id:"causes", title:"Root Causes", icon:Layers, type:"ranked" as const,
    items:[{ l:"Improper bearing pre-load during installation", p:89 },{ l:"Shaft misalignment post-reassembly", p:76 },{ l:"Structural resonance at mounting frequency", p:52 },{ l:"Lubricant contamination during replacement", p:38 }] },
  { id:"confidence", title:"Confidence Score", icon:Gauge, type:"score" as const, score:87, sub:"Based on 47 records · 312 h of telemetry · 4 similar incidents" },
  { id:"actions", title:"Recommended Actions", icon:CheckCheck, type:"numbered" as const,
    items:["Perform laser shaft alignment check before returning to service","Inspect bearing pre-load and seating tolerance (±0.05 mm radial)","Flush and replace lubricant with OEM Kluber Isoflex NBU 15","Run resonance frequency sweep test at 20-80 Hz","Monitor vibration for 72 h at reduced load (≤60%)"] },
  { id:"sources", title:"Sources & Citations", icon:BookMarked, type:"sources" as const,
    items:[{ title:"Compressor-07 Service Record", src:"CMMS / SAP PM", s:94, detail:"420 h since last overhaul. Bearing play noted by D. Reyes. Vibration 9.1 mm/s at last check." },{ title:"Atlas Copco GA-55 Manual §6.4", src:"Manual Explorer", s:91, detail:"Section 6.4 covers shaft alignment tolerances: ±0.05 mm radial, ±0.02 mm angular." },{ title:"Field Note — R. Obasi, 2024-02-28", src:"Incident Memory", s:87, detail:"Low-freq hum during start-up. Coupling wear suspected. Laser alignment recommended." },{ title:"SOP-MAINT-041", src:"Document Library", s:82, detail:"Laser alignment required after any coupling replacement per ISO 10816." }] },
];

const AGENTS_DATA = [
  { name:"Incident Agent", desc:"Searching incident logs", taskOrder:0, latency:"0.8s", logs:["Querying SAP PM database","Found 47 related incidents","Ranked by similarity score"], depends:[] as string[], resourcePct:45 },
  { name:"Memory Agent", desc:"Retrieving similar failures", taskOrder:1, latency:"1.2s", logs:["Cross-referencing failure patterns","Loading 6 historical incidents","Computing embeddings"], depends:["Incident Agent"], resourcePct:62 },
  { name:"Root Cause Agent", desc:"Analyzing causal chains", taskOrder:2, latency:"2.1s", logs:["Building causal graph","Ranking root causes by probability","Verified against 12 case studies"], depends:["Memory Agent"], resourcePct:78 },
  { name:"Manual Agent", desc:"Parsing OEM documentation", taskOrder:2, latency:"1.5s", logs:["Indexing 248-page manual","Extracting §6.4 procedures","Retrieving tolerance specs"], depends:["Memory Agent"], resourcePct:55 },
  { name:"Parts Agent", desc:"Checking parts availability", taskOrder:3, latency:"0.6s", logs:["Querying spare parts catalog","SKF 6310 bearing: 4 in stock","Lead time: 2 days expedited"], depends:["Root Cause Agent"], resourcePct:30 },
  { name:"Prevention Agent", desc:"Generating action plan", taskOrder:4, latency:"1.8s", logs:["Synthesizing recommendations","Scheduling PM actions","Generating maintenance report"], depends:["Parts Agent","Manual Agent"], resourcePct:70 },
];

const SIMILAR_INCIDENTS = [
  { id:"INC-2189", title:"CMP-07 Misalignment Event", date:"2023-08-12", resolution:"Laser aligned, 6h downtime", similarity:91 },
  { id:"INC-2312", title:"CNC-04 Spindle Bearing Failure", date:"2024-01-15", resolution:"Spindle rebuilt, PM interval reduced", similarity:88 },
  { id:"INC-2241", title:"Compressor-02 Valve Leakage", date:"2023-10-30", resolution:"Valve kit replaced, capacity restored", similarity:73 },
];

const FOLLOW_UPS = [
  "What are the exact laser alignment steps for CMP-07?",
  "Show me similar incidents from the last 12 months",
  "Generate a work order for bearing replacement",
  "What parts are needed and lead time?",
];

function agentStatus(taskOrder: number, visible: number): "queued"|"running"|"done" {
  if (visible > taskOrder + 1) return "done";
  if (visible >= taskOrder) return "running";
  return "queued";
}

function AskEchoTwin() {
  const [visible, setVisible] = useState(0);
  const [expandedSource, setExpandedSource] = useState<number|null>(null);
  const [inputVal, setInputVal] = useState("");
  const [showLogs, setShowLogs] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isStreaming = visible < AI_SECTIONS.length;

  useEffect(() => {
    if (visible >= AI_SECTIONS.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 1100);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [visible]);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: history */}
      <div className="w-[260px] shrink-0 flex flex-col border-r" style={{ background: P.bg, borderColor: P.border }}>
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all" style={{ background: P.accent, color:"#fff" }}>
            <Plus size={14} /> New conversation
          </button>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: P.muted }} />
            <input placeholder="Search conversations…" className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none" style={{ background: P.elevated, color: P.fg, border:"none" }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5" style={{ scrollbarWidth:"none" }}>
          <div className="px-2 py-1"><SectionLabel>Today</SectionLabel></div>
          {CONVERSATIONS.map(c => (
            <div key={c.id} className="px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-[#2F435A]/50" style={{ background: c.active ? P.elevated : "transparent" }}>
              <div className="text-xs font-medium leading-snug line-clamp-2" style={{ color: c.active ? P.fg : P.muted }}>{c.title}</div>
              <div className="text-[10px] mt-1" style={{ color: P.muted }}>{c.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3.5 flex items-center justify-between shrink-0" style={{ background: P.card, borderBottom:`1px solid ${P.border}` }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: P.fg }}>Compressor-07 vibration after bearing replacement</div>
            <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: P.muted }}>
              EchoTwin · GPT-4o · Brno Facility 2
              {isStreaming && <><span>·</span><span className="flex items-center gap-1" style={{ color: P.accent }}><Loader2 size={10} className="animate-spin" /> Analyzing…</span></>}
              {!isStreaming && <><span>·</span><span style={{ color: P.success }}>Complete</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConfidenceBadge score={87} />
            <button className="p-2 rounded-lg hover:opacity-70" style={{ background: P.elevated }}><Download size={13} style={{ color: P.muted }} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5" style={{ scrollbarWidth:"none" }}>
          <div className="flex justify-end">
            <div className="max-w-[480px] rounded-2xl rounded-tr-sm px-4 py-3 text-sm" style={{ background: P.accent, color:"#fff" }}>
              Compressor-07 started vibrating heavily after the bearing replacement this morning. Temperature also spiked. What is going on and what should we do?
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center" style={{ background: P.accentSub }}>
              <Bot size={13} style={{ color: P.accent }} />
            </div>
            <div className="flex-1 space-y-3">
              {visible === 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: P.card, border:`1px solid ${P.border}` }}>
                  <ThinkingDots />
                  <span className="text-xs" style={{ color: P.muted }}>EchoTwin is analyzing 47 records and 312 h of sensor data…</span>
                </div>
              )}

              {AI_SECTIONS.slice(0, visible).map((sec, idx) => {
                const Icon = sec.icon;
                const isLastStreaming = idx === visible - 1 && isStreaming;
                return (
                  <motion.div key={sec.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
                    className="rounded-2xl p-4 border" style={{ background: P.card, borderColor: isLastStreaming ? `${P.accent}40` : P.border }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: P.accentSub }}>
                        <Icon size={11} style={{ color: P.accent }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: P.fg }}>{sec.title}</span>
                      {isLastStreaming && <ThinkingDots />}
                      {!isLastStreaming && sec.type === "score" && <ConfidenceBadge score={(sec as any).score} />}
                    </div>

                    {sec.type === "bullets" && (
                      <ul className="space-y-2">
                        {(sec.items as string[]).map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs" style={{ color: P.muted }}>
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: P.accent }} />{item}
                          </li>
                        ))}
                        {isLastStreaming && <span className="inline-block w-0.5 h-3 ml-1 animate-pulse rounded-full" style={{ background: P.accent }} />}
                      </ul>
                    )}

                    {sec.type === "ranked" && (
                      <div className="space-y-3">
                        {(sec.items as { l: string; p: number }[]).map((item, j) => {
                          const col = item.p>80 ? P.danger : item.p>60 ? P.warning : P.muted;
                          return (
                            <div key={j}>
                              <div className="flex justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: P.elevated, color: P.muted }}>#{j+1}</span>
                                  <span className="text-xs" style={{ color: P.fg }}>{item.l}</span>
                                </div>
                                <span className="text-xs font-bold tabular-nums" style={{ color: col }}>{item.p}%</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: P.elevated }}>
                                <motion.div initial={{ width:0 }} animate={{ width:`${item.p}%` }} transition={{ duration:0.7, delay:j*0.1 }}
                                  className="h-full rounded-full" style={{ background: col }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {sec.type === "score" && (
                      <div className="flex items-center gap-4 py-1">
                        <div className="text-4xl font-bold tabular-nums" style={{ color: P.success }}>{(sec as any).score}<span className="text-xl">%</span></div>
                        <div className="text-xs leading-relaxed" style={{ color: P.muted }}>{(sec as any).sub}</div>
                      </div>
                    )}

                    {sec.type === "numbered" && (
                      <ol className="space-y-2">
                        {(sec.items as string[]).map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-xs" style={{ color: P.muted }}>
                            <span className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: P.elevated, color: P.accent }}>{j+1}</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    )}

                    {sec.type === "sources" && (
                      <div className="space-y-2">
                        {(sec.items as { title: string; src: string; s: number; detail: string }[]).map((item, j) => (
                          <div key={j}>
                            <div onClick={() => setExpandedSource(expandedSource===j ? null : j)}
                              className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-[#2F435A]/50 transition-colors" style={{ background: P.bg }}>
                              <FileText size={11} style={{ color: P.muted }} />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate" style={{ color: P.fg }}>{item.title}</div>
                                <div className="text-[10px]" style={{ color: P.muted }}>{item.src}</div>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background:"rgba(90,138,110,0.15)", color: P.success }}>{item.s}%</span>
                              <ChevronDown size={11} className="shrink-0 transition-transform" style={{ color: P.muted, transform: expandedSource===j?"rotate(180deg)":"none" }} />
                            </div>
                            {expandedSource === j && (
                              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.2 }}
                                className="overflow-hidden px-3 pb-2">
                                <p className="text-[11px] leading-relaxed pt-2" style={{ color: P.muted, borderTop:`1px solid ${P.border}` }}>{item.detail}</p>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {visible >= AI_SECTIONS.length && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
                  className="rounded-2xl p-4 border" style={{ background: P.card, borderColor: P.border }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: P.accentSub }}>
                      <GitBranch size={11} style={{ color: P.accent }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: P.fg }}>Similar Incidents</span>
                  </div>
                  <div className="space-y-2">
                    {SIMILAR_INCIDENTS.map((inc, j) => (
                      <div key={j} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: P.bg }}>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: P.elevated, color: P.muted }}>{inc.id}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: P.fg }}>{inc.title}</div>
                          <div className="text-[10px]" style={{ color: P.muted }}>{inc.date} · {inc.resolution}</div>
                        </div>
                        <ConfidenceBadge score={inc.similarity} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {visible >= AI_SECTIONS.length && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.2 }}
                  className="flex flex-wrap gap-2">
                  {FOLLOW_UPS.map((q, j) => (
                    <button key={j} onClick={() => setInputVal(q)}
                      className="px-3 py-1.5 rounded-xl text-xs transition-colors hover:border-[#4D87A8]/40 hover:text-[#4D87A8]"
                      style={{ background: P.card, color: P.muted, border:`1px solid ${P.border}` }}>
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        <div className="p-4 shrink-0" style={{ borderTop:`1px solid ${P.border}`, background: P.card }}>
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: P.elevated, border:`1px solid ${P.border}` }}>
            <input value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="Ask EchoTwin about machines, failures, manuals…"
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: P.fg }} />
            <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-80" style={{ background: P.accent }}>
              <Send size={13} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: agent panel */}
      <div className="w-[290px] shrink-0 flex flex-col border-l overflow-y-auto" style={{ background: P.card, borderColor: P.border, scrollbarWidth:"none" }}>
        <div className="p-4 shrink-0" style={{ borderBottom:`1px solid ${P.border}` }}>
          <SectionLabel>Agent Monitor</SectionLabel>
          <div className="flex items-center gap-2 mt-1">
            {isStreaming
              ? <><PulseIndicator color={P.accent} size={6} /><span className="text-[11px]" style={{ color: P.accent }}>Running 6 agents</span></>
              : <><PulseIndicator color={P.success} size={6} /><span className="text-[11px]" style={{ color: P.success }}>All agents finished</span></>}
          </div>
        </div>

        <div className="p-3 space-y-2">
          {AGENTS_DATA.map(ag => {
            const st = agentStatus(ag.taskOrder, visible);
            const showLog = showLogs === ag.name;
            return (
              <div key={ag.name}>
                <div onClick={() => setShowLogs(showLog ? null : ag.name)}
                  className="p-3 rounded-xl border cursor-pointer hover:border-[#4D87A8]/25 transition-colors" style={{ border:`1px solid ${P.border}`, background: P.bg }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {st==="done" ? <CheckCircle2 size={11} style={{ color: P.success }} /> : st==="running" ? <Loader2 size={11} className="animate-spin" style={{ color: P.accent }} /> : <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: P.muted }} />}
                      <span className="text-[11px] font-semibold" style={{ color: st==="queued" ? P.muted : P.fg }}>{ag.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {st!=="queued" && <span className="text-[10px] font-mono" style={{ color: P.muted }}>{ag.latency}</span>}
                      <ChevronDown size={10} style={{ color: P.muted, transform: showLog?"rotate(180deg)":"none", transition:"transform 0.2s" }} />
                    </div>
                  </div>
                  <div className="text-[10px] mb-2" style={{ color: P.muted }}>
                    {st==="done" ? ag.logs[ag.logs.length-1] : st==="running" ? ag.desc : "Queued"}
                  </div>
                  {st==="running" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]" style={{ color: P.muted }}>
                        <span>Processing</span><span>{ag.resourcePct}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: P.elevated }}>
                        <div className="h-full rounded-full animate-pulse" style={{ width:`${ag.resourcePct}%`, background: P.accent }} />
                      </div>
                    </div>
                  )}
                  {st==="done" && <div className="h-1 rounded-full" style={{ background: `${P.success}30` }}><div className="h-full w-full rounded-full" style={{ background: P.success }} /></div>}
                  {ag.depends.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[9px]" style={{ color: P.muted }}>Depends:</span>
                      {ag.depends.map(d => <span key={d} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: P.elevated, color: P.muted }}>{d.split(" ")[0]}</span>)}
                    </div>
                  )}
                </div>
                {showLog && st !== "queued" && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.15 }}
                    className="overflow-hidden mx-1 mb-1">
                    <div className="rounded-xl p-2.5 space-y-1" style={{ background: P.bg, border:`1px solid ${P.border}` }}>
                      {ag.logs.map((log, li) => (
                        <div key={li} className="flex items-start gap-2 text-[10px]" style={{ color: P.muted }}>
                          <span className="text-[9px] font-mono shrink-0 mt-0.5" style={{ color: P.muted }}>+{li*280}ms</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 mt-auto" style={{ borderTop:`1px solid ${P.border}` }}>
          <SectionLabel>Execution Timeline</SectionLabel>
          <div className="mt-3 space-y-1.5">
            {AGENTS_DATA.map(ag => {
              const st = agentStatus(ag.taskOrder, visible);
              return (
                <div key={ag.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: st==="done"?P.success:st==="running"?P.accent:P.elevated }} />
                  <div className="flex-1 text-[10px]" style={{ color: st==="queued"?P.muted:P.fg }}>{ag.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: P.muted }}>{st==="done" ? ag.latency : st==="running" ? "…" : "—"}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop:`1px solid ${P.border}` }}>
            <div className="flex justify-between text-[10px]" style={{ color: P.muted }}>
              <span>Total latency</span><span className="font-mono" style={{ color: P.fg }}>{isStreaming ? "…" : "6.2s"}</span>
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: P.muted }}>
              <span>Documents retrieved</span><span className="font-mono" style={{ color: P.fg }}>47</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Incident Memory ────────────────────────────────────────────────────────
const MEMORIES = [
  { id:"INC-2401", title:"Compressor-07 Shaft Misalignment", machine:"CMP-07", date:"2024-03-14", sev:"Critical", symptoms:"Axial vibration 12.4 mm/s, temp 84°C, resonance at 43 Hz", cause:"Improper bearing pre-load post-replacement", resolution:"Laser alignment + bearing replacement, 6h downtime", tech:"R. Obasi", similarity:0.94, tags:["vibration","alignment","bearing"], related:["INC-2312","INC-2189"],
    comments:[{ author:"D. Reyes", time:"2024-03-14 21:00", text:"Bearing was re-installed without verifying pre-load. Clear installation error." },{ author:"A. Novak", time:"2024-03-15 08:30", text:"PM procedure updated to include pre-load verification step." }],
    timeline:[{ t:"08:12", e:"Bearing replacement completed" },{ t:"14:03", e:"Vibration anomaly detected" },{ t:"19:55", e:"Machine shutdown" },{ t:"2024-03-15 06:00", e:"Repair completed" }] },
  { id:"INC-2345", title:"Pump-12 Heat Exchanger Fouling", machine:"PMP-12", date:"2024-02-20", sev:"High", symptoms:"Coolant temp +18°C, flow rate −22%, pressure differential +0.8 bar", cause:"Scale buildup on heat exchanger plates", resolution:"Chemical descaling, plates replaced, 4h downtime", tech:"D. Reyes", similarity:0.81, tags:["temperature","fouling","coolant"], related:["INC-2280"],
    comments:[{ author:"M. Horak", time:"2024-02-20 15:00", text:"Water treatment system may need recalibration. Hardness levels elevated." }],
    timeline:[{ t:"11:47", e:"Temp exceedance alarm" },{ t:"13:20", e:"Manual inspection" },{ t:"18:00", e:"Return to service" }] },
  { id:"INC-2312", title:"CNC-04 Spindle Bearing Failure", machine:"CNC-04", date:"2024-01-15", sev:"Critical", symptoms:"Grinding noise, surface finish degradation, bearing temp +9°C", cause:"Fatigue failure at 520 h — exceeded replacement interval", resolution:"Spindle rebuilt, PM interval reduced to 480 h", tech:"A. Novak", similarity:0.88, tags:["bearing","fatigue","spindle"], related:["INC-2401"],
    comments:[{ author:"A. Novak", time:"2024-01-16 09:00", text:"PM interval was set too conservatively at 600h. Industry standard for this spindle is 480h." }],
    timeline:[{ t:"06:30", e:"Grinding noise reported" },{ t:"09:00", e:"Diagnosis: bearing failure" },{ t:"2024-01-17 14:00", e:"Spindle rebuild complete" }] },
  { id:"INC-2280", title:"Conveyor CVY-03 Belt Slippage", machine:"CVY-03", date:"2023-12-08", sev:"Medium", symptoms:"Speed inconsistency ±8%, belt squeal, tracking drift", cause:"Belt tension loss due to worn tensioner spring", resolution:"Spring replaced, tension calibrated to 420 N, 2h downtime", tech:"M. Horak", similarity:0.73, tags:["belt","tension","conveyor"], related:[], comments:[],
    timeline:[{ t:"10:00", e:"Slippage detected" },{ t:"11:30", e:"Inspection" },{ t:"12:30", e:"Repair complete" }] },
  { id:"INC-2267", title:"Hydraulic HYD-09 Pressure Fluctuation", machine:"HYD-09", date:"2023-11-22", sev:"Medium", symptoms:"Pressure spikes ±35 bar, actuator hesitation, response time +0.4s", cause:"Accumulator pre-charge pressure decay", resolution:"Accumulator recharged to 140 bar, relief valve replaced", tech:"R. Obasi", similarity:0.69, tags:["pressure","hydraulic","accumulator"], related:[],
    comments:[{ author:"R. Obasi", time:"2023-11-22 16:00", text:"Accumulator should be checked annually. Currently at 18-month interval." }],
    timeline:[{ t:"08:00", e:"Pressure spikes begin" },{ t:"10:30", e:"Diagnosis" },{ t:"13:00", e:"Repair complete" }] },
  { id:"INC-2241", title:"Compressor-02 Valve Leakage", machine:"CMP-02", date:"2023-10-30", sev:"High", symptoms:"Capacity drop −18%, elevated discharge temp, oil mist visible", cause:"Worn inlet valve seats — 8100 h runtime", resolution:"Valve kit replaced, capacity restored to 98%, 8h downtime", tech:"D. Reyes", similarity:0.91, tags:["valve","leakage","compressor"], related:["INC-2401"], comments:[],
    timeline:[{ t:"06:00", e:"Capacity alarm" },{ t:"08:00", e:"Valve inspection" },{ t:"16:00", e:"Valve replaced" }] },
];

function IncidentMemory() {
  const loading = useLoading(1000);
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("All");
  const [view, setView] = useState<"grid"|"list">("grid");
  const [expanded, setExpanded] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<Record<string,"overview"|"timeline"|"comments">>({});

  const filtered = MEMORIES.filter(m => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.machine.toLowerCase().includes(search.toLowerCase());
    const matchSev = sevFilter==="All" || m.sev===sevFilter;
    return matchSearch && matchSev;
  });

  const getTab = (id: string) => activeTab[id] || "overview";
  const setTab = (id: string, tab: "overview"|"timeline"|"comments") => setActiveTab(prev => ({ ...prev, [id]:tab }));

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: P.fg }}>Incident Memory</h1>
            <p className="text-xs mt-0.5" style={{ color: P.muted }}>Searchable failure history · {MEMORIES.length} records · Brno Facility 2</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setView("grid")} className="p-2 rounded-lg transition-colors" style={{ background:view==="grid"?P.elevated:"transparent", color:view==="grid"?P.fg:P.muted }}><Grid3X3 size={14} /></button>
            <button onClick={()=>setView("list")} className="p-2 rounded-lg transition-colors" style={{ background:view==="list"?P.elevated:"transparent", color:view==="list"?P.fg:P.muted }}><List size={14} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: P.muted }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search machines, symptoms, causes…" className="pl-8 pr-4 py-2 rounded-xl text-xs outline-none w-64" style={{ background:P.card, color:P.fg, border:`1px solid ${P.border}` }} />
          </div>
          {["All","Critical","High","Medium","Low"].map(s => (
            <button key={s} onClick={()=>setSevFilter(s)} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all" style={{ background:sevFilter===s?P.accent:P.card, color:sevFilter===s?"#fff":P.muted, border:`1px solid ${sevFilter===s?P.accent:P.border}` }}>{s}</button>
          ))}
          <div className="ml-auto text-xs" style={{ color: P.muted }}>{filtered.length} results</div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-36" />)}</div>
        ) : (
          <div className={view==="grid" ? "grid grid-cols-2 gap-4" : "space-y-3"}>
            {filtered.map(m => {
              const sv = m.sev==="Critical"?"danger":m.sev==="High"?"warn":m.sev==="Medium"?"info":"neutral";
              const isExp = expanded===m.id;
              const tab = getTab(m.id);
              return (
                <Card key={m.id} className="p-5 hover:border-[#4D87A8]/25 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3" onClick={() => { if(!isExp) setExpanded(m.id); }} style={{ cursor:"pointer" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background:P.elevated, color:P.muted }}>{m.id}</span>
                        <Badge label={m.sev} v={sv as any} />
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded" style={{ background:"rgba(90,138,110,0.15)", color:P.success }}>{(m.similarity*100).toFixed(0)}% similar</span>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: P.fg }}>{m.title}</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();setExpanded(isExp?null:m.id)}} className="shrink-0 mt-0.5">
                      <ChevronDown size={13} className="transition-transform" style={{ color:P.muted, transform:isExp?"rotate(180deg)":"none" }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[11px] mb-3">
                    <div><span style={{ color:P.muted }}>Machine: </span><span style={{ color:P.fg }}>{m.machine}</span></div>
                    <div><span style={{ color:P.muted }}>Date: </span><span style={{ color:P.fg }}>{m.date}</span></div>
                    <div><span style={{ color:P.muted }}>Tech: </span><span style={{ color:P.fg }}>{m.tech}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px]" style={{ background:P.elevated, color:P.muted }}>{t}</span>)}
                    {m.related.length > 0 && <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px]" style={{ background:P.accentSub, color:P.accent }}><Link2 size={9} />{m.related.length} related</span>}
                    {m.comments.length > 0 && <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px]" style={{ background:P.elevated, color:P.muted }}><MessageCircle size={9} />{m.comments.length} notes</span>}
                  </div>

                  {isExp && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.2 }} className="overflow-hidden">
                      <div className="pt-3 mt-3" style={{ borderTop:`1px solid ${P.border}` }}>
                        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background:P.bg }}>
                          {(["overview","timeline","comments"] as const).map(t => (
                            <button key={t} onClick={()=>setTab(m.id,t)} className="flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-colors" style={{ background:tab===t?P.elevated:"transparent", color:tab===t?P.fg:P.muted }}>
                              {t}{t==="comments" && m.comments.length>0 ? ` (${m.comments.length})` : ""}
                            </button>
                          ))}
                        </div>

                        {tab==="overview" && (
                          <div className="space-y-2 text-[11px]">
                            <div className="p-3 rounded-xl" style={{ background:P.bg }}><span className="font-semibold block mb-1" style={{ color:P.muted }}>Symptoms</span><span style={{ color:P.fg }}>{m.symptoms}</span></div>
                            <div className="p-3 rounded-xl" style={{ background:P.bg }}><span className="font-semibold block mb-1" style={{ color:P.muted }}>Root Cause</span><span style={{ color:P.fg }}>{m.cause}</span></div>
                            <div className="p-3 rounded-xl" style={{ background:P.bg }}><span className="font-semibold block mb-1" style={{ color:P.muted }}>Resolution</span><span style={{ color:P.success }}>{m.resolution}</span></div>
                            {m.related.length > 0 && (
                              <div className="p-3 rounded-xl" style={{ background:P.bg }}>
                                <span className="font-semibold block mb-2" style={{ color:P.muted }}>Related Incidents</span>
                                <div className="flex gap-2 flex-wrap">{m.related.map(r => <span key={r} className="font-mono px-2 py-0.5 rounded text-[10px]" style={{ background:P.elevated, color:P.accent }}>{r}</span>)}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {tab==="timeline" && (
                          <div className="relative pl-4 space-y-3">
                            <div className="absolute left-[5px] top-0 bottom-0 w-px" style={{ background:P.border }} />
                            {m.timeline.map((ev, j) => (
                              <div key={j} className="flex gap-3">
                                <div className="absolute left-0 mt-1 z-10" style={{ background:P.card }}><div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor:j===m.timeline.length-1?P.success:P.border, background:j===m.timeline.length-1?P.success:P.bg }} /></div>
                                <div>
                                  <div className="text-[11px] font-medium" style={{ color:P.fg }}>{ev.e}</div>
                                  <div className="text-[10px]" style={{ color:P.muted }}>{ev.t}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {tab==="comments" && (
                          <div className="space-y-3">
                            {m.comments.length === 0 && <p className="text-[11px]" style={{ color:P.muted }}>No technician comments yet.</p>}
                            {m.comments.map((c, j) => (
                              <div key={j} className="p-3 rounded-xl" style={{ background:P.bg }}>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background:P.elevated, color:P.muted }}>{c.author.split(" ").map((n:string)=>n[0]).join("")}</div>
                                  <span className="text-[11px] font-semibold" style={{ color:P.fg }}>{c.author}</span>
                                  <span className="text-[10px] ml-auto" style={{ color:P.muted }}>{c.time}</span>
                                </div>
                                <p className="text-[11px] leading-relaxed" style={{ color:P.muted }}>{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Timeline ────────────────────────────────────────────────────────────────
const TL_EVENTS = [
  { time:"2024-03-14 06:00", e:"Scheduled bearing replacement", m:"CNC-04", type:"ok", sev:"info", detail:"Drive-end bearing SKF 6310 replaced per PM schedule. Torque verified at 85 Nm. Alignment check performed.", future:false, duration:"2.5h" },
  { time:"2024-03-14 08:12", e:"Compressor-07 maintenance check", m:"CMP-07", type:"ok", sev:"info", detail:"Routine inspection completed. Vibration baseline 4.2 mm/s — within Zone A. Oil sample taken.", future:false, duration:"1h" },
  { time:"2024-03-14 11:47", e:"Temperature rise detected", m:"Pump-12", type:"warn", sev:"medium", detail:"Coolant temp exceeded 78°C threshold. Operator notified. Inspection ordered for heat exchanger.", future:false, duration:"ongoing" },
  { time:"2024-03-14 14:03", e:"Vibration anomaly — post-maintenance", m:"CMP-07", type:"warn", sev:"high", detail:"Post-maintenance vibration at 12.4 mm/s — 3× baseline. Possible installation defect or misalignment.", future:false, duration:"ongoing" },
  { time:"2024-03-14 15:20", e:"EchoTwin root cause analysis", m:"CMP-07", type:"info", sev:"info", detail:"Multi-agent analysis triggered. 47 records retrieved. Shaft misalignment ranked primary cause (89%).", future:false, duration:"6.2s" },
  { time:"2024-03-14 16:30", e:"Lubrication warning", m:"CNC-04", type:"warn", sev:"low", detail:"Grease level sensor: refill required within 48 h. Lubrication schedule initiated.", future:false, duration:"—" },
  { time:"2024-03-14 18:00", e:"Vibration escalation", m:"CMP-07", type:"warn", sev:"critical", detail:"Vibration reached 13.1 mm/s. Resonance confirmed at 43 Hz. Temperature 81°C.", future:false, duration:"ongoing" },
  { time:"2024-03-14 19:55", e:"Unplanned shutdown — failure event", m:"CMP-07", type:"fail", sev:"critical", detail:"Motor tripped on overcurrent. Production halted. Emergency maintenance dispatched.", future:false, duration:"6h" },
  { time:"2024-03-15 08:00", e:"Predicted: Bearing replacement", m:"CMP-07", type:"predict", sev:"critical", detail:"EchoTwin predicts replacement required. Schedule within 12 h to minimize downtime.", future:true, duration:"est. 4h" },
  { time:"2024-03-18 00:00", e:"Predicted: Lubrication service", m:"CNC-04", type:"predict", sev:"low", detail:"Grease replenishment due. Schedule within the next 96 h.", future:true, duration:"est. 1h" },
];

function TimelinePage() {
  const [expanded, setExpanded] = useState<number|null>(null);
  const loading = useLoading(800);
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 max-w-[900px]">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-lg font-bold" style={{ color: P.fg }}>Event Timeline</h1>
            <p className="text-xs mt-0.5" style={{ color: P.muted }}>Chronological explorer · Brno Facility 2 · 2024-03-14</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[["ok",P.success,"Normal"],["warn",P.warning,"Warning"],["fail",P.danger,"Failure"],["predict",P.accent,"Predicted"]].map(([t,c,l])=>(
              <div key={t} className="flex items-center gap-1.5 text-[11px]" style={{ color:P.muted }}><span className="w-2 h-2 rounded-full" style={{ background:c }} />{l}</div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="flex gap-6"><Skeleton className="w-12 h-12 rounded-full" /><Skeleton className="flex-1 h-16" /></div>)}</div>
        ) : (
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px" style={{ background:P.border }} />
            <div className="space-y-3">
              {TL_EVENTS.map((ev, i) => {
                const isExp = expanded===i;
                const iconColor = ev.type==="ok"?P.success:ev.type==="fail"?P.danger:ev.type==="predict"?P.accent:ev.sev==="critical"?P.danger:P.warning;
                const Icon = ev.type==="ok"?CheckCircle2:ev.type==="fail"?XCircle:ev.type==="predict"?Zap:AlertCircle;
                const sevColor = ev.sev==="critical"?P.danger:ev.sev==="high"?P.warning:ev.sev==="low"?P.success:ev.type==="predict"?P.accent:P.muted;
                return (
                  <div key={i} className="flex gap-6 relative">
                    <div className="shrink-0 w-11 flex items-start justify-center pt-3.5 z-10" style={{ background:P.bg }}>
                      {ev.type==="predict"
                        ? <div className="relative"><Icon size={16} style={{ color:iconColor }} /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping" style={{ background:P.accent, opacity:0.5 }} /></div>
                        : <Icon size={16} style={{ color:iconColor }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Card className={`p-4 cursor-pointer transition-all hover:border-[#4D87A8]/25 ${ev.future ? "opacity-80" : ""}`} onClick={()=>setExpanded(isExp?null:i)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <div className="w-1 h-4 rounded-full shrink-0" style={{ background:sevColor }} />
                              <span className="text-sm font-semibold" style={{ color:ev.future?P.accent:P.fg }}>{ev.e}</span>
                              {ev.future && <Badge label="Predicted" v="info" />}
                              {ev.sev==="critical" && !ev.future && <Badge label="Critical" v="danger" />}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] flex-wrap" style={{ color:P.muted }}>
                              <span className="font-mono font-bold px-1.5 py-0.5 rounded text-[10px]" style={{ background:P.elevated, color:P.muted }}>{ev.m}</span>
                              <span>{ev.time}</span>
                              {ev.duration !== "—" && <span>Duration: {ev.duration}</span>}
                            </div>
                          </div>
                          <ChevronDown size={13} className="shrink-0 mt-0.5 transition-transform" style={{ color:P.muted, transform:isExp?"rotate(180deg)":"none" }} />
                        </div>
                        {isExp && (
                          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.2 }} className="overflow-hidden">
                            <p className="text-[11px] mt-3 leading-relaxed" style={{ color:P.muted, paddingTop:"12px", borderTop:`1px solid ${P.border}` }}>{ev.detail}</p>
                          </motion.div>
                        )}
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Manual Explorer ─────────────────────────────────────────────────────────
const MANUALS = [
  { id:1, title:"Atlas Copco GA-55 Service Manual", type:"OEM Manual", pages:248, updated:"2023-08" },
  { id:2, title:"SKF Bearing Installation Guide", type:"Technical Guide", pages:84, updated:"2023-11" },
  { id:3, title:"SOP-MAINT-041: Rotating Equipment Alignment", type:"SOP", pages:12, updated:"2024-01" },
  { id:4, title:"ISO 10816 Vibration Standards", type:"Standard", pages:36, updated:"2022-06" },
  { id:5, title:"Brno Facility Maintenance Handbook", type:"Internal", pages:192, updated:"2024-02" },
];
const DOC_CONTENT = [
  { section:"6.4 Shaft Alignment Procedures", highlight:true, text:"Proper shaft alignment is critical for long-term reliability of rotating machinery. Misalignment is one of the primary causes of premature bearing failure, seal damage, and excessive vibration." },
  { section:"6.4.1 Alignment Tolerances", highlight:false, text:"Tolerances to maintain: Radial (offset) misalignment: ±0.05 mm maximum. Angular misalignment: ±0.02 mm/100 mm maximum. Final alignment must be performed at operating temperature." },
  { section:"6.4.2 Required Tools", highlight:false, text:"Laser alignment system (Rotalign Ultra or equivalent), dial indicator set, alignment shims (stainless, 0.05–2.0 mm), torque wrench (calibrated), soft-face mallet." },
  { section:"6.4.3 Procedure", highlight:true, text:"1. Isolate machine (LOTO). 2. Remove coupling guard. 3. Mount laser transmitter and receiver. 4. Rough align by eye. 5. Activate laser and measure misalignment. 6. Shim motor feet for vertical offset. 7. Adjust horizontal position. 8. Verify tolerances per §6.4.1. 9. Tighten hold-down bolts. 10. Re-check after tightening." },
];
const AI_EXTRACTS = [
  { q:"Why is shaft alignment critical?", a:"Misalignment causes premature bearing failure, seal damage, and excessive vibration — primary failure modes in rotating equipment.", page:47 },
  { q:"Alignment tolerances?", a:"Radial ±0.05 mm max · Angular ±0.02 mm/100 mm max.", page:48 },
  { q:"When to perform laser check?", a:"After any coupling replacement or when vibration exceeds ISO 10816 Zone B limits.", page:51 },
];

function ManualExplorer() {
  const [selectedDoc, setSelectedDoc] = useState(MANUALS[0]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [askedQ, setAskedQ] = useState<string|null>(null);
  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[240px] shrink-0 flex flex-col border-r" style={{ background:P.bg, borderColor:P.border }}>
        <div className="p-4" style={{ borderBottom:`1px solid ${P.border}` }}>
          <SectionLabel>Document Library</SectionLabel>
          <div className="relative mt-3">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color:P.muted }} />
            <input placeholder="Search documents…" className="w-full pl-7 pr-3 py-1.5 rounded-xl text-[11px] outline-none" style={{ background:P.elevated, color:P.fg, border:"none" }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ scrollbarWidth:"none" }}>
          {MANUALS.map(m => (
            <button key={m.id} onClick={()=>setSelectedDoc(m)} className="w-full text-left p-3 rounded-xl transition-colors hover:bg-[#2F435A]/50" style={{ background:selectedDoc.id===m.id?P.elevated:"transparent" }}>
              <div className="text-[11px] font-semibold leading-snug" style={{ color:selectedDoc.id===m.id?P.fg:P.muted }}>{m.title}</div>
              <div className="text-[10px] mt-1" style={{ color:P.muted }}>{m.type} · {m.pages} pp · {m.updated}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom:`1px solid ${P.border}`, background:P.card }}>
          <div>
            <div className="text-sm font-semibold" style={{ color:P.fg }}>{selectedDoc.title}</div>
            <div className="text-[11px]" style={{ color:P.muted }}>{selectedDoc.type} · {selectedDoc.pages} pages · Updated {selectedDoc.updated}</div>
          </div>
          <button className="p-2 rounded-lg" style={{ background:P.elevated }}><Download size={13} style={{ color:P.muted }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth:"none" }}>
          <div className="max-w-[680px] mx-auto space-y-6">
            {DOC_CONTENT.map((sec, i) => (
              <div key={i} className="rounded-2xl p-5 border" style={{ background:P.card, borderColor:P.border, borderLeftWidth:sec.highlight?3:1, borderLeftColor:sec.highlight?P.accent:P.border }}>
                <div className="text-xs font-bold mb-2" style={{ color:P.accent }}>{sec.section}</div>
                <p className="text-sm leading-relaxed" style={{ color:sec.highlight?P.fg:P.muted }}>{sec.text}</p>
                {sec.highlight && <div className="mt-2 text-[10px] uppercase tracking-wider" style={{ color:P.accent }}>Highlighted by EchoTwin</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[280px] shrink-0 flex flex-col border-l" style={{ background:P.card, borderColor:P.border }}>
        <div className="p-4" style={{ borderBottom:`1px solid ${P.border}` }}>
          <SectionLabel>AI Explanation</SectionLabel>
          <p className="text-[11px] mt-1" style={{ color:P.muted }}>Ask questions about this document</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth:"none" }}>
          <SectionLabel>Key Extracts</SectionLabel>
          {AI_EXTRACTS.map((ex, i) => (
            <div key={i} className="p-3 rounded-xl border" style={{ border:`1px solid ${P.border}`, background:P.bg }}>
              <div className="text-[10px] font-bold mb-1" style={{ color:P.muted }}>{ex.q}</div>
              <p className="text-[11px] leading-relaxed" style={{ color:P.fg }}>{ex.a}</p>
              <div className="text-[10px] mt-1.5" style={{ color:P.muted }}>Page {ex.page}</div>
            </div>
          ))}
          {askedQ && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="p-3 rounded-xl border" style={{ border:`1px solid ${P.accent}30`, background:P.accentSub }}>
              <div className="text-[10px] font-bold mb-1" style={{ color:P.accent }}>{askedQ}</div>
              <p className="text-[11px] leading-relaxed" style={{ color:P.fg }}>Based on §6.4.3, the procedure involves 10 steps starting with LOTO isolation and ending with post-tightening alignment verification.</p>
            </motion.div>
          )}
        </div>
        <div className="p-3 shrink-0" style={{ borderTop:`1px solid ${P.border}` }}>
          <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background:P.elevated }}>
            <input value={aiQuestion} onChange={e=>setAiQuestion(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&aiQuestion){setAskedQ(aiQuestion);setAiQuestion("");}}} placeholder="Ask about this manual…" className="flex-1 text-[11px] outline-none bg-transparent" style={{ color:P.fg }} />
            <button onClick={()=>{ if(aiQuestion){setAskedQ(aiQuestion);setAiQuestion("");} }} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:P.accent }}><Send size={10} color="#fff" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Analytics ───────────────────────────────────────────────────────────────
const monthlyData = [
  { m:"Oct", failures:12, mtbf:340, downtime:28, prev_failures:15, prev_mtbf:310 },
  { m:"Nov", failures:18, mtbf:295, downtime:43, prev_failures:20, prev_mtbf:280 },
  { m:"Dec", failures:14, mtbf:318, downtime:31, prev_failures:16, prev_mtbf:305 },
  { m:"Jan", failures:22, mtbf:270, downtime:56, prev_failures:25, prev_mtbf:250 },
  { m:"Feb", failures:16, mtbf:308, downtime:38, prev_failures:18, prev_mtbf:295 },
  { m:"Mar", failures:17, mtbf:312, downtime:40, prev_failures:23, prev_mtbf:287 },
];
const machineRankData = [
  { name:"CMP-07", incidents:11 }, { name:"PMP-12", incidents:8 },
  { name:"CNC-04", incidents:7 }, { name:"HYD-09", incidents:5 }, { name:"CVY-03", incidents:4 },
];
const causeData = [
  { name:"Misalignment", value:31 }, { name:"Bearing wear", value:26 },
  { name:"Lubrication", value:19 }, { name:"Electrical", value:14 }, { name:"Other", value:10 },
];
const CAUSE_COLORS = [P.danger, P.warning, P.accent, P.success, P.muted];
const plantData = [
  { plant:"Brno F2", failures:17, mtbf:312, downtime:40, oee:87, trend:2.3 },
  { plant:"Brno F1", failures:12, mtbf:355, downtime:28, oee:91, trend:1.1 },
  { plant:"Prague F1", failures:24, mtbf:264, downtime:62, oee:79, trend:-3.4 },
];
const HEAT = [[4,2,1,3,2],[3,5,2,1,4],[1,2,4,5,3],[2,3,1,2,1],[4,1,3,2,5]];
const HEAT_MACHINES = ["CMP-07","PMP-12","CNC-04","CVY-03","HYD-09"];
const HEAT_WEEKS = ["W1","W2","W3","W4","W5"];

function Analytics() {
  const loading = useLoading(1200);
  const [compare, setCompare] = useState(false);
  const [drillMachine, setDrillMachine] = useState<string|null>(null);
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 space-y-5 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color:P.fg }}>Analytics</h1>
            <p className="text-xs mt-0.5" style={{ color:P.muted }}>Executive intelligence · Q1 2024 · All Facilities</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setCompare(!compare)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all" style={{ background:compare?P.accent:P.elevated, color:compare?"#fff":P.muted }}>
              <BarChart2 size={12} /> {compare ? "Comparing Q4 vs Q1" : "Compare periods"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style={{ background:P.elevated, color:P.muted }}>
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { l:"Total Failures (Q1)", v:"99", c:P.danger, trend:-14.8, suffix:"% vs Q4" },
            { l:"Avg MTBF", v:"312 h", c:P.accent, trend:8.7, suffix:" h vs Q4" },
            { l:"Downtime Hours", v:"236 h", c:P.warning, trend:-18.2, suffix:"% vs Q4" },
            { l:"Fleet OEE", v:"87%", c:P.success, trend:2.3, suffix:" pts vs Q4" },
          ].map(k => (
            <Card key={k.l} className="p-5 hover:border-[#4D87A8]/25 transition-colors">
              {loading ? <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-16" /></div> : (
                <>
                  <SectionLabel>{k.l}</SectionLabel>
                  <div className="text-2xl font-bold mt-3 mb-2 tabular-nums" style={{ color:k.c }}>{k.v}</div>
                  <TrendArrow value={k.trend} suffix={k.suffix} />
                </>
              )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Failure Trends · Monthly</SectionLabel>
              {compare && <div className="flex gap-3 text-[11px]">{[["#C0392B","Q1 2024"],["rgba(192,57,43,0.4)","Q4 2023"]].map(([c,l])=><div key={l} className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full" style={{ background:c as string }} /><span style={{ color:P.muted }}>{l}</span></div>)}</div>}
            </div>
            {loading ? <Skeleton className="h-48" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill:"rgba(77,135,168,0.05)" }} />
                  {compare && <Bar id="an-bar-prev" dataKey="prev_failures" fill={P.danger} fillOpacity={0.3} radius={[4,4,0,0]} />}
                  <Bar id="an-bar-fail" dataKey="failures" fill={P.danger} radius={[4,4,0,0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
          <Card className="p-6 flex flex-col">
            <SectionLabel>Root Cause Distribution</SectionLabel>
            {loading ? <Skeleton className="flex-1 mt-3" /> : (
              <div className="flex-1 flex flex-col justify-center mt-3">
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie id="an-pie" data={causeData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {causeData.map((_, i) => <Cell key={i} fill={CAUSE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {causeData.map((d,i) => (
                    <div key={d.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background:CAUSE_COLORS[i] }} /><span style={{ color:P.muted }}>{d.name}</span></div>
                      <span className="font-bold tabular-nums" style={{ color:P.fg }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>MTBF Trend · Rolling 6 Months</SectionLabel>
              <TrendArrow value={8.7} suffix=" h" />
            </div>
            {loading ? <Skeleton className="h-40" /> : (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={monthlyData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:P.muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  {compare && <Line id="an-mtbf-prev" type="monotone" dataKey="prev_mtbf" stroke={P.accent} strokeWidth={1.5} strokeDasharray="4 3" dot={false} strokeOpacity={0.4} />}
                  <Line id="an-mtbf" type="monotone" dataKey="mtbf" stroke={P.accent} strokeWidth={2} dot={false} activeDot={{ r:3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Most Problematic Machines</SectionLabel>
              {drillMachine && <button onClick={()=>setDrillMachine(null)} className="text-[11px] flex items-center gap-1" style={{ color:P.accent }}><X size={11} /> Clear</button>}
            </div>
            {loading ? <Skeleton className="h-40" /> : (
              <div className="space-y-2.5">
                {machineRankData.map(m => (
                  <div key={m.name} onClick={()=>setDrillMachine(m.name===drillMachine?null:m.name)}
                    className="flex items-center gap-3 cursor-pointer" style={{ opacity:drillMachine&&drillMachine!==m.name?0.4:1, transition:"opacity 0.2s" }}>
                    <div className="w-14 text-right text-[11px] font-mono font-bold shrink-0" style={{ color:P.muted }}>{m.name}</div>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background:P.elevated }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${(m.incidents/11)*100}%` }} transition={{ duration:0.8, ease:"easeOut" }}
                        className="h-full rounded-lg flex items-center justify-end pr-2" style={{ background:P.danger, opacity:0.85 }}>
                        <span className="text-[10px] font-bold text-white">{m.incidents}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-4">
          <Card className="p-6">
            <SectionLabel>Downtime Heatmap · Incidents Per Machine Per Week</SectionLabel>
            <div className="mt-5">
              <div className="flex gap-1 mb-1 pl-16">{HEAT_WEEKS.map(w=><div key={w} className="flex-1 text-center text-[10px]" style={{ color:P.muted }}>{w}</div>)}</div>
              {HEAT.map((row, ri) => (
                <div key={ri} className="flex items-center gap-1 mb-1">
                  <div className="w-14 text-[10px] text-right pr-2 shrink-0" style={{ color:P.muted }}>{HEAT_MACHINES[ri]}</div>
                  {row.map((val, ci) => (
                    <div key={ci} className="flex-1 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ background:`rgba(192,57,43,${0.08+val/5*0.7})`, color:val/5>0.5?"#E4E9EE":P.muted }}
                      title={`${HEAT_MACHINES[ri]} · ${HEAT_WEEKS[ci]} · ${val} incidents`}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-[10px]" style={{ color:P.muted }}>Low</span>
                {[0.1,0.3,0.5,0.7,0.9].map(o=><div key={o} className="w-4 h-3 rounded" style={{ background:`rgba(192,57,43,${o})` }} />)}
                <span className="text-[10px]" style={{ color:P.muted }}>High</span>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <SectionLabel>Plant Comparison</SectionLabel>
            <div className="mt-5 space-y-5">
              {plantData.map(p => (
                <div key={p.plant}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color:P.fg }}>{p.plant}</span>
                    <div className="flex items-center gap-2"><TrendArrow value={p.trend} suffix="%" /><span className="text-xs font-bold" style={{ color:P.success }}>{p.oee}% OEE</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {([["Failures",p.failures,P.danger],["MTBF",`${p.mtbf}h`,P.accent],["Downtime",`${p.downtime}h`,P.warning]] as [string,string|number,string][]).map(([l,v,c])=>(
                      <div key={l} className="rounded-xl p-2" style={{ background:P.bg }}>
                        <div className="text-sm font-bold tabular-nums" style={{ color:c }}>{v}</div>
                        <div className="text-[10px]" style={{ color:P.muted }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Reports ─────────────────────────────────────────────────────────────────
const AI_INSIGHTS = [
  { icon:TrendingDown, title:"Failure rate declining", body:"Q1 2024 shows a 26% reduction in incidents compared to Q4 2023, driven by the new PM schedule implemented in January.", color:P.success },
  { icon:AlertOctagon, title:"CMP-07 at critical risk", body:"Compressor-07 accounted for 32% of all unplanned downtime this quarter. Laser alignment + bearing replacement within 12 h strongly recommended.", color:P.danger },
  { icon:Lightbulb, title:"Predictive window identified", body:"EchoTwin identified 8 machines with 60+ day predictive windows. Projected savings: €42,000/quarter in avoided unplanned downtime.", color:P.accent },
  { icon:ClipboardList, title:"MTBF improvement trend", body:"Mean time between failures increased from 270 h (Jan) to 312 h (Mar), suggesting the PM program is yielding measurable results.", color:P.warning },
];

const RECOMMENDATIONS = [
  { priority:"Critical", machine:"CMP-07", action:"Laser shaft alignment + bearing pre-load verification", due:"Within 12 h", cost:"€1,200" },
  { priority:"High", machine:"PMP-12", action:"Heat exchanger chemical descaling", due:"Within 48 h", cost:"€3,400" },
  { priority:"Medium", machine:"CNC-04", action:"Lubrication replenishment and tension check", due:"Within 5 days", cost:"€280" },
  { priority:"Medium", machine:"HYD-09", action:"Accumulator pre-charge pressure check", due:"Within 7 days", cost:"€450" },
  { priority:"Low", machine:"CVY-03", action:"Belt tension calibration at next PM window", due:"Next PM", cost:"€120" },
];

const EXPORTS = [
  { name:"Q1 2024 Executive Report", date:"2024-03-15 09:00", format:"PDF", by:"A. Novak" },
  { name:"Compressor-07 Incident Analysis", date:"2024-03-14 22:30", format:"PDF", by:"EchoTwin AI" },
  { name:"Weekly Fleet Status — W11", date:"2024-03-10 08:00", format:"Excel", by:"Auto-generated" },
  { name:"February MTBF Trend Report", date:"2024-03-01 09:00", format:"PDF", by:"D. Reyes" },
];

function Reports() {
  const loading = useLoading(1000);
  const [expandedRec, setExpandedRec] = useState<number|null>(null);
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="p-8 space-y-5 max-w-[1400px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color:P.fg }}>Reports</h1>
            <p className="text-xs mt-0.5" style={{ color:P.muted }}>AI-generated intelligence · Q1 2024 · Brno Facility 2</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold" style={{ background:P.accent, color:"#fff" }}>
            <Download size={12} /> Generate Report
          </button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <SectionLabel>Executive Summary</SectionLabel>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background:P.accentSub, color:P.accent }}>AI Generated · 2024-03-15</span>
          </div>
          {loading ? <div className="space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-5/6" /><Skeleton className="h-3 w-4/5" /></div> : (
            <div className="grid grid-cols-[1fr_200px] gap-6">
              <div className="space-y-3">
                <p className="text-sm leading-relaxed" style={{ color:P.fg }}>Q1 2024 represents a <strong>significant improvement</strong> in operational reliability at Brno Facility 2. Total incidents declined 26% from Q4 2023, with mean time between failures rising from 287 h to 312 h. The AI-driven PM program deployed in January is demonstrably reducing reactive maintenance costs.</p>
                <p className="text-sm leading-relaxed" style={{ color:P.muted }}>However, Compressor-07 experienced a <span style={{ color:P.danger }}>critical failure event on 2024-03-14</span> following a bearing replacement — attributed to improper pre-load during installation. Root cause analysis was completed in 6.2 seconds by EchoTwin, enabling rapid response. Repair is expected within 12 h.</p>
                <p className="text-sm leading-relaxed" style={{ color:P.muted }}>EchoTwin identified 8 predictive maintenance windows with an estimated cost avoidance of <strong style={{ color:P.success }}>€42,000</strong> in unplanned downtime this quarter.</p>
              </div>
              <div className="space-y-3">
                {[["Total Incidents","99","−26% vs Q4",P.success],["Avg MTBF","312 h","+25 h vs Q4",P.accent],["Downtime Hours","236 h","−18% vs Q4",P.success],["Fleet OEE","87%","+2.3 pts vs Q4",P.success]].map(([l,v,d,c])=>(
                  <div key={l as string} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background:P.bg }}>
                    <div className="text-[11px]" style={{ color:P.muted }}>{l as string}</div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums" style={{ color:c as string }}>{v as string}</div>
                      <div className="text-[10px]" style={{ color:P.muted }}>{d as string}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div>
          <SectionLabel>AI-Generated Insights</SectionLabel>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {loading ? [1,2,3,4].map(i=><Skeleton key={i} className="h-28" />) :
            AI_INSIGHTS.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <Card key={i} className="p-5 hover:border-[#4D87A8]/25 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${ins.color}20` }}>
                      <Icon size={15} style={{ color:ins.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1" style={{ color:P.fg }}>{ins.title}</div>
                      <p className="text-[11px] leading-relaxed" style={{ color:P.muted }}>{ins.body}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom:`1px solid ${P.border}` }}>
            <SectionLabel>Maintenance Recommendations · AI Generated</SectionLabel>
          </div>
          <div>
            {RECOMMENDATIONS.map((r, i) => {
              const pv = r.priority==="Critical"?"danger":r.priority==="High"?"warn":r.priority==="Medium"?"info":"neutral";
              return (
                <div key={i} onClick={()=>setExpandedRec(expandedRec===i?null:i)}
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-[#1A2430]/80 transition-colors" style={{ borderBottom: i<RECOMMENDATIONS.length-1?`1px solid ${P.border}`:undefined }}>
                  <Badge label={r.priority} v={pv as any} />
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded w-16 text-center" style={{ background:P.elevated, color:P.muted }}>{r.machine}</span>
                  <span className="flex-1 text-sm" style={{ color:P.fg }}>{r.action}</span>
                  <span className="text-[11px]" style={{ color:P.muted }}>{r.due}</span>
                  <span className="text-[11px] font-semibold w-16 text-right" style={{ color:P.fg }}>{r.cost}</span>
                  <ChevronDown size={12} className="transition-transform" style={{ color:P.muted, transform:expandedRec===i?"rotate(180deg)":"none" }} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${P.border}` }}>
            <SectionLabel>Export History</SectionLabel>
            <button className="text-[11px]" style={{ color:P.accent }}>View all</button>
          </div>
          <table className="w-full text-xs">
            <thead><tr style={{ borderBottom:`1px solid ${P.border}` }}>
              {["Report","Generated","Format","Author",""].map(h=><th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-semibold" style={{ color:P.muted }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {EXPORTS.map((e, i) => (
                <tr key={i} className="hover:bg-[#1A2430]/60 transition-colors" style={{ borderBottom:i<EXPORTS.length-1?`1px solid ${P.border}`:undefined }}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2"><FileBarChart size={13} style={{ color:P.muted }} /><span style={{ color:P.fg }}>{e.name}</span></div>
                  </td>
                  <td className="px-6 py-3.5" style={{ color:P.muted }}>{e.date}</td>
                  <td className="px-6 py-3.5"><Badge label={e.format} v="neutral" /></td>
                  <td className="px-6 py-3.5" style={{ color:P.muted }}>{e.by}</td>
                  <td className="px-6 py-3.5">
                    <button className="flex items-center gap-1 text-[11px] hover:opacity-80" style={{ color:P.accent }}><Download size={11} /> Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────
const SETTING_CATS = [
  { id:"general", label:"General", icon:Sliders },
  { id:"ai", label:"AI Models", icon:Cpu },
  { id:"data", label:"Data Sources", icon:Database },
  { id:"agents", label:"Agent Config", icon:Network },
  { id:"users", label:"Users & Roles", icon:Users },
  { id:"notifs", label:"Notifications", icon:Bell },
];

const USERS_LIST = [
  { name:"D. Reyes", role:"Lead Technician", email:"d.reyes@brno.echotwin.io", access:"Full", status:"active" },
  { name:"R. Obasi", role:"Maintenance Tech", email:"r.obasi@brno.echotwin.io", access:"Standard", status:"active" },
  { name:"A. Novak", role:"Plant Engineer", email:"a.novak@brno.echotwin.io", access:"Full", status:"active" },
  { name:"M. Horak", role:"Operations", email:"m.horak@brno.echotwin.io", access:"Read-only", status:"away" },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-10 h-5 rounded-full transition-colors relative shrink-0" style={{ background:on?P.accent:P.elevated }}>
      <span className="absolute top-0.5 h-4 w-4 rounded-full transition-all" style={{ background:P.fg, left:on?"calc(100% - 18px)":"2px" }} />
    </button>
  );
}

function SettingsPage() {
  const [cat, setCat] = useState("general");
  const [toggles, setToggles] = useState<Record<string,boolean>>({ autoDiag:true, streaming:true, retrieval:true, emailAlerts:false, slackAlerts:true, smsAlerts:false, weeklyReport:true });
  const flip = (k: string) => setToggles(t => ({ ...t, [k]:!t[k] }));
  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[220px] shrink-0 border-r p-4 space-y-0.5" style={{ background:P.bg, borderColor:P.border }}>
        <div className="px-2 pb-3"><SectionLabel>Settings</SectionLabel></div>
        {SETTING_CATS.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={()=>setCat(c.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-[#2F435A]/50"
              style={{ background:cat===c.id?P.elevated:"transparent", color:cat===c.id?P.fg:P.muted }}>
              <Icon size={14} /><span className="text-sm font-medium">{c.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth:"none" }}>
        {cat==="general" && (
          <div className="max-w-[640px] space-y-6">
            <div><h2 className="text-base font-bold" style={{ color:P.fg }}>General Settings</h2><p className="text-xs mt-0.5" style={{ color:P.muted }}>Platform configuration and preferences</p></div>
            {[["Platform Name","EchoTwin — Brno Facility 2"],["Facility ID","BRN-F2-001"],["Timezone","Europe/Prague (UTC+1)"],["Language","English (EN)"]].map(([l,v])=>(
              <div key={l}><label className="block text-xs font-semibold mb-1.5" style={{ color:P.muted }}>{l}</label>
                <input defaultValue={v} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background:P.card, color:P.fg, border:`1px solid ${P.border}` }} /></div>
            ))}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background:P.card }}>
              <div><div className="text-sm font-semibold" style={{ color:P.fg }}>Auto-diagnostics on fault</div><div className="text-xs mt-0.5" style={{ color:P.muted }}>Trigger EchoTwin analysis automatically on fault event</div></div>
              <Toggle on={toggles.autoDiag} onToggle={()=>flip("autoDiag")} />
            </div>
          </div>
        )}
        {cat==="ai" && (
          <div className="max-w-[640px] space-y-6">
            <div><h2 className="text-base font-bold" style={{ color:P.fg }}>AI Model Configuration</h2></div>
            {[["Reasoning Model","GPT-4o (Azure OpenAI)"],["Embedding Model","text-embedding-3-large"],["Context Window","128,000 tokens"],["Vector Store","Pinecone (brno-f2-prod)"]].map(([l,v])=>(
              <div key={l} className="flex items-center justify-between p-4 rounded-xl" style={{ background:P.card, border:`1px solid ${P.border}` }}>
                <div><div className="text-sm font-semibold" style={{ color:P.fg }}>{l}</div><div className="text-xs" style={{ color:P.muted }}>{v}</div></div>
                <button className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80" style={{ background:P.elevated, color:P.muted }}>Change</button>
              </div>
            ))}
            {[["Streaming responses","streaming"],["Retrieval-augmented generation","retrieval"]].map(([l,k])=>(
              <div key={k} className="flex items-center justify-between p-4 rounded-xl" style={{ background:P.card }}>
                <div className="text-sm font-semibold" style={{ color:P.fg }}>{l}</div>
                <Toggle on={toggles[k]} onToggle={()=>flip(k)} />
              </div>
            ))}
          </div>
        )}
        {cat==="data" && (
          <div className="max-w-[640px] space-y-4">
            <div><h2 className="text-base font-bold" style={{ color:P.fg }}>Data Sources</h2></div>
            {[
              { name:"SAP Plant Maintenance (CMMS)", status:"Connected", type:"Maintenance logs", last:"2 min ago" },
              { name:"Atlas Copco OEM Document Library", status:"Connected", type:"OEM manuals (248 docs)", last:"1 h ago" },
              { name:"Internal SOP Document Store", status:"Connected", type:"SOPs, work instructions", last:"6 h ago" },
              { name:"OSIsoft PI Historian", status:"Syncing", type:"Sensor time-series data", last:"Live" },
              { name:"SAP S/4HANA Spare Parts", status:"Connected", type:"Parts catalog", last:"4 h ago" },
            ].map(s => (
              <div key={s.name} className="flex items-center gap-4 p-4 rounded-xl border" style={{ background:P.card, borderColor:P.border }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:P.elevated }}><Database size={14} style={{ color:P.muted }} /></div>
                <div className="flex-1"><div className="text-sm font-semibold" style={{ color:P.fg }}>{s.name}</div><div className="text-[11px]" style={{ color:P.muted }}>{s.type} · Last sync: {s.last}</div></div>
                <Badge label={s.status} v={s.status==="Connected"?"success":"warn"} />
              </div>
            ))}
          </div>
        )}
        {cat==="agents" && (
          <div className="max-w-[640px] space-y-4">
            <div><h2 className="text-base font-bold" style={{ color:P.fg }}>Agent Configuration</h2></div>
            {[
              { name:"Incident Agent", desc:"Searches and retrieves similar past incidents", on:true },
              { name:"Memory Agent", desc:"Cross-references failure patterns from memory", on:true },
              { name:"Root Cause Agent", desc:"Performs causal chain analysis", on:true },
              { name:"Manual Agent", desc:"Parses OEM documentation for procedures", on:true },
              { name:"Parts Agent", desc:"Checks parts availability and lead times", on:false },
              { name:"Prevention Agent", desc:"Generates preventive maintenance recommendations", on:true },
            ].map((ag) => (
              <div key={ag.name} className="flex items-center justify-between p-4 rounded-xl border" style={{ background:P.card, borderColor:P.border }}>
                <div className="flex items-center gap-3">
                  {ag.on ? <PulseIndicator color={P.success} size={6} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background:P.muted }} />}
                  <div><div className="text-sm font-semibold" style={{ color:P.fg }}>{ag.name}</div><div className="text-xs mt-0.5" style={{ color:P.muted }}>{ag.desc}</div></div>
                </div>
                <Toggle on={ag.on} onToggle={()=>{}} />
              </div>
            ))}
          </div>
        )}
        {cat==="users" && (
          <div className="max-w-[640px] space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-base font-bold" style={{ color:P.fg }}>Users & Roles</h2></div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background:P.accent, color:"#fff" }}><Plus size={12} /> Invite user</button>
            </div>
            <Card className="overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr style={{ borderBottom:`1px solid ${P.border}` }}>{["Name","Role","Access","Status",""].map(h=><th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold" style={{ color:P.muted }}>{h}</th>)}</tr></thead>
                <tbody>
                  {USERS_LIST.map((u, i) => (
                    <tr key={u.name} className="hover:bg-[#1A2430]/80" style={{ borderBottom:i<USERS_LIST.length-1?`1px solid ${P.border}`:undefined }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background:P.elevated, color:P.muted }}>{u.name.split(" ").map(n=>n[0]).join("")}</div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border" style={{ background:u.status==="active"?P.success:P.warning, borderColor:P.card }} />
                          </div>
                          <div><div className="font-semibold" style={{ color:P.fg }}>{u.name}</div><div className="text-[10px]" style={{ color:P.muted }}>{u.email}</div></div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5" style={{ color:P.muted }}>{u.role}</td>
                      <td className="px-5 py-3.5"><Badge label={u.access} v={u.access==="Full"?"info":u.access==="Standard"?"success":"neutral"} /></td>
                      <td className="px-5 py-3.5"><Badge label={u.status} v={u.status==="active"?"success":"warn"} /></td>
                      <td className="px-5 py-3.5"><button style={{ color:P.muted }}><MoreHorizontal size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {cat==="notifs" && (
          <div className="max-w-[640px] space-y-4">
            <div><h2 className="text-base font-bold" style={{ color:P.fg }}>Notifications</h2></div>
            {[["Email alerts (critical incidents)","emailAlerts"],["Slack channel integration","slackAlerts"],["SMS alerts (failure events)","smsAlerts"],["Weekly summary report","weeklyReport"]].map(([l,k])=>(
              <div key={k} className="flex items-center justify-between p-4 rounded-xl" style={{ background:P.card, border:`1px solid ${P.border}` }}>
                <div className="text-sm font-medium" style={{ color:P.fg }}>{l}</div>
                <Toggle on={toggles[k]} onToggle={()=>flip(k)} />
              </div>
            ))}
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color:P.muted }}>Alert email recipients</label>
              <input defaultValue="ops-team@brno-facility.com, maintenance@brno.corp" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background:P.card, color:P.fg, border:`1px solid ${P.border}` }} /></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: NavPage; badge?: string; alert?: boolean }[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Radio, label: "Digital Twin", badge: "LIVE" },
  { icon: MessageSquare, label: "Ask EchoTwin" },
  { icon: AlertTriangle, label: "Incident Memory", alert: true },
  { icon: Clock, label: "Timeline" },
  { icon: BookOpen, label: "Manual Explorer" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileBarChart, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

function Sidebar({ page, setPage }: { page: NavPage; setPage: (p: NavPage) => void }) {
  return (
    <aside className="w-[210px] shrink-0 flex flex-col h-full" style={{ background:P.bg, borderRight:`1px solid ${P.border}` }}>
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background:P.accentSub }}>
            <Activity size={13} style={{ color:P.accent }} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight" style={{ color:P.fg }}>EchoTwin</div>
            <div className="text-[9px] uppercase tracking-[0.14em]" style={{ color:P.muted }}>Memory Layer</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
        {NAV.map(({ icon: Icon, label, badge, alert }) => {
          const active = page===label;
          return (
            <button key={label} onClick={()=>setPage(label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-[#2F435A]/60"
              style={{ background:active?P.elevated:"transparent", color:active?P.fg:P.muted }}>
              <Icon size={14} />
              <span className="text-xs font-medium flex-1">{label}</span>
              {badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background:P.accentSub, color:P.accent }}>{badge}</span>}
              {alert && <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:"rgba(192,57,43,0.2)", color:P.danger }}>2</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4" style={{ borderTop:`1px solid ${P.border}` }}>
        <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color:P.muted }}>Plant</div>
        <div className="text-xs font-medium" style={{ color:P.muted }}>Brno Facility 2</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <PulseIndicator color={P.success} size={5} />
          <span className="text-[10px]" style={{ color:P.muted }}>142 machines · Live</span>
        </div>
      </div>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────
function Header() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(()=>setTick(v=>v+1), 3500); return ()=>clearInterval(t); }, []);
  const bgProcs = ["Analyzing sensor stream…","Indexing new documents…","Updating risk scores…","Checking PM schedules…"];
  return (
    <header className="h-[54px] shrink-0 flex items-center justify-between px-6" style={{ background:P.card, borderBottom:`1px solid ${P.border}` }}>
      <div className="relative">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:P.muted }} />
        <input placeholder="Search machines, incidents, manuals…" className="pl-8 pr-4 py-1.5 text-xs rounded-xl outline-none w-64" style={{ background:P.elevated, color:P.fg, border:"none" }} />
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background:P.bg }}>
        <Loader2 size={10} className="animate-spin shrink-0" style={{ color:P.muted }} />
        <motion.span key={tick} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }} className="text-[10px]" style={{ color:P.muted }}>
          {bgProcs[tick % bgProcs.length]}
        </motion.span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-[#2F435A] transition-colors" style={{ background:P.elevated }}>
          <Bell size={14} style={{ color:P.muted }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background:P.danger }} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background:P.accent, color:"#fff" }}>DR</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2" style={{ background:P.success, borderColor:P.card }} />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold" style={{ color:P.fg }}>D. Reyes</div>
            <div className="text-[10px]" style={{ color:P.muted }}>Lead Technician</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── App Shell ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<NavPage>("Dashboard");
  const noHeader = page==="Ask EchoTwin" || page==="Manual Explorer";

  const renderPage = () => {
    switch (page) {
      case "Dashboard":       return <Dashboard />;
      case "Digital Twin":    return <DigitalTwin />;
      case "Ask EchoTwin":    return <AskEchoTwin />;
      case "Incident Memory": return <IncidentMemory />;
      case "Timeline":        return <TimelinePage />;
      case "Manual Explorer": return <ManualExplorer />;
      case "Analytics":       return <Analytics />;
      case "Reports":         return <Reports />;
      case "Settings":        return <SettingsPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background:P.bg, fontFamily:"'Inter', sans-serif" }}>
      <Sidebar page={page} setPage={setPage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!noHeader && <Header />}
        <main className="flex-1 overflow-hidden">
          <motion.div key={page} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.18, ease:"easeOut" }} className="h-full">
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
