import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface RefundPageProps {
  onBack: () => void;
}

export function RefundPage({ onBack }: RefundPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
            <ArrowLeft size={18} /> Back
          </button>
          <span style={{ fontSize: 16, fontWeight: 700 }}>LiveSyncDesk</span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px 60px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Refund Policy</h1>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>Last updated: February 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>30-Day Money-Back Guarantee</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with LiveSyncDesk for any reason, you can request a full refund within 30 days of your initial purchase.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>How to Request a Refund</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            To request a refund, please contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#a5b4fc' }}>support@livesyncdesk.com</a> with your account email and reason for the refund. We will process your request within 5-7 business days.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Subscription Cancellation</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            You may cancel your subscription at any time. Upon cancellation, you will retain access to Pro features until the end of your current billing period. No partial refunds are provided for unused time after the 30-day guarantee period.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Renewal Refunds</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            For automatic renewals, you may request a refund within 7 days of the renewal date if you did not intend to continue your subscription.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Exceptions</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Refunds may not be granted in cases of:<br />
            • Violation of our Terms of Service<br />
            • Abuse of the refund policy<br />
            • Requests made after the eligible refund period
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Refund Processing</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Refunds are processed through our payment provider, Paddle. The refund will be credited to your original payment method within 5-10 business days, depending on your financial institution.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Contact Us</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            If you have any questions about our refund policy, please contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#a5b4fc' }}>support@livesyncdesk.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
