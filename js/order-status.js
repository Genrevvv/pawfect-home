import { toTitleCase } from "./auxiliary.js";

window.history.pushState(null, "", "/order-status");

const tableBody = document.getElementById('table-body');

fetch('/get-order-by-user')
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
                <table class="pet-table">
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
            <td>
                <span class="status">
                    ${toTitleCase(order.status)}
                </span>
            </td>
        `;
        
        tableBody.append(tableRow);

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