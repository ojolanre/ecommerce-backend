// public/js/cart.js

async function loadCart() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('cart-items-container');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.success && result.data.CartItems.length > 0) {
            displayCartItems(result.data.CartItems);
        } else {
            container.innerHTML = `
                <div class="text-center py-5">
                    <h5>Your cart is empty</h5>
                    <a href="index.html" class="btn btn-primary mt-3">Go Shopping</a>
                </div>`;
        }
    } catch (error) {
        console.error("Cart load error:", error);
    }
}

function displayCartItems(items) {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    container.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        const itemTotal = item.Product.price * item.quantity;
        total += itemTotal;

        container.innerHTML += `
            <div class="row align-items-center mb-3 pb-3 border-bottom">
                <div class="col-md-2">
                    <img src="${item.Product.imageUrl}" class="img-fluid rounded" alt="${item.Product.name}">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-0">${item.Product.name}</h6>
                    <small class="text-muted">$${item.Product.price} each</small>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control form-control-sm" value="${item.quantity}" readonly>
                </div>
                <div class="col-md-3 text-end">
                    <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    subtotalEl.innerText = `$${total.toFixed(2)}`;
    totalEl.innerText = `$${total.toFixed(2)}`;
}

loadCart();

// public/js/cart.js

document.getElementById('checkout-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const address = document.getElementById('shipping-address').value;

    // 1. Validation
    if (!address) {
        alert("Please enter a shipping address!");
        return;
    }

    try {
        // 2. Call your Order Controller
        const response = await fetch('/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingAddress: address,
                paymentMethod: "Credit Card" // Placeholder
            })
        });

        const result = await response.json();

        if (result.success) {
            // 3. Success: Redirect to a Thank You page
            alert("Order placed successfully!");
            window.location.href = `success.html?orderId=${result.orderId}`;
        } else {
            // 4. Handle Errors (e.g., Out of Stock)
            alert("Checkout failed: " + result.message);
        }
    } catch (error) {
        console.error("Checkout Error:", error);
        alert("An error occurred during checkout.");
    }
});