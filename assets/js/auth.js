// NPlusOne Fashion - Authentication (Shared Hosting Compatible)

// Show login modal
function showLoginModal() {
    createAuthModal('login');
}

// Show register modal
function showRegisterModal() {
    createAuthModal('register');
}

// Create authentication modal
function createAuthModal(type) {
    // Remove existing modal if any
    const existingModal = document.getElementById('auth-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const isLogin = type === 'login';
    const title = isLogin ? 'Login to Your Account' : 'Create New Account';
    const switchText = isLogin ? "Don't have an account?" : "Already have an account?";
    const switchLink = isLogin ? 'Sign up' : 'Sign in';
    const buttonText = isLogin ? 'Login' : 'Register';
    
    const modalHTML = `
        <div id="auth-modal" class="auth-modal-overlay">
            <div class="auth-modal">
                <div class="auth-modal-header">
                    <h2>${title}</h2>
                    <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                </div>
                <div class="auth-modal-body">
                    <form id="auth-form" onsubmit="handleAuthSubmit(event, '${type}')">
                        ${!isLogin ? `
                            <div class="form-group">
                                <label for="auth-name">Full Name</label>
                                <input type="text" id="auth-name" name="name" required>
                            </div>
                        ` : ''}
                        <div class="form-group">
                            <label for="auth-email">Email Address</label>
                            <input type="email" id="auth-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="auth-password">Password</label>
                            <input type="password" id="auth-password" name="password" required minlength="6">
                        </div>
                        ${!isLogin ? `
                            <div class="form-group">
                                <label for="auth-confirm-password">Confirm Password</label>
                                <input type="password" id="auth-confirm-password" name="confirmPassword" required minlength="6">
                            </div>
                        ` : ''}
                        <button type="submit" class="auth-submit-btn" id="auth-submit-btn">
                            ${buttonText}
                        </button>
                    </form>
                    <div class="auth-switch">
                        <p>${switchText} <a href="#" onclick="switchAuthMode('${isLogin ? 'register' : 'login'}')">${switchLink}</a></p>
                    </div>
                    <div id="auth-error" class="auth-error" style="display: none;"></div>
                    <div id="auth-success" class="auth-success" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector('#auth-modal input');
        if (firstInput) firstInput.focus();
    }, 100);
}

// Switch between login and register
function switchAuthMode(type) {
    createAuthModal(type);
}

// Close modal
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.remove();
    }
}

// Handle form submission
async function handleAuthSubmit(event, type) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('auth-submit-btn');
    const errorDiv = document.getElementById('auth-error');
    const successDiv = document.getElementById('auth-success');
    
    // Reset messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    if (type === 'register') {
        data.name = formData.get('name');
        data.confirmPassword = formData.get('confirmPassword');
        
        // Validate passwords match
        if (data.password !== data.confirmPassword) {
            showAuthError('Passwords do not match');
            return;
        }
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> ${type === 'login' ? 'Logging in...' : 'Creating account...'}`;
    
    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: type,
                ...data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (type === 'login') {
                // Store user data in session
                showAuthSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showAuthSuccess('Account created successfully! Please login.');
                setTimeout(() => {
                    switchAuthMode('login');
                }, 1500);
            }
        } else {
            showAuthError(result.message || 'An error occurred');
        }
    } catch (error) {
        console.error('Auth error:', error);
        showAuthError('Network error. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = type === 'login' ? 'Login' : 'Register';
    }
}

// Show error message
function showAuthError(message) {
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Show success message
function showAuthSuccess(message) {
    const successDiv = document.getElementById('auth-success');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'logout'
            })
        });
        
        // Reload page regardless of response
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        // Force reload even if API call fails
        window.location.reload();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('auth-modal-overlay')) {
        closeAuthModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAuthModal();
    }
});

// Export functions for global use
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.switchAuthMode = switchAuthMode;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.logout = logout;