import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQN5VVmW0eCGfJ7CR88yKdUVVniCQxvY8",
    authDomain: "studentregistration-fde69.firebaseapp.com",
    databaseURL: "https://studentregistration-fde69-default-rtdb.firebaseio.com",
    projectId: "studentregistration-fde69",
    storageBucket: "studentregistration-fde69.firebasestorage.app",
    messagingSenderId: "247451311801",
    appId: "1:247451311801:web:d3119255c9763728990568",
    measurementId: "G-SB7HB4Q15K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit');
const emailError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');

// Utility Functions
const showAlert = (message, type = 'error') => {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type} show`;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
};

const setLoading = (loading) => {
    submitButton.disabled = loading;
    submitButton.classList.toggle('loading', loading);
};

const showError = (element, errorDiv, message) => {
    element.parentElement.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
};

const clearError = (element, errorDiv) => {
    element.parentElement.classList.remove('error');
    errorDiv.textContent = '';
    errorDiv.classList.remove('visible');
};

// Validation Functions
const validateEmail = (email) => {
    clearError(emailInput, emailError);
    
    if (!email) {
        showError(emailInput, emailError, 'Email is required');
        return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }
    
    return true;
};

const validatePassword = (password) => {
    clearError(passwordInput, passwordError);
    
    if (!password) {
        showError(passwordInput, passwordError, 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        // showError(passwordInput, passwordError, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
};

// Firebase Error Handler
const handleFirebaseError = (error) => {
    switch (error.code) {
        case 'auth/user-not-found':
            showError(emailInput, emailError, 'No account found with this email');
            break;
        case 'auth/wrong-password':
            showError(passwordInput, passwordError, 'Incorrect password');
            break;
        case 'auth/too-many-requests':
            showAlert('Too many failed attempts. Please try again later.');
            break;
        case 'auth/network-request-failed':
            showAlert('Network error. Please check your connection.');
            break;
        default:
            showAlert('An error occurred. Please try again.');
            console.error('Firebase Error:', error);
    }
};

// Role-based Navigation
const handleRoleBasedRedirect = async (userId) => {
    try {
        const userRef = ref(database, 'Users/' + userId);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists()) {
            throw new Error('User data not found');
        }

        const userData = snapshot.val();
        switch (userData.role?.toLowerCase()) {
            case 'admin':
                showAlert('Welcome Admin! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'admin-dashboard.html', 1500);
                break;
            case 'teacher':
                showAlert('Welcome Teacher! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'teacher-dashboard.html', 1500);
                break;
            default:
                throw new Error('Invalid role');
        }
    } catch (error) {
        console.error('Role Check Error:', error);
        showAlert('Error accessing your account. Please contact support.');
        setLoading(false);
    }
};

// Input Event Listeners
emailInput.addEventListener('input', () => {
    if (emailInput.value) validateEmail(emailInput.value);
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value) validatePassword(passwordInput.value);
});

// Form Submit Handler
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    setLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleRoleBasedRedirect(userCredential.user.uid);
    } catch (error) {
        handleFirebaseError(error);
        setLoading(false);
    }
});

// Initial Animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.main', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        rotationX: -20,
        ease: 'power3.out'
    });

    gsap.from('.floating-shapes div', {
        duration: 1,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });

    gsap.from('h1', {
        duration: 1,
        y: -30,
        opacity: 0,
        delay: 0.3,
        ease: 'power2.out'
    });

    gsap.from('.input-wrapper', {
        duration: 0.8,
        x: -30,
        opacity: 0,
        stagger: 0.2,
        delay: 0.5,
        ease: 'power2.out'
    });

    gsap.from('.button, p', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.2,
        delay: 0.9,
        ease: 'power2.out'
    });
});

// Focus Animation Handlers
const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input.parentElement, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input.parentElement, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.in'
        });
    });
});