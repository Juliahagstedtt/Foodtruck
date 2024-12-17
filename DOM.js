document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll("[data-view]");
    const views = document.querySelectorAll(".view");

    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove("active");
            view.classList.add("hidden");
        });

        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.classList.remove("hidden");
            viewToShow.classList.add("active");
        }
    }

    navButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const viewId = event.target.closest("button").getAttribute("data-view");
            showView(viewId); 
        });
    });

    showView("menu");

    // Här lyssnar vi på klick för varje side-menu-button
    document.querySelectorAll('.side-menu-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const menuType = event.currentTarget.getAttribute('data-type');
            console.log(`Visar meny för: ${menuType}`);
            // Hämta och visa innehållet baserat på vilken meny (dip/drink) som valdes
            fetchMenu(menuType);
        });
    });
});

async function fetchMenu(menuType) {
    const apiKey = 'yum-BHRyCR5Lgznl28Tr'; 
    const url = `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu/${menuType}`; // Anpassa URL baserat på menytyp
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "x-zocom": apiKey
        }
    });

    if (!response.ok) {
        console.error("Fel vid hämtning av data från API:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log("API Data:", data);
    
    if (data && data.items && Array.isArray(data.items)) {
        displayMenu(data.items);  
    } else {
        console.error("Ingen menydata hittades.");
    }
}

function displayMenu(menuItems) {
    const menuContainer = document.getElementById("menu-items");
    if (!menuContainer) {
        console.error("Elementet med id 'menu-items' finns inte i HTML.");
        return;
    }

    menuContainer.innerHTML = '';  

    menuItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("menu-item");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>$</p>
            <p>${item.description}</p>
            <p>Pris: ${item.price} SEK</p>
            <button onclick="addToCart(${item.id})">Lägg till i varukorg</button>
        `;
        menuContainer.appendChild(itemElement);
    });
}