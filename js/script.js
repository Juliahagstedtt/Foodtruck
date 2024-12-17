import { fetchMenu, placeOrder, fetchReceipt } from './api.js';


const menuContainer = document.querySelector("#menu-container");
const wonton = "wonton";
const drink = "drink";
const dip = "dip";
let lastOrderData = null;

let cart = [];

// Hämta och visa meny när sidan är klar
document.addEventListener("DOMContentLoaded", () => {
    // Hämta och visa meny
    fetchMenu().then(menuItems => {
        displayMenu(menuItems);
    });

    // Lägg till event listeners för navigering
    document.querySelector(".cart-bag-button").addEventListener("click", () => {
        switchView('cart-container');  
    });

    document.querySelector("#to-new-order-button").addEventListener("click", () => {
        switchView('menu'); 
    });

    document.querySelector("#to-order-button").addEventListener("click", submitOrder);
    document.querySelector(".eta-button").addEventListener("click", showReceipt);
    document.querySelector("#to-new-order-button-eta").addEventListener("click", () => {
        switchView('menu'); 
    });

    document.querySelectorAll("[data-view]").forEach(button => {
        button.addEventListener("click", (event) => {
            const targetView = event.target.getAttribute("data-view");
            switchView(targetView);
        });
    });

    showView("menu");  
});

// Visa rätt vy baserat på ID
function switchView(viewId) {
    const views = document.querySelectorAll(".view");
    views.forEach(view => {
        view.classList.remove("active");
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add("active");
    }
}

// Visa menyn
function displayMenu(menuItems) {
    const menuContainer = document.getElementById("menu-items");
    menuItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("menu-item");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p class="price">${item.price} SEK</p>
        `;
        itemElement.addEventListener('click', () => addToCart(item));  // Lägg till varan i varukorgen
        menuContainer.appendChild(itemElement);
    });
}

// Lägg till vara i varukorgen
function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    renderCart();
}

// Uppdatera varukorg
function renderCart() {
    const cartContainer = document.querySelector(".cart-items");
    cartContainer.innerHTML = "";

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Pris: ${item.price} SEK</p>
        `;
        cartContainer.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector(".total").textContent = `${total} SEK`;
}

// Skicka beställning
async function submitOrder() {
    const result = await placeOrder(cart);
    if (result) {
        console.log("Beställningen skickades:", result);
        showEta(result.eta); 
    }
}

// Visa ETA
function showEta(eta) {
    const etaContainer = document.querySelector(".eta");
    etaContainer.innerHTML = `<p>Beräknad leveranstid: ${eta}</p>`;
}

// Visa kvitto
async function showReceipt() {
    const orderId = "1234";  // Detta skulle vara dynamiskt baserat på beställningen
    const receipt = await fetchReceipt(orderId);
    if (receipt) {
        displayReceipt(receipt);
    }
}

// Visa kvitto på skärmen
function displayReceipt(receipt) {
    const receiptContainer = document.querySelector("#receipt-details");
    receiptContainer.innerHTML = `
        <h3>Ordernummer: ${receipt.orderNumber}</h3>
        <p>Totalt: ${receipt.totalPrice} SEK</p>
        <p>Leveransadress: ${receipt.deliveryAddress}</p>
    `;
    document.getElementById("receipt").classList.remove("hidden");
}

function showView(viewId) {
    const views = document.querySelectorAll('.view');
    
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
    }
}

showView('menu');