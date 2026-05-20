import { toTitleCase } from "./auxiliary.js";

window.history.pushState(null, "", "/adoption-status");

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
            <td>
                <span class="status">
                    ${toTitleCase(adoptionApplication.status)}
                </span>
            </td>
        `;
        
        tableBody.append(tableRow);

        const petTableBody = tableRow.querySelector('.pet-table-body');
        const status = tableRow.querySelector('.status');

        status.classList.add(adoptionApplication.status);

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