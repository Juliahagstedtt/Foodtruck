const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";
const tenantId = "zocom";

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

// Funktion för att hämta kvitto
export async function fetchReceipt(orderId) {
    try {
        const response = await fetch(`${apiUrl}/order/${orderId}`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }
        });

        if (!response.ok) {
            throw new Error(`API-fel: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.receipt || null;
    } catch (error) {
        console.error("Fel vid hämtning av kvitto:", error);
        return null;
    }
}