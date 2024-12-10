// Lagt in api manuellt
const apikey = 'yum-2ngXkR6S02ijFrTP';  

const bodyToSend = {
    // id: "test123",
    name: "Julia"
};

const options = {
    method: 'POST',
    body: JSON.stringify(bodyToSend)
}

//Skicka en POST-begäran till API:et för att hämta en API-nyckel
fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
    method: "POST", // Metoden är POST eftersom vi ska skapa en ny resurs (API-nyckeln)
    headers: {
        'x-zocom': apikey, // Header som specificerar att vi skickar JSON-data
        'Content-Type': 'application/json' // Anger att vi skickar JSON-data
    },
})

.then(response => response.json()) // Konverterar svaret till JSON-format
.then(data => {
    console.log('API-svar:', data); // Loggar hela API-svaret i konsolen
    console.log('Din API-nyckel är:', data.key); // Loggar endast API-nyckeln
    localStorage.setItem('apikey', data.key); // Sparar API-nyckeln i localStorage för framtida användning
    createTenant(data.Key, tenant);
})
.catch(error => {
    console.error('Ett fel uppstod när du hämtade API-nyckeln', error); // Loggar fel om något går snett
});

// Funktion för att skapa en "tenant" (en ny användare i API-systemet)
function createTenant(apikey, tenant) {
    // const tenantId = tenant.id;
    // const tenantName = tenant.name;

    
    fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants', {
        method: "POST", // POST används för att skapa en ny tenant
        headers: {
            'x-zocom': apikey, // Header som inkluderar API-nyckeln för autentisering
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
    })
    .then(response => {
        if (!response.ok) { // Kontrollera om svaret är framgångsrikt
            throw new Error(`HTTP-FEL! Status ${response.status}`); // Kasta ett fel om statusen inte är OK
        }
        return response.json(); // Konverterar svaret till JSON om det är lyckat
    })
    .then(data => {
        console.log('Tenant skapad', data); // Loggar information om den skapade tenanten
    })
    .catch(error => {
        console.error('Ett fel uppstod vid skapande av tenant:', error); // Loggar fel om något går snett
    });
}

