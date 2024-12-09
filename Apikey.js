
fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
})

.then(response => response.json())
.then(data => {
    console.log('API-svar:', data);
    console.log('Din API-nyckel är:', data.key); //Visar nyckel i konsolem
    //Spara nyckel i Localstorage
    localStorage.setItem('apiKey', data.key); 
})
.catch(error => {
    console.error('Ett fel uppstod när du hämtade API-nyckeln', error);
});


function createTenant(apiKey, name) {
    const bodyToSend = { name: name };

    fetch ('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants', {

        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-zocom': apiKey
        },
        body: JSON.stringify(bodyToSend)
})
.then(response => {
    if (!response.ok) {
        throw new Error('HTTP-FEL! Status ${response.status}');
    }
    return response.json();
})
.then(data => {
    console.log('Tenant skapad', data);
})
.catch(error => {
    console.error('Ett fel uppstod vid skapande av tenant:', error);
});
}

const apiKey = localStorage.getItem('apiKey');
createTenant(apiKey, 'Julia');