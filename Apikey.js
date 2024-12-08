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