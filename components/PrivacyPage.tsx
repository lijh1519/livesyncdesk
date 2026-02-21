import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
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
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Privacy Policy</h1>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>Last updated: February 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>1. Information We Collect</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We collect information you provide directly, including your email address, name, and any content you create within the Service. We also automatically collect usage data such as IP address, browser type, and interaction with our Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We use your information to provide and improve the Service, process payments, communicate with you about updates and support, and ensure security of your account.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>3. Data Storage and Security</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Your data is stored securely using industry-standard encryption. We use trusted third-party services including Supabase for authentication and data storage, and Paddle for payment processing.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>4. Third-Party Services</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We use the following third-party services that may collect data:<br />
            • Google OAuth for authentication<br />
            • Supabase for data storage<br />
            • Paddle for payment processing<br />
            • OpenRouter for AI features
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>5. Data Retention</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>6. Your Rights</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            You have the right to access, correct, or delete your personal data. You may also request a copy of your data or object to certain processing activities.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>7. Cookies</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We use essential cookies to maintain your session and preferences. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>8. Changes to This Policy</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through the Service.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>9. Contact</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            For privacy-related inquiries, please contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#a5b4fc' }}>support@livesyncdesk.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
