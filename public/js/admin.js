// public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. SECURITY CHECK: Only allow Admins
    if (!token || !user || user.role !== 'admin') {
        alert("Access Denied: Admins Only");
        window.location.href = 'index.html';
        return;
    }

    loadCategories();
    setupFormListener(token);
});

// 2. FETCH CATEGORIES for the dropdown
async function loadCategories() {
    try {
        const response = await fetch('/categories');
        const result = await response.json();
        const select = document.getElementById('categorySelect');

        if (result.success) {
            select.innerHTML = '<option value="">Select a category</option>';
            result.data.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading categories");
    }
}

// 3. SUBMIT FORM
function setupFormListener(token) {
    const form = document.getElementById('add-product-form');
    const alertBox = document.getElementById('admin-alert');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            stock: document.getElementById('stock').value,
            categoryId: document.getElementById('categorySelect').value,
            imageUrl: document.getElementById('imageUrl').value
        };

        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // MUST SEND TOKEN
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result.success) {
                alertBox.textContent = "Product added successfully!";
                alertBox.className = "alert alert-success";
                alertBox.classList.remove('d-none');
                form.reset();
            } else {
                alertBox.textContent = "Error: " + result.message;
                alertBox.className = "alert alert-danger";
                alertBox.classList.remove('d-none');
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    });
}