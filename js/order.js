import { fetchMenu, fetchReceipt } from './api.js';  // Importera de funktioner som behövs

// Funktion för att hämta och visa menyn
export async function loadMenu() {
    const menuItems = await fetchMenu();  // Använder fetchMenu här
    if (menuItems.length > 0) {
        // Skapa menyn om den innehåller objekt
        createMenu(menuItems);
    } else {
        console.error("Ingen meny hittades");
    }
}

// Funktion för att skicka order
export async function submitOrder() {
    const orderId = "12345";  // Detta kan vara dynamiskt, baserat på den aktuella ordern
    try {
        const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/order/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': 'yum-BHRyCR5Lgznl28Tr'  // API-nyckel
            },
            body: JSON.stringify({
                // Här kan du lägga till den data som behövs för att skapa en order
                items: [
                    { id: "item1", quantity: 1 },
                    { id: "item2", quantity: 2 }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Fel vid beställning');
        }

        const result = await response.json();
        console.log('Beställningen är genomförd:', result);
        // Visa kvitto eller annan feedback till användaren
    } catch (error) {
        console.error('Fel vid beställning:', error);
    }
}

// Funktion för att hämta kvitto
export async function getOrderReceipt(orderId) {
    const receipt = await fetchReceipt(orderId);
    if (receipt) {
        console.log("Kvitto hämtat:", receipt);
    }
}

// Skapa menyn och fyll grid-boxarna
function createMenu(items) {
    const menuContainer = document.querySelector("#menu-container");
    if (!menuContainer) {
        console.error("Meny-container ej funnen i DOM");
        return;
    }

    items.forEach(item => {
        const menuItem = document.createElement("button");
        menuItem.classList.add("menu-item");
        menuItem.setAttribute("data-price", item.price);
        menuItem.setAttribute("data-id", item.id);

        const menuContent = document.createElement("div");
        menuContent.classList.add("menu-content");

        const nameElement = document.createElement("h4");
        nameElement.innerText = item.name;

        const priceElement = document.createElement("span");
        priceElement.innerText = `${item.price} SEK`;

        menuContent.appendChild(nameElement);
        menuContent.appendChild(priceElement);

        const dottedDivider = document.createElement("div");
        dottedDivider.classList.add("dotted-divider");

        const ingredientsElement = document.createElement("span");
        ingredientsElement.innerText = Array.isArray(item.ingredients) && item.ingredients.length > 0
            ? item.ingredients.join(", ")
            : "Inga ingredienser";

        menuItem.appendChild(menuContent);
        menuItem.appendChild(dottedDivider);
        menuItem.appendChild(ingredientsElement);

        if (item.type === "food") {
            menuContainer.appendChild(menuItem);
            menuItem.addEventListener("click", () => addToCart(item));
        } else if (item.type === "drinks") {
            const drinksContainer = document.querySelector(".side-options-drinks");
            drinksContainer.appendChild(menuItem);
            menuItem.addEventListener("click", () => addToCart(item));
        } else if (item.type === "dips") {
            const dipsContainer = document.querySelector(".side-options-dips");
            dipsContainer.appendChild(menuItem);
            menuItem.addEventListener("click", () => addToCart(item));
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
});