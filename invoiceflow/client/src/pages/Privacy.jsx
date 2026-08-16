import React from "react";
import { Link } from "react-router-dom";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-page">
      {/* HEADER */}
      <header className="privacy-header">
        <div className="privacy-header-inner">
          <Link to="/" className="privacy-brand">
            <div className="privacy-brand-mark">IF</div>
            <span>InvoiceFlow</span>
          </Link>

          <Link to="/" className="privacy-back">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="privacy-hero">
        <div className="privacy-container">
          <span className="privacy-eyebrow">LEGAL</span>

          <h1>Privacy Policy</h1>

          <p className="privacy-intro">
            Your privacy matters to us. This Privacy Policy explains how
            InvoiceFlow collects, uses, protects, and handles your information
            when you use our services.
          </p>

          <p className="privacy-updated">Last updated: August 17, 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="privacy-content">
        <div className="privacy-container">
          {/* 1 */}
          <section className="privacy-section">
            <span className="privacy-number">01</span>

            <div>
              <h2>Information We Collect</h2>

              <p>
                When you use InvoiceFlow, we may collect information that you
                provide directly to us and information generated automatically
                when you use our platform.
              </p>

              <h3>Account Information</h3>

              <p>
                When you create an account, we may collect information such as:
              </p>

              <ul>
                <li>Your name</li>
                <li>Email address</li>
                <li>Password</li>
                <li>Account role and preferences</li>
                <li>Profile information you choose to provide</li>
              </ul>

              <h3>Business Information</h3>

              <p>
                If you use InvoiceFlow for business purposes, you may provide
                information including:
              </p>

              <ul>
                <li>Customer names and contact information</li>
                <li>Invoice details</li>
                <li>Products and services</li>
                <li>Invoice amounts and payment status</li>
                <li>Business contact information</li>
                <li>Expense information</li>
              </ul>
            </div>
          </section>

          {/* 2 */}
          <section className="privacy-section">
            <span className="privacy-number">02</span>

            <div>
              <h2>How We Use Your Information</h2>

              <p>
                We use collected information to provide, maintain, and improve
                InvoiceFlow and its features.
              </p>

              <ul>
                <li>Creating and managing your account</li>
                <li>Providing invoicing and financial management features</li>
                <li>Processing and displaying invoice information</li>
                <li>Providing customer and expense management</li>
                <li>Improving platform performance and reliability</li>
                <li>Responding to support requests</li>
                <li>Detecting and preventing fraud or abuse</li>
                <li>Protecting the security of our services</li>
                <li>Communicating important service updates</li>
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section className="privacy-section">
            <span className="privacy-number">03</span>

            <div>
              <h2>Invoice and Customer Data</h2>

              <p>
                InvoiceFlow allows you to store information about your
                customers, invoices, expenses, and business activities.
              </p>

              <p>
                You are responsible for ensuring that you have the appropriate
                rights and permissions to provide this information to
                InvoiceFlow and to use it for your business purposes.
              </p>

              <p>
                We use this information only as necessary to provide the
                functionality of the InvoiceFlow platform, maintain security,
                provide support, and comply with applicable legal obligations.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section className="privacy-section">
            <span className="privacy-number">04</span>

            <div>
              <h2>Authentication and Security</h2>

              <p>
                We take reasonable technical and organizational measures to
                protect your information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>

              <p>
                InvoiceFlow may use authentication technologies such as secure
                password hashing and authentication tokens to help protect user
                accounts.
              </p>

              <p>
                However, no internet-based service can guarantee absolute
                security. You are responsible for keeping your account
                credentials confidential.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section className="privacy-section">
            <span className="privacy-number">05</span>

            <div>
              <h2>Information Sharing</h2>

              <p>We do not sell your personal information.</p>

              <p>
                We may share information with trusted service providers when
                necessary to operate InvoiceFlow, such as providers used for
                hosting, databases, authentication, analytics, email delivery,
                or other infrastructure.
              </p>

              <p>
                We may also disclose information when required by law, legal
                process, or when necessary to protect the rights, safety, and
                security of InvoiceFlow, our users, or others.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section className="privacy-section">
            <span className="privacy-number">06</span>

            <div>
              <h2>Cookies and Similar Technologies</h2>

              <p>
                InvoiceFlow may use cookies, local storage, and similar
                technologies to maintain sessions, remember preferences, and
                improve the functionality of the platform.
              </p>

              <p>
                You may be able to control certain cookies through your browser
                settings. Disabling some technologies may affect the
                functionality of parts of the service.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section className="privacy-section">
            <span className="privacy-number">07</span>

            <div>
              <h2>Data Retention</h2>

              <p>
                We retain information for as long as reasonably necessary to
                provide our services, maintain business and security records,
                resolve disputes, and comply with applicable legal obligations.
              </p>

              <p>
                When information is no longer required, we may delete,
                anonymize, or securely dispose of it in accordance with our
                retention practices.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section className="privacy-section">
            <span className="privacy-number">08</span>

            <div>
              <h2>Your Rights and Choices</h2>

              <p>
                Depending on applicable law, you may have rights regarding your
                personal information, including the ability to:
              </p>

              <ul>
                <li>Access information associated with your account</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of certain information</li>
                <li>Update your account information</li>
                <li>Close your InvoiceFlow account</li>
              </ul>

              <p>
                To request assistance with your information, please contact us
                using the contact information provided below.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section className="privacy-section">
            <span className="privacy-number">09</span>

            <div>
              <h2>Children's Privacy</h2>

              <p>
                InvoiceFlow is intended for businesses and general users and is
                not designed for children under the age required by applicable
                law to independently use online services.
              </p>

              <p>
                We do not knowingly collect personal information from children
                in violation of applicable laws.
              </p>
            </div>
          </section>

          {/* 10 */}
          <section className="privacy-section">
            <span className="privacy-number">10</span>

            <div>
              <h2>Third-Party Services</h2>

              <p>
                InvoiceFlow may rely on third-party services for hosting,
                authentication, storage, analytics, communication, or other
                infrastructure.
              </p>

              <p>
                These providers may process information according to their own
                privacy policies and contractual obligations.
              </p>
            </div>
          </section>

          {/* 11 */}
          <section className="privacy-section">
            <span className="privacy-number">11</span>

            <div>
              <h2>Changes to This Privacy Policy</h2>

              <p>
                We may update this Privacy Policy from time to time to reflect
                changes to our services, technology, legal requirements, or
                business practices.
              </p>

              <p>
                When we make changes, we will update the "Last updated" date at
                the top of this page.
              </p>
            </div>
          </section>

          {/* 12 */}
          <section className="privacy-section privacy-contact">
            <span className="privacy-number">12</span>

            <div>
              <h2>Contact Us</h2>

              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal information, you can contact the
                InvoiceFlow team.
              </p>

              <div className="privacy-contact-card">
                <strong>InvoiceFlow</strong>
                <span>Privacy & Data Protection</span>
                <a href="mailto:privacy@invoiceflow.com">
                  privacy@invoiceflow.com
                </a>
              </div>
            </div>
          </section>

          {/* BOTTOM */}
          <div className="privacy-bottom">
            <p>
              By using InvoiceFlow, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>

            <Link to="/" className="privacy-home-button">
              ← Return to InvoiceFlow
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="privacy-footer">
        <div>
          <span>© {new Date().getFullYear()} InvoiceFlow</span>

          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
