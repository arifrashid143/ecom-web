// GLOBALS
let allProducts = [];

// cart key per user
function getCartKey() {
  const user = localStorage.getItem("loggedInUser");
  return user ? `cart_${user}` : "cart_guest";
}

// migrate old cart to user cart
function migrateCart() {
  const oldCart = JSON.parse(localStorage.getItem("cart"));
  if (oldCart && oldCart.length > 0) {
    const key = getCartKey();
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...existing, ...oldCart]));
    localStorage.removeItem("cart");
  }
}

// CART BUBBLE
function updateCartBubble() {

  migrateCart();

  const bubble = document.getElementById("headerCartBubble");
  const mobileBubble = document.getElementById("mobileCartBubble");

  const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (bubble) {
    bubble.textContent = totalItems;
    totalItems > 0 ? bubble.classList.add("show") : bubble.classList.remove("show");
  }

  // if (mobileBubble) {
  //   mobileBubble.textContent = totalItems;
  //   totalItems > 0 ? mobileBubble.classList.add("show") : mobileBubble.classList.remove("show");
  // }
}

updateCartBubble();

// CART DRAWER

document.addEventListener("DOMContentLoaded", function () {

  const headerCartBtn = document.getElementById("headerCartBtn");
  const cartDrawer    = document.getElementById("cartDrawer");
  const closeCartBtn  = document.getElementById("closeCart");

  // Apply drawer styles 
  if (cartDrawer) {
    Object.assign(cartDrawer.style, {
      display:       "none",
      flexDirection: "column",
      position:      "fixed",
      top:           "0",
      right:         "0",
      width:         "420px",
      maxWidth:      "100vw",
      height:        "100vh",
      background:    "#ffffff",
      boxShadow:     "-6px 0 32px rgba(0,0,0,0.18)",
      zIndex:        "99999",
      fontFamily:    "inherit"
    });
  }

  function renderCart() {
    const cartItemsEl = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    if (!cartItemsEl) return;

    // Always migrate first so cart key is correct
    migrateCart();
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];

    // Style header
    const cartHeader = cartDrawer.querySelector(".cart-header");
    if (cartHeader) {
      Object.assign(cartHeader.style, {
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "1.25rem 1.25rem 1rem",
        borderBottom:   "2px solid #f0f0f0",
        position:       "sticky",
        top:            "0",
        background:     "#fff",
        zIndex:         "1"
      });
      const h2 = cartHeader.querySelector("h2");
      if (h2) Object.assign(h2.style, { margin: "0", fontSize: "1.2rem", fontWeight: "700", color: "#111" });

      const closeBtn = cartHeader.querySelector("#closeCart");
      if (closeBtn) {
        Object.assign(closeBtn.style, {
          background: "none", border: "none", fontSize: "1.4rem",
          cursor: "pointer", color: "#555", lineHeight: "1",
          padding: "4px 8px", borderRadius: "6px"
        });
      }
    }

    // Style footer
    const cartFooter = cartDrawer.querySelector(".cart-footer");
    if (cartFooter) {
      Object.assign(cartFooter.style, {
        padding: "1rem 1.25rem", 
        borderTop: "2px solid #f0f0f0",
        position: "sticky", 
        bottom: "0", 
        background: "#fff",
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between", 
        gap: "1rem"
      });
      const totalP = cartFooter.querySelector("p");
      if (totalP) Object.assign(totalP.style, {
         margin: "0", 
         fontSize: "1rem", 
         fontWeight: "700", 
         color: "#111" });
      const checkoutBtn = cartFooter.querySelector(".checkout");
      if (checkoutBtn) {
        Object.assign(checkoutBtn.style, {
          background: "#ff5722",
           color: "#fff", border: "none",
          borderRadius: "10px", 
          padding: "0.65rem 1.4rem",
          fontSize: "0.95rem", 
          fontWeight: "700", 
          cursor: "pointer"
        });
      }
    }

    // Style items container
    Object.assign(cartItemsEl.style, {
      flex: "1", 
      padding: "0.5rem 1.25rem",
       overflowY: "auto"
    });

    // Empty state
    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:60vh;gap:1rem;color:#aaa">
          <span style="font-size:3.5rem">🛒</span>
          <p style="margin:0;font-size:1rem;font-weight:500">Your cart is empty</p>
          <p style="margin:0;font-size:0.85rem">Add some items to get started!</p>
        </div>`;
      if (cartTotalEl) cartTotalEl.textContent = "0.00";
      return;
    }

    // Render items
    let total = 0;
    cartItemsEl.innerHTML = "";

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const row = document.createElement("div");
      Object.assign(row.style, {
        display: "flex", alignItems: "center",
        gap: "0.85rem", padding: "0.85rem 0",
        borderBottom: "1px solid #f3f3f3"
      });

      row.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}"
          style="width:64px;height:64px;object-fit:cover;border-radius:10px;
                 flex-shrink:0;border:1px solid #eee">
        <div style="flex:1;min-width:0">
          <p style="margin:0 0 4px;font-weight:600;font-size:0.875rem;color:#111;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${item.title}
          </p>
          <p style="margin:0;color:#ff5722;font-weight:700;font-size:0.9rem">
            $${(item.price * item.qty).toFixed(2)}
          </p>
          <p style="margin:2px 0 0;color:#aaa;font-size:0.78rem">$${item.price} each</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;
                    gap:0.4rem;flex-shrink:0">
          <button
            class="cart-action-btn"
            data-action="remove"
            data-index="${index}"
            style="background:#fff0f0;border:none;border-radius:6px;
                   width:28px;height:28px;cursor:pointer;color:#e00;
                   font-size:0.95rem;display:flex;align-items:center;justify-content:center">
            ✕
          </button>
          <div style="display:flex;align-items:center;gap:0.3rem;
                      background:#f7f7f7;border-radius:8px;padding:3px 6px">
            <button
              class="cart-action-btn"
              data-action="decrease"
              data-index="${index}"
              style="width:22px;height:22px;border-radius:6px;border:none;
                     background:#fff;cursor:pointer;font-size:1rem;font-weight:700;
                     color:#333;display:flex;align-items:center;justify-content:center;
                     box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              −
            </button>
            <span style="min-width:22px;text-align:center;font-weight:700;
                         font-size:0.875rem;color:#111">${item.qty}</span>
            <button
              class="cart-action-btn"
              data-action="increase"
              data-index="${index}"
              style="width:22px;height:22px;border-radius:6px;border:none;
                     background:#fff;cursor:pointer;font-size:1rem;font-weight:700;
                     color:#333;display:flex;align-items:center;justify-content:center;
                     box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              +
            </button>
          </div>
        </div>`;

      cartItemsEl.appendChild(row);
    });

    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
  }


  if (cartDrawer) {
    cartDrawer.addEventListener("click", function (e) {

      // If close button clicked — close drawer, stop here
      if (e.target.id === "closeCart" || e.target.closest("#closeCart")) {
        cartDrawer.style.display = "none";
        return;
      }

      // If a cart action button clicked — handle it
      const btn = e.target.closest(".cart-action-btn[data-action]");
      if (!btn) return;

      e.stopPropagation(); // don't bubble outside

      const action = btn.dataset.action;
      const index  = parseInt(btn.dataset.index);
      if (isNaN(index)) return;

      let cart = JSON.parse(localStorage.getItem(getCartKey())) || [];

      if (action === "increase") {
        cart[index].qty += 1;
      } else if (action === "decrease") {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) cart.splice(index, 1);
      } else if (action === "remove") {
        cart.splice(index, 1);  //removes item, NOT closes drawer
      }

      localStorage.setItem(getCartKey(), JSON.stringify(cart));
      updateCartBubble();
      renderCart(); // re-render items inside drawer
    });
  }

  function openCartDrawer() {
    renderCart();
    cartDrawer.style.display = "flex";
  }

  if (headerCartBtn) {
    headerCartBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openCartDrawer();
    });
  }

  // Close on outside click only
  document.addEventListener("click", function (e) {
    if (
      cartDrawer &&
      cartDrawer.style.display === "flex" &&
      !cartDrawer.contains(e.target) &&
      headerCartBtn &&
      !headerCartBtn.contains(e.target)
    ) {
      cartDrawer.style.display = "none";
    }
  });

});

// FETCH PRODUCTS
async function fetchProducts() {
  const response = await fetch("https://dummyjson.com/products?limit=200");
  const data = await response.json();
  allProducts = data.products;
  displayProducts(allProducts, "Products For You");
}

fetchProducts();

// DISPLAY PRODUCTS
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
// LOGO
// const logo = document.querySelector(".logo");

// if (logo) {
//   logo.addEventListener("click", function () {

//     displayProducts(allProducts, "Products For You");

//     document
//       .getElementById("products-container")
//       .scrollIntoView({ behavior: "smooth" });

//   });
// }

// CATEGORY FILTER
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
      const filtered = allProducts.filter(
        product => product.category === slug
      );
      displayProducts(filtered, slug);
    }

    const section = document.getElementById("products-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });

  });

});

// SEARCH
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
    document.getElementById("products-container").innerHTML =
      "<h2>No products found</h2>";
    return;
  }

  displayProducts(filtered, "Search Results");

  document
    .getElementById("products-container")
    .scrollIntoView({ behavior: "smooth" });

}

const searchInput = document.getElementById("desktopSearchInput");

if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchProducts();
  });
}

const searchIcon = document.querySelector(".search-icon-left");

if (searchIcon) {
  searchIcon.addEventListener("click", searchProducts);
}

// SEARCH SUGGESTIONS

const suggestionsBox = document.getElementById("suggestions-box");

if (searchInput && suggestionsBox) {

  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();

    // Hide if empty
    if (!value) {
      suggestionsBox.style.display = "none";
      searchInput.classList.remove("rounded-top");
      return;
    }

    // Filter matching products (max 6 suggestions)
    const matches = allProducts.filter(product =>
      product.title.toLowerCase().includes(value) ||
      product.brand?.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value)
    ).slice(0, 6);

    if (matches.length === 0) {
      suggestionsBox.style.display = "none";
      searchInput.classList.remove("rounded-top");
      return;
    }

    // Build suggestions
    suggestionsBox.innerHTML = "";

    matches.forEach(product => {
      const item = document.createElement("div");
      item.classList.add("suggestion-item");
      item.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <div>
          <p style="margin:0;font-size:0.875rem;font-weight:600;color:#111">${product.title}</p>
          <p style="margin:0;font-size:0.75rem;color:#888">${product.category}</p>
        </div>
        <span style="margin-left:auto;font-weight:700;color:#ff5722;font-size:0.875rem">
          $${product.price}
        </span>
      `;

      // Click suggestion → go to product page
      item.addEventListener("click", function () {
        window.location.href = `product.html?id=${product.id}`;
        suggestionsBox.style.display = "none";
        searchInput.classList.remove("rounded-top");
      });

      suggestionsBox.appendChild(item);
    });

    // Show suggestions
    suggestionsBox.style.display = "block";
    searchInput.classList.add("rounded-top");
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = "none";
      searchInput.classList.remove("rounded-top");
    }
  });

  // Hide suggestions on Enter key (search runs normally)
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      suggestionsBox.style.display = "none";
      searchInput.classList.remove("rounded-top");
    }

    // Escape key closes suggestions
    if (e.key === "Escape") {
      suggestionsBox.style.display = "none";
      searchInput.classList.remove("rounded-top");
      searchInput.blur();
    }
  });

}

// PROFILE DROPDOWN
const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

if (profileBtn && dropdown) {

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

}

// AUTH SYSTEM
const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");

const authTitle = document.getElementById("authTitle");
const submitAuth = document.getElementById("submitAuth");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const switchSignup = document.getElementById("switchSignup");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

let authMode = "login";


// OPEN open
if (loginBtn) {
  loginBtn.onclick = () => {
    authMode = "login";
    authTitle.textContent = "Login";
    submitAuth.textContent = "Login";
    authModal.style.display = "flex";
  };
}

if (signupBtn) {
  signupBtn.onclick = () => {
    authMode = "signup";
    authTitle.textContent = "Signup";
    submitAuth.textContent = "Create Account";
    authModal.style.display = "flex";
  };
}

// CLOSE form
if (closeAuth) {
  closeAuth.onclick = () => {
    authModal.style.display = "none";
  };
}


// SWITCH LOGIN / SIGNUP

if (switchSignup) {
  switchSignup.onclick = () => {

    if (authMode === "login") {
      authMode = "signup";
      authTitle.textContent = "Signup";
      submitAuth.textContent = "Create Account";
      switchSignup.textContent = "Login";
    } 
    else {
      authMode = "login";
      authTitle.textContent = "Login";
      submitAuth.textContent = "Login";
      switchSignup.textContent = "Sign up";
    }

  };
}

// SUBMIT LOGIN / SIGNUP

submitAuth.onclick = () => {

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (authMode === "signup") {

    const exists = users.find(u => u.username === username);
    if (exists) {
      alert("User already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    authMode = "login";
    authTitle.textContent  = "Login";
    submitAuth.textContent = "Login";

  } else {

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem("loggedInUser", username);
    alert("Login successful");
    authModal.style.display = "none";

    updateUI();           // updates buttons
    updateCartBubble();   // restores their saved cart count on the bubble

  }

};

// LOGOUT

if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedInUser");
    updateUI();

    // Clear bubble visually — data stays saved under cart_username
    const bubble = document.getElementById("headerCartBubble");
    const mobileBubble = document.getElementById("mobileCartBubble");

    if (bubble) {
      bubble.textContent = "0";
      bubble.classList.remove("show");
    }
    // if (mobileBubble) {
    //   mobileBubble.textContent = "0";
    //   mobileBubble.classList.remove("show");
    // }
  };
}

// UPDATE UI

function updateUI() {

  const user = localStorage.getItem("loggedInUser");

  if (user) {
    loginBtn.style.display  = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "block";

    // Restore cart bubble with logged-in user's cart
    updateCartBubble();

  } else {
    loginBtn.style.display  = "block";
    signupBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }

}