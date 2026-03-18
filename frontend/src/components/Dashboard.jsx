import { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Wind, Droplets, ExternalLink, Cloud, Sun, CloudLightning, Loader2 } from 'lucide-react';
import { DualText } from '../App';
import axios from 'axios';

export const Dashboard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

    const schemes = [
        {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            desc: "Provides insurance coverage and financial support to farmers in the event of failure of any of the notified crops.",
            deadline: "Apply by: 30th Nov",
            link: "https://pmfby.gov.in/"
        },
        {
            title: "Soil Health Card Scheme",
            desc: "Assists State Governments to issue Soil Health Cards to all farmers in the country.",
            deadline: "Open all year",
            link: "https://www.soilhealth.dac.gov.in/"
        },
        {
            title: "PM-Kisan Samman Nidhi",
            desc: "Under the scheme an income support of 6,000/- per year in three equal installments will be provided.",
            deadline: "Ongoing",
            link: "https://pmkisan.gov.in/"
        }
    ];

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setWeatherLoading(true);
                const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=6e7c6c9b2a6705081aca4d58af6774f4&units=metric');
                setWeatherData(response.data);
                console.log("Weather fetched:", response.data);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setWeatherError("Failed to load weather data");
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (condition) => {
        const c = condition?.toLowerCase() || '';
        if (c.includes('rain')) return <CloudRain size={48} color="#60a5fa" />;
        if (c.includes('clear')) return <Sun size={48} color="#fbbf24" />;
        if (c.includes('cloud')) return <Cloud size={48} color="#94a3b8" />;
        if (c.includes('storm')) return <CloudLightning size={48} color="#f87171" />;
        return <Cloud size={48} color="#94a3b8" />;
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2.5rem', maxWidth: '1200px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', textAlign: 'left', fontWeight: '800' }}>
                <DualText english="Your Farm Dashboard" id="dash_title" />
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {/* Weather Card */}
                <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 41, 59, 0.7))', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}><DualText english="Weather Today" id="dash_weather" /></h3>
                        <span style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>📍 Hyderabad, TS</span>
                    </div>

                    {weatherLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                            <Loader2 size={24} className="animate-spin" /> Fetching live conditions...
                        </div>
                    ) : weatherError ? (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{weatherError}</div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {getWeatherIcon(weatherData.weather[0].main)}
                            <div>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1' }}>{Math.round(weatherData.main.temp)}°C</div>
                                <div style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                                    {weatherData.weather[0].description}
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Droplets size={14} /> {weatherData.main.humidity}%</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Wind size={14} /> {weatherData.wind.speed} m/s</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Soil Card */}
                <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(30, 41, 59, 0.7))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}><DualText english="Soil Health" id="dash_soil" /></h3>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Verified: 2 days ago</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <SoilStat label="Nitrogen (N)" value="Medium" color="#fbbf24" percentage={65} />
                        <SoilStat label="Phosphorus (P)" value="Optimal" color="#10b981" percentage={82} />
                        <SoilStat label="Potassium (K)" value="Low" color="#ef4444" percentage={30} />
                        <SoilStat label="pH Level" value="6.8" color="#60a5fa" percentage={90} />
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', textAlign: 'left', fontWeight: '700' }}>
                <DualText english="Recommended Schemes" id="dash_schemes" />
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {schemes.map((scheme, index) => (
                    <SchemeCard
                        key={index}
                        title={scheme.title}
                        desc={scheme.desc}
                        deadline={scheme.deadline}
                        link={scheme.link}
                    />
                ))}
            </div>
        </div>
    );
};

const SoilStat = ({ label, value, color, percentage }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ color: color, fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{value}</div>
        <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${percentage}%`, background: color, borderRadius: '2px' }}></div>
        </div>
    </div>
);

const SchemeCard = ({ title, desc, deadline, link }) => (
    <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
        <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.75rem 0', color: '#f8fafc', fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ margin: '0 0 0.75rem 0', color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '4px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 'bold' }}>{deadline}</div>
        </div>
        <button
            onClick={() => window.open(link, '_blank')}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}
        >
            <DualText english="View Details" id="view_details" /> <ExternalLink size={18} />
        </button>
    </div>
);
