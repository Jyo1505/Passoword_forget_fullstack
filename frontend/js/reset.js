const API_BASE = "https://forgot-password-backend.onrender.com";

function resetPassword() {
  const newPassword = document.getElementById("newPassword").value;
  const msg = document.getElementById("resetMsg");

  if (!newPassword) {
    msg.innerText = "Please generate a password first";
    return;
  }

  const email = localStorage.getItem("resetEmail");
  if (!email) {
    msg.innerText = "Session expired. Try forgot password again.";
    return;
  }

  fetch(`${API_BASE}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  })
    .then(res => res.json())
    .then(data => {
      msg.innerText = data.message;
      if (data.success) {
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    });
}

function generatePassword() {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    password += letters[randomIndex];
  }

  const newPass = document.getElementById("newPassword");
  newPass.value = password;

  document.getElementById("generatedPasswordText").innerHTML =
    `<strong>Your generated password:</strong><br>${password}`;

  document.getElementById("resetMsg").innerText =
    "Password generated successfully";
}


function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    icon.innerText = "🙈";
  } else {
    input.type = "password";
    icon.innerText = "👁";
  }
}
