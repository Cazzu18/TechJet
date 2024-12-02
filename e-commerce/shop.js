// Example API endpoint
const apiEndpoint = "http://localhost:3000/api/product"; // Replace with your actual API URL

// Function to fetch and display products
const loadProducts = async () => {
    try {
        const response = await fetch(apiEndpoint); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json(); 
        console.log("Full API Response:", responseData);

        // Extract products array (check for wrapper)
        const products = responseData.products || responseData;

        if (Array.isArray(products)) {
            const productContainer = document.querySelector('.pro-container');
            productContainer.innerHTML = products.map(product => {
                // Check if the image URL has a leading '/', and remove it if it does
                let imageUrl = product.image_url;
                if (imageUrl.startsWith('/')) {
                    imageUrl = imageUrl.substring(1); // Remove the leading '/'
                }

                return `
                    <div class="pro">
                        <a href="product-details.html?id=${product.product_id}">
                            <img src="${imageUrl}" alt="${product.name}">
                            <div class="des">
                                <span>${product.category_id ? `Category: ${product.category_id}` : 'No Category'}</span>
                                <h5>${product.name}</h5>
                                <h6>${product.description}</h6>
                                <div class="star">
                                    ${'<i class="fas fa-star"></i>'.repeat(product.rating || 0)}
                                </div>
                                <h4>$${product.price}</h4>
                                <p>In stock: ${product.stock_quantity}</p>
                            </div>
                        </a>
                        <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
                    </div>
                `;
            }).join('');
        } else {
            console.error('API returned a non-array structure:', products);
            throw new Error('Invalid data format from API');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        const productContainer = document.querySelector('.pro-container');
        productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
};

loadProducts();
