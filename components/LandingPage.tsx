import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, RefreshCw, Sparkles, Layers, Twitter, Github, Mail } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onPricing: () => void;
  onLogout: () => void;
  isPro?: boolean;
}

export function LandingPage({ onGetStarted, onLogin, onPricing, onLogout, isPro = false }: LandingPageProps) {
  const { user } = useAuth();
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContact = () => {
    window.location.href = 'mailto:support@livesyncdesk.com?subject=LiveSyncDesk Inquiry';
  };

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
          <div 
            onClick={scrollToTop}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <button
                onClick={scrollToTop}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Product
              </button>
              <button
                onClick={scrollToFeatures}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Features
              </button>
              <button
                onClick={onPricing}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Pricing
              </button>
              <button
                onClick={handleContact}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Contact
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {user ? (
                <>
                  <button
                    onClick={onGetStarted}
                    style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Go to App
                  </button>
                  <UserMenu 
                    user={{ 
                      id: user.id, 
                      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User', 
                      email: user.email, 
                      avatarUrl: user.user_metadata?.avatar_url || '', 
                      color: '#6366f1' 
                    }}
                    isPro={isPro}
                    onLogin={onLogin}
                    onLogout={onLogout}
                  />
                </>
              ) : (
                <UserMenu user={null} isPro={false} onLogin={onLogin} onLogout={onLogout} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: 120,
        paddingBottom: 60,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
            padding: '8px 16px',
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 32
          }}>
            <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} />
            AI-POWERED COLLABORATIVE WHITEBOARD
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24
          }}>
            Brainstorm Together
            <br />
            <span style={{ color: '#8b5cf6' }}>in Real-Time</span>
          </h1>

          <p style={{
            fontSize: 18,
            color: '#94a3b8',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 560,
            margin: '0 auto 40px'
          }}>
            Create, collaborate, and organize your ideas with AI-powered sticky notes. Real-time sync keeps your team aligned, anywhere in the world.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
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
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{
          maxWidth: 900,
          margin: '60px auto 0',
          padding: '0 24px'
        }}>
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              height: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              position: 'relative'
            }}>
              {/* Simulated whiteboard UI */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)',
                borderRadius: 12,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Sticky note 1 */}
                <div style={{
                  position: 'absolute',
                  top: 60,
                  left: 80,
                  width: 160,
                  padding: 16,
                  background: '#fef08a',
                  borderRadius: 4,
                  color: '#1e293b',
                  fontSize: 12,
                  fontWeight: 500,
                  transform: 'rotate(-2deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, marginBottom: 6 }}>USER RESEARCH</div>
                  Focus on accessibility first.
                </div>

                {/* Sticky note 2 - AI generated */}
                <div style={{
                  position: 'absolute',
                  top: 180,
                  right: 100,
                  width: 180,
                  padding: 16,
                  background: '#a5b4fc',
                  borderRadius: 4,
                  color: '#1e293b',
                  fontSize: 12,
                  fontWeight: 500,
                  transform: 'rotate(2deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, marginBottom: 6 }}>✨ AI ASSISTANT</div>
                  "Generated 5 new layout ideas based on your sketch."
                </div>

                {/* Cursor indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: 100,
                  left: '40%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <div style={{ width: 4, height: 4, background: '#22c55e', borderRadius: '50%' }} />
                  <span style={{ fontSize: 11, color: '#22c55e' }}>Sarah is typing...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" style={{ padding: '80px 24px', background: '#0f0f14' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 12
          }}>
            Supercharge your workflow
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            marginBottom: 48
          }}>
            Everything you need to go from idea to execution.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20
          }}>
            <FeatureCard
              icon={<RefreshCw size={22} />}
              title="Real-time Sync"
              description="Zero-latency synchronization across all devices. See cursors, edits, and ideas move in real-time as your team builds."
            />
            <FeatureCard
              icon={<Sparkles size={22} />}
              title="AI Brainstorming"
              description="Stuck? Let our AI assistant generate nodes, cluster similar ideas, and summarize complex discussions into action items."
            />
            <FeatureCard
              icon={<Layers size={22} />}
              title="Unlimited Canvases"
              description="No boundaries to your creativity. Create infinite boards for every project and organize them with powerful nesting."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          borderRadius: 24,
          padding: '60px 40px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
            Ready to sync your team?
          </h2>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 32 }}>
            Join teams who are building the future together on LiveSyncDesk.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              style={{
                background: '#fff',
                color: '#6366f1',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Create your first board
            </button>
            <button
              onClick={handleContact}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Mail size={18} /> Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24
        }}>
          <div 
            onClick={scrollToTop}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 28,
              height: 28,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>
              ✏️
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>LiveSyncDesk</span>
          </div>

          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#64748b' }}>
            <button onClick={onPricing} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Pricing</button>
            <button onClick={scrollToFeatures} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Features</button>
            <button onClick={handleContact} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Support</button>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b' }}><Twitter size={20} /></a>
            <a href="https://github.com/lijh1519/livesyncdesk" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b' }}><Github size={20} /></a>
          </div>
        </div>
        <div style={{
          maxWidth: 1000,
          margin: '24px auto 0',
          textAlign: 'center',
          color: '#475569',
          fontSize: 13
        }}>
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
      background: '#16161f',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{
        width: 44,
        height: 44,
        background: 'rgba(99,102,241,0.15)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a5b4fc',
        marginBottom: 16
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
