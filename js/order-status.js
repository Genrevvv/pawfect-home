import { displayMessage, toTitleCase } from "./auxiliary.js";

window.history.pushState(null, "", "/order-status");

const overlayContainer = document.getElementById('overlay-container');
const tableBody = document.getElementById('table-body');

fetch('/get-user-order')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        displyOrderLogs(data);
    });

function displyOrderLogs(orders) {
    Object.values(orders).forEach(orderData => {
        const order = orderData.order;
        const products = orderData.products;

        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${order.id}</td>
            <td>
                <table class="inner-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody class="pet-table-body"></tbody>
                </table>
            </td>
            <td>₱${order.total_price}</td>
            <td class="last-column">
                <span class="status">
                    ${toTitleCase(order.status)}
                </span>
            </td>
        `;
        
        tableBody.append(tableRow);

        if (order.status === 'pending' || order.status === 'to ship') {
            const lastColumn = tableRow.querySelector('.last-column');

            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add('cancel-btn');
            cancelBtn.innerHTML = 'Cancel Order';

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
                        body: JSON.stringify({
                            order_id: order.id,
                            status: 'cancelled',
                            products: products
                        })
                    }

                    fetch('/update-order-status', options)
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

        const productTableBody = tableRow.querySelector('.pet-table-body');
        const status = tableRow.querySelector('.status');

        switch (order.status) {
            case 'delivered':
                status.classList.add('approved');
                break;
            case 'cancelled':
                status.classList.add('rejected');
            default:
                status.classList.add('pending');
        }
        
        products.forEach(product => {
            const innerTableRow = document.createElement('tr');
            innerTableRow.innerHTML = `
                <td>${product.product_name}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
            `;

            productTableBody.append(innerTableRow);
        });
    });
}