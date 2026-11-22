
let cartCount = 0;
let cartTotal = 0;

function addToCart(name, price) {

    cartCount++;
    cartTotal += price;

    document.getElementById("cart-count").innerText = cartCount;

    document.getElementById("cart-total").innerText = cartTotal;

    let item = document.createElement("li");

    item.innerText = name + " - Rs. " + price;

    document.getElementById("cart-items").appendChild(item);

    alert(name + " added to your cart!");
}

function clearCart() {

    cartCount = 0;
    cartTotal = 0;

    document.getElementById("cart-count").innerText = 0;

    document.getElementById("cart-total").innerText = 0;

    document.getElementById("cart-items").innerHTML = "";

    alert("Your cart has been cleared!");
}
