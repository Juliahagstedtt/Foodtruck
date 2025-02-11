import { fetchMenu } from './api.js';

let cart = []; // Varukorgsvariabel som lagrar alla valda produkter
let orderId = `#${Date.now()}`; // Skapa ett unikt order-ID baserat på den aktuella tiden
console.log("cart:", cart);


const tenant = {
    id: "ef3up", // Identifierar användaren 
    name: "Julia" // Namnet på användaren
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
        cartItem.classList.add("cart-item"); 
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

        cartContainer.appendChild(cartItem); 
    });

    // Uppdatera totalpris för varukorgen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); 
    totalText.innerText = `TOTALT: ${totalPrice} SEK`;

    // Lägger till eventlyssnare på knapparna för att öka eller minska mängden
    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, 1)); // Ökar mängden på produkt
    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button, -1)); // Minskar mängden på produkt
    });

    // Uppdatera ETA-tid när varukorgen ändras
    updateEtaTime();
}

// Funktion för att ändra kvantiteten av en vara
function changeQuantity(button, change) {
    const itemName = button.getAttribute("data-name"); // Hämtar namnet på produkten från knappen
    const item = cart.find(item => item.name === itemName); // Hitta produkten i varukorgen
    
    if (item) {
        item.quantity += change; // Ändra kvantiteten

        // Om mängden blir 0 eller mindre, ta bort varan från varukorgen
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== itemName); // Ta bort produkten från varukorgen
        }

        // Uppdaterar localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Uppdatera varukorgens UI och badge (antal artiklar)
        updateCartUI();
        updateCartBadge();
    }
}

// Uppdaterar antalet varor i kundvagnen (det lilla numret bredvid varukorgsikonen)
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Beräknar total antal artiklar i varukorgen
    document.querySelector(".total-items").innerText = totalItems; // Uppdaterar badge med total antal artiklar
}

// Laddar varukorgen från localStorage om den finns
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart); // Återställer varukorgen från localStorage
    }
}

async function renderMenu() {
    const menuContainer = document.getElementById("menu-container"); // Hämtar elementet där menyn ska renderas
    const menu = await fetchMenu(); // Hämtar menyn via API

    if (menu.length > 0) {
        // Filtrerar menyn för varje kategori (wonton, dip, drink)
        const menuWonton = menu.filter(item => item.type.toLowerCase().includes('wonton'));
        const menuDips = menu.filter(item => item.type.toLowerCase().includes('dip'));
        const menuDrinks = menu.filter(item => item.type.toLowerCase().includes('drink'));

        console.log('Wonton items:', menuWonton);
        console.log('Dip items:', menuDips);
        console.log('Drink items:', menuDrinks);

        menuContainer.innerHTML = ''; // Töm menyn

        // Renderar varje kategori var för sig
        renderWonton(menuWonton);
        renderDips(menuDips);
        renderDrinks(menuDrinks);
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>'; // Visar felmeddelande om menyn inte kan hämtas
    }
}

function renderWonton(wontonItems) {
    const menuContainer = document.getElementById("menu-container");

    if (wontonItems.length > 0) {
        const wontonHeader = document.createElement('h2');
        wontonHeader.innerText = '';
        menuContainer.appendChild(wontonHeader);

        // Renderar varje wonton-produkt
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
        // Skapar en container för dip (inkl. rubrik och pris)
        const dipContainer = document.createElement('div');
        dipContainer.classList.add('category-container');

        // Skapar en header för dip
        const dipHeaderContainer = document.createElement('div');
        dipHeaderContainer.classList.add('category-header');
        
        // Lägger till rubrik för dip
        const dipHeader = document.createElement('h2');
        dipHeader.innerText = 'Dip';
        dipHeaderContainer.appendChild(dipHeader);

        // Lägger till dot-line mellan rubrik och pris
        const dotLine = document.createElement('span');
        dotLine.classList.add('dot-line');
        dipHeaderContainer.appendChild(dotLine);

        // Visar priset längst till höger
        const dipPrice = dipItems[0].price ? dipItems[0].price : 'Pris ej tillgängligt';
        const priceLabel = document.createElement('span');
        priceLabel.classList.add('category-price');
        priceLabel.innerText = `${dipPrice} SEK`;
        dipHeaderContainer.appendChild(priceLabel);

        // Lägger till headern i container
        dipContainer.appendChild(dipHeaderContainer);

        // Skapar en container för dipknappar
        const dipButtonsContainer = document.createElement('div');
        dipButtonsContainer.classList.add('small-button-container');

        // Lägger till knappar för varje dip
        dipItems.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.classList.add('small-menu-button');
            itemButton.setAttribute('data-name', item.name);
            itemButton.setAttribute('data-price', item.price);

            itemButton.innerText = item.name; // Visar endast namnet på knappen

            // Lägger till eventlyssnare för att lägga till varor i kundvagnen
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
        // Skapar en container för drink (inkl. rubrik och pris)
        const drinkContainer = document.createElement('div');
        drinkContainer.classList.add('category-container');

        // Skapar en header för drink
        const drinkHeaderContainer = document.createElement('div');
        drinkHeaderContainer.classList.add('category-header');

        // Lägger till rubrik för drink
        const drinkHeader = document.createElement('h2');
        drinkHeader.innerText = 'Drink';
        drinkHeaderContainer.appendChild(drinkHeader);

        // Lägger till dot-line mellan rubrik och pris
        const dotLine = document.createElement('span');
        dotLine.classList.add('dot-line');
        drinkHeaderContainer.appendChild(dotLine);

        // Visar priset längst till höger
        const drinkPrice = drinkItems[0].price ? drinkItems[0].price : 'Pris ej tillgängligt';
        const priceLabel = document.createElement('span');
        priceLabel.classList.add('category-price');
        priceLabel.innerText = `${drinkPrice} SEK`;
        drinkHeaderContainer.appendChild(priceLabel);

        // Lägger till headern i container
        drinkContainer.appendChild(drinkHeaderContainer);

        // Skapar en container för drinkknappar
        const drinkButtonsContainer = document.createElement('div');
        drinkButtonsContainer.classList.add('small-button-container');

        // Lägger till knappar för varje drink
        drinkItems.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.classList.add('small-menu-button');
            itemButton.setAttribute('data-name', item.name);
            itemButton.setAttribute('data-price', item.price);

            itemButton.innerText = item.name; // Visa endast namnet på knappen

            // Lägger till eventlyssnare för att lägga till varor i kundvagnen
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
// renderar menyn
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


// Uppdaterar ETA-tiden och order-ID på ETA-sidan
function updateEtaTime() {
    let baseTime = 1;  // Grundläggande tid (i minuter)
    const additionalTimePerItem = 1; // 1 minut per artikel
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);  // Total antal artiklar

    // Beräknar total leveranstid
    const totalTime = baseTime + totalItems * additionalTimePerItem;

    // Uppdaterar ETA-tid på sidan (visas överst)
    const etaTimeContainer = document.getElementById("eta-time");
    if (etaTimeContainer) {
        etaTimeContainer.innerText = `ETA: ${totalTime} minuter`; // Visa den totala tiden
    }

    // Uppdaterar Order-ID på ETA-sidan (under ETA-tiden)
    const etaOrderIdContainer = document.getElementById("eta-order-id");
    if (etaOrderIdContainer) {
        etaOrderIdContainer.innerHTML = `${orderId}`; // Visa order-ID
    }
}

// Funktion för att byta vyer mellan Meny och Varukorg
function changeView(viewName) {
    console.log(`Försöker byta vy till: ${viewName}`); // Lägger till logg för felsökning

    if (!viewName) {
        console.error("Ingen vy skickades till changeView, viewName är null eller undefined");
        return;
    }

    // Döljer alla vyer
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.style.display = 'none';
    });

    // Visar den vy jag vill visa
    const viewToShow = document.getElementById(viewName);
    if (viewToShow) {
        viewToShow.style.display = 'block';
    } else {
        console.error(`Vy med id "${viewName}" kunde inte hittas.`);
    }
}

// Funktion för att gå till varukorgssidan
function goToCartPage() {
    changeView('cart'); // Visar varukorgsvyn
}

// Funktion för att gå tillbaka till menyn från varukorgen
function goToMenuPage() {
    changeView('menu'); // Visar menyn
}
// Förbereder sidan för att byta mellan menyer
function setupViewSwitchers() {
    // Cart-knappen
    const cartButton = document.getElementById("cart-button");
    if (cartButton) {
        cartButton.addEventListener("click", goToCartPage); // Går till varukorg
    }

    // För Meny-knappen på varukorgssidan
    document.querySelector(".order-button").addEventListener("click", function() {

    
        // Visar menyn igen
        const menuSection = document.getElementById("menu");
        menuSection.style.display = "block";
    });

    // För Take My Money-knappen på varukorgsidan (går till eta)
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
            console.log("Vyn som ska bytas till:", viewId);  // Logg för felsökning
            changeView(viewId); // Byter vy baserat på knapptryckning
        });
    });
}

// Anropar setupViewSwitchers när sidan laddas
setupViewSwitchers();

// Funktion för att tömma varukorgen och slutföra beställningen
async function handleTakeMyMoney() {
    const orderData = prepareOrderData(); // Förbereder orderdata

    // Skickar orderdata till servern (API)
    await sendOrderToApi(orderData);

    // Tömmer varukorgen
    cart = [];
    localStorage.removeItem('cart');
    
    // Uppdaterar användargränssnittet
    updateCartUI();
    updateCartBadge();
}

function prepareOrderData() {
    const orderId = `#${Date.now()}`;  // Skapar ett unikt orderId baserat på tiden

    // Skapar en lista med beställningsartiklar (namn, kvantitet och pris)
    const orderItems = cart.map(item => ({
        name: item.name,       // Namn på produkten
        quantity: item.quantity, // Antal av produkten
        price: item.price,      // Pris per enhet
    }));

    // Beräknar totalpriset för beställningen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapar objekt med all information för beställningen
    return {
        orderId: orderId,  // Unikt orderId
        tenant: tenant.name,  // Namn på användaren (tenant)
        items: orderItems,  // Lista med beställningsartiklar
        totalPrice: totalPrice, // Totalpris för beställningen
        timestamp: new Date().toISOString(), // Tidpunkt 
    };
}


// Resetar ordern - tömmer varukorg och återställer till menyn
function resetOrder() {
    cart = []; // Tömmer varukorgen
    localStorage.removeItem('cart');  // Tar bort varukorgen från localStorage
    localStorage.removeItem('menu');  // Tar bort menyn från localStorage om den är sparad

    orderId = `#${Date.now()}`; // Återställer orderId till ett nytt för nästa beställning

    updateCartUI(); // Uppdaterar UI med tom varukorg
    updateCartBadge(); // Uppdaterar varukorgens badge

    const etaContainer = document.getElementById("eta-time");
    if (etaContainer) {
        etaContainer.innerText = '5 minuter'; // Återställer ETA-tiden
    }

    goToMenuPage(); // Gå tillbaka till menyn

    renderMenu(); // Laddar om menyn från API
}


// Anropar för att ladda varukorgen och rendera menyn när sidan laddar
loadCartFromLocalStorage(); // Laddar varukorgen från localStorage
renderMenu(); // Renderar menyn
setupViewSwitchers(); // Förbereder sidan för att byta mellan vyerna