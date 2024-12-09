// function fetchDataWithKey(apiKey) {
//     fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu', {
//         method "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ${apiKey}'
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Menyn är:', data);
//         displayMenu(data);
//     })
//     .catch(error => {
//         console.error('Ett fel uppstod', error);
//     });
// }

// function displayMenu(menuData)  {
//     const menuContainer = document.querySelector('.options-dip');
//     menuData.forEach(item => {
//         const menuItem = document.createElement('p');
//         menuItem.textContent = item.name;
//         menuContainer.appendChild(menuItem);
//     });
// }