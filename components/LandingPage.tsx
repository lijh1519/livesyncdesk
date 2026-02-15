import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Users, Zap, ArrowRight, Check, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onPricing: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onPricing }: LandingPageProps) {
  const { user } = useAuth();

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
          justifyContent: 'space-between'
        }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onPricing}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                padding: '8px 16px'
              }}
            >
              Pricing
            </button>
            {user ? (
              <button
                onClick={onGetStarted}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to App
              </button>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1e293b',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '8px 16px'
                  }}
                >
                  Log in
                </button>
                <button
                  onClick={onLogin}
                  style={{
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 80,
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#fef3c7',
            color: '#92400e',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24
          }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            AI-Powered Collaborative Whiteboard
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.1,
            marginBottom: 20
          }}>
            <span style={{ color: '#6366f1' }}>Brainstorm Together</span>
            <br />in Real-Time
          </h1>

          <p style={{
            fontSize: 18,
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: 36,
            maxWidth: 600,
            margin: '0 auto 36px'
          }}>
            Create, collaborate, and organize your ideas with AI-powered sticky notes.
            Real-time sync keeps your team aligned, anywhere in the world.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
              }}
            >
              Start for Free <ArrowRight size={18} />
            </button>
            <button
              onClick={onPricing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div style={{
          maxWidth: 1000,
          margin: '60px auto 0',
          padding: '0 24px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              gap: 8
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{
              height: 400,
              background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              padding: 40,
              flexWrap: 'wrap'
            }}>
              {/* Sample sticky notes */}
              <div style={{
                width: 180,
                padding: 20,
                background: '#fef08a',
                borderRadius: 4,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                transform: 'rotate(-2deg)',
                fontFamily: 'cursive',
                fontSize: 14
              }}>
                Launch MVP by Q2 🚀
              </div>
              <div style={{
                width: 180,
                padding: 20,
                background: '#bfdbfe',
                borderRadius: 4,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                transform: 'rotate(3deg)',
                fontFamily: 'cursive',
                fontSize: 14
              }}>
                User research insights
              </div>
              <div style={{
                width: 180,
                padding: 20,
                background: '#bbf7d0',
                borderRadius: 4,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                transform: 'rotate(-1deg)',
                fontFamily: 'cursive',
                fontSize: 14
              }}>
                Design system v2 ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'center',
            color: '#0f172a',
            marginBottom: 48
          }}>
            Everything you need for creative collaboration
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32
          }}>
            <FeatureCard
              icon={<Sparkles size={24} />}
              title="AI-Powered Notes"
              description="Generate brainstorming ideas instantly with AI. Just describe your topic and get smart suggestions."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Real-Time Collaboration"
              description="See teammates' cursors and changes live. Work together seamlessly, no matter where you are."
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Instant Sync"
              description="All changes sync automatically. No save button needed - your work is always up to date."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Ready to brainstorm?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            Start collaborating with your team today. Free to get started.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#6366f1',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        background: '#0f172a',
        textAlign: 'center'
      }}>
        <div style={{ color: '#64748b', fontSize: 14 }}>
          © 2025 LiveSyncDesk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{
      padding: 28,
      background: '#f8fafc',
      borderRadius: 16,
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        marginBottom: 16
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
