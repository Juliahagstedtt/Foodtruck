document.addEventListener("DOMContentLoaded", () => {
    let menuItems = [];
    let cart = [];

    // Hämta menydata
    async function fetchMenu() {
        const apiKey = 'yum-BHRyCR5Lgznl28Tr';
        try {
            const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
                method: "GET",
                headers: {
                    "x-zocom": apiKey
                }
            });
            const data = await response.json();
            menuItems = data.menuItems;
            displayMenu(menuItems);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    }

    // Visa meny
    function displayMenu(data) {
        const menuContainer = document.getElementById("menu");
        menuContainer.innerHTML = ""; // Rensa befintligt innehåll
        data.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Pris: ${item.price} SEK</p>
                <button class="add-to-cart" data-id="${item.id}">Lägg till i varukorg</button>
            `;
            menuContainer.appendChild(itemElement);
        });

        // Lägg till event listeners för "Lägg till i varukorg"-knappar
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", () => {
                const itemId = parseInt(button.getAttribute("data-id"));
                addToCart(itemId);
            });
        });
    }

    // Lägg till i varukorg
    function addToCart(itemId) {
        const item = menuItems.find(item => item.id === itemId);
        if (item) {
            cart.push(item);
            updateCart();
        }
    }

    // Uppdatera varukorg
    function updateCart() {
        const cartContainer = document.querySelector(".cart-items");
        cartContainer.innerHTML = ""; // Rensa varukorgen
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.innerHTML = `
                <h4>${item.name}</h4>
                <p>Pris: ${item.price} SEK</p>
            `;
            cartContainer.appendChild(cartItem);
        });

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.querySelector(".cart-total").innerHTML = `Total: ${total} SEK`;
    }

    // Visa sektion
    function showSection(sectionId) {
        document.querySelectorAll("section").forEach(section => {
            section.classList.remove("active");
        });
        const targetSection = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetSection) {
            targetSection.classList.add("active");
        }
    }

    // Lägg till event listeners för navigeringsknappar
    document.getElementById("to-cart-button").addEventListener("click", () => showSection("cart"));
    document.getElementById("to-eta-button").addEventListener("click", () => showSection("eta"));
    document.getElementById("to-receipt-button").addEventListener("click", () => showSection("receipt"));
    document.getElementById("to-menu-button").addEventListener("click", () => showSection("menu"));

    // Starta appen
    showSection("menu");
    fetchMenu();
});