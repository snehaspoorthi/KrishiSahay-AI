import { useLanguage, DualText, useAuth } from '../App';
import { languages } from '../utils/translations';
import { Languages, User, LogOut, Home, MessageSquare, LayoutDashboard, MessageCircle, ShoppingCart } from 'lucide-react';

export const Navbar = ({ setCurrentPage }) => {
    const { lang, setLang } = useLanguage();
    const { user, logout } = useAuth();

    return (
        <nav className="glass-panel" style={{
            width: '280px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            gap: '2rem'
        }}>
            <div
                onClick={() => setCurrentPage('home')}
                style={{
                    cursor: 'pointer',
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #10b981, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                }}
            >
                🌾 KrishiSahay
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <NavButton onClick={() => setCurrentPage('home')} icon={<Home size={20} />} label="Home" id="hero_title" />
                <NavButton onClick={() => setCurrentPage('chat')} icon={<MessageSquare size={20} />} label="Ask AI" id="nav_ask_ai" />
                <NavButton onClick={() => setCurrentPage('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" id="nav_dashboard" />
                <NavButton onClick={() => setCurrentPage('forum')} icon={<MessageCircle size={20} />} label="Forum" id="nav_forum" />
                <NavButton onClick={() => setCurrentPage('marketplace')} icon={<ShoppingCart size={20} />} label="Buy & Sell" id="nav_marketplace" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                    <Languages size={18} color="#10b981" />
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            outline: 'none',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {languages.map(l => (
                            <option key={l.code} value={l.code} style={{ background: '#1e293b' }}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                {user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="#10b981" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>{user.username}</span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.role}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                fontWeight: '600'
                            }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setCurrentPage('auth')}
                        className="btn-primary"
                        style={{ padding: '0.85rem', fontSize: '0.95rem', width: '100%' }}
                    >
                        Login / Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
};

const NavButton = ({ onClick, icon, label, id }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            width: '100%',
            textAlign: 'left',
            transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#f8fafc';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
        }}
    >
        <span style={{ color: '#10b981' }}>{icon}</span>
        <DualText english={label} id={id} />
    </button>
);
