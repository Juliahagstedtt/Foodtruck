// api.js
import { updateCartUI } from './script.js';

const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys"; 

let tenant = {
    id: "07zc", // Identifierar användaren 
    name: "Julia" // Namnet på användaren
};

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

export async function sendOrderToApi(cart) {
    console.log("Cart in sendOrderToApi:", cart);
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
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        console.log("Response status:", response.status);        
    if (!response.ok) {
            // Loggar fel om något går fel
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData}`);
        }
        const responseData = await response.json();
        console.log("Response data:", responseData);
        return responseData;
    } catch (error) {
        console.error("Något gick fel vid API-anropet:", error);
    }
}

function getCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    console.log('Hämtad varukorg från localStorage:', cartData);
    
    if (cartData) {
        try {
            return JSON.parse(cartData);  // Säkerställ att den blir en array
        } catch (error) {
            console.error("Error parsing cart data:", error);
            return [];
        }
    } else {
        return [];
    }
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Hantera när användaren slutför beställningen
async function handleTakeMyMoney() {
    const cart = getCartFromLocalStorage();
    console.log("Cart innan betalning:", cart);

    if (!Array.isArray(cart)) {
        console.error("Fel: cart är inte en array!", cart);
        return;
    }

    const orderData = prepareOrderData(cart);
    if (!orderData) {
        console.error("OrderData kunde inte skapas!");
        return;
    }

    await sendOrderToApi(orderData);
    updateCartUI();
}

function prepareOrderData(cart) {
    if (!Array.isArray(cart) || cart.length === 0) {
        console.error("Cart is empty or not an array:", cart);
        return null;
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
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".pay-button").addEventListener("click", handleTakeMyMoney);
});
function getTenant() {
    return localStorage.getItem('tenant') || "Julia";
}

function generateOrderId() {
    return `#${Date.now()}`; // Skapar unikt order-ID baserat på tid
}

// Funktion för att gå till kvittosidan (när beställningen är slutförd)
function goToEtaPage() {

    // Dölj andra sektioner (t.ex. menyn)
    const menuSection = document.getElementById("menu");
    menuSection.style.display = "none"; // Döljer menyn
}

// Lägg till eventlyssnare på knappen för att göra en ny beställning
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".order-button").addEventListener("click", function() {
        document.getElementById("menu").style.display = "block";
    });
});