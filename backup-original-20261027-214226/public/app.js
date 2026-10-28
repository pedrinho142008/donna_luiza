(() => {
  'use strict';

  const WHATSAPP = '5584996391361';

  const dishes = [
    {
      name: 'Filé de peixe gratinado',
      category: 'mar',
      label: 'DO MAR',
      description: 'Uma opção especial para quem aprecia os sabores do mar.',
      image: '/assets/file-peixe-molho-tomate-gratinado.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175521469.jpg'
    },
    {
      name: 'Arroz cremoso de camarão',
      category: 'mar',
      label: 'DO MAR',
      description: 'Uma combinação cremosa, feita para saborear sem pressa.',
      image: '/assets/arroz-cremoso-camarao-gratinado.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175546634.jpg'
    },
    {
      name: 'Gratinado de frutos do mar',
      category: 'mar',
      label: 'ESPECIALIDADE',
      description: 'Uma escolha marcante para quem gosta de frutos do mar.',
      image: '/assets/gratinado-frutos-do-mar.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175546635.jpg'
    },
    {
      name: 'Camarão empanado',
      category: 'mar',
      label: 'DO MAR',
      description: 'Uma opção para deixar a experiência ainda mais especial.',
      image: '/assets/camarao-empanado-arroz-colorido.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175555861.jpg'
    },
    {
      name: 'Cuscuz com polvo e queijo coalho',
      category: 'regionais',
      label: 'SABOR REGIONAL',
      description: 'Uma combinação que aproxima ingredientes e sabores.',
      image: '/assets/cuscuz-polvo-queijo-coalho.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175555863.jpg'
    },
    {
      name: 'Cuscuz com carne de sol',
      category: 'regionais',
      label: 'SABOR REGIONAL',
      description: 'Uma escolha de inspiração regional para sua mesa.',
      image: '/assets/cuscuz-carne-de-sol.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175619205.jpg'
    },
    {
      name: 'Pizza doce de chocolate e banana',
      category: 'pizza',
      label: 'PIZZA & DOCES',
      description: 'Uma opção doce para encerrar a refeição compartilhando.',
      image: '/assets/pizza-doce-chocolate-banana.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175633712.jpg'
    },
    {
      name: 'Creme tropical',
      category: 'pizza',
      label: 'SOBREMESA',
      description: 'Uma sugestão para fechar o momento com um toque doce.',
      image: '/assets/sobremesa-creme-tropical.jpg',
      fallback: '/assets/donnaluizazumbi_20261027_175656054.jpg'
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function whatsappUrl(message) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  function renderMenu(filter = 'todos') {
    const grid = $('#menu-grid');
    if (!grid) return;

    const visibleDishes = filter === 'todos'
      ? dishes
      : dishes.filter(dish => dish.category === filter);

    grid.innerHTML = visibleDishes.map((dish, index) => {
      const message = `Olá! Gostaria de saber mais sobre ${dish.name} no Donna Luiza, incluindo valor e disponibilidade.`;
      return `
        <article class="dish-card">
          <div class="dish-image">
            <img
              src="${dish.image}"
              data-fallback="${dish.fallback}"
              alt="${dish.name}"
              loading="lazy">
            <span class="dish-category">${dish.label}</span>
            <span class="dish-number">${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="dish-content">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
            <a class="dish-cta"
               href="${whatsappUrl(message)}"
               target="_blank"
               rel="noopener">
              Consultar prato <span>↗</span>
            </a>
          </div>
        </article>
      `;
    }).join('');

    attachImageFallbacks(grid);
  }

  function attachImageFallbacks(root = document) {
    $$('img[data-fallback]', root).forEach(img => {
      if (img.dataset.fallbackReady === 'true') return;
      img.dataset.fallbackReady = 'true';

      img.addEventListener('error', () => {
        if (!img.dataset.fallbackUsed && img.dataset.fallback) {
          img.dataset.fallbackUsed = 'true';
          img.src = img.dataset.fallback;
          return;
        }

        img.style.visibility = 'hidden';
      });
    });
  }

  function initialiseFilters() {
    $$('.filter-button').forEach(button => {
      button.addEventListener('click', () => {
        $$('.filter-button').forEach(item => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });

        renderMenu(button.dataset.filter || 'todos');
      });
    });
  }

  function initialiseMobileMenu() {
    const toggle = $('.menu-toggle');
    const nav = $('#main-nav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;

      toggle.setAttribute('aria-expanded', String(nextState));
      toggle.setAttribute(
        'aria-label',
        nextState ? 'Fechar menu' : 'Abrir menu'
      );

      nav.classList.toggle('open', nextState);
      document.body.classList.toggle('menu-open', nextState);
    });

    $$('a', nav).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  function initialiseReservationForm() {
    const form = $('#reservation-form');
    const dateInput = $('#guest-date');
    if (!form) return;

    if (dateInput) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${year}-${month}-${day}`;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('nome') || '').trim();
      const rawDate = String(data.get('data') || '');
      const time = String(data.get('horario') || '');
      const people = String(data.get('pessoas') || '');
      const notes = String(data.get('observacoes') || '').trim();

      const [year, month, day] = rawDate.split('-');
      const formattedDate = year ? `${day}/${month}/${year}` : rawDate;

      const message = [
        'Olá! Vim pelo site do Donna Luiza e gostaria de solicitar uma reserva.',
        '',
        `Nome: ${name}`,
        `Data desejada: ${formattedDate}`,
        `Horário desejado: ${time}`,
        `Quantidade de pessoas: ${people}`,
        notes ? `Observações: ${notes}` : '',
        '',
        'Poderiam confirmar a disponibilidade, por favor?'
      ].filter(Boolean).join('\n');

      openWhatsApp(message);
    });
  }

  function initialiseYear() {
    const yearElement = $('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  function initialiseAnchorLinks() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = $(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (history.replaceState) {
          history.replaceState(null, '', targetId);
        }
      });
    });
  }

  function initialise() {
    renderMenu();
    initialiseFilters();
    initialiseMobileMenu();
    initialiseReservationForm();
    initialiseYear();
    attachImageFallbacks();
    initialiseAnchorLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
  } else {
    initialise();
  }
})();
