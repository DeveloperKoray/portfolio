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

    //Allow to download my cv. We create a tag <a>, i simulate a click and then i delete it.
    document.getElementById('downloadcv').addEventListener('click', function () {
        //Just display in new window
        window.open('./extra/Kutlu-Koray-cv.pdf', '_blank');
        e.preventDefault(); 
    });
});

async function copyToClipboard(element) {
    // SHHHHHH don't tell how i did.
    //const copiedText = { "en": "      copied !      ", "fr": "       Copié !       " };
    const email = element.textContent.trim();
    const lang = document.documentElement.lang || 'en';
    const feedback = { en: "      copied !      ", fr: "       Copié !       " }[lang];
    const originalText = element.textContent;

    // Méthode 1: API Clipboard moderne (90% des cas)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(email);
            showFeedback();
            return; // Sortie si succès
        } catch (err) {
            console.log("Méthode 1 échouée, tentative méthode 2...");
        }
    }

    // Méthode 2: Textarea fallback (pour iOS/Safari)
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.style.position = 'fixed';
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        // Méthode 2a: execCommand (déprécié mais nécessaire)
        if (document.execCommand('copy')) {
            showFeedback();
        } else {
            throw new Error("execCommand failed");
        }
    } catch (err) {
        // Méthode 3: Fallback ultime (pour iOS ancien)
        manualCopyFallback();
    } finally {
        document.body.removeChild(textarea);
    }

    function showFeedback() {
        const width = element.offsetWidth + "px";
        element.textContent = feedback;
        element.style.width = width;
        setTimeout(() => {element.textContent = originalText
            element.style.width = "";
        }, 1000);
    }

    function manualCopyFallback() {
        // Solution bulletproof pour iOS récalcitrant
        const copyArea = document.createElement('div');
        copyArea.contentEditable = true;
        copyArea.textContent = email;
        copyArea.style.position = 'fixed';
        copyArea.style.top = 0;
        copyArea.style.left = 0;
        document.body.appendChild(copyArea);

        const range = document.createRange();
        range.selectNodeContents(copyArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showFeedback();
            } else {
                window.prompt("Copiez ce texte :", email);
            }
        } finally {
            document.body.removeChild(copyArea);
        }
    }
}

/**
 * Load language and put all the text in the good area.
 * @param {*} lang Prefered language
 */
async function loadLanguage(lang) {
    const responseRaw = await fetch(`./lang/${lang}.js`);
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

    //Generation of diagram class uml field if the project have one.
    var generateUml = "";
    if(project.haveUmlclassdiagram == true){
        generateUml = `<div class="pdf-container">
                            <h3>${project.umlclassdiagram_title}</h3>
                            <p>${project.umlclassdiagram_description}</p>
                            <a href="${project.umlclassdiagram_pdflink}" class="pdf-link" target="_blank" rel="noopener noreferrer">
                                ${project.umlclassdiagram_visualisepdf_message}
                            </a>
                            
                            <object 
                              data="${project.umlclassdiagram_pdflink}#view=FitH&toolbar=0&navpanes=0" 
                              type="application/pdf"
                              class="pdf-preview">
                              <p>${project.umlclassdiagram_pdfvisualiser_error}</p>
                            </object>
                        </div>`;
    }

    const content = generateContent + generateVideo + generateUml;

    return content;
}

function generateAboutme(response) {
    return `
    <h2>${response.aboutme_title}</h2>
    <p class="tagline">${response.aboutme_subtitle}</p>
    <div class="identity-description">
        <p>
        ${response.aboutme_description}
        </p>
    </div>`;
}

function generateContactme(response) {
    return `<h2>${response.contact_title}</h2>
                <div class="identity-description">
                    <p>${response.contact_description}</p>
                </div>`;
}

function initMobileMenu() {
    if (window.innerWidth > 480) return;

    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');

    const clickHandler = (e) => {
        if (navMenu.contains(e.target) || e.target === menuBtn) return;
        navMenu.classList.remove('active');
    };

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', clickHandler);

    // Nettoyage au resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 480) {
            document.removeEventListener('click', clickHandler);
            navMenu.classList.remove('active');
        }
    });
}