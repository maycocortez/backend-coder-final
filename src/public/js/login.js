const getElement = (id) => document.getElementById(id);

const togglePasswordVisibility = (passwordInput, eyeButton) => {
  if (passwordInput.type === "password") {
    passwordInput.setAttribute("type", "text");
    eyeButton.classList.add("hide");
  } else {
    passwordInput.setAttribute("type", "password");
    eyeButton.classList.remove("hide");
  }
};

const toggleSlide = () => {
  wrapper.classList.toggle("active");
};

const handleSignupLinkClick = () => {
  slideSignup.click();
  return false;
};

const handleLoginLinkClick = () => {
  slideLogin.click();
  return false;
};

const signupLink = getElement("signup-link");
const loginLink = getElement("login-link");
const passwordLogin = getElement("passwordLogin");
const eyeBtn = getElement("eyeBtn");
const wrapper = getElement("wrapper");
const slideLogin = getElement("slideLogin");
const slideSignup = getElement("slideSignup");
const eyeBtnSignup = getElement('eyeBtnSignup');
const passwordSignup1 = getElement('passwordSignup1');
const passwordSignup2 = getElement('passwordSignup2');

eyeBtn.addEventListener("click", () => {
  togglePasswordVisibility(passwordLogin, eyeBtn);
});

eyeBtnSignup.addEventListener("click", () => {
  togglePasswordVisibility(passwordSignup1, eyeBtnSignup);
  togglePasswordVisibility(passwordSignup2, eyeBtnSignup);
});

slideLogin.addEventListener("click", toggleSlide);
slideSignup.addEventListener("click", toggleSlide);
signupLink.onclick = handleSignupLinkClick;
loginLink.onclick = handleLoginLinkClick;
