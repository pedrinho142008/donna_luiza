(() => {
  "use strict";

  const WHATSAPP_NUMBER = "5584996391361";
  const dishes = [
    {
      name: "Filé de peixe gratinado",
      category: "mar",
      label: "Sabores do mar",
      description: "Peixe preparado com molho de tomate e finalização gratinada.",
      image: "/assets/file-peixe-molho-tomate-gratinado.jpg",
      alt: "Filé de peixe com molho de tomate gratinado"
    },
    {
      name: "Arroz cremoso de camarão",
      category: "mar",
      label: "Sabores do mar",
      description: "Uma combinação cremosa com camarões e uma apresentação irresistível.",
      image: "/assets/arroz-cremoso-camarao-gratinado.jpg",
      alt: "Arroz cremoso de camarão gratinado"
    },
    {
      name: "Gratinado de frutos do mar",
      category: "mar",
      label: "Sabores do mar",
      description: "Uma opção especial para quem aprecia os sabores do litoral.",
      image: "/assets/gratinado-frutos-do-mar.jpg",
      alt: "Prato gratinado de frutos do mar"
    },
    {
      name: "Camarão empanado",
      category: "mar",
      label: "Sabores do mar",
      description: "Camarões empanados acompanhados de arroz colorido.",
      image: "/assets/camarao-empanado-arroz-colorido.jpg",
      alt: "Camarão empanado com arroz colorido"
    },
    {
      name: "Cuscuz com polvo e queijo coalho",
      category: "regional",
      label: "Encontro de sabores",
      description: "Uma combinação marcante com ingredientes cheios de personalidade.",
      image: "/assets/cuscuz-polvo-queijo-coalho.jpg",
      alt: "Cuscuz com polvo e queijo coalho"
    },
    {
      name: "Cuscuz com carne de sol",
      category: "regional",
      label: "Sabor regional",
      description: "Uma combinação que celebra os sabores queridos do Nordeste.",
      image: "/assets/cuscuz-carne-de-sol.jpg",
      alt: "Cuscuz com carne de sol"
    },
    {
      name: "Pizza doce de chocolate e banana",
      category: "pizza",
      label: "Pizzas",
      description: "Chocolate e banana em uma combinação para fechar a refeição.",
      image: "/assets/pizza-doce-chocolate-banana.jpg",
      alt: "Pizza doce de chocolate e banana"
    },
    {
      name: "Creme tropical",
      category: "sobremesa",
      label: "Sobremesas",
      description: "Uma sobremesa delicada para encerrar seu momento com doçura.",
      image: "/assets/sobremesa-creme-tropical.jpg",
      alt: "Sobremesa creme tropical"
    }
  ];

  const menuGrid = document.querySelector("#menu-grid");
  const menuCount = document.querySelector("#menu-count");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const reservationForm = document.querySelector("#reservation-form");
  const dateInput = document.querySelector("#guest-date");
  const menuToggle = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function renderMenu(filter = "todos") {
    if (!menuGrid) return;

    const visibleDishes = filter === "todos"
      ? dishes
      : dishes.filter((dish) => dish.category === filter);

    menuGrid.innerHTML = visibleDishes.map((dish, index) => `
      <article class="dish-card" style="animation-delay:${Math.min(index * 55, 220)}ms">
        <div class="dish-image">
          <img src="${dish.image}" alt="${escapeHTML(dish.alt)}" loading="lazy">
          <span class="dish-number">${String(dishes.indexOf(dish) + 1).padStart(2, "0")}</span>
        </div>
        <span class="dish-category">${escapeHTML(dish.label)}</span>
        <h3>${escapeHTML(dish.name)}</h3>
        <p>${escapeHTML(dish.description)}</p>
        <div class="dish-bottom">
          <span>Consulte disponibilidade</span>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${dish.name} na Donna Luiza.`)}" target="_blank" rel="noopener noreferrer">Consultar <b>↗</b></a>
        </div>
      </article>
    `).join("");

    if (menuCount) {
      menuCount.textContent = `${String(visibleDishes.length).padStart(2, "0")} ${visibleDishes.length === 1 ? "opção" : "opções"}`;
    }
  }

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function setupFilters() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderMenu(button.dataset.filter || "todos");
      });
    });
  }

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  function setupMobileMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      mainNav.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMobileMenu();
    });
  }

  function setupReservationForm() {
    if (!reservationForm || !dateInput) return;

    dateInput.min = localDateString();

    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const error = document.querySelector("#form-error");
      if (error) error.hidden = true;

      const formData = new FormData(reservationForm);
      const name = String(formData.get("nome") || "").trim();
      const date = String(formData.get("data") || "");
      const time = String(formData.get("horario") || "");
      const guests = String(formData.get("pessoas") || "");
      const notes = String(formData.get("observacoes") || "").trim();

      if (!name || !date || !time || !guests) {
        if (error) {
          error.textContent = "Preencha seu nome, a data, o horário e o número de pessoas.";
          error.hidden = false;
        }
        return;
      }

      if (date < localDateString()) {
        if (error) {
          error.textContent = "Escolha uma data de hoje em diante.";
          error.hidden = false;
        }
        dateInput.focus();
        return;
      }

      const [year, month, day] = date.split("-");
      const message = [
        "Olá, Donna Luiza! Gostaria de solicitar uma reserva.",
        "",
        `Nome: ${name}`,
        `Data: ${day}/${month}/${year}`,
        `Horário desejado: ${time}`,
        `Pessoas: ${guests}`,
        notes ? `Observações: ${notes}` : "",
        "",
        "Poderiam confirmar a disponibilidade, por favor?"
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      const opened = window.open(url, "_blank", "noopener,noreferrer");

      if (!opened) window.location.href = url;
    });
  }

  function setupImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach((image) => {
      image.addEventListener("error", () => {
        if (image.dataset.fallbackUsed) {
          image.style.visibility = "hidden";
          return;
        }
        image.dataset.fallbackUsed = "true";
        image.src = image.dataset.fallback;
      });
    });
  }

  function setupRevealAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-motion");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  }

  function setupPageDetails() {
    const year = document.querySelector("#current-year");
    if (year) year.textContent = String(new Date().getFullYear());

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    });
  }

  renderMenu();
  setupFilters();
  setupMobileMenu();
  setupReservationForm();
  setupImageFallbacks();
  setupRevealAnimations();
  setupPageDetails();
})();
