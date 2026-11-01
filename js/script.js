const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const parseCurrency = (value) => {
  const cleaned = String(value || '0').replace(/[^\d.-]/g, '');
  const numeric = Number.parseFloat(cleaned || '0');
  return Number.isFinite(numeric) ? numeric : 0;
};

const setError = (input, message) => {
  if (!input) return;

  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();

  if (message) {
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#d32f2f';
    error.style.fontSize = '0.82rem';
    error.style.marginTop = '6px';
    input.parentElement.appendChild(error);
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
};

const validateCustomerDetails = () => {
  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');

  let valid = true;

  if (customerName) {
    const nameValue = customerName.value.trim();
    if (nameValue.length < 2) {
      setError(customerName, 'Please enter your full name.');
      valid = false;
    } else {
      setError(customerName, '');
    }
  }

  if (customerPhone) {
    const phoneValue = customerPhone.value.trim();
    const phonePattern = /^(\+27|0)[0-9\s-]{9,}$/;

    if (!phonePattern.test(phoneValue)) {
      setError(customerPhone, 'Please enter a valid South African phone number.');
      valid = false;
    } else {
      setError(customerPhone, '');
    }
  }

  return valid;
};

const updateOpenStatus = () => {
  const statusDisplay = document.getElementById('statusDisplay');
  if (!statusDisplay) return;

  const today = new Date();
  const day = today.getDay();
  const currentHour = today.getHours();

  const isWeekdayOpen = (day >= 1 && day <= 5 && currentHour >= 9 && currentHour < 22);
  const isSaturdayOpen = (day === 6 && currentHour >= 9 && currentHour < 22);
  const isSundayOpen = (day === 0 && currentHour >= 12 && currentHour < 20);

  const isOpen = isWeekdayOpen || isSaturdayOpen || isSundayOpen;

  statusDisplay.textContent = isOpen ? 'Currently Open' : 'Currently Closed';
  statusDisplay.style.background = isOpen ? '#e8f5e9' : '#fbe9e7';
  statusDisplay.style.color = isOpen ? '#2e7d32' : '#c62828';
  statusDisplay.style.border = `1px solid ${isOpen ? '#81c784' : '#ef9a9a'}`;
};

const renderOrderSummary = () => {
  const orderSummary = document.getElementById('orderSummary');
  const summaryTotal = document.getElementById('summaryTotal');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (!orderSummary || !summaryTotal || !whatsappBtn) return;

  const rows = [...document.querySelectorAll('.menu-items tr')];
  const selectedItems = [];
  let total = 0;

  rows.forEach((row) => {
    const input = row.querySelector('.quantity-control input');
    if (!input) return;

    const quantity = Number.parseInt(input.value, 10) || 0;
    if (quantity <= 0) return;

    const name = row.querySelector('h3')?.textContent?.trim() || 'Menu Item';
    const priceText = row.querySelector('strong')?.textContent || 'R 0.00';
    const price = parseCurrency(priceText);
    const itemTotal = price * quantity;

    total += itemTotal;
    selectedItems.push({
      name,
      quantity,
      itemTotal,
    });
  });

  if (selectedItems.length === 0) {
    orderSummary.innerHTML = '<div class="empty-message">No items selected yet</div>';
    summaryTotal.textContent = 'Total: R 0.00';
    whatsappBtn.disabled = true;
    return;
  }

  orderSummary.innerHTML = selectedItems
    .map(
      (item) => `
        <div class="summary-item">
          <span>${item.quantity} x ${item.name}</span>
          <strong>${formatCurrency(item.itemTotal)}</strong>
        </div>
      `
    )
    .join('');

  summaryTotal.textContent = `Total: ${formatCurrency(total)}`;
  whatsappBtn.disabled = false;
};

const sendOrderToWhatsApp = () => {
  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');
  const customerAddress = document.getElementById('customerAddress');
  const customerNotes = document.getElementById('customerNotes');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (!whatsappBtn) return;

  if (!validateCustomerDetails()) {
    return;
  }

  const rows = [...document.querySelectorAll('.menu-items tr')];
  const selectedItems = rows
    .map((row) => {
      const input = row.querySelector('.quantity-control input');
      if (!input) return null;

      const quantity = Number.parseInt(input.value, 10) || 0;
      if (quantity <= 0) return null;

      const name = row.querySelector('h3')?.textContent?.trim() || 'Menu Item';
      const priceText = row.querySelector('strong')?.textContent || 'R 0.00';
      const price = parseCurrency(priceText);

      return `${quantity} x ${name} @ ${formatCurrency(price)}`;
    })
    .filter(Boolean);

  if (selectedItems.length === 0) {
    alert('Please select at least one item before placing your order.');
    return;
  }

  const customer = customerName?.value.trim() || 'Customer';
  const phone = customerPhone?.value.trim() || 'Not Provided';
  const address = customerAddress?.value.trim() || 'No delivery address provided';
  const notes = customerNotes?.value.trim() || 'No special notes';

  const whatsappMessage = [
    `Hello Mr Kotalicious, my name is ${customer}.`,
    `Phone: ${phone}`,
    `Delivery address: ${address}`,
    `Order: ${selectedItems.join('; ')}`,
    `Special notes: ${notes}`,
  ].join('\n');

  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/27787882985?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

const setupQuantityControls = () => {
  const controls = document.querySelectorAll('.quantity-control');

  controls.forEach((control) => {
    const minusButton = control.querySelector('button:nth-child(1)');
    const plusButton = control.querySelector('button:nth-child(3)');
    const input = control.querySelector('input');

    if (!minusButton || !plusButton || !input) return;

    const updateValue = (newValue) => {
      const safeValue = Math.max(0, Number.parseInt(newValue, 10) || 0);
      input.value = String(safeValue);
      renderOrderSummary();
    };

    minusButton.addEventListener('click', () => {
      updateValue(Number.parseInt(input.value, 10) - 1);
    });

    plusButton.addEventListener('click', () => {
      updateValue(Number.parseInt(input.value, 10) + 1);
    });

    input.addEventListener('input', () => {
      updateValue(input.value);
    });
  });
};

const updateFooterYear = () => {
  document.querySelectorAll('footer p').forEach((footerText) => {
    if (footerText.textContent.includes('2026')) {
      footerText.innerHTML = footerText.innerHTML.replace('2026', new Date().getFullYear());
    }
  });
};

const highlightCurrentPage = () => {
  const currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || 'home.html').toLowerCase();

  document.querySelectorAll('.site-header nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (decodeURIComponent(href).toLowerCase() === currentPage) {
      link.classList.add('active-link');
      link.setAttribute('aria-current', 'page');
    }
  });
};

const setupSearchBar = () => {
  const searchInput = document.getElementById('siteSearch');
  if (!searchInput) return;

  const searchMap = {
    home: 'home.html',
    homepage: 'home.html',
    index: 'home.html',
    menu: 'menu.html',
    foods: 'menu.html',
    food: 'menu.html',
    prices: 'order.html',
    price: 'order.html',
    cost: 'order.html',
    order: 'order.html',
    buy: 'order.html',
    checkout: 'order.html',
    about: 'about.html',
    ourstory: 'about.html',
    story: 'about.html',
    company: 'about.html',
    social: 'social-media.html',
    media: 'social-media.html',
    review: 'social-media.html',
    reviews: 'social-media.html',
    facebook: 'social-media.html',
    tiktok: 'social-media.html',
    location: 'find-us.html',
    find: 'find-us.html',
    findus: 'find-us.html',
    address: 'find-us.html',
    map: 'find-us.html',
    contact: 'find-us.html',
    email: 'find-us.html',
    phone: 'find-us.html',
    whatsapp: 'find-us.html',
    call: 'find-us.html',
    whatsappnumber: 'find-us.html'
  };

  const defaultSuggestions = [
    { label: 'Menu', page: 'menu.html' },
    { label: 'Order', page: 'order.html' },
    { label: 'Prices', page: 'order.html' },
    { label: 'Location', page: 'find-us.html' },
    { label: 'Find Us', page: 'find-us.html' },
    { label: 'About', page: 'about.html' },
    { label: 'Social Media', page: 'social-media.html' },
    { label: 'Phone', page: 'find-us.html' },
    { label: 'Email', page: 'find-us.html' },
    { label: 'WhatsApp', page: 'find-us.html' }
  ];

  const searchWrapper = searchInput.closest('.site-search');
  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'site-search-suggestions';
  suggestionBox.setAttribute('aria-live', 'polite');
  if (searchWrapper) {
    searchWrapper.appendChild(suggestionBox);
  }

  const renderSuggestions = (query = '') => {
    const normalized = query.trim().toLowerCase();
    const items = normalized
      ? defaultSuggestions.filter((item) => item.label.toLowerCase().includes(normalized))
      : defaultSuggestions;

    suggestionBox.innerHTML = items
      .map(
        (item) => `<button type="button" class="search-suggestion-item" data-page="${item.page}">${item.label}</button>`
      )
      .join('');

    suggestionBox.style.display = document.activeElement === searchInput && items.length ? 'flex' : 'none';

    suggestionBox.querySelectorAll('.search-suggestion-item').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = button.dataset.page;
      });
    });
  };

  const handleSearch = (rawText) => {
    const keyword = rawText.trim().toLowerCase();
    if (!keyword) {
      renderSuggestions('');
      return;
    }

    const directPage = searchMap[keyword] || Object.keys(searchMap).find((key) => keyword.includes(key));

    if (directPage) {
      window.location.href = searchMap[directPage] || directPage;
      return;
    }

    const matchPage = Object.keys(searchMap).find((key) => key.includes(keyword) || keyword.includes(key));
    if (matchPage) {
      window.location.href = searchMap[matchPage];
      return;
    }

    const content = document.querySelector('main');
    if (!content) return;

    const searchableTargets = [...content.querySelectorAll('section, div, p, li, h1, h2, h3, a, span')];
    let found = false;

    searchableTargets.forEach((element) => {
      const text = (element.textContent || '').toLowerCase();
      if (element.closest('.site-search') || element.closest('nav') || element.closest('header')) {
        return;
      }

      const matches = text.includes(keyword);
      element.style.display = matches ? '' : 'none';
      if (matches) found = true;
    });

    const noResults = document.getElementById('searchNoResults');
    if (noResults) noResults.remove();

    if (!found) {
      const message = document.createElement('p');
      message.id = 'searchNoResults';
      message.textContent = 'No matching results found for your keyword.';
      message.style.color = '#d84315';
      message.style.fontWeight = '700';
      message.style.marginTop = '16px';
      message.style.textAlign = 'center';
      content.appendChild(message);
    }

    suggestionBox.style.display = 'none';
  };

  searchInput.addEventListener('focus', () => renderSuggestions(searchInput.value));
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    renderSuggestions(query);

    if (!query.trim()) {
      suggestionBox.style.display = document.activeElement === searchInput ? 'flex' : 'none';
      return;
    }

    const directPage = searchMap[query.trim().toLowerCase()] || Object.keys(searchMap).find((key) => query.trim().toLowerCase().includes(key) || key.includes(query.trim().toLowerCase()));
    if (directPage) {
      suggestionBox.style.display = document.activeElement === searchInput ? 'flex' : 'none';
      return;
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement !== searchInput) {
        suggestionBox.style.display = 'none';
      }
    }, 120);
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchInput.value);
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchWrapper?.contains(event.target)) {
      suggestionBox.style.display = 'none';
    }
  });

  renderSuggestions('');
};

const setupMenuLightbox = () => {
  const lightbox = document.getElementById('menuLightbox');
  const lightboxImage = document.getElementById('menuLightboxImage');
  const closeButton = document.querySelector('.menu-lightbox-close');
  const prevButton = document.querySelector('.menu-lightbox-arrow.prev');
  const nextButton = document.querySelector('.menu-lightbox-arrow.next');
  const galleryItems = document.querySelectorAll('.menu-card, .social-gallery-item');

  if (!lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton || galleryItems.length === 0) {
    return;
  }

  let currentGallery = [];
  let currentIndex = 0;
  let touchStartX = 0;

  const updateImage = () => {
    if (!currentGallery.length) return;
    lightboxImage.src = currentGallery[currentIndex];
    lightboxImage.alt = `Menu image ${currentIndex + 1}`;
  };

  const openLightbox = (card) => {
    try {
      const gallery = JSON.parse(card.dataset.gallery || '[]');
      if (!Array.isArray(gallery) || gallery.length === 0) return;

      currentGallery = gallery;
      currentIndex = 0;
      updateImage();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Unable to open menu gallery:', error);
    }
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((card) => {
    const openCard = () => openLightbox(card);

    card.addEventListener('click', openCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCard();
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  prevButton.addEventListener('click', () => {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateImage();
  });

  nextButton.addEventListener('click', () => {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateImage();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      prevButton.click();
    }

    if (event.key === 'ArrowRight') {
      nextButton.click();
    }
  });

  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 50) return;

    if (distance < 0) {
      nextButton.click();
    } else {
      prevButton.click();
    }
  }, { passive: true });
};

document.addEventListener('DOMContentLoaded', () => {
  updateFooterYear();
  highlightCurrentPage();
  updateOpenStatus();
  setupSearchBar();
  setupQuantityControls();
  setupMenuLightbox();
  renderOrderSummary();

  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (customerName) {
    customerName.addEventListener('blur', validateCustomerDetails);
  }

  if (customerPhone) {
    customerPhone.addEventListener('blur', validateCustomerDetails);
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', sendOrderToWhatsApp);
    whatsappBtn.disabled = true;
  }
});
