import { fetchMenu, placeOrder, fetchReceipt } from './api.js';

let cart = [];

document.addEventListener("DOMContentLoaded", () => {

    fetchMenu().then(menuItems => {
        createMenu(menuItems);  // Skapa och visa menyn
    });

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

const menuContainer = document.querySelector("#menu-container");


function createMenu(items) {
    items.forEach(item => {
        const menuItem = document.createElement("button");
        menuItem.classList.add("menu-item");
        menuItem.setAttribute("data-price", item.price);
        menuItem.setAttribute("data-id", item.id);

        const menuItemInner = document.createElement("div");
        menuItemInner.classList.add("menu-item-inner");

        const nameElement = document.createElement("span");
        nameElement.classList.add("item-name");
        nameElement.innerText = item.name;

        const dottedDivider = document.createElement("div");
        dottedDivider.classList.add("dotted-divider");

        const priceElement = document.createElement("span");
        priceElement.innerText = `${item.price} SEK`;
        priceElement.classList.add("item-price");

        menuItemInner.appendChild(nameElement);
        menuItemInner.appendChild(dottedDivider);
        menuItemInner.appendChild(priceElement);

        const ingredientsElement = document.createElement("span");
        ingredientsElement.classList.add("ingredients");
        
        if (Array.isArray(item.ingredients)) {
            ingredientsElement.innerText = item.ingredients.join(", ");
        } else {
            ingredientsElement.innerText = ""; 
        }

        menuItem.appendChild(menuItemInner);
        menuItem.appendChild(ingredientsElement);

        menuContainer.appendChild(menuItem);
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
    const orderId = "1234";  
    const receipt = await fetchReceipt(orderId);
    if (receipt) {
        displayReceipt(receipt);
    }
}

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