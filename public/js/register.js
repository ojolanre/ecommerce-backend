// public/js/register.js

const registerForm = document.getElementById('register-form');
const alertBox = document.getElementById('register-alert');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Capture form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 2. Client-side Validation: Check if passwords match
    if (password !== confirmPassword) {
        showAlert("Passwords do not match!", "alert-danger");
        return;
    }

    try {
        // 3. Send data to Backend
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const result = await response.json();

        if (result.success) {
            // 4. Success logic
            showAlert("Registration successful! Redirecting to login...", "alert-success");
            
            // Wait 2 seconds so the user can read the success message, then redirect
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            // 5. Error from Backend (e.g., Email already in use)
            showAlert(result.message || "Registration failed", "alert-danger");
        }
    } catch (error) {
        console.error("Register Error:", error);
        showAlert("Something went wrong. Please try again.", "alert-danger");
    }
});

// Helper function to show alerts
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`; // e.g., alert alert-danger
    alertBox.classList.remove('d-none');
}