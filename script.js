// Éléments du DOM
const postIdInput = document.getElementById('postIdInput');
const fetchButton = document.getElementById('fetchButton');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');
const postContainer = document.getElementById('postContainer');
const postTitleElement = document.getElementById('postTitle');
const postBodyElement = document.getElementById('postBody');
const postTagsElement = document.getElementById('postTags');
const postIdElement = document.getElementById('postIdDisplay');
const postReactionsElement = document.getElementById('postReactions');
const userIdElement = document.getElementById('userId');

// Cache pour éviter de refaire des requêtes pour les mêmes posts
const postCache = {};

// Fonction  asynchrone pour récupérer un post
async function fetchPost(id) {
    // Réinitialiser l'interface
    errorMessage.style.display = 'none';
    postContainer.style.display = 'none';
    loader.style.display = 'block';    
    
    // Vérifier si le post est déjà dans le cache
    if (postCache[id]) {
        displayPost(postCache[id]);
        return;
    }
           
    // Faire la requête API, avec une gestion d'erreur
    fetch(`https://dummyjson.com/posts/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Mettre en cache
            postCache[id] = data;
            displayPost(data);
        })
        .catch(error => {
            showError(`Error retrieving post: ${error.message}`);
        });
}

// Fonction pour afficher un post
function displayPost(post) {
    // Cacher le loader
    loader.style.display = 'none';
                   
    // Remplir les données du post
    postTitleElement.textContent = post.title;
    postBodyElement.textContent = post.body;
    postIdElement.textContent = post.id;
    postReactionsElement.textContent = post.reactions;
    userIdElement.textContent = post.userId;
                   
    // Afficher les tags
    postTagsElement.innerHTML = '';
    post.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        postTagsElement.appendChild(tagElement);
    });
                   
    postContainer.style.display = 'block';
}
       
// Au chargement de la page...
document.addEventListener('DOMContentLoaded', () => {
    // ..cacher l'élément loader ('Chargement')
    loader.style.display = 'none';
    // ...charger le post ID 1 par défaut
    fetchPost(1);
    
    // ...récupérer la valeur dans l'input type=text
    fetchButton.addEventListener('click', () => {
        const id = parseInt(postIdInput.value);
        if (id < 1 || id > 100) {
            showError("Post must be between 1 and 100");
            return;
        }
        fetchPost(id);
    });
});

// Fonction pour afficher une erreur
function showError(message) {
    loader.style.display = 'none';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}