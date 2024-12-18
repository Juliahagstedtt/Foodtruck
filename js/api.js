//Api-nyckel och Api url för anrop
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

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
    const orderData = { items: cart };  // ÄNDRA HÄR!!! Skapar en orderdataobjekt med varukorgen

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
        // Skicka GET-förfrågan för att hämta kvitto baserat på order-ID
        const response = await fetch(`${apiUrl}/order/${orderId}`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }  // Lägg till API-nyckel i header
        });
        return await response.json();  // Omvandlar svaret från servern till JSON och returnerar det
    } catch (error) {
        // Om ett fel uppstår vid att hämta kvittot, logga felet och returnera null
        console.error("Fel vid hämtning av kvitto:", error);
        return null;
    }
}