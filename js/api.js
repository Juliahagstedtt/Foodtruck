// api.js

const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com"; 

let tenant = {
    id: "07zc", // Identifierar användaren 
    name: "Julia" // Namnet på användaren
};

/// Exportera båda funktionerna korrekt
export async function fetchMenu() {
    try {
        const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }
        });

        if (!response.ok) {
            throw new Error(`API-fel: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Fel vid hämtning av meny:", error);
        return [];
    }
}

async function sendOrderToApi(cart) {
    const apiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/07zc/order';
    const apiKey = 'yum-BHRyCR5Lgznl28Tr';  
    const tenantId = '07zc';  // Tenant ID

    // Skapa requestOptions
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-zocom': apiKey  
        },
        body: JSON.stringify({
            tenantId: '07zc',
            items: cart  // cart är en array
        })
    };
      
      const response = await fetch(apiUrl, requestOptions);

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            console.error(`API Error: ${response.status} - ${response.statusText}`);
            return;
        }

        const data = await response.json();
        if (!data) {
            console.error("API returned empty or invalid response");
            return;
        }

        console.log("API Response:", data);
    } catch (error) {
        console.error("Något gick fel vid API-anropet:", error);
    }
}

// Skapa en funktion för att generera ett unikt orderId
function generateOrderId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Endast bokstäver
    let orderId = '';
    for (let i = 0; i < 5; i++) {  // Generera en ID-längd
        const randomIndex = Math.floor(Math.random() * characters.length); // Slumpmässigt tecken
        orderId += characters[randomIndex]; // Lägger till tecknet i ID:t
    }
    return orderId;
}

// Förbered beställningsdata
let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Läs in cart från localStorage eller en tom array


function prepareOrderData() {
    const orderId = generateOrderId(); // Skapar ett unikt orderId
    const tenant = "Julia";  
    
    console.log("Förbered beställning för tenant:", tenant); // Bekräftar vilken tenant som används
    
    // Säkerställ att cart är en array innan användning av .reduce()
    if (!Array.isArray(cart)) {
        console.error("Cart is not an array:", cart);
        return;
    }

    // Beräkna totalpriset för beställningen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapar objekt med all information för beställningen
    return {
        orderId: orderId,       // Unikt orderId
        tenant: tenant,         // Namn på användaren (tenant)
        items: cart,            // Lista med beställningsartiklar
        totalPrice: totalPrice, // Totalpris för beställningen
        timestamp: new Date().toISOString(), // Tidpunkt då beställningen skapades
    };
}

// Lägg till eventlyssnare på knappen för att slutföra beställningen
document.querySelector(".pay-button").addEventListener("click", handleTakeMyMoney);

function getTenant() {
    return localStorage.getItem('tenant') || "Julia";
}

// Hantera när användaren slutför beställningen
function handleTakeMyMoney() {
    const orderData = {
        items: cart, // Skickar varukorgen
        tenantId: "07zc"
    };

    console.log("Orderdata innan API-anrop:", orderData); // Kontrollera att den har data!

    sendOrderToApi(cart);  // Skicka kundvagnen till API:et
}

// Funktion för att gå till kvittosidan (när beställningen är slutförd)
function goToEtaPage() {

    // Dölj andra sektioner (t.ex. menyn)
    const menuSection = document.getElementById("menu");
    menuSection.style.display = "none"; // Döljer menyn
}

// Lägg till eventlyssnare på knappen för att göra en ny beställning
document.querySelector(".order-button").addEventListener("click", function() {
    // Visa menyn igen
    const menuSection = document.getElementById("menu");
    menuSection.style.display = "block";
});