const API_BASE = "https://passoword-forget-fullstack.onrender.com/";

function hideAll() {
  registerBox.style.display = "none";
  loginBox.style.display = "none";
  forgotBox.style.display = "none";
}

function showLogin() {
  hideAll();
  loginBox.style.display = "block";
}

function showForgot() {
  hideAll();
  forgotBox.style.display = "block";
}
function showRegister() {
  hideAll();
  registerBox.style.display = "block";
}


/* REGISTER */
function register() {
  const email = regEmail.value.trim().toLowerCase();
  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;
  const msg = document.getElementById("regMsg");

  msg.innerText = "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com"
  ];

  if (!emailRegex.test(email)) {
    msg.innerText = "Please enter a valid email address";
    return;
  }

  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    msg.innerText = "Email domain not supported";
    return;
  }

  if (password !== confirmPassword) {
    msg.innerText = "Passwords do not match";
    return;
  }

  // ❗ NO password strength validation here ❗
  // Backend will decide
// for localhost use "/api/register"
  fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        msg.innerText = "";
        showLogin();
        return;
      }
      msg.innerText = data.message;
    });
}





/* LOGIN */
function login() {
  fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "/dashboard.html";
      } else {
        loginMsg.innerText = data.message;
      }
    });
}

/* FORGOT PASSWORD */
function forgotPassword() {
  const email = forgotEmail.value;
`${API_BASE}/api/register`
  fetch(`${API_BASE}/api/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      forgotMsg.innerText = data.message;

      if (data.success === true) {
        // ✅ store email for reset step
        localStorage.setItem("resetEmail", email);

        setTimeout(() => {
          window.location.href = "/reset-password.html";
        }, 800);
      }
    });
}



// ===== LIVE PASSWORD STRENGTH CHECK =====
const passwordInput = document.getElementById("regPassword");
const passwordHint = document.getElementById("passwordHint");

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;

    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[@$!%*#?&]/.test(value);
    const hasLength = value.length >= 8;

    if (!value) {
      passwordHint.innerText = "";
      return;
    }

    if (hasLetter && hasNumber && hasSpecial && hasLength) {
  passwordHint.innerText = "Strong password ✔";
  passwordHint.style.color = "#28a745";

  // ✅ CLEAR register error if password is now valid
  if (document.getElementById("regMsg")) {
    document.getElementById("regMsg").innerText = "";
  }
} else {
  passwordHint.innerText =
    "Password must be 8+ chars and include letter, number & special character";
  passwordHint.style.color = "#d9534f";
}

  });
}


function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁";
  }
}
