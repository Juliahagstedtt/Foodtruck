import { fetchMenu } from './api.js';

let cart = []; // Varukorgsvariabel
let orderId = 'ef3up';  // Simulerad order-ID

const tenant = {
    id: "ef3up",
    name: "Julia"
}

const sauceButton = document.querySelector(".sauce-buttons");
const drinksButton = document.querySelector(".drinks-buttons");

// Lägg till varor i kundvagnen
function addToCart({ type, name, price }) {
    console.log(`Lägger till i kundvagnen: ${name}, Typ: ${type}, Pris: ${price} SEK`);
    
    // Kontrollera om produkten redan finns i kundvagnen
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;  // Om produkten finns, öka mängden
    } else {
        cart.push({ type, name, price, quantity: 1 });
    }

    // Uppdatera localStorage med den aktuella varukorgen
    localStorage.setItem('cart', JSON.stringify(cart));

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

    // Lägg till eventlyssnare på knapparna för att öka/minska mängden
    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, 1));
    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, -1));
    });

    // Uppdatera ETA-tid när varukorgen ändras
    updateEtaTime();
}

// Funktion för att ändra kvantiteten av en vara
function changeQuantity(button, change) {
    const itemName = button.getAttribute("data-name");
    const item = cart.find(item => item.name === itemName);
    
    if (item) {
        item.quantity += change;

        // Om mängden blir 0 eller mindre, ta bort varan från varukorgen
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== itemName);
        }

        // Uppdatera localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Uppdatera UI och badge
        updateCartUI();
        updateCartBadge();
    }
}

// Uppdatera antalet varor i kundvagnen (den lilla ringen)
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".total-items").innerText = totalItems;
}

// Ladda varukorgen från localStorage om den finns
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart); // Återställ varukorgen från localStorage
    }
}

// Funktion för att rendera menyn
// Funktion för att rendera menyn
async function renderMenu() {
    const menuContainer = document.getElementById("menu-container");
    const menu = await fetchMenu();

    if (menu.length > 0) {
        // Filtrera bort "wonton" produkter från menyn (case-insensitiv)
        const filteredMenu = menu.filter(item => !item.name.toLowerCase().includes('wonton'));

        menuContainer.innerHTML = ''; // Töm menyn

        if (filteredMenu.length === 0) {
            menuContainer.innerHTML = '<p>Inga produkter tillgängliga.</p>';
        } else {
            filteredMenu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                
                // Skapa en knapp som omsluter hela menyraden
                const itemButton = document.createElement('button');
                itemButton.classList.add('menu-item-button');
                itemButton.setAttribute('data-name', item.name);
                itemButton.setAttribute('data-price', item.price);

                itemButton.innerHTML = `
                    <div class="menu-item-content">
                        <h3 class="item-name">${item.name}</h3>
                        <span class="dot-line"></span>
                        <p class="item-price">${item.price ? item.price + ' SEK' : 'Pris ej tillgängligt'}</p>
                    </div>
                    ${item.ingredients ? `<p class="ingredients">${item.ingredients.join(', ')}</p>` : ''}
                `;

                // Lägg till eventlyssnare för att lägga till varor i kundvagnen
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
        }
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>';
    }
}

// Funktion för att beräkna och uppdatera ETA baserat på varukorgen
function updateEtaTime() {
    // Grundläggande tid (i minuter)
    let baseTime = 30;  // Grundläggande tid (30 minuter)

    // Öka tiden baserat på antalet artiklar i varukorgen
    const additionalTimePerItem = 5; // 5 minuter per artikel
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);  // Total antal artiklar

    // Beräkna total leveranstid
    const totalTime = baseTime + totalItems * additionalTimePerItem; 

    // Hitta ETA-tiden på sidan och uppdatera den
    const etaContainer = document.getElementById("eta-time");
    if (etaContainer) {
        etaContainer.innerText = `Beräknad leveranstid: ${totalTime} minuter`;
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
        cartButton.addEventListener("click", goToCartPage);
    }

    // För Take My Money-knappen på varukorgsidan (gå till eta)
    const takeMyMoneyButton = document.getElementById("take-my-money-button");
    if (takeMyMoneyButton) {
        takeMyMoneyButton.addEventListener("click", handleTakeMyMoney);
    }

    // För ny beställning-knappen på kvittosidan
    const newOrderButton = document.getElementById("order-button");
    if (newOrderButton) {
        newOrderButton.addEventListener("click", goToMenuPage); // Återgå till menyn
    }

    // För kvitto och andra sidor
    document.querySelectorAll("[data-view]").forEach(button => {
        button.addEventListener("click", (event) => {
            const viewId = event.target.getAttribute('data-view');
            changeView(viewId);
        });
    });
}

// Funktion för att tömma varukorgen och slutföra beställningen
async function handleTakeMyMoney() {
    // Förbered orderdata
    const orderData = prepareOrderData();

    // Beräkna moms
    const taxAmount = orderData.totalPrice * 0.25;  // Moms är 25%
    const totalWithTax = orderData.totalPrice + taxAmount;

    // Lägg till moms och totalbelopp i orderdata
    orderData.taxAmount = taxAmount;
    orderData.totalWithTax = totalWithTax;

    // Skicka beställningen till API
    await sendOrderToApi(orderData);  // Skicka orderdata till API

    // Töm varukorgen efter att beställningen är skickad
    cart = [];
    localStorage.removeItem('cart');  // Töm varukorgen från localStorage

    // Uppdatera UI
    updateCartUI();
    updateCartBadge();

    // Gå vidare till kvittosidan och visa kvittot
    goToReceiptPage(orderData);
}

// Förbered orderdata
function prepareOrderData() {
    const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    }));

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapa orderdata
    return {
        orderId: orderId,  // Genererat order-ID
        tenant: tenant.name,
        items: orderItems,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString(),
    };
}

// Funktion för att visa kvittot på kvittosidan
function showReceipt(orderData) {
    const receiptDetails = document.getElementById("receipt-details");
    const receiptTax = document.getElementById("receipt-tax");
    const receiptTotal = document.getElementById("receipt-total");

    // Töm kvittoinformationen
    receiptDetails.innerHTML = '';

    // Lägg till varje vara på kvittot
    orderData.items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("receipt-item");
        itemElement.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>${item.quantity} x ${item.price} SEK</p>
            <p>Totalt: ${item.quantity * item.price} SEK</p>
        `;
        receiptDetails.appendChild(itemElement);
    });

    // Beräkna och visa moms och totalbelopp
    const taxAmount = orderData.taxAmount;
    const totalWithTax = orderData.totalWithTax;
    receiptTax.innerText = `Moms (20%): ${taxAmount} SEK`;
    receiptTotal.innerText = `Total att betala: ${totalWithTax} SEK`;
}

// Funktion för att visa kvittosidan
function goToReceiptPage(orderData) {
    changeView('receipt');  // Byt till kvittosidan
    showReceipt(orderData);  // Visa kvittot med informationen
}

// Ladda och visa menyn när sidan laddas
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    renderMenu();
    setupViewSwitchers();  // Sätt upp alla knappar och eventlyssnare
});