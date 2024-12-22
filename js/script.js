import { fetchMenu } from './api.js';

let cart = []; // Varukorgsvariabel som lagrar alla valda produkter
let orderId = `#${Date.now()}`; // Skapa ett unikt order-ID baserat på den aktuella tiden

const tenant = {
    id: "ef3up", // Identifierar användaren eller hyresgästen
    name: "Julia" // Namnet på hyresgästen
};

const sauceButton = document.querySelector(".sauce-buttons"); // Hämtar elementet för såsknapparna
const drinksButton = document.querySelector(".drinks-buttons"); // Hämtar elementet för dryckesknapparna

// Lägg till varor i kundvagnen
function addToCart({ type, name, price }) {
    console.log(`Lägger till i kundvagnen: ${name}, Typ: ${type}, Pris: ${price} SEK`);

    // Kontrollera om produkten redan finns i kundvagnen
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;  // Om produkten finns, öka mängden
    } else {
        cart.push({ type, name, price, quantity: 1 }); // Lägg till ny produkt i varukorgen
    }

    // Uppdatera localStorage med den aktuella varukorgen
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI(); // Uppdatera varukorgens gränssnitt
    updateCartBadge(); // Uppdatera varukorgens ikon med antal varor
}

// Uppdatera användargränssnittet för varukorgen
function updateCartUI() {
    const cartContainer = document.getElementById("cart-container"); // Hämtar elementet för varukorgens innehåll
    const totalText = document.querySelector(".total-text"); // Hämtar elementet för att visa totalbeloppet

    cartContainer.innerHTML = "";  // Töm varukorgen
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item"); // Lägg till CSS-klass för varje varukorgsprodukt
        cartItem.innerHTML = `  
            <p>${item.name}</p>
            <span class="dot-line"></span>
            <p>${item.price} SEK</p>
            <button class="increase" data-name="${item.name}">+</button>
            <p>&nbsp;${item.quantity}&nbsp;&nbsp;stycken</p>
            <button class="decrease" data-name="${item.name}">-</button>
        `;

        cartContainer.appendChild(cartItem); // Lägg till produktens HTML i varukorgen
    });

    // Uppdatera totalpris för varukorgen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); 
    totalText.innerText = `TOTALT: ${totalPrice} SEK`;

    // Lägg till eventlyssnare på knapparna för att öka eller minska mängden
    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, 1)); // Öka mängden på produkt
    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, -1)); // Minska mängden på produkt
    });

    // Uppdatera ETA-tid när varukorgen ändras
    updateEtaTime();
}

// Funktion för att ändra kvantiteten av en vara
function changeQuantity(button, change) {
    const itemName = button.getAttribute("data-name"); // Hämta namnet på produkten från knappen
    const item = cart.find(item => item.name === itemName); // Hitta produkten i varukorgen
    
    if (item) {
        item.quantity += change; // Ändra kvantiteten

        // Om mängden blir 0 eller mindre, ta bort varan från varukorgen
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== itemName); // Ta bort produkten från varukorgen
        }

        // Uppdatera localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Uppdatera varukorgens UI och badge (antal artiklar)
        updateCartUI();
        updateCartBadge();
    }
}

// Uppdatera antalet varor i kundvagnen (det lilla numret bredvid varukorgsikonen)
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Beräkna total antal artiklar i varukorgen
    document.querySelector(".total-items").innerText = totalItems; // Uppdatera badge med total antal artiklar
}

// Ladda varukorgen från localStorage om den finns
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart); // Återställ varukorgen från localStorage
    }
}

async function renderMenu() {
    const menuContainer = document.getElementById("menu-container"); // Hämta elementet där menyn ska renderas
    const menu = await fetchMenu(); // Hämta menyn via API

    if (menu.length > 0) {
        // Filtrera bort "wonton" produkter och dip/drink från huvudmenyn
        const filteredMenu = menu.filter(item => !item.name.toLowerCase().includes('wonton') && item.category !== 'drink' && item.category !== 'dip');

        menuContainer.innerHTML = ''; // Töm menyn

        if (filteredMenu.length === 0) {
            menuContainer.innerHTML = '<p>Inga produkter tillgängliga.</p>'; // Visa meddelande om ingen produkt finns
        } else {
            filteredMenu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item'); // Lägg till CSS-klass för varje menyprodukt
                
                // Skapa en knapp som omsluter hela menyraden
                const itemButton = document.createElement('button');
                itemButton.classList.add('menu-item-button');
                itemButton.setAttribute('data-name', item.name); // Lägg till produktens namn som data-attribut
                itemButton.setAttribute('data-price', item.price); // Lägg till produktens pris som data-attribut

                itemButton.innerHTML = `  
                    <div class="menu-item-content">
                        <h3 class="item-name">${item.name}</h3>
                        <span class="dot-line"></span>
                        <p class="item-price">${item.price ? item.price + ' SEK' : 'Pris ej tillgängligt'}</p>
                    </div>
                    ${item.ingredients ? `<p class="ingredients">${item.ingredients.join(', ')}</p>` : ''} <!-- Visa ingredienser om tillgängliga -->
                `;

                // Lägg till eventlyssnare för att lägga till varor i kundvagnen
                itemButton.addEventListener("click", () => {
                    const name = itemButton.getAttribute('data-name');
                    const price = parseFloat(itemButton.getAttribute('data-price'));

                    if (!isNaN(price)) {
                        addToCart({ type: 'item', name, price }); // Lägg till produkt i varukorg
                    } else {
                        console.error("Pris ej tillgängligt för denna produkt.");
                    }
                });

                menuItem.appendChild(itemButton);  // Lägg till knappen i menyraden
                menuContainer.appendChild(menuItem); // Lägg till produktmenyn i container
            });
        }

        // Lägg till dip- och dryckesknappar (SMÅ knappar)
        renderDips(menu);  // Rendera dips separat för små knappar
        renderDrinks(menu);  // Rendera drycker separat för små knappar
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>'; // Visa felmeddelande om menyn inte kan hämtas
    }
}

// Funktion för att beräkna och uppdatera ETA baserat på varukorgen
function updateEtaTime() {
    let baseTime = 1;  // Grundläggande tid (i minuter)
    const additionalTimePerItem = 1; // 5 minuter per artikel
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);  // Total antal artiklar

    // Beräkna total leveranstid
    const totalTime = baseTime + totalItems * additionalTimePerItem; 

    // Uppdatera ETA-tid på sidan
    const etaContainer = document.getElementById("eta-time");
    if (etaContainer) {
        etaContainer.innerText = ` ${totalTime} minuter`;
    }
}

// Hantera sidbyten (meny, varukorg, eta, kvitto)
function changeView(viewId) {
    const views = document.querySelectorAll('.view'); // Hämta alla vyer på sidan
    views.forEach(view => view.style.display = 'none'); // Dölj alla vyer
    
    const view = document.getElementById(viewId); // Hämta den vy som ska visas
    if (view) view.style.display = 'block'; // Visa vald vy
}

// Funktion för att navigera till varukorgsidan
function goToCartPage() {
    changeView('cart'); // Visa varukorgssidan
}

// Funktion för att navigera till eta-sidan
function goToEtaPage() {
    updateEtaTime();  // Uppdatera ETA innan vi går till eta-sidan
    changeView('eta'); // Visa ETA-sidan
}

// Funktion för att återgå till menyn
function goToMenuPage() {
    changeView('menu'); // Visa menyn
}

// Förbered sidan för att byta mellan menyer
function setupViewSwitchers() {
    // För Cart-knappen
    const cartButton = document.getElementById("cart-button");
    if (cartButton) {
        cartButton.addEventListener("click", goToCartPage); // Gå till varukorg
    }

    // För Take My Money-knappen på varukorgsidan (gå till eta)
    const takeMyMoneyButton = document.getElementById("take-my-money-button");
    if (takeMyMoneyButton) {
        takeMyMoneyButton.addEventListener("click", handleTakeMyMoney); // Gå till betalning
    }

    // För ny beställning-knappen på kvittosidan
    const newOrderButtons = document.querySelectorAll(".order-button");
    newOrderButtons.forEach(button => {
        button.addEventListener("click", resetOrder); // Ny beställning
    });

    // För kvitto och andra sidor
    document.querySelectorAll("[data-view]").forEach(button => {
        button.addEventListener("click", (event) => {
            const viewId = event.target.getAttribute('data-view');
            changeView(viewId); // Byt vy baserat på knapptryckning
        });
    });
}

// Funktion för att tömma varukorgen och slutföra beställningen
async function handleTakeMyMoney() {
    const orderData = prepareOrderData(); // Förbered orderdata

    // Beräkna moms
    const taxAmount = orderData.totalPrice * 0.20;
    const totalWithTax = orderData.totalPrice + taxAmount;

    // Skriv ut kvitto
    showReceipt(orderData, taxAmount, totalWithTax);

    // Töm varukorgen
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    updateCartBadge();
}

// Förbered orderdata för kvitto
function prepareOrderData() {
    const orderData = {
        items: cart, // Alla produkter i varukorgen
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) // Totalpris för beställningen
    };
    return orderData;
}

// Visa kvitto
function showReceipt(orderData, taxAmount, totalWithTax) {
    const receiptContainer = document.getElementById("receipt-container");
    receiptContainer.innerHTML = `  
        <h2>Beställning bekräftad</h2>
        <h3>Order-ID: ${orderId}</h3>
        <h4>Beställda varor:</h4>
        ${orderData.items.map(item => `
            <p>${item.name} (${item.quantity} st) - ${item.price * item.quantity} SEK</p>
        `).join('')}
        <p>-----------------------------</p>
        <p>Total: ${orderData.totalPrice} SEK</p>
        <p>Moms (25%): ${taxAmount.toFixed(2)} SEK</p>
        <p>Totalt med moms: ${totalWithTax.toFixed(2)} SEK</p>
        <button class="order-button">Ny Beställning</button> <!-- Ny beställning-knapp -->
    `;
}

// Reset order - töm varukorg och återställ till menyn
function resetOrder() {
    cart = []; // Töm varukorgen
    localStorage.removeItem('cart');  // Ta bort varukorgen från localStorage
    localStorage.removeItem('menu');  // Ta bort menyn från localStorage om den är sparad

    orderId = `#${Date.now()}`; // Återställ orderId till ett nytt för nästa beställning

    updateCartUI(); // Uppdatera UI med tom varukorg
    updateCartBadge(); // Uppdatera varukorgens badge

    const etaContainer = document.getElementById("eta-time");
    if (etaContainer) {
        etaContainer.innerText = '5 minuter'; // Återställ ETA-tiden
    }

    goToMenuPage(); // Gå tillbaka till menyn

    renderMenu(); // Ladda om menyn från API
}

// Anrop för att ladda varukorgen och rendera menyn vid sidladdning
loadCartFromLocalStorage(); // Ladda varukorgen från localStorage
renderMenu(); // Rendera menyn
setupViewSwitchers(); // Förbered sidan för att byta mellan vyer