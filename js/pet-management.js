import { displayMessage } from "./auxiliary.js";

export function petManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');

    const petName = document.getElementById('pet-name');
    const petAge = document.getElementById('pet-age');
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
        petData.append('pet_type', petType.value);
        petData.append('pet_description', petDescription.value);
        petData.append('image', imageFile);       
        
        for (const [key, value] of petData.entries()) {
            console.log(key, value);
        }

        const options = {
            method: 'POST',
            body: petData
        }
        
        fetch('/add-pet', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['error'] != null) {
                    displayMessage(data['error']);
                    return;
                }

                displayMessage('Pet was added successfully');
                addPetElement(data['pet_data']);
            });
    }

    function loadPets() {
        fetch('/get-pets')
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['pets'] === null) {
                    console.log('hell nah');
                    return;
                }

                for (let i = 0; i < data['pets'].length; i++) {
                    addPetElement(data['pets'][i]);
                }
            });
    }

    function addPetElement(petData) {
        console.log('add pet element');

        const editPetId = `edit-pet-${petData['id']}`;
        const deletePetId = `delete-pet-${petData['id']}`;

        const petCards = document.getElementById('pet-cards');
        const newPetCard = document.createElement('div');
        newPetCard.classList.add('pet-card');
        newPetCard.innerHTML = `<div class="pet-image">
                                    <img src="${petData.image}">
                                </div>
                                <div class="details-container">
                                    <div class="container-1">
                                        <span class="pet-name">${petData['pet_name']}</span>
                                        <span class="pet-description">${petData['pet_description']}</span>
                                    </div>
                                    <div class="container-2">
                                        <span class="pet-age">${petData['pet_age']}</span>
                                    </div>
                                    <div class="options">
                                        <i id="${editPetId}" class="fa-regular fa-pen-to-square"></i>
                                        <i id="${deletePetId}" class="fa-solid fa-trash"></i>
                                    </div>
                                </div>`;

        petCards.append(newPetCard);
        
        const editButton = document.getElementById(editPetId);
        editButton.onclick = () => {
            fetch('html/edit-pet.html')
                .then(res => res.text())
                .then(html => {
                    overlayContainer.innerHTML = html;
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';
                    
                    const editPetName = document.getElementById('edit-pet-name');
                    const editPetAge = document.getElementById('edit-pet-age');
                    const editPetType = document.getElementById('edit-pet-type');
                    const editPetDescription = document.getElementById('edit-pet-description');
                    const editUploadedImageArea = document.getElementById('edit-uploaded-image-area');
                    const updatePet = document.getElementById('update-pet');

                    editPetName.value = petData['pet_name'];
                    editPetAge.value = petData['pet_age'];
                    editPetType.value = petData['pet_type'];
                    editPetDescription.value = petData['pet_description'];
                    displayImage(petData['image'], editUploadedImageArea);

                    updatePet.onclick = () => {
                        updatePetData({
                            pet_id: petData['id'],
                            pet_name: editPetName.value,
                            pet_age: editPetAge.value,
                            pet_type: editPetType.value,
                            pet_description: editPetDescription.value,
                            image: imageFile || petData['image']
                        }, newPetCard);
                    }
                });
        }

        const deleteButton = document.getElementById(deletePetId);
        deleteButton.onclick = () => {
            const options = {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({pet_id: petData['id']})
            };

            fetch('/delete-pet', options)
                .then(res => res.json())
                .then(data => {
                    newPetCard.remove();
                    displayMessage(`${petData['pet_name']} deleted successfully`);
                });
        }

    }

    function updatePetData(updatedPetData, petCard) {
        const updatedData = new FormData();
        updatedData.append('pet_id', updatedPetData['pet_id']);
        updatedData.append('pet_name', updatedPetData['pet_name']);
        updatedData.append('pet_age', updatedPetData['pet_age']);
        updatedData.append('pet_type', updatedPetData['pet_type']);
        updatedData.append('pet_description', updatedPetData['pet_description']);   
        updatedData.append('image', updatedPetData['image']);     

        for (const [key, value] of updatedData.entries()) {
            console.log(key, value);
        }

        const options = {
            method: 'POST',
            body: updatedData
        }

        fetch('/update-pet', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['error'] != null) {
                    displayMessage(data['error']);
                    return;
                }
                
                displayMessage('Pet was updated successfully');

                overlayContainer.innerHTML = '';
                overlayContainer.style.visibility = 'hidden';
                document.body.style.overflowY = 'visible';

                petCard.querySelector('.pet-name').innerText = updatedPetData['pet_name'];
                petCard.querySelector('.pet-age').innerText = updatedPetData['pet_age'];
                petCard.querySelector('.pet-description').innerText = updatedPetData['pet_description'];
                petCard.querySelector('.pet-image img').src = updatedPetData['image'];
            });
    }

    function uploadImage(formDiv) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                imageFile = e.target.files[0];

                // I don't think this will even happen tho, lol
                // Code: based from SocialMD's, lol
                    // https://github.com/Genrevvv/SocialMD/blob/main/js/create-post.js

                // Miss na kita

                if (!imageFile) {
                    return;
                }

                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const imageData = fileReader.result;
                    displayImage(imageData, formDiv);
                }

                fileReader.readAsDataURL(imageFile);
            }
            input.click();
    }

    function displayImage(imageData, formDiv) {
        const innerSpan = formDiv.getElementsByTagName('span')[0];

        // Display image on upload image area
        formDiv.style.backgroundImage = `url('${imageData}')`;
        formDiv.style.borderStyle = 'solid';
        innerSpan.style.visibility = 'hidden';
        
        const removeImage = formDiv.querySelector('.remove-image');
        removeImage.classList.add('holds-image');

        removeImage.onclick = (e) => {
            e.stopPropagation();
            
            removeImage.classList.remove('holds-image');

            // Reset upload image area
            formDiv.style.backgroundImage = 'none';
            formDiv.style.borderStyle = 'dashed';
            innerSpan.style.visibility = 'visible';
        }

        formDiv.onclick = () => {
            uploadImage(formDiv);
        };
    }
}
