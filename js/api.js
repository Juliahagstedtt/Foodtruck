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

// Funktion för att skicka beställningen till API:t
async function sendOrderToApi(orderData) {
    try {
        // Skickar POST-förfrågan med beställningsdata
        const response = await fetch(`${apiUrl}/order`, {
            method: 'POST', // HTTP-metod för POST
            headers: {
                "x-zocom": apiKey, // API-nyckel i headern
                "Content-Type": "application/json" // Ange att vi skickar JSON-data
            },
            body: JSON.stringify(orderData) // Omvandla orderData till JSON-format
        });

        // Om svarskoden inte är OK, kasta ett fel
        if (!response.ok) {
            throw new Error(`Fel vid skickande av beställning: ${response.status} - ${response.statusText}`);
        }

        // Om förfrågan är framgångsrik, parsar vi JSON-svaret
        const data = await response.json();
        console.log("Beställning skickad:", data); // Logga svar från API:t

        // Visa kvitto med beställnings-ID
        displayReceipt(data);
    } catch (error) {
        console.error("Fel vid beställning:", error); // Logga fel om beställningen misslyckas
        alert("Det gick inte att skicka beställningen. Försök igen."); // Visa felmeddelande för användaren
    }
}

// Funktion för att generera ett unikt orderId baserat på aktuellt datum och tid
function generateOrderId() {
    return Date.now(); // Skapar ett unikt ID baserat på det aktuella tidstämpeln
}

// Funktion för att förbereda orderdata (samla in all relevant information)
function prepareOrderData() {
    const orderId = generateOrderId(); // Skapa ett unikt orderId

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

// Funktion för att visa kvitto med beställnings-ID och detaljer
function displayReceipt(data) {
    const receiptContainer = document.getElementById("receipt-container"); // Se till att elementet finns

    // Uppdatera kvittots innehåll med beställningsinformation
    receiptContainer.innerHTML = `
        <h2>Beställning mottagen</h2>
        <p>Beställnings-ID: ${data.orderId}</p> <!-- Visa beställnings-ID -->
        <p>Totalpris: ${data.totalPrice} SEK</p> <!-- Visa totalpris -->
        <ul>
            ${data.items.map(item => `<li>${item.name} - ${item.quantity} st</li>`).join('')} <!-- Lista varje artikel -->
        </ul>
    `;
}

// Funktion för att hantera slutförandet av beställningen (t.ex. när användaren klickar på 'Take my Money')
async function handleTakeMyMoney() {
    const orderData = prepareOrderData(); // Förbered orderdata

    orderData.userId = tenant.id;  // Lägg till användarens ID i orderdata (t.ex. användarens tenant-id)

    // Skicka orderdata till API:t för att slutföra beställningen
    await sendOrderToApi(orderData); 

    // Töm varukorgen efter att beställningen är skickad
    cart = []; // Töm kundvagnen
    localStorage.removeItem('cart');  // Ta bort varukorgen från localStorage

    // Uppdatera användargränssnittet
    updateCartUI();  // Uppdatera varukorgens UI
    updateCartBadge();  // Uppdatera varukorgens badge (antal varor)

    // Skicka användaren till kvitto-sidan för att visa bekräftelse
    goToEtaPage();  // Gå till ETA-sidan för att visa leveranstid
}