const allProductsEndpoint = "http://localhost:3000/api/product"; // Your endpoint to fetch all products

let currentPage = 1;  // Track the current page
const limit = 10;     // Number of products per page
let allProducts = []; // Store all products after the initial load
let searchQuery = ''; // Store the current search query

// Function to fetch and display products
const loadProducts = async (page = 1) => {
    try {
        // If we haven't loaded the products yet, fetch them
        if (allProducts.length === 0) {
            const response = await fetch(allProductsEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            allProducts = responseData.products || responseData; // Store the products
        }

        // Filter the products based on the search query
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

        if (Array.isArray(paginatedProducts)) {
            const productContainer = document.querySelector('.pro-container');
            productContainer.innerHTML = paginatedProducts.map(product => {
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

            // Update pagination links
            updatePagination(filteredProducts.length, page);
        } else {
            console.error('API returned a non-array structure:', filteredProducts);
            throw new Error('Invalid data format from API');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        const productContainer = document.querySelector('.pro-container');
        productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
};

// Update pagination buttons
const updatePagination = (totalProducts, currentPage) => {
    const totalPages = Math.ceil(totalProducts / limit); // Calculate total pages
    const paginationContainer = document.querySelector('.pagination ul');
    paginationContainer.innerHTML = ''; // Clear current pagination

    // Create pagination links
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('link');
        if (i === currentPage) {
            li.classList.add('active');
        }
        li.textContent = i;
        li.setAttribute('value', i);

        li.addEventListener('click', () => {
            loadProducts(i); // Load the clicked page
        });

        paginationContainer.appendChild(li);
    }
};

// Previous and next buttons
const setupPaginationButtons = () => {
    const prevButton = document.querySelector('.btn1');
    const nextButton = document.querySelector('.btn2');

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        loadProducts(currentPage);
    });
};

// Handle search input
const handleSearch = () => {
    searchQuery = document.getElementById('search-bar').value.trim();
    currentPage = 1; // Reset to the first page for new search
    loadProducts(currentPage); // Reload products with the new search query
};

// Event listener for search bar input
document.getElementById('search-bar').addEventListener('input', handleSearch);

// Initialize pagination and load products
setupPaginationButtons();
loadProducts(currentPage);