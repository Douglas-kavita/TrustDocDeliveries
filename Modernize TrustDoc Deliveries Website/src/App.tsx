import { FormEvent, useEffect, useState } from "react";

const agentPhoto = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85";
const envelopePhoto =
  "https://images.unsplash.com/photo-1567473030492-533b30c5494c?auto=format&fit=crop&w=1200&q=85";
const professionalPhoto =
  "https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?auto=format&fit=crop&w=1200&q=85";
const riderPhoto =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=85";
const heroSlides = [
  { src: agentPhoto, alt: "A professional client service agent", label: "Personal assistance" },
  { src: professionalPhoto, alt: "A professional helping a client", label: "Guided support" },
  { src: envelopePhoto, alt: "A carefully prepared document envelope", label: "Sealed documents" },
  { src: riderPhoto, alt: "A delivery motorcycle ready for a journey", label: "Secure delivery" },
];

const navItems = [["Home", "/"], ["How it works", "/how-it-works"], ["Tracking", "/tracking"], ["Locations", "/locations"], ["Plans", "/plans"], ["Clients", "/clients"], ["Careers", "/careers"]];

const steps = [
  {
    number: "01",
    label: "Register",
    title: "Tell us what you need.",
    copy: "Create your client profile for free and share the document and collection location.",
  },
  {
    number: "02",
    label: "Monitor",
    title: "We follow its progress.",
    copy: "A dedicated TrustDoc agent monitors your application and keeps you informed at every milestone.",
  },
  {
    number: "03",
    label: "Seal",
    title: "Your document stays protected.",
    copy: "The document is collected in a tamper-evident envelope and kept sealed throughout the journey.",
  },
  {
    number: "04",
    label: "Deliver",
    title: "Your code completes the handover.",
    copy: "The sealed envelope is released only after your private code confirms your full name and ownership.",
  },
];

const Icon = ({
  name,
  className = "size-5",
}: {
  name: "arrow" | "check" | "lock" | "bell" | "pin" | "route" | "menu" | "close";
  className?: string;
}) => {
  const paths = {
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    route: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M7 6h5a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className={`logo ${light ? "logo--light" : ""}`}
      aria-label="TrustDocDeliveries home"
    >
      <span className="logo__mark">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 9.5 16 3l11 6.5v13L16 29 5 22.5Z" />
          <path d="m10 13 6 4 6-4M16 17v7" />
        </svg>
      </span>
      <span>
        <strong>TrustDocDeliveries</strong>
        <small>Handled with certainty</small>
      </span>
    </a>
  );
}

function RegisterModal({ onClose, onRegistered }: { onClose: () => void; onRegistered: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    onRegistered();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <button className="modal__backdrop" onClick={onClose} aria-label="Close registration" />
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {submitted ? (
          <div className="modal__success">
            <span className="success-icon">
              <Icon name="check" className="size-7" />
            </span>
            <p className="eyebrow">Registration received</p>
            <h2 id="register-title">You’re on the right route.</h2>
            <p>
              A TrustDoc agent will contact you to confirm your document request and next steps.
            </p>
            <button className="button button--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Client registration</p>
            <h2 id="register-title">Let’s secure your document journey.</h2>
            <form className="register-form" onSubmit={submit}>
              <label>
                Full name
                <input required autoComplete="name" placeholder="e.g. Amina Wanjiku" />
              </label>
              <label>
                Phone number
                <input required type="tel" autoComplete="tel" placeholder="+254 7XX XXX XXX" />
              </label>
              {codeRequested && <label>
                SMS verification code
                <input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter the code sent to your phone" />
              </label>}
              {!codeRequested ? (
                <button className="button button--primary button--wide" type="button" onClick={() => setCodeRequested(true)}>
                  Send verification code <Icon name="arrow" />
                </button>
              ) : (
                <button className="button button--primary button--wide" type="submit">
                  Verify and continue <Icon name="arrow" />
                </button>
              )}
              <p className="form-privacy">
                <Icon name="lock" /> Your details stay private and protected.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}


function SignInModal({ onClose, onAuthenticated }: { onClose: () => void; onAuthenticated: () => void }) {
  const [phone, setPhone] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [onClose]);
  const verify = (event: FormEvent) => {
    event.preventDefault();
    const normalized = phone.replace(/\D/g, "");
    const validPhone = normalized === "254700000001" || normalized === "0700000001";
    if (!validPhone || code !== "246810") {
      setError("Those demo details do not match. Check the test phone number and code below.");
      return;
    }
    onAuthenticated();
  };
  return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">
    <button className="modal__backdrop" onClick={onClose} aria-label="Close sign in" />
    <div className="modal__panel">
      <button className="modal__close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <p className="eyebrow">Client account access</p>
      <h2 id="signin-title">Welcome back.</h2>
      <p className="modal__intro">Enter your registered phone number and verify with your SMS code.</p>
      <form className="register-form" onSubmit={event => { event.preventDefault(); if (!codeRequested) setCodeRequested(true); else verify(event); }}>
        <label>Phone number<input required type="tel" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value)} placeholder="+254 700 000 001" /></label>
        {codeRequested && <label>SMS verification code<input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={event=>setCode(event.target.value.replace(/\D/g,"").slice(0,6))} placeholder="Enter 6-digit code" /></label>}
        {!codeRequested ? <button className="button button--primary button--wide" type="submit">Continue <Icon name="arrow" /></button> : <button className="button button--primary button--wide" type="submit">Verify and open dashboard <Icon name="arrow" /></button>}
        {error && <p className="signin-error" role="alert">{error}</p>}
        <div className="demo-credentials"><b>Demo access</b><span>Phone: +254 700 000 001</span><span>Code: 246810</span></div>
        <p className="form-privacy"><Icon name="lock" /> Demo verification only. Live SMS will be connected later.</p>
      </form>
    </div>
  </div>;
}

function ClientPortal({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState("Overview");
  const [messageDraft, setMessageDraft] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>(() => { try { return JSON.parse(window.localStorage.getItem("trustdoc_client_messages") || "[]"); } catch { return []; } });
  const sendClientMessage = () => { const value = messageDraft.trim(); if (!value) return; const next = [...sentMessages, value]; setSentMessages(next); window.localStorage.setItem("trustdoc_client_messages", JSON.stringify(next)); setMessageDraft(""); };
  const nav = ["Overview", "My Documents", "Tracking", "Payments", "Messages", "My Profile"];
  return <div className="client-portal">
    <aside className="client-sidebar">
      <Logo />
      <div className="client-side-label">CLIENT WORKSPACE</div>
      <nav>{nav.map(item=><button key={item} className={active===item?"active":""} onClick={()=>setActive(item)}><span className="client-nav-dot" />{item}</button>)}</nav>
      <button className="client-signout" onClick={onSignOut}>Sign out</button>
    </aside>
    <main className="client-main">
      <header className="client-topbar"><div><span className="client-breadcrumb">CLIENT PORTAL / {active.toUpperCase()}</span><h1>{active==="Overview"?"Good morning, Amina.":active}</h1></div><div className="client-user"><span className="client-avatar">AW</span><span><b>Amina Wanjiku</b><small>Client account</small></span></div></header>
      {active==="Overview" && <>
        <section className="client-welcome"><div><span className="client-kicker">YOUR TRUSTDOC SPACE</span><h2>Your documents.<br/><em>In safe hands.</em></h2><p>Follow every step of your document journey from one secure place.</p></div><div className="client-welcome-mark"><Icon name="lock" className="size-7"/></div></section>
        <div className="client-stat-grid"><article><small>ACTIVE REQUESTS</small><strong>01</strong><span>One document in progress</span></article><article><small>COMPLETED DELIVERIES</small><strong>02</strong><span>Successfully handed over</span></article><article><small>OUTSTANDING PAYMENTS</small><strong>KSh 0</strong><span>Nothing due right now</span></article></div>
        <section className="client-content-grid"><article className="client-card client-document-card"><div className="client-card-head"><div><span className="client-kicker">CURRENT REQUEST</span><h3>National ID collection</h3></div><span className="client-status">In progress</span></div><p className="client-reference">REFERENCE <b>TD-2048</b></p><div className="client-progress"><span style={{width:"58%"}}/></div><div className="client-progress-label"><span>Application monitoring</span><b>58%</b></div><div className="client-timeline"><div className="done"><i/>Request registered</div><div className="done"><i/>Application submitted</div><div className="current"><i/>Document monitoring</div><div><i/>Secure collection and delivery</div></div><button className="client-action" onClick={()=>setActive("Tracking")}>View tracking details <Icon name="arrow"/></button></article><article className="client-card client-profile-card"><span className="client-kicker">YOUR PROFILE</span><div className="client-profile-avatar">AW</div><h3>Amina Wanjiku</h3><p>+254 700 000 001</p><div className="client-profile-line"><span>Account status</span><b>Active</b></div><div className="client-profile-line"><span>Verification</span><b>Demo verified</b></div><button className="client-action" onClick={()=>setActive("My Profile")}>View my profile <Icon name="arrow"/></button></article></section>
        <section className="client-card client-help"><div><span className="client-kicker">NEED ASSISTANCE?</span><h3>We’re here to help.</h3><p>Send a message to the TrustDoc support team about your document journey.</p></div><button className="button button--primary" onClick={()=>setActive("Messages")}>Open messages <Icon name="arrow"/></button></section>
      </>}
      {active==="My Documents" && <section className="client-card client-page-card"><span className="client-kicker">DOCUMENT RECORDS</span><h2>My documents</h2><div className="client-record"><div><b>National ID collection</b><small>TD-2048 · Submitted 12 November 2026</small></div><span className="client-status">In progress</span></div><div className="client-record"><div><b>Good Conduct Certificate</b><small>TD-1982 · Completed 28 October 2026</small></div><span className="client-status client-status--done">Delivered</span></div><div className="client-record"><div><b>Birth Certificate</b><small>TD-1904 · Completed 14 October 2026</small></div><span className="client-status client-status--done">Delivered</span></div></section>}
      {active==="Tracking" && <section className="client-card client-page-card"><span className="client-kicker">LIVE JOURNEY STATUS</span><h2>Track TD-2048</h2><p className="client-muted">National ID collection · Nairobi</p><div className="client-timeline client-timeline--large"><div className="done"><i/>Request registered <small>12 Nov · 9:15 AM</small></div><div className="done"><i/>Application submitted <small>12 Nov · 10:40 AM</small></div><div className="current"><i/>Document monitoring <small>In progress</small></div><div><i/>Authorized release and secure sealing</div><div><i/>Verified rider assigned</div><div><i/>Recipient OTP and handover</div></div></section>}
      {active==="Payments" && <section className="client-card client-page-card"><span className="client-kicker">PAYMENT HISTORY</span><h2>Payments</h2><div className="client-record"><div><b>TD-1982 · Delivery completed</b><small>28 October 2026 · M-Pesa</small></div><strong>KSh 350</strong></div><div className="client-record"><div><b>TD-1904 · Delivery completed</b><small>14 October 2026 · M-Pesa</small></div><strong>KSh 350</strong></div><p className="client-muted">No outstanding payment on your current request.</p></section>}
      {active==="Messages" && <section className="client-card client-page-card"><span className="client-kicker">CLIENT SUPPORT</span><h2>Messages</h2><div className="client-message"><b>TrustDoc Support</b><small>Welcome to your client workspace. You can send a message without registering again.</small></div>{sentMessages.map((item,index)=><div className="client-message client-message--sent" key={index}><b>You</b><small>{item}</small></div>)}<textarea className="client-message-input" value={messageDraft} onChange={event=>setMessageDraft(event.target.value)} placeholder="Write a message to TrustDoc support..."/><button className="button button--primary" type="button" onClick={sendClientMessage} disabled={!messageDraft.trim()}>Send message</button><p className="client-muted">Demo mode: messages are saved in this browser only. Staff will not receive them until the shared inbox is connected.</p></section>}
      {active==="My Profile" && <section className="client-card client-page-card"><span className="client-kicker">PERSONAL INFORMATION</span><h2>My profile</h2><div className="client-profile-detail"><span>Full name</span><b>Amina Wanjiku</b></div><div className="client-profile-detail"><span>Phone number</span><b>+254 700 000 001</b></div><div className="client-profile-detail"><span>Account status</span><b>Active · Demo account</b></div><div className="client-profile-detail"><span>Preferred service area</span><b>Nairobi County</b></div></section>}
    </main>
  </div>;
}


function AgentPortal({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState("Overview");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("trustdoc_agent_messages") || "[]"); } catch { return []; } });
  const [taskStatus, setTaskStatus] = useState<Record<string,string>>(() => { try { return JSON.parse(localStorage.getItem("trustdoc_agent_tasks") || "{}"); } catch { return {}; } });
  const tasks = [{id:"TD-2048",client:"Amina Wanjiku",document:"National ID collection",area:"Nairobi CBD",status:"Monitoring"},{id:"TD-2051",client:"Peter Mwangi",document:"Good Conduct Certificate",area:"Westlands",status:"Awaiting confirmation"},{id:"TD-2054",client:"Grace Njeri",document:"Birth Certificate",area:"Kilimani",status:"Ready for collection"}];
  const updateTask = (id:string,value:string) => { const next={...taskStatus,[id]:value}; setTaskStatus(next); localStorage.setItem("trustdoc_agent_tasks",JSON.stringify(next)); };
  const send = () => { if(!draft.trim()) return; const next=[...messages,draft.trim()]; setMessages(next); localStorage.setItem("trustdoc_agent_messages",JSON.stringify(next)); setDraft(""); };
  const nav=["Overview","My Tasks","Documents","Clients","Tracking","Messages","Payments","My Profile","Settings"];
  return <div className="client-portal agent-portal">
    <aside className="client-sidebar"><Logo/><div className="client-side-label">AGENT WORKSPACE</div><nav>{nav.map(item=><button key={item} className={active===item?"active":""} onClick={()=>setActive(item)}><span className="client-nav-dot"/>{item}</button>)}</nav><button className="client-signout" onClick={onSignOut}>Sign out</button></aside>
    <main className="client-main">
      <header className="client-topbar"><div><span className="client-breadcrumb">TRUSTDOC / AGENT PORTAL / {active.toUpperCase()}</span><h1>{active==="Overview"?"Good morning, David.":active}</h1></div><div className="client-user"><span className="client-avatar">DO</span><span><b>David Otieno</b><small>Field Operations Agent</small></span></div></header>
      {active==="Overview" && <>
        <section className="client-welcome"><div><span className="client-kicker">YOUR OPERATIONS DESK</span><h2>Every detail.<br/><em>Accounted for.</em></h2><p>Manage assigned client requests, document readiness and secure handovers.</p></div><div className="client-welcome-mark"><Icon name="check" className="size-7"/></div></section>
        <div className="client-stat-grid"><article><small>ASSIGNED REQUESTS</small><strong>08</strong><span>Across your service area</span></article><article><small>AWAITING ACTION</small><strong>03</strong><span>Require your attention</span></article><article><small>COMPLETED THIS MONTH</small><strong>24</strong><span>Successful handovers</span></article></div>
        <section className="client-card client-page-card agent-wide"><div className="client-card-head"><div><span className="client-kicker">PRIORITY QUEUE</span><h2>Requests requiring attention</h2></div><button className="client-action" onClick={()=>setActive("My Tasks")}>View all tasks <Icon name="arrow"/></button></div>{tasks.map(t=><div className="client-record" key={t.id}><div><b>{t.document} · {t.id}</b><small>{t.client} · {t.area}</small></div><span className="client-status">{taskStatus[t.id]||t.status}</span></div>)}</section>
        <section className="client-card client-help"><div><span className="client-kicker">OPERATIONS REMINDER</span><h3>Protect the chain of custody.</h3><p>Never open a sealed document. Only authorized Huduma personnel may verify and reseal it.</p></div><span className="agent-shield">SECURE</span></section>
      </>}
      {active==="My Tasks" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">ASSIGNED WORK QUEUE</span><h2>My tasks</h2>{tasks.map(t=><div className="agent-task" key={t.id}><div><b>{t.id} · {t.document}</b><p>{t.client} · {t.area}</p><small>Update the operational status as work progresses.</small></div><select value={taskStatus[t.id]||t.status} onChange={e=>updateTask(t.id,e.target.value)}><option>Monitoring</option><option>Awaiting confirmation</option><option>Ready for collection</option><option>Collected and sealed</option><option>Assigned to rider</option><option>Completed</option><option>Exception reported</option></select></div>)}</section>}
      {active==="Documents" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">DOCUMENT CONTROL</span><h2>Document register</h2>{tasks.map(t=><div className="client-record" key={t.id}><div><b>{t.document}</b><small>{t.id} · {t.client}</small></div><span className="client-status">{taskStatus[t.id]||t.status}</span></div>)}<p className="client-muted">Demo records only. Record readiness; do not access or open sealed document contents.</p></section>}
      {active==="Clients" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">ASSIGNED CLIENTS</span><h2>Client directory</h2>{tasks.map(t=><div className="client-record" key={t.id}><div><b>{t.client}</b><small>{t.id} · {t.area}</small></div><span className="client-status">Active request</span></div>)}</section>}
      {active==="Tracking" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">JOURNEY MONITORING</span><h2>Delivery tracking</h2><div className="client-timeline client-timeline--large"><div className="done"><i/>Client request registered <small>12 Nov · 9:15 AM</small></div><div className="done"><i/>Application submission confirmed</div><div className="current"><i/>Agent monitoring and readiness checks</div><div><i/>Authorized release and secure resealing</div><div><i/>Verified rider assignment</div><div><i/>Recipient OTP and handover</div></div></section>}
      {active==="Messages" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">TEAM COMMUNICATIONS</span><h2>Messages & notices</h2><div className="client-message"><b>TrustDoc Operations</b><small>Welcome, David. Check this inbox for operational updates and administrator announcements.</small></div>{messages.map((m,i)=><div className="client-message client-message--sent" key={i}><b>You · Draft message</b><small>{m}</small></div>)}<textarea className="client-message-input" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write an internal message..."/><button className="button button--primary" onClick={send} disabled={!draft.trim()}>Save message</button><p className="client-muted">Demo mode: saved in this browser only; it is not delivered to other accounts or staff.</p></section>}
      {active==="Payments" && <section className="client-card client-page-card agent-wide"><span className="client-kicker">AGENT EARNINGS</span><h2>Payments</h2><div className="client-stat-grid"><article><small>THIS MONTH</small><strong>KSh 18,400</strong><span>Illustrative demo earnings</span></article><article><small>PAID</small><strong>KSh 14,200</strong><span>Illustrative demo figure</span></article><article><small>PENDING</small><strong>KSh 4,200</strong><span>Illustrative demo figure</span></article></div><p className="client-muted">These are sample figures, not actual payroll or payment records.</p></section>}
      {(active==="My Profile"||active==="Settings") && <section className="client-card client-page-card agent-wide"><span className="client-kicker">AGENT ACCOUNT</span><h2>{active}</h2><div className="client-profile-detail"><span>Name</span><b>David Otieno</b></div><div className="client-profile-detail"><span>Role</span><b>Field Operations Agent</b></div><div className="client-profile-detail"><span>Service area</span><b>Nairobi County</b></div><div className="client-profile-detail"><span>Account</span><b>Demo agent · Not production verified</b></div></section>}
      <p className="agent-demo-note">DEMO WORKSPACE · Sample records and actions are stored locally in this browser. No live Admin, client, rider or backend connection is active yet.</p>
    </main>
  </div>;
}

function RiderPortal({onSignOut}:{onSignOut:()=>void}) {
 const [active,setActive]=useState("Overview"),[area,setArea]=useState("All areas"),[order,setOrder]=useState("Latest date & time"),[draft,setDraft]=useState("");
 const [status,setStatus]=useState<Record<string,string>>(()=>{try{return JSON.parse(localStorage.getItem("trustdoc_rider_jobs")||"{}")}catch{return {}}});
 const [reports,setReports]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("trustdoc_rider_reports")||"[]")}catch{return []}});
 const jobs=[{id:"TD-1048",client:"Amina Wanjiku",doc:"National ID collection",from:"Huduma Centre · Nairobi CBD",to:"Westlands",area:"Westlands",date:"2026-11-15",time:"09:30",fee:280,initial:"Assigned"},{id:"TD-1045",client:"Peter Mwangi",doc:"Good Conduct Certificate",from:"Nairobi CBD",to:"Kilimani",area:"Kilimani",date:"2026-11-15",time:"11:15",fee:320,initial:"In transit"},{id:"TD-1039",client:"Grace Njeri",doc:"Birth Certificate",from:"Upper Hill",to:"Lavington",area:"Lavington",date:"2026-11-14",time:"15:45",fee:300,initial:"Delivered"},{id:"TD-1036",client:"Brian Otieno",doc:"Certificate collection",from:"Westlands",to:"Parklands",area:"Parklands",date:"2026-11-14",time:"13:20",fee:260,initial:"Delivered"},{id:"TD-1032",client:"Mercy Achieng",doc:"Document delivery",from:"Nairobi CBD",to:"Kilimani",area:"Kilimani",date:"2026-11-13",time:"10:00",fee:320,initial:"Delivered"}];
 const areas=[...new Set(jobs.map(j=>j.area))];
 const ranked=areas.map(a=>({area:a,count:jobs.filter(j=>j.area===a).length})).sort((a,b)=>b.count-a.count||a.area.localeCompare(b.area));
 const shown=jobs.filter(j=>area==="All areas"||j.area===area).sort((a,b)=>order==="Area, then date & time"?a.area.localeCompare(b.area)||a.date.localeCompare(b.date)||a.time.localeCompare(b.time):order==="Earliest date & time"?a.date.localeCompare(b.date)||a.time.localeCompare(b.time):b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
 const update=(id:string,v:string)=>{const n={...status,[id]:v};setStatus(n);localStorage.setItem("trustdoc_rider_jobs",JSON.stringify(n));};
 const rows=(list:typeof jobs)=>list.map(j=><div className="rider-job-row" key={j.id}><div className="rider-job-main"><b>{j.id} · {j.doc}</b><span>{j.client}</span><small>{j.from} → {j.to}</small></div><div className="rider-job-time"><b>{j.date}</b><span>{j.time}</span></div><strong className="rider-job-fee">KSh {j.fee}</strong><select aria-label={"Update "+j.id} value={status[j.id]||j.initial} onChange={e=>update(j.id,e.target.value)}><option>Assigned</option><option>Accepted</option><option>Picked up</option><option>In transit</option><option>Delivered</option><option>Exception reported</option></select></div>);
 const nav=["Overview","Documents","Jobs","Earnings","Complaints","Reports","Settings"];
 const send=()=>{if(!draft.trim())return;const n=[...reports,draft.trim()];setReports(n);localStorage.setItem("trustdoc_rider_reports",JSON.stringify(n));setDraft("");};
 return <div className="client-portal rider-portal"><aside className="client-sidebar"><Logo/><div className="client-side-label">RIDER WORKSPACE</div><nav>{nav.map(x=><button key={x} className={active===x?"active":""} onClick={()=>setActive(x)}><span className="client-nav-dot"/>{x}</button>)}</nav><button className="client-signout" onClick={onSignOut}>Sign out</button></aside><main className="client-main"><header className="client-topbar"><div><span className="client-breadcrumb">TRUSTDOC / RIDER PORTAL / {active.toUpperCase()}</span><h1>{active==="Overview"?"Good day, James.":active}</h1></div><div className="client-user"><span className="client-avatar">JK</span><span><b>James Kariuki</b><small>Delivery rider · Nairobi</small></span></div></header>
 {active==="Overview"&&<><section className="client-welcome rider-welcome"><div><span className="client-kicker">YOUR DELIVERY CONTROL</span><h2>Every handover.<br/><em>Handled securely.</em></h2><p>Manage assigned routes, delivery times and every sealed TrustDoc package.</p></div><div className="client-welcome-mark"><Icon name="route"/></div></section><div className="client-stat-grid"><article><small>ACTIVE JOBS</small><strong>02</strong><span>Assigned and in transit</span></article><article><small>COMPLETED JOBS</small><strong>03</strong><span>Sample delivery history</span></article><article><small>RIDER EARNINGS</small><strong>KSh 1,480</strong><span>Illustrative demo total</span></article></div><section className="client-card client-page-card agent-wide"><span className="client-kicker">AREA PERFORMANCE</span><h2>Ranked delivery areas</h2>{ranked.map((r,i)=><div className="rider-area-rank" key={r.area}><b>#{i+1}</b><span>{r.area}</span><strong>{r.count} jobs</strong></div>)}</section><section className="client-card client-page-card agent-wide"><span className="client-kicker">NEXT ASSIGNMENTS</span><h2>Upcoming jobs</h2>{rows(jobs.filter(j=>(status[j.id]||j.initial)!=="Delivered").slice(0,3))}</section></>}
 {active==="Jobs"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">ROUTE & DELIVERY REGISTER</span><h2>My jobs</h2><div className="rider-job-filters"><label>Delivery area<select value={area} onChange={e=>setArea(e.target.value)}><option>All areas</option>{areas.map(a=><option key={a}>{a}</option>)}</select></label><label>Sort jobs<select value={order} onChange={e=>setOrder(e.target.value)}><option>Latest date & time</option><option>Earliest date & time</option><option>Area, then date & time</option></select></label></div>{rows(shown)}<p className="client-muted">Demo records. Update each job as the delivery progresses.</p></section>}
 {active==="Documents"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">SEALED PACKAGE CONTROL</span><h2>Documents in custody</h2>{jobs.filter(j=>(status[j.id]||j.initial)!=="Delivered").map(j=><div className="client-record" key={j.id}><div><b>{j.id} · {j.doc}</b><small>{j.client} · {j.from}</small></div><span className="client-status">Sealed · {status[j.id]||j.initial}</span></div>)}<p className="client-muted">Never open or inspect document contents. Verify the package seal and recipient handover only.</p></section>}
 {active==="Earnings"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">RIDER SHARE ONLY</span><h2>My earnings</h2><div className="client-stat-grid"><article><small>TOTAL EARNED</small><strong>KSh 1,480</strong><span>Illustrative demo</span></article><article><small>PAID</small><strong>KSh 1,180</strong><span>Illustrative demo</span></article><article><small>PENDING</small><strong>KSh 300</strong><span>Illustrative demo</span></article></div>{jobs.filter(j=>j.initial==="Delivered").map(j=><div className="client-record" key={j.id}><div><b>{j.id} · {j.doc}</b><small>{j.date} · {j.area} · {j.client}</small></div><strong>KSh {j.fee}</strong></div>)}</section>}
 {active==="Complaints"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">INCIDENT MANAGEMENT</span><h2>Complaints & exceptions</h2><textarea className="client-message-input" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Report delay, damaged seal, route issue or recipient verification problem..."/><button className="button button--primary" onClick={send} disabled={!draft.trim()}>Save incident report</button>{reports.map((m,i)=><div className="client-message" key={i}><b>Rider report · {i+1}</b><small>{m}</small></div>}<p className="client-muted">Demo reports are stored on this device only, not sent to operations staff.</p></section>}
 {active==="Reports"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">PERFORMANCE BY AREA</span><h2>Area & time ranking</h2>{ranked.map((r,i)=><div className="rider-area-rank" key={r.area}><b>#{i+1}</b><span>{r.area}</span><strong>{r.count} deliveries</strong></div>)}<h3 className="rider-subheading">Delivery history · newest first</h3>{rows([...jobs].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)))}</section>}
 {active==="Settings"&&<section className="client-card client-page-card agent-wide"><span className="client-kicker">RIDER ACCOUNT</span><h2>Settings & profile</h2><div className="client-profile-detail"><span>Name</span><b>James Kariuki</b></div><div className="client-profile-detail"><span>Rider ID</span><b>RIDER-001</b></div><div className="client-profile-detail"><span>Operating area</span><b>Nairobi County</b></div><div className="client-profile-detail"><span>Account</span><b>Demo rider · Not production verified</b></div><div className="client-profile-detail"><span>Safety</span><b>Never open sealed packages</b></div></section>}
 <p className="agent-demo-note">DEMO RIDER WORKSPACE · Sample jobs, status changes and incident reports are stored locally. GPS dispatch, live Admin, client and payment connections are not active.</p></main></div>;
}

function RiderLogin({onAuthenticated}:{onAuthenticated:()=>void}) {
 const [password,setPassword]=useState(""),[error,setError]=useState("");
 return <div className="agent-login-wrap"><div className="agent-login-card"><Logo/><span className="client-kicker">AUTHORIZED PERSONNEL</span><h1>Rider sign in</h1><p>Access your secure delivery workspace.</p><form className="register-form" onSubmit={e=>{e.preventDefault();if(password==="Rider@2026"){localStorage.setItem("trustdoc_rider_authenticated","true");onAuthenticated();}else setError("Incorrect demo password.");}}><label>Rider ID<input value="RIDER-001" readOnly/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label>{error&&<p className="signin-error">{error}</p>}<button className="button button--primary button--wide" type="submit">Open Rider Portal <Icon name="arrow"/></button></form><div className="demo-credentials"><b>Rider demo credentials</b><span>Rider ID: RIDER-001</span><span>Password: Rider@2026</span></div><p className="agent-demo-note">Demo access only; not production authentication.</p><a className="agent-back-link" href="/">← Back to TrustDoc website</a></div></div>;
}

function AgentLogin({ onAuthenticated }: { onAuthenticated:()=>void }) {
  const [email,setEmail]=useState("agent@trustdoc.co.ke");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  return <div className="agent-login-wrap"><div className="agent-login-card"><Logo/><span className="client-kicker">AUTHORIZED PERSONNEL</span><h1>Agent sign in</h1><p>Access your TrustDoc operations workspace.</p><form className="register-form" onSubmit={e=>{e.preventDefault();if(email.trim().toLowerCase()==="agent@trustdoc.co.ke"&&password==="Agent@2026"){localStorage.setItem("trustdoc_agent_authenticated","true");onAuthenticated();}else setError("Incorrect demo email or password. Please use the credentials shown below.");}}><label>Work email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label>{error&&<p className="signin-error">{error}</p>}<button className="button button--primary button--wide" type="submit">Open Agent Portal <Icon name="arrow"/></button></form><div className="demo-credentials"><b>Agent demo credentials</b><span>Email: agent@trustdoc.co.ke</span><span>Password: Agent@2026</span></div><p className="agent-demo-note">Demo access only. This is not a secure production login.</p><a className="agent-back-link" href="/">← Back to TrustDoc website</a></div></div>;
}

function StaffChat({ registered, onRegister }: { registered: boolean; onRegister: () => void }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  return <>
    {open && <div className="staff-chat">
      <div className="staff-chat__head"><span><b>TrustDoc staff</b><small>Client support</small></span><button onClick={()=>setOpen(false)} aria-label="Close chat">×</button></div>
      <div className="staff-chat__body">
        {!registered ? <><p>Welcome. To message our staff directly, please register as a client first.</p><button className="button button--primary button--wide" onClick={onRegister}>Register to continue</button></> :
        <><p className="staff-chat__welcome">You can now start a support conversation.</p><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a message to TrustDoc staff..." /><button className="button button--primary button--wide" onClick={()=>{if(message.trim()){setNotice("Your message is ready. Staff messaging will be connected to the secure client inbox.");setMessage("");}}}>Send message</button>{notice && <small className="staff-chat__notice">{notice}</small>}</>}
      </div>
    </div>}
    <button className="staff-chat-launch" onClick={()=>setOpen(v=>!v)} aria-label="Chat with TrustDoc staff"><span>✉</span><small>Chat with us</small></button>
  </>;
}

function App() {
  const currentPage = window.location.pathname.replace(/\/$/, "") || "/";
  const pageMap: Record<string, string> = { "/how-it-works": "how-it-works", "/tracking": "tracking", "/locations": "locations", "/plans": "plans", "/clients": "clients", "/careers": "careers" };
  const [modalOpen, setModalOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [clientRegistered, setClientRegistered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [clientPortalOpen, setClientPortalOpen] = useState(false);
  const [clientAuthenticated, setClientAuthenticated] = useState(() => window.localStorage.getItem("trustdoc_client_authenticated") === "true");
  const [agentAuthenticated, setAgentAuthenticated] = useState(() => window.localStorage.getItem("trustdoc_agent_authenticated") === "true");
  const [riderAuthenticated, setRiderAuthenticated] = useState(() => window.localStorage.getItem("trustdoc_rider_authenticated") === "true");

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % steps.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { const timer = window.setInterval(() => setHeroSlide((v) => (v + 1) % heroSlides.length), 5000); return () => window.clearInterval(timer); }, []);

  if (currentPage === "/rider/login" && !riderAuthenticated) return <RiderLogin onAuthenticated={() => { setRiderAuthenticated(true); window.location.href = "/rider"; }} />;
  if ((currentPage === "/rider" || currentPage === "/rider/login") && riderAuthenticated) return <RiderPortal onSignOut={() => { localStorage.removeItem("trustdoc_rider_authenticated"); setRiderAuthenticated(false); window.location.href = "/rider/login"; }} />;
  if (currentPage === "/agent/login" && !agentAuthenticated) return <AgentLogin onAuthenticated={() => { setAgentAuthenticated(true); window.history.replaceState({}, "", "/agent"); }} />;
  if ((currentPage === "/agent" || currentPage === "/agent/login") && agentAuthenticated) return <AgentPortal onSignOut={() => { localStorage.removeItem("trustdoc_agent_authenticated"); setAgentAuthenticated(false); window.history.replaceState({}, "", "/agent/login"); }} />;
  if ((clientPortalOpen || currentPage === "/client") && clientAuthenticated) return <ClientPortal onSignOut={() => { window.localStorage.removeItem("trustdoc_client_authenticated"); setClientAuthenticated(false); setClientPortalOpen(false); window.history.replaceState({}, "", "/"); window.location.reload(); }} />;

  const openRegister = () => {
    setMenuOpen(false);
    setSignInOpen(false);
    setModalOpen(true);
  };

  const openSignIn = () => {
    setMenuOpen(false);
    setModalOpen(false);
    setSignInOpen(true);
  };

  return (
    <div className="app" data-page={pageMap[currentPage] || "home"}>
      <header className="site-header">
        <div className="nav-shell">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <a key={id} href={id}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            {riderAuthenticated ? (<button type="button" className="client-profile-shortcut rider-profile-shortcut" onClick={() => { window.location.href = "/rider"; }} title="Rider profile" aria-label="Open Rider workspace"><span>JK</span></button>) : agentAuthenticated ? (
              <button type="button" className="client-profile-shortcut agent-profile-shortcut" onClick={() => { window.history.pushState({}, "", "/agent"); window.location.href = "/agent"; }} aria-label="Open your agent profile and workspace" title="Agent profile">
                <span>DO</span>
              </button>
            ) : clientAuthenticated ? (
              <button type="button" className="client-profile-shortcut" onClick={() => { window.history.pushState({}, "", "/client"); setClientPortalOpen(true); }} aria-label="Open your client profile and portal" title="My client portal">
                <span>AW</span>
              </button>
            ) : <>
              <button type="button" className="signin-link" onClick={openSignIn}>Sign in</button>
              <button className="button button--small button--primary" onClick={openRegister}>Register free</button>
            </>}
          </div>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          {menuOpen && (
            <div className="mobile-nav">
              {navItems.map(([label, id]) => (
                <a key={id} href={id} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              {riderAuthenticated ? <button className="mobile-profile-link" onClick={() => { setMenuOpen(false); window.location.href = "/rider"; }}>My profile · Rider workspace</button> : agentAuthenticated ? <button className="mobile-profile-link" onClick={() => { setMenuOpen(false); window.location.href = "/agent"; }}>My profile · Agent workspace</button> : clientAuthenticated ? <button className="mobile-profile-link" onClick={() => { setMenuOpen(false); window.history.pushState({}, "", "/client"); setClientPortalOpen(true); }}>My profile · Client portal</button> : <><button type="button" onClick={openSignIn}>Sign in</button><button onClick={openRegister}>Register free</button></>}
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="orb orb--one" />
          <div className="orb orb--two" />
          <div className="section-shell hero__grid">
            <div className="hero__copy reveal">
              <div className="location-pill">
                <span /> Nairobi · Secure document delivery
              </div>
              <h1>
                Your document journey, <em>protected</em> end to end.
              </h1>
              <p>
                TrustDoc monitors, collects, seals and delivers important documents through verified
                Kenyan agents—without repeat trips or long queues.
              </p>
              <div className="hero__actions">
                <button className="button button--primary" onClick={openRegister}>
                  Register for free <Icon name="arrow" />
                </button>
                <a className="button button--secondary" href="/tracking">
                  Track your delivery
                </a>
              </div>
              <div className="hero__checks">
                <span>
                  <Icon name="check" /> Free registration
                </span>
                <span>
                  <Icon name="check" /> Free monitoring
                </span>
                <span>
                  <Icon name="check" /> Verified handover
                </span>
              </div>
            </div>
            <div className="hero__visual reveal reveal--delay">
              <div className="photo-main hero-carousel">{heroSlides.map((slide, index) => <img key={slide.src} src={slide.src} alt={slide.alt} className={heroSlide === index ? "is-active" : ""} />)}<div className="hero-carousel__caption">{heroSlides[heroSlide].label}</div><div className="hero-carousel__dots">{heroSlides.map((slide, index) => <button key={slide.src} type="button" className={heroSlide === index ? "active" : ""} aria-label={"Show image " + (index + 1)} onClick={() => setHeroSlide(index)} />)}</div></div>
              <div className="floating-card floating-card--status">
                <span className="pulse-dot" />
                <div>
                  <small>Document status</small>
                  <strong>Ready for collection</strong>
                </div>
                <span className="status-code">TD</span>
              </div>
              <div className="floating-card floating-card--secure">
                <span className="mini-icon">
                  <Icon name="lock" />
                </span>
                <div>
                  <strong>Secure handover</strong>
                  <small>Code verified delivery</small>
                </div>
              </div>
              <div className="photo-accent">
                <img src={envelopePhoto} alt="A sealed document envelope" />
              </div>
            </div>
          </div>
          <div className="trust-strip">
            <div>
              <strong>FREE</strong>
              <span>Registration</span>
            </div>
            <div>
              <strong>FREE</strong>
              <span>Document monitoring</span>
            </div>
            <div>
              <strong>KSh 300</strong>
              <span>Standard same-day</span>
            </div>
            <div>
              <strong>≤ KSh 400</strong>
              <span>Home or office</span>
            </div>
          </div>
        </section>

        {currentPage === "/" && <section className="page-overview section-pad"><div className="section-shell"><div className="section-heading center-heading"><p className="eyebrow">Explore TrustDoc</p><h2>Everything you need, in one place.</h2></div></div></section>}
        <section className="process section-pad" id="how-it-works" data-page-section="how-it-works">
          <div className="section-shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">01 / How it works</p>
                <h2>
                  Less waiting.
                  <br />
                  More control.
                </h2>
              </div>
              <p>
                A clear, visible chain of care—from the first request to your verified handover.
              </p>
            </div>
            <div className="process-stage">
              <div className="step-nav">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    className={activeStep === index ? "active" : ""}
                    onClick={() => setActiveStep(index)}
                  >
                    <span>{step.number}</span>
                    {step.label}
                    <i />
                  </button>
                ))}
              </div>
              <div className="step-window">
                <div className="step-visual" key={`visual-${activeStep}`}>
                  {activeStep === 2 ? (
                    <img src={envelopePhoto} alt="Secure sealed envelope" />
                  ) : activeStep === 3 ? (
                    <img src={riderPhoto} alt="Delivery rider transporting a sealed document" />
                  ) : (
                    <img
                      src={activeStep === 0 ? professionalPhoto : agentPhoto}
                      alt="TrustDoc professional supporting a client"
                    />
                  )}
                  <span className="step-number">{steps[activeStep].number}</span>
                </div>
                <div className="step-copy" key={`copy-${activeStep}`}>
                  <p className="eyebrow">Step {steps[activeStep].number}</p>
                  <h3>{steps[activeStep].title}</h3>
                  <p>{steps[activeStep].copy}</p>
                  <div className="progress-line">
                    <i style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
                  </div>
                  <span>
                    {activeStep + 1} of {steps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

        <div className="section-explore"><a className="button button--secondary" href="/how-it-works">Explore How it works <Icon name="arrow" /></a></div>
        </section>

        
        <section className="security section-pad" id="tracking" data-page-section="tracking">
          <div className="section-shell security__grid">
            <div className="security__visual">
              <div className="envelope-card">
                <div className="envelope-flap" />
                <div className="seal">
                  <Icon name="lock" />
                </div>
                <span className="code-label">VERIFIED SEAL · TD—2048</span>
              </div>
              <div className="route-line">
                <span />
                <i />
                <b />
              </div>
            </div>
            <div>
              <p className="eyebrow eyebrow--gold">02 / Tracking</p>
              <h2>
                Two secure seals.
                <br />
                One accountable journey.
              </h2>
              <p>
                Follow every milestone from witnessed collection to the final code-confirmed
                handover. The envelope stays sealed. You stay informed.
              </p>
              <div className="mini-features">
                <div>
                  <Icon name="bell" />
                  <span>
                    <strong>Live notifications</strong>
                    <small>Updates at every key stage</small>
                  </span>
                </div>
                <div>
                  <Icon name="route" />
                  <span>
                    <strong>Visible journey</strong>
                    <small>Clear chain of responsibility</small>
                  </span>
                </div>
              </div>
              
              
            </div>
          </div>

        <div className="section-explore"><a className="button button--secondary" href="/tracking">Explore Tracking <Icon name="arrow" /></a></div>
        </section>

        <section className="locations section-pad" id="locations" data-page-section="locations">
          <div className="section-shell">
            <div className="section-heading split-heading light">
              <div>
                <p className="eyebrow eyebrow--gold">03 / Supported locations</p>
                <h2>
                  Across Nairobi.
                  <br />
                  On your route.
                </h2>
              </div>
              <p>
                Collection points and flexible delivery routes designed around where you live and
                work.
              </p>
            </div>
            <div className="location-grid">
              {[
                "Nairobi CBD",
                "Eastlands",
                "Westlands",
                "Kasarani",
                "Lang’ata",
                "Kiambu routes",
              ].map((location, index) => (
                <article key={location}>
                  <span>0{index + 1}</span>
                  <Icon name="pin" />
                  <div>
                    <h3>{location}</h3>
                    <p>{index % 2 ? "Home & office delivery" : "Collection & delivery"}</p>
                  </div>
                </article>
              ))}
            </div>
            
          </div>

        
        <div className="section-explore"><a className="button button--secondary button--light" href="/locations">Explore Locations <Icon name="arrow" /></a></div>
        </section>

        <section className="options section-pad" id="plans" data-page-section="plans">
          <div className="section-shell">
            <div className="section-heading center-heading">
              <p className="eyebrow">04 / Simple pricing</p>
              <h2>
                Three clear options.
                <br />
                No hidden monitoring fee.
              </h2>
            </div>
            <div className="price-grid">
              <article>
                <span>01</span>
                <p className="price">Free</p>
                <h3>Register & monitor</h3>
                <p>Create your record and let an agent follow your document’s progress.</p>
                <button onClick={openRegister}>
                  Get started <Icon name="arrow" />
                </button>
              </article>
              <article className="featured">
                <div className="popular">Most popular</div>
                <span>02</span>
                <p className="price">KSh 300</p>
                <h3>Standard delivery</h3>
                <p>Same-day delivery to a convenient agreed TrustDoc meeting point.</p>
                <button onClick={openRegister}>
                  Choose standard <Icon name="arrow" />
                </button>
              </article>
              <article>
                <span>03</span>
                <p className="price">Up to KSh 400</p>
                <h3>Doorstep delivery</h3>
                <p>Secure handover at your home, office or another approved location.</p>
                <button onClick={openRegister}>
                  Choose doorstep <Icon name="arrow" />
                </button>
              </article>
            </div>
          </div>

        
        <div className="section-explore"><a className="button button--secondary" href="/plans">Explore Plan <Icon name="arrow" /></a></div>
        </section>

        
        <section className="clients section-pad" id="clients" data-page-section="clients">
          <div className="section-shell clients__grid">
            <div>
              <p className="eyebrow">05 / For clients</p>
              <h2>Your private code proves it’s really you.</h2>
              <p className="lead">
                Once payment is confirmed, you receive a secret delivery code. It is never printed
                on the envelope and remains known only to you.
              </p>
              <div className="code-flow">
                <div>
                  <span>1</span>
                  <p>
                    <strong>Receive your code</strong>
                    <small>Sent privately after payment.</small>
                  </p>
                </div>
                <div>
                  <span>2</span>
                  <p>
                    <strong>Meet your TrustDoc agent</strong>
                    <small>Your document arrives in a sealed envelope.</small>
                  </p>
                </div>
                <div>
                  <span>3</span>
                  <p>
                    <strong>Verify and receive</strong>
                    <small>
                      Your code reveals your full name to the agent, then the envelope is handed
                      over.
                    </small>
                  </p>
                </div>
              </div>
              <button className="button button--primary" onClick={openRegister}>
                Register as a client <Icon name="arrow" />
              </button>
              
            </div>
            <div className="code-demo">
              <div className="code-demo__top">
                <span>
                  <Icon name="lock" /> Secure recipient check
                </span>
                <small>ENCRYPTED</small>
              </div>
              <div className="code-demo__body">
                <p>Enter your 6-digit delivery code</p>
                <div className="code-digits">
                  <span>8</span>
                  <span>3</span>
                  <span>5</span>
                  <span>1</span>
                  <span>9</span>
                  <span>2</span>
                </div>
                <div className="verified">
                  <Icon name="check" />
                  <span>
                    <strong>Identity verified</strong>
                    <small>Recipient: Amina Wanjiku</small>
                  </span>
                </div>
              </div>
              <p className="code-demo__footer">
                Release envelope only after successful verification.
              </p>
            </div>
          </div>

        
        <div className="section-explore"><a className="button button--secondary" href="/clients">Explore Clients <Icon name="arrow" /></a></div>
        </section>



        <section className="careers section-pad" id="careers" data-page-section="careers">
          <div className="section-shell">
            <div className="section-heading center-heading">
              <p className="eyebrow">06 / Careers at TrustDoc</p>
              <h2>
                Build trust.
                <br />
                Move Kenya forward.
              </h2>
              <p>
                Join a team that makes important document journeys simpler, safer and more human.
              </p>
            </div>
            <div className="career-grid">
              <article className="career-card">
                <div className="career-card__photo">
                  <img src={professionalPhoto} alt="Professional Black African TrustDoc agent" />
                  <span>Agent</span>
                </div>
                <div className="career-card__content">
                  <div>
                    <p className="eyebrow">Client success & operations</p>
                    <h3>TrustDoc Agent</h3>
                  </div>
                  <p>
                    Register clients, monitor documents, send timely notifications, collect
                    application slips and make sure every delivery is completed successfully.
                  </p>
                  <ul>
                    <li>
                      <Icon name="check" /> Competitive pay rates
                    </li>
                    <li>
                      <Icon name="check" /> Structured training and support
                    </li>
                    <li>
                      <Icon name="check" /> Meaningful client-facing work
                    </li>
                  </ul>
                  <a href="mailto:careers@trustdoc.co.ke?subject=TrustDoc Agent application">
                    Apply as an agent <Icon name="arrow" />
                  </a>
                </div>
              </article>
              <article className="career-card">
                <div className="career-card__photo">
                  <img src={riderPhoto} alt="Black African delivery rider on a motorcycle" />
                  <span>Rider</span>
                </div>
                <div className="career-card__content">
                  <div>
                    <p className="eyebrow">Secure logistics</p>
                    <h3>Delivery Rider</h3>
                  </div>
                  <p>
                    Use your own transport to move sealed document envelopes safely. The envelope is
                    released only when the client provides the correct private code.
                  </p>
                  <ul>
                    <li>
                      <Icon name="check" /> Self-transport delivery routes
                    </li>
                    <li>
                      <Icon name="check" /> Sealed envelopes only
                    </li>
                    <li>
                      <Icon name="check" /> Code-confirmed handovers
                    </li>
                  </ul>
                  <a href="mailto:careers@trustdoc.co.ke?subject=TrustDoc Rider application">
                    Apply as a rider <Icon name="arrow" />
                  </a>
                </div>
              </article>
            </div>
            
          </div>

        
        <div className="section-explore"><a className="button button--secondary" href="/careers">Explore Careers <Icon name="arrow" /></a></div>
        </section>

        <section className="cta">
          <div className="section-shell cta__inner">
            <div>
              <p className="eyebrow eyebrow--gold">Ready to begin?</p>
              <h2>
                One registration.
                <br />
                Fewer unnecessary trips.
              </h2>
            </div>
            <button className="button button--light" onClick={openRegister}>
              Register for free <Icon name="arrow" />
            </button>
          </div>
        </section>
      </main>

      <footer id="portal">
        <div className="section-shell footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              Secure document monitoring, witnessed sealing, verified collection and trusted
              delivery across Nairobi.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="/how-it-works">How it works</a>
            <a href="#tracking">Tracking</a>
            <a href="/locations">Locations</a>
            <a href="/careers">Careers</a>
          </div>
          <div>
            <h3>Clients</h3>
            <a href="#clients">Secure handover</a>
            <button onClick={openRegister}>Free registration</button>
            <a href="#home">Client sign in</a>
          </div>
          <div>
            <h3>Portal access</h3>
            <a href="/agent/login">Agent portal</a>
            <a href="#portal">Rider portal</a>
            <a href="#portal">Admin portal</a>
            <small>Authorized team members only</small>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="tel:+254759838426">0759 838 426</a>
            <p>
              Nairobi, Kenya
              <br />
              Monday—Saturday
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="section-shell">
            <span>© {new Date().getFullYear()} TrustDocDeliveries</span>
            <span>Privacy · Terms · Security</span>
          </div>
        </div>
      </footer>
      {modalOpen && <RegisterModal onClose={() => setModalOpen(false)} onRegistered={() => setClientRegistered(true)} />}
      {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} onAuthenticated={() => { window.localStorage.setItem("trustdoc_client_authenticated", "true"); setClientAuthenticated(true); setSignInOpen(false); setClientPortalOpen(true); window.history.replaceState({}, "", "/client"); }} />}
      <StaffChat registered={clientAuthenticated || clientRegistered} onRegister={() => { setModalOpen(true); setSignInOpen(false); }} />
    </div>
  );
}

export default App;
