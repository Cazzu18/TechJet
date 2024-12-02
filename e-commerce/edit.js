document.addEventListener('DOMContentLoaded', () => {
    fetchProducts('product-table');

    const editForm = document.querySelector('#editProduct');
    editForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission
        const productId = editForm.querySelector('input[name="product_id"]').value;
        const formData = new FormData(editForm);

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            stock_quantity: formData.get('stock'),
            category_id: formData.get('category'),
        };

        const imageFile = formData.get('image'); // Get the uploaded image file

        // Check if an image file is uploaded
        if (imageFile) {
            try {
                // Upload the image to the server

                const imageUploadResponse = await uploadImageToServer(imageFile);
                const imageUrl = imageUploadResponse.url; // Assuming the server returns the image URL
                data.image_url = imageUrl;

            } catch (error) {
                console.error('Image upload failed:', error);
                alert('Failed to upload image');
                return;
            }
        } else {
            data.image_url = ''; // No image uploaded, leave the field empty or use a default
        }

        const token = localStorage.getItem('authToken');
        // Make PUT request to update the product
        fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Product updated successfully');
                    fetchProducts('product-table'); // Re-fetch products to update the table
                } else {
                    alert('Failed to update product');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

// Function to upload image to the server
async function uploadImageToServer(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('http://localhost:3000/api/product/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data; // The response should contain the image URL or other details
}

function fetchProducts(tableId) {
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
        row.addEventListener('mousedown', () => {
            filleditForm(product);
        });

        tableBody.appendChild(row);
    });
}

function filleditForm(product) {
    const editForm = document.querySelector('#editProduct');

    editForm.querySelector('input[name="name"]').value = product.name;
    editForm.querySelector('textarea[name="description"]').value = product.description;
    editForm.querySelector('input[name="price"]').value = product.price;
    editForm.querySelector('input[name="stock"]').value = product.stock_quantity;
    editForm.querySelector('input[name="category"]').value = product.category_id;

    // Set image (you may want to display the current image in the form, as it's required)
    const imagePreview = editForm.querySelector('#image-preview');
    //editForm.querySelector('input[type="file"]').value = ''; // You can handle file upload separately if needed

    if (imagePreview) {
        imagePreview.src = product.image_url || '';
    }

    // Add a hidden field to store the product ID for updating
    if (!editForm.querySelector('input[name="product_id"]')) {
        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.name = 'product_id';
        productIdInput.value = product.product_id;
        editForm.appendChild(productIdInput);
    } else {
        editForm.querySelector('input[name="product_id"]').value = product.product_id;
    }
}