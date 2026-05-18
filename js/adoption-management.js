import { displayMessage, updateContent } from "./auxiliary.js";

export function adoptionManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');
    const adoptionLog = document.getElementById('adoption-log');

    fetch('/get-adoption-applications')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.length === 0) {
                const placeholderTr = document.getElementById('placeholder-tr');
                placeholderTr.style.display = 'table-row';
                return;
            }
            
            Object.entries(data).forEach(([appID, data]) => {
                const user = data.user;
                const pets = data.pets;
                const appData = data.adoption_application;

                const newApplicationRow = document.createElement('tr');
                newApplicationRow.innerHTML = `
                    <td>${appData.full_name}</td>
                    <td>${pets.length}</td>
                    <td class="contact-info">
                        <span>${appData.email_address}</span>
                        <span>${appData.phone_number}</span>
                    </td>
                    <td>${appData.status}</td>
                    <td>
                        <span class="view-details-btn">View Details</span>
                    </td>`;

                adoptionLog.append(newApplicationRow);

                const viewDetailsBtn = newApplicationRow.querySelector('.view-details-btn');
                viewDetailsBtn.onclick = async () => {
                    await updateContent('html/rev-adoption-app.html', overlayContainer);
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';

                    const closeBtn = document.getElementById('close-btn');
                    closeBtn.onclick = () => {
                        overlayContainer.style.visibility = 'hidden';
                        document.body.style.overflowY = 'visible';
                    }

                    const fullName = document.getElementById('full-name');
                    const phoneNumber = document.getElementById('phone-number');
                    const emailAddress = document.getElementById('email-address');
                    const homeAddress = document.getElementById('home-address');
                    const reason = document.getElementById('reason');
                    const existingPet = document.getElementById('existing-pet');

                    fullName.innerHTML = appData.full_name;
                    phoneNumber.innerHTML = appData.phone_number;
                    emailAddress.innerHTML = appData.email_address;
                    homeAddress.innerHTML = appData.home_address;
                    reason.innerHTML = appData.reason;
                    existingPet.innerHTML = appData.existing_pet;

                    const requestedPets = document.getElementById('requested-pets');
                    pets.forEach(pet => {
                        const petProfile = document.createElement('pet-profile');
                        petProfile.innerHTML = `            
                            <div class="pet-profile">
                                <img class="pet-image" src="${pet.image}" alt="">
                                <div>
                                    <div>${pet.pet_name}</div>
                                    <div>${pet.pet_type}</div>
                                    <div>Male • ${pet.pet_age}</div>
                                </div>
                            </div>`;
                        
                        requestedPets.append(petProfile);
                    });

                    const approveBtn = document.getElementById('approve-btn');
                    const rejectBtn = document.getElementById('reject-btn');

                    approveBtn.onclick = () => {
                        fetch('/approve-adoption-application')
                            .then(res => res.json())
                            .then(data => {
                                if (data.error !== null) {
                                    displayMessage(data.error);
                                    return;
                                }

                                displayMessage('Adoption application was approved');

                                overlayContainer.style.visibility = 'hidden';
                                document.body.style.overflowY = 'visible';
                            });
                    }

                    approveBtn.onclick = () => {
                        fetch('/reject-adoption-application')
                            .then(res => res.json())
                            .then(data => {
                                if (data.error !== null) {
                                    displayMessage(data.error);
                                    return;
                                } 

                                displayMessage('Adoption application was rejected');
                                overlayContainer.style.visibility = 'hidden';
                                document.body.style.overflowY = 'visible';
                            });
                    }

                    console.log(appData.status);
                    displayStatus(appData.status);

                    function displayStatus(status) {
                        const statusLabel = document.getElementById('status-label');
                        approveBtn.remove();
                        rejectBtn.remove();

                        if (status === 'approved') {
                            statusLabel.innerHTML = 'Approved';
                        }
                        
                        if (status === 'rejected') {
                            statusLabel.innerHTML = 'Rejected';
                        }

                        statusLabel.style.display = 'block';
                    }
                }
            });
        });
}

