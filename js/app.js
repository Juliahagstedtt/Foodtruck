// import { fetchMenu } from './api.js';
// import { displayMenu } from './menu.js';

// async function init() {
//     const menuItems = await fetchMenu();
//     console.log(menuItems); 
//     displayMenu(menuItems);  

//     document.querySelector(".cart-bag-button").addEventListener("click", () => {
//         document.getElementById("menu").classList.add("hidden");
//         document.getElementById("cart-container").classList.remove("hidden");
//     });

//     document.querySelector("#to-new-order-button").addEventListener("click", () => {
//         document.getElementById("cart-container").classList.add("hidden");
//         document.getElementById("menu").classList.remove("hidden");
//     });

//     document.querySelector("#to-order-button").addEventListener("click", async () => {
//         const order = await placeOrder(cart);
//         displayEta(order.eta);  
//         document.getElementById("cart-container").classList.add("hidden");
//         document.getElementById("eta-container").classList.remove("hidden");
//     });

//     document.querySelector(".eta-button").addEventListener("click", async () => {
//         const receipt = await fetchReceipt(order.id);
//         displayReceipt(receipt);
//         document.getElementById("eta-container").classList.add("hidden");
//         document.getElementById("receipt").classList.remove("hidden");
//     });
// }

// init();