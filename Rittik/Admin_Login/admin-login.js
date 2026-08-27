const passwordInput = document.getElementById("admin-password");
const passwordToggle = document.querySelector(".password-toggle");


passwordToggle.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password"
  const passwordIcon = passwordToggle.querySelector("svg");
  if(isPasswordHidden)
  { 
    passwordInput.type = "text";
    passwordToggle.setAttribute("aria-label","Hide password");
    passwordIcon.setAttribute("data-lucide", "eye-off");
  }
  else
  {
    passwordInput.type = "password";
    passwordToggle.setAttribute("aria-label","Show password");
    passwordIcon.setAttribute("data-lucide", "eye");
  }
  lucide.createIcons();
});
