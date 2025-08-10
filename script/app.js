let currentLang = 'en';
document.addEventListener('DOMContentLoaded', function () {

    initMobileMenu();
    // Gestion des langues
    const langButtons = document.querySelectorAll('.lang-btn');
    //Default language is english
    // Static content charging english first time

    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentLang = this.dataset.lang;
            document.documentElement.lang = currentLang;
            loadLanguage(currentLang);
        });
    });

    // Manage tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabId = this.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    //A FAIRE
    // menuToggle.addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     menuToggle.classList.toggle('active');
    //     navLinks.classList.toggle('active');
    // });


    // Redimensionnement
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });

    //Allow to download my cv. We create a tag <a>, i simulate a click and then i delete it.
    document.getElementById('downloadcv').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = './Kutlu-Koray-cv.pdf'; // met le bon chemin vers ton CV ici
        link.download = 'Kutlu-Koray-cv.pdf'; // nom du fichier téléchargé
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

function copyToClipboard(element) {
    // SHHHHHH don't tell how i did.
    const copiedText = { "en": "      copied !      ", "fr": "       Copié !       " };

    // take my email
    const myeamail = element.textContent;

    // Copy to cliboard. And change my email text for 1 second to write Copied and show to user that he copied my email.
    navigator.clipboard.writeText(myeamail).then(() => {
        // Take the good version of copied text. Depend on user language
        element.textContent = copiedText[document.documentElement.lang];

        // After 1 second i show my email again
        setTimeout(() => {
            element.textContent = myeamail;
        }, 1000);

    });
}

/**
 * Load language and put all the text in the good area.
 * @param {*} lang Prefered language
 */
async function loadLanguage(lang) {
    const responseRaw = await fetch(`/lang/${lang}.js`);
    const response = await responseRaw.json();
    //generer le titre
    document.getElementById("welcome_title").innerHTML = response.welcome_title;
    //generer le soustitre
    document.getElementById("welcome_subtitle").innerHTML = response.welcome_subtitle;
    //Generer le contenu projet
    response.projects.forEach(project => {
        document.getElementById(project.id).innerHTML = generateProjectHTML(project);
    });
    //Generer la section about me
    document.getElementById("aboutme").innerHTML = generateAboutme(response);
    //Generer la section contactme
    document.getElementById("contactme").innerHTML = generateContactme(response);
}

/**
 * Generate html content of a projet
 * @param {*} project The projet
 * @returns Html with the content
 */
function generateProjectHTML(project) {
    //Generation of text field
    const generateContent = `
    <div class="project-details">
        <h2>${project.title}</h2>
        <p>${project.description}</p>
    </div>`;
    //Generation of video field if video is available
    var generateVideo = "";
    if (project.video_link != null) {
        generateVideo = `
        <div class="video-container">
            <iframe src="${project.video_link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>`;
    }

    const content = generateContent + generateVideo;

    return content;
}

function generateAboutme(project) {
    return `
    <h2>${project.aboutme_title}</h2>
    <p class="tagline">${project.aboutme_subtitle}</p>
    <div class="identity-description">
        <p>
        ${project.aboutme_description}
        </p>
        <p> / </p>
        <div class="next-section-hint">
            <span>${project.aboutme_description_extra}</span>
        </div>
    </div>`;
}

function generateContactme(project) {
    return `
        <h2>${project.contact_title}</h2>
        <p>${project.contact_description}</p>`;
}

function initMobileMenu() {
    // 1. Récupère les éléments existants
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');
    
    if (!menuBtn || !navMenu) return; // Sécurité si éléments absents
  
    // 2. Gère l'affichage initial
    function updateMenu() {
      const isMobile = window.innerWidth <= 480;
      
      if (isMobile) {
        menuBtn.style.display = 'block';
        navMenu.style.display = 'none';
      } else {
        menuBtn.style.display = 'none';
        navMenu.style.display = 'flex';
      }
    }
  
    // 3. Gère les clics
    function toggleMenu(e) {
      e.stopPropagation();
      navMenu.style.display = navMenu.style.display === 'none' ? 'flex' : 'none';
    }
  
    function closeMenu(e) {
      if (!navMenu.contains(e.target) && e.target !== menuBtn) {
        navMenu.style.display = 'none';
      }
    }
  
    // 4. Initialisation
    updateMenu();
    menuBtn.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenu);
  
    // 5. Adapte au redimensionnement
    window.addEventListener('resize', updateMenu);
  }