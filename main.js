document.addEventListener("DOMContentLoaded", () => {
  initGalaxy();          // inizializza lo sfondo a tema "galaxy" con stelle animate
  initParallax();        // inizializza l'effetto parallasse sul mouse
  initFilters();         // inizializza i filtri per i progetti
  initNavbar();          // gestione dello scroll della navbar
  initScrollReveal();    // animazioni di comparsa sezione allo scroll
  initSkillGalaxy();     // animazione dei cerchi skills (galaxy skills)
  initAboutImageHover(); // zoom interattivo sull'immagine About
});

/* =========================
   🌌 GALAXY BACKGROUND
========================= */
function initGalaxy() {
  // prende il canvas dove disegnare le stelle
  const canvas = document.getElementById("galaxyCanvas");
  if (!canvas) return; // se non esiste il canvas esce

  const ctx = canvas.getContext("2d");        // contesto 2D del canvas
  const hero = document.querySelector(".hero"); // sezione hero come riferimento dimensioni
  let stars = [];                             // array di stelle
  const numStars = 800;                       // numero totale di stelle
  const speed = 4 ;                          // velocità di movimento delle stelle

  // funzione per ridimensionare il canvas quando cambia la finestra
  function resize() {
    const dpr = window.devicePixelRatio || 1;     // supporto display retina
    canvas.width = hero.offsetWidth * dpr;       // larghezza canvas in px
    canvas.height = hero.offsetHeight * dpr;     // altezza canvas in px
    canvas.style.width = hero.offsetWidth + "px"; // stile CSS larghezza
    canvas.style.height = hero.offsetHeight + "px"; // stile CSS altezza
    ctx.setTransform(1,0,0,1,0,0);               // reset scala e trasformazioni
    ctx.scale(dpr, dpr);                          // scala per display ad alta risoluzione
  }

  window.addEventListener("resize", resize); // aggiorna il canvas al resize
  resize();                                  // chiamata iniziale

  // Classe per definire ogni stella
  class Star {
    constructor() { this.reset(); } // quando creata, setta posizione casuale

    // imposta posizione, dimensione e colore casuali
    reset() {
      this.x = Math.random() * hero.offsetWidth;   // posizione x
      this.y = Math.random() * hero.offsetHeight;  // posizione y
      this.z = Math.random() * hero.offsetWidth;   // profondità per effetto 3D
      this.size = 2 + Math.random() * 3;           // dimensione stella
      this.color = ["#ffffff", "#a855f7", "#ec4899", "#3b82f6"][Math.floor(Math.random() * 4)]; // colore casuale
    }

    // aggiornamento della posizione ad ogni frame
    update() {
      this.z -= speed;             // muove la stella verso di noi
      if (this.z <= 0) {           // se supera il punto di vista
        this.reset();              // resetta posizione e profondità
        this.z = hero.offsetWidth; // riparte da lontano
      }
    }

    // disegna la stella sul canvas
    draw() {
      // calcolo posizione prospettica (effetto 3D)
      let sx = (this.x - hero.offsetWidth / 2) * (hero.offsetWidth / this.z) + hero.offsetWidth / 2;
      let sy = (this.y - hero.offsetHeight / 2) * (hero.offsetWidth / this.z) + hero.offsetHeight / 2;
      let r = this.size * (hero.offsetWidth / this.z) * 0.4; // raggio in prospettiva

      ctx.beginPath();
      ctx.fillStyle = this.color; // colore della stella
      ctx.arc(sx, sy, r, 0, Math.PI * 2); // disegna cerchio
      ctx.fill();
    }
  }

  // crea tutte le stelle iniziali
  for (let i = 0; i < numStars; i++) stars.push(new Star());

  // funzione ricorsiva per animare tutte le stelle
  function animate() {
    ctx.fillStyle = "#050505";                  // sfondo nero
    ctx.fillRect(0, 0, hero.offsetWidth, hero.offsetHeight); // pulisce il canvas
    stars.forEach((s) => { s.update(); s.draw(); }); // aggiorna e disegna ogni stella
    requestAnimationFrame(animate);             // richiama animate per il prossimo frame
  }

  animate(); // avvia l'animazione
}


/* =========================
   🖱 PARALLAX
========================= */
function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const elements = document.querySelectorAll(".move");
  let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function animate() {
    const rect = hero.getBoundingClientRect();
    const targetX = mouseX - rect.width / 2;
    const targetY = mouseY - rect.height / 2;

    currentX += (targetX - currentX) * 0.25;
    currentY += (targetY - currentY) * 0.25;

    elements.forEach((el) => {
      const speed = el.dataset.speed || 1;
      el.style.transform = `translate(${currentX * 0.15 * speed}px, ${currentY * 0.15 * speed}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================
   🎯 FILTER PROJECTS
========================= */
function initFilters() {
  window.filterProjects = function(category, el) {
    const cards = document.querySelectorAll(".project-card");
    const buttons = document.querySelectorAll(".btn-filter");
    buttons.forEach((btn) => btn.classList.remove("active"));
    el.classList.add("active");

    cards.forEach((card) => {
      card.style.display = category === "all" || card.classList.contains(category) ? "block" : "none";
    });
  };
}

/* =========================
   🔥 NAVBAR SCROLL
========================= */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* =========================
   👀 SCROLL REVEAL
========================= */
function initScrollReveal() {
  const sections = document.querySelectorAll('.scroll-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  sections.forEach(section => observer.observe(section));
}

////////////////////  SKILL GALAXY /////////////////////

function initSkillGalaxy() {
  const orbits = document.querySelectorAll('.orbit');
  if (!orbits.length) return;

  let angle = 0;
  const numOrbits = orbits.length;
  const radius = 250; // raggio uniforme per tutti i cerchi

  function animate() {
    angle += 0.2; // velocità di rotazione

    orbits.forEach((orbit, index) => {
      // distribuzione uniforme angoli
      const angleOffset = (index / numOrbits) * 360;
      const rad = (angle + angleOffset) * (Math.PI / 180);
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      orbit.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

  animate();


function initAboutImageHover() {
  const aboutImage = document.querySelector('.about-image img');
  if (!aboutImage) return;

  aboutImage.addEventListener('mousemove', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    e.target.style.transform = `scale(2.5) translate(${x}px, ${y}px)`;
  });

  aboutImage.addEventListener('mouseleave', () => {
    aboutImage.style.transform = 'scale(1) translate(0, 0)';
  });
}

// ✅ Chiama tutte le funzioni quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSkillGalaxy();
  initAboutImageHover();
});

document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

const cards = document.querySelectorAll('.projects-list .project-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));