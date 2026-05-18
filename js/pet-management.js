import { displayMessage } from "./auxiliary.js";

export function petManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');

    const petName = document.getElementById('pet-name');
    const petAge = document.getElementById('pet-age');
    const petSex = document.getElementById('pet-sex');
    const petBreed = document.getElementById('pet-breed');
    const petType = document.getElementById('pet-type');
    const petDescription = document.getElementById('pet-description');
    const uploadImageArea = document.getElementById('upload-image-area');
    const addPet = document.getElementById('add-pet');

    let imageFile = null;

    loadPets();

    uploadImageArea.onclick = () => {
        uploadImage(uploadImageArea);
    };

    addPet.onclick = () => {
        const petData = new FormData();
        petData.append('pet_name', petName.value);
        petData.append('pet_age', petAge.value);
        petData.append('pet_sex', petSex.value);
        petData.append('pet_breed', petBreed.value);
        petData.append('pet_type', petType.value);
        petData.append('pet_description', petDescription.value);
        petData.append('image', imageFile);

        fetch('/add-pet', {
            method: 'POST',
            body: petData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return displayMessage(data.error);

            displayMessage('Pet was added successfully');
            addPetElement(data.pet_data);
        });
    };

    function loadPets() {
        fetch('/get-pets')
            .then(res => res.json())
            .then(data => {
                if (!data.pets) return;

                data.pets.forEach(pet => addPetElement(pet));
            });
    }

    function addPetElement(petData) {
        const petCards = document.getElementById('pet-cards');

        const newPetCard = document.createElement('div');
        newPetCard.classList.add('pet-card');

        newPetCard.innerHTML = `
            <div class="pet-image">
                <img src="${petData.image}">
            </div>
            <div class="details-container">
                <div class="container-1">
                    <span class="pet-name">${petData.pet_name}</span>
                    <span class="pet-description">${petData.pet_description}</span>
                </div>
                <div class="container-2">
                    <span class="pet-age">${petData.pet_age}</span>
                </div>
                <div class="options">
                    <i id="edit-pet-${petData.id}" class="fa-regular fa-pen-to-square"></i>
                    <i id="delete-pet-${petData.id}" class="fa-solid fa-trash"></i>
                </div>
            </div>
        `;

        petCards.append(newPetCard);

        const editButton = document.getElementById(`edit-pet-${petData.id}`);

        editButton.onclick = () => {
            fetch('html/edit-pet.html')
                .then(res => res.text())
                .then(html => {
                    overlayContainer.innerHTML = html;
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';

                    const editPetName = document.getElementById('edit-pet-name');
                    const editPetAge = document.getElementById('edit-pet-age');
                    const editPetSex = document.getElementById('edit-pet-sex');
                    const editPetBreed = document.getElementById('edit-pet-breed');
                    const editPetType = document.getElementById('edit-pet-type');
                    const editPetDescription = document.getElementById('edit-pet-description');
                    const updatePet = document.getElementById('update-pet');
                    const editUploadedImageArea = document.getElementById('edit-uploaded-image-area');

                    // load current data (IMPORTANT: uses live object)
                    editPetName.value = petData.pet_name;
                    editPetAge.value = petData.pet_age;
                    editPetSex.value = petData.pet_sex;
                    editPetBreed.value = petData.pet_breed;
                    editPetType.value = petData.pet_type;
                    editPetDescription.value = petData.pet_description;

                    displayImage(petData.image, editUploadedImageArea);

                    updatePet.onclick = () => {
                        updatePetData({
                            pet_id: petData.id,
                            pet_name: editPetName.value,
                            pet_age: editPetAge.value,
                            pet_sex: editPetSex.value,
                            pet_breed: editPetBreed.value,
                            pet_type: editPetType.value,
                            pet_description: editPetDescription.value,
                            image: imageFile || petData.image
                        }, newPetCard, petData);
                    };
                });
        };

        const deleteButton = document.getElementById(`delete-pet-${petData.id}`);

        deleteButton.onclick = () => {
            fetch('/delete-pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pet_id: petData.id })
            })
            .then(res => res.json())
            .then(() => {
                newPetCard.remove();
                displayMessage(`${petData.pet_name} deleted successfully`);
            });
        };
    }

    function updatePetData(updatedPetData, petCard, petData) {
        const fd = new FormData();

        Object.entries(updatedPetData).forEach(([key, value]) => {
            fd.append(key, value);
        });

        fetch('/update-pet', {
            method: 'POST',
            body: fd
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return displayMessage(data.error);

            displayMessage('Pet was updated successfully');

            overlayContainer.innerHTML = '';
            overlayContainer.style.visibility = 'hidden';
            document.body.style.overflowY = 'visible';

            petCard.querySelector('.pet-name').innerText = updatedPetData.pet_name;
            petCard.querySelector('.pet-age').innerText = updatedPetData.pet_age;
            petCard.querySelector('.pet-description').innerText = updatedPetData.pet_description;
            petCard.querySelector('.pet-image img').src = updatedPetData.image;

            Object.assign(petData, updatedPetData);
        });
    }

    function uploadImage(formDiv) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            imageFile = e.target.files[0];
            if (!imageFile) return;

            const reader = new FileReader();
            reader.onload = () => {
                displayImage(reader.result, formDiv);
            };
            reader.readAsDataURL(imageFile);
        };

        input.click();
    }

    function displayImage(imageData, formDiv) {
        const span = formDiv.getElementsByTagName('span')[0];

        formDiv.style.backgroundImage = `url('${imageData}')`;
        formDiv.style.borderStyle = 'solid';
        span.style.visibility = 'hidden';

        const removeImage = formDiv.querySelector('.remove-image');
        removeImage.classList.add('holds-image');

        removeImage.onclick = (e) => {
            e.stopPropagation();

            removeImage.classList.remove('holds-image');
            formDiv.style.backgroundImage = 'none';
            formDiv.style.borderStyle = 'dashed';
            span.style.visibility = 'visible';

            imageFile = null;
        };

        formDiv.onclick = () => uploadImage(formDiv);
    }
}