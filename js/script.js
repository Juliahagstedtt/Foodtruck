import { fetchMenu } from './api.js';

// Funktion för att hämta menyn och visa den
async function fetchMenuAndDisplay() {
    const menuContainer = document.getElementById("menu-container");
    const menuData = await fetchMenu();

    console.log("API svar:", menuData);  // Felsökning: Visa vad API:t returnerar

    if (menuData && menuData.length > 0) {
        // Rensa nuvarande menyinnehåll
        menuContainer.innerHTML = '';

        // Gå igenom varje menyobjekt och skapa HTML-element för det
        menuData.forEach(item => {
            // Kontrollera om item.ingredients finns och är en array
            const ingredients = item.ingredients && Array.isArray(item.ingredients) ? item.ingredients : [];
            const price = item.price ? item.price + ' SEK' : 'Pris ej tillgängligt';

            // Skapa menyobjekt
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.innerHTML = `
                <h3>${item.name}</h3>
                ${ingredients.length > 0 ? `<p class="ingredients">${ingredients.join(', ')}</p>` : ''}
                ${price ? `<p class="item-price">${price}</p>` : ''}
                <div class="sides-container">
                    ${item.sides && Array.isArray(item.sides) ? item.sides.map(side => `
                        <div class="product-box">
                            <img src="${side.imageUrl || 'default-image.jpg'}" alt="${side.name}">
                            <p class="item-name">${side.name}</p>
                            <p class="item-price">${side.price ? side.price + ' SEK' : 'Pris ej tillgängligt'}</p>
                            <button class="item-button">Lägg till</button>
                        </div>
                    `).join('') : ''}
                </div>
            `;
            menuContainer.appendChild(menuItem);
        });
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>';
    }
}

// Kör funktionen när sidan är klar att laddas
document.addEventListener("DOMContentLoaded", () => {
    fetchMenuAndDisplay();  // Hämtar och visar menyn
});