async function fetchMenu() {
    const apiKey = 'yum-BHRyCR5Lgznl28Tr'; 
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
        method: "GET",
        headers: {
            "x-zocom": apiKey
        }
    });
    const data = await response.json();
    console.log(data);
    menuItems = data.menuItems; 
    displayMenu(menuItems); 
}

let menuItems = [];
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
        document.getElementById("menu").appendChild(itemElement);
        console.log(data); 
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

    // cart.forEach(item => {
    //     const cartItem = document.createElement('div');
    //     cartItem.innerHTML = '
    //     <h4>${item.name}</h4>
    //     <p>Pris: ${item.price}SEK</p>
    //     ';
    //     cartContainer.appendChild(cartItem);
    // });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalElement = document.getElementById('order-summary');
    totalElement.innerHTML = 'Total: ${total} SEK';
}


document.addEventListener("DOMContentLoaded", () => {
    function showSection(sectionId) {
        document.querySelectorAll("section").forEach(section => {
            section.classList.remove("active");
        });
        const targetSection = document.querySelector('[data-section="${sectionId}"]');
        if (targetSection)  {
            targetSection.classList.add("active");
        }
    }
    document.getElementById("to-cart-button").addEventListener("click", () => {
        showSection("cart");
    })

    document.getElementById("to-eta-button").addEventListener("click", () => {
        showSection("eta");
    });
    document.getElementById("to-receipt-button").addEventListener("click", () => {
        showSection("receipt");
    });

    document.getElementById("to-menu-button").addEventListener("click", () => {
        showSection("menu");
    });
    showSection("menu");
});
