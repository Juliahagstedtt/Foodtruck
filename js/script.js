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
        switchView('menu');  // Byt till varukorgsvy
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

        // Skapa en container för menyinnehållet
        const menuContent = document.createElement("div");
        menuContent.classList.add("menu-content");

        // Lägg till namn på produkt i h4
        const nameElement = document.createElement("h4");
        nameElement.classList.add("item-name");
        nameElement.innerText = item.name;

        // Lägg till pris på produkt i SEK
        const priceElement = document.createElement("span");
        priceElement.classList.add("item-price");
        priceElement.innerText = `${item.price} SEK`; // Lägg till SEK här direkt

        // Lägg till namn och pris i samma container
        menuContent.appendChild(nameElement);
        menuContent.appendChild(priceElement);

        // Skapa en pricksprickad linje mellan namn och ingredienser
        const dottedDivider = document.createElement("div");
        dottedDivider.classList.add("dotted-divider");

        // Lägg till ingredienser om de finns
        const ingredientsElement = document.createElement("span");
        ingredientsElement.classList.add("ingredients");
        ingredientsElement.innerText = (item.ingredients || []).join(", "); // Hanterar ingredienser

        // Lägg till alla delar av menyobjektet i knappen
        menuItem.appendChild(menuContent);
        menuItem.appendChild(dottedDivider);
        menuItem.appendChild(ingredientsElement);

        // Lägg till menyobjektet i menyn
        menuContainer.appendChild(menuItem);

        // Lägg till eventlyssnare för att lägga till varan i varukorgen
        menuItem.addEventListener("click", () => addToCart(item));
    });
}

async function loadMenu() {
    console.log("Laddar menyn...");  // Kontrollera om loadMenu körs
    const foodType = 'food';  // Ersätt med (dryck, dippsås etc.)
    await fetchMenuItems('wonton');
    await fetchMenuItems('dip');
    await fetchMenuItems('drink');
    handleMenuButtons();
}



function createMenuSides(items) {
    items.forEach((item) => {
        const menuSidesItem = document.createElement("button");
        menuSidesItem.classList.add("menu-sides-item");
        menuSidesItem.innerText = item.name;
        menuSidesItem.setAttribute("data-price", item.price);
        menuSidesItem.setAttribute("data-id", item.id);

        menuSidesItem.addEventListener("click", () => addToCart(item));  

        const menuSidesSelection = document.querySelector(`.menusides-selections[data-type="${item.type}"]`);
        if (menuSidesSelection) {
            menuSidesSelection.appendChild(menuSidesItem);
        }
    });

    const dipItem = items.find(item => item.type === "dip");
    const drinkItem = items.find(item => item.type === "drink");

    if (dipItem) {
        const dipPriceElement = document.querySelector(".dip-price");
        dipPriceElement.innerText = `${dipItem.price} SEK`;
    }

    if (drinkItem) {
        const drinkPriceElement = document.querySelector(".drink-price");
        drinkPriceElement.innerText = `${drinkItem.price} SEK`;
    }
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
    cartContainer.innerHTML = "";

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <div>${item.ingredients}</div>
            <p>Pris: ${item.price.toFixed(2)} SEK</p>
        `;
        cartContainer.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector(".total").textContent = `${total.toFixed(2)} SEK`;
}

// Skicka beställningen
async function submitOrder() {
    try {
        const result = await placeOrder(cart);
        if (result) {
            console.log("Beställningen skickades:", result);
            showEta(result.eta);
        }
    } catch (error) {
        console.error("Beställningen misslyckades:", error);
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
        switchView('receipt');  // Byt till kvittosidan
    }
}

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




