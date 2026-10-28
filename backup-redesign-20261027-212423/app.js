'use strict';

(() => {
  const WHATSAPP_NUMBER = '5584996391361';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const dishes = [
    {
      id: 'peixada-tradicional',
      title: 'Peixada Tradicional',
      category: 'Especialidade da casa',
      categories: ['mar', 'regional'],
      description: 'Um clássico de sabor litorâneo para aproveitar sem pressa.',
      image: '/assets/file-peixe-molho-tomate-gratinado.jpg',
      fallback: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=84',
      alt: 'Prato de peixe preparado e servido com cuidado'
    },
    {
      id: 'cuscuz-polvo',
      title: 'Cuscuz de Polvo com Queijo Coalho',
      category: 'Mar & tradição',
      categories: ['mar', 'regional'],
      description: 'Cuscuz nordestino com polvo e queijo coalho, cheio de personalidade.',
      image: '/assets/cuscuz-polvo-queijo-coalho.jpg',
      fallback: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=84',
      alt: 'Cuscuz amarelo servido com polvo e frutos do mar'
    },
    {
      id: 'arroz-cremoso-camarao',
      title: 'Arroz Cremoso com Camarão Gratinado',
      category: 'Favorito do mar',
      categories: ['mar'],
      description: 'Arroz cremoso com camarões e uma camada dourada irresistível.',
      image: '/assets/arroz-cremoso-camarao-gratinado.jpg',
      fallback: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=84',
      alt: 'Camarões preparados com acompanhamentos em prato de restaurante'
    },
    {
      id: 'gratinado-frutos-mar',
      title: 'Gratinado de Frutos do Mar',
      category: 'Mar & forno',
      categories: ['mar'],
      description: 'Uma combinação especial de polvo e camarão com cobertura gratinada.',
      image: '/assets/gratinado-frutos-do-mar.jpg',
      fallback: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=84',
      alt: 'Seleção de frutos do mar servida em um prato'
    },
    {
      id: 'camarao-empanado',
      title: 'Camarão Empanado com Arroz Colorido',
      category: 'Crocante & especial',
      categories: ['mar'],
      description: 'Camarões dourados acompanhados de arroz colorido e textura crocante.',
      image: '/assets/camarao-empanado-arroz-colorido.jpg',
      fallback: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=84',
      alt: 'Prato de camarões dourados com acompanhamentos'
    },
    {
      id: 'cuscuz-carne-sol',
      title: 'Cuscuz com Carne de Sol',
      category: 'Raízes nordestinas',
      categories: ['regional'],
      description: 'Cuscuz recheado com carne de sol e queijo, com sabor de tradição.',
      image: '/assets/cuscuz-carne-de-sol.jpg',
      fallback: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=84',
      alt: 'Prato regional com ingredientes frescos e coloridos'
    },
    {
      id: 'pizza-doce-meio-a-meio',
      title: 'Pizza Doce Meio a Meio',
      category: 'Para compartilhar',
      categories: ['pizza', 'doce'],
      description: 'Duas combinações na mesma pizza: chocolate com confetes e banana com doce de leite.',
      image: '/assets/pizza-doce-chocolate-banana.jpg',
      fallback: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=84',
      alt: 'Pizza artesanal assada com cobertura generosa'
    },
    {
      id: 'file-peixe-gratinado',
      title: 'Filé de Peixe ao Molho de Tomate Gratinado',
      category: 'Sabor do litoral',
      categories: ['mar'],
      description: 'Filé de peixe coberto com molho de tomate e queijo gratinado.',
      image: '/assets/file-peixe-molho-tomate-gratinado.jpg',
      fallback: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=84',
      alt: 'Filé de peixe servido com molho e guarnição'
    },
    {
      id: 'sobremesa-creme-tropical',
      title: 'Sobremesa da Casa',
      category: 'Um doce final',
      categories: ['doce'],
      description: 'Uma sugestão cremosa e tropical para encerrar a experiência com doçura.',
      image: '/assets/sobremesa-creme-tropical.jpg',
      fallback: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=84',
      alt: 'Sobremesa cremosa servida em uma apresentação delicada'
    }
  ];

  function whatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => toast.classList.remove('visible'), 3800);
  }

  function renderDishes(filter = 'todos') {
    const grid = $('#menu-grid');
    if (!grid) return;
    const visibleDishes = filter === 'todos'
      ? dishes
      : dishes.filter((dish) => dish.categories.includes(filter));

    grid.replaceChildren();
    visibleDishes.forEach((dish, index) => {
      const article = document.createElement('article');
      article.className = 'dish-card';
      article.style.animationDelay = `${Math.min(index * 45, 270)}ms`;

      const photo = document.createElement('div');
      photo.className = 'dish-photo';
      const img = document.createElement('img');
      img.className = 'image-fallback';
      img.src = dish.image;
      img.dataset.fallback = dish.fallback;
      img.alt = dish.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      photo.appendChild(img);
      const tag = document.createElement('span');
      tag.className = 'dish-category';
      tag.textContent = dish.category;
      photo.appendChild(tag);

      const content = document.createElement('div');
      content.className = 'dish-content';
      const title = document.createElement('h3');
      title.className = 'dish-title';
      title.textContent = dish.title;
      const description = document.createElement('p');
      description.className = 'dish-description';
      description.textContent = dish.description;
      const footer = document.createElement('div');
      footer.className = 'dish-footer';
      const price = document.createElement('span');
      price.className = 'dish-price';
      price.textContent = 'Valor pelo WhatsApp';
      const link = document.createElement('a');
      link.className = 'dish-consult';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.href = whatsappUrl(`Olá, Donna Luiza! Gostaria de consultar o valor e a disponibilidade de: ${dish.title}.`);
      link.innerHTML = 'Consultar <span aria-hidden="true">↗</span>';
      footer.append(price, link);
      content.append(title, description, footer);
      article.append(photo, content);
      grid.appendChild(article);
    });

    // Attach fallbacks after dynamically adding cards.
    attachImageFallbacks(grid);
  }

  function attachImageFallbacks(root = document) {
    $$('.image-fallback', root).forEach((img) => {
      if (img.dataset.fallbackReady === 'true') return;
      img.dataset.fallbackReady = 'true';
      img.addEventListener('error', () => {
        const fallback = img.dataset.fallback;
        if (fallback && img.src !== fallback && !img.dataset.didFallback) {
          img.dataset.didFallback = 'true';
          img.src = fallback;
        }
      });
    });
  }

  function initialiseMenu() {
    renderDishes();
    $$('.filter-button').forEach((button) => {
      button.addEventListener('click', () => {
        $$('.filter-button').forEach((item) => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        renderDishes(button.dataset.filter || 'todos');
        const viewport = $('#menu-grid');
        if (viewport) viewport.scrollTo({ left: 0, behavior: 'smooth' });
      });
    });

    const grid = $('#menu-grid');
    $('#menu-prev')?.addEventListener('click', () => grid?.scrollBy({ left: -Math.max(260, grid.clientWidth * 0.8), behavior: 'smooth' }));
    $('#menu-next')?.addEventListener('click', () => grid?.scrollBy({ left: Math.max(260, grid.clientWidth * 0.8), behavior: 'smooth' }));
  }

  function initialiseMobileMenu() {
    const toggle = $('.menu-toggle');
    const nav = $('#main-nav');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });

    $$('a', nav).forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  function initialiseReservation() {
    const form = $('#reservation-form');
    const dateInput = $('#reserve-date');
    if (!form || !dateInput) return;

    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    dateInput.min = localDate;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const dateValue = dateInput.value;
      const [year, month, day] = dateValue.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
      });
      const time = $('#reserve-time')?.value || 'Não informado';
      const guests = $('#reserve-guests')?.value || 'Não informado';
      const name = $('#reserve-name')?.value.trim();
      const message = [
        'Olá, Donna Luiza! Gostaria de consultar a disponibilidade para uma reserva.',
        '',
        `Nome: ${name || 'Não informado'}`,
        `Data: ${formattedDate}`,
        `Horário desejado: ${time}`,
        `Pessoas: ${guests}`,
        '',
        'Aguardo a confirmação da equipe. Obrigado(a)!'
      ].join('\n');
      openWhatsApp(message);
    });
  }

  function initialiseNewsletter() {
    const form = $('#newsletter-form');
    const emailInput = $('#newsletter-email');
    if (!form || !emailInput) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = emailInput.value.trim();
      openWhatsApp(`Olá, Donna Luiza! Gostaria de receber novidades da casa por e-mail.\nMeu e-mail: ${email}\nPor favor, me informem como posso autorizar esse contato.`);
      showToast('Vamos abrir o WhatsApp para você enviar seu pedido. O e-mail não é armazenado pelo site.');
      form.reset();
    });
  }

  function initialiseScrollEffects() {
    const header = $('.site-header');
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 15);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const revealItems = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  function initialiseYear() {
    const year = $('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  attachImageFallbacks();

  document.addEventListener('DOMContentLoaded', () => {
    attachImageFallbacks();
    initialiseMenu();
    initialiseMobileMenu();
    initialiseReservation();
    initialiseNewsletter();
    initialiseScrollEffects();
    initialiseYear();
  });
})();
