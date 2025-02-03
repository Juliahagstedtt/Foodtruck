// api.js

// API-nyckel och bas-URL för API:t
const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com"; 

// Funktion för att hämta menyn från API:t
export async function fetchMenu() {
    try {
        // Skickar en GET-förfrågan för att hämta menyn
        const response = await fetch(`${apiUrl}/menu`, {
            method: 'GET',  // HTTP-metod för GET-förfrågan
            headers: { 
                "x-zocom": apiKey // Lägg till API-nyckel i headern
            }
        });

        // Om svarskoden inte är OK (t.ex. 404 eller 500), kasta ett fel
        if (!response.ok) {
            throw new Error(`API-fel: ${response.status} - ${response.statusText}`);
        }

        // Om förfrågan är framgångsrik, parsar vi JSON-svaret
        const data = await response.json();

        // Returnera lista med menyalternativ, eller en tom array om inga varor finns
        return data.items || [];
    } catch (error) {
        console.error("Fel vid hämtning av meny:", error); // Logga fel om API-förfrågan misslyckas
        return []; // Returnera en tom array vid fel
    }
}

// Exportera funktionen så att den kan användas i andra filer
async function sendOrderToApi(orderData) {
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            body: JSON.stringify(orderData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error sending order:', error);
    }
}

// Funktion för att generera ett unikt orderId baserat på slumpmässiga bokstäver
function generateOrderId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Endast bokstäver
    let orderId = '';
    for (let i = 0; i < 5; i++) {  // Generera en ID-längd på 5 tecken
        const randomIndex = Math.floor(Math.random() * characters.length); // Slumpmässigt tecken
        orderId += characters[randomIndex]; // Lägg till tecknet i ID:t
    }
    return orderId;
}
// Förbered beställningsdata
function prepareOrderData() {
    const orderId = generateOrderId(); // Skapa ett unikt orderId

    // Skapa en lista med beställningsartiklar (namn, kvantitet och pris)
    const orderItems = cart.map(item => ({
        name: item.name,        // Namn på produkten
        quantity: item.quantity, // Antal av produkten
        price: item.price,      // Pris per enhet
    }));

    // Beräkna totalpriset för beställningen
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapa objekt med all information för beställningen
    return {
        orderId: orderId,       // Unikt orderId
        tenant: tenant.name,    // Namn på användaren (tenant)
        items: orderItems,      // Lista med beställningsartiklar
        totalPrice: totalPrice, // Totalpris för beställningen
        timestamp: new Date().toISOString(), // Tidpunkt då beställningen skapades (ISO-format)
    };
}



// Hantera när användaren slutför beställningen
async function handleTakeMyMoney() {
    // Förbered orderdata utan att använda ett API
    sendOrderToApi(orderDetails);
    const orderData = prepareOrderData();

    // Töm varukorgen och uppdatera UI
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    updateCartBadge();

    // Byt till kvittosidan
    changeView('menu');  // Här kan du byta till någon annan sida som t.ex. meny, eller visa ett meddelande om att beställningen är mottagen
}

// Funktion för att gå till kvittosidan (när beställningen är slutförd)
function goToEtaPage() {
    const receiptSection = document.getElementById("receipt");
    receiptSection.style.display = "flex"; // Visa kvittosidan

    // Dölj andra sektioner (t.ex. menyn)
    const menuSection = document.getElementById("menu");
    menuSection.style.display = "none"; // Döljer menyn
}

// Lägg till eventlyssnare på knappen för att göra en ny beställning
document.querySelector(".order-button").addEventListener("click", function() {
    // Göm kvittosidan
    const receiptSection = document.getElementById("receipt");
    receiptSection.style.display = "none";

    // Visa menyn igen
    const menuSection = document.getElementById("menu");
    menuSection.style.display = "block";
});