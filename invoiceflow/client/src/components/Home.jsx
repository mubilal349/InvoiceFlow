import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// ============================================================
// STATIC CONTENT
// ============================================================

const RECEIPT_ITEMS = [
  { label: "Brand identity package", qty: 1, amount: 42000 },
  { label: "Website — 5 pages", qty: 1, amount: 30500 },
  { label: "Revision rounds", qty: 3, amount: 11700 },
];

const RECEIPT_TOTAL = RECEIPT_ITEMS.reduce((sum, i) => sum + i.amount, 0);

const TRUST_CATEGORIES = [
  "Freelancers",
  "Retail shops",
  "Agencies",
  "Consultants",
  "Trades & services",
];

const FEATURES = [
  {
    id: "invoices",
    title: "Invoices",
    copy: "Create, send, and track invoices with statuses that update themselves — draft, pending, paid, overdue.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "customers",
    title: "Customers",
    copy: "Keep every customer's contact info and invoice history in one card, not scattered across six different chats.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "expenses",
    title: "Expenses",
    copy: "Log what goes out alongside what comes in, so your revenue number is never the whole story.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "analytics",
    title: "Analytics",
    copy: "See revenue, pending amounts, and paid totals the moment you open the dashboard — no exporting to spreadsheets.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create",
    copy: "Add line items and a due date. InvoiceFlow handles the tax, totals, and formatting.",
  },
  {
    n: "02",
    title: "Send",
    copy: "Your customer gets a clean PDF. You get a status that updates the moment it's opened.",
  },
  {
    n: "03",
    title: "Get paid",
    copy: "Mark it paid yourself, or let overdue reminders do the nudging for you.",
  },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Rs. 0",
    period: "/month",
    tagline: "For solo freelancers off spreadsheets for the first time.",
    features: [
      "Up to 5 invoices / month",
      "1 admin account",
      "Customer & expense tracking",
      "Email support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    id: "business",
    name: "Business",
    price: "Rs. 2,500",
    period: "/month",
    tagline: "For small teams who send invoices every week.",
    features: [
      "Unlimited invoices",
      "Unlimited customers",
      "Analytics dashboard",
      "Branded PDF invoices",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "Rs. 6,000",
    period: "/month",
    tagline: "For agencies managing several clients and admins.",
    features: [
      "Everything in Business",
      "Multiple admin roles",
      "Multi-currency invoicing",
      "Dedicated onboarding",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

// ============================================================
// COMPONENT
// ============================================================

const Home = () => {
  const [visibleItems, setVisibleItems] = useState(0);
  const [showStamp, setShowStamp] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sequenced hero animation: items appear one by one, then the
  // total counts up, then the paid stamp lands.
  useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisibleItems(RECEIPT_ITEMS.length);
      setDisplayTotal(RECEIPT_TOTAL);
      setShowStamp(true);
      return;
    }

    const timers = [];

    RECEIPT_ITEMS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleItems(i + 1), 500 + i * 380));
    });

    const countStart = 500 + RECEIPT_ITEMS.length * 380 + 200;
    const countDuration = 700;
    const steps = 24;

    for (let s = 1; s <= steps; s++) {
      timers.push(
        setTimeout(
          () => {
            setDisplayTotal(Math.round((RECEIPT_TOTAL * s) / steps));
          },
          countStart + (countDuration / steps) * s,
        ),
      );
    }

    timers.push(
      setTimeout(() => setShowStamp(true), countStart + countDuration + 250),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="landing">
      {/* ============ NAV ============ */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <div className="lp-brand-mark">IF</div>
            <span>InvoiceFlow</span>
          </div>

          <nav className="lp-nav-links">
            <a href="#features">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="lp-nav-actions">
            <Link to="/login" className="lp-link-button">
              Log in
            </Link>

            <Link to="/register" className="lp-btn lp-btn-primary">
              Start free
            </Link>
          </div>

          <button
            className={`lp-nav-toggle ${mobileNavOpen ? "is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`lp-nav-mobile ${mobileNavOpen ? "is-open" : ""}`}>
          <a href="#features" onClick={() => setMobileNavOpen(false)}>
            Product
          </a>

          <a href="#how-it-works" onClick={() => setMobileNavOpen(false)}>
            How it works
          </a>

          <a href="#pricing" onClick={() => setMobileNavOpen(false)}>
            Pricing
          </a>

          <Link to="/login" onClick={() => setMobileNavOpen(false)}>
            Log in
          </Link>

          <Link
            to="/register"
            className="lp-btn lp-btn-primary"
            onClick={() => setMobileNavOpen(false)}
          >
            Start free
          </Link>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <span className="lp-eyebrow">Invoicing, settled</span>

          <h1>
            Send the invoice.
            <br />
            Skip the chasing.
          </h1>

          <p className="lp-hero-copy">
            InvoiceFlow gives small businesses one place to bill customers, log
            expenses, and see exactly who owes what — the moment you open the
            dashboard.
          </p>

          <div className="lp-hero-actions">
            <Link to="/register" className="lp-btn lp-btn-primary lp-btn-lg">
              Start for free
            </Link>
            <a href="#how-it-works" className="lp-btn lp-btn-ghost lp-btn-lg">
              See how it works
            </a>
          </div>

          <dl className="lp-stat-row">
            <div>
              <dt>Rs. 12M+</dt>
              <dd>invoiced through InvoiceFlow</dd>
            </div>
            <div>
              <dt>3 min</dt>
              <dd>average time to send an invoice</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>spreadsheets required</dd>
            </div>
          </dl>
        </div>

        <div className="lp-hero-visual" aria-hidden="true">
          <div className="lp-receipt-card">
            <div className="lp-receipt-edge" />

            <div className="lp-receipt-head">
              <span className="lp-receipt-label">INVOICE</span>
              <span className="lp-receipt-number">#INB-014</span>
            </div>

            <p className="lp-receipt-to">Aslam Traders</p>

            <div className="lp-receipt-items">
              {RECEIPT_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className={`lp-receipt-row ${
                    i < visibleItems ? "is-visible" : ""
                  }`}
                >
                  <span className="lp-receipt-item-label">{item.label}</span>
                  <span className="lp-receipt-item-amount">
                    Rs. {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="lp-receipt-total">
              <span>Total</span>
              <span>Rs. {displayTotal.toLocaleString()}</span>
            </div>

            <div
              className={`lp-receipt-stamp ${showStamp ? "is-visible" : ""}`}
            >
              Paid
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="lp-trust">
        <p>Built for the way small businesses actually bill</p>
        <div className="lp-trust-row">
          {TRUST_CATEGORIES.map((cat) => (
            <span key={cat}>{cat}</span>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="lp-features" id="features">
        <div className="lp-section-head">
          <h2>Everything after "send invoice," handled</h2>
          <p>Four tools that cover the whole loop — not just the paperwork.</p>
        </div>

        <div className="lp-feature-grid">
          {FEATURES.map((f) => (
            <div className="lp-feature-card" key={f.id}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="lp-steps" id="how-it-works">
        <div className="lp-section-head">
          <h2>Three steps. No follow-up spreadsheet.</h2>
          <p>From blank invoice to money in the bank.</p>
        </div>

        <div className="lp-steps-row">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="lp-step">
                <span className="lp-step-number">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
              {i < STEPS.length - 1 && <div className="lp-step-connector" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="lp-quote">
        <blockquote>
          "I used to invoice from a Word template and just… hope. Now I know
          exactly who's paid and who isn't, the moment I open the tab."
        </blockquote>
        <cite>— Retail shop owner, Lahore</cite>
      </section>

      {/* ============ PRICING ============ */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-section-head">
          <h2>Pricing that scales with your invoice volume</h2>
          <p>Start free. Upgrade when the spreadsheet would've broken.</p>
        </div>

        <div className="lp-pricing-grid">
          {PLANS.map((plan) => (
            <div
              className={`lp-price-card ${
                plan.highlighted ? "is-highlighted" : ""
              }`}
              key={plan.id}
            >
              {plan.highlighted && (
                <span className="lp-price-badge">Most popular</span>
              )}

              <h3>{plan.name}</h3>
              <p className="lp-price-tagline">{plan.tagline}</p>

              <div className="lp-price-amount">
                <span className="lp-price-value">{plan.price}</span>
                <span className="lp-price-period">{plan.period}</span>
              </div>

              <ul className="lp-price-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <a
                href="#start"
                className={`lp-btn ${
                  plan.highlighted ? "lp-btn-primary" : "lp-btn-outline"
                } lp-btn-block`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="lp-cta-band" id="start">
        <h2>Stop chasing. Start invoicing.</h2>
        <p>Set up your first invoice in the next five minutes.</p>
        <Link to="/register" className="lp-btn lp-btn-inverse lp-btn-lg">
          Create your first invoice
        </Link>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lp-footer">
        <div className="lp-footer-container">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-brand">
              <div className="lp-brand-mark">IF</div>
              <span>InvoiceFlow</span>
            </div>

            <p>
              Simple, powerful invoicing for modern businesses. Create invoices,
              track payments, and manage your financial workflow in one place.
            </p>

            <div className="lp-footer-socials">
              <a href="#" aria-label="LinkedIn">
                in
              </a>

              <a href="#" aria-label="GitHub">
                G
              </a>

              <a href="#" aria-label="Facebook">
                f
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lp-footer-cols">
            <div className="lp-footer-column">
              <h4>Product</h4>

              <a href="#features">Invoices</a>
              <a href="#features">Customers</a>
              <a href="#features">Expenses</a>
              <a href="#pricing">Pricing</a>
            </div>

            <div className="lp-footer-column">
              <h4>Company</h4>

              <a href="#about">About us</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>

            <div className="lp-footer-column">
              <h4>Resources</h4>

              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#help">Help Center</a>
            </div>

            <div className="lp-footer-column">
              <h4>Legal</h4>

              <Link to="/privacy">Privacy Policy</Link>
              <a href="/terms">Terms of Service</a>
              <a href="/security">Security</a>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>
            © {new Date().getFullYear()} InvoiceFlow. All rights reserved.
          </span>

          <div className="lp-footer-bottom-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
