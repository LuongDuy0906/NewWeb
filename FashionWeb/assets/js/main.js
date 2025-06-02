const navMenu = document.getElementById('nav-menu'),
navToggle = document.getElementById('nav-toggle'),
navClose = document.getElementById('nav-close');

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);
  if (index > -1) {
      cart[index].quantity += product.quantity;
  } else {
      cart.push(product);
  }
  saveCart(cart);
  updateCartCount();
  alert('Đã thêm vào giỏ hàng!');
}

// Gán sự kiện cho nút "Add to Cart"
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.cart__btn, .btn--sm');
  if (!btn) return;

  const productEl = btn.closest('.product__item') 
                 || btn.closest('.details__group') 
                 || btn.closest('tr');
  if (!productEl) return;

  const product = {
    id: productEl.dataset.id || Date.now(),
    name: productEl.querySelector('.product__title')?.innerText || productEl.querySelector('td:nth-child(2)')?.innerText || 'No Name',
    price: parseFloat(productEl.querySelector('.new__price')?.innerText.replace(/[^0-9.]/g, '') || productEl.querySelector('td:nth-child(3)')?.innerText?.replace(/[^0-9.]/g, '') || '0'),
    oldPrice: parseFloat(productEl.querySelector('.old__price')?.innerText.replace(/[^0-9.]/g, '') || '0'),
    image: productEl.querySelector('img.default')?.getAttribute('src') || productEl.querySelector('img')?.getAttribute('src') || '',
    imageHover: productEl.querySelector('img.hover')?.getAttribute('src') || '',
    quantity: parseInt(productEl.querySelector('.quantity')?.value || 1)
  };
  console.log(product)
  addToCart(product);
});

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToWishlist(product) {
  let wishlist = getWishlist();
  const exists = wishlist.some(item => item.id === product.id);
  if (!exists) {
      wishlist.push(product);
      saveWishlist(wishlist);
      updateWishlistCount();
      alert('Đã thêm vào yêu thích!');
  } else {
      alert('Sản phẩm đã có trong danh sách yêu thích.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.wishlist__btn');

  buttons.forEach(button => {
      button.addEventListener('click', e => {
          e.preventDefault();
          const productEl = button.closest('.product__item, .details__group, tr');
          const product = {
            id: productEl.dataset.id || Date.now(),
            name: productEl.querySelector('.product__title')?.innerText || 'No Name',
            price: parseFloat(productEl.querySelector('.new__price, .table__price')?.innerText.replace(/[^0-9.]/g, '')) || 0,
            image: productEl.querySelector('img')?.getAttribute('src') || ''
          };
          addToWishlist(product);
      });
  });
});

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.header__action-btn[href*="cart"] .count')
    .forEach(el => el.textContent = count);
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  document.querySelectorAll('.header__action-btn[href*="wishlist"] .count')
    .forEach(el => el.textContent = count);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();
});

function getCompare() {
  return JSON.parse(localStorage.getItem('compare')) || [];
}

function saveCompare(compare) {
  localStorage.setItem('compare', JSON.stringify(compare));
}

function addToCompare(product) {
  let compare = getCompare();
  const exists = compare.some(item => item.id === product.id);
  if (!exists) {
    compare.push(product);
    saveCompare(compare); // cập nhật số lượng
    alert('Đã thêm vào so sánh!');
  } else {
    alert('Sản phẩm đã có trong danh sách so sánh.');
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.compare__btn');
  if (!btn) return;

  const productEl = btn.closest('.product__item, .details__group, tr');
  if (!productEl) return;

  const product = {
    id: productEl.dataset.id || Date.now(),
    name: productEl.querySelector('.product__title')?.innerText || 'No Name',
    price: parseFloat(productEl.querySelector('.new__price, .table__price')?.innerText?.replace(/[^0-9.]/g, '') || '0'),
    image: productEl.querySelector('img')?.getAttribute('src') || ''
  };

  addToCompare(product);
});

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const resultBox = document.getElementById('search-results');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    resultBox.innerHTML = '';
    if (!query) {
      resultBox.style.display = 'none';
      return;
    }

    // Gộp dữ liệu từ localStorage (cart, wishlist, compare)
    const sources = ['cart', 'wishlist', 'compare'];
    const all = sources.flatMap(key => JSON.parse(localStorage.getItem(key)) || []);

    // Lọc trùng theo ID (nếu sản phẩm xuất hiện nhiều nơi)
    const unique = [];
    const ids = new Set();
    for (const p of all) {
      if (!ids.has(p.id)) {
        unique.push(p);
        ids.add(p.id);
      }
    }

    // Lọc theo từ khoá
    const matches = unique.filter(p => p.name.toLowerCase().includes(query));

    if (matches.length === 0) {
      resultBox.style.display = 'none';
      return;
    }

    resultBox.innerHTML = matches.map(p => `
      <a href="details.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
        ${p.name}
      </a>
    `).join('');
    resultBox.style.display = 'block';
  });

  // Ẩn dropdown khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultBox.contains(e.target)) {
      resultBox.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.header__search input.form__input');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `shop.html?query=${encodeURIComponent(query)}`;
      }
    }
  });
});

function imgGallery() {
  const mainImg = document.querySelector('.details__img'),
  smallImg = document.querySelectorAll('.details__small-img');

  smallImg.forEach((img) => {
    img.addEventListener('click', function(){
      mainImg.src = this.src;
    })
  })
}

imgGallery();

var swiperCategories = new Swiper(".categories__container", {
    spaceBetween: 24,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      350: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 224,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
      1400: {
        slidesPerView: 6,
        spaceBetween: 24,
      },
    },
});

var swiperProducts = new Swiper(".new__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1400: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
  },
});

const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[content]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);
      tabContents.forEach((tabContent) => {
        tabContent.classList.remove('active-tab');
      });
      target.classList.add('active-tab');
      tabs.forEach((tab) => {
        tab.classList.remove('active-tab');
      });
      tab.classList.add('active-tab');
    });
  });

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Đăng nhập thành công!');
    window.location.href = 'accounts.html';
  } else {
    alert('Email hoặc mật khẩu không đúng!');
  }
});  