document.addEventListener('DOMContentLoaded', () => {
    fetchProduct('products-table');

    const removeForm = document.querySelector('#removeProduct');
    removeForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
        const productId = removeForm.querySelector('input[name="product_id"]').value;

        const data = {
            product_id: productId
        };


        const token = localStorage.getItem('authToken');
        // Make DELETE request to remove the product
        fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Product successfully removed');
                    fetchProduct('products-table'); // Re-fetch products to update the table
                } else {
                    alert('Failed to remove product');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

function fetchProduct(tableId) {
    fetch('http://localhost:3000/api/product')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            populateProductTable(data.products, tableId);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function populateProductTable(products, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing rows

    products.forEach(product => {
        let imagePath = product.image_url.startsWith('/')
            ? product.image_url.substring(1) // Remove leading '/'
            : product.image_url;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.category_id}</td>
            <td><img src="${imagePath}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
        `;

        // Add click event listener to row
        row.addEventListener('click', () => {
            fillRemoveForm(product);
        });

        tableBody.appendChild(row);
    });
}

function fillRemoveForm(product) {
    const removeForm = document.querySelector('#removeProduct');
    // Add a hidden field to store the product ID for updating
    if (!removeForm.querySelector('input[name="product_id"]')) {
        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.name = 'product_id';
        productIdInput.value = product.product_id;
        removeForm.appendChild(productIdInput);
    } else {
        removeForm.querySelector('input[name="product_id"]').value = product.product_id;
    }
}