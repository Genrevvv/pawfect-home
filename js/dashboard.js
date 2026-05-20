import { toTitleCase } from "./auxiliary.js";

export function dashBoardScript() {

    fetch('/get-all-orders')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            displayAllOrders(data);
        })


    fetch('/fetch-overview-data')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            displayOverviewContent(data);
        });
}

function displayOverviewContent(overviewData) {
    const weeklySales = document.getElementById('weekly-sales');
    const totalOrders = document.getElementById('total-orders');
    const pendingApplications = document.getElementById('pending-applications');
    const topProducts = document.getElementById('top-products');

    weeklySales.innerHTML = `₱${overviewData.weekly_sales}`;
    totalOrders.innerHTML = `${overviewData.total_orders} Order this week`;
    pendingApplications.innerHTML = `${overviewData.pending_applications} Pending`;

    const topProductsData = overviewData.top_products;
    Object.values(topProductsData).forEach(productData => {
        const li = document.createElement('li');
        li.innerHTML = `${productData.product_name}`;
        
        topProducts.append(li);
    });
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
            <td>
                <select>
                    <option value="pending">Pending</option>
                    <option value="to ship">To Ship</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </td>
        `;

        orderLog.append(tableRow);
        
        const selection = tableRow.querySelector('select');
        selection.value = order.status;

        selection.onchange = (e) => {
            const status = e.target.value;
            console.log(status);

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: order.id,
                    status: status
                })
            };

            fetch('/update-order-status', options)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    order.status = status;
                });
        }
        
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