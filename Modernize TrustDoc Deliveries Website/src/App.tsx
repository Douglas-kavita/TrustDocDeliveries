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

function RegisterModal({ onClose }: { onClose: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        ) : !showForm ? (
          <>
            <p className="eyebrow">Get started</p>
            <h2 id="register-title">How would you like to register?</h2>
            <p className="modal__intro">Choose your registration type to continue securely.</p>
            <button className="role-card" onClick={() => setShowForm(true)}>
              <span className="role-card__icon">
                <Icon name="lock" />
              </span>
              <span>
                <strong>Register as a client</strong>
                <small>Request, monitor and receive your documents.</small>
              </span>
              <Icon name="arrow" />
            </button>
            <p className="modal__note">
              <Icon name="check" /> Registration and monitoring are always free.
            </p>
          </>
        ) : (
          <>
            <button className="text-back" onClick={() => setShowForm(false)}>
              ← Back
            </button>
            <p className="eyebrow">Client registration</p>
            <h2 id="register-title">Let’s secure your document journey.</h2>
            <form className="register-form" onSubmit={submit}>
              <label>
                Full name
                <input required placeholder="e.g. Amina Wanjiku" />
              </label>
              <label>
                Phone number
                <input required type="tel" placeholder="+254 7XX XXX XXX" />
              </label>
              <label>
                Document type
                <select required defaultValue="">
                  <option value="" disabled>
                    Select document
                  </option>
                  <option>National ID</option>
                  <option>Passport</option>
                  <option>Driving licence</option>
                  <option>Birth certificate</option>
                  <option>Other official document</option>
                </select>
              </label>
              <button className="button button--primary button--wide" type="submit">
                Complete registration <Icon name="arrow" />
              </button>
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

function App() {
  const currentPage = window.location.pathname.replace(/\/$/, "") || "/";
  const pageMap: Record<string, string> = { "/how-it-works": "how-it-works", "/tracking": "tracking", "/locations": "locations", "/plans": "plans", "/clients": "clients", "/careers": "careers" };
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % steps.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { const timer = window.setInterval(() => setHeroSlide((v) => (v + 1) % heroSlides.length), 5000); return () => window.clearInterval(timer); }, []);

  const openRegister = () => {
    setMenuOpen(false);
    setModalOpen(true);
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
            <a href="#portal" className="signin-link">
              Sign in
            </a>
            <button className="button button--small button--primary" onClick={openRegister}>
              Register free
            </button>
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
              <a href="#portal" onClick={() => setMenuOpen(false)}>
                Sign in
              </a>
              <button onClick={openRegister}>Register free</button>
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

        {currentPage === "/" && <section className="page-overview section-pad"><div className="section-shell"><div className="section-heading center-heading"><p className="eyebrow">Explore TrustDoc</p><h2>Everything you need, in one place.</h2><p>Quick summaries of every part of the service. Read the full details in each section below.</p></div><div className="page-overview__grid">{[["01","How it works","Understand the steps from free registration to secure, verified handover."],["02","Supported Locations","See where collection and delivery services are currently supported."],["03","Tracking","Understand the updates and milestones that keep you informed."],["04","Simple pricing","Compare free monitoring with standard and doorstep delivery."],["05","For clients","Learn how the private code protects the recipient at handover."],["06","Careers","Explore opportunities for TrustDoc agents and delivery riders."]].map(([number,title,copy])=><article className="page-overview__card" key={title}><span className="overview-number">{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>}
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
<div className="detail-panel"><h3>The four stages of your document journey</h3><div className="detail-grid"><article><b>01 · Register</b><p>Create your free client profile and provide the details needed to identify your application and collection point.</p></article><article><b>02 · Monitor</b><p>Your assigned agent follows progress and contacts you when readiness or confirmation is required.</p></article><article><b>03 · Secure collection</b><p>Once ready, the authorized collection and sealing process is coordinated. The package remains sealed during transit.</p></article><article><b>04 · Verified handover</b><p>The recipient checks the package and uses a private code to confirm identity before handover is completed.</p></article></div><p>TrustDoc supports the document journey after the client completes the normal application process with the issuing institution. It does not replace that institution or make decisions on its behalf.</p></div>
        </section>

        <div className="section-explore"><a className="button button--secondary" href="/how-it-works">Explore How it works <Icon name="arrow" /></a></div>
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
              <p className="eyebrow eyebrow--gold">03 / Track your delivery</p>
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
              <p className="detail-copy">At every milestone, the status record identifies what has happened, who is responsible for the next action and when the client should expect an update. The rider never opens or inspects the sealed document.</p>
              <div className="section-explore"><a className="button button--secondary" href="/tracking">Explore Tracking <Icon name="arrow" /></a></div>
            </div>
          </div>
<div className="detail-panel"><h3>Understand each tracking milestone</h3><div className="detail-grid"><article><b>Request received</b><p>Your delivery request is recorded for the operations team.</p></article><article><b>Monitoring in progress</b><p>An agent follows the application status and shares relevant updates.</p></article><article><b>Ready for collection</b><p>The team contacts you to confirm the next step before authorized collection.</p></article><article><b>Out for delivery</b><p>A verified rider transports the sealed package along the assigned route.</p></article><article><b>Handover confirmed</b><p>The private recipient code confirms the handover and closes the delivery record.</p></article></div><p>Tracking updates help you understand progress and responsibility at each stage. Riders are not authorized to open or inspect sealed documents.</p></div>
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
<div className="section-explore"><a className="button button--secondary" href="/tracking">Explore Tracking <Icon name="arrow" /></a></div>
        <div className="detail-panel"><h3>What the pricing options include</h3><div className="detail-grid"><article><b>Free registration</b><p>Create your client record without a registration charge.</p></article><article><b>Free monitoring</b><p>Receive progress updates while your document is being monitored.</p></article><article><b>Standard · KSh 300</b><p>Same-day delivery to an agreed meeting point, subject to route availability.</p></article><article><b>Doorstep · up to KSh 400</b><p>Delivery to an approved home or office address, with the fee confirmed before dispatch.</p></article></div><p>There is no registration or monitoring fee. Any delivery fee is confirmed with the client before the delivery is arranged.</p></div>
        </section>

        <div className="section-explore"><a className="button button--secondary" href="/tracking">Explore Tracking <Icon name="arrow" /></a></div>
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
              <div className="section-explore"><a className="button button--secondary" href="/clients">Explore Clients <Icon name="arrow" /></a></div>
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
        <div className="detail-panel"><h3>How to prepare for a safe handover</h3><div className="detail-grid"><article><b>Keep your code private</b><p>Do not share the delivery code before the package reaches you.</p></article><article><b>Check the sealed package</b><p>Inspect the envelope on arrival before confirming receipt.</p></article><article><b>Verify your identity</b><p>The private code is used to confirm the intended recipient.</p></article><article><b>Confirm completion</b><p>Provide the code only when you are satisfied the handover is correct.</p></article></div><p>If the package or recipient details do not match, pause the handover and contact TrustDoc support. The rider transports the sealed envelope and is not authorized to open it.</p></div>
        </section>

        <section className="locations section-pad" id="locations" data-page-section="locations">
          <div className="section-shell">
            <div className="section-heading split-heading light">
              <div>
                <p className="eyebrow eyebrow--gold">02 / Supported locations</p>
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
            <div className="section-explore"><a className="button button--secondary button--light" href="/locations">Explore Locations <Icon name="arrow" /></a></div>
          </div>
<div className="section-explore"><a className="button button--secondary button--light" href="/locations">Explore Supported Locations <Icon name="arrow" /></a></div>
        <div className="detail-panel detail-panel--dark"><h3>Coverage and route confirmation</h3><p>Availability depends on the collection point, destination, rider availability and the route for that day. The locations listed are service-area examples, not a guarantee that every address is available at every time.</p><p>Before dispatch, the team confirms the meeting point or delivery address, the handover arrangement and any applicable delivery fee. If your destination is outside the listed areas, contact TrustDoc to ask whether a route can be arranged.</p></div>
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
            <div className="section-explore"><a className="button button--secondary" href="/careers">Explore Careers <Icon name="arrow" /></a></div>
          </div>
<div className="section-explore"><a className="button button--secondary" href="/careers">Explore Careers <Icon name="arrow" /></a></div>
        <div className="detail-panel"><h3>Working with TrustDoc</h3><div className="detail-grid"><article><b>Agent responsibilities</b><p>Support client registration, monitor application progress, coordinate readiness and maintain clear status records.</p></article><article><b>Rider responsibilities</b><p>Transport sealed envelopes carefully, follow assigned routes and complete identity-verified handovers.</p></article><article><b>Professional standards</b><p>Respect client privacy, communicate clearly, follow procedures and report exceptions promptly.</p></article><article><b>How to apply</b><p>Use the role-specific email link above and include your contact details, location and relevant experience.</p></article></div><p>Applications are reviewed according to operational needs and service-area coverage. Do not send original identity documents by email.</p></div>
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
            <a href="#portal">Agent portal</a>
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
      {modalOpen && <RegisterModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export default App;
