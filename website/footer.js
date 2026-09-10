(function() {
  var html = `
<footer class="site-footer">
  <style>
    .footer-grid-gw {
      display: grid;
      grid-template-columns: 220px 1fr 200px 130px;
      gap: 32px;
      margin-bottom: 48px;
    }
    .footer-col-resources ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 32px;
    }
    .footer-col-resources ul li a {
      white-space: nowrap;
    }
    @media (max-width: 1100px) {
      .footer-grid-gw { grid-template-columns: 170px 1fr 190px 120px; gap: 24px; }
      .footer-col-resources ul { gap: 0 20px; }
    }
    @media (max-width: 960px) {
      .footer-grid-gw { grid-template-columns: 1fr 1fr; }
      .footer-col-resources ul { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .footer-grid-gw { grid-template-columns: 1fr; }
    }
  </style>
  <div class="container">
    <div class="footer-grid-gw">
      <div>
        <div class="footer-logo" style="display:flex;align-items:center;">
          <svg width="22" height="22" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:7px;flex-shrink:0">
            <rect width="72" height="72" rx="16" fill="#E8630A"/>
            <path d="M36 10 C26 18 14 27 16 44 C18 57 27 66 36 70 C45 66 54 57 56 44 C58 27 46 18 36 10Z" fill="#F5A623"/>
            <path d="M36 26 C32 32 27 39 29 47 C31 53 34 58 36 61 C38 58 41 53 43 47 C45 39 40 32 36 26Z" fill="#FDE68A"/>
            <path d="M23 47 L27 59 L32 50 L36 57 L40 50 L45 59 L49 47" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>
          </svg>GoWarm
        </div>
        <p class="footer-tagline">The execution layer your systems of record are missing. Two products on one platform: GoWarm CRM for the pipeline, GoWarm Work for the work that follows it.</p>
      </div>
      <div class="footer-col footer-col-resources">
        <h4>GoWarm CRM</h4>
        <ul>
          <li><a href="/sales">Sales Execution</a></li>
          <li><a href="/how-it-works">How It Works</a></li>
          <li><a href="/problems">Problems We Solve</a></li>
          <li><a href="/for-vp-sales">For VP Sales</a></li>
          <li><a href="/for-ceo">For CEOs</a></li>
          <li><a href="/diagnostic">Pipeline Diagnostic</a></li>
          <li><a href="/crm-integration">CRM Integration</a></li>
          <li><a href="/salesforce-integration">Salesforce Integration</a></li>
          <li><a href="/execution-gap">The Execution Gap</a></li>
          <li><a href="/sales-execution-platform">What is a SEP?</a></li>
          <li><a href="/sales-execution-platform-vs-crm">SEP vs CRM</a></li>
          <li><a href="/why-deals-go-dark">Why Deals Go Dark</a></li>
          <li><a href="/pipeline-execution">Pipeline Execution</a></li>
          <li><a href="/pipeline-leakage">Pipeline Leakage</a></li>
          <li><a href="/sales-forecast-accuracy">Forecast Accuracy</a></li>
          <li><a href="/sales-execution-platform-for-saas">For SaaS Teams</a></li>
          <li><a href="/ai-shift">The AI Shift in B2B Selling</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>GoWarm Work</h4>
        <ul>
          <li><a href="/work">Projects &amp; Daily Work</a></li>
          <li><a href="/why-you-stopped-knowing">Why You Stopped Knowing</a></li>
          <li><a href="/for-founders">For Founders</a></li>
          <li><a href="/daily-work-tracking">Daily Work Tracking</a></li>
          <li><a href="/project-tracking-software-small-business">Project Tracking for SMBs</a></li>
          <li><a href="/standing-vs-timeboxed-work">Standing vs Timeboxed</a></li>
          <li><a href="/vs-spreadsheets">Work vs Spreadsheets</a></li>
          <li><a href="/work#pricing">Work Pricing</a></li>
          <li><a href="/contact?src=work">Book a Walkthrough</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/platform-overview">Platform Modules</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">GoWarm Insights</a></li>
          <li><a href="/insights">Insights Index</a></li>
          <li><a href="/skills">Agent Skills</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 DeepConnect Technologies Inc. and GW DeepConnect Technologies Private Limited. All rights reserved.</span>
      <span><a href="/privacy" style="color:rgba(255,255,255,0.45);">Privacy</a> · <a href="/terms" style="color:rgba(255,255,255,0.45);">Terms</a> · <a href="/msa" style="color:rgba(255,255,255,0.45);">MSA</a> · <a href="/dpa" style="color:rgba(255,255,255,0.45);">DPA</a></span>
    </div>
  </div>
</footer>`;

  var el = document.getElementById('site-footer');
  if (el) el.outerHTML = html;
})();
