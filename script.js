/* =====================================================
   Farhad Nooralahzadeh — Personal Academic Website
   Renders site from data.js + navigation/animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Render site from siteData ───────────────────────
    if (typeof siteData !== 'undefined') {
        if (document.getElementById('hero-name')) renderHero();
        if (document.getElementById('about-text')) renderAbout();
        if (document.getElementById('news-feed')) renderNews();
        if (document.getElementById('research-grid')) renderResearch();
        if (document.getElementById('publications-table')) renderPublications();
        if (document.getElementById('projects-grid')) renderProjects();
        if (document.getElementById('timeline')) renderExperience();
        if (document.getElementById('teaching-content')) renderTeaching();
        if (document.getElementById('talks-content')) renderTalks();
        if (document.getElementById('gallery-grid')) renderGallery();
    }

    // ─── Initialize interactions ─────────────────────────
    initNavbar();
    initFilters();
    initAnimations();
    initSmoothScroll();
    initHeroAnimation();
});

/* =====================================================
   RENDERERS — Build HTML from siteData
   ===================================================== */

function renderHero() {
    const d = siteData.personal;

    document.getElementById('hero-name').textContent = d.name;
    document.getElementById('hero-title').innerHTML = d.title.replace('&', '&amp;');
    document.getElementById('hero-affiliation').innerHTML = d.affiliation +
        (d.location ? ` · <span class="hero-location"><i class="fas fa-map-marker-alt"></i> ${d.location}</span>` : '');

    // Tagline
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl && d.tagline) taglineEl.textContent = d.tagline;

    // Nav scholar link
    const navScholar = document.getElementById('nav-scholar-link');
    if (navScholar && d.links.scholar) navScholar.href = d.links.scholar;

    // Hero links
    const heroLinks = document.getElementById('hero-links');
    let linksHTML = '';
    if (d.links.scholar) linksHTML += `<a href="${d.links.scholar}" target="_blank" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>`;
    if (d.links.github) linksHTML += `<a href="${d.links.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
    if (d.links.linkedin) linksHTML += `<a href="${d.links.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>`;
    if (d.links.twitter) linksHTML += `<a href="${d.links.twitter}" target="_blank" title="Twitter / X"><i class="fab fa-x-twitter"></i></a>`;
    if (d.emails.length) linksHTML += `<a href="mailto:${d.emails[0].address}" title="Email"><i class="fas fa-envelope"></i></a>`;
    heroLinks.innerHTML = linksHTML;

    // Hero image
    const heroImage = document.getElementById('hero-image');
    if (d.photo) {
        heroImage.innerHTML = `<img src="${d.photo}" alt="${d.name}">`;
    } else {
        heroImage.innerHTML = `
            <div class="hero-image-placeholder">
                <i class="fas fa-user"></i>
                <span>Add your photo</span>
            </div>`;
    }
}

function renderAbout() {
    const d = siteData.about;

    document.getElementById('about-text').innerHTML =
        d.paragraphs.map(p => `<p>${p}</p>`).join('');

    // Metrics bar
    const metricsBar = document.getElementById('metrics-bar');
    if (metricsBar && siteData.metrics) {
        metricsBar.innerHTML = siteData.metrics.map(m => `
            <div class="metric">
                <span class="metric-value">${m.value}</span>
                <span class="metric-label">${m.label}</span>
            </div>`).join('');
    }

    document.getElementById('about-highlights').innerHTML =
        d.highlights.map(h => `
            <div class="highlight-card">
                <i class="${h.icon}"></i>
                <h3>${h.title}</h3>
                <p>${h.text}</p>
            </div>`).join('');
}

function renderNews() {
    const NEWS_VISIBLE = 5;
    const items = siteData.news;
    const hasMore = items.length > NEWS_VISIBLE;

    document.getElementById('news-feed').innerHTML =
        items.map((n, i) => `
            <div class="news-item${i >= NEWS_VISIBLE ? ' section-overflow' : ''}" data-section="news"${i >= NEWS_VISIBLE ? ' data-overflow' : ''}>
                <div class="news-date">${n.month}${n.year ? ' ' + n.year : ''}</div>
                <div class="news-icon"><i class="${n.icon}"></i></div>
                <div class="news-body"><p>${n.text}</p></div>
            </div>`).join('') +
        (hasMore ? `
            <div class="section-toggle-wrap">
                <button class="timeline-toggle" onclick="toggleSection('news', this, ${items.length - NEWS_VISIBLE})">
                    <span>Show ${items.length - NEWS_VISIBLE} more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>` : '');
}

function renderResearch() {
    document.getElementById('research-grid').innerHTML =
        siteData.research.map(r => {
            const subtopicsHTML = (r.subtopics || []).map(s => `<li>${s}</li>`).join('');
            return `
            <div class="research-card">
                <div class="research-icon"><i class="${r.icon}"></i></div>
                <h3>${r.title}</h3>
                <p>${r.text}</p>
                ${subtopicsHTML ? `<ul class="research-subtopics">${subtopicsHTML}</ul>` : ''}
            </div>`;
        }).join('');
}

function renderPublications() {
    const pubScholar = document.getElementById('pub-scholar-link');
    if (pubScholar) pubScholar.href = siteData.personal.links.scholar;

    document.getElementById('publications-table').innerHTML =
        siteData.publications.map(pub => {
            const actionLinks = pub.links.map(l => `<a href="${l.url}" target="_blank">[${l.label}]</a>`).join('');

            const figureInner = pub.figure
                ? `<img src="${pub.figure}" alt="${pub.title}">`
                : `<div class="pub-figure-placeholder"><i class="${pub.figureIcon || 'fas fa-file-alt'}"></i></div>`;

            const keywordsHTML = (pub.keywords || []).map(k => `<span class="pub-keyword">${k}</span>`).join('');

            let roleHTML = '';
            if (pub.role) {
                const roleClass = pub.role.toLowerCase().replace(/\s+/g, '-');
                roleHTML = `<span class="pub-role pub-role-${roleClass}">${pub.role}</span>`;
            }

            return `
            <div class="pub-row" data-category="${pub.category}">
                <div class="pub-left">
                    <div class="pub-figure">${figureInner}</div>
                </div>
                <div class="pub-right">
                    <p class="pub-authors">${pub.authors}</p>
                    <h3 class="pub-title"><a href="${pub.url}" target="_blank">${pub.title}</a></h3>
                    <p class="pub-venue">${pub.venue}</p>
                    ${keywordsHTML ? `<div class="pub-keywords">${keywordsHTML}</div>` : ''}
                    <div class="pub-footer">
                        <div class="pub-links">${actionLinks}</div>
                        ${roleHTML}
                    </div>
                </div>
            </div>`;
        }).join('');

    // Click-to-enlarge on publication figures
    initPubLightbox();
}

function initPubLightbox() {
    const lightbox = document.getElementById('pubLightbox');
    if (!lightbox) return;

    const lbImg = document.getElementById('pubLightboxImg');
    const lbTitle = document.getElementById('pubLightboxTitle');
    const lbClose = document.getElementById('pubLightboxClose');

    document.querySelectorAll('.pub-figure img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            const titleEl = img.closest('.pub-row').querySelector('.pub-title a');
            lbTitle.textContent = titleEl ? titleEl.textContent : '';
            lightbox.classList.add('active');
        });
    });

    lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
}

function renderProjects() {
    const PROJ_VISIBLE = 4;
    const items = siteData.projects;
    const hasMore = items.length > PROJ_VISIBLE;

    document.getElementById('projects-grid').innerHTML =
        items.map((proj, i) => {
            const techHTML = proj.tech.map(t => `<span>${t}</span>`).join('');
            const linksHTML = proj.links.map(l => `<a href="${l.url}" target="_blank"><i class="${l.icon}"></i> ${l.label}</a>`).join('');

            let statusHTML = '';
            if (proj.status) {
                const isOngoing = proj.status.toLowerCase() === 'ongoing';
                const statusLabel = isOngoing ? 'Ongoing' : 'Completed';
                const statusClass = isOngoing ? 'status-ongoing' : 'status-completed';
                statusHTML = `<div class="project-status ${statusClass}">${statusLabel}</div>`;
            }

            return `
            <div class="project-card featured${i >= PROJ_VISIBLE ? ' section-overflow' : ''}" data-section="projects"${i >= PROJ_VISIBLE ? ' data-overflow' : ''}>
                <div class="project-badge">${proj.badge}</div>
                ${statusHTML}
                <div class="project-icon"><i class="${proj.icon}"></i></div>
                <h3>${proj.title}</h3>
                <p class="project-tagline">${proj.tagline}</p>
                <p>${proj.description}</p>
                <div class="project-tech">${techHTML}</div>
                ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
            </div>`;
        }).join('');

    if (hasMore) {
        const extra = items.length - PROJ_VISIBLE;
        document.getElementById('projects-grid').insertAdjacentHTML('afterend', `
            <div class="section-toggle-wrap" id="projects-toggle-wrap">
                <button class="timeline-toggle" onclick="toggleSection('projects', this, ${extra})">
                    <span>Show ${extra} more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>`);
    }
}

function renderExperience() {
    const VISIBLE_COUNT = 3;
    const items = siteData.experience;
    const hasMore = items.length > VISIBLE_COUNT;

    const buildItem = (exp, idx) => {
        const isEdu = exp.type === 'education';
        const icon = isEdu ? 'fas fa-graduation-cap' : 'fas fa-map-marker-alt';
        const hiddenClass = idx >= VISIBLE_COUNT ? ' timeline-hidden' : '';
        return `
        <div class="timeline-item${isEdu ? ' education' : ''}${hiddenClass}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <span class="timeline-date">${exp.date}</span>
                <h3>${exp.title}</h3>
                <p class="timeline-place"><i class="${icon}"></i> ${exp.place}</p>
                <p>${exp.description}</p>
            </div>
        </div>`;
    };

    let html = items.map((exp, i) => buildItem(exp, i)).join('');

    if (hasMore) {
        html += `
        <div class="timeline-toggle-wrap">
            <button class="timeline-toggle" id="expToggle" onclick="toggleExperience()">
                <span>View all positions</span>
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>`;
    }

    document.getElementById('timeline').innerHTML = html;
}

window.toggleExperience = function() {
    const hidden = document.querySelectorAll('.timeline-hidden');
    const btn = document.getElementById('expToggle');
    const isExpanded = btn.classList.contains('expanded');

    hidden.forEach(el => {
        el.style.display = isExpanded ? 'none' : '';
        if (!isExpanded) {
            el.classList.add('fade-in');
            requestAnimationFrame(() => el.classList.add('visible'));
        }
    });

    btn.classList.toggle('expanded');
    btn.querySelector('span').textContent = isExpanded ? 'View all positions' : 'Show less';
    btn.querySelector('i').className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
};

/* Generic section toggle (news, projects, teaching, talks) */
window.toggleSection = function(sectionName, btn, extraCount) {
    const items = document.querySelectorAll(`[data-section="${sectionName}"][data-overflow]`);
    const isExpanded = btn.classList.contains('expanded');

    items.forEach(el => {
        if (isExpanded) {
            el.classList.add('section-overflow');
            el.classList.remove('visible');
        } else {
            el.classList.remove('section-overflow');
            el.classList.add('fade-in');
            requestAnimationFrame(() => el.classList.add('visible'));
        }
    });

    btn.classList.toggle('expanded');
    btn.querySelector('span').textContent = isExpanded ? `Show ${extraCount} more` : 'Show less';
    btn.querySelector('i').className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';

    if (isExpanded) {
        const section = btn.closest('section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

function renderTeaching() {
    const t = siteData.teaching;
    const s = siteData.students;
    const TEACH_VISIBLE = 4;
    const courses = t.courses;
    const hasMore = courses.length > TEACH_VISIBLE;
    let html = '';

    // Courses
    html += `
        <div class="students-group">
            <h3 class="students-group-title"><i class="fas fa-chalkboard-teacher"></i> Teaching</h3>
            <div class="teaching-list">
                ${courses.map((c, i) => `
                    <div class="teaching-item${i >= TEACH_VISIBLE ? ' section-overflow' : ''}" data-section="teaching"${i >= TEACH_VISIBLE ? ' data-overflow' : ''}>
                        <span class="teaching-term">${c.term}</span>
                        <div class="teaching-details">
                            <strong>${c.name}</strong>
                            <span class="teaching-level">${c.level}</span>
                        </div>
                    </div>`).join('')}
            </div>
            ${hasMore ? `
            <div class="section-toggle-wrap">
                <button class="timeline-toggle" onclick="toggleSection('teaching', this, ${courses.length - TEACH_VISIBLE})">
                    <span>Show ${courses.length - TEACH_VISIBLE} more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>` : ''}
            ${t.certification ? `<p class="teaching-note"><i class="fas fa-certificate"></i> ${t.certification}</p>` : ''}
        </div>`;

    // Current students — simple list
    html += `
        <div class="students-group">
            <h3 class="students-group-title"><i class="fas fa-user-graduate"></i> Current Students</h3>
            ${s.summary ? `<p class="students-summary">${s.summary}</p>` : ''}`;

    if (s.current.length > 0) {
        html += `<ul class="student-list">
            ${s.current.map(st => `
                <li class="student-list-item">
                    <div class="student-list-main">
                        <strong class="student-list-name">${st.name}</strong>
                        <span class="student-degree ${st.badge}">${st.degree}</span>
                    </div>
                    ${st.project ? `<span class="student-list-project">${st.project}</span>` : ''}
                </li>`).join('')}
        </ul>`;
    } else {
        html += `<p class="students-summary" style="font-style:normal; color:var(--text-light);">Student names will be added soon.</p>`;
    }

    html += '</div>';
    document.getElementById('teaching-content').innerHTML = html;
}

function renderTalks() {
    const TALKS_VISIBLE = 4;
    const talks = siteData.talks;
    const hasMoreTalks = talks.length > TALKS_VISIBLE;
    let html = '';

    // Talks
    html += `
        <div class="students-group">
            <h3 class="students-group-title"><i class="fas fa-microphone-alt"></i> Invited Talks &amp; Presentations</h3>
            <div class="talks-list">
                ${talks.map((t, i) => `
                    <div class="talk-item${i >= TALKS_VISIBLE ? ' section-overflow' : ''}" data-section="talks"${i >= TALKS_VISIBLE ? ' data-overflow' : ''}>
                        <span class="talk-date">${t.date}</span>
                        <div class="talk-details">
                            <strong>"${t.title}"</strong>
                            <span class="talk-venue">${t.venue}</span>
                        </div>
                    </div>`).join('')}
            </div>
            ${hasMoreTalks ? `
            <div class="section-toggle-wrap">
                <button class="timeline-toggle" onclick="toggleSection('talks', this, ${talks.length - TALKS_VISIBLE})">
                    <span>Show ${talks.length - TALKS_VISIBLE} more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>` : ''}
        </div>`;

    // Awards
    html += `
        <div class="students-group">
            <h3 class="students-group-title"><i class="fas fa-trophy"></i> Fellowships &amp; Awards</h3>
            <div class="awards-list">
                ${siteData.awards.map(a => `
                    <div class="award-item">
                        <span class="award-year">${a.year}</span>
                        <p>${a.text}</p>
                    </div>`).join('')}
            </div>
        </div>`;

    // Service
    const sv = siteData.service;
    html += `
        <div class="students-group">
            <h3 class="students-group-title"><i class="fas fa-users-cog"></i> Academic Service</h3>
            <div class="service-content">
                <p>${sv.description}</p>
                <div class="service-venues">
                    ${sv.venues.map(v => `<span class="service-badge${v.highlight ? ' ac' : ''}">${v.name}</span>`).join('')}
                </div>
            </div>
        </div>`;

    document.getElementById('talks-content').innerHTML = html;
}

/* =====================================================
   GALLERY
   ===================================================== */

function renderGallery() {
    if (!siteData.gallery || !siteData.gallery.length) return;
    if (!document.getElementById('gallery-grid')) return;

    const GALLERY_VISIBLE = 6;
    const items = siteData.gallery;
    const hasMore = items.length > GALLERY_VISIBLE;

    document.getElementById('gallery-grid').innerHTML =
        items.map((item, i) => `
            <div class="gallery-item${i >= GALLERY_VISIBLE ? ' section-overflow' : ''}" 
                 data-section="gallery"${i >= GALLERY_VISIBLE ? ' data-overflow' : ''} 
                 data-gallery-category="${item.category}">
                <div class="gallery-img-wrap">
                    <img src="${item.image}" alt="${item.caption}" loading="lazy" 
                         onerror="this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'><i class=\\'fas fa-camera\\'></i></div>'">
                </div>
                <div class="gallery-caption">
                    <p class="gallery-caption-text">${item.caption}</p>
                    <span class="gallery-date"><i class="fas fa-calendar-alt"></i> ${item.date}</span>
                </div>
            </div>`).join('');

    if (hasMore) {
        const extra = items.length - GALLERY_VISIBLE;
        document.getElementById('gallery-grid').insertAdjacentHTML('afterend', `
            <div class="section-toggle-wrap" id="gallery-toggle-wrap">
                <button class="timeline-toggle" onclick="toggleSection('gallery', this, ${extra})">
                    <span>Show ${extra} more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>`);
    }

    // Gallery filter buttons
    document.querySelectorAll('[data-gallery-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-gallery-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.galleryFilter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.dataset.galleryCategory === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (lightbox) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) return;
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = item.querySelector('.gallery-caption-text').textContent;
                lightbox.classList.add('active');
            });
        });

        document.getElementById('lightboxClose').addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') lightbox.classList.remove('active');
        });
    }
}

/* =====================================================
   INTERACTIONS — Navbar, filters, animations
   ===================================================== */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 500);
        updateActiveNavLink();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    updateActiveNavLink();

    // --- Theme Toggle ---
    initThemeToggle();
}

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const THEME_KEY = 'siteTheme';
    const saved = localStorage.getItem(THEME_KEY);

    // Apply saved preference (or respect OS preference)
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem(THEME_KEY, 'dark');
        }
    });
}

const PUB_VISIBLE = 4;

function applyPubFilter(filter) {
    const pubItems = document.querySelectorAll('.pub-row');
    let visibleCount = 0;

    pubItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        const matches = filter === 'all' || category.includes(filter);

        item.classList.remove('hidden', 'pub-overflow');
        item.removeAttribute('data-overflow');

        if (!matches) {
            item.classList.add('hidden');
        } else {
            visibleCount++;
            if (visibleCount > PUB_VISIBLE) {
                item.classList.add('pub-overflow');
                item.setAttribute('data-overflow', 'true');
            }
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }
    });

    // Toggle button
    const existingBtn = document.getElementById('pubToggle');
    if (existingBtn) existingBtn.parentElement.remove();

    if (visibleCount > PUB_VISIBLE) {
        const extra = visibleCount - PUB_VISIBLE;
        const wrap = document.createElement('div');
        wrap.className = 'pub-toggle-wrap';
        wrap.innerHTML = `
            <button class="timeline-toggle" id="pubToggle">
                <span>Show ${extra} more</span>
                <i class="fas fa-chevron-down"></i>
            </button>`;
        document.getElementById('publications-table').after(wrap);
    }
}

function initFilters() {
    const pubFilter = document.querySelector('.publications-filter');
    if (!pubFilter) return;

    const filterBtns = pubFilter.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPubFilter(btn.getAttribute('data-filter'));
        });
    });

    // Initial filter
    applyPubFilter('all');
}

// Global toggle handler
document.addEventListener('click', function(e) {
    const btn = e.target.closest('#pubToggle');
    if (!btn) return;

    const isExpanded = btn.classList.contains('expanded');
    const overflowItems = document.querySelectorAll('.pub-row[data-overflow="true"]');

    if (isExpanded) {
        // Collapse
        overflowItems.forEach(el => el.classList.add('pub-overflow'));
        btn.classList.remove('expanded');
        btn.querySelector('span').textContent = `Show ${overflowItems.length} more`;
        btn.querySelector('i').className = 'fas fa-chevron-down';
        document.getElementById('publications').scrollIntoView({ behavior: 'smooth' });
    } else {
        // Expand
        overflowItems.forEach(el => {
            el.classList.remove('pub-overflow');
            el.classList.add('fade-in');
            requestAnimationFrame(() => el.classList.add('visible'));
        });
        btn.classList.add('expanded');
        btn.querySelector('span').textContent = 'Show less';
        btn.querySelector('i').className = 'fas fa-chevron-up';
    }
});

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Section-level animation — animate containers, not individual items
    const selectors = [
        '.about-content',
        '.news-feed',
        '.research-grid',
        '.publications-table',
        '.projects-grid',
        '.timeline',
        '#teaching-content',
        '#talks-content',
        '.contact-grid'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initHeroAnimation() {
    // Intentionally minimal — confident sites don't animate the hero
}
