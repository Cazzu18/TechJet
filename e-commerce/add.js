document.addEventListener('DOMContentLoaded', () => {

    const addForm = document.querySelector('#addProduct');
    addForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission
        const formData = new FormData(addForm);

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
        fetch(`http://localhost:3000/api/product/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Product successfully added');
                    fetchProducts(); // Re-fetch products to update the table
                } else {
                    alert('Failed to add product');
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