async function renderMenu() {
    const menuContainer = document.getElementById("menu-container"); // Hämta elementet där menyn ska renderas
    const menu = await fetchMenu(); // Hämta menyn via API

    if (menu.length > 0) {
        // Filtrera bort "wonton" produkter och dip/drink från huvudmenyn
        const filteredMenu = menu.filter(item => item.type.toLowerCase().includes('wonton'));
        console.log('f menu items:', filteredMenu)

        menuContainer.innerHTML = ''; // Töm menyn

        if (filteredMenu.length === 0) {
            menuContainer.innerHTML = '<p>Inga produkter tillgängliga.</p>'; // Visa meddelande om ingen produkt finns
        } else {
            filteredMenu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item'); // Lägg till CSS-klass för varje menyprodukt
                
                // Skapa en knapp som omsluter hela menyraden
                const itemButton = document.createElement('button');
                itemButton.classList.add('menu-item-button');
                itemButton.setAttribute('data-name', item.name); // Lägg till produktens namn som data-attribut
                itemButton.setAttribute('data-price', item.price); // Lägg till produktens pris som data-attribut

                itemButton.innerHTML = `  
                    <div class="menu-item-content">
                        <h3 class="item-name">${item.name}</h3>
                        <span class="dot-line"></span>
                        <p class="item-price">${item.price ? item.price + ' SEK' : 'Pris ej tillgängligt'}</p>
                    </div>
                    ${item.ingredients ? `<p class="ingredients">${item.ingredients.join(', ')}</p>` : ''} <!-- Visa ingredienser om tillgängliga -->
                `;

items.filter(item => item.type == 'wonton')

                // Lägg till eventlyssnare för att lägga till varor i kundvagnen
                itemButton.addEventListener("click", () => {
                    const name = itemButton.getAttribute('data-name');
                    const price = parseFloat(itemButton.getAttribute('data-price'));

                    if (!isNaN(price)) {
                        addToCart({ type: 'item', name, price }); // Lägg till produkt i varukorg
                    } else {
                        console.error("Pris ej tillgängligt för denna produkt.");
                    }
                });

                menuItem.appendChild(itemButton);  // Lägg till knappen i menyraden
                menuContainer.appendChild(menuItem); // Lägg till produktmenyn i container
            });
        }

        // Lägg till dip- och dryckesknappar (SMÅ knappar)
        renderDips(menu);  // Rendera dips separat för små knappar
        renderDrinks(menu);  // Rendera drycker separat för små knappar
    } else {
        menuContainer.innerHTML = '<p>Det gick inte att hämta menyn just nu.</p>'; // Visa felmeddelande om menyn inte kan hämtas
    }
}