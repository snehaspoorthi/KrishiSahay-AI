import { ShoppingBag, ArrowUpRight, ExternalLink, Building2 } from 'lucide-react';
import { DualText } from '../App';

export const Marketplace = () => {
    const sellers = [
        { name: "IFFCO eBazar", type: "Fertilizers & Seeds", link: "https://www.iffcobazar.in/", desc: "Trusted cooperative for high-quality fertilizers, seeds, and pesticides." },
        { name: "BigHaat", type: "Agri-Inputs", link: "https://www.bighaat.com/", desc: "One-stop shop for seeds, crop protection, and nutrition products." },
        { name: "AgroStar", type: "Full Agri Support", link: "https://www.agrostar.in/", desc: "Purchase quality inputs and get expert advisory for your crops." },
        { name: "UPL Ltd", type: "Crop Protection", link: "https://www.upl-ltd.com/", desc: "Global leader in sustainable agriculture and crop protection solutions." }
    ];

    const buyers = [
        { name: "Ninjacart", type: "Fresh Produce Buyer", link: "https://www.ninjacart.in/", desc: "India's largest fresh produce supply chain connecting farmers directly to retailers." },
        { name: "DeHaat", type: "Full Value Chain", link: "https://www.agrevolution.in/", desc: "Technology-led platform providing end-to-end services to farmers including market access." },
        { name: "WayCool", type: "Supply Chain", link: "https://www.waycool.in/", desc: "Focuses on food development and distribution, working with thousands of farmers." },
        { name: "ITC e-Choupal", type: "Direct Procurement", link: "https://www.itcportal.com/", desc: "Empowering farmers with internet access and direct market links for better pricing." }
    ];

    return (
        <div className="animate-fade-in" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                <DualText english="Agricultural Marketplace" id="market_title" />
            </h2>

            <h3 style={{ textAlign: 'left', marginBottom: '1.5rem', color: '#10b981' }}>
                <DualText english="Buy Agri-Inputs (Trusted Partners)" id="market_buy" />
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {sellers.map((comp, i) => (
                    <CompanyCard key={i} comp={comp} icon={<ShoppingBag size={24} color="#10b981" />} />
                ))}
            </div>

            <h3 style={{ textAlign: 'left', marginBottom: '1.5rem', color: '#3b82f6' }}>
                <DualText english="Sell Your Produce (Verified Buyers)" id="market_sell" />
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {buyers.map((comp, i) => (
                    <CompanyCard key={i} comp={comp} icon={<Building2 size={24} color="#3b82f6" />} />
                ))}
            </div>
        </div>
    );
};

const CompanyCard = ({ comp, icon }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                {icon}
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{comp.name}</h4>
            </div>
            <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{comp.type}</div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>{comp.desc}</p>
        </div>
        <button
            onClick={() => window.open(comp.link, '_blank')}
            className="btn-primary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
            <DualText english="Visit Official Site" id="visit_website" style={{ alignItems: 'center' }} /> <ExternalLink size={16} />
        </button>
    </div>
);
