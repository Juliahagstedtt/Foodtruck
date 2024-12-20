//Api-nyckel och Api url för anrop
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

const apiUrlDrinks = 'https://din-api-url.com/drinks'; 
const apiUrlDips = 'https://din-api-url.com/dips';

const tenantId = "zocom";

// Hämta menyn
// Funktion för att hämta menyn från API:et
export async function fetchMenu() {
    try {
        
        // Skicka GET-förfrågan till API:et för att hämta menyn
        const response = await fetch(`${apiUrl}/menu`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }  // Lägger till API-nyckel i header
        });
        const data = await response.json();  // Omvandlar svar från servern till JSON
        console.log("Menydatan:", data);  // Loggar menydatan i konsolen
        return data.items || [];  // Returnerar menyn (eller en tom lista om inga objekt finns)
    } catch (error) {
        // Om ett fel uppstår vid hämtning, logga felet och returnera en tom lista
        console.error("Fel vid hämtning av meny:", error);
        return [];
    }
}


async function fetchMenuItems(type) {
    try {
        const response = await fetch(`${apiUrl}/menu?type=${type}`);
        const data = await response.json();
        console.log('Menydatan för', type, data); // Kontrollera vad som hämtas

        // Lägg till produkterna i rätt container beroende på typ
        const container = document.querySelector(`.side-options[data-type="${type}"]`);
        data.items.forEach(item => {
            const box = document.createElement('div');
            box.className = 'product-box';
            box.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <p>${item.price} SEK</p>
            `;
            container.appendChild(box);
        });

    } catch (error) {
        console.error('Fel vid hämtning av produkter:', error);
    }
}

async function loadMenu() {
    console.log("Laddar menyn...");  // Kontrollera om loadMenu körs
    await fetchMenuItems(foodType);
    await fetchMenuItems(drinkType);
    await fetchMenuItems(dipType);
    handleMenuButtons();
}


// Exempel på datahämtning och rendering
async function renderProducts() {
    const drinksContainer = document.querySelector('#drinks-container');
    const dipsContainer = document.querySelector('#dips-container');

    try {
        // Hämta drycker från API:et
        const responseDrinks = await fetch('https://din-api-url.com/drinks'); // Ändra URL till din API
        const drinksData = await responseDrinks.json();

        // Rendera de 6 första dryckerna
        drinksData.slice(0, 6).forEach(drink => {
            const button = document.createElement('button');
            button.className = 'product-box';
            button.innerHTML = `
                <img src="${drink.image}" alt="${drink.name}">
                <p class="item-name">${drink.name}</p>
                <p class="item-price">${drink.price} SEK</p>
            `;
            button.addEventListener('click', () => {
                console.log(`Vald dryck: ${drink.name}`);
                // Lägg till ytterligare funktionalitet här, t.ex. lägga till i kundvagn
            });
            drinksContainer.appendChild(button);
        });

        // Hämta dipsåser från API:et
        const responseDips = await fetch('https://din-api-url.com/dips'); // Ändra URL till din API
        const dipsData = await responseDips.json();

        // Rendera de 6 första dipsåserna
        dipsData.slice(0, 6).forEach(dip => {
            const button = document.createElement('button');
            button.className = 'product-box';
            button.innerHTML = `
                <img src="${dip.image}" alt="${dip.name}">
                <p class="item-name">${dip.name}</p>
                <p class="item-price">${dip.price} SEK</p>
            `;
            button.addEventListener('click', () => {
                console.log(`Vald dipsås: ${dip.name}`);
                // Lägg till ytterligare funktionalitet här, t.ex. lägga till i kundvagn
            });
            dipsContainer.appendChild(button);
        });

    } catch (error) {
        console.error('Kunde inte hämta produkter:', error);
    }
}

renderProducts();


// Funktion för att skicka en beställning till servern
export async function placeOrder(cart, tenantName) {
    // Här säkerställer vi att "name" är med i orderData
    const orderData = { 
        items: cart, 
        name: "zocom"  // Lägg till "name" här
    };

    try {
        // Skicka POST-förfrågan till API:et för att skicka beställningen
        const response = await fetch(`${apiUrl}/tenants`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Skicka som JSON
                "x-zocom": apiKey  // API-nyckeln
            },
            body: JSON.stringify(orderData)  // Omvandla orderdatan till JSON
        });

        const result = await response.json();  // Vänta på svaret och omvandla det till JSON
        console.log("Beställningen skickades:", result);  // Logga resultatet för att se vad servern svarar

        return result;  // Returnera resultatet från servern
    } catch (error) {
        console.error("Fel vid att skicka beställning:", error);
        return null;  // Returnera null om något går fel
    }
}

// Funktion för att hämta kvitto från API:et baserat på order-ID
export async function fetchReceipt(orderId) {
    if (!orderId) {
        console.error("OrderID är inte definierat");
        return null;
    }

    try {
        const response = await fetch(`${apiUrl}/order/${orderId}`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }
        });

        if (!response.ok) {
            throw new Error(`API-fel: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fel vid hämtning av kvitto:", error);
        return null;
    }
}

// Skapa en ny Tenant
export async function createTenant(tenantName) {
    const tenantData = { name: tenantName };  // Endast tenantens namn

    try {
        const response = await fetch(`${apiUrl}/tenants`, {  // Använd korrekt endpoint för att skapa en tenant
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Skicka som JSON
                "x-zocom": apiKey  // API-nyckeln
            },
            body: JSON.stringify(tenantData)  // Skicka namn på tenanten som JSON
        });

        if (!response.ok) {
            throw new Error(`Fel vid skapande av tenant: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Tenant skapad:", result);  // Logga den skapade tenanten
        return result;  // Returnera resultatet
    } catch (error) {
        console.error("Fel vid skapande av tenant:", error);
        return null;  // Returnera null om fel uppstår
    }
}

// Skicka en beställning till en tenant
const corsProxy = "https://cors-anywhere.herokuapp.com/";  // Lägg till en proxy-server

export async function placeOrderForTenant(tenantId, cart) {
    const orderData = { items: cart };

    try {
        const response = await fetch(`${corsProxy}${apiUrl}/tenants/${tenantId}/orders`, {  // Använd proxy-server
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-zocom": apiKey
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Fel vid att skicka beställning: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Beställning skapad:", result);
        return result;
    } catch (error) {
        console.error("Fel vid att skicka beställning:", error);
        return null;
    }
}