(() => {
  "use strict";

  // ---------- Always start at the top on reload (unless a #section is requested) ----------
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const resetScroll = () => {
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  resetScroll();
  window.addEventListener("pageshow", resetScroll);

  // ---------- Header scroll state ----------
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Hide header on the last section (footer) ----------
  const footerSection = document.getElementById("contactos");
  if (footerSection) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          header.classList.toggle("header-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    footerObserver.observe(footerSection);
  }

  // ---------- Hide header nav actions on the location section ----------
  const locationSection = document.getElementById("localizacao");
  if (locationSection) {
    const locationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          header.classList.toggle("hide-nav-actions", entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    locationObserver.observe(locationSection);
  }

  // ---------- Mobile nav toggle ----------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.style.top = header.getBoundingClientRect().bottom + 12 + "px";
      navLinks.classList.toggle("nav-links--open");
      navToggle.classList.toggle("is-active");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("nav-links--open");
        navToggle.classList.remove("is-active");
      })
    );
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("nav-links--open") &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove("nav-links--open");
        navToggle.classList.remove("is-active");
      }
    });
  }

  // ---------- Language selector + translation ----------
  const translations = {
    en: {
      "nav.sobre": "About",
      "nav.galeria": "Gallery",
      "nav.contactos": "Contact",
      "nav.reservar": "Book",
      "hero.location": "Restaurant · Steakhouse",
      "hero.cta": "Book",
      "sobre.title": "Flavors of Excellence",
      "sobre.p1": "In the historic heart of Castelo Branco, Tábuas.Come was born in 2022 inside a former 1960s olive oil mill. The 14 granite pillars define a spacious, welcoming space.",
      "sobre.p2": "Our specialities include crispy octopus risotto, fish and prawn moqueca, several codfish options, distinctive cuts of meat, premium meat boards, and signature starters and desserts.",
      "sobre.contactosBtn": "Contact",
      "awards.subtitle": "A thank you to everyone who recognized our work with these awards and distinctions.",
      "menu.carte.text": "Tradition at the table. A contemporary vision!<br>Traditional Portuguese cuisine with Mediterranean touches: premium meats, risottos and boards to share. The menu follows the seasons, with Portuguese and regional wines in the spotlight.",
      "menu.executive.text": "Tuesday to Friday (except public holidays), at lunch. Includes a mini couvert, soup of the day, main course and dessert of our choice, and 1 drink (water or a glass of house wine).",
      "menu.grupos.text": "We offer a range of menus for groups, celebrations and festive seasons. If you are a group of 10 or more adults, these menus are for you! Tailored to everyone's taste, with an all-inclusive price. Includes a starter, a choice of main courses, dessert and drinks.",
      "menu.verMenu": "View Menu",
      "menu.dot.carte": "A La Carte",
      "menu.dot.executive": "Executive",
      "menu.dot.grupos": "Groups",
      "gallery.title": "Gallery",
      "gallery.text": "A selection of moments, dishes and details captured inside the restaurant — the flavours, textures and gestures that help tell the story and identity of Tábuas.",
      "location.eyebrow": "Location",
      "location.title": "Where We Are",
      "location.hours.weekdaysLabel": "Tuesday to Saturday",
      "location.hours.satLabel": "Saturday",
      "location.hours.sunLabel": "Sunday",
      "location.hours.monLabel": "Monday",
      "location.hours.closed": "Closed",
      "footer.tagline": "Restaurant &amp; Steakhouse",
      "footer.reserve": "Book a Table",
      "footer.legal.compliments": "Compliments Book",
      "footer.legal.privacy": "Privacy Policy",
      "footer.legal.cookies": "Cookie Policy",
      "footer.bottom.rights": "© 2026 Tábuas.Come · All rights reserved.",
      "hero.hours": "Opening Hours",
      "menu.eventRequest": "Request a Quote",
      "contact.fixed": "Call to national landline network",
      "contact.mobile": "Call to national mobile network",
      "footer.legal.work": "Work With Us",
      "nav.reviews": "Reviews",
      "nav.eventos": "What's On",
      "hero.event": "Event Request",
      "awards.title": "Awards of Tábuas",
      "reviews.title": "Reviews",
      "reviews.more": "★ More Reviews",
    },
    fr: {
      "nav.sobre": "À Propos",
      "nav.galeria": "Galerie",
      "nav.contactos": "Contact",
      "nav.reservar": "Réserver",
      "hero.location": "Restaurant · Steakhouse",
      "hero.cta": "Réserver une Table",
      "sobre.title": "Saveurs d'Excellence",
      "sobre.p1": "Au cœur historique de Castelo Branco, Tábuas.Come est né en 2022 dans un ancien moulin à huile des années 60. Les 14 piliers en granit dessinent un espace vaste et chaleureux.",
      "sobre.p2": "Parmi nos spécialités : risotto au poulpe croustillant, moqueca de poisson et crevettes, plusieurs options de morue, des pièces de viande singulières, des planches de viandes premium ainsi que des entrées et desserts signature.",
      "sobre.contactosBtn": "Contact",
      "awards.subtitle": "Un grand merci à ceux qui ont reconnu notre travail avec ces prix et distinctions.",
      "menu.carte.text": "La tradition à table. Une vision contemporaine !<br>Cuisine traditionnelle portugaise aux touches méditerranéennes : viandes premium, risottos et planches à partager. La carte suit les saisons, avec les vins portugais et régionaux à l'honneur.",
      "menu.executive.text": "Du mardi au vendredi (sauf jours fériés), le midi. Comprend un mini couvert, la soupe du jour, un plat principal et un dessert selon notre suggestion, et 1 boisson (eau ou verre de vin de la maison).",
      "menu.grupos.text": "Nous proposons plusieurs menus pour les groupes, célébrations et fêtes de fin d'année. Vous êtes un groupe de 10 adultes ou plus ? Ces menus sont faits pour vous ! Adaptés aux goûts de chacun, à prix tout compris. Comprend une entrée, plusieurs choix de plat principal, dessert et boissons.",
      "menu.verMenu": "Voir le Menu",
      "menu.dot.carte": "À La Carte",
      "menu.dot.executive": "Executive",
      "menu.dot.grupos": "Groupes",
      "gallery.title": "Galerie",
      "gallery.text": "Une sélection de moments, plats et détails capturés à l'intérieur du restaurant — les saveurs, les textures et les gestes qui racontent l'histoire et l'identité du Tábuas.",
      "location.eyebrow": "Emplacement",
      "location.title": "Où Nous Trouver",
      "location.hours.weekdaysLabel": "Mardi à Samedi",
      "location.hours.satLabel": "Samedi",
      "location.hours.sunLabel": "Dimanche",
      "location.hours.monLabel": "Lundi",
      "location.hours.closed": "Fermé",
      "footer.tagline": "Restaurant &amp; Steakhouse",
      "footer.reserve": "Réserver une Table",
      "footer.legal.compliments": "Livre de Compliments",
      "footer.legal.privacy": "Politique de Confidentialité",
      "footer.legal.cookies": "Politique de Cookies",
      "footer.bottom.rights": "© 2026 Tábuas.Come · Tous droits réservés.",
      "hero.hours": "Horaires",
      "menu.eventRequest": "Demander un devis",
      "contact.fixed": "Appel vers le réseau fixe national",
      "contact.mobile": "Appel vers le réseau mobile national",
      "footer.legal.work": "Travailler avec nous",
      "nav.reviews": "Avis",
      "nav.eventos": "Événements",
      "hero.event": "Demande d'événement",
      "awards.title": "Prix et Distinctions",
      "reviews.title": "Avis",
      "reviews.more": "★ Plus d'avis",
    },
    es: {
      "nav.sobre": "Nosotros",
      "nav.galeria": "Galería",
      "nav.contactos": "Contacto",
      "nav.reservar": "Reservar",
      "hero.location": "Restaurante · Steakhouse",
      "hero.cta": "Reservar Mesa",
      "sobre.title": "Sabores de Excelencia",
      "sobre.p1": "En el corazón histórico de Castelo Branco, Tábuas.Come nació en 2022 en un antiguo molino de aceite de los años 60. Los 14 pilares de granito marcan un espacio amplio y acogedor.",
      "sobre.p2": "Entre nuestras especialidades: risotto con pulpo crujiente, moqueca de pescado y gambas, varias opciones de bacalao, cortes de carne diferenciados, tablas de carnes premium y entrantes y postres de autor.",
      "sobre.contactosBtn": "Contacto",
      "awards.subtitle": "Un agradecimiento a quienes reconocieron nuestro trabajo con estos premios y distinciones.",
      "menu.carte.text": "Tradición en la mesa. ¡Visión contemporánea!<br>Cocina tradicional portuguesa con toques mediterráneos: carnes premium, risottos y tablas para compartir. La carta sigue las estaciones, con vinos portugueses y regionales en el centro.",
      "menu.executive.text": "De martes a viernes (excepto festivos), al mediodía. Incluye mini cubierto, sopa del día, plato principal y postre según nuestra sugerencia, y 1 bebida (agua o copa de vino de la casa).",
      "menu.grupos.text": "Disponemos de varios menús para grupos, celebraciones y fechas festivas. Si son un grupo de 10 o más adultos, ¡estos menús son para ustedes! Adaptados al gusto de cada uno, con precio todo incluido. Incluye entrante, varias opciones de plato principal, postre y bebidas.",
      "menu.verMenu": "Ver Menú",
      "menu.dot.carte": "A La Carta",
      "menu.dot.executive": "Ejecutivo",
      "menu.dot.grupos": "Grupos",
      "gallery.title": "Galería",
      "gallery.text": "Una selección de momentos, platos y detalles captados dentro del restaurante — los sabores, las texturas y los gestos que cuentan la historia e identidad del Tábuas.",
      "location.eyebrow": "Ubicación",
      "location.title": "Dónde Estamos",
      "location.hours.weekdaysLabel": "Martes a Sábado",
      "location.hours.satLabel": "Sábado",
      "location.hours.sunLabel": "Domingo",
      "location.hours.monLabel": "Lunes",
      "location.hours.closed": "Cerrado",
      "footer.tagline": "Restaurante &amp; Steakhouse",
      "footer.reserve": "Reservar Mesa",
      "footer.legal.compliments": "Libro de Elogios",
      "footer.legal.privacy": "Política de Privacidad",
      "footer.legal.cookies": "Política de Cookies",
      "footer.bottom.rights": "© 2026 Tábuas.Come · Todos los derechos reservados.",
      "hero.hours": "Horario",
      "menu.eventRequest": "Pedir presupuesto",
      "contact.fixed": "Llamada a la red fija nacional",
      "contact.mobile": "Llamada a la red móvil nacional",
      "footer.legal.work": "Trabaja con nosotros",
      "nav.reviews": "Opiniones",
      "nav.eventos": "Eventos",
      "hero.event": "Solicitud de evento",
      "awards.title": "Premios y Distinciones",
      "reviews.title": "Opiniones",
      "reviews.more": "★ Más opiniones",
    },
  };

  const i18nEls = Array.from(document.querySelectorAll("[data-i18n]"));
  translations.pt = {};
  i18nEls.forEach((el) => {
    translations.pt[el.getAttribute("data-i18n")] = el.innerHTML;
  });

  const applyLanguage = (lang) => {
    const dict = translations[lang] || translations.pt;
    i18nEls.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.innerHTML = dict[key] || translations.pt[key];
    });
    document.documentElement.setAttribute("lang", lang);
    try {
      localStorage.setItem("tabuas-lang", lang);
    } catch (err) {}
  };

  const langSelect = document.getElementById("langSelect");
  const langToggle = document.getElementById("langToggle");
  const langCurrent = document.getElementById("langCurrent");
  const langMenu = document.getElementById("langMenu");
  if (langSelect && langToggle && langMenu) {
    const closeLangMenu = () => {
      langSelect.classList.remove("open");
      langToggle.setAttribute("aria-expanded", "false");
    };
    langToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = langSelect.classList.toggle("open");
      langToggle.setAttribute("aria-expanded", String(isOpen));
    });
    const options = Array.from(langMenu.querySelectorAll("li"));
    const setLang = (option) => {
      options.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
      langCurrent.textContent = option.getAttribute("data-label");
      applyLanguage(option.getAttribute("data-lang"));
    };
    options.forEach((option) => {
      option.addEventListener("click", () => {
        setLang(option);
        closeLangMenu();
      });
    });
    document.addEventListener("click", (e) => {
      if (!langSelect.contains(e.target)) closeLangMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLangMenu();
    });

    let savedLang;
    try {
      savedLang = localStorage.getItem("tabuas-lang");
    } catch (err) {}
    if (savedLang) {
      const match = options.find((o) => o.getAttribute("data-lang") === savedLang);
      if (match) setLang(match);
    }
  }

  // ---------- Menu slider ----------
  const menuSlider = document.getElementById("menuSlider");
  if (menuSlider) {
    const menuSlides = Array.from(menuSlider.querySelectorAll(".menu-slide"));
    const menuDots = Array.from(document.querySelectorAll(".menu-dot"));
    const realCount = menuSlides.length;
    let menuActiveIndex = 0;

    // Infinite loop: clone the last slide before the first and the first slide after the last,
    // so scrolling past either end lands on a visually-identical clone, then we silently
    // jump back to the matching real slide.
    const leadingClone = menuSlides[realCount - 1].cloneNode(true);
    const trailingClone = menuSlides[0].cloneNode(true);
    leadingClone.setAttribute("aria-hidden", "true");
    trailingClone.setAttribute("aria-hidden", "true");
    menuSlider.insertBefore(leadingClone, menuSlides[0]);
    menuSlider.appendChild(trailingClone);

    const allSlides = Array.from(menuSlider.querySelectorAll(".menu-slide"));
    let domIndex = 1; // allSlides[1..realCount] are the real slides; 0 and realCount+1 are clones

    const setActiveMenu = (index) => {
      menuActiveIndex = index;
      menuDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      syncMenuArrowPosition();
    };

    const scrollToDom = (index, smooth) => {
      domIndex = index;
      menuSlider.scrollTo({ left: allSlides[index].offsetLeft, behavior: smooth ? "smooth" : "auto" });
    };

    // If we're currently sitting on a clone (e.g. a second next/prev click landed
    // before the previous wrap had a chance to settle), resolve it instantly first
    // so relative navigation always starts from a real slide index.
    const resolveClonePosition = () => {
      if (domIndex === 0) {
        scrollToDom(realCount, false);
        setActiveMenu(realCount - 1);
      } else if (domIndex === allSlides.length - 1) {
        scrollToDom(1, false);
        setActiveMenu(0);
      }
    };

    const goToMenu = (index) => {
      scrollToDom(index + 1, true);
      setActiveMenu(index);
    };

    let scrollTimeout;
    menuSlider.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const width = menuSlider.clientWidth;
          const settledIndex = Math.round(menuSlider.scrollLeft / width);
          if (settledIndex === 0) {
            scrollToDom(realCount, false);
            setActiveMenu(realCount - 1);
          } else if (settledIndex === allSlides.length - 1) {
            scrollToDom(1, false);
            setActiveMenu(0);
          } else if (settledIndex !== domIndex) {
            domIndex = settledIndex;
            setActiveMenu(domIndex - 1);
          }
        }, 80);
      },
      { passive: true }
    );

    let menuAutoplay;
    const startMenuAutoplay = () => {
      clearInterval(menuAutoplay);
      menuAutoplay = setInterval(() => {
        resolveClonePosition();
        scrollToDom(domIndex + 1, true);
        setActiveMenu((menuActiveIndex + 1) % realCount);
      }, 20000);
    };

    menuDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goToMenu(Number(dot.dataset.index));
        startMenuAutoplay();
      });
    });

    const menuPrev = document.getElementById("menuPrev");
    const menuNext = document.getElementById("menuNext");
    if (menuPrev) {
      menuPrev.addEventListener("click", () => {
        resolveClonePosition();
        scrollToDom(domIndex - 1, true);
        setActiveMenu((menuActiveIndex - 1 + realCount) % realCount);
        startMenuAutoplay();
      });
    }
    if (menuNext) {
      menuNext.addEventListener("click", () => {
        resolveClonePosition();
        scrollToDom(domIndex + 1, true);
        setActiveMenu((menuActiveIndex + 1) % realCount);
        startMenuAutoplay();
      });
    }

    window.addEventListener("resize", () => {
      menuSlider.scrollTo({ left: allSlides[domIndex].offsetLeft });
    });

    const menuArrows = document.querySelectorAll(".menu-arrow");
    const syncMenuArrowPosition = () => {
      const sectionEl = document.getElementById("menu");
      const activeSlide = menuSlides[menuActiveIndex];
      const activeTitle = activeSlide && activeSlide.querySelector(".menu-slide-title");
      const activeText = activeSlide && activeSlide.querySelector(".menu-text p");
      if (!sectionEl || !activeTitle || !activeText || !menuArrows.length) return;
      const sectionRect = sectionEl.getBoundingClientRect();
      const titleRect = activeTitle.getBoundingClientRect();
      const textRect = activeText.getBoundingClientRect();
      const top = (titleRect.top + textRect.bottom) / 2 - sectionRect.top;
      menuArrows.forEach((arrow) => {
        arrow.style.top = top + "px";
      });
    };
    syncMenuArrowPosition();
    window.addEventListener("resize", syncMenuArrowPosition);

    const menuSection = document.getElementById("menu");
    if (menuSection) {
      const menuVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startMenuAutoplay();
            } else {
              clearInterval(menuAutoplay);
            }
          });
        },
        { threshold: 0.5 }
      );
      menuVisibilityObserver.observe(menuSection);
    } else {
      startMenuAutoplay();
    }
  }

  // ---------- Reviews / Feedbacks carousel ----------
  const reviewsSlider = document.getElementById("reviewsSlider");
  if (reviewsSlider) {
    const reviewSlides = Array.from(reviewsSlider.querySelectorAll(".reviews-slide"));
    let reviewIndex = reviewSlides.findIndex((s) => s.classList.contains("active"));
    if (reviewIndex < 0) reviewIndex = 0;

    const goToReview = (index) => {
      reviewIndex = ((index % reviewSlides.length) + reviewSlides.length) % reviewSlides.length;
      reviewSlides.forEach((slide, i) => slide.classList.toggle("active", i === reviewIndex));
      syncReviewsArrowPosition();
    };

    let reviewsAutoplay;
    const startReviewsAutoplay = () => {
      clearInterval(reviewsAutoplay);
      reviewsAutoplay = setInterval(() => goToReview(reviewIndex + 1), 10000);
    };

    const reviewsSectionEl = document.getElementById("feedbacks");
    const reviewsArrows = reviewsSectionEl ? reviewsSectionEl.querySelectorAll(".reviews-arrow") : [];
    const syncReviewsArrowPosition = () => {
      if (!reviewsSectionEl || !reviewsArrows.length) return;
      const activeQuote = reviewsSlider.querySelector(".reviews-slide.active p");
      if (!activeQuote) return;
      const sectionRect = reviewsSectionEl.getBoundingClientRect();
      const quoteRect = activeQuote.getBoundingClientRect();
      const top = quoteRect.top - sectionRect.top + quoteRect.height / 2;
      reviewsArrows.forEach((arrow) => {
        arrow.style.top = top + "px";
      });
    };
    syncReviewsArrowPosition();
    window.addEventListener("resize", syncReviewsArrowPosition);

    const reviewsPrev = document.getElementById("reviewsPrev");
    const reviewsNext = document.getElementById("reviewsNext");
    if (reviewsPrev) {
      reviewsPrev.addEventListener("click", () => {
        goToReview(reviewIndex - 1);
        startReviewsAutoplay();
      });
    }
    if (reviewsNext) {
      reviewsNext.addEventListener("click", () => {
        goToReview(reviewIndex + 1);
        startReviewsAutoplay();
      });
    }

    let reviewTouchStartX = 0;
    let reviewTouchStartY = 0;
    reviewsSlider.addEventListener(
      "touchstart",
      (e) => {
        reviewTouchStartX = e.touches[0].clientX;
        reviewTouchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    reviewsSlider.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - reviewTouchStartX;
        const dy = e.changedTouches[0].clientY - reviewTouchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          goToReview(reviewIndex + (dx < 0 ? 1 : -1));
          startReviewsAutoplay();
        }
      },
      { passive: true }
    );

    const reviewsSection = document.getElementById("feedbacks");
    if (reviewsSection) {
      const reviewsVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startReviewsAutoplay();
            } else {
              clearInterval(reviewsAutoplay);
            }
          });
        },
        { threshold: 0.5 }
      );
      reviewsVisibilityObserver.observe(reviewsSection);
    } else {
      startReviewsAutoplay();
    }
  }

  // ---------- Gallery carousel (infinite loop, no correction races) ----------
  const gallerySlider = document.getElementById("gallerySlider");
  if (gallerySlider) {
    const baseSlides = Array.from(gallerySlider.children);
    const REPEATS = 30; // 30 laps of the real images before any wrap is even possible
    for (let r = 1; r < REPEATS; r++) {
      baseSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach((img) => img.setAttribute("alt", ""));
        gallerySlider.appendChild(clone);
      });
    }

    const gallerySlides = Array.from(gallerySlider.children);
    const totalSlides = gallerySlides.length;
    // Always safe: whatever galleryIndex is, this never accesses out of range.
    const galleryDomIndex = (i) => ((i % totalSlides) + totalSlides) % totalSlides;
    let galleryIndex = 0;

    const galleryJump = (i, behavior) => {
      gallerySlider.scrollTo({ left: gallerySlides[galleryDomIndex(i)].offsetLeft, behavior: behavior || "smooth" });
    };

    const galleryGoTo = (i) => {
      galleryIndex = i;
      galleryJump(galleryIndex);
    };

    // Keep galleryIndex in sync if the visitor drags/swipes the slider by hand.
    let galleryScrollTimeout;
    gallerySlider.addEventListener(
      "scroll",
      () => {
        clearTimeout(galleryScrollTimeout);
        galleryScrollTimeout = setTimeout(() => {
          const width = gallerySlides[0].getBoundingClientRect().width;
          galleryIndex = Math.round(gallerySlider.scrollLeft / width);
        }, 120);
      },
      { passive: true }
    );

    let galleryTimer;
    const startGalleryAutoplay = () => {
      clearInterval(galleryTimer);
      galleryTimer = setInterval(() => galleryGoTo(galleryIndex + 1), 4000);
    };

    const galleryPrev = document.getElementById("galleryPrev");
    const galleryNext = document.getElementById("galleryNext");
    if (galleryPrev) {
      galleryPrev.addEventListener("click", () => {
        galleryGoTo(galleryIndex - 1);
        startGalleryAutoplay();
      });
    }
    if (galleryNext) {
      galleryNext.addEventListener("click", () => {
        galleryGoTo(galleryIndex + 1);
        startGalleryAutoplay();
      });
    }

    window.addEventListener("resize", () => {
      galleryJump(galleryIndex, "auto");
    });

    galleryJump(galleryIndex, "auto");

    const gallerySection = document.getElementById("galeria");
    if (gallerySection) {
      const galleryVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startGalleryAutoplay();
            } else {
              clearInterval(galleryTimer);
            }
          });
        },
        { threshold: 0.5 }
      );
      galleryVisibilityObserver.observe(gallerySection);
    } else {
      startGalleryAutoplay();
    }
  }

  // ---------- Lightbox ----------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  document.querySelectorAll(".gallery-slide img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("active");
    });
  });
  const closeLightbox = () => lightbox.classList.remove("active");
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
