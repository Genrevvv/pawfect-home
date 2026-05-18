import { updateContent } from "./auxiliary.js";

export async function petContentPreview(petData) {
    const overlayContainer = document.getElementById('overlay-container');

    await updateContent('html/content-preview.html', overlayContainer);
    overlayContainer.style.visibility = 'visible';
    document.body.style.overflowY = 'hidden';
    
    const petImage = document.getElementById('pet-image');
    const petName = document.getElementById('pet-name');
    const breed = document.getElementById('breed');
    const age = document.getElementById('age');
    const sex = document.getElementById('sex');
    const description = document.getElementById('description');

    petImage.src = petData['image'];
    petName.innerHTML = petData['pet_name'];
    breed.innerHTML = petData['pet_breed'];
    age.innerHTML = petData['pet_age'];
    sex.innerHTML = petData['pet_sex'] ?? 'skibidi';
    description.innerHTML = petData['pet_description'];

    const closeBtn = document.getElementById('close-btn');
    closeBtn.onclick = () => {
        overlayContainer.style.visibility = 'hidden';
        document.body.style.overflowY = 'visible';
    }

    const adoptNowBtn = document.getElementById('adopt-now-btn');
    adoptNowBtn.onclick = () => {
        const existing = JSON.parse(localStorage.getItem('form_data')) || {};

        const updatedData = {
            ...existing,
            selected_pets: [petData]
        };

        localStorage.setItem('form_data', JSON.stringify(updatedData));

        window.location.href = '/adoption-form';
    };

}