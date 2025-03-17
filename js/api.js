// api.js

const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com"; 

/// Exportera båda funktionerna korrekt
export async function fetchMenu() {
    const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
    const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";
    
    try {
        const response = await fetch(`${apiUrl}/menu`, {
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

export async function sendOrderToApi(orderData) {
    try {
        fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Fel vid beställning');
        }

        const responseData = await response.json();
        console.log('Order skickad:', responseData);
        return responseData;  // Se till att skicka tillbaka responseData
    } catch (error) {
        console.error('Något gick fel:', error);
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

    // Säkerställ att cart är en array innan vi använder .reduce()
    if (!Array.isArray(cart)) {
        console.error("Cart is not an array:", cart);
        return;
    }

    // Beräkna totalpriset för beställningen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapar objekt med all information för beställningen
    return {
        orderId: orderId,       // Unikt orderId
        tenant: tenant.name,    // Namn på användaren (tenant)
        items: cart,            // Lista med beställningsartiklar
        totalPrice: totalPrice, // Totalpris för beställningen
        timestamp: new Date().toISOString(), // Tidpunkt då beställningen skapades
    };
}

// Lägg till eventlyssnare på knappen för att slutföra beställningen
document.querySelector(".pay-button").addEventListener("click", handleTakeMyMoney);



// Hantera när användaren slutför beställningen
async function handleTakeMyMoney() {
    const orderData = prepareOrderData(); // Förbered orderdata

    if (!orderData) {
        console.error('Orderdata kunde inte skapas');
        return;
    }

    try {
        // Skicka orderdata till API
        const apiResponse = await sendOrderToApi(orderData);
        console.log('Order skickad till API:', apiResponse);

        // Töm varukorgen och uppdatera UI
        cart = [];
        localStorage.removeItem('cart');
        updateCartUI();
        updateCartBadge();

        // Byt till kvittosidan (eta)
        console.log("Byter vy till eta");
        changeView('eta');
    } catch (error) {
        console.error('Fel vid beställning:', error);
    }
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