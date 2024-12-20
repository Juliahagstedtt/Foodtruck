// cart.js
export let cart = [];

// Lägg till objekt i varukorgen
export function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    renderCart(); 
}

// Ta bort objekt från varukorgen
export function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    renderCart(); 
}

// Rendera varukorgen
export function renderCart() {
    const cartContainer = document.querySelector(".cart-items");
    cartContainer.innerHTML = "";
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <div>${item.ingredients}</div>
            <p>Pris: ${item.price.toFixed(2)} SEK</p>
            <button class="remove-from-cart" data-id="${item.id}">Ta bort</button>
        `;
        cartItem.querySelector(".remove-from-cart").addEventListener("click", () => removeFromCart(item.id));
        cartContainer.appendChild(cartItem);
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector(".total").textContent = `${total.toFixed(2)} SEK`;
}