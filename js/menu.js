// export function displayMenu(menuItems) {
//     const menuContainer = document.getElementById("menu-items");
//     menuItems.forEach(item => {

//         if (!menuContainer.querySelector(`[data-id='${item.id}']`)) {
//             const itemElement = document.createElement("div");
//             itemElement.classList.add("menu-item");
//             itemElement.setAttribute("data-id", item.id);  
//             itemElement.innerHTML = `
//                 <h3>${item.name}</h3>
//                 <p class="price">${item.price} SEK</p>
//             `;

//             itemElement.addEventListener('click', function() {
//                 addToCart(item.id, item.name, item.price);  
//             });

//             menuContainer.appendChild(itemElement);  
//         }
//     });
// }