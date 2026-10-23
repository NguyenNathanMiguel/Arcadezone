// Arcade Zone - Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => observer.observe(el));
    }

    // Active nav link highlight based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Global Navbar Auth slot for non-community pages
    const isCommunityPage = window.location.pathname.toLowerCase().includes('community');
    const userSlot = document.getElementById('auth-user-slot');

    function renderNavAuth() {
        if (!userSlot || isCommunityPage) return;

        let user = null;
        if (window.ArcadeAuth && window.ArcadeAuth.user) {
            const u = window.ArcadeAuth.user;
            const p = window.ArcadeAuth.profile;
            user = {
                id: u.id,
                email: u.email,
                name: p?.display_name || u.user_metadata?.full_name || u.email.split('@')[0],
                avatar: p?.avatar_url || u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`
            };
        } else {
            const stored = localStorage.getItem('arcade_zone_user');
            if (stored) {
                try { user = JSON.parse(stored); } catch(e) {}
            }
        }

        if (user) {
            userSlot.innerHTML = `
                <div class="nav-user-badge" title="${user.name} (${user.email})" style="cursor:pointer;" onclick="window.location.href='community.html'">
                    <img src="${user.avatar}" alt="${user.name}" class="nav-user-avatar">
                    <div class="nav-user-info">
                        <div class="nav-user-name">${user.name}</div>
                        <div class="nav-user-email">${user.email}</div>
                    </div>
                    <button id="btn-global-signout" title="Sign out" class="nav-user-signout">&times;</button>
                </div>
            `;
            document.getElementById('btn-global-signout')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (window.ArcadeAuth) {
                    await window.ArcadeAuth.signOut();
                } else {
                    localStorage.removeItem('arcade_zone_user');
                }
                renderNavAuth();
            });
        } else {
            userSlot.innerHTML = `
                <a href="community.html" class="btn btn-sm" style="padding:6px 12px; font-size:0.7rem; white-space:nowrap; border-color:rgba(102,252,241,0.4);">
                    Sign in
                </a>
            `;
        }
    }

    renderNavAuth();
    window.addEventListener('arcade-auth-changed', renderNavAuth);
});
