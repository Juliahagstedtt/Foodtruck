export const API_KEY = "yum-2ngXkR6S02ijFrTP";
export const BASE_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";



const apiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys';

async function fetchApikey() {
 const response = await fetch ('${apiUrl}/keys', {
    method: 'POST',
 });
 if (!response.ok) throw new Error('Error: ${response.status}');
 const data = await response.json();
 localStorage.setItem('apiKey', data.key);
 console.log('API-nyckel hämtad:', data.key);   
}
fetchApikey();


async function createTenant(name) {
 const response = await fetch('${apiUrl}/tenants', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json',
        "x-zocom": apiKey,
    },
 });
 if (!response.ok) throw new Error('Error: ${response.status}');
 const data = await response.json();
 console.log('Tenant skapad:', data);
}
createTenant('Julia');