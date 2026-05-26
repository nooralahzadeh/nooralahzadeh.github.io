document.addEventListener("DOMContentLoaded", () => {
    if (typeof siteData === "undefined") return;
    renderAcademicView();
    initMenuToggle();
});

const NEWS_VISIBLE = 4;
const PUB_VISIBLE = 4;
const PROJECT_VISIBLE = 4;
const CV_VISIBLE = 4;

function renderAcademicView() {
    const d = siteData.personal;

    setText("name", d.name);
    setText("title", d.title);
    setHTML(
        "affiliation",
        d.affiliation + (d.location ? " · " + d.location : "")
    );
    setText("tagline", d.tagline || "");

    renderPhoto(d);
    renderHeroLinks(d);
    renderAbout();
    renderNews();
    renderPublications();
    renderProjects();
    renderCV();
    wireExternalLinks(d);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || "";
}

function setHTML(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = value || "";
}

function renderPhoto(d) {
    const wrap = document.getElementById("heroPhoto");
    if (!wrap) return;

    if (d.photo) {
        wrap.innerHTML = '<img src="' + d.photo + '" alt="' + d.name + '">';
    } else {
        wrap.innerHTML = '<div class="hero-placeholder"><i class="fas fa-user"></i></div>';
    }
}

function renderHeroLinks(d) {
    const linksWrap = document.getElementById("heroLinks");
    if (!linksWrap) return;

    const links = [];
    if (d.links && d.links.scholar) {
        links.push(linkBtn(d.links.scholar, "Google Scholar", "fas fa-graduation-cap"));
    }
    if (d.links && d.links.github) {
        links.push(linkBtn(d.links.github, "GitHub", "fab fa-github"));
    }
    if (d.links && d.links.linkedin) {
        links.push(linkBtn(d.links.linkedin, "LinkedIn", "fab fa-linkedin"));
    }
    if (d.emails && d.emails.length && d.emails[0].address) {
        links.push(linkBtn("mailto:" + d.emails[0].address, "Email", "fas fa-envelope"));
    }
    linksWrap.innerHTML = links.join("");
}

function linkBtn(url, label, icon) {
    const target = url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"';
    return (
        '<a class="hero-link-btn" href="' +
        url +
        '"' +
        target +
        "><i class=\"" +
        icon +
        '\"></i>' +
        label +
        "</a>"
    );
}

function renderAbout() {
    const about = document.getElementById("aboutCopy");
    if (!about || !siteData.about || !Array.isArray(siteData.about.paragraphs)) return;
    about.innerHTML = siteData.about.paragraphs.map((p) => "<p>" + p + "</p>").join("");
}

function renderNews() {
    const rows = document.getElementById("newsRows");
    if (!rows || !Array.isArray(siteData.news)) return;
    const items = sortNewsChronological(siteData.news);

    rows.innerHTML = items
        .map((n, i) => {
            const hiddenClass = i >= NEWS_VISIBLE ? " is-hidden" : "";
            return (
                '<tr class="' +
                hiddenClass.trim() +
                '">' +
                '<td class="news-date">' +
                formatDate(n.month, n.year) +
                "</td>" +
                "<td>" +
                n.text +
                "</td>" +
                "</tr>"
            );
        })
        .join("");

    const rowsList = Array.from(rows.querySelectorAll("tr"));
    applyShowMoreToggle("newsToggleBtn", rowsList, NEWS_VISIBLE);
}

function formatDate(month, year) {
    if (!month && !year) return "";
    if (month && year) return month + " " + year;
    return month || year;
}

function sortNewsChronological(items) {
    const monthMap = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    function getSortKey(n) {
        const rawMonth = String(n.month || "").trim();
        const rawYear = String(n.year || "").trim();
        let yearNum = parseInt(rawYear, 10);
        let monthNum = monthMap[rawMonth.slice(0, 3).toLowerCase()] || 1;

        if (Number.isNaN(yearNum)) {
            const monthAsYear = parseInt(rawMonth, 10);
            yearNum = Number.isNaN(monthAsYear) ? 0 : monthAsYear;
            if (!monthMap[rawMonth.slice(0, 3).toLowerCase()]) monthNum = 1;
        }

        return yearNum * 100 + monthNum;
    }

    return [...items].sort((a, b) => getSortKey(b) - getSortKey(a));
}

function renderPublications() {
    const list = document.getElementById("pubList");
    if (!list || !Array.isArray(siteData.publications)) return;

    list.innerHTML = siteData.publications
        .map((p, i) => {
            const hiddenClass = i >= PUB_VISIBLE ? " is-hidden" : "";
            const links = Array.isArray(p.links)
                ? p.links
                      .map(
                          (l) =>
                              '<a href="' +
                              l.url +
                              '" target="_blank" rel="noopener">' +
                              l.label +
                              "</a>"
                      )
                      .join("")
                : "";

            return (
                '<article class="pub-item' +
                hiddenClass +
                '">' +
                '<h3 class="pub-title"><a href="' +
                p.url +
                '" target="_blank" rel="noopener">' +
                p.title +
                "</a></h3>" +
                '<p class="pub-meta">' +
                (p.authors || "") +
                "</p>" +
                (p.affiliations ? '<p class="pub-affiliations">' + p.affiliations + "</p>" : "") +
                '<p class="pub-venue">' +
                (p.venue || "") +
                (p.role ? " · " + p.role : "") +
                "</p>" +
                (links ? '<div class="pub-links">' + links + "</div>" : "") +
                "</article>"
            );
        })
        .join("");

    const pubItems = Array.from(list.querySelectorAll(".pub-item"));
    applyShowMoreToggle("pubToggleBtn", pubItems, PUB_VISIBLE);
}

function renderCV() {
    const list = document.getElementById("cvList");
    if (!list || !Array.isArray(siteData.experience)) return;

    list.innerHTML = siteData.experience
        .map(
            (e, i) =>
                '<article class="cv-item' +
                (i >= CV_VISIBLE ? " is-hidden" : "") +
                '">' +
                '<div class="cv-date">' +
                (e.date || "") +
                "</div>" +
                '<div class="cv-title">' +
                (e.title || "") +
                "</div>" +
                '<div class="cv-place">' +
                (e.place || "") +
                "</div>" +
                '<div class="cv-description">' +
                (e.description || "") +
                "</div>" +
                "</article>"
        )
        .join("");

    const cvItems = Array.from(list.querySelectorAll(".cv-item"));
    applyShowMoreToggle("cvToggleBtn", cvItems, CV_VISIBLE);
}

function renderProjects() {
    const list = document.getElementById("projectList");
    if (!list || !Array.isArray(siteData.projects)) return;

    list.innerHTML = siteData.projects
        .map((p, i) => {
            const links = Array.isArray(p.links)
                ? p.links
                      .map(
                          (l) =>
                              '<a href="' +
                              l.url +
                              '" target="_blank" rel="noopener">' +
                              (l.label || "Link") +
                              "</a>"
                      )
                      .join("")
                : "";

            return (
                '<article class="project-item' +
                (i >= PROJECT_VISIBLE ? " is-hidden" : "") +
                '">' +
                '<div class="project-head">' +
                '<h3 class="project-title">' +
                (p.title || "") +
                "</h3>" +
                (p.badge ? '<span class="project-badge">' + p.badge + "</span>" : "") +
                (p.status ? '<span class="project-status">' + p.status + "</span>" : "") +
                "</div>" +
                (p.tagline ? '<p class="project-tagline">' + p.tagline + "</p>" : "") +
                (p.description ? '<p class="project-description">' + p.description + "</p>" : "") +
                (links ? '<div class="project-links">' + links + "</div>" : "") +
                "</article>"
            );
        })
        .join("");

    const projectItems = Array.from(list.querySelectorAll(".project-item"));
    applyShowMoreToggle("projectToggleBtn", projectItems, PROJECT_VISIBLE);
}

function wireExternalLinks(d) {
    const scholar = document.getElementById("scholarLink");
    if (scholar && d.links && d.links.scholar) scholar.href = d.links.scholar;

    const github = document.getElementById("githubLink");
    if (github && d.links && d.links.github) github.href = d.links.github;
}

function initMenuToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");
    if (!menuToggle || !menu) return;

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => menu.classList.remove("open"));
    });
}

function applyShowMoreToggle(buttonId, items, visibleCount) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    if (items.length <= visibleCount) {
        btn.hidden = true;
        return;
    }

    btn.hidden = false;
    const extraCount = items.length - visibleCount;
    btn.textContent = "Show " + extraCount + " more";
    btn.dataset.expanded = "false";

    btn.onclick = () => {
        const expanded = btn.dataset.expanded === "true";
        if (expanded) {
            items.forEach((item, i) => {
                item.classList.toggle("is-hidden", i >= visibleCount);
            });
            btn.dataset.expanded = "false";
            btn.textContent = "Show " + extraCount + " more";
        } else {
            items.forEach((item) => item.classList.remove("is-hidden"));
            btn.dataset.expanded = "true";
            btn.textContent = "Show less";
        }
    };
}
