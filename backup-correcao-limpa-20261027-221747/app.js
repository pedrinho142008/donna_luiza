"use strict";

(() => {
  const WHATSAPP_NUMBER = "5584996391361";
  const CART_KEY = "donna_luiza_cart_v1";

  /*
   * ATENÇÃO:
   * Os valores abaixo são exemplos iniciais para demonstrar o carrinho.
   * Substitua pelos preços oficiais antes de divulgar o site.
   * Confira também se os pratos e as fotos correspondem ao cardápio real.
   */
  const products = [
    {
      id: "peixe-grelhado",
      name: "Peixe grelhado",
      category: "mar",
      label: "Sabores do mar",
      description: "Uma sugestão especial para apreciar os sabores da região.",
      price: 59.90,
      image: "/assets/donnaluizazumbi_20261027_175521469.jpg",
      tag: "SUGESTÃO"
    },
    {
      id: "camarao",
      name: "Camarão especial",
      category: "mar",
      label: "Sabores do mar",
      description: "Uma opção para quem aprecia os sabores do mar.",
      price: 69.90,
      image: "/assets/donnaluizazumbi_20261027_175546634.jpg",
      tag: "ESPECIAL"
    },
    {
      id: "prato-regional",
      name: "Sabor regional",
      category: "regional",
      label: "Cozinha regional",
      description: "Uma sugestão para compartilhar bons momentos à mesa.",
      price: 44.90,
      image: "/assets/donnaluizazumbi_20261027_175555861.jpg",
      tag: "DA CASA"
    },
    {
      id: "pizza-marguerita",
      name: "Pizza marguerita",
      category: "pizza",
      label: "Pizzaria",
      description: "Uma combinação clássica para reunir todo mundo.",
      price: 42.90,
      image: "/assets/donnaluizazumbi_20261027_175619205.jpg",
      tag: "CLÁSSICA"
    },
    {
      id: "pizza-especial",
      name: "Pizza especial",
      category: "pizza",
      label: "Pizzaria",
      description: "Uma sugestão saborosa para a sua próxima visita.",
      price: 49.90,
      image: "/assets/donnaluizazumbi_20261027_175521469.jpg",
      tag: "ESPECIAL"
    },
    {
      id: "pizza-calabresa",
      name: "Pizza calabresa",
      category: "pizza",
      label: "Pizzaria",
      description: "Uma escolha clássica para dividir com a família.",
      price: 45.90,
      image: "/assets/donnaluizazumbi_20261027_175546634.jpg",
      tag: "FAVORITA"
    },
    {
      id: "sobremesa",
      name: "Doce especial",
      category: "sobremesa",
      label: "Sobremesas",
      description: "Uma sugestão doce para encerrar sua experiência.",
      price: 18.90,
      image: "/assets/donnaluizazumbi_20261027_175555861.jpg",
      tag: "PARA FINALIZAR"
    },
    {
      id: "sobremesa-gelada",
      name: "Sobremesa gelada",
      category: "sobremesa",
      label: "Sobremesas",
      description: "Uma opção para quem gosta de terminar com leveza.",
      price: 16.90,
      image: "/assets/donnaluizazumbi_20261027_175619205.jpg",
      tag: "ESPECIAL"
    }
  ];

  const fallbackImage = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL"
  }).format(value);

  let activeCategory = "todos";
  let searchText = "";
  let toastTimer;
  let cart = loadCart();

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved
        .filter(item => products.some(product => product.id === item.id))
        .map(item => ({
          id: item.id,
          quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1))
        }));
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      showToast("Não foi possível salvar o carrinho neste navegador.");
    }
    renderCart();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function renderProducts() {
    const grid = $("#menu-grid");
    if (!grid) return;

    const filtered = products.filter(product => {
      const matchesCategory = activeCategory === "todos" || product.category === activeCategory;
      const haystack = `${product.name} ${product.description} ${product.label}`.toLocaleLowerCase("pt-BR");
      return matchesCategory && haystack.includes(searchText.toLocaleLowerCase("pt-BR"));
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="menu-empty">Não encontramos itens com essa busca. Experimente outro termo.</div>';
      return;
    }

    grid.innerHTML = filtered.map(product => `
      <article class="menu-card">
        <div class="menu-card-image">
          <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
          <span class="menu-tag">${escapeHTML(product.tag)}</span>
          <button class="add-item" type="button" data-add="${escapeHTML(product.id)}"
            aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">+</button>
        </div>
        <div class="menu-card-body">
          <span class="menu-card-category">${escapeHTML(product.label)}</span>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="menu-card-description">${escapeHTML(product.description)}</p>
          <div class="menu-card-bottom">
            <span class="menu-price">${money(product.price)}<small>VALOR DEMONSTRATIVO</small></span>
            <button class="text-link" type="button" data-add="${escapeHTML(product.id)}" aria-label="Adicionar item">
              Adicionar <span>+</span>
            </button>
          </div>
        </div>
      </article>
    `).join("");

    $$("img", grid).forEach(img => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackUsed) return;
        img.dataset.fallbackUsed = "1";
        img.src = fallbackImage;
      }, { once: true });
    });
  }

  function cartDetails() {
    return cart.map(item => {
      const product = products.find(entry => entry.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    }).filter(Boolean);
  }

  function cartQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartSubtotal() {
    return cartDetails().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else cart.push({ id, quantity: 1 });
    saveCart();
    showToast(`${product.name} adicionado ao carrinho.`);
  }

  function changeQuantity(id, amount) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
    if (item.quantity > 99) item.quantity = 99;
    saveCart();
  }

  function renderCart() {
    const count = cartQuantity();
    const countBadge = $("#cart-count");
    const drawerCount = $("#drawer-count");
    const itemsNode = $("#cart-items");
    const emptyNode = $("#cart-empty");
    const footerNode = $("#cart-footer");

    if (countBadge) countBadge.textContent = String(count);
    if (drawerCount) drawerCount.textContent = `(${count})`;
    if (!itemsNode) return;

    const details = cartDetails();
    itemsNode.innerHTML = details.map(item => `
      <article class="cart-line">
        <img src="${escapeHTML(item.image)}" alt="" loading="lazy">
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <span class="cart-line-price">${money(item.price * item.quantity)}</span>
          <div class="quantity-control">
            <button type="button" data-qty="${escapeHTML(item.id)}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty="${escapeHTML(item.id)}" data-delta="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove="${escapeHTML(item.id)}" aria-label="Remover ${escapeHTML(item.name)}">×</button>
      </article>
    `).join("");

    if (emptyNode) emptyNode.classList.toggle("visible", details.length === 0);
    if (footerNode) footerNode.classList.toggle("hidden", details.length === 0);
    const totalNode = $("#cart-total");
    if (totalNode) totalNode.textContent = money(cartSubtotal());

    $$("img", itemsNode).forEach(img => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackUsed) return;
        img.dataset.fallbackUsed = "1";
        img.src = fallbackImage;
      }, { once: true });
    });
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
  }

  function openCart() {
    closeMobileMenu();
    $("#cart-drawer")?.classList.add("open");
    $("#cart-drawer")?.setAttribute("aria-hidden", "false");
    $("#page-scrim")?.classList.add("visible");
    document.body.classList.add("locked");
    $("#close-cart")?.focus();
  }

  function closeCart() {
    $("#cart-drawer")?.classList.remove("open");
    $("#cart-drawer")?.setAttribute("aria-hidden", "true");
    if (!$("#mobile-menu")?.classList.contains("open")) {
      $("#page-scrim")?.classList.remove("visible");
      document.body.classList.remove("locked");
    }
  }

  function openMobileMenu() {
    closeCart();
    $("#mobile-menu")?.classList.add("open");
    $("#mobile-menu")?.setAttribute("aria-hidden", "false");
    $("#open-mobile-menu")?.setAttribute("aria-expanded", "true");
    $("#page-scrim")?.classList.add("visible");
    document.body.classList.add("locked");
  }

  function closeMobileMenu() {
    $("#mobile-menu")?.classList.remove("open");
    $("#mobile-menu")?.setAttribute("aria-hidden", "true");
    $("#open-mobile-menu")?.setAttribute("aria-expanded", "false");
    if (!$("#cart-drawer")?.classList.contains("open")) {
      $("#page-scrim")?.classList.remove("visible");
      document.body.classList.remove("locked");
    }
  }

  function checkoutWhatsApp() {
    const details = cartDetails();
    if (!details.length) {
      showToast("Adicione pelo menos um item ao carrinho.");
      return;
    }

    const lines = details.map(item =>
      `• ${item.quantity}x ${item.name} — ${money(item.price * item.quantity)}`
    );
    const message = [
      "Olá, Donna Luiza! Gostaria de consultar e fazer este pedido:",
      "",
      ...lines,
      "",
      `Subtotal demonstrativo: ${money(cartSubtotal())}`,
      "",
      "Por favor, confirmem disponibilidade, preços oficiais e condições do pedido."
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function setupReservation() {
    const form = $("#reservation-form");
    const dateInput = $("#reservation-date");
    if (!form || !dateInput) return;

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    dateInput.min = localToday;

    const phoneInput = $('input[name="phone"]', form);
    phoneInput?.addEventListener("input", () => {
      let digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);
      if (digits.length > 10) {
        digits = digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (digits.length > 6) {
        digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (digits.length > 2) {
        digits = digits.replace(/^(\d{2})(\d+)/, "($1) $2");
      } else if (digits.length) {
        digits = `(${digits}`;
      }
      phoneInput.value = digits;
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = $("#reservation-feedback");
      let valid = true;

      $$(".field", form).forEach(field => {
        field.classList.remove("invalid");
        const control = $("input,select,textarea", field);
        const error = $(".field-error", field);
        if (!control || !error) return;

        let message = "";
        if (control.required && !control.value.trim()) {
          message = "Preencha este campo.";
        } else if (control.name === "name" && control.value.trim().length < 2) {
          message = "Informe seu nome.";
        } else if (control.name === "date" && control.value < localToday) {
          message = "Escolha uma data válida.";
        } else if (control.name === "phone" && control.value.replace(/\D/g, "").length < 10) {
          message = "Informe um telefone válido com DDD.";
        }

        if (message) {
          valid = false;
          field.classList.add("invalid");
          error.textContent = message;
        } else {
          error.textContent = "";
        }
      });

      if (!valid) {
        feedback.textContent = "Confira os campos destacados antes de continuar.";
        form.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
        return;
      }

      const data = new FormData(form);
      const dateParts = String(data.get("date")).split("-");
      const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      const message = [
        "Olá, Donna Luiza! Gostaria de solicitar uma reserva:",
        "",
        `Nome: ${String(data.get("name")).trim()}`,
        `Data: ${dateFormatted}`,
        `Horário desejado: ${data.get("time")}`,
        `Pessoas: ${data.get("people")}`,
        `Contato: ${String(data.get("phone")).trim()}`,
        data.get("notes") ? `Observações: ${String(data.get("notes")).trim()}` : "",
        "",
        "Aguardo confirmação da disponibilidade. Obrigado(a)!"
      ].filter(Boolean).join("\n");

      feedback.textContent = "Abrindo o WhatsApp para você enviar a solicitação…";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });
  }

  function setupCategories() {
    $("#category-list")?.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      $$(".category-button").forEach(item => item.classList.toggle("active", item === button));
      renderProducts();
    });

    $("#menu-search")?.addEventListener("input", event => {
      searchText = event.target.value.trim();
      renderProducts();
    });

    $("#view-all-menu")?.addEventListener("click", () => {
      activeCategory = "todos";
      searchText = "";
      const search = $("#menu-search");
      if (search) search.value = "";
      $$(".category-button").forEach(item => item.classList.toggle("active", item.dataset.category === "todos"));
      renderProducts();
      $("#cardapio")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function setupEvents() {
    $("#menu-grid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-add]");
      if (button) addToCart(button.dataset.add);
    });

    $("#cart-items")?.addEventListener("click", event => {
      const quantityButton = event.target.closest("[data-qty]");
      const removeButton = event.target.closest("[data-remove]");
      if (quantityButton) changeQuantity(quantityButton.dataset.qty, Number(quantityButton.dataset.delta));
      if (removeButton) {
        cart = cart.filter(item => item.id !== removeButton.dataset.remove);
        saveCart();
      }
    });

    $("#open-cart")?.addEventListener("click", openCart);
    $("#close-cart")?.addEventListener("click", closeCart);
    $("#open-mobile-menu")?.addEventListener("click", () => {
      if ($("#mobile-menu")?.classList.contains("open")) closeMobileMenu();
      else openMobileMenu();
    });
    $("#close-mobile-menu")?.addEventListener("click", closeMobileMenu);
    $("#page-scrim")?.addEventListener("click", () => {
      closeCart();
      closeMobileMenu();
    });
    $("#mobile-menu")?.addEventListener("click", event => {
      if (event.target.closest("a")) closeMobileMenu();
    });
    $("#continue-shopping")?.addEventListener("click", () => {
      closeCart();
      $("#cardapio")?.scrollIntoView({ behavior: "smooth" });
    });
    $("#checkout-whatsapp")?.addEventListener("click", checkoutWhatsApp);
    $("#clear-cart")?.addEventListener("click", () => {
      cart = [];
      saveCart();
      showToast("Carrinho limpo.");
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeCart();
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMobileMenu();
    });
  }

  function init() {
    $("#current-year").textContent = String(new Date().getFullYear());
    renderProducts();
    renderCart();
    setupCategories();
    setupEvents();
    setupReservation();

    // Fallback visual caso uma imagem local não exista.
    $$("img").forEach(img => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackUsed) return;
        img.dataset.fallbackUsed = "1";
        img.src = fallbackImage;
      }, { once: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
