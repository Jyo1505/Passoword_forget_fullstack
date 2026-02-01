function forgotPassword() {
  fetch("/api/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: forgotEmail.value })
  })
    .then(res => res.json())
    .then(data => {
      forgotMsg.innerText = data.message;

      if (data.success) {
        window.location.href = "/reset-password.html";
      }
    });
}
