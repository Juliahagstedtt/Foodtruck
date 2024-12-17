const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

async function fetchMenu() {
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-zocom": apiKey 
            }
        });
        
        const data = await response.json();


        if (data && data.items) {
            displayMenu(data.items);  
        } else {
            console.error("Ingen menydata hittades.");
        }
    } catch (error) {
        console.error("Fel vid hämtning av meny:", error);
    }
}

function displayMenu(menuItems) {
    const menuContainer = document.getElementById("menu-items"); 
    
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