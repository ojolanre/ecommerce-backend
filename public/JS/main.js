// public/js/main.js

function checkAuth() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const authContainer = document.getElementById('auth-buttons');
    const adminLink = document.getElementById('admin-link');

    if (token && userJson) {
        // 1. Parse the user data from the string we saved
        const user = JSON.parse(userJson);

        // 2. Change the Login button to a Greeting + Logout button
        authContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Hi, ${user.email.split('@')[0]} 
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
                    <li><a class="dropdown-item" href="orders.html">My Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" onclick="logout()">Logout</button></li>
                </ul>
            </div>
        `;

        // 3. If the user is an Admin, show the Dashboard link
        if (user.role === 'admin') {
            adminLink.classList.remove('d-none');
        }

    }
}

// Global logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Run the check when the page loads
checkAuth();

// Fetch products from your API
async function fetchProducts() {
    try {
        const response = await fetch('/products'); 
        const result = await response.json();

        if (result.success) {
            displayProducts(result.data);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Display products using Bootstrap Cards
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No products available.</p></div>';
        return;
    }

    products.forEach(product => {
        // We wrap each card in a Bootstrap column (col-md-4 means 3 per row on medium screens)
        const productHTML = `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card h-100 shadow-sm product-card">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="text-muted small">${product.Category ? product.Category.name : 'General'}</p>
                        <p class="card-text text-truncate">${product.description}</p>
                        <div class="mt-auto d-flex justify-between align-items-center">
                            <span class="h5 mb-0 text-primary">$${product.price}</span>
                            <button onclick="addToCart(${product.id})" class="btn btn-outline-primary btn-sm">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += productHTML;
    });
}

fetchProducts();


async function addToCart(productId) {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('token');

    // 2. Security Check: If no token, the user isn't logged in
    if (!token) {
        alert("Please login first to add items to your cart!");
        window.location.href = 'login.html';
        return;
    }

    try {
        // 3. Send the request to your Backend API
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1 
            })
        });

        const result = await response.json();

        if (result.success) {
            updateCartCount(); 
            alert("Item added to cart!");
        } else {
            alert("Failed to add item: " + result.message);
        }
    } catch (error) {
        console.error("Cart Error:", error);
        alert("Something went wrong with the cart.");
    }
}

async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.success) {
            // Calculate total quantity of items
            const totalItems = result.data.CartItems.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = totalItems;
        }
    } catch (error) {
        console.log("Could not update cart count");
    }
}

// Run this when the page loads so the number is there immediately
updateCartCount();

