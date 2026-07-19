// ---------------- PRODUCT DATA ----------------
const products = [
  { id: 1, name: "Anker Soundcore Wireless Headphones", category: "Electronics", price: 150, badge: "BEST SELLER", image: "../images/head-phone.jpg" },
  { id: 2, name: "Redmi Smart Watch", category: "Electronics", price: 250, badge: "NEW", image: "../images/smart_watch.jpg" },
  { id: 3, name: "Argentina National Team Jersey #10", category: "Apparel", price: 85, badge: "", image: "../images/T-shirt.jpg" },
  { id: 4, name: "Minimalist Urban Backpack", category: "Accessories", price: 120, badge: "", image: "../images/shanta.jpg" },
  { id: 5, name: "Dior Sauvage Eau De Parfum", category: "Fragrances", price: 145, badge: "", image: "../images/sauvage.jpg" },
  { id: 6, name: "Logitech G Pro Wireless Gaming Mouse", category: "Electronics", price: 130, badge: "", image: "../images/mouse.jpg" }
];

// ---------------- GLOBAL STATE ----------------
let cart = [];
let activeDiscountRate = 0;

// ---------------- DOM ELEMENTS ----------------
const productsGrid = document.getElementById("products-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const finalPriceEl = document.getElementById("final-price");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");

// ---------------- DYNAMIC SMOOTH SCROLL NAVIGATION ----------------
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.dataset.target;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // إزاحة خفيفة عشان الهيدر الثابت لو موجود
      const offset = 80; 
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  });
});

// أزرار الهيرو الداخليين
document.getElementById("shop-now-btn").addEventListener("click", () => {
  document.getElementById("products-section").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("explore-categories-btn").addEventListener("click", () => {
  document.getElementById("categories-section").scrollIntoView({ behavior: "smooth" });
});

// ديناميكية تمييز الرابط الفعال أثناء السكرول بالماوس
window.addEventListener("scroll", () => {
  let currentSection = "";
  const sections = document.querySelectorAll("main > section, .cart-summary");

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.dataset.target === currentSection) {
      link.classList.add("active");
    }
  });
});

// ---------------- PRODUCTS RENDER ----------------
function renderProducts() {
  productsGrid.innerHTML = products.map(product => {
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
    return `
      <div class="product-card">
        <div class="product-image">
          ${badgeHTML}
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
  }).join("");

  productsGrid.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

// ---------------- CART MANAGEMENT ----------------
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const itemInCart = cart.find(item => item.id === productId);
  if (itemInCart) {
    itemInCart.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartDisplay();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
}

function updateCartDisplay() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  cartCountEl.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-message">Your cart is currently empty. Add products above! 🛒</p>`;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-left">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-qty">x${item.qty}</div>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          <button class="remove-btn" data-id="${item.id}">✕</button>
        </div>
      </div>
    `).join("");

    cartItemsContainer.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
    });
  }

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = subTotal * activeDiscountRate;
  const finalTotal = subTotal - discountAmount;

  cartTotalEl.textContent = `$${subTotal.toFixed(2)}`;
  finalPriceEl.textContent = `$${finalTotal.toFixed(2)}`;
}

// ---------------- PROMO CODE SYSTEM ----------------
document.getElementById("apply-promo-btn").addEventListener("click", () => {
  const userInput = prompt("Enter Promo Code:");
  if (!userInput) return;

  const code = userInput.trim().toUpperCase();
  const currentSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (code === "SAVE10") {
    activeDiscountRate = 0.1;
  } else if (code === "SAVE20") {
    activeDiscountRate = 0.2;
  } else {
    alert("Invalid Promo Code");
    return;
  }

  updateCartDisplay();
});

// ---------------- CONTACT FORM & TOAST ----------------
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill all fields");
    return;
  }

  contactForm.reset();
  toast.classList.remove("hidden");
  void toast.offsetWidth; 
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
});

// ---------------- INITIALIZATION ----------------
renderProducts();
updateCartDisplay();