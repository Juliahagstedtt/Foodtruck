
const apiKey = "yum-BHRyCR5Lgznl28Tr";
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Hämta menyn
export async function fetchMenu() {
    try {
        const response = await fetch(`${apiUrl}/menu`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }
        });
        const data = await response.json();
        console.log("Menydatan:", data);  
        return data.items || [];
    } catch (error) {
        console.error("Fel vid hämtning av meny:", error);
        return [];
    }
}

// Skicka en beställning
export async function placeOrder(cart) {
    const orderData = { items: cart };
    try {
        const response = await fetch(`${apiUrl}/order`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-zocom": apiKey
            },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fel vid att skicka beställning:", error);
        return null;
    }
}

// Hämta kvitto
export async function fetchReceipt(orderId) {
    try {
        const response = await fetch(`${apiUrl}/order/${orderId}`, {
            method: 'GET',
            headers: { "x-zocom": apiKey }
        });
        return await response.json();
    } catch (error) {
        console.error("Fel vid hämtning av kvitto:", error);
        return null;
    }
}