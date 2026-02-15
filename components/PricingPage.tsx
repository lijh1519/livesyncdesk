import React from 'react';
import { Check, ArrowLeft, Sparkles, Zap } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: 'free' | 'pro') => void;
}

export function PricingPage({ onBack, onSelectPlan }: PricingPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18
            }}>
              ✏️
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>LiveSyncDesk</span>
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              Simple, transparent pricing
            </h1>
            <p style={{ fontSize: 18, color: '#64748b' }}>
              Start free, upgrade when you need more
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            maxWidth: 800,
            margin: '0 auto'
          }}>
            {/* Free Plan */}
            <div style={{
              background: '#fff',
              borderRadius: 20,
              padding: 32,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#f1f5f9',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 20
              }}>
                <Sparkles size={14} /> Free
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#0f172a' }}>$0</span>
                <span style={{ color: '#64748b' }}>/month</span>
              </div>

              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                Perfect for trying out LiveSyncDesk
              </p>

              <button
                onClick={() => onSelectPlan('free')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 24
                }}
              >
                Get Started
              </button>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <PricingFeature text="3 AI generations per day" />
                <PricingFeature text="2 collaborators per room" />
                <PricingFeature text="10 sticky notes per room" />
                <PricingFeature text="Basic drawing tools" />
              </ul>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 20,
              padding: 32,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#fef08a',
                color: '#713f12',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700
              }}>
                POPULAR
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 20
              }}>
                <Zap size={14} /> Pro
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#fff' }}>$9</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>/month</span>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 24 }}>
                For professionals and teams
              </p>

              <button
                onClick={() => onSelectPlan('pro')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#fff',
                  color: '#6366f1',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 24
                }}
              >
                Upgrade to Pro
              </button>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <PricingFeature text="Unlimited AI generations" white />
                <PricingFeature text="Unlimited collaborators" white />
                <PricingFeature text="Unlimited sticky notes" white />
                <PricingFeature text="Advanced drawing tools" white />
                <PricingFeature text="Export to PDF/PNG" white />
                <PricingFeature text="Priority support" white />
              </ul>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div style={{ textAlign: 'center', marginTop: 60, color: '#64748b', fontSize: 14 }}>
            <p>
              All plans include real-time collaboration, secure cloud storage, and access on any device.
            </p>
            <p style={{ marginTop: 8 }}>
              Questions? Contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#6366f1' }}>support@livesyncdesk.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingFeature({ text, white }: { text: string; white?: boolean }) {
  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      color: white ? '#fff' : '#475569',
      fontSize: 14
    }}>
      <Check size={18} color={white ? '#fff' : '#22c55e'} />
      {text}
    </li>
  );
}
