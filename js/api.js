// api.js
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Funktion för att hämta menyn
export async function fetchMenu() {
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

// Skicka beställning till API
async function sendOrderToApi(orderData) {
    try {
        const response = await fetch(`${apiUrl}/order`, {
            method: 'POST',
            headers: {
                "x-zocom": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Fel vid skickande av beställning: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Beställning skickad:", data);
        // Gå vidare till kvitto-sidan eller ETA
    } catch (error) {
        console.error("Fel vid beställning:", error);
        alert("Det gick inte att skicka beställningen. Försök igen.");
    }
}


function prepareOrderData() {
    // Samla information om varukorgen och användaren
    const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    }));

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Skapa orderdata (det kan vara mer beroende på vad API:et kräver)
    return {
        orderId: orderId,  // Detta kan vara ett genererat ID eller från en användares session
        tenant: tenant.name,
        items: orderItems,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString(),
    };
}


// Funktion för att tömma varukorgen och slutföra beställningen
async function handleTakeMyMoney() {
    // Förbered orderdata
    const orderData = prepareOrderData();

    // Skicka beställningen till API
    await sendOrderToApi(orderData);  // Skicka orderdata till API

    // Töm varukorgen efter att beställningen är skickad
    cart = [];
    localStorage.removeItem('cart');  // Töm varukorgen från localStorage

    // Uppdatera UI
    updateCartUI();
    updateCartBadge();

    // Gå vidare till ETA-sidan eller kvitto-sidan
    goToEtaPage();
}