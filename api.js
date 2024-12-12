const apiKey = "yum-BHRyCR5Lgznl28Tr"; 
const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu"; 
const menuDiv = document.getElementById('menu');

fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
   method: 'POST',
   headers: {
       'Accept': 'application/json',
       'x-zocom': 'yum-BHRyCR5Lgznl28Tr',
       'Content-Type': 'application/json'
   },
   body: JSON.stringify({ "name": "zocom" })
})
.then(response => response.json())
.then(data => console.log(data)) 
.catch(error => console.error('Error:', error));





