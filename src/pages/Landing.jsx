import "./landing.css";
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">babi 💗</div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/login')}>Let's Go →</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">✨ Smart Parenting Platform</div>
          <h1>
            Smart Baby<br />
            <span>Health</span> &amp;<br />
            Parenting Support
          </h1>

          <p>
            Track, monitor, and manage your baby's daily care,
            health records, and growth with ease. BabyCare+
            makes parenting organized and stress-free.
          </p>

          <div className="hero-tags">
            <span>🍼 Daily Tracking</span>
            <span>📊 Growth Charts</span>
            <span>💉 Vaccination Alerts</span>
            <span>📁 Health Records</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            {/* header */}
            <div className="dc-header">
              <div className="dc-header-left">
                <div className="dc-avatar">👶</div>
                <div>
                  <div className="dc-name">Baby Arya</div>
                  <div className="dc-age">6 months old</div>
                </div>
              </div>
              <div className="dc-live-dot">Live</div>
            </div>

            {/* 3-col stats */}
            <div className="dc-stats">
              <div className="dc-stat">
                <div className="dc-stat-icon">😴</div>
                <div className="dc-stat-val">8h</div>
                <div className="dc-stat-lbl">Sleep</div>
              </div>
              <div className="dc-stat">
                <div className="dc-stat-icon">🍼</div>
                <div className="dc-stat-val">5×</div>
                <div className="dc-stat-lbl">Feedings</div>
              </div>
              <div className="dc-stat">
                <div className="dc-stat-icon">⚖️</div>
                <div className="dc-stat-val">4.2</div>
                <div className="dc-stat-lbl">kg</div>
              </div>
            </div>

            {/* activity bars */}
            <div className="dc-section-title">Weekly Activity</div>
            <div className="dc-bars">
              <div className="dc-bar-row">
                <div className="dc-bar-label">Nutrition</div>
                <div className="dc-bar-track"><div className="dc-bar-fill" style={{width:'88%'}} /></div>
                <div className="dc-bar-pct">88%</div>
              </div>
              <div className="dc-bar-row">
                <div className="dc-bar-label">Sleep</div>
                <div className="dc-bar-track"><div className="dc-bar-fill" style={{width:'74%'}} /></div>
                <div className="dc-bar-pct">74%</div>
              </div>
              <div className="dc-bar-row">
                <div className="dc-bar-label">Growth</div>
                <div className="dc-bar-track"><div className="dc-bar-fill" style={{width:'92%'}} /></div>
                <div className="dc-bar-pct">92%</div>
              </div>
            </div>

            {/* notification */}
            <div className="dc-notif">
              <div className="dc-notif-icon">💉</div>
              <div className="dc-notif-text">
                <span>Vaccine due in 3 days</span> — DTP booster reminder set
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-header">
          <div className="features-eyebrow">What's inside</div>
          <h2>Everything your baby's<br /><span>health journey</span> needs</h2>
          <p>Four powerful tools, one beautiful app — designed to give parents total peace of mind.</p>
        </div>

        <div className="features-bento">

          {/* Card 1 — Health Records (wide) */}
          <div className="fc fc-wide fc-pink">
            <div className="fc-tag">Health</div>
            <div className="fc-icon"><img src="/health.png" alt="Health" /></div>
            <h3>Complete Health Records</h3>
            <p>Store doctor visits, prescriptions, and checkups all in one place — always a tap away.</p>
            <div className="fc-preview">
              <div className="fc-record-row">
                <div className="fc-record-left"><div className="fc-record-dot green" />Dr. Sharma — Routine Checkup</div>
                <div className="fc-record-date">Mar 2</div>
              </div>
              <div className="fc-record-row">
                <div className="fc-record-left"><div className="fc-record-dot" />Amoxicillin 125mg prescribed</div>
                <div className="fc-record-date">Feb 18</div>
              </div>
              <div className="fc-record-row">
                <div className="fc-record-left"><div className="fc-record-dot amber" />Weight check — 4.2 kg</div>
                <div className="fc-record-date">Feb 5</div>
              </div>
            </div>
          </div>

          {/* Card 2 — Parenting Guidance (small) */}
          <div className="fc fc-small fc-white">
            <div className="fc-tag">Guidance</div>
            <div className="fc-icon"><img src="/parenting.png" alt="Parenting" /></div>
            <h3>Smart Parenting Tips</h3>
            <p>Age-tailored advice and care suggestions delivered as your baby grows.</p>
            <div className="fc-tips">
              <div className="fc-tip"><span className="fc-tip-emoji">🌙</span>Establish a consistent bedtime routine by 3 months</div>
              <div className="fc-tip"><span className="fc-tip-emoji">🍼</span>Feed every 2–3 hours for newborns</div>
            </div>
          </div>

          {/* Card 3 — Reports (small) */}
          <div className="fc fc-small fc-rose">
            <div className="fc-tag">Analytics</div>
            <div className="fc-icon"><img src="/report.png" alt="Reports" /></div>
            <h3>Reports &amp; Growth Charts</h3>
            <p>Interactive graphs to visualise growth trends week by week.</p>
            <div className="fc-chart">
              <div className="fc-chart-bar" style={{height:'45%'}} />
              <div className="fc-chart-bar" style={{height:'58%'}} />
              <div className="fc-chart-bar" style={{height:'50%'}} />
              <div className="fc-chart-bar" style={{height:'72%'}} />
              <div className="fc-chart-bar" style={{height:'85%'}} />
              <div className="fc-chart-bar" style={{height:'78%'}} />
            </div>
            <div className="fc-chart-labels">
              <span>Oct</span><span>Nov</span><span>Dec</span>
              <span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
          </div>

          {/* Card 4 — Export (wide) */}
          <div className="fc fc-third fc-blush">
            <div className="fc-tag">Backup</div>
            <div className="fc-icon"><img src="/export.png" alt="Export" /></div>
            <h3>Export &amp; Secure Backup</h3>
            <p>Download records as PDF or CSV, backed up to the cloud automatically.</p>
            <div className="fc-badges">
              <div className="fc-badge">📄 PDF</div>
              <div className="fc-badge">📊 CSV</div>
              <div className="fc-badge">☁️ Cloud</div>
            </div>
          </div>

          {/* Card 5 — Vaccination (small) */}
          <div className="fc fc-third fc-white">
            <div className="fc-tag">Alerts</div>
            <div className="fc-icon">💉</div>
            <h3>Vaccination Tracker</h3>
            <p>Never miss a shot — smart reminders based on your baby's exact schedule.</p>
            <div className="fc-tips" style={{marginTop:'20px'}}>
              <div className="fc-tip"><span className="fc-tip-emoji">✅</span>DTP — Done (Week 6)</div>
              <div className="fc-tip"><span className="fc-tip-emoji">⏰</span>MMR — Due in 3 days</div>
            </div>
          </div>

          {/* Card 6 — Daily Log */}
          <div className="fc fc-third fc-pink">
            <div className="fc-tag">Daily</div>
            <div className="fc-icon">🍼</div>
            <h3>Daily Activity Log</h3>
            <p>Track feeding, nappy changes, and sleep with a single tap — every single day.</p>
            <div className="fc-preview" style={{marginTop:'20px'}}>
              <div className="fc-record-row">
                <div className="fc-record-left"><div className="fc-record-dot" />Feeding — 120ml</div>
                <div className="fc-record-date">9:00 AM</div>
              </div>
              <div className="fc-record-row">
                <div className="fc-record-left"><div className="fc-record-dot green" />Sleep — 2h 15m</div>
                <div className="fc-record-date">10:30 AM</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="get-started">
        <div className="cta-inner">
         
          <h1>Ready to Make Parenting <em>Easier?</em></h1>
          <p>
            Thousands of parents trust BabyCare+ to keep their baby's health
            records organized and accessible anytime, anywhere.
          </p>

          <div className="cta-trust">
            <div className="cta-trust-item"><span>🔒</span><span>100% Secure</span></div>
            <div className="cta-divider" />
            <div className="cta-trust-item"><span>☁️</span><span>Cloud Backup</span></div>
            <div className="cta-divider" />
            <div className="cta-trust-item"><span>🆓</span><span>Free to Start</span></div>
            <div className="cta-divider" />
            <div className="cta-trust-item"><span>📱</span><span>Works on All Devices</span></div>
          </div>

          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => navigate('/login')}>Start Your Free Trial →</button>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer1">
        <p>© 2025 BabyCare+ · Making Parenting Easier, One Day at a Time</p>
        <p>Built with MongoDB, Express.js, React, and Node.js</p>
      </footer>
    </>
  );
}