const form = document.getElementById("form");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = new FormData(form).get("email")?.toString().trim();
  if (!email) return;

  setStatus("Sending your confirmation letter…");

  try {
    // You will implement this endpoint on your hosting platform
    const res = await fetch("/api/send-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }

    // Navigate to final page on success
    window.location.href = "./final.html";
  } catch (err) {
    setStatus(`Could not send email. ${err?.message ? String(err.message) : "Try again."}`);
  }
});
