const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

fetch('/fetch-all-data')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });

searchBtn.onclick = () => {
    console.log('search');
    console.log(searchInput.value);
}