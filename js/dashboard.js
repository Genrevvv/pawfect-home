import { toTitleCase } from "./auxiliary.js";

export function dashBoardScript() {

    fetch('/get-all-orders')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            displayAllOrders(data);
        })

}

function displayAllOrders(orders) {
    const orderLog = document.getElementById('order-log');
    
    Object.values(orders).forEach(orderData => {
        const order = orderData.order;
        const products = orderData.products;

        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td class="product-details">
            </td>
            <td>${order.total_price}</td>
            <td>${order.created_at.split(' ')[0]}</td>
            <td>${toTitleCase(order.status)}</td>
        `;

        orderLog.append(tableRow);

        products.forEach(product => {
            const productDetails = tableRow.querySelector('.product-details');
            const div = document.createElement('div');
            div.innerHTML = `
                <span>${product.quantity}x</span>
                <span>${product.product_name}</span>
            `;
            
            productDetails.append(div);
        });
        
    });

}