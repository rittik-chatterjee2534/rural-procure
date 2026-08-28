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

// LOGIN: Select the input field and the toggle button
const loginpasswordField = document.getElementById('login-password');
const logintoggleButton = document.getElementById('login-toggle-btn');

// Add a click event listener to the button
logintoggleButton.addEventListener('click', function () {
  // Check the current type attribute
  if (loginpasswordField.type === 'password') {
    loginpasswordField.type = 'text';
  } else {
    loginpasswordField.type = 'password';
  }
});

// REGISTRATION: Select the input field and the toggle button
const regpasswordField1 = document.getElementById('reg-password');
const regtoggleButton1 = document.getElementById('reg-toggle-btn');

regtoggleButton1.addEventListener('click', function () {
  // Check the current type attribute
  if (regpasswordField1.type === 'password') {
    regpasswordField1.type = 'text';
  } else {
    regpasswordField1.type = 'password';
  }
});

const regpasswordField2 = document.getElementById('reg-confirm-password');
const regtoggleButton2 = document.getElementById('reg-confirm-toggle-btn');

regtoggleButton2.addEventListener('click', function () {
  // Check the current type attribute
  if (regpasswordField2.type === 'password') {
    regpasswordField2.type = 'text';
  } else {
    regpasswordField2.type = 'password';
  }
});


const createfield = document.getElementById("reg-password");
const confirmfield = document.getElementById("reg-confirm-password");
const errorText = document.getElementById('errorText');

const fullname = document.getElementById('reg-name');
const phonenumber = document.getElementById('reg-phone');



const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmpasswordError = document.getElementById('confirmpasswordError');

function myfunc(event){


  if(regpasswordField1.value !== regpasswordField2.value){
    // alert("Password are not same");
    errorText.innerText = "Passwords do not match or are empty!";

    createfield.value = "";
    confirmfield.value = "";

    createfield.focus();
  }

  else if(fullname.value.trim() === ""){
    fullname.focus();
    return;
  }

  else if(phonenumber.value.trim() === ""){
    fullname.focus();
    return;
  }

  else if(regpasswordField1.value.trim() === ""){
    fullname.focus();
    return;
  }
  
  else if(regpasswordField2.value.trim() === ""){
    fullname.focus();
    return;
  }

  else{
    location.reload();
  }
}





