const navMenu = document.getElementById('nav-menu'),
navToggle = document.getElementById('nav-toggle'),
navClose = document.getElementById('nav-close');

document.addEventListener('DOMContentLoaded', () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Nếu chưa có admin thì thêm mặc định
  const hasAdmin = users.some(u => u.email === 'admin@example.com');
  if (!hasAdmin) {
    users.push({
      id: 'a1',
      name: 'Quản trị viên',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
});


function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCartById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return alert("Không tìm thấy sản phẩm!");

  let cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("Đã thêm vào giỏ hàng!");
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToWishlistById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return alert("Không tìm thấy sản phẩm!");

  let wishlist = getWishlist();
  if (!wishlist.some(p => p.id === id)) {
    wishlist.push(product);
    saveWishlist(wishlist);
    updateWishlistCount();
    alert("Đã thêm vào yêu thích!");
  } else {
    alert("Sản phẩm đã có trong danh sách yêu thích.");
  }
}

function getCompare() {
  return JSON.parse(localStorage.getItem('compare')) || [];
}

function saveCompare(compare) {
  localStorage.setItem('compare', JSON.stringify(compare));
}

function addToCompareById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return alert("Không tìm thấy sản phẩm!");

  let compare = getCompare();
  if (!compare.some(p => p.id === id)) {
    compare.push(product);
    saveCompare(compare);
    updateCompareCount();
    alert("Đã thêm vào so sánh!");
  } else {
    alert("Sản phẩm đã có trong danh sách so sánh.");
  }
}

// Đếm và cập nhật hiển thị số lượng
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  document.querySelectorAll('.header__action-btn[href*="cart"] .count')
    .forEach(el => el.textContent = count);
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  document.querySelectorAll('.header__action-btn[href*="wishlist"] .count')
    .forEach(el => el.textContent = wishlist.length);
}

function updateCompareCount() {
  const compare = getCompare();
  document.querySelectorAll('.header__action-btn[href*="compare"] .count')
    .forEach(el => el.textContent = compare.length);
}

// Gán sự kiện chung
document.addEventListener('click', (e) => {
  const cartBtn = e.target.closest('.cart__btn, .btn--sm');
  const wishBtn = e.target.closest('.wishlist__btn');
  const compareBtn = e.target.closest('.compare__btn');

  if (cartBtn) {
    e.preventDefault();
    addToCartById(cartBtn.dataset.id);
  } else if (wishBtn) {
    e.preventDefault();
    addToWishlistById(wishBtn.dataset.id);
  } else if (compareBtn) {
    e.preventDefault();
    addToCompareById(compareBtn.dataset.id);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();
  updateCompareCount();

  const searchInput = document.querySelector('.header__search input.form__input');
  const searchBox = document.getElementById('search-results');

  if (searchInput && searchBox) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      searchBox.innerHTML = '';
      if (!query) return searchBox.style.display = 'none';

      const matches = products.filter(p => p.name.toLowerCase().includes(query));
      if (matches.length === 0) return searchBox.style.display = 'none';

      searchBox.innerHTML = matches.map(p => `
        <a href="details.html?id=\${p.id}">
          <img src="${p.image}" width="30" style="margin-right:8px;">
          ${p.name}
        </a>
      `).join('');
      searchBox.style.display = 'block';
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) window.location.href = 'shop.html?query=' + encodeURIComponent(q);
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchBox.contains(e.target)) {
        searchBox.style.display = 'none';
      }
    });
  }
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

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
  
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
  
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
  
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Đăng nhập thành công!');
  
        if (user.role === 'admin') {
          window.location.href = 'admin-home.html';
        } else {
          window.location.href = 'accounts.html';
        }
      } else {
        alert('Email hoặc mật khẩu không đúng!');
      }
    });
  });
  

document.addEventListener('DOMContentLoaded', () => {
  const loginInfo = document.getElementById('login-info');
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (user && loginInfo) {
    loginInfo.textContent = user.name;
    loginInfo.href = user.role === 'admin' ? 'admin.html' : 'accounts.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirm = document.getElementById('register-confirm').value.trim();

    if (!name || !email || !password || !confirm) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirm) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(u => u.email === email)) {
      alert('Email đã được sử dụng!');
      return;
    }

    const newUser = {
      id: 'u' + Date.now(),
      name,
      email,
      password,
      role: 'user'
    };

    users.push(newUser);
    console.log(newUser)
    console.log(users)
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    console.log(newUser)
    alert('Đăng ký thành công!');
    window.location.href = 'accounts.html';
  });
});
