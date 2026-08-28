const passwordInput = document.getElementById("admin-password");
const passwordToggle = document.querySelector(".password-toggle");
const loginForm = document.querySelector(".login-form");
const emailInput = document.getElementById("admin-email");
const formMessage = document.getElementById("form-message");
const loginButton = document.querySelector(".login-button");
const loginButtonText = loginButton.querySelector("span");
const rememberCheckbox = document.getElementById("remember-admin");
const savedEmail = localStorage.getItem("rememberedAdminEmail");
if(savedEmail)
{
  emailInput.value = savedEmail;
  rememberCheckbox.checked = true;
}
const DEMO_ADMIN_EMAIL = "admin@ruralprocure.in";
const DEMO_ADMIN_PASSWORD = "Admin@123";

passwordToggle.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  const passwordIcon = passwordToggle.querySelector("svg");

  if (isPasswordHidden) {
    passwordInput.type = "text";
    passwordToggle.setAttribute("aria-label", "Hide password");
    passwordIcon.setAttribute("data-lucide", "eye");
  } else {
    passwordInput.type = "password";
    passwordToggle.setAttribute("aria-label", "Show password");
    passwordIcon.setAttribute("data-lucide", "eye-off");
  }

  lucide.createIcons();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("success");
  formMessage.textContent = "";
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (password === "" || email === "") {
    formMessage.textContent = "Please enter your email and password.";
    return;
  }
  if (!emailInput.validity.valid) {
    formMessage.textContent = "Please enter a valid email.";
    emailInput.focus();
    return;
  }
  if (password.length < 8) {
    formMessage.textContent = "Password must contain at least 8 characters.";
    passwordInput.focus();
    return;
  }
  const credentialsAreValid =
    email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;
  if(!credentialsAreValid)
  {
    formMessage.textContent = "Invalid email or password.";
    emailInput.focus();
    return;
  }
  formMessage.classList.add("success");
  formMessage.textContent = "Login successful. Redirecting...";
  loginButton.disabled = true;
  loginButtonText.textContent = "Signing in...";
  if(rememberCheckbox.checked)
  {
    localStorage.setItem("rememberedAdminEmail", email);
  }
  else{
    localStorage.removeItem("rememberedAdminEmail");
  }
  setTimeout( () => {
    window.location.href = "../Admin_Dashboard/admin-dashboard.html";
  }, 1500);
  
});
