// api.js
import { updateCartUI } from './script.js';

const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/"; 

let tenant = {
    id: "07zc", // Identifierar användaren 
    name: "Julia" // Namnet på användaren
};



/// Exportera båda funktionerna korrekt
export async function fetchMenu() {
    try {
        const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu`, {
            method: 'GET',
            headers: { 
            "x-zocom": "yum-BHRyCR5Lgznl28Tr" }
        });

        if (!response.ok) {
            throw new Error('Error fetching menu data:', error);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Fel vid hämtning av meny:", error);
        return [];
    }
}

async function sendOrderToApi(cart) {
    const formattedCart = cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity
    }));

    const requestBody = {
        tenantId: '07zc',
        items: formattedCart
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-zocom': apiKey
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${responseData}`);
        }
        console.log("Order sent successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error("Något gick fel vid API-anropet:", error);
    }
}

// Förbered beställningsdata
let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Läs in cart från localStorage eller en tom array


function prepareOrderData(cart) {
    if (!Array.isArray(cart) || cart.length === 0) {
        console.error("Cart is empty or not an array:", cart);
        return null; // Returnera null så vi kan hantera felet
    }

    return {
        orderId: generateOrderId(),
        tenant: "Julia",
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
    };
}

// Lägg till eventlyssnare på knappen för att slutföra beställningen
document.querySelector(".pay-button").addEventListener("click", handleTakeMyMoney);

function getTenant() {
    return localStorage.getItem('tenant') || "Julia";
}

function generateOrderId() {
    return `#${Date.now()}`; // Skapar unikt order-ID baserat på tid
}


function getCartFromLocalStorage() {
    if (typeof localStorage === 'undefined') {
        console.warn("localStorage är inte tillgängligt.");
        return [];
    }

    const cartData = localStorage.getItem('cart');
    console.log('Hämtad varukorg från localStorage:', cartData);
    
    if (cartData) {
        return JSON.parse(cartData);
    } else {
        console.warn('Ingen varukorg hittades i localStorage.');
        return [];
    }
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Hantera när användaren slutför beställningen
async function handleTakeMyMoney() {
    const cart = getCartFromLocalStorage(); // Hämta varukorgen från localStorage
    console.log("Cart innan betalning:", cart);

    if (cart.length === 0) {
        console.warn("Varukorgen är tom! Lägg till varor innan du fortsätter.");
        return;  // Stoppa om varukorgen är tom
    }

    // Förbered och skicka beställning
    const orderData = prepareOrderData(cart);
    await sendOrderToApi(orderData);

    // Töm varukorgen efter beställning
    // localStorage.removeItem('cart'); <-- Ta bort denna rad om du inte vill rensa varukorgen här
    updateCartUI();  // Uppdatera UI
    updateCartBadge();  // Uppdatera badge
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