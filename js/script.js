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
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <span class="dot-line"></span>
                <div class="cart-item-price">${item.price} SEK</div>
            </div>
            <div class="cart-item-actions">
                <button class="increase" data-name="${item.name}">+</button>
                <p class="amount">&nbsp;${item.quantity}&nbsp;&nbsp;stycken</p>
                <button class="decrease" data-name="${item.name}">-</button>
            </div>
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
        // Filtrera menyn för varje kategori (wonton, dip, drink)
        const menuWonton = menu.filter(item => item.type.toLowerCase().includes('wonton'));
        const menuDips = menu.filter(item => item.type.toLowerCase().includes('dip'));
        const menuDrinks = menu.filter(item => item.type.toLowerCase().includes('drink'));

        console.log('Wonton items:', menuWonton);
        console.log('Dip items:', menuDips);
        console.log('Drink items:', menuDrinks);

        menuContainer.innerHTML = ''; // Töm menyn

        // Rendera varje kategori var för sig
        renderWonton(menuWonton);
        renderDips(menuDips);
        renderDrinks(menuDrinks);
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>'; // Visa felmeddelande om menyn inte kan hämtas
    }
}

function renderWonton(wontonItems) {
    const menuContainer = document.getElementById("menu-container");

    if (wontonItems.length > 0) {
        const wontonHeader = document.createElement('h2');
        wontonHeader.innerText = '';
        menuContainer.appendChild(wontonHeader);

        // Rendera varje wonton-produkt
        wontonItems.forEach(item => {
            renderMenuItem(item);
        });
    } else {
        menuContainer.innerHTML += '<p>Inga Wonton tillgängliga.</p>';
    }
}

function renderDips(dipItems) {
    const menuContainer = document.getElementById("menu-container");

    if (dipItems.length > 0) {
        // Skapa en container för dip (inkl. rubrik och pris)
        const dipContainer = document.createElement('div');
        dipContainer.classList.add('category-container');

        // Skapa en header för dip
        const dipHeaderContainer = document.createElement('div');
        dipHeaderContainer.classList.add('category-header');
        
        // Lägg till rubrik för dip
        const dipHeader = document.createElement('h2');
        dipHeader.innerText = 'Dip';
        dipHeaderContainer.appendChild(dipHeader);

        // Lägg till dot-line mellan rubrik och pris
        const dotLine = document.createElement('span');
        dotLine.classList.add('dot-line');
        dipHeaderContainer.appendChild(dotLine);

        // Visa priset längst till höger
        const dipPrice = dipItems[0].price ? dipItems[0].price : 'Pris ej tillgängligt';
        const priceLabel = document.createElement('span');
        priceLabel.classList.add('category-price');
        priceLabel.innerText = `${dipPrice} SEK`;
        dipHeaderContainer.appendChild(priceLabel);

        // Lägg till headern i container
        dipContainer.appendChild(dipHeaderContainer);

        // Skapa en container för dipknappar
        const dipButtonsContainer = document.createElement('div');
        dipButtonsContainer.classList.add('small-button-container');

        // Lägg till knappar för varje dip
        dipItems.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.classList.add('small-menu-button');
            itemButton.setAttribute('data-name', item.name);
            itemButton.setAttribute('data-price', item.price);

            itemButton.innerText = item.name; // Visa endast namnet på knappen

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

            dipButtonsContainer.appendChild(itemButton); // Lägg till knappen i containern
        });

        dipContainer.appendChild(dipButtonsContainer); // Lägg till knapparna i dipcontainern
        menuContainer.appendChild(dipContainer); // Lägg till hela dipcontainern i menyn
    } else {
        menuContainer.innerHTML += '<p>Inga Dip tillgängliga.</p>';
    }
}

function renderDrinks(drinkItems) {
    const menuContainer = document.getElementById("menu-container");

    if (drinkItems.length > 0) {
        // Skapa en container för drink (inkl. rubrik och pris)
        const drinkContainer = document.createElement('div');
        drinkContainer.classList.add('category-container');

        // Skapa en header för drink
        const drinkHeaderContainer = document.createElement('div');
        drinkHeaderContainer.classList.add('category-header');

        // Lägg till rubrik för drink
        const drinkHeader = document.createElement('h2');
        drinkHeader.innerText = 'Drink';
        drinkHeaderContainer.appendChild(drinkHeader);

        // Lägg till dot-line mellan rubrik och pris
        const dotLine = document.createElement('span');
        dotLine.classList.add('dot-line');
        drinkHeaderContainer.appendChild(dotLine);

        // Visa priset längst till höger
        const drinkPrice = drinkItems[0].price ? drinkItems[0].price : 'Pris ej tillgängligt';
        const priceLabel = document.createElement('span');
        priceLabel.classList.add('category-price');
        priceLabel.innerText = `${drinkPrice} SEK`;
        drinkHeaderContainer.appendChild(priceLabel);

        // Lägg till headern i container
        drinkContainer.appendChild(drinkHeaderContainer);

        // Skapa en container för drinkknappar
        const drinkButtonsContainer = document.createElement('div');
        drinkButtonsContainer.classList.add('small-button-container');

        // Lägg till knappar för varje drink
        drinkItems.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.classList.add('small-menu-button');
            itemButton.setAttribute('data-name', item.name);
            itemButton.setAttribute('data-price', item.price);

            itemButton.innerText = item.name; // Visa endast namnet på knappen

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

            drinkButtonsContainer.appendChild(itemButton); // Lägg till knappen i containern
        });

        drinkContainer.appendChild(drinkButtonsContainer); // Lägg till knapparna i drinkcontainern
        menuContainer.appendChild(drinkContainer); // Lägg till hela drinkcontainern i menyn
    } else {
        menuContainer.innerHTML += '<p>Inga Drycker tillgängliga.</p>';
    }
}

function renderMenuItem(item) {
    const menuContainer = document.getElementById("menu-container");

    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');

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

    itemButton.addEventListener("click", () => {
        const name = itemButton.getAttribute('data-name');
        const price = parseFloat(itemButton.getAttribute('data-price'));

        if (!isNaN(price)) {
            addToCart({ type: 'item', name, price });
        } else {
            console.error("Pris ej tillgängligt för denna produkt.");
        }
    });

    menuItem.appendChild(itemButton);
    menuContainer.appendChild(menuItem);
}

// Funktion för att beräkna och uppdatera ETA baserat på varukorgen
// Uppdatera ETA-tiden och order-ID på ETA-sidan
function updateEtaTime() {
    let baseTime = 1;  // Grundläggande tid (i minuter)
    const additionalTimePerItem = 1; // 1 minut per artikel
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);  // Total antal artiklar

    // Beräkna total leveranstid
    const totalTime = baseTime + totalItems * additionalTimePerItem;

    // Uppdatera ETA-tid på sidan (visas överst)
    const etaTimeContainer = document.getElementById("eta-time");
    if (etaTimeContainer) {
        etaTimeContainer.innerText = `ETA: ${totalTime} minuter`; // Visa den totala tiden
    }

    // Uppdatera Order-ID på ETA-sidan (under ETA-tiden)
    const etaOrderIdContainer = document.getElementById("eta-order-id");
    if (etaOrderIdContainer) {
        etaOrderIdContainer.innerHTML = ` ${orderId}`; // Visa order-ID
    }
}

// Funktion för att byta vyer mellan Meny och Varukorg
function changeView(viewName) {
    console.log(`Försöker byta vy till: ${viewName}`); // Lägg till logg för felsökning

    if (!viewName) {
        console.error("Ingen vy skickades till changeView, viewName är null eller undefined");
        return;
    }

    // Dölja alla vyer
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.style.display = 'none';
    });

    // Visa den vy vi vill visa
    const viewToShow = document.getElementById(viewName);
    if (viewToShow) {
        viewToShow.style.display = 'block';
    } else {
        console.error(`Vy med id "${viewName}" kunde inte hittas.`);
    }
}

// Funktion för att gå till varukorgssidan
function goToCartPage() {
    changeView('cart'); // Visa varukorgsvyn
}

// Funktion för att gå tillbaka till menyn från varukorgen
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

    // För Meny-knappen på varukorgssidan
    document.querySelector(".order-button").addEventListener("click", function() {
        // Göm kvittosidan
        const receiptSection = document.getElementById("receipt");
        receiptSection.style.display = "none";
    
        // Visa menyn igen
        const menuSection = document.getElementById("menu");
        menuSection.style.display = "block";
    });

    // För Take My Money-knappen på varukorgsidan (gå till eta)
    const takeMyMoneyButton = document.getElementById("take-my-money-button");
    if (takeMyMoneyButton) {
        takeMyMoneyButton.addEventListener("click", handleTakeMyMoney); // Gå till betalning
    }

    // För Back To Menu-knappen
    const backToMenuButton = document.getElementById("back-to-menu-button");
    if (backToMenuButton) {
        backToMenuButton.addEventListener("click", goToMenuPage); // Gå till menyn
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
            console.log("Vyn som ska bytas till:", viewId);  // Logg för felsökning
            changeView(viewId); // Byt vy baserat på knapptryckning
        });
    });
}

// Anropa setupViewSwitchers vid sidan laddas
setupViewSwitchers();

// Funktion för att tömma varukorgen och slutföra beställningen
async function handleTakeMyMoney() {
    const orderData = prepareOrderData(); // Förbered orderdata

    // Skicka orderdata till servern (API) - Lägg till här om du har en API
    await sendOrderToApi(orderData);

    // Töm varukorgen
    cart = [];
    localStorage.removeItem('cart');
    
    // Uppdatera användargränssnittet
    updateCartUI();
    updateCartBadge();
    
    // Visa kvittot
    displayReceipt(orderData);  // Visa kvittot med orderdata
    changeView('receipt');  // Visa kvittosidan
}

function prepareOrderData() {
    const orderId = `#${Date.now()}`;  // Skapa ett unikt orderId baserat på tiden

    // Skapa en lista med beställningsartiklar (namn, kvantitet och pris)
    const orderItems = cart.map(item => ({
        name: item.name,       // Namn på produkten
        quantity: item.quantity, // Antal av produkten
        price: item.price,      // Pris per enhet
    }));

    // Beräkna totalpriset för beställningen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapa objekt med all information för beställningen
    return {
        orderId: orderId,  // Unikt orderId
        tenant: tenant.name,  // Namn på användaren (tenant)
        items: orderItems,  // Lista med beställningsartiklar
        totalPrice: totalPrice, // Totalpris för beställningen
        timestamp: new Date().toISOString(), // Tidpunkt då beställningen skapades (ISO-format)
    };
}


// Visa kvitto
function showReceipt(orderData) {
    console.log("Orderdata skickas till kvittot:", orderData);

    if (!orderData || !orderData.orderId) {
        console.error("Ingen giltig orderdata mottogs.");
        return;
    }

    const receiptContainer = document.getElementById("receipt-container");
    const taxAmount = orderData.totalPrice * 0.25; // 25% moms
    const totalWithTax = orderData.totalPrice + taxAmount; // Totalpris inklusive moms

    receiptContainer.innerHTML = `
        <h2>Beställning mottagen</h2>
        <p><strong>Beställnings-ID:</strong> ${orderData.orderId}</p>
        <h4>Beställda varor:</h4>
        ${orderData.items.map(item => `
            <p>${item.name} (${item.quantity} st) - ${item.price * item.quantity} SEK</p>
        `).join('')}
        <p>-----------------------------</p>
        <div class="total-info">
            <p><strong>Total:</strong> ${orderData.totalPrice} SEK</p>
            <p><strong>Moms (25%):</strong> ${taxAmount.toFixed(2)} SEK</p>
            <p><strong>Totalt med moms:</strong> ${totalWithTax.toFixed(2)} SEK</p>
        </div>
    `;

    // Visa totalpris och moms på kvittosidan
    const totalPrice = document.getElementById("total-price");
    totalPrice.innerText = `Total: ${orderData.totalPrice} SEK`;

    const totalText = document.getElementById("total-text");
    totalText.innerText = `Totalt med moms: ${totalWithTax.toFixed(2)} SEK`;
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

function displayReceipt(orderData) {
    const receiptContainer = document.getElementById("receipt-container");

    if (!orderData || !orderData.orderId) {
        console.error("Ingen giltig orderdata mottogs.");
        return;
    }

    // Beräkna moms och total inklusive moms
    const taxAmount = orderData.totalPrice * 0.25; // 25% moms
    const totalWithTax = orderData.totalPrice + taxAmount; // Totalpris inklusive moms

    // Uppdatera kvittot med orderinformation
    receiptContainer.innerHTML = `
        <h2>Beställning mottagen</h2>
        <p>Beställnings-ID: ${orderData.orderId}</p>
        <h4>Beställda varor:</h4>
        ${orderData.items.map(item => `
            <p>${item.name} (${item.quantity} st) - ${item.price * item.quantity} SEK</p>
        `).join('')}
        <p>-----------------------------</p>
        <div class="total-info">
            <p>Total: ${orderData.totalPrice} SEK</p>
            <p>Moms (25%): ${taxAmount.toFixed(2)} SEK</p>
            <p>Totalt med moms: ${totalWithTax.toFixed(2)} SEK</p>
        </div>
    `;
}

// Anrop för att ladda varukorgen och rendera menyn vid sidladdning
loadCartFromLocalStorage(); // Ladda varukorgen från localStorage
renderMenu(); // Rendera menyn
setupViewSwitchers(); // Förbered sidan för att byta mellan vyer