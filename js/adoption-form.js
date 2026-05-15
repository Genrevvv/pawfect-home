window.history.pushState(null, "", "/adoption-form");

const selectPetBtn = document.getElementById('select-pet-btn');
const overlayContainer = document.getElementById('overlay-container');
const pets = [];

fetch('/get-pets')
    .then(res => res.json())
    .then(data => {
        console.log(data);

        pets = data['pets'];

        selectPetBtn.onclick = () => {
            await updateContent('html/select-pet.html');

            overlayContainer.style.visibility = 'visible';
            document.body.style.overflowY = 'hidden';

            const selectPetUI = document.getElementById('select-pet-ui');
        }
    });

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    overlayContainer.innerHTML = html;
}