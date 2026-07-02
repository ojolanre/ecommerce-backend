// public/js/auth.js

const loginForm = document.getElementById('login-form');
const errorAlert = document.getElementById('error-alert');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from refreshing

        // 1. Get data from the form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // 2. POST to your backend Login route
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                // 3. SUCCESS: Save the token and user info in LocalStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // 4. Redirect to the Shop
                window.location.href = 'index.html';
            } else {
                // 5. FAIL: Show error message
                errorAlert.textContent = result.message || "Login failed";
                errorAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error("Login Error:", error);
            errorAlert.textContent = "Something went wrong. Try again.";
            errorAlert.classList.remove('d-none');
        }
    });
}

// Helper function to logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}