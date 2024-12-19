//Api-nyckel och Api url för anrop
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

const tenantId = "your-tenant-id";

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

// Funktion för att skicka en beställning till servern
export async function placeOrder(cart) {
    const orderData = { 
        items: cart, 
        name: tenantName  // Lägg till "name" fältet
    };
    
    try {
        // Skicka POST-förfrågan med beställningsdata till API:et
        const response = await fetch(`${apiUrl}/tenants`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Indikerar att vi skickar JSON-data
                "x-zocom": apiKey  // Lägg till API-nyckel i header
            },
            body: JSON.stringify(orderData) 
             // Omvandlar orderdata till en JSON-sträng för att skicka
        });
        const result = await response.json();  // Väntar på att servern svarar och omvandlar svaret till JSON
        return result;  // Returnerar resultatet från servern
    } catch (error) {
        // Om ett fel uppstår vid att skicka beställningen, logga felet och returnera null
        console.error("Fel vid att skicka beställning:", error);
        return null;
    }
}

// Funktion för att hämta kvitto från API:et baserat på order-ID
export async function fetchReceipt(orderId) {
    try {
        const response = await fetch(`${apiUrl}/order/${orderId}`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }  // Lägg till API-nyckel i header
        });

        if (!response.ok) {
            throw new Error(`API-fel: ${response.status} - ${response.statusText}`);
        }

        // Om anropet lyckas, returnera JSON-responsen
        return await response.json();
    } catch (error) {
        // Logga felet och ge användaren ett meddelande
        console.error("Fel vid hämtning av kvitto:", error);
        return null;
    }
}

// Skapa en ny Tenant
export async function createTenant(tenantName) {
    const tenantData = { name: tenantName };  // JSON-objekt som innehåller namnet för den nya tenanten

    try {
        const response = await fetch(`${apiUrl}/zocom`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Skicka som JSON
                "x-zocom": apiKey  // API-nyckeln
            },
            body: JSON.stringify(tenantData)  // Omvandla data till JSON
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
export async function placeOrderForTenant(tenantId, cart) {
    const orderData = { items: cart };  // Varukorgen omvandlas till ett orderobjekt

    
    try {
        const response = await fetch(`${apiUrl}/tenants/${tenantId}/orders`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Skicka som JSON
                "x-zocom": apiKey  // API-nyckeln
            },
            body: JSON.stringify(orderData)  // Skicka orderdata som JSON
        });

        if (!response.ok) {
            throw new Error(`Fel vid att skicka beställning: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Beställning skapad:", result);  // Logga resultatet
        return result;  // Returnera resultatet från servern
    } catch (error) {
        console.error("Fel vid att skicka beställning:", error);
        return null;  // Returnera null om fel uppstår
    }
}

