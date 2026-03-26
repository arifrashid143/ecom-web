// =====================
// GLOBALS
// =====================
let allProducts = [];


// =====================
// CART BUBBLE
// =====================
function updateCartBubble() {
  const bubble = document.getElementById("headerCartBubble");
  const mobileBubble = document.getElementById("mobileCartBubble");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (bubble) {
    bubble.textContent = totalItems;
    totalItems > 0 ? bubble.classList.add("show") : bubble.classList.remove("show");
  }

  if (mobileBubble) {
    mobileBubble.textContent = totalItems;
    totalItems > 0 ? mobileBubble.classList.add("show") : mobileBubble.classList.remove("show");
  }
}


// =====================
// FETCH PRODUCTS
// =====================
async function fetchProducts() {
  const response = await fetch("https://dummyjson.com/products?limit=200");
  const data = await response.json();
  allProducts = data.products;
  displayProducts(allProducts, "Products For You");
}

fetchProducts();


// =====================
// DISPLAY PRODUCTS
// =====================
function displayProducts(products, title) {
  const container = document.getElementById("products-container");
  const sectionTitle = document.getElementById("section-title");

  if (sectionTitle) sectionTitle.textContent = title;

  container.innerHTML = "";

  products.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="product-image">
        <span class="discount">${item.discountPercentage}% OFF</span>
        <img src="${item.thumbnail}" alt="${item.title}">
      </div>
      <div class="product-info">
        <span class="brand">${item.brand || ""}</span>
        <h3>${item.title}</h3>
        <div class="rating">
          <i class="fa-solid fa-star"></i>
          ${item.rating}
        </div>
        <div class="price">
          <span class="new">$${item.price}</span>
          <span class="old">$${(item.price * 1.1).toFixed(2)}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", function () {
      window.location.href = `product.html?id=${item.id}`;
    });

    container.appendChild(card);
  });
}


// =====================
// LOGO — scroll to products
// =====================
const logo = document.querySelector(".logo");
if (logo) {
  logo.addEventListener("click", function () {
    displayProducts(allProducts, "Products For You");
    document.getElementById("products-container").scrollIntoView({ behavior: "smooth" });
  });
}


// =====================
// CATEGORY FILTER
// =====================
const categories = document.querySelectorAll(".cat-nav-item");

categories.forEach(cat => {
  cat.addEventListener("click", (e) => {
    e.preventDefault();

    categories.forEach(c => c.classList.remove("active"));
    cat.classList.add("active");

    const slug = cat.dataset.slug;

    if (slug === "all") {
      displayProducts(allProducts, "All Products");
    } else {
      const filtered = allProducts.filter(product => product.category === slug);
      displayProducts(filtered, slug);
    }

    const section = document.getElementById("products-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });
});


// =====================
// SEARCH
// =====================
function searchProducts() {
  const searchInput = document.getElementById("desktopSearchInput");
  const searchValue = searchInput.value.toLowerCase().trim();

  if (!searchValue) {
    displayProducts(allProducts, "Products For You");
    return;
  }

  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchValue) ||
    product.brand?.toLowerCase().includes(searchValue) ||
    product.category.toLowerCase().includes(searchValue)
  );

  if (filtered.length === 0) {
    document.getElementById("products-container").innerHTML = "<h2>No products found</h2>";
    return;
  }

  displayProducts(filtered, "Search Results");
  document.getElementById("products-container").scrollIntoView({ behavior: "smooth" });
}

// Search on Enter key
const searchInput = document.getElementById("desktopSearchInput");
if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchProducts();
  });
}

// Search on icon click
const searchIcon = document.querySelector(".search-icon-left");
if (searchIcon) {
  searchIcon.addEventListener("click", searchProducts);
}


// =====================
// SEARCH SUGGESTIONS
// =====================
const suggestionsBox = document.getElementById("suggestions-box");

if (searchInput && suggestionsBox) {
  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();

    if (!searchValue) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchValue)
    );

    showSuggestions(filtered);
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = "none";
    }
  });
}

function showSuggestions(products) {
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = "";

  if (products.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  products.slice(0, 6).forEach(product => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <span>${product.title}</span>
    `;
    item.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });
    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = "block";
}


// =====================
// PROFILE DROPDOWN
// =====================
const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

if (profileBtn && dropdown) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}


// =====================
// AUTH MODAL
// =====================
const signupBtn = document.getElementById("signupBtn");
const loginBtn  = document.getElementById("loginBtn");
const modal     = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");

let mode = "login";

if (signupBtn) {
  signupBtn.onclick = () => {
    mode = "signup";
    authTitle.innerText = "Signup";
    modal.style.display = "flex";
  };
}

if (loginBtn) {
  loginBtn.onclick = () => {
    mode = "login";
    authTitle.innerText = "Login";
    modal.style.display = "flex";
  };
}

// Close modal on backdrop click
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Submit login / signup
const submit = document.getElementById("submitAuth");
if (submit) {
  submit.onclick = () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (mode === "signup") {
      if (users.find(u => u.username === username)) {
        alert("User already exists");
        return;
      }
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful");

    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem("loggedInUser", username);
        alert("Login successful");
        updateUI();
        modal.style.display = "none";
      } else {
        alert("Invalid credentials");
      }
    }
  };
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedInUser");
    updateUI();
  };
}

// Update UI based on login state
function updateUI() {
  const user = localStorage.getItem("loggedInUser");

  if (signupBtn) signupBtn.style.display = user ? "none"  : "block";
  if (loginBtn)  loginBtn.style.display  = user ? "none"  : "block";
  if (logoutBtn) logoutBtn.style.display = user ? "block" : "none";
}

updateUI();


// =====================
// CART DRAWER
// =====================
const cartDrawer = document.getElementById("cartDrawer");
const cartBtn    = document.getElementById("headerCartBtn");
const closeCart  = document.getElementById("closeCart");

if (cartBtn) {
  cartBtn.onclick = () => {
    cartDrawer.classList.add("open");
    renderCart();
  };
}

if (closeCart) {
  closeCart.onclick = () => {
    cartDrawer.classList.remove("open");
  };
}

// Render cart items
function renderCart() {
  const cart      = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  const totalEl   = document.getElementById("cartTotal");

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p style='color:#999; text-align:center; margin-top:2rem;'>Your cart is empty</p>";
    if (totalEl) totalEl.innerText = "0.00";
    return;
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="cart-info">
          <p>${item.title}</p>
          <p>$${item.price} x ${item.qty}</p>
        </div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
  });

  if (totalEl) totalEl.innerText = total.toFixed(2);
}

// Remove item from cart
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const id = Number(e.target.dataset.id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartBubble();
  }
});

// Open cart drawer if URL hash is #cart
if (window.location.hash === "#cart" && cartDrawer) {
  cartDrawer.classList.add("open");
  renderCart();
}


// =====================
// INIT
// =====================
updateCartBubble();