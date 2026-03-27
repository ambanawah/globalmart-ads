// ==================== GLOBALMART - FULL SYSTEM (CART + CHECKOUT + PAYMENT) ====================

(function () {
    "use strict";

    // ==================== CONFIG ====================
    const API_URL = "http://localhost:5000/api/products";

    // ==================== DOM ====================
    const cartSpan = document.getElementById("cartCount");
    const cartBtn = document.getElementById("cartButton");
    const searchInput = document.getElementById("searchInput");
    const categoryCards = document.querySelectorAll(".category-card");
    const productGrid = document.getElementById("productGrid");

    // CART
    const cartModal = document.getElementById("cartModal");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCart = document.getElementById("closeCart");

    // CHECKOUT
    const checkoutModal = document.getElementById("checkoutModal");
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutBtn = document.querySelector(".checkout-btn");
    const payBtn = document.getElementById("payNow");

    // ==================== STATE ====================
    let productsData = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ==================== CART ====================
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getCartCount() {
        return cart.reduce((t, i) => t + i.quantity, 0);
    }

    function renderCartCount() {
        if (cartSpan) cartSpan.innerText = getCartCount();
    }

    function getTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function addToCart(productId) {
        const existing = cart.find(i => i.id === productId);

        if (existing) {
            existing.quantity++;
        } else {
            const product = productsData.find(p => p.id === productId);
            if (!product) return;
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        renderCartCount();
        renderCartUI();
    }

    function removeFromCart(productId) {
        cart = cart.filter(i => i.id !== productId);
        saveCart();
        renderCartUI();
        renderCartCount();
    }

    function changeQty(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartUI();
            renderCartCount();
        }
    }

    // ==================== CART UI ====================
    function renderCartUI() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty">Your cart is empty</p>`;
            cartTotal.innerText = "0 FCFA";
            return;
        }

        cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.image}</span>
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()} FCFA</p>
                    </div>
                </div>

                <div class="cart-controls">
                    <button data-dec="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button data-inc="${item.id}">+</button>
                </div>

                <button data-remove="${item.id}">✕</button>
            `;

            cartItemsContainer.appendChild(div);
        });

        cartTotal.innerText = getTotal().toLocaleString() + " FCFA";

        const totalFinal = document.getElementById("cartTotalFinal");
if (totalFinal) {
    totalFinal.innerText = getTotal().toLocaleString() + " FCFA";
}

        bindCartEvents();
    }

    function bindCartEvents() {
        document.querySelectorAll("[data-inc]").forEach(btn =>
            btn.onclick = () => changeQty(+btn.dataset.inc, 1)
        );

        document.querySelectorAll("[data-dec]").forEach(btn =>
            btn.onclick = () => changeQty(+btn.dataset.dec, -1)
        );

        document.querySelectorAll("[data-remove]").forEach(btn =>
            btn.onclick = () => removeFromCart(+btn.dataset.remove)
        );
    }

    // ==================== CHECKOUT ====================
    function openCheckout() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    cartModal.classList.remove("open");
    checkoutModal.classList.add("open");

    checkoutItems.innerHTML = "";

    cart.forEach(item => {
        checkoutItems.innerHTML += `
            <div class="checkout-item-row">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} FCFA</span>
            </div>
        `;
    });

    checkoutTotal.innerText = getTotal().toLocaleString() + " FCFA";
}

document.querySelectorAll(".pay-method").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".pay-method").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    };
});

    function processPayment() {
        payBtn.innerText = "Processing...";
        payBtn.disabled = true;

        setTimeout(() => {
            alert("✅ Payment successful!");

            cart = [];
            localStorage.removeItem("cart");

            renderCartUI();
            renderCartCount();

            checkoutModal.classList.remove("open");

            payBtn.innerText = "Pay Now";
            payBtn.disabled = false;
        }, 1500);
    }

    // ==================== FETCH ====================
    async function fetchProducts() {
        try {
            showLoader();

            const res = await fetch(API_URL);
            const data = await res.json();

            productsData = data;
            renderProducts(productsData);
        } catch {
            showError();
        }
    }

    // ==================== PRODUCTS ====================
    function renderProducts(products) {
        if (!productGrid) return;

        productGrid.innerHTML = "";

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <div class="product-image">${product.image}</div>
                <h3>${product.name}</h3>
                <p>${product.price.toLocaleString()} FCFA</p>
                <button data-id="${product.id}" class="btn-add">➕ Add</button>
            `;

            productGrid.appendChild(card);
        });

        bindProductButtons();
    }

    function bindProductButtons() {
        document.querySelectorAll(".btn-add").forEach(btn => {
            btn.onclick = () => {
                addToCart(+btn.dataset.id);

                btn.innerText = "✓";
                setTimeout(() => (btn.innerText = "➕ Add"), 800);
            };
        });
    }

    // ==================== SEARCH ====================
    function filterProducts(term) {
        const q = term.toLowerCase();

        renderProducts(productsData.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        ));
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", e =>
            filterProducts(e.target.value)
        );
    }

    // ==================== CATEGORY ====================
    categoryCards.forEach(card => {
        card.onclick = () =>
            filterProducts(card.innerText.toLowerCase());
    });

    // ==================== MODALS ====================
    if (cartBtn && cartModal) {
        cartBtn.onclick = () => cartModal.classList.toggle("open");
    }

    if (closeCart && cartModal) {
        closeCart.onclick = () => cartModal.classList.remove("open");
    }

    if (checkoutBtn) checkoutBtn.onclick = openCheckout;
    if (payBtn) payBtn.onclick = processPayment;

    // ==================== LOADER ====================
    function showLoader() {
        productGrid.innerHTML = `<div class="loader"></div>`;
    }

    function showError() {
        productGrid.innerHTML = `<p>Error loading products</p>`;
    }

    // ==================== INIT ====================
    function init() {
        renderCartCount();
        renderCartUI();
        fetchProducts();

        console.log("🌍 GLOBALMART FULL SYSTEM READY");
    }

    init();

})();