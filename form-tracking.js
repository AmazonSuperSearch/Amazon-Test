// form-tracking.js

document.addEventListener("DOMContentLoaded", () => {
  // 0️⃣ grab click sound (DOM is now parsed)
  const clickSound = document.getElementById("clickSound");

  // 1️⃣ play on any button/submit click
  if (clickSound) {
    document.addEventListener("click", (e) => {
      const tgt = e.target;
      if (tgt.matches("button, input[type=submit], input[type=button]")) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      }
    });
  }

  // 2️⃣ your form-submit tracking & sound
  const form = document.getElementById("amazon-search-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      // play sound
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      }

      // fire off your webhook (doesn't block the real form submit)
      try {
        const res = await fetch("https://ipapi.co/json/");
        const { ip, city, country_name: country } = await res.json();
        const ua = navigator.userAgent;
        const lang = navigator.language || navigator.userLanguage;

        const content = `📩 **Form Submitted**\nIP: ${ip}\nLocation: ${city}, ${country}\nLang: ${lang}\nDevice: ${ua}`;
        await fetch(
          "https://discord.com/api/webhooks/1373527244944834610/Ff5AJA1JCjjAH4loyzVjhoA5NZjzJkBfE0VnRBQt3RYkYc9paWojAou0QFnuJbqy-ZQ_",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          }
        );
      } catch (err) {
        console.error("Form webhook failed", err);
      }
    });
  }
});
