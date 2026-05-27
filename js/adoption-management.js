import { toTitleCase, displayMessage, updateContent } from "./auxiliary.js";

export function adoptionManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');
    const adoptionLog = document.getElementById('adoption-log');

    fetch('/get-all-adoption-applications')
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if (!data || Object.keys(data).length === 0) {
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
                    <td class="status">${toTitleCase(appData.status)}</td>
                    <td>
                        <span class="view-details-btn">View Details</span>
                    </td>
                `;

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
                    };

                    const statusLabel = document.getElementById('status-label');
                    const approveBtn = document.getElementById('approve-btn');
                    const rejectBtn = document.getElementById('reject-btn');

                    statusLabel.style.display = 'none';
                    statusLabel.innerHTML = '';

                    approveBtn.style.display = 'inline-block';
                    rejectBtn.style.display = 'inline-block';

                    document.getElementById('full-name').innerHTML = appData.full_name;
                    document.getElementById('phone-number').innerHTML = appData.phone_number;
                    document.getElementById('email-address').innerHTML = appData.email_address;
                    document.getElementById('home-address').innerHTML = appData.home_address;

                    document.getElementById('house-type').innerHTML = toTitleCase(appData.house_type);
                    document.getElementById('yard-type').innerHTML = toTitleCase(appData.yard_type);

                    document.getElementById('reason').innerHTML = appData.reason;
                    document.getElementById('existing-pet').innerHTML = appData.existing_pet;

                    const requestedPets = document.getElementById('requested-pets');
                    requestedPets.innerHTML = ''; 

                    pets.forEach(pet => {
                        const petProfile = document.createElement('div');

                        petProfile.innerHTML = `
                            <div class="pet-profile">
                                <img class="pet-image" src="${pet.image}" alt="">
                                <div>
                                    <div>${pet.pet_name}</div>
                                    <div>${pet.pet_type}</div>
                                    <div>${pet.pet_sex} • ${pet.pet_age}</div>
                                </div>
                            </div>
                        `;

                        requestedPets.appendChild(petProfile);
                    });

                    function applyStatus(status) {
                        const statusLabel = document.getElementById('status-label');

                        if (!status || status === 'pending') return;

                        approveBtn.style.display = 'none';
                        rejectBtn.style.display = 'none';

                        statusLabel.style.display = 'block';
                        statusLabel.innerHTML = toTitleCase(status);
                    }

                    applyStatus(appData.status);

                    const options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({application_id: appID})
                    }

                    approveBtn.onclick = () => {
                        fetch('/approve-adoption-application', options)
                            .then(res => res.json())
                            .then(data => {

                                if (data.error) {
                                    displayMessage(data.error);
                                    return;
                                }

                                displayMessage('Application approved');

                                newApplicationRow.querySelector('.status').innerHTML = 'Approved';

                                overlayContainer.style.visibility = 'hidden';
                                document.body.style.overflowY = 'visible';

                                appData.status = 'approved'
                            });
                    };

                    rejectBtn.onclick = () => {
                        fetch('/reject-adoption-application', options)
                            .then(res => res.json())
                            .then(data => {

                                if (data.error) {
                                    displayMessage(data.error);
                                    return;
                                }

                                displayMessage('Application rejected');

                                newApplicationRow.querySelector('.status').innerHTML = 'Rejected';

                                overlayContainer.style.visibility = 'hidden';
                                document.body.style.overflowY = 'visible';

                                appData.status = 'rejected';
                            });
                    };
                };
            });
        });
}