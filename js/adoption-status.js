import { displayMessage, toTitleCase } from "./auxiliary.js";

window.history.pushState(null, "", "/adoption-status");

const overlayContainer = document.getElementById('overlay-container');
const tableBody = document.getElementById('table-body');

fetch('/get-adoption-applications')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        displayAdoptionLogs(data);
    });

function displayAdoptionLogs(applications) {
    Object.values(applications).forEach(appData => {
        const adoptionApplication = appData.adoption_application;
        const pets = appData.pets;

        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${adoptionApplication.id}</td>
            <td>
                <table class="inner-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Age</th>
                            <th>Sex</th>
                        </tr>
                    </thead>
                    <tbody class="pet-table-body"></tbody>
                </table>
            </td>
            <td class="last-column">
                <span class="status">
                    ${toTitleCase(adoptionApplication.status)}
                </span>
            </td>
        `;
        
        tableBody.append(tableRow);

        if (adoptionApplication.status === 'pending') {
                const lastColumn = tableRow.querySelector('.last-column');
    
                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('cancel-btn');
                cancelBtn.innerHTML = 'Cancel request';
    
                lastColumn.append(cancelBtn);
    
                cancelBtn.onclick = () => {
                    const confirmCancelUI = document.createElement('div');
                    confirmCancelUI.id = 'confirm-cancel-ui';
                    confirmCancelUI.innerHTML = `
                        <span>Are you sure you want to cancel your order?</span>
                        <div class="cancel-options">
                            <button class="yes-cancel">Yes</button>
                            <button class="no-cancel">No</button>
                        </div>
                    `;
    
                    overlayContainer.append(confirmCancelUI);
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';                
                    
                    const yesCancel = confirmCancelUI.querySelector('.yes-cancel');
                    const noCancel = confirmCancelUI.querySelector('.no-cancel');
    
                    yesCancel.onclick = () => {
                        const options = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 'application_id': adoptionApplication.id })
                        }
    
                        fetch('/cancel-adoption-application', options)
                            .then(res => res.json())
                            .then(data => {
                                const statusSpan = tableRow.querySelector('.status');
                                statusSpan.innerHTML = 'Cancelled';
                                statusSpan.className = 'status rejected';
                                cancelBtn.remove();
    
                                displayMessage('Order has been cancelled');
                                overlayContainer.click();
                            });
                    }
                    
                    noCancel.onclick = () => {
                        overlayContainer.click();
                    }
                }
            }

        const petTableBody = tableRow.querySelector('.pet-table-body');
        const status = tableRow.querySelector('.status');
        status.classList.add(adoptionApplication.status);
        
        switch (adoptionApplication.status) {
            case 'approved':
                status.classList.add('approved');
                break;
            case 'cancelled':
                status.classList.add('rejected');
            default:
                status.classList.add(adoptionApplication.status);
        }

        pets.forEach(pet => {
            const innerTableRow = document.createElement('tr');
            innerTableRow.innerHTML = `
                <td>${pet.pet_name}</td>
                <td>${pet.pet_breed}</td>
                <td>${pet.pet_age}</td>
                <td>${pet.pet_sex}</td>
            `;

            petTableBody.append(innerTableRow);
        });
    });
}