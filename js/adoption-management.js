export function adoptionManagementScript() {
    const adoptionLog = document.getElementById('adoption-log');

    fetch('/get-adoption-applications')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (!data) {
                const placeholderTr = document.getElementById('placeholder-tr');
                placeholderTr.style.display = 'block';
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
                        <span>View Details</span>
                    </td>`;

                adoptionLog.append(newApplicationRow);
            });
        });
}
