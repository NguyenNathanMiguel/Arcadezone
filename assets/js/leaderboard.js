// Arcade Zone — Real-world Arcade Leaderboard Handler
let LEADERBOARD_RECORDS = [];
let LEADERBOARD_MACHINES = [];

async function initLeaderboard() {
  const tableBody = document.getElementById('lb-table-body');
  const countSpan = document.getElementById('lb-count');
  const catFilterBtns = document.querySelectorAll('.lb-cat-btn');
  const machineSelect = document.getElementById('lb-machine-select');
  const searchInput = document.getElementById('lb-search');

  if (!tableBody) return;

  try {
    const [resLB, resM] = await Promise.all([
      fetch('data/leaderboard.json'),
      fetch('data/machines.json')
    ]);
    const lbData = await resLB.json();
    const mData = await resM.json();

    LEADERBOARD_RECORDS = lbData.records || [];
    LEADERBOARD_MACHINES = mData.machines || [];

    // Populate machine dropdown
    if (machineSelect) {
      machineSelect.innerHTML = `
        <option value="all">All Machines</option>
        ${LEADERBOARD_MACHINES.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
      `;
    }

    renderTable();

    // Event listeners
    catFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (machineSelect) machineSelect.value = 'all';
        renderTable();
      });
    });

    if (machineSelect) {
      machineSelect.addEventListener('change', () => {
        catFilterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.lb-cat-btn[data-cat="all"]')?.classList.add('active');
        renderTable();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', renderTable);
    }

  } catch (err) {
    console.error('Failed to load leaderboard:', err);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--red);">Error loading leaderboard data.</td></tr>`;
  }

  function renderTable() {
    const activeCat = document.querySelector('.lb-cat-btn.active')?.dataset.cat || 'all';
    const selectedMachine = machineSelect?.value || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    // Merge machine metadata into records
    const enriched = LEADERBOARD_RECORDS.map(r => {
      const machine = LEADERBOARD_MACHINES.find(m => m.id === r.machine_id) || { name: r.machine_id, category: 'other' };
      return { ...r, machineName: machine.name, category: machine.category, machineColor: machine.color || '#66fcf1' };
    });

    // Filter
    let filtered = enriched.filter(r => {
      const matchCat = activeCat === 'all' || r.category === activeCat;
      const matchMachine = selectedMachine === 'all' || r.machine_id === selectedMachine;
      const matchSearch = !query || r.player.toLowerCase().includes(query) || r.machineName.toLowerCase().includes(query) || (r.note && r.note.toLowerCase().includes(query));
      return matchCat && matchMachine && matchSearch;
    });

    // Sort: if specific machine, sort by score descending. Else sort by score or date
    filtered.sort((a,b) => b.score - a.score);

    if (countSpan) countSpan.innerText = `${filtered.length} Entries`;

    if (!filtered.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:48px 20px; color:var(--text-dim);">
            No high score records match the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((r, idx) => {
      const rankNum = idx + 1;
      let rankClass = '';
      let medal = '';
      if (rankNum === 1) { rankClass = 'rank-1'; medal = '🥇 '; }
      else if (rankNum === 2) { rankClass = 'rank-2'; medal = '🥈 '; }
      else if (rankNum === 3) { rankClass = 'rank-3'; medal = '🥉 '; }

      const tagClass = 'tag-' + r.category;
      const catLabel = r.category.charAt(0).toUpperCase() + r.category.slice(1);

      return `
        <tr>
          <td class="rank ${rankClass}">${medal}#${rankNum}</td>
          <td>
            <span class="lb-player">${r.player}</span>
            ${r.note ? `<br><span class="lb-note">${r.note}</span>` : ''}
          </td>
          <td>
            <a href="machine-detail.html?id=${r.machine_id}" style="color:#fff; font-weight:600; text-decoration:underline; text-decoration-color:rgba(102,252,241,0.3);">
              ${r.machineName}
            </a>
          </td>
          <td>
            <span class="tag ${tagClass}">${catLabel}</span>
          </td>
          <td>
            <span class="lb-score">${r.score.toLocaleString()}</span>
          </td>
          <td>
            <span class="lb-date">${r.date}</span>
          </td>
        </tr>
      `;
    }).join('');
  }
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
