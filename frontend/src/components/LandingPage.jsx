import { ArrowRight, MessageSquare, CloudSun, Sprout } from 'lucide-react';
import { DualText } from '../App';

export const LandingPage = ({ setCurrentPage }) => {
    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="animate-fade-in">
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <DualText english="Empowering Farmers with Next-Gen AI" id="hero_title" />
                </h1>
                <div style={{
                    fontSize: '1.25rem',
                    color: '#94a3b8',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.6'
                }}>
                    <DualText english="KrishiSahay brings real-time agricultural intelligence to your fingertips. Solve queries in your regional language, get weather updates, and maximize yield." id="hero_subtitle" />
                </div>

                <button className="btn-primary" onClick={() => setCurrentPage('chat')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1.2rem' }}>
                    <DualText english="Get Started" id="get_started" style={{ alignItems: 'center' }} />
                    <ArrowRight size={20} />
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '6rem'
            }}>
                <FeatureCard
                    icon={<MessageSquare size={32} color="#10b981" />}
                    title={<DualText english="Multilingual AI Support" id="feature_ai_title" />}
                    desc={<DualText english="Ask questions in your local dialect via voice or text and get instant, accurate answers." id="feature_ai_desc" />}
                />
                <FeatureCard
                    icon={<CloudSun size={32} color="#3b82f6" />}
                    title={<DualText english="Real-time Insights" id="feature_insights_title" />}
                    desc={<DualText english="Hyper-local weather forecasts and soil health data to guide your farming decisions." id="feature_insights_desc" />}
                />
                <FeatureCard
                    icon={<Sprout size={32} color="#f59e0b" />}
                    title={<DualText english="Smart Recommendations" id="feature_schemes_title" />}
                    desc={<DualText english="Personalized crop advice and government scheme alerts tailored to your needs." id="feature_schemes_desc" />}
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', transition: 'transform 0.3s' }}>
        <div style={{ marginBottom: '1rem' }}>{icon}</div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f8fafc', fontWeight: 'bold' }}>{title}</div>
        <div style={{ color: '#94a3b8', lineHeight: '1.6' }}>{desc}</div>
    </div>
);
