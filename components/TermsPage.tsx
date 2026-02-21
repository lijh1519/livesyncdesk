import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
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
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Terms of Service</h1>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>Last updated: February 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            By accessing or using LiveSyncDesk ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>2. Description of Service</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            LiveSyncDesk is a real-time collaborative whiteboard application that allows users to create, share, and collaborate on visual content. The Service includes AI-powered features, drawing tools, and cloud storage.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>3. User Accounts</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>4. Subscription and Payments</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Paid subscriptions are billed in advance on a monthly or yearly basis. All payments are processed securely through our payment provider, Paddle. Prices are in USD and may be subject to applicable taxes.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>5. Intellectual Property</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            You retain ownership of all content you create using the Service. By using the Service, you grant us a limited license to store and display your content solely for the purpose of providing the Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>6. Prohibited Uses</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            You may not use the Service for any illegal purpose, to harass others, to distribute malware, or to infringe upon the intellectual property rights of others.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>7. Limitation of Liability</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>8. Changes to Terms</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>9. Contact</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            For questions about these Terms, please contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#a5b4fc' }}>support@livesyncdesk.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
