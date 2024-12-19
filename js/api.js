//Api-nyckel och Api url för anrop
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";




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

async function loadMenu() {
    console.log("Laddar menyn...");  // Kontrollera om loadMenu körs
    await fetchMenuItems(foodType);
    await fetchMenuItems(drinkType);
    await fetchMenuItems(dipType);
    handleMenuButtons();
}

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