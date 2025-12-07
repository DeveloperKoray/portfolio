document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentLang = 'en';
    const langData = {
        en: window.lang_en,
        fr: window.lang_fr
    };

    // Elements
    const langBtns = document.querySelectorAll('.lang-switch button:not(#theme-toggle)');
    const themeBtn = document.getElementById('theme-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Initialize
    updateContent();

    // Theme Toggle
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeBtn.textContent = '🌙';
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            themeBtn.textContent = '☀️';
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    });

    // Event Listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.id.split('-')[1];
            if (lang !== currentLang) {
                currentLang = lang;
                updateActiveLangButton();
                updateContent();
            }
        });
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Functions
    function updateActiveLangButton() {
        langBtns.forEach(btn => {
            if (btn.id === `lang-${currentLang}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function updateContent() {
        const data = langData[currentLang];
        if (!data) return;

        // Update Text Elements
        document.querySelectorAll('[id]').forEach(el => {
            if (data[el.id] && typeof data[el.id] === 'string') {
                el.innerHTML = data[el.id]; // Use innerHTML to support <br> tags
            }
        });

        // Update Nav Items (using data-i18n attribute for things that don't have unique IDs in JSON)
        // Note: The JSON doesn't strictly have nav items, so we might need to map them or just hardcode/infer
        // For now, let's assume the JSON keys map directly to IDs where possible.
        // The user JSON has specific keys like 'welcome_title'.

        // Special handling for Projects
        renderProjects(data.projects);

        // Special handling for CV buttons text if needed (not in JSON, so we handle manually or add to JSON)
        // Since it's not in JSON, I'll do a simple manual switch for now or leave as is if acceptable.
        // Actually, let's make it nice.
        const cvEnBtn = document.getElementById('cv-en-btn');
        const cvFrBtn = document.getElementById('cv-fr-btn');
        if (currentLang === 'en') {
            cvEnBtn.style.display = 'inline-block';
            cvFrBtn.style.display = 'none';
        } else {
            cvEnBtn.style.display = 'none';
            cvFrBtn.style.display = 'inline-block';
        }

        // Update static text that might not be in JSON (Nav, etc)
        // The JSON provided is limited. I will add a small dictionary here for missing UI elements.
        const uiText = {
            en: {
                nav_home: 'Home',
                nav_about: 'About',
                nav_projects: 'Projects',
                nav_contact: 'Contact',
                cta_projects: 'View Projects',
                projects_title: 'Projects'
            },
            fr: {
                nav_home: 'Accueil',
                nav_about: 'À propos',
                nav_projects: 'Projets',
                nav_contact: 'Contact',
                cta_projects: 'Voir les projets',
                projects_title: 'Projets'
            }
        };

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (uiText[currentLang][key]) {
                el.textContent = uiText[currentLang][key];
            }
        });
    }

    function renderProjects(projects) {
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card glass-card';
            card.style.padding = '0'; // Reset padding for card with image/video
            card.style.overflow = 'hidden';

            let mediaHtml = '';
            if (project.video_link) {
                mediaHtml = `
                    <div class="video-container">
                        <iframe 
                            src="${project.video_link}" 
                            title="${project.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" 
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
            }
            // If no video, we simply don't add the mediaHtml, so no placeholder.

            let umlHtml = '';
            if (project.haveUmlclassdiagram) {
                umlHtml = `
                    <div class="uml-section">
                        <h4>${project.umlclassdiagram_title || 'UML Diagram'}</h4>
                        <p>${project.umlclassdiagram_description || ''}</p>
                        <a href="${project.umlclassdiagram_pdflink}" target="_blank" class="uml-btn">
                            ${project.umlclassdiagram_visualisepdf_message || 'View PDF'}
                        </a>
                    </div>
                `;
            }

            let tagsHtml = '';
            if (project.tags && project.tags.length > 0) {
                tagsHtml = `<div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                </div>`;
            }

            card.innerHTML = `
                ${mediaHtml}
                <div class="project-info">
                    <h3>${project.title}</h3>
                    ${tagsHtml}
                    <p>${project.description}</p>
                    ${umlHtml}
                </div>
            `;

            grid.appendChild(card);
        });
    }
});
