import { createContext, useContext, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { Forum } from './components/Forum';
import { Marketplace } from './components/Marketplace';
import { Auth } from './components/Auth';
import { translations } from './utils/translations';

const LanguageContext = createContext();
const AuthContext = createContext();

export const useLanguage = () => useContext(LanguageContext);
export const useAuth = () => useContext(AuthContext);

export const DualText = ({ english, id, style = {} }) => {
  const { lang } = useLanguage();
  const translation = translations[lang]?.[id];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <span>{english}</span>
      {translation && lang !== 'en' && (
        <span style={{
          fontSize: '0.75em',
          opacity: 0.85,
          fontWeight: 'normal',
          lineHeight: '1.2',
          marginTop: '2px',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        }}>
          {translation}
        </span>
      )}
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('krishi_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'chat': return <ChatInterface />;
      case 'dashboard': return <Dashboard />;
      case 'forum': return <Forum />;
      case 'marketplace': return <Marketplace />;
      case 'auth': return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentPage('home')} />;
      default: return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <LanguageContext.Provider value={{ lang, setLang }}>
        <div className="App" style={{ display: 'flex' }}>
          <Navbar setCurrentPage={setCurrentPage} />
          <main style={{ flex: 1, marginLeft: '320px', minHeight: '100vh', transition: 'margin 0.3s ease' }}>
            {renderPage()}
          </main>
        </div>
      </LanguageContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
