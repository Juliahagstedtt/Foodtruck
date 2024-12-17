async function fetchMenu() {
    const apiKey = 'yum-BHRyCR5Lgznl28Tr'; 
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
        method: "GET",
        headers: {
            "x-zocom": apiKey
        }
    });
    
    if (!response.ok) {
        console.error("Fel vid hämtning av data från API:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log("API Data:", data);
    
    if (data && data.items && Array.isArray(data.items)) {
        displayMenu(data.items);  
    } else {
        console.error("Ingen menydata hittades.");
    }
}

function displayMenu(menuItems) {
    const menuContainer = document.getElementById("menu-items");
    if (!menuContainer) {
        console.error("Elementet med id 'menu-items' finns inte i HTML.");
        return;
    }

    menuContainer.innerHTML = '';  

    menuItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("menu-item");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Pris: ${item.price} SEK</p>
            <button onclick="addToCart(${item.id})">Lägg till i varukorg</button>
        `;
        menuContainer.appendChild(itemElement);
    });
}

let cart = [];

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        cart.push(item);
        updateCart();
    }
}

function updateCart() {
    const cartContainer = document.querySelector(".cart-items");
    cartContainer.innerHTML = "";

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Pris: ${item.price} SEK</p>
        `;
        cartContainer.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.querySelector(".total").textContent = `${total} SEK`;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event lyssnare är aktiv.");
    fetchMenu();
});