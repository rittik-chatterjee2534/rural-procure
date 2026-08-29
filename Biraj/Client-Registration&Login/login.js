// ==========================================
// 1. Sliding Panels Animation Logic
// ==========================================
const authCard = document.getElementById('authCard');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    authCard.classList.add('register-active');
});

toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    authCard.classList.remove('register-active');
});


// ==========================================
// 2. DOM Node Grabs
// ==========================================
// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Login Input Fields
const loginMobile = document.getElementById('login-mobile');
const loginAadhaar = document.getElementById('login-aadhaar');

// Register Input Fields
const regName = document.getElementById('reg-name');
const regMobile = document.getElementById('reg-mobile'); 
const regAadhaar = document.getElementById('reg-aadhaar');

// Modal Elements
const otpOverlay = document.getElementById('otpOverlay');
const modalTitle = document.getElementById('modalTitle');
const dummyOtpDisplay = document.getElementById('dummyOtpDisplay');
const closeBtn = document.getElementById('closeBtn');
const verifyBtn = document.getElementById('verifyBtn');
const otpInput = document.getElementById('otpInput');

// Track which action opened the modal ('login' or 'register')
let currentAction = ''; 


// ==========================================
// 3. Login Button Logic
// ==========================================
// We listen for the form submission directly to handle all HTML validation flags cleanly
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop standard form refresh redirect

    // double check fields lengths and attributes via HTML5 engine
    if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
    }

    // Set modal configurations for logging in
    currentAction = 'login';
    modalTitle.textContent = "Login Verification";
    
    // Open modal wrapper sequence
    openOtpModal();
});


// ==========================================
// 4. Register Button Logic
// ==========================================
/**
 * Triggered by the inline `onclick="myfunc(event)"` on your Register button
 */
function myfunc(event) {
  // Check field text inputs values are completely empty and set manual focus rules
  if (regName.value.trim() === "") {
    regName.focus();
    return;
  }
  if (regMobile.value.trim() === "") {
    regMobile.focus();
    return;
  }
  if (regAadhaar.value.trim() === "") {
    regAadhaar.focus();
    return;
  }

  // Check if standard browser length conditions pass cleanly
  if (!registerForm.checkValidity()) {
    registerForm.reportValidity(); 
    return;
  }

  event.preventDefault(); // Block unexpected refreshes

  // Set modal configurations for register operations
  currentAction = 'register';
  modalTitle.textContent = "Registration Verification";

  // Open modal wrapper sequence
  openOtpModal();
}


// ==========================================
// 5. Shared Modal Functions & Handlers
// ==========================================
function openOtpModal() {
    // Generate a random 6-digit number string
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Inject code directly into the modal UI display text
    dummyOtpDisplay.textContent = randomOTP;

    // Show the dark faded background modal wrapper
    otpOverlay.style.display = 'flex';
}

// Close layout overlay via manual cancel/dismiss buttons
closeBtn.addEventListener('click', () => {
  otpOverlay.style.display = 'none';
  otpInput.value = ''; // Clean input placeholder field
});

// Verification rule checking input text against the dummy display text
verifyBtn.addEventListener('click', () => {
  if (otpInput.value === dummyOtpDisplay.textContent) {
    
    if (currentAction === 'login') {
        alert('Logged in successfully!');
    } 
    
    else if (currentAction === 'register') {
        alert('Account created successfully!');
    }
    
    // Refresh the page immediately after clicking "OK"
    location.reload(); 
    
  } else {
    alert('Invalid OTP validation code. Please try again.');
  }
});
