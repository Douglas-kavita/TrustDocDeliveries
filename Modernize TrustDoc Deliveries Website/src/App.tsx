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

const navItems = [
  ["Home", "home"],
  ["How it works", "how-it-works"],
  ["Tracking", "tracking"],
  ["Locations", "locations"],
  ["Clients", "clients"],
  ["Careers", "careers"],
];

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
      href="#home"
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
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % steps.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, []);

  const openRegister = () => {
    setMenuOpen(false);
    setModalOpen(true);
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="nav-shell">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
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
                <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
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
                <a className="button button--secondary" href="#tracking">
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
              <div className="photo-main">
                <img src={agentPhoto} alt="Friendly TrustDoc agent ready to help" />
              </div>
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

        <section className="process section-pad" id="how-it-works">
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
        </section>

        <section className="security section-pad" id="tracking">
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
              <p className="eyebrow eyebrow--gold">02 / Track your delivery</p>
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
              <a href="#clients" className="inline-link">
                See how secure handover works <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section className="options section-pad">
          <div className="section-shell">
            <div className="section-heading center-heading">
              <p className="eyebrow">03 / Simple pricing</p>
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
        </section>

        <section className="clients section-pad" id="clients">
          <div className="section-shell clients__grid">
            <div>
              <p className="eyebrow">04 / For clients</p>
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
        </section>

        <section className="locations section-pad" id="locations">
          <div className="section-shell">
            <div className="section-heading split-heading light">
              <div>
                <p className="eyebrow eyebrow--gold">05 / Supported locations</p>
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
        </section>

        <section className="careers section-pad" id="careers">
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
            <a href="#how-it-works">How it works</a>
            <a href="#tracking">Tracking</a>
            <a href="#locations">Locations</a>
            <a href="#careers">Careers</a>
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
            <a href="tel:+254700000000">+254 700 000 000</a>
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
