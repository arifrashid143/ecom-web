// ===== Load Header =====
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    updateCartBubble();
  });

const link = new URLSearchParams(window.location.search);
const productId = link.get("id");

// ✅ Shared cart key helper — same logic as index.js
function getCartKey() {
  const user = localStorage.getItem("loggedInUser");
  return user ? `cart_${user}` : "cart_guest";
}

// ✅ Fixed updateCartBubble — reads correct key
function updateCartBubble() {
  const cart  = JSON.parse(localStorage.getItem(getCartKey())) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const bubble = document.getElementById("headerCartBubble");
  if (bubble) bubble.innerText = total;
}

async function loadProduct() {

  const res     = await fetch(`https://dummyjson.com/products/${productId}`);
  const product = await res.json();

  const container = document.getElementById("product-details");

  container.innerHTML = `
    <div class="product-card">
      <div class="product-images">
        <img class="main-img" src="${product.thumbnail}">
        <div class="thumbs">
          ${product.images.map(img => `<img src="${img}" class="thumb">`).join("")}
        </div>
      </div>
      <div class="product-info">
        <h2>${product.brand}</h2>
        <h1>${product.title}</h1>
        <div class="price-box">
          <span>$${product.price}</span>
        </div>
        <p>${product.description}</p>
        <div class="buy-section">
          <div class="qty">
            <button id="minus">-</button>
            <span id="qty">1</span>
            <button id="plus">+</button>
          </div>
          <button class="buy">Buy Now</button>
          <button class="cart">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  let qty = 1;

  const qtyDisplay = document.getElementById("qty");
  const plus       = document.getElementById("plus");
  const minus      = document.getElementById("minus");

  plus.onclick = () => {
    qty++;
    qtyDisplay.innerText = qty;
  };

  minus.onclick = () => {
    if (qty > 1) {
      qty--;
      qtyDisplay.innerText = qty;
    }
  };

  // ✅ Fixed: cartBtn now properly selected
  const cartBtn = document.querySelector(".cart");

  cartBtn.onclick = () => {
    const key  = getCartKey();
    let cart   = JSON.parse(localStorage.getItem(key)) || [];

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id:        product.id,
        title:     product.title,
        price:     product.price,
        thumbnail: product.thumbnail,
        qty:       qty
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    updateCartBubble();
    alert("Added to cart!");
  };

  // ✅ Fixed: buyBtn now saves to correct key too
  const buyBtn = document.querySelector(".buy");

  buyBtn.onclick = () => {
    const key = getCartKey();
    let cart  = JSON.parse(localStorage.getItem(key)) || [];

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id:        product.id,
        title:     product.title,
        price:     product.price,
        thumbnail: product.thumbnail,
        qty:       qty
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    window.location.href = "index.html";
  };

}

loadProduct();