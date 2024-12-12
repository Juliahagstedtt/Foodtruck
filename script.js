async function fetchMenu() {
    const apiKey = 'yum-BHRyCR5Lgznl28Tr'; // Ersätt med din API-nyckel
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
        method: "GET",
        headers: {
            "x-zocom": apiKey
        }
    });
    const data = await response.json();
    console.log(data); 
    displayMenu(data); 
}


function displayMenu(data) {
    const menuItems = data.menuItems; 
    menuItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Pris: ${item.price} SEK</p>
            <button onclick="addToCart(${item.id})">Lägg till i varukorg</button>
        `;
        document.getElementById("menu-container").appendChild(itemElement);
        console.log(data);  // Se vad API:et returnerar

    });
}

let cart = [];

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = '
        <h4>${item.name}</h4>
        <p>Pris: ${item.price}SEK</p>
        ';
        cartContainer.appendChild(cartItem);
    });
}

