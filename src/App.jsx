import { useState, useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';

function buildApiUrl(path) {
  const base = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!base) return path;
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

const mediaBaseUrl = `${import.meta.env.BASE_URL}media/`;

function toMediaUrl(src) {
  const value = String(src || '').trim();
  if (!value) return value;
  if (/^(?:https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }
  if (value.startsWith('/media/')) {
    return `${mediaBaseUrl}${value.slice('/media/'.length)}`;
  }
  if (value.startsWith('media/')) {
    return `${mediaBaseUrl}${value.slice('media/'.length)}`;
  }
  return value;
}

const showAdminLink = String(import.meta.env.VITE_SHOW_ADMIN_LINK || 'false').toLowerCase() === 'true';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/programs', label: 'Our Programs' },
  { to: '/impact', label: 'Impact & Transparency' },
  { to: '/donate', label: 'Donation' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/stories', label: 'Stories & Blog' },
  { to: '/gallery', label: 'Gallery' },
  ...(showAdminLink ? [{ to: '/admin', label: 'Admin' }] : []),

];

const galleryData = [
  {
    date: 'May 13, 2023',
    subtitle: 'Foundation Outreach',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '9'].map((name) => ({ type: 'image', src: `/media/${name}.jpg` }))
  },
  {
    date: 'May 14, 2023',
    subtitle: 'During progress evaluation meeting',
    items: [{ type: 'image', src: '/media/10.jpg' }]
  },
  {
    date: 'May 16, 2023',
    subtitle: 'Community Activities',
    items: [11, 12, 13, 14, 15, 17].map(n => ({ type: 'image', src: `/media/${n}.jpg` })).concat([{ type: 'video', src: '/media/16.mp4' }])
  },
  {
    date: 'September 13, 2023',
    subtitle: 'Celebrating Ethiopian New Year',
    items: Array.from({ length: 16 }, (_, i) => ({ type: 'image', src: `/media/${i + 18}.jpg` }))
  },
  {
    date: 'July 3, 2025',
    subtitle: 'Food, educational materials, and clothing support for vulnerable elders and children.',
    items: [34, 35, 36, 37, 38, 39, 40].map(n => ({ type: 'image', src: `/media/${n}.jpg` }))
  },
  {
    date: 'July 4, 2025',
    subtitle: 'Diapers, wipes, and medicine support for children at Kibebe Tsehay Child Development Organization.',
    items: [{ type: 'image', src: '/media/41.jpg' }]
  },
  {
    date: 'July 5, 2025',
    subtitle: 'Diaper support for vulnerable elders at Kebere Aregawiyan and partner care organizations.',
    items: [{ type: 'image', src: '/media/43.jpg' }]
  },
  {
    date: 'September 7, 2025',
    subtitle: 'With Ethio Telecom support: school material support for children and student beneficiaries.',
    items: [52, 53].map(n => ({ type: 'image', src: `/media/${n}.jpg` }))
  },
  {
    date: 'September 7, 2025',
    subtitle: 'Celebrating Ethiopian New Year',
    items: [46, 47, 48, 49, 50].map(n => ({ type: 'image', src: `/media/${n}.jpg` }))
  },
  {
    date: 'September 10, 2025',
    subtitle: 'At PSD bank Arena Stadium, Frankfurt Germany',
    items: [{ type: 'video', src: '/media/video.mp4' }]
  }
];

const programs = [
  {
    title: 'Health Care Support',
    description: 'Medical referrals, periodic medical assistance, and support for essential treatment for vulnerable beneficiaries.'
  },
  {
    title: 'Educational Assistance',
    description: 'School materials, learning support, and yearly back-to-school support to keep children in education.'
  },
  {
    title: 'Basic Living Needs',
    description: 'Monthly financial support, food support cycles, and essential seasonal items for dignity and stability.'
  }
];

const impactCards = [
  { label: 'Current Beneficiaries', value: '60+' },
  { label: 'Sub-cities Served', value: '2' },
  { label: 'Woredas Reached', value: '3' },
  { label: 'Core Program Areas', value: '3' }
];
const teamMembers = [
  { name: 'Eng. Tagel Nigatu', role: 'Executive Director', image: '/media/tagel.jpg' },
  { name: 'Ethaferahu Andarge', role: 'Chairman, Board of Directors', image: '/media/eta.jpg' },
  { name: 'Ato Gizaw Alemu', role: 'Member, Board of Directors', image: '/media/get.jpg' },
  { name: 'Ato Wubamlak Mekonen', role: 'Member, Board of Directors', image: '/media/web.jpg' },
  { name: 'Genet Nigatu', role: 'Goodwill Ambassador', image: '/media/genet.jpg' }
];


const stories = [
  {
    title: 'New Year Support Distribution',
    date: 'September 2025',
    summary: 'Families received clothing and education materials to begin the Ethiopian New Year with confidence and dignity.'
  },
  {
    title: 'Quarterly Medical Assistance Cycle',
    date: 'June 2025',
    summary: 'The foundation completed one of its periodic medical support rounds for elderly and disability-focused households.'
  },
  {
    title: 'Community Partnership Outreach',
    date: 'March 2025',
    summary: 'Local supporters joined outreach activities to expand visibility and sustain monthly support commitments.'
  }
];

const adminQuickActions = [
  {
    key: 'volunteers',
    title: 'Review Volunteer Requests',
    detail: 'Check new Get Involved submissions and follow up with volunteers within 24 hours.',
    cta: 'Open Volunteer Inbox'
  },
  {
    key: 'report',
    title: 'Prepare Monthly Report',
    detail: 'Summarize beneficiaries, funds distributed, and major activities for transparency updates.',
    cta: 'Generate Report Draft'
  }
];

const adminRecentActivity = [
  { date: '2026-02-20', type: 'Volunteer', note: '3 new volunteer form submissions received.' },
  { date: '2026-02-19', type: 'Donation', note: 'Telebirr donation confirmations reconciled.' },
  { date: '2026-02-18', type: 'Gallery', note: 'Community outreach photos added to gallery timeline.' },
  { date: '2026-02-17', type: 'Programs', note: 'Monthly beneficiary support checklist updated.' }
];

const defaultContent = { programs, stories, galleryData };

function AppLayout({ content, setContent }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-top">
          <NavLink className="brand" to="/">
            <img src={toMediaUrl('/media/logo1.jpg')} alt="Samrawit Foundation logo" />
            <div>
              <strong>Samrawit Foundation</strong>
              <span>Serving with dignity and care</span>
            </div>
          </NavLink>
          <a className="header-cta" href="/donate">
            Donate Now
          </a>
        </div>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage programs={content.programs} />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/stories" element={<StoriesPage stories={content.stories} />} />
          <Route path="/gallery" element={<GalleryPage galleryData={content.galleryData} />} />
          <Route path="/admin" element={<AdminDashboardPage content={content} setContent={setContent} />} />

        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-main-grid">
          <div className="footer-col">
            <h4>THE FOUNDATION</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/programs">Programs</a></li>

            </ul>
          </div>
          <div className="footer-col">
            <h4>GET INVOLVED</h4>
            <ul>
              <li><a href="/donate">Donate</a></li>
              <li><a href="/get-involved">Volunteer</a></li>
              <li><a href="/stories">Stories</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>STAY CONNECTED</h4>
            <div className="footer-socials" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px',justifyItems:'center'}}>
              <a href="mailto:samrawitfoundation@gmail.com" title="Email"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" /></a>
              <a href="https://t.me/samrawitfoundation" target="_blank" rel="noreferrer" title="Telegram"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram" /></a>
              <a href="https://wa.me/251911246519" target="_blank" rel="noreferrer" title="WhatsApp"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" /></a>
              <a href="https://www.instagram.com/samrawitfoundation/" target="_blank" rel="noreferrer" title="Instagram"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" /></a>
              <a href="https://web.facebook.com/profile.php?id=100090874201533" target="_blank" rel="noreferrer" title="Facebook" style={{gridColumn:'2'}}>
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style={{width:'32px',height:'32px',borderRadius:'8px',background:'#e0e7ff',padding:'5px',boxShadow:'0 2px 8px rgba(102,126,234,0.10)'}} />
              </a>
              <a href="https://x.com/samrawitfound" target="_blank" rel="noreferrer" title="X" style={{gridColumn:'3'}}>
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png" alt="X" style={{width:'32px',height:'32px',borderRadius:'8px',background:'#e0e7ff',padding:'5px',boxShadow:'0 2px 8px rgba(102,126,234,0.10)'}} />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>CONTACT</h4>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              <li><a href="tel:+251911820607">+251 911 820607</a></li>
              <li><a href="tel:+251912202838">+251 912 202 838</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>Designed and Developed by Dagim Alemayehu | Contact: 0930105595 / 0917923211</span><br /><span>Samrawit Foundation &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="footer-bottom-right">
            <a href="#" className="footer-legal">Privacy Policy</a>
            <span className="footer-divider">|</span>
            <a href="#" className="footer-legal">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="kicker">General Overview</p>
          <h1>Restoring dignity, hope, and opportunity for vulnerable communities.</h1>
          <p>
            Samrawit Foundation is a charitable endowment organization established in loving memory of Samrawit Tagel Nigatu. The foundation works to support
            destitute children, elderly individuals, and people living with disabilities across Bole and Gulele sub-cities in Addis Ababa.
          </p>
          <div className="action-row">
            <a className="btn-primary" href="/donate">Support the Mission</a>
            <a className="btn-secondary" href="/about">Learn More</a>
          </div>
        </div>
        <img src={toMediaUrl('/media/sa25.jpg')} alt="Samrawit Foundation beneficiaries" />
      </section>

      <section className="stats-grid">
        {impactCards.map((item) => (
          <article key={item.label} className="metric-card">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      <section className="split-card">
        <div>
          <h2>Focused, family-funded community support</h2>
          <p>
            Beneficiaries receive monthly financial support as well as periodic food and medical assistance three times each year. Clothing and educational
            materials are also provided at the start of the Ethiopian New Year.
          </p>
        </div>
        <img src={toMediaUrl('/media/logo1.jpg')} alt="Samrawit Foundation emblem" />
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="A family-founded foundation built in memory, compassion, and a long-term commitment to vulnerable people in Addis Ababa."
      />
      <section className="text-section">
        <p>
          Samrawit Foundation is a charitable endowment organization established in loving memory of our late Samrawit Tagel Nigatu, who passed away at the
          young age of nine due to a home-based accident. Created by her family to honor her life and compassion, the foundation officially began its work on
          August 16, 2023.
        </p>
        <p>
          The foundation is dedicated to supporting vulnerable members of the community, including destitute children, elderly individuals, and people living
          with disabilities by helping restore dignity, hope, and opportunity in their daily lives.
        </p>
      </section>
      <section className="team-section">
        <div className="team-header">
          <p className="kicker">Our Team</p>
          <h2>The people behind the mission</h2>
          <p>
            Our dedicated team works together to deliver consistent care, coordinate volunteers, and keep community support programs running with dignity.
          </p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="team-card">
              <img src={toMediaUrl(member.image)} alt={member.name} loading="lazy" />
              <div className="team-card-body">
                <span className="team-badge">Team Member</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProgramsPage({ programs }) {
  return (
    <>
      <PageHeader title="Our Programs" subtitle="Three integrated program pillars designed to support immediate needs while enabling long-term stability." />
      <section className="cards-grid">
        {programs.map((program) => (
          <article key={program.title} className="program-card">
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function ImpactPage() {
  const allocations = [
    { area: 'Basic Living Needs', percentage: 45, color: '#667eea' },
    { area: 'Health Care Support', percentage: 30, color: '#764ba2' },
    { area: 'Educational Assistance', percentage: 25, color: '#5a67d8' },
  ];

  return (
    <>
      <PageHeader
        title={<span className="impact-title">Impact & Transparency</span>}
        subtitle="Clear reporting on who we serve, how support is delivered, and where resources are allocated."
      />

      <section className="stats-grid">
        {impactCards.map((item) => (
          <article key={item.label} className="metric-card">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      {/* New Allocation Visualizer */}
      <section className="table-card">
        <h3>Program Resource Allocation</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
          How we distribute our current endowment and donation funds across core pillars:
        </p>
        <div className="allocation-container">
          {allocations.map((item) => (
            <div key={item.area} style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.area}</span>
                <span style={{ fontWeight: '700', color: item.color }}>{item.percentage}%</span>
              </div>
              <div className="progress-bg">
                <div 
                  className="progress-fill" 
                  style={{ width: `${item.percentage}%`, background: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="table-card">
        <h3>Support Delivery Model</h3>
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Delivery Frequency</th>
              <th>Current Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Financial Support</td>
              <td>Every month</td>
              <td>Ongoing beneficiaries</td>
            </tr>
            <tr>
              <td>Food & Medical Assistance</td>
              <td>Three times per year</td>
              <td>Bole and Gulele sub-cities</td>
            </tr>
            <tr>
              <td>New Year Materials</td>
              <td>Annually</td>
              <td>Clothing and educational support</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

function DonationPage() {
  const [copied, setCopied] = useState('');
  const telebirrRemitGuideUrl = 'https://www.youtube.com/watch?v=N03p0PqQkT4';

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const banks = [
    { name: 'Commercial Bank of Ethiopia (CBE)', acc: '1000551542778', icon: '/media/cbe.png', iconAlt: 'CBE Logo' },
    { name: 'Dashen Bank', acc: '0534334457011', icon: '/media/Dashen.png', iconAlt: 'Dashen Logo' },
    { name: 'Telebirr Remit', acc: '0909855585', icon: '/media/remit.png', iconAlt: 'Telebirr Logo' },
  ];

  return (
    <>
      <PageHeader title="Donation" subtitle="Your generosity fuels hope. Support the Samrawit Foundation through secure local channels." />
      
      <section className="donation-grid">
        {/* Left Column: Direct Transfer */}
        <div className="donation-panel">
          <h3 className="section-title">Bank & Remit Transfer</h3>
          <p className="helper-text">Transfer directly to our foundation accounts via bank or Telebirr Remit.</p>
          
          <div className="bank-list">
            {banks.map((bank) => (
              <div key={bank.name} className="bank-card">
                <div className="bank-info">
                  <span className="bank-icon"><img src={toMediaUrl(bank.icon)} alt={bank.iconAlt} className="bank-icon-img" /></span>
                  <div>
                    <p className="bank-name">{bank.name}</p>
                    <p className="bank-acc">{bank.acc}</p>
                  </div>
                </div>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(bank.acc, bank.name)}
                >
                  {copied === bank.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
          <p className="helper-text">
            Need help with Telebirr Remit?{' '}
            <a href={telebirrRemitGuideUrl} target="_blank" rel="noreferrer">
              Watch the guide video
            </a>
            .
          </p>
        </div>

        {/* Right Column: Telebirr & Mobile Money */}
        <div className="donation-panel mobile-money">
          <h3 className="section-title">Mobile Money</h3>
          <div className="telebirr-container">
             <div className="telebirr-header">
                <img src={toMediaUrl('/media/Telebirr.png')} alt="Telebirr" className="tele-logo" />
                <div>
                  <p className="tele-name">Samrawit Foundation</p>
                  <p className="tele-num">Scan here</p>
                </div>
             </div>
             <div className="qr-placeholder">
               {/* Replace with actual QR image */}
               
               <div className="qr-box"> <img src={toMediaUrl('/media/qr.png')} /></div>
             </div>
          </div>
          
          <div className="donation-impact-hint">
            <p><strong>💡 Impact Hint:</strong> 10,200 ETB provides essential medical support for one elderly beneficiary for a month.</p>
          </div>
        </div>
      </section>

      <section className="confirmation-card">
        <h3>Verify Your Donation</h3>
        <p>After your transfer, please send a screenshot of the receipt via Telegram or Email so we can send your digital thank-you note and acknowledgement.</p>
        <div className="action-row">
          <a className="btn-primary" href="https://t.me/samrawitfoundation">Send Receipt via Telegram</a>
          <a className="btn-secondary" href="mailto:samrawitfoundation@gmail.com">Email Receipt</a>
        </div>
      </section>
    </>
  );
}

function GetInvolvedPage() {
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', helpType: '', receiveUpdates: false });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'receiveUpdates') {
      setForm((prev) => ({ ...prev, receiveUpdates: event.target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSubmitting(true);

    try {
      // Server route logs submission and sends the Telegram message.
      const response = await fetch(buildApiUrl('/api/get-involved'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const rawBody = await response.text();
      let data = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch (_parseError) {
        // Non-JSON server response.
      }

      if (!response.ok) {
        const serverMessage =
          data.error ||
          (rawBody && !rawBody.trim().startsWith('<') ? rawBody.trim() : '');
        throw new Error(
          serverMessage || `Submission failed (HTTP ${response.status}). Please try again.`
        );
      }

      setForm({ fullName: '', phoneNumber: '', email: '', helpType: '', receiveUpdates: false });
      setStatus({ type: 'success', message: 'Thank you. Your information was sent and the team will contact you.' });
    } catch (error) {
      const rawMessage = String(error?.message || '');
      if (rawMessage.toLowerCase().includes('failed to fetch')) {
        setStatus({
          type: 'error',
          message: 'Could not reach the server. Make sure the backend is running and try again.'
        });
      } else {
        setStatus({ type: 'error', message: rawMessage || 'Could not submit your form.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Get Involved" subtitle="Join as a volunteer, partner organization, sponsor, or community advocate." />
      <section className="cards-grid">
        <article className="program-card">
          <h3>Volunteer</h3>
          <p>Support field activities, distributions, and outreach initiatives.</p>
        </article>
        <article className="program-card">
          <h3>Partner</h3>
          <p>Collaborate with us on service delivery and impact expansion.</p>
        </article>
        <article className="program-card">
          <h3>Advocate</h3>
          <p>Help amplify the mission by sharing stories and mobilizing networks.</p>
        </article>
      </section>
      <section className="contact-cta">
        <p>Fill this form and we will send your details to the foundation Telegram bot for follow-up.</p>
        <form className="involve-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+251..."
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <label htmlFor="helpType">How do you want to help?</label>
          <textarea
            id="helpType"
            name="helpType"
            value={form.helpType}
            onChange={handleChange}
            rows={4}
            placeholder="Volunteer, sponsor, partner, donation support, etc."
            required
          />

          <div className="form-group" style={{margin:'1.5em 0 1em 0'}}>
            <label htmlFor="receiveUpdates" style={{display:'flex', alignItems:'center', cursor:'pointer', gap:'0.5em', fontWeight:'500', fontSize:'1.05em'}}>
              <input
                id="receiveUpdates"
                name="receiveUpdates"
                type="checkbox"
                checked={form.receiveUpdates}
                onChange={handleChange}
                style={{width:'1.1em', height:'1.1em'}}
              />
              Want to receive updates?
            </label>
          </div>

          <button className="btn-primary form-submit" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit'}
          </button>
          {status.message && <p className={status.type === 'success' ? 'form-success' : 'form-error'}>{status.message}</p>}
        </form>
      </section>
    </>
  );
}

function StoriesPage({ stories }) {
  return (
    <>
      <PageHeader title="Stories & Blog" subtitle="Updates, milestones, and stories from the communities and families we serve." />
      <section className="cards-grid">
        {stories.map((story) => (
          <article key={story.title} className="program-card">
            <p className="story-date">{story.date}</p>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function AdminDashboardPage({ content, setContent }) {
  const storageKey = 'samrawit_admin_token';
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) || '');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [saveState, setSaveState] = useState({ section: '', message: '', error: '' });
  const [activeSection, setActiveSection] = useState('programs');
  const [programDraft, setProgramDraft] = useState({ title: '', description: '' });
  const [programEditIndex, setProgramEditIndex] = useState(-1);
  const [storyDraft, setStoryDraft] = useState({ title: '', date: '', summary: '' });
  const [storyEditIndex, setStoryEditIndex] = useState(-1);
  const [galleryGroupDraft, setGalleryGroupDraft] = useState({ date: '', subtitle: '' });
  const [galleryGroupEditIndex, setGalleryGroupEditIndex] = useState(-1);
  const [selectedGalleryGroupIndex, setSelectedGalleryGroupIndex] = useState(0);
  const [galleryItemDraft, setGalleryItemDraft] = useState({ type: 'image', src: '/media/' });
  const [galleryItemEditIndex, setGalleryItemEditIndex] = useState(-1);
  const [dirtySections, setDirtySections] = useState({ programs: false, stories: false, galleryData: false });
  const [dragState, setDragState] = useState({ type: '', index: -1 });
  const [uploadState, setUploadState] = useState({ file: null, loading: false, error: '', message: '' });
  const [quickPanel, setQuickPanel] = useState('volunteers');
  const [volunteerSubmissions, setVolunteerSubmissions] = useState([]);
  const [reportDraft, setReportDraft] = useState('');

  useEffect(() => {
    if (!token) return;
    let ignore = false;
    const loadAdminContent = async () => {
      setLoading(true);
      setAuthError('');
      try {
        const response = await fetch('/api/admin/content', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Session expired. Please login again.' : 'Could not load admin content.');
        }
        const data = await response.json();
        if (!ignore) {
          setContent({
            programs: Array.isArray(data.programs) ? data.programs : [],
            stories: Array.isArray(data.stories) ? data.stories : [],
            galleryData: Array.isArray(data.galleryData) ? data.galleryData : []
          });
          setDirtySections({ programs: false, stories: false, galleryData: false });
        }

        const volunteerRes = await fetch('/api/admin/volunteer-submissions', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (volunteerRes.ok) {
          const volunteerData = await volunteerRes.json();
          if (!ignore) {
            setVolunteerSubmissions(Array.isArray(volunteerData.items) ? volunteerData.items : []);
          }
        }

      } catch (error) {
        if (!ignore) {
          localStorage.removeItem(storageKey);
          setToken('');
          setAuthError(error.message || 'Authentication failed.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadAdminContent();
    return () => {
      ignore = true;
    };
  }, [token, setContent]);

  const dashboardMetrics = [
    { label: 'Programs', value: String(content.programs.length) },
    { label: 'Stories', value: String(content.stories.length) },
    { label: 'Gallery Groups', value: String(content.galleryData.length) },
    { label: 'Last Sync', value: loading ? 'Syncing...' : 'Ready' }
  ];
  const hasUnsavedChanges = Object.values(dirtySections).some(Boolean);

  const markDirty = (section) => {
    setDirtySections((prev) => ({ ...prev, [section]: true }));
  };

  const clearDirty = (section) => {
    setDirtySections((prev) => ({ ...prev, [section]: false }));
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!hasUnsavedChanges) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('/')) return;
      const proceed = window.confirm('You have unsaved admin changes. Leave this page anyway?');
      if (!proceed) {
        event.preventDefault();
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedChanges]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      localStorage.setItem(storageKey, data.token);
      setToken(data.token);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setAuthError(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(storageKey);
    setToken('');
    setSaveState({ section: '', message: '', error: '' });
  };

  const persistSection = async (section, payload) => {
    setSaveState({ section, message: '', error: '' });
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not save section.');
      }
      setContent({
        programs: Array.isArray(data.content?.programs) ? data.content.programs : [],
        stories: Array.isArray(data.content?.stories) ? data.content.stories : [],
        galleryData: Array.isArray(data.content?.galleryData) ? data.content.galleryData : []
      });
      clearDirty(section);
      setSaveState({ section, message: 'Saved successfully.', error: '' });
    } catch (error) {
      setSaveState({ section, message: '', error: error.message || 'Save failed.' });
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateProgram = () => {
    if (!programDraft.title.trim() || !programDraft.description.trim()) return;
    const next = [...content.programs];
    const record = { title: programDraft.title.trim(), description: programDraft.description.trim() };
    if (programEditIndex >= 0) {
      next[programEditIndex] = record;
    } else {
      next.push(record);
    }
    setContent((prev) => ({ ...prev, programs: next }));
    markDirty('programs');
    setProgramDraft({ title: '', description: '' });
    setProgramEditIndex(-1);
  };

  const editProgram = (index) => {
    const item = content.programs[index];
    setProgramDraft({ title: item.title || '', description: item.description || '' });
    setProgramEditIndex(index);
  };

  const removeProgram = (index) => {
    const next = content.programs.filter((_, idx) => idx !== index);
    setContent((prev) => ({ ...prev, programs: next }));
    markDirty('programs');
    if (programEditIndex === index) {
      setProgramDraft({ title: '', description: '' });
      setProgramEditIndex(-1);
    }
  };

  const addOrUpdateStory = () => {
    if (!storyDraft.title.trim() || !storyDraft.date.trim() || !storyDraft.summary.trim()) return;
    const next = [...content.stories];
    const record = { title: storyDraft.title.trim(), date: storyDraft.date.trim(), summary: storyDraft.summary.trim() };
    if (storyEditIndex >= 0) {
      next[storyEditIndex] = record;
    } else {
      next.push(record);
    }
    setContent((prev) => ({ ...prev, stories: next }));
    markDirty('stories');
    setStoryDraft({ title: '', date: '', summary: '' });
    setStoryEditIndex(-1);
  };

  const editStory = (index) => {
    const item = content.stories[index];
    setStoryDraft({ title: item.title || '', date: item.date || '', summary: item.summary || '' });
    setStoryEditIndex(index);
  };

  const removeStory = (index) => {
    const next = content.stories.filter((_, idx) => idx !== index);
    setContent((prev) => ({ ...prev, stories: next }));
    markDirty('stories');
    if (storyEditIndex === index) {
      setStoryDraft({ title: '', date: '', summary: '' });
      setStoryEditIndex(-1);
    }
  };

  const safeGalleryGroupIndex = content.galleryData.length
    ? Math.min(selectedGalleryGroupIndex, content.galleryData.length - 1)
    : 0;
  const selectedGalleryGroup = content.galleryData[safeGalleryGroupIndex] || null;

  const addOrUpdateGalleryGroup = () => {
    if (!galleryGroupDraft.date.trim() || !galleryGroupDraft.subtitle.trim()) return;
    const next = [...content.galleryData];
    const currentItems = galleryGroupEditIndex >= 0 ? (next[galleryGroupEditIndex]?.items || []) : [];
    const record = {
      date: galleryGroupDraft.date.trim(),
      subtitle: galleryGroupDraft.subtitle.trim(),
      items: currentItems
    };
    if (galleryGroupEditIndex >= 0) {
      next[galleryGroupEditIndex] = record;
      setSelectedGalleryGroupIndex(galleryGroupEditIndex);
    } else {
      next.push(record);
      setSelectedGalleryGroupIndex(next.length - 1);
    }
    setContent((prev) => ({ ...prev, galleryData: next }));
    markDirty('galleryData');
    setGalleryGroupDraft({ date: '', subtitle: '' });
    setGalleryGroupEditIndex(-1);
  };

  const editGalleryGroup = (index) => {
    const group = content.galleryData[index];
    setGalleryGroupDraft({ date: group.date || '', subtitle: group.subtitle || '' });
    setGalleryGroupEditIndex(index);
    setSelectedGalleryGroupIndex(index);
  };

  const removeGalleryGroup = (index) => {
    const next = content.galleryData.filter((_, idx) => idx !== index);
    setContent((prev) => ({ ...prev, galleryData: next }));
    markDirty('galleryData');
    setSelectedGalleryGroupIndex(0);
    setGalleryGroupDraft({ date: '', subtitle: '' });
    setGalleryGroupEditIndex(-1);
    setGalleryItemDraft({ type: 'image', src: '/media/' });
    setGalleryItemEditIndex(-1);
  };

  const addOrUpdateGalleryItem = () => {
    if (!selectedGalleryGroup) return;
    if (!galleryItemDraft.src.trim()) return;
    const next = [...content.galleryData];
    const items = [...(next[safeGalleryGroupIndex]?.items || [])];
    const record = { type: galleryItemDraft.type, src: galleryItemDraft.src.trim() };
    if (galleryItemEditIndex >= 0) {
      items[galleryItemEditIndex] = record;
    } else {
      items.push(record);
    }
    next[safeGalleryGroupIndex] = { ...next[safeGalleryGroupIndex], items };
    setContent((prev) => ({ ...prev, galleryData: next }));
    markDirty('galleryData');
    setGalleryItemDraft({ type: 'image', src: '/media/' });
    setGalleryItemEditIndex(-1);
  };

  const editGalleryItem = (index) => {
    if (!selectedGalleryGroup) return;
    const item = selectedGalleryGroup.items[index];
    setGalleryItemDraft({ type: item.type || 'image', src: item.src || '/media/' });
    setGalleryItemEditIndex(index);
  };

  const removeGalleryItem = (index) => {
    if (!selectedGalleryGroup) return;
    const next = [...content.galleryData];
    const items = selectedGalleryGroup.items.filter((_, idx) => idx !== index);
    next[safeGalleryGroupIndex] = { ...next[safeGalleryGroupIndex], items };
    setContent((prev) => ({ ...prev, galleryData: next }));
    markDirty('galleryData');
    setGalleryItemDraft({ type: 'image', src: '/media/' });
    setGalleryItemEditIndex(-1);
  };

  const startDrag = (type, index) => {
    setDragState({ type, index });
  };

  const dropOn = (type, targetIndex) => {
    if (dragState.type !== type || dragState.index < 0 || dragState.index === targetIndex) {
      setDragState({ type: '', index: -1 });
      return;
    }

    if (type === 'programs') {
      const next = [...content.programs];
      const [moved] = next.splice(dragState.index, 1);
      next.splice(targetIndex, 0, moved);
      setContent((prev) => ({ ...prev, programs: next }));
      markDirty('programs');
    }

    if (type === 'stories') {
      const next = [...content.stories];
      const [moved] = next.splice(dragState.index, 1);
      next.splice(targetIndex, 0, moved);
      setContent((prev) => ({ ...prev, stories: next }));
      markDirty('stories');
    }

    if (type === 'gallery-groups') {
      const next = [...content.galleryData];
      const [moved] = next.splice(dragState.index, 1);
      next.splice(targetIndex, 0, moved);
      setContent((prev) => ({ ...prev, galleryData: next }));
      setSelectedGalleryGroupIndex(targetIndex);
      markDirty('galleryData');
    }

    if (type === 'gallery-items' && selectedGalleryGroup) {
      const next = [...content.galleryData];
      const items = [...selectedGalleryGroup.items];
      const [moved] = items.splice(dragState.index, 1);
      items.splice(targetIndex, 0, moved);
      next[safeGalleryGroupIndex] = { ...next[safeGalleryGroupIndex], items };
      setContent((prev) => ({ ...prev, galleryData: next }));
      markDirty('galleryData');
    }

    setDragState({ type: '', index: -1 });
  };

  const handleMediaFileSelect = (event) => {
    const file = event.target.files?.[0] || null;
    setUploadState({ file, loading: false, error: '', message: '' });
  };

  const uploadGalleryMedia = async () => {
    if (!uploadState.file) return;
    setUploadState((prev) => ({ ...prev, loading: true, error: '', message: '' }));
    try {
      const buffer = await uploadState.file.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const dataBase64 = btoa(binary);
      const response = await fetch('/api/admin/upload-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: uploadState.file.name,
          dataBase64
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not upload media.');
      }
      setGalleryItemDraft((prev) => ({ ...prev, src: data.src || prev.src }));
      setUploadState({ file: null, loading: false, error: '', message: `Uploaded: ${data.src}` });
    } catch (error) {
      setUploadState((prev) => ({ ...prev, loading: false, error: error.message || 'Upload failed.' }));
    }
  };

  const handleQuickAction = (key) => {
    if (key === 'volunteers') {
      setQuickPanel('volunteers');
      return;
    }
    if (key === 'report') {
      const summary = [
        `Samrawit Foundation Monthly Draft Report (${new Date().toLocaleDateString()})`,
        '',
        `Programs: ${content.programs.length}`,
        `Stories: ${content.stories.length}`,
        `Gallery Groups: ${content.galleryData.length}`,
        `Volunteer Submissions: ${volunteerSubmissions.length}`,
        '',
        'Latest Stories:',
        ...content.stories.slice(0, 5).map((story) => `- ${story.date}: ${story.title}`),
        '',
        'Action Notes:',
        '- Review pending volunteer submissions.',
        '- Publish at least one new story and gallery update this month.'
      ].join('\n');
      setReportDraft(summary);
      setQuickPanel('report');
    }
  };

  const downloadReportDraft = () => {
    if (!reportDraft) return;
    const blob = new Blob([reportDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samrawit-report-draft-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <>
        <PageHeader
          title="Admin Dashboard Login"
          subtitle="Secure sign-in for content management, reporting, and operational workflows."
        />
        <section className="table-card admin-auth-card">
          <form className="admin-auth-form" onSubmit={handleLogin}>
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={loginForm.username}
              onChange={handleLoginChange}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />

            <button className="btn-primary admin-action-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {authError && <p className="form-error">{authError}</p>}
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Protected area for content operations and live website updates."
      />

      <section className="table-card admin-toolbar">
        <div>
          <p>
            Signed in as admin. Changes here update the live site content API.
            {hasUnsavedChanges ? ' You have unsaved changes.' : ''}
          </p>
          <div className="admin-status-row">
            <span className="admin-status-pill">{loading ? 'Syncing' : 'Synced'}</span>
            <span className={`admin-status-pill ${hasUnsavedChanges ? 'warn' : 'ok'}`}>
              {hasUnsavedChanges ? 'Unsaved Changes' : 'All Changes Saved'}
            </span>
            <span className="admin-status-pill muted">Protected Session</span>
          </div>
        </div>
        <button type="button" className="btn-secondary" onClick={handleLogout}>Logout</button>
      </section>

      <section className="stats-grid">
        {dashboardMetrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <div className="table-card admin-panel">
          <h3>Recent Activity</h3>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {adminRecentActivity.map((item) => (
                  <tr key={`${item.date}-${item.type}`}>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-actions-stack">
          {adminQuickActions.map((action) => (
            <article key={action.title} className={`program-card admin-action-card admin-action-${action.key}`}>
              <h3>{action.title}</h3>
              <p>{action.detail}</p>
              <button type="button" className="btn-primary admin-action-btn" onClick={() => handleQuickAction(action.key)}>
                {action.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="table-card admin-quick-panel">
        {quickPanel === 'volunteers' && (
          <>
            <h3>Volunteer Inbox</h3>
            {volunteerSubmissions.length === 0 ? (
              <p className="admin-muted">No volunteer submissions have been received yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Help Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerSubmissions.map((item, index) => (
                      <tr key={`${item.submittedAt}-${index}`}>
                        <td>{item.submittedAt || '-'}</td>
                        <td>{item.fullName || '-'}</td>
                        <td>{item.phoneNumber || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.helpType || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {quickPanel === 'report' && (
          <>
            <h3>Report Draft</h3>
            <textarea className="admin-report-draft" value={reportDraft} onChange={(e) => setReportDraft(e.target.value)} rows={14} />
            <div className="admin-inline-actions">
              <button type="button" className="btn-primary admin-action-btn" onClick={downloadReportDraft}>Download Draft</button>
              <button type="button" className="btn-secondary" onClick={() => navigator.clipboard.writeText(reportDraft)}>Copy to Clipboard</button>
            </div>
          </>
        )}
      </section>

      <section className="admin-editor-grid">
        <article className="table-card admin-editor-card admin-editor-card-wide">
          <div className="admin-section-tabs">
            <button type="button" className={activeSection === 'programs' ? 'admin-section-btn active' : 'admin-section-btn'} onClick={() => setActiveSection('programs')}>Programs</button>
            <button type="button" className={activeSection === 'stories' ? 'admin-section-btn active' : 'admin-section-btn'} onClick={() => setActiveSection('stories')}>Stories</button>
            <button type="button" className={activeSection === 'galleryData' ? 'admin-section-btn active' : 'admin-section-btn'} onClick={() => setActiveSection('galleryData')}>Gallery</button>
          </div>

          {activeSection === 'programs' && (
            <>
              <h3>Programs Editor</h3>
              <div className="admin-input-grid">
                <input className="admin-text-input" placeholder="Program title" value={programDraft.title} onChange={(e) => setProgramDraft((prev) => ({ ...prev, title: e.target.value }))} />
                <textarea className="admin-textarea" placeholder="Program description" value={programDraft.description} onChange={(e) => setProgramDraft((prev) => ({ ...prev, description: e.target.value }))} rows={3} />
                <div className="admin-inline-actions">
                  <button type="button" className="btn-primary admin-action-btn" onClick={addOrUpdateProgram}>{programEditIndex >= 0 ? 'Update Program' : 'Add Program'}</button>
                  {programEditIndex >= 0 && <button type="button" className="btn-secondary" onClick={() => { setProgramDraft({ title: '', description: '' }); setProgramEditIndex(-1); }}>Cancel Edit</button>}
                  <button type="button" className="btn-primary admin-action-btn" onClick={() => persistSection('programs', content.programs)} disabled={loading}>Save Programs to Website</button>
                </div>
              </div>
              <div className="admin-list">
                {content.programs.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="admin-list-item"
                    draggable
                    onDragStart={() => startDrag('programs', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropOn('programs', index)}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn-secondary" onClick={() => editProgram(index)}>Edit</button>
                      <button type="button" className="btn-secondary" onClick={() => removeProgram(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {saveState.section === 'programs' && saveState.message && <p className="form-success">{saveState.message}</p>}
              {saveState.section === 'programs' && saveState.error && <p className="form-error">{saveState.error}</p>}
            </>
          )}

          {activeSection === 'stories' && (
            <>
              <h3>Stories Editor</h3>
              <div className="admin-input-grid">
                <input className="admin-text-input" placeholder="Story title" value={storyDraft.title} onChange={(e) => setStoryDraft((prev) => ({ ...prev, title: e.target.value }))} />
                <input className="admin-text-input" placeholder="Story date (e.g. September 2025)" value={storyDraft.date} onChange={(e) => setStoryDraft((prev) => ({ ...prev, date: e.target.value }))} />
                <textarea className="admin-textarea" placeholder="Story summary" value={storyDraft.summary} onChange={(e) => setStoryDraft((prev) => ({ ...prev, summary: e.target.value }))} rows={3} />
                <div className="admin-inline-actions">
                  <button type="button" className="btn-primary admin-action-btn" onClick={addOrUpdateStory}>{storyEditIndex >= 0 ? 'Update Story' : 'Add Story'}</button>
                  {storyEditIndex >= 0 && <button type="button" className="btn-secondary" onClick={() => { setStoryDraft({ title: '', date: '', summary: '' }); setStoryEditIndex(-1); }}>Cancel Edit</button>}
                  <button type="button" className="btn-primary admin-action-btn" onClick={() => persistSection('stories', content.stories)} disabled={loading}>Save Stories to Website</button>
                </div>
              </div>
              <div className="admin-list">
                {content.stories.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="admin-list-item"
                    draggable
                    onDragStart={() => startDrag('stories', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropOn('stories', index)}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.date}</p>
                      <p>{item.summary}</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn-secondary" onClick={() => editStory(index)}>Edit</button>
                      <button type="button" className="btn-secondary" onClick={() => removeStory(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {saveState.section === 'stories' && saveState.message && <p className="form-success">{saveState.message}</p>}
              {saveState.section === 'stories' && saveState.error && <p className="form-error">{saveState.error}</p>}
            </>
          )}

          {activeSection === 'galleryData' && (
            <>
              <h3>Gallery Editor</h3>
              <p className="admin-muted">Step 1: Manage groups (date + subtitle). Step 2: Manage items in selected group.</p>
              <div className="admin-input-grid">
                <input className="admin-text-input" placeholder="Group date" value={galleryGroupDraft.date} onChange={(e) => setGalleryGroupDraft((prev) => ({ ...prev, date: e.target.value }))} />
                <input className="admin-text-input" placeholder="Group subtitle" value={galleryGroupDraft.subtitle} onChange={(e) => setGalleryGroupDraft((prev) => ({ ...prev, subtitle: e.target.value }))} />
                <div className="admin-inline-actions">
                  <button type="button" className="btn-primary admin-action-btn" onClick={addOrUpdateGalleryGroup}>{galleryGroupEditIndex >= 0 ? 'Update Group' : 'Add Group'}</button>
                  {galleryGroupEditIndex >= 0 && <button type="button" className="btn-secondary" onClick={() => { setGalleryGroupDraft({ date: '', subtitle: '' }); setGalleryGroupEditIndex(-1); }}>Cancel Edit</button>}
                  <button type="button" className="btn-primary admin-action-btn" onClick={() => persistSection('galleryData', content.galleryData)} disabled={loading}>Save Gallery to Website</button>
                </div>
              </div>

              <div className="admin-list">
                {content.galleryData.map((group, index) => (
                  <div
                    key={`${group.date}-${index}`}
                    className="admin-list-item"
                    draggable
                    onDragStart={() => startDrag('gallery-groups', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropOn('gallery-groups', index)}
                  >
                    <div>
                      <strong>{group.date}</strong>
                      <p>{group.subtitle}</p>
                      <p className="admin-muted">{Array.isArray(group.items) ? group.items.length : 0} media items</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn-secondary" onClick={() => setSelectedGalleryGroupIndex(index)}>Select</button>
                      <button type="button" className="btn-secondary" onClick={() => editGalleryGroup(index)}>Edit</button>
                      <button type="button" className="btn-secondary" onClick={() => removeGalleryGroup(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedGalleryGroup && (
                <div className="admin-subpanel">
                  <h4>Selected Group: {selectedGalleryGroup.date}</h4>
                  <div className="admin-upload-row">
                    <input type="file" accept="image/*,video/*" onChange={handleMediaFileSelect} />
                    <button type="button" className="btn-secondary" onClick={uploadGalleryMedia} disabled={!uploadState.file || uploadState.loading}>
                      {uploadState.loading ? 'Uploading...' : 'Upload to Media Folder'}
                    </button>
                  </div>
                  {uploadState.message && <p className="form-success">{uploadState.message}</p>}
                  {uploadState.error && <p className="form-error">{uploadState.error}</p>}
                  <div className="admin-input-grid">
                    <select className="admin-text-input" value={galleryItemDraft.type} onChange={(e) => setGalleryItemDraft((prev) => ({ ...prev, type: e.target.value }))}>
                      <option value="image">image</option>
                      <option value="video">video</option>
                    </select>
                    <input className="admin-text-input" placeholder="/media/filename.jpg" value={galleryItemDraft.src} onChange={(e) => setGalleryItemDraft((prev) => ({ ...prev, src: e.target.value }))} />
                    <div className="admin-inline-actions">
                      <button type="button" className="btn-primary admin-action-btn" onClick={addOrUpdateGalleryItem}>{galleryItemEditIndex >= 0 ? 'Update Item' : 'Add Item'}</button>
                      {galleryItemEditIndex >= 0 && <button type="button" className="btn-secondary" onClick={() => { setGalleryItemDraft({ type: 'image', src: '/media/' }); setGalleryItemEditIndex(-1); }}>Cancel Edit</button>}
                    </div>
                  </div>
                  <div className="admin-list">
                    {(selectedGalleryGroup.items || []).map((item, index) => (
                      <div
                        key={`${item.src}-${index}`}
                        className="admin-list-item"
                        draggable
                        onDragStart={() => startDrag('gallery-items', index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => dropOn('gallery-items', index)}
                      >
                        <div>
                          <strong>{item.type}</strong>
                          <p>{item.src}</p>
                        </div>
                        <div className="admin-inline-actions">
                          <button type="button" className="btn-secondary" onClick={() => editGalleryItem(index)}>Edit</button>
                          <button type="button" className="btn-secondary" onClick={() => removeGalleryItem(index)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {saveState.section === 'galleryData' && saveState.message && <p className="form-success">{saveState.message}</p>}
              {saveState.section === 'galleryData' && saveState.error && <p className="form-error">{saveState.error}</p>}
            </>
          )}
        </article>
      </section>
    </>
  );
}

function GalleryPage({ galleryData }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const sortedGalleryData = [...galleryData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeB - timeA;
  });

  const flatItems = sortedGalleryData.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({
      ...item,
      groupIndex,
      itemIndex
    }))
  );

  const goToPrevious = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + flatItems.length) % flatItems.length);
  };

  const goToNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % flatItems.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const activeItem = activeIndex !== null ? flatItems[activeIndex] : null;

  return (
    <>
      <PageHeader title="Gallery" subtitle="Chronological moments of our service." />

      <div className="gallery-timeline">
        {sortedGalleryData.map((group, gIdx) => (
          <section key={gIdx} className="gallery-group-block">
            <div className="group-meta">
              <span className="group-date-label">{group.date}</span>
              <h3 className="group-event-title">{group.subtitle}</h3>
            </div>

            <div className="gallery-grid">
              {group.items.map((item, iIdx) => {
                const currentIndex = flatItems.findIndex(
                  (entry) => entry.groupIndex === gIdx && entry.itemIndex === iIdx
                );

                return (
                  <div
                    key={iIdx}
                    className="gallery-card"
                    onClick={() => setActiveIndex(currentIndex)}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={toMediaUrl(item.src)}
                        alt="Foundation Impact"
                        loading="lazy"
                        onError={() => console.error('Image failed to load at:', toMediaUrl(item.src))}
                      />
                    ) : (
                      <div className="video-thumb-overlay">
                        <div className="play-icon">?</div>
                        <span>Watch Video</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {activeItem && (
        <div className="lightbox-overlay" onClick={() => setActiveIndex(null)}>
          <button className="lightbox-close-btn" onClick={() => setActiveIndex(null)}>&times;</button>
          <button className="lightbox-nav-btn lightbox-prev-btn" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
            Previous
          </button>
          <button className="lightbox-nav-btn lightbox-next-btn" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
            Next
          </button>

          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {activeItem.type === 'image' ? (
              <img src={toMediaUrl(activeItem.src)} className="full-view-media" alt="Enlarged" />
            ) : (
              <video controls autoPlay className="full-view-media">
                <source src={toMediaUrl(activeItem.src)} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    let ignore = false;
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) return;
        const data = await response.json();
        if (!ignore) {
          setContent({
            programs: Array.isArray(data.programs) ? data.programs : defaultContent.programs,
            stories: Array.isArray(data.stories) ? data.stories : defaultContent.stories,
            galleryData: Array.isArray(data.galleryData) ? data.galleryData : defaultContent.galleryData
          });
        }
      } catch (_error) {
        // Keep defaults on network/server failures.
      }
    };
    loadContent();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <HashRouter>
      <AppLayout content={content} setContent={setContent} />
    </HashRouter>
  );
}
