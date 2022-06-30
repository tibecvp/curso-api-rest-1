const API_URL_RANDOM = "https://api.thedogapi.com/v1/images/search?limit=3&api-key=18ba8935-ddf0-4d43-b8f8-97eabe082bac";
const API_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";
const API_KEY = "18ba8935-ddf0-4d43-b8f8-97eabe082bac";

const spanError = document.getElementById('error');
const errorContainer = document.getElementById('error-container');
const dropZone = document.getElementById('drop-zone');
const dropZoneImage = document.getElementById('preview-image');
const dropZoneIcon = document.getElementById('drop-zone-icon');
const dropZoneText = document.getElementById('drop-zone-text');
const fileName = document.getElementById('file-name');

async function loadRandomDogs() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random', data);

    if (res.status !== 200) {
        spanError.innerHTML = "RANDOM | Hubo un error: " + res.status + " - " + data.message;
        errorContainer.style.display = "flex";
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('random-dogs-btn1');
        const btn2 = document.getElementById('random-dogs-btn2');
        const btn3 = document.getElementById('random-dogs-btn3');

        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavoriteDog(data[0].id);
        btn2.onclick = () => saveFavoriteDog(data[1].id);
        btn3.onclick = () => saveFavoriteDog(data[2].id);
    }
}

loadRandomDogs();

async function loadFavoriteDogs() {
    // const res = await fetch(API_URL_FAVORITES);
    const res = await fetch(API_URL_FAVORITES, {
        method: "GET",
        headers: { "x-api-key": "18ba8935-ddf0-4d43-b8f8-97eabe082bac" }
    });
    const data = await res.json();

    console.log('Favorites', data);

    if (res.status !== 200) {
        spanError.innerHTML = "FAVORITE | Hubo un error: " + res.status + " - " + data.message;
        errorContainer.style.display = "flex";
    } else {
        const section = document.getElementById('favorite-dogs');
        section.innerHTML = "";
        data.forEach(dog => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Delete');

            btn.appendChild(btnText);
            btn.classList.add('secondary-btn');
            btn.onclick = () => deleteFavoriteDog(dog.id);
            img.src = dog.image.url;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
        });
    }
}

loadFavoriteDogs();


function closeError() {
    errorContainer.style.display = "none";
}

async function saveFavoriteDog(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            "x-api-key": "18ba8935-ddf0-4d43-b8f8-97eabe082bac"
        },
        body: JSON.stringify({
            image_id: id
        }),
    });
    const data = await res.json();

    console.log('Save', res);

    if (res.status !== 200) {
        spanError.innerHTML = "FAVORITE | Hubo un error: " + res.status + " - " + data.message;
        errorContainer.style.display = "flex";
    } else {
        console.log('Mi perro se guardó en favoritos!');
        loadFavoriteDogs();
    }
}

async function deleteFavoriteDog(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: { "x-api-key": "18ba8935-ddf0-4d43-b8f8-97eabe082bac" }
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "FAVORITE | Hubo un error: " + res.status + " - " + data.message;
        errorContainer.style.display = "flex";
    } else {
        console.log('Mi perro se eliminó de favoritos!');
        loadFavoriteDogs();
    }
}

/************** UPLOAD IMAGE WITH DROP ZONE */

document.getElementById('add-image-input').addEventListener('change', (event) => {
    window.selectedFile = event.target.files[0];
    // document.getElementById('file_name').innerHTML = window.selectedFile.name;
        fileName.innerHTML = window.selectedFile.name;
        fileName.style.display = 'inline-block';

        loadImagePreview(window.selectedFile);
});

document.getElementById('upload-image-btn').addEventListener('click', (event) => {
    if (window.selectedFile !== undefined) {
        uploadFile(window.selectedFile);
    } else {
        fileName.innerHTML = "*No file has been selected.";
        fileName.style.color = "crimson";
        fileName.style.display = "block";
    }
});

if (window.FileList && window.File) {
    dropZone.addEventListener('dragover', event => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop', event => {
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer.files;
        window.selectedFile = files[0];
        fileName.innerHTML = window.selectedFile.name;
        fileName.style.display = 'inline-block';

        loadImagePreview(window.selectedFile);
    });
}

function loadImagePreview(file) {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        dropZoneIcon.style.display = "none";
        dropZoneText.style.display = "none";
        dropZoneImage.src = reader.result;
        dropZoneImage.style.display = 'block';
    }
}

async function uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file);

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            "x-api-key": API_KEY
        },
        body: formData
    });

    const data = await res.json();

    if (res.status < 200 && res.status > 300) {
        spanError.innerHTML = "FAVORITE | Hubo un error: " + res.status + " - " + data.message;
        errorContainer.style.display = "flex";
    } else {
        console.log('My doggys picture was uploaded!');
        saveFavoriteDog(data.id);
        fileName.innerHTML = 'My doggy`s picture was uploaded!';
        fileName.style.color = "var(--light-blue)";
        window.selectedFile = undefined;
        resetDropZone();
    }
}

function resetDropZone() {
    dropZoneImage.style.display = "none";
    dropZoneIcon.style.display = "flex";
    dropZoneText.style.display = "inline-block";
}