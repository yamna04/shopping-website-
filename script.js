
// SHOPOHOLICS - SHOPPING WEBSITE

const defaultProducts = [
    {id: 1, name: "Fashion Dress", price: 2500, category: "Clothing", image: "https://placehold.co/300x220?text=Dress"},
    {id: 2, name: "Stylish Shoes", price: 3500, category: "Shoes", image: "https://placehold.co/300x220?text=Shoes"},
    {id: 3, name: "Beautiful Handbag", price: 2000, category: "Bags", image: "https://placehold.co/300x220?text=Handbag"},
    {id: 4, name: "Luxury Watch", price: 1800, category: "Accessories", image: "https://placehold.co/300x220?text=Watch"},
    {id: 5, name: "Jewellery Set", price: 1500, category: "Accessories", image: "https://placehold.co/300x220?text=Jewellery"},
    {id: 6, name: "Headphones", price: 2200, category: "Electronics", image: "https://placehold.co/300x220?text=Headphones"}
];

// Load saved data safely
function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

let products = loadData("shopoholics-products", defaultProducts);
let cart = loadData("shopoholics-cart", []);
let wishlist = loadData("shopoholics-wishlist", []);
let selectedCategory = "All";

// Save data
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Render products
function renderProducts() {
    const list = document.getElementById("product-list");
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(search) &&
            (selectedCategory === "All" ||
             product.category === selectedCategory);
    });

    document.getElementById("no-products").hidden = filtered.length > 0;

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-box";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.onerror = () => {
            img.src = "https://placehold.co/300x220?text=No+Image";
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "Rs. " + product.price.toLocaleString("en-PK");

        const addButton = document.createElement("button");
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", () => addToCart(product.id));

        const wishButton = document.createElement("button");
        wishButton.className = "wishlist-btn";
        const isSaved = wishlist.includes(product.id);
        wishButton.textContent = isSaved ? "♥ Saved" : "♡ Wishlist";
        if (isSaved) wishButton.classList.add("saved");

        wishButton.addEventListener("click", () => toggleWishlist(product.id));

        card.append(img, name, category, price, addButton, wishButton);
        list.appendChild(card);
    });
}

// Wishlist
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    saveData("shopoholics-wishlist", wishlist);
    renderProducts();
    renderWishlist();
}

function renderWishlist() {
    const list = document.getElementById("wishlist-items");
    list.innerHTML = "";

    const savedProducts = products.filter(product =>
        wishlist.includes(product.id)
    );

    document.getElementById("wish-count").textContent = savedProducts.length;

    document.getElementById("empty-wishlist").hidden =
        savedProducts.length > 0;

    savedProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-box";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "Rs. " + product.price.toLocaleString("en-PK");

        const add = document.createElement("button");
        add.textContent = "Add to Cart";
        add.addEventListener("click", () => addToCart(product.id));

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "clear-btn";
        remove.addEventListener("click", () => toggleWishlist(product.id));

        card.append(img, name, price, add, remove);
        list.appendChild(card);
    });
}

// Shopping Cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    cart.push(product);
    saveData("shopoholics-cart", cart);
    renderCart();

    alert(product.name + " added to your cart!");
}

function renderCart() {
    const list = document.getElementById("cart-items");
    list.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("span");
        details.textContent = item.name + " - Rs. " +
            item.price.toLocaleString("en-PK");

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "remove-cart";

        remove.addEventListener("click", () => {
            cart.splice(index, 1);
            saveData("shopoholics-cart", cart);
            renderCart();
        });

        row.append(details, remove);
        list.appendChild(row);
    });

    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("nav-count").textContent = cart.length;
    document.getElementById("cart-total").textContent =
        total.toLocaleString("en-PK");
    document.getElementById("checkout-total").textContent =
        total.toLocaleString("en-PK");
}

function clearCart() {
    cart = [];
    saveData("shopoholics-cart", cart);
    renderCart();
}

// Checkout
function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add products first.");
        return;
    }

    document.getElementById("checkout").scrollIntoView({
        behavior: "smooth"
    });
}

document.getElementById("checkout-form").addEventListener(
    "submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const customer = document.getElementById("customer-name").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();

        if (!customer || !email || !phone || !address) {
            alert("Please complete all customer details.");
            return;
        }

        const orderNumber = "SH" + Date.now().toString().slice(-8);
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        document.getElementById("order-message").textContent =
            "Thank you, " + customer +
            "! Demo order " + orderNumber +
            " created. Total: Rs. " + total.toLocaleString("en-PK") +
            ". No real order has been sent.";

        cart = [];
        saveData("shopoholics-cart", cart);
        renderCart();

        this.reset();
    }
);

// Admin: Add and edit products
document.getElementById("product-form").addEventListener(
    "submit", function(event) {
        event.preventDefault();

        const id = document.getElementById("edit-id").value;
        const name = document.getElementById("product-name").value.trim();
        const price = Number(document.getElementById("product-price").value);
        const category = document.getElementById("product-category").value;
        const image = document.getElementById("product-image").value.trim();

        if (!name || !Number.isSafeInteger(price) || price <= 0 ||
            !category || !image) {
            alert("Please enter valid product details.");
            return;
        }

        if (id) {
            const index = products.findIndex(p => p.id === Number(id));

            if (index !== -1) {
                products[index] = {
                    id: Number(id), name, price, category, image
                };
            }

            alert("Product updated successfully!");
        } else {
            products.push({
                id: Date.now(), name, price, category, image
            });

            alert("Product added successfully!");
        }

        saveData("shopoholics-products", products);
        resetForm();
        refreshWebsite();
    }
);

// Admin product list
function renderAdminProducts() {
    const list = document.getElementById("admin-products");
    list.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("div");
        row.className = "admin-product";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const details = document.createElement("span");
        details.textContent = product.name + " | Rs. " + product.price;

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.className = "edit-btn";
        edit.addEventListener("click", () => editProduct(product.id));

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "delete-btn";
        del.addEventListener("click", () => deleteProduct(product.id));

        row.append(img, details, edit, del);
        list.appendChild(row);
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("edit-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-image").value = product.image;

    document.getElementById("save-button").textContent = "Update Product";
    document.getElementById("cancel-edit").hidden = false;

    document.getElementById("admin").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    products = products.filter(p => p.id !== id);
    wishlist = wishlist.filter(item => item !== id);
    cart = cart.filter(item => item.id !== id);

    saveData("shopoholics-products", products);
    saveData("shopoholics-wishlist", wishlist);
    saveData("shopoholics-cart", cart);

    refreshWebsite();
    alert("Product deleted successfully!");
}

function resetForm() {
    document.getElementById("product-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("save-button").textContent = "Add Product";
    document.getElementById("cancel-edit").hidden = true;
}

document.getElementById("cancel-edit").addEventListener(
    "click", resetForm
);

// Search
document.getElementById("search").addEventListener(
    "input", renderProducts
);

// Category filter
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderProducts();
    });
});

// Refresh all sections
function refreshWebsite() {
    renderProducts();
    renderWishlist();
    renderCart();
    renderAdminProducts();
}

// Start website
refreshWebsite();

    document.getElementById("cart-items").innerHTML = "";

    alert("Your cart has been cleared!");
}
