// export let cart = [];

// export function addToCart(item) {
//     const existingItem = cart.find(i => i.id === item.id);
//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cart.push({ ...item, quantity: 1 });
//     }
//     renderCart();
// }

// export function updateQuantity(itemId, quantity) {
//     const item = cart.find(i => i.id === itemId);
//     if (item) {
//         item.quantity = quantity;
//         renderCart();
//     }
// }

// export function clearCart() {
//     cart = [];
//     renderCart();
// }

// export function renderCart() {
//     const cartElement = document.querySelector("#cart-container .cart-items");
//     cartElement.innerHTML = ''; 

//     cart.forEach(item => {
//         const cartItemElement = document.createElement("div");
//         cartItemElement.innerHTML = `
//             <div>${item.name} - ${item.quantity} st</div>
//             <div>Pris: ${item.price * item.quantity} SEK</div>
//         `;
//         cartElement.appendChild(cartItemElement);
//     });

//     const totalElement = document.querySelector("#cart-container .total");
//     totalElement.textContent = `Totalt: ${getTotalPrice()} SEK`;
// }

// export function getTotalPrice() {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
// }

// function removeFromCart(item) {
//     const index = cart.indexOf(item);
//     if (index > -1) {
//         cart.splice(index, 1);
//         updateCartDisplay();
//     }
// }