
// === USER login ===
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("providerLoginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const BASE_URL = 'http://localhost:3000';

    try {
      const res = await fetch(`${BASE_URL}/api/login/provider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      try {
        data = await res.json();
      } catch {
        data = {}; // fallback if no JSON returned
      }

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        window.location.href = "index.html"; // ✅ change this to your real dashboard
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  });
  document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = this.name.value;
    const email = this.email.value;
    const message = this.message.value;
    const BASE_URL = 'http://localhost:3000';

    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });


      try {
        data = await res.json();
      } catch {
        data = {}; // fallback if no JSON returned
      }

      const data = await res.json();
      if (data.message) {
        window.location.href = "contact-success.html";  // ✅ Redirect to success page
      } else {
        alert("Message sending failed.");
      }
    } catch (err) {
      alert("Something went wrong. Try again later.");
    }
  });


}
);

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}






// === PROVIDER LOGIN ===


