
// ==========================================
// SHOPOHOLICS - SHOPPING WEBSITE
// ==========================================

// Add your business WhatsApp number here later.
// Example format: 923001234567
// Do not include +, spaces or dashes.
const WHATSAPP_NUMBER = "";


// ==========================================
// DEFAULT PRODUCTS
// ==========================================

const defaultProducts = [
    {
        id: 1,
        name: "Fashion Dress",
        price: 2500,
        category: "Clothing",
        image: "https://placehold.co/300x220?text=Dress"
    },
    {
        id: 2,
        name: "Stylish Shoes",
        price: 3500,
        category: "Shoes",
        image: "https://placehold.co/300x220?text=Shoes"
    },
    {
        id: 3,
        name: "Beautiful Handbag",
        price: 2000,
        category: "Bags",
        image: "https://placehold.co/300x220?text=Handbag"
    },
    {
        id: 4,
        name: "Luxury Watch",
        price: 1800,
        category: "Accessories",
        image: "https://placehold.co/300x220?text=Watch"
    },
    {
        id: 5,
        name: "Jewellery Set",
        price: 1500,
        category: "Accessories",
        image: "https://placehold.co/300x220?text=Jewellery"
    },
    {
        id: 6,
        name: "Headphones",
        price: 2200,
        category: "Electronics",
        image: "https://placehold.co/300x220?text=Headphones"
    }
];


// ==========================================
// LOCAL STORAGE
// ==========================================

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let products = loadData("shopoholics-products", defaultProducts);
let cart = loadData("shopoholics-cart", []);
let orders = loadData("shopoholics-orders", []);

let selectedCategory = "All";


// ==========================================
// PRICE FORMAT
// ==========================================

function formatPrice(price) {
    return Number(price).toLocaleString("en-PK");
}


// ==========================================
// HOME PAGE - DISPLAY PRODUCTS
// ==========================================

function renderProducts() {
    const list = document.getElementById("product-list");

    if (!list) return;

    const searchInput = document.getElementById("search");

    const search = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    list.innerHTML = "";

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search) &&
        (
            selectedCategory === "All" ||
            product.category === selectedCategory
        )
    );

    const noProducts = document.getElementById("no-products");

    if (noProducts) {
        noProducts.hidden = filtered.length > 0;
    }

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
        price.textContent =
            "Rs. " + formatPrice(product.price);

        const addButton = document.createElement("button");

        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        // No Wishlist button

        card.append(
            img,
            name,
            category,
            price,
            addButton
        );

        list.appendChild(card);
    });
}


// ==========================================
// SHOPPING CART
// ==========================================

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

    if (list) {

        list.innerHTML = "";

        if (cart.length === 0) {

            list.innerHTML = "<p>Your cart is empty.</p>";

        }

        let total = 0;

        cart.forEach((item, index) => {

            total += Number(item.price);

            const row = document.createElement("div");
            row.className = "cart-item";

            const details = document.createElement("span");

            details.textContent =
                item.name +
                " - Rs. " +
                formatPrice(item.price);

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

        const cartTotal = document.getElementById("cart-total");

        if (cartTotal) {
            cartTotal.textContent = formatPrice(total);
        }
    }

    // Update cart count in navigation

    const count = document.getElementById("nav-count");

    if (count) {
        count.textContent = cart.length;
    }

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}


// ==========================================
// CLEAR CART
// ==========================================

function clearCart() {

    if (cart.length === 0) {
        alert("Your cart is already empty!");
        return;
    }

    if (!confirm("Are you sure you want to clear your cart?")) {
        return;
    }

    cart = [];

    saveData("shopoholics-cart", cart);

    renderCart();

}


// ==========================================
// ORDER DIRECTLY THROUGH WHATSAPP
// ==========================================

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add products first.");

        return;
    }

    if (!WHATSAPP_NUMBER) {

        alert(
            "WhatsApp ordering is not connected yet. " +
            "The business WhatsApp number will be added later."
        );

        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );

    let message =
        "Hello SHOPOHOLICS!\n" +
        "I would like to place an order.\n\n";

    // Group identical products

    const groupedItems = {};

    cart.forEach(item => {

        const key = item.id;

        if (!groupedItems[key]) {

            groupedItems[key] = {
                name: item.name,
                price: Number(item.price),
                quantity: 0
            };

        }

        groupedItems[key].quantity++;

    });

    // Add products to WhatsApp message

    Object.values(groupedItems).forEach(item => {

        const subtotal = item.price * item.quantity;

        message +=
            item.name +
            " x " +
            item.quantity +
            " = Rs. " +
            formatPrice(subtotal) +
            "\n";

    });

    message +=
        "\nTotal Amount: Rs. " +
        formatPrice(total);

    message +=
        "\n\nPlease confirm my order. Thank you!";

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

}


// ==========================================
// ADMIN - ADD AND EDIT PRODUCTS
// ==========================================

function setupAdmin() {

    const form = document.getElementById("product-form");

    if (!form) return;

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const id =
            document.getElementById("edit-id").value;

        const name =
            document.getElementById("product-name").value.trim();

        const price =
            Number(document.getElementById("product-price").value);

        const category =
            document.getElementById("product-category").value;

        const image =
            document.getElementById("product-image").value.trim();

        if (
            !name ||
            !Number.isSafeInteger(price) ||
            price <= 0 ||
            !category ||
            !image
        ) {

            alert("Please enter valid product details.");

            return;
        }

        if (id) {

            const index = products.findIndex(
                p => p.id === Number(id)
            );

            if (index !== -1) {

                products[index] = {
                    id: Number(id),
                    name,
                    price,
                    category,
                    image
                };

            }

            alert("Product updated successfully!");

        } else {

            products.push({

                id: Date.now(),
                name,
                price,
                category,
                image

            });

            alert("Product added successfully!");

        }

        saveData("shopoholics-products", products);

        resetForm();

        refreshWebsite();

    });

    const cancel = document.getElementById("cancel-edit");

    if (cancel) {
        cancel.addEventListener("click", resetForm);
    }

    renderAdminProducts();

}


// ==========================================
// ADMIN - DISPLAY PRODUCTS
// ==========================================

function renderAdminProducts() {

    const list = document.getElementById("admin-products");

    if (!list) return;

    list.innerHTML = "";

    products.forEach(product => {

        const row = document.createElement("div");

        row.className = "admin-product";

        const img = document.createElement("img");

        img.src = product.image;
        img.alt = product.name;

        const details = document.createElement("span");

        details.textContent =
            product.name +
            " | Rs. " +
            formatPrice(product.price);

        const edit = document.createElement("button");

        edit.textContent = "Edit";
        edit.className = "edit-btn";

        edit.addEventListener("click", () => {
            editProduct(product.id);
        });

        const del = document.createElement("button");

        del.textContent = "Delete";
        del.className = "delete-btn";

        del.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        row.append(img, details, edit, del);

        list.appendChild(row);

    });

}


// ==========================================
// ADMIN - EDIT PRODUCT
// ==========================================

function editProduct(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    document.getElementById("edit-id").value = product.id;

    document.getElementById("product-name").value =
        product.name;

    document.getElementById("product-price").value =
        product.price;

    document.getElementById("product-category").value =
        product.category;

    document.getElementById("product-image").value =
        product.image;

    document.getElementById("save-button").textContent =
        "Update Product";

    document.getElementById("cancel-edit").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// ADMIN - DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    products = products.filter(p => p.id !== id);

    cart = cart.filter(item => item.id !== id);

    saveData("shopoholics-products", products);

    saveData("shopoholics-cart", cart);

    refreshWebsite();

    alert("Product deleted successfully!");

}


// ==========================================
// ADMIN - RESET PRODUCT FORM
// ==========================================

function resetForm() {

    const form = document.getElementById("product-form");

    if (!form) return;

    form.reset();

    document.getElementById("edit-id").value = "";

    document.getElementById("save-button").textContent =
        "Add Product";

    document.getElementById("cancel-edit").hidden = true;

}


// ==========================================
// ADMIN - DISPLAY PREVIOUS DEMO ORDERS
// ==========================================

function renderAdminOrders() {

    const list = document.getElementById("admin-orders");

    if (!list) return;

    list.innerHTML = "";

    if (orders.length === 0) {

        list.textContent = "No previous demo orders.";

        return;
    }

    orders.forEach(order => {

        const box = document.createElement("div");

        box.className = "admin-product";

        const details = document.createElement("p");

        details.textContent =
            order.orderNumber +
            " | " +
            order.customer +
            " | Rs. " +
            formatPrice(order.total) +
            " | " +
            order.status +
            " | " +
            order.date;

        const status = document.createElement("button");

        status.textContent = "Mark Completed";

        status.addEventListener("click", () => {

            order.status = "Completed";

            saveData("shopoholics-orders", orders);

            renderAdminOrders();

        });

        box.append(details, status);

        list.appendChild(box);

    });

}


// ==========================================
// SEARCH AND CATEGORY FILTER
// ==========================================

function setupFilters() {

    const search = document.getElementById("search");

    if (search) {

        search.addEventListener("input", renderProducts);

    }

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

}


// ==========================================
// REFRESH WEBSITE
// ==========================================

function refreshWebsite() {

    renderProducts();

    renderCart();

    renderAdminProducts();

    renderAdminOrders();

}


// ==========================================
// START WEBSITE
// ==========================================

refreshWebsite();

setupFilters();

setupAdmin();
