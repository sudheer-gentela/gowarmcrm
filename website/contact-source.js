/**
 * contact-source.js
 *
 * Drives the pillar chooser on /contact and records which product the enquiry
 * is about, so Work leads are distinguishable from Sales leads in the sheet.
 *
 * The selection lives in the hidden #source input as 'sales', 'work' or 'both'.
 * It is preselected from, in order:
 *
 *   1. ?src= on the URL          — e.g. /contact?src=work
 *   2. the referring page path   — arriving from a GoWarm Work page
 *   3. 'sales'                   — the default
 *
 * Wiring: api/submit.js already writes data.formType to column J of the sheet,
 * so the submit handler needs one more property:
 *
 *     formType: document.getElementById('source').value
 *
 * Everything here is defensive — a missing element is skipped, never thrown.
 */

(function () {
  'use strict';

  var ALLOWED = ['sales', 'work', 'both'];
  var WORK_PATHS = [
    '/work', '/why-you-stopped-knowing', '/daily-work-tracking',
    '/project-tracking-software-small-business', '/vs-spreadsheets',
    '/standing-vs-timeboxed-work'
  ];
  var BOTH_PATHS = ['/for-founders', '/'];

  function fromQuery() {
    try {
      var v = new URLSearchParams(window.location.search).get('src');
      if (!v) return null;
      v = v.toLowerCase().trim();
      return ALLOWED.indexOf(v) !== -1 ? v : null;
    } catch (e) { return null; }
  }

  function fromReferrer() {
    if (!document.referrer) return null;
    try {
      var url = new URL(document.referrer);
      if (url.hostname !== window.location.hostname) return null;
      var p = url.pathname.replace(/\/+$/, '') || '/';
      if (WORK_PATHS.indexOf(p) !== -1) return 'work';
      if (BOTH_PATHS.indexOf(p) !== -1) return 'both';
      return null;
    } catch (e) { return null; }
  }

  // Exposed for the onclick handlers on the chooser buttons.
  window.setPillar = function (src) {
    if (ALLOWED.indexOf(src) === -1) src = 'sales';

    var field = document.getElementById('source');
    if (field) field.value = src;

    var opts = document.querySelectorAll('.pillar-opt');
    for (var i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute('data-src') === src;
      opts[i].classList.toggle('is-on', on);
      opts[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    var salesSide = (src !== 'work');

    // CRM only matters when the sales pillar is in scope
    var crm = document.getElementById('crm-group');
    if (crm) crm.style.display = salesSide ? '' : 'none';

    // the headcount question means different things on each side
    var label = document.getElementById('team-size-label');
    if (label) label.textContent = salesSide ? 'Sales Team Size *' : 'People in the company *';

    var problem = document.getElementById('problem');
    if (problem) {
      problem.placeholder = salesSide
        ? 'e.g. deals go quiet and we only find out at the forecast review, playbooks nobody follows, a pipeline number I do not trust…'
        : 'e.g. I cannot tell which projects have actually stopped, half the team\u2019s work is invisible, we run delivery out of a spreadsheet and a WhatsApp group…';
    }

    var btn = document.getElementById('submit-btn');
    if (btn) btn.textContent = 'Request Your Walkthrough \u2192';
  };

  function init() {
    if (!document.getElementById('source')) return;
    window.setPillar(fromQuery() || fromReferrer() || 'sales');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
