// Arcade Zone — Global Arcade Machines Encyclopedia Handler
let ALL_MACHINES = [];
let ALL_RECORDS = [];

async function loadData() {
  try {
    let dataMachines = window.ARCADE_MACHINES_DATA;
    let dataLeaderboard = null;
    if (!dataMachines) {
      const resMachines = await fetch('data/machines.json');
      dataMachines = await resMachines.json();
    }
    try {
      const resLeaderboard = await fetch('data/leaderboard.json');
      dataLeaderboard = await resLeaderboard.json();
    } catch(e) {
      dataLeaderboard = { records: [] };
    }
    ALL_MACHINES = dataMachines.machines || [];
    ALL_RECORDS = dataLeaderboard ? (dataLeaderboard.records || []) : [];
    return { machines: ALL_MACHINES, categories: dataMachines.categories, records: ALL_RECORDS };
  } catch (err) {
    console.error('Failed to load machine data:', err);
    return null;
  }
}

// Icon helper by machine or category
function getCategoryIcon(cat) {
  if (cat === 'redemption') return '🎟️';
  if (cat === 'merchandiser') return '🎁';
  if (cat === 'pinball') return '🔮';
  if (cat === 'rhythm') return '🎵';
  if (cat === 'racing') return '🏎️';
  if (cat === 'shooter') return '💥';
  return '🕹️';
}

function getMachineIcon(id, cat) {
  const map = {
    'skee-ball': '🎳',
    'basketball-shoot': '🏀',
    'quik-drop': '💧',
    'whack-a-mole': '🔨',
    'stacker': '🧱',
    'pop-the-lock': '🎯',
    'color-match': '🎨',
    'monster-drop': '🔮',
    'claw-machine-plush': '🧸',
    'coin-pusher': '🪙',
    'key-master': '🔑',
    'pinball-classic': '⚔️',
    'pinball-modern': '💥',
    'pinball-addams': '👻',
    'rhythm-ddr': '💃',
    'rhythm-maimai': '🌀',
    'rhythm-taiko': '🥁',
    'racing-initial-d': '🏎️',
    'racing-mario-kart': '🍄',
    'shooter-time-crisis': '🔫',
    'shooter-house-dead': '🧟'
  };
  return map[id] || getCategoryIcon(cat);
}

// Render cards on machines.html
function renderMachineCard(m) {
  const diffClass = m.difficulty === 'Easy' ? 'diff-easy' : m.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard';
  const tagClass = 'tag-' + m.category;
  const icon = getMachineIcon(m.id, m.category);
  const catLabel = m.category.charAt(0).toUpperCase() + m.category.slice(1);
  const playReward = m.tickets_per_play.includes('N/A') ? 'Direct Prize / Glory' : m.tickets_per_play;

  return `
    <div class="machine-card card card-${m.category} reveal visible" data-id="${m.id}" data-category="${m.category}" data-name="${m.name.toLowerCase()}">
      <div class="machine-img" style="background: radial-gradient(circle at 50% 30%, ${m.color}25 0%, #10101e 80%);">
        <span>${icon}</span>
      </div>
      <div class="machine-body">
        <div class="machine-meta">
          <span class="tag ${tagClass}">${catLabel}</span>
          <span class="difficulty-badge ${diffClass}">${m.difficulty}</span>
          <span class="player-count">👤 ${m.players}P</span>
        </div>
        <h3 class="card-title">${m.name}</h3>
        <p class="machine-desc-short">${m.tagline} — ${m.description}</p>
        <div style="font-size:0.75rem; color:var(--gold); margin-bottom:12px; font-family:'Orbitron',sans-serif;">
          Payout: ${playReward}
        </div>
        <a href="machine-detail.html?id=${m.id}" class="machine-link card-link">Read Encyclopedia Dossier →</a>
      </div>
    </div>
  `;
}

// Init Machines listing page
async function initMachinesPage() {
  const container = document.getElementById('machines-grid');
  const countSpan = document.getElementById('machine-count');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('machine-search');

  if (!container) return;

  container.innerHTML = '<div class="loading">LOADING MACHINES ENCYCLOPEDIA...</div>';

  const data = await loadData();
  if (!data || !ALL_MACHINES.length) {
    container.innerHTML = '<div class="not-found"><h2>Unable to load machines</h2><p>Please check your connection and reload.</p></div>';
    return;
  }

  function filterAndDisplay() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    let filtered = ALL_MACHINES.filter(m => {
      const matchCat = activeFilter === 'all' || m.category === activeFilter;
      const matchQuery = !query || 
        m.name.toLowerCase().includes(query) || 
        m.tagline.toLowerCase().includes(query) || 
        m.description.toLowerCase().includes(query) ||
        (m.manufacturer && m.manufacturer.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (countSpan) countSpan.innerText = `${filtered.length} Machines Documented`;

    if (!filtered.length) {
      container.innerHTML = `
        <div class="not-found" style="grid-column: 1 / -1;">
          <h2>No Machines Found</h2>
          <p>No machines match "${query || activeFilter}". Try adjusting your search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(renderMachineCard).join('');
  }

  // Bind filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndDisplay();
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', filterAndDisplay);
  }

  // Check URL hash for default filter (e.g., #pinball, #rhythm)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const targetBtn = Array.from(filterBtns).find(b => b.dataset.filter === hash);
    if (targetBtn) {
      filterBtns.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
    }
  }

  filterAndDisplay();
}

// Init Machine Detail page
async function initMachineDetailPage() {
  const root = document.getElementById('machine-detail-root');
  if (!root) return;

  root.innerHTML = '<div class="loading">LOADING MACHINE DOSSIER...</div>';

  const data = await loadData();
  if (!data || !ALL_MACHINES.length) {
    root.innerHTML = '<div class="not-found"><h2>Error loading data</h2></div>';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const machine = ALL_MACHINES.find(m => m.id === id) || ALL_MACHINES[0];

  if (!machine) {
    root.innerHTML = `
      <div class="not-found">
        <h2>Machine Not Found</h2>
        <p>The arcade machine you're looking for doesn't exist in our encyclopedia.</p>
        <a href="machines.html" class="btn">Back to Machines</a>
      </div>
    `;
    return;
  }

  // Update page title & breadcrumb
  document.title = `${machine.name} — Arcade Encyclopedia`;
  const breadcrumbName = document.getElementById('breadcrumb-machine-name');
  if (breadcrumbName) breadcrumbName.innerText = machine.name;

  const diffClass = machine.difficulty === 'Easy' ? 'diff-easy' : machine.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard';
  const tagClass = 'tag-' + machine.category;
  const icon = getMachineIcon(machine.id, machine.category);
  const catLabel = machine.category.charAt(0).toUpperCase() + machine.category.slice(1);

  // Machine records
  const machineRecords = ALL_RECORDS.filter(r => r.machine_id === machine.id).sort((a,b) => b.score - a.score).slice(0, 3);
  let recordsHtml = '';
  if (machineRecords.length) {
    recordsHtml = `
      <div class="mini-lb">
        <div class="mini-lb-title">🏆 DOCUMENTED HIGH SCORES & BENCHMARKS</div>
        <table>
          <tbody>
            ${machineRecords.map((r, idx) => `
              <tr>
                <td class="rank rank-${idx + 1}">#${idx + 1}</td>
                <td><strong>${r.player}</strong> ${r.note ? `<br><span style="font-size:0.75rem;color:var(--text-dim);">${r.note}</span>` : ''}</td>
                <td style="text-align:right; color:var(--cyan); font-family:'Orbitron',sans-serif; font-weight:700;">${r.score.toLocaleString()}</td>
                <td style="text-align:right; color:var(--text-dim); font-size:0.8rem;">${r.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Related machines in same category
  const related = ALL_MACHINES.filter(m => m.category === machine.category && m.id !== machine.id).slice(0, 3);
  const relatedHtml = related.length ? `
    <div style="margin-top: 60px;">
      <h3 class="section-title" style="font-size: 1.3rem; margin-bottom: 24px;">MORE IN ${catLabel.toUpperCase()}</h3>
      <div class="card-grid">
        ${related.map(renderMachineCard).join('')}
      </div>
    </div>
  ` : '';

  root.innerHTML = `
    <div class="machine-detail-grid">
      <!-- Left Column: Visual & Stats -->
      <div>
        <div class="machine-detail-img" style="background: radial-gradient(circle at 50% 40%, ${machine.color}35 0%, #10101e 80%); border: 1px solid ${machine.color}; box-shadow: 0 0 25px ${machine.color}20;">
          <span style="font-size: 6rem;">${icon}</span>
        </div>

        <table class="machine-stats-table">
          <tbody>
            <tr>
              <td>Category</td>
              <td><span class="tag ${tagClass}">${catLabel}</span></td>
            </tr>
            <tr>
              <td>Manufacturer</td>
              <td style="color:#fff;">${machine.manufacturer || 'Arcade Original'}</td>
            </tr>
            <tr>
              <td>Difficulty</td>
              <td><span class="difficulty-badge ${diffClass}">${machine.difficulty}</span></td>
            </tr>
            <tr>
              <td>Players</td>
              <td>${machine.players} Player</td>
            </tr>
            <tr>
              <td>Tickets / Reward</td>
              <td style="color:var(--gold);">${machine.tickets_per_play}</td>
            </tr>
          </tbody>
        </table>

        <!-- Actions -->
        <div class="cta-box" style="margin-top:24px;">
          <h3>PLAY THIS MACHINE</h3>
          <p>Find arcade centers in Vietnam featuring this machine, or play in our online simulation!</p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <a href="https://arcadeworld2-0.onrender.com/" class="btn btn-enter" style="width:100%; text-align:center;">🕹️ PLAY IN ARCADE WORLD</a>
            <a href="locations.html" class="btn btn-sm" style="width:100%; text-align:center;">📍 Find Arcades Near You</a>
          </div>
        </div>
      </div>

      <!-- Right Column: Narrative, Tips, Strategy -->
      <div>
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:12px;">
          <span class="tag ${tagClass}">${catLabel}</span>
          <span class="difficulty-badge ${diffClass}">${machine.difficulty}</span>
        </div>

        <h1 class="machine-detail-name neon-text">${machine.name}</h1>
        <p class="machine-tagline">"${machine.tagline}"</p>

        <p class="machine-desc">${machine.description}</p>

        <!-- Pro Tips -->
        <h3 style="font-family:'Orbitron',sans-serif; font-size:1.1rem; letter-spacing:2px; margin-bottom:16px; color:var(--cyan);">
          CHAMPION PRO TIPS
        </h3>
        <ul class="tips-list">
          ${machine.tips.map((tip, idx) => `
            <li>
              <span class="tip-num">0${idx + 1}</span>
              <div>${tip}</div>
            </li>
          `).join('')}
        </ul>

        <!-- Strategy Box -->
        <div class="strategy-box">
          <strong>⚡ ADVANCED SCORING STRATEGY</strong>
          <p>${machine.strategy}</p>
        </div>

        <!-- Mini Leaderboard -->
        ${recordsHtml}
      </div>
    </div>

    <!-- Related Machines -->
    ${relatedHtml}
  `;
}

// Auto-run on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('machines-grid')) {
    initMachinesPage();
  }
  if (document.getElementById('machine-detail-root')) {
    initMachineDetailPage();
  }
});
