import React, { useState } from 'react';
import { Check, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { User } from '../types';

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: 'free' | 'pro-monthly' | 'pro-yearly') => void;
  user?: User | null;
  isPro?: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function PricingPage({ onBack, onSelectPlan, user, isPro = false, onLogin, onLogout }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricing = {
    monthly: { price: 8, period: 'month', save: null },
    yearly: { price: 79, period: 'year', save: '18% off' }
  };

  const current = pricing[billingCycle];
  const monthlyEquivalent = billingCycle === 'yearly' ? (current.price / 12).toFixed(1) : current.price;

  return (
    <div style={{ minHeight: '100vh', height: '100vh', overflow: 'auto', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}>
                ✏️
              </div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>LiveSyncDesk</span>
            </div>
          </div>
          <UserMenu user={user || null} isPro={isPro} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </nav>

      {/* Pricing Content */}
      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>
              Simple, transparent pricing
            </h1>
            <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 32 }}>
              Start free, upgrade when you need more
            </p>

            {/* Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              background: '#16161f',
              borderRadius: 12,
              padding: 4,
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: billingCycle === 'monthly' ? '#6366f1' : 'transparent',
                  color: billingCycle === 'monthly' ? '#fff' : '#94a3b8'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: billingCycle === 'yearly' ? '#6366f1' : 'transparent',
                  color: billingCycle === 'yearly' ? '#fff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                Yearly
                <span style={{
                  background: '#22c55e',
                  color: '#fff',
                  fontSize: 11,
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 600
                }}>Save 18%</span>
              </button>
            </div>
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
              background: '#16161f',
              borderRadius: 20,
              padding: 32,
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.08)',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: 20
              }}>
                <Sparkles size={14} /> Free
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 800 }}>$0</span>
                <span style={{ color: '#64748b' }}>/month</span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
                Perfect for trying out LiveSyncDesk
              </p>

              <button
                onClick={() => onSelectPlan('free')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
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
              
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#fff' }}>${current.price}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>/{current.period}</span>
              </div>

              {billingCycle === 'yearly' && (
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>
                  ${monthlyEquivalent}/month · <span style={{ color: '#fef08a' }}>{current.save}</span>
                </p>
              )}

              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 24, marginTop: billingCycle === 'monthly' ? 16 : 0 }}>
                For professionals and teams
              </p>

              <button
                onClick={() => onSelectPlan(billingCycle === 'monthly' ? 'pro-monthly' : 'pro-yearly')}
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
                {billingCycle === 'yearly' ? 'Get Pro Yearly' : 'Get Pro Monthly'}
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
              Questions? Contact us at <a href="mailto:support@livesyncdesk.com" style={{ color: '#a5b4fc' }}>support@livesyncdesk.com</a>
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
      color: white ? '#fff' : '#cbd5e1',
      fontSize: 14
    }}>
      <Check size={18} color={white ? '#fff' : '#22c55e'} />
      {text}
    </li>
  );
}
