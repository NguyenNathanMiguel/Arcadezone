// Arcade Zone — Vietnam Arcade Locations Finder
let ALL_LOCATIONS = [];

async function initLocations() {
  const container = document.getElementById('locations-grid');
  const countSpan = document.getElementById('locations-count');
  const cityBtns = document.querySelectorAll('.city-btn');
  const searchInput = document.getElementById('locations-search');

  if (!container) return;

  try {
    let data = window.ARCADE_LOCATIONS_DATA;
    if (!data) {
      const res = await fetch('data/locations.json');
      data = await res.json();
    }
    ALL_LOCATIONS = data.locations || [];
    renderLocations();

    // Event listeners
    cityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderLocations();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderLocations);
    }
  } catch (err) {
    console.error('Failed to load arcade locations:', err);
    container.innerHTML = '<div class="not-found" style="grid-column: 1 / -1;"><h2>Failed to load locations</h2><p>Please check your connection and refresh.</p></div>';
  }

  function renderLocations() {
    const activeCity = document.querySelector('.city-btn.active')?.dataset.city || 'All';
    const query = (searchInput?.value || '').trim().toLowerCase();

    let filtered = ALL_LOCATIONS.filter(loc => {
      const matchCity = activeCity === 'All' || loc.city === activeCity;
      const matchQuery = !query || 
        loc.name.toLowerCase().includes(query) ||
        loc.mall.toLowerCase().includes(query) ||
        loc.district.toLowerCase().includes(query) ||
        loc.address.toLowerCase().includes(query) ||
        loc.brand.toLowerCase().includes(query);
      return matchCity && matchQuery;
    });

    if (countSpan) countSpan.innerText = `${filtered.length} Locations Found`;

    if (!filtered.length) {
      container.innerHTML = `
        <div class="not-found" style="grid-column: 1 / -1;">
          <h2>No Arcades Found</h2>
          <p>No gaming venues match your query "${query}". Try searching another mall or city.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(loc => {
      let brandColor = 'var(--cyan)';
      if (loc.brand.includes('Timezone')) brandColor = 'var(--magenta)';
      else if (loc.brand.includes('Dream')) brandColor = 'var(--gold)';
      else if (loc.brand.includes('PowerBowl')) brandColor = 'var(--purple)';

      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery || loc.address)}`;

      return `
        <div class="card reveal visible" style="border-color: rgba(255,255,255,0.08); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:8px;">
              <span class="tag" style="border-color:${brandColor}; color:${brandColor}; background:rgba(255,255,255,0.03);">${loc.brand}</span>
              <span style="font-family:'Orbitron',sans-serif; font-size:0.7rem; color:var(--text-dim);">${loc.city}</span>
            </div>

            <h3 class="card-title" style="color:#fff; font-size:1.05rem; margin-bottom:4px;">${loc.name}</h3>
            <div style="font-size:0.8rem; color:var(--cyan); margin-bottom:12px; font-weight:600;">📍 ${loc.mall}</div>

            <p style="color:var(--text-dim); font-size:0.85rem; line-height:1.5; margin-bottom:14px;">
              ${loc.address}
            </p>

            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
              ${loc.games.map(g => `<span style="font-size:0.65rem; padding:2px 8px; border-radius:12px; background:var(--bg3); color:var(--text-dim); border:1px solid rgba(255,255,255,0.06);">${g}</span>`).join('')}
            </div>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:14px; margin-top:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-dim); margin-bottom:12px;">
              <span>🕒 ${loc.hours}</span>
              ${loc.phone ? `<span>📞 ${loc.phone}</span>` : ''}
            </div>
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="width:100%; text-align:center; display:block; padding:8px 0;">
              🗺️ Open in Google Maps ↗
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
}

document.addEventListener('DOMContentLoaded', initLocations);
