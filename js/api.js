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