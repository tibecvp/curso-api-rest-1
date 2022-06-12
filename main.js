console.log('Hello, world!');

const URL = "https://api.thedogapi.com/v1/images/search";

callApi();

function callApi() {
    fetch(URL)
    .then(res => res.json())
    .then(data => {
        const img = document.querySelector('img');
        img.src = data[0].url;
    });
}

function changeDog () {
    callApi();
}