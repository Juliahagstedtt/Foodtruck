// import { fetchMenu } from './api.js';
// import { displayMenu } from './menu.js';

// document.addEventListener("DOMContentLoaded", () => {
//     const navButtons = document.querySelectorAll("[data-view]");
//     const views = document.querySelectorAll(".view");

//     function showView(viewId) {
//         views.forEach(view => {
//             view.classList.toggle("active", view.id === viewId);
//         });
//     }

//     navButtons.forEach(button => {
//         button.addEventListener("click", (event) => {
//             const viewId = event.target.closest("button").getAttribute("data-view");
//             showView(viewId);
//         });
//     });

//     showView("menu");

    

//     document.querySelectorAll('.side-menu-button').forEach(button => {
//         button.addEventListener('click', (event) => {
//             const menuType = event.currentTarget.getAttribute('data-type');
//             console.log(`Visar meny för: ${menuType}`);

//             fetchMenu(menuType).then(menuItems => {
//                 displayMenu(menuItems); 
//             });
//         });
//     });

//     document.querySelector(".cart-bag-button").addEventListener("click", function() {
//         showView("cart-container"); // Visa varukorgsvyn
//     });

//     document.querySelector("#to-order-button").addEventListener("click", function() {
//         showView("eta-container"); 
//     });
// });