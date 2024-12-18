import { fetchMenu, placeOrder, fetchReceipt } from './api.js';

// Skapar en tom varukorg för att lagra användarens val av produkter
let cart = [];

document.addEventListener("DOMContentLoaded", () => {

    // Hämtar menyn från servern och skapar menyn på sidan
    fetchMenu().then(menuItems => {
        createMenu(menuItems);  // Skapa och visa menyn
    });

    // När användaren klickar på varukorgsikonen, visa varukorgen
    document.querySelector(".cart-bag-button").addEventListener("click", () => {
        switchView('cart-container');  // Byt till varukorgsvy
    });

    // När användaren klickar på knappen för att skapa en ny beställning, visa menyn
    document.querySelector("#to-new-order-button").addEventListener("click", () => {
        switchView('menu');  // Byt till menyvyn
    });

    // När användaren klickar på knappen för att skicka beställningen
    document.querySelector("#to-order-button").addEventListener("click", submitOrder);

    // När användaren klickar på ETA-knappen (beräknad leveranstid), visa kvittot
    document.querySelector(".eta-button").addEventListener("click", showReceipt);

    // När användaren klickar på knappen för att skapa en ny beställning från ETA-sidan
    document.querySelector("#to-new-order-button-eta").addEventListener("click", () => {
        switchView('menu');  // Byt till menyvyn från ETA
    });

    // Lyssnar på alla knappar som har ett 'data-view' attribut och byter vy baserat på det
    document.querySelectorAll("[data-view]").forEach(button => {
        button.addEventListener("click", (event) => {
            const targetView = event.target.getAttribute("data-view");  // Hämtar målvyn
            switchView(targetView);  // Byt vy till målvyn
        });
    });

    // Visar menyn när sidan först laddas
    showView("menu");  // Visa menyvyn
});

// Funktion för att byta mellan olika vyer på sidan (meny, varukorg, etc.)
function switchView(viewId) {
    const views = document.querySelectorAll(".view");
    views.forEach(view => {
        view.classList.remove("active");  // Tar bort 'active' från alla vyer
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add("active");  // Lägg till 'active' på den vyen som ska visas
    }
}

// Hämtar container för menyn
const menuContainer = document.querySelector("#menu-container");

// Skapar och visar menyn på sidan
function createMenu(items) {
    items.forEach(item => {
        // Skapar en knapp för varje menyobjekt
        const menuItem = document.createElement("button");
        menuItem.classList.add("menu-item");
        menuItem.setAttribute("data-price", item.price);  // Lägg till prisattribut
        menuItem.setAttribute("data-id", item.id);  // Lägg till ID-attribut

        const menuItemInner = document.createElement("div");
        menuItemInner.classList.add("menu-item-inner");

        // Lägg till namn på produkt
        const nameElement = document.createElement("span");
        nameElement.classList.add("item-name");
        nameElement.innerText = item.name;

        // Skapa en pricksprickad linje mellan namn och pris
        const dottedDivider = document.createElement("div");
        dottedDivider.classList.add("dotted-divider");

        // Lägg till pris på produkt
        const priceElement = document.createElement("span");
        priceElement.innerText = `${item.price} SEK`;
        priceElement.classList.add("item-price");

        // Lägg till namn, divider och pris i menyobjektet
        menuItemInner.appendChild(nameElement);
        menuItemInner.appendChild(dottedDivider);
        menuItemInner.appendChild(priceElement);

        // Lägg till ingredienser om de finns
        const ingredientsElement = document.createElement("span");
        ingredientsElement.classList.add("ingredients");

        if (Array.isArray(item.ingredients)) {
            ingredientsElement.innerText = item.ingredients.join(", ");  // Om ingredienser finns, visa dem
        } else {
            ingredientsElement.innerText = "";  // Annars lämna tomt
        }

        // Lägg till alla delar av menyobjektet i knappen
        menuItem.appendChild(menuItemInner);
        menuItem.appendChild(ingredientsElement);

        // Lägg till menyobjektet i menyn
        menuContainer.appendChild(menuItem);
    });
}

// Lägg till objekt i varukorgen
function addToCart(item) {
    // Kollar om varan redan finns i varukorgen
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;  // Om den finns, öka kvantiteten
    } else {
        cart.push({ ...item, quantity: 1 });  // Annars lägg till varan med kvantitet 1
    }
    renderCart();  // Uppdatera varukorgen
}

// Rendera varukorgen
function renderCart() {
    const cartContainer = document.querySelector(".cart-items");
    cartContainer.innerHTML = "";  // Rensa nuvarande innehåll

    // Lägg till varje objekt i varukorgen
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <div>${item.ingredients}</div>
            <p>Pris: ${item.price} SEK</p>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Beräkna totalen av varukorgen
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector(".total").textContent = `${total} SEK`;  // Uppdatera totalen
}

// Skicka beställningen
async function submitOrder() {
    const result = await placeOrder(cart);  // Skickar varukorgen till servern
    if (result) {
        console.log("Beställningen skickades:", result);
        showEta(result.eta);  // Om beställningen lyckades, visa beräknad leveranstid
    }
}

// Visa ETA (beräknad leveranstid)
function showEta(eta) {
    const etaContainer = document.querySelector(".eta");
    etaContainer.innerHTML = `<p>Beräknad leveranstid: ${eta}</p>`;  // Skriv ut leveranstiden
}

// Visa kvitto på beställningen
async function showReceipt() {
    const orderId = "1234";  // Här använder vi ett exempelordernummer (kan vara dynamiskt i verkligheten)
    const receipt = await fetchReceipt(orderId);  // Hämtar kvittot från servern
    if (receipt) {
        displayReceipt(receipt);  // Om kvittot finns, visa det
    }
}

// Visa kvittodetaljer på sidan
function displayReceipt(receipt) {
    const receiptContainer = document.querySelector("#receipt-details");
    receiptContainer.innerHTML = `
        <h3>Ordernummer: ${receipt.orderNumber}</h3>
        <p>Totalt: ${receipt.totalPrice} SEK</p>
        <p>Leveransadress: ${receipt.deliveryAddress}</p>
    `;
    document.getElementById("receipt").classList.remove("hidden");  // Visa kvittodetaljer
}

// Funktion för att visa en viss vy (t.ex. meny, varukorg, kvitto)
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    
    // Tar bort 'active' från alla vyer
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    // Lägg till 'active' på den vyen som ska visas
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
    }
}

// Visar menyn när sidan först laddas
showView('menu');  // Visa menyvyn vid laddning