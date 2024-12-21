import { fetchMenu } from './api.js';

let cart = [];
let orderId = 'ef3ip';  // Simulerad order-ID

// Lägg till varor i kundvagnen
function addToCart({ type, name, price }) {
    console.log(`Lägger till i kundvagnen: ${name}, Typ: ${type}, Pris: ${price} SEK`);
    
    // Kontrollera om produkten redan finns i kundvagnen, annars lägg till den
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;  // Om produkten finns, öka mängden
    } else {
        cart.push({ type, name, price, quantity: 1 });
    }

    updateCartUI();
    updateCartBadge();
}

// Uppdatera användargränssnittet för varukorgen
function updateCartUI() {
    const cartContainer = document.getElementById("cart-container");
    const totalText = document.querySelector(".total-text");

    cartContainer.innerHTML = "";  // Töm varukorgen
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price} SEK</p>
            <p>Antal: ${item.quantity}</p>
            <button class="increase" data-name="${item.name}">+</button>
            <button class="decrease" data-name="${item.name}">-</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Uppdatera totalpris
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalText.innerText = `TOTALT: ${totalPrice} SEK`;
}

// Uppdatera antalet varor i kundvagnen (den lilla ringen)
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".total-items").innerText = totalItems;
}

// Funktion för att rendera menyn
async function renderMenu() {
    const menuContainer = document.getElementById("menu-container");
    const menu = await fetchMenu();

    if (menu.length > 0) {
        // Filtrera bort "wonton" produkter från menyn (case-insensitiv)
        const filteredMenu = menu.filter(item => !item.name.toLowerCase().includes('wonton'));

        menuContainer.innerHTML = ''; // Töm menyn

        filteredMenu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            
            // Skapa en knapp som omsluter hela menyraden
            const itemButton = document.createElement('button');
            itemButton.classList.add('menu-item-button');
            itemButton.setAttribute('data-name', item.name);
            itemButton.setAttribute('data-price', item.price);

            itemButton.innerHTML = `
                <h3>${item.name}</h3>
                ${item.ingredients ? `<p class="ingredients">${item.ingredients.join(', ')}</p>` : ''}
                <p class="item-price">${item.price ? item.price + ' SEK' : 'Pris ej tillgängligt'}</p>
            `;

            // Lägg till eventlyssnare för att lägga till varor i kundvagnen när knappen klickas
            itemButton.addEventListener("click", () => {
                const name = itemButton.getAttribute('data-name');
                const price = parseFloat(itemButton.getAttribute('data-price'));

                if (!isNaN(price)) {
                    addToCart({ type: 'item', name, price });
                } else {
                    console.error("Pris ej tillgängligt för denna produkt.");
                }
            });

            menuItem.appendChild(itemButton);  // Lägg till knappen i menyraden
            menuContainer.appendChild(menuItem);
        });
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>';
    }
}

// Hantera sidbyten (meny, varukorg, eta, kvitto)
function changeView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.style.display = 'none');
    
    const view = document.getElementById(viewId);
    if (view) view.style.display = 'block';
}

// Funktion för att navigera till varukorgsidan
function goToCartPage() {
    changeView('cart'); // Visa varukorgssidan
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
        cartButton.addEventListener("click", goToCartPage);
    }

    // För ny beställning-knappen på varukorgsidan
    const backToMenuButton = document.getElementById("back-to-menu-button");
    if (backToMenuButton) {
        backToMenuButton.addEventListener("click", goToMenuPage);
    }

    // För kvitto och andra sidor
    document.querySelectorAll("[data-view]").forEach(button => {
        button.addEventListener("click", (event) => {
            const viewId = event.target.getAttribute('data-view');
            changeView(viewId);
        });
    });
}

// Kör funktioner när sidan laddas
document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    setupViewSwitchers();
});