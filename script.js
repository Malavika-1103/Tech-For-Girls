const form = document.getElementById("registrationForm");
const shareBtn = document.getElementById("shareBtn");
const clickCounter = document.getElementById("clickCounter");
const responseMsg = document.getElementById("responseMsg");
const submitBtn = document.getElementById("submitBtn");

const scriptURL = "https://script.google.com/macros/s/AKfycbxMgH7dsCUd3IzBkkkj-KWvXvZEWZbx4sXsRjHFrg7zMF6KyEUo6Qal4PKZfMdAJ_L6/exec"; 
let clickCount = 0;
const maxClicks = 5;

// Prevent resubmission
if (localStorage.getItem("submitted")) {
  form.classList.add("submitted");
  submitBtn.disabled = true;
  responseMsg.innerHTML = "✅ You already submitted!";
}

// WhatsApp Share Button Logic
shareBtn.addEventListener("click", () => {
  if (clickCount < maxClicks) {
    const msg = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    clickCount++;
    clickCounter.textContent = `Click count: ${clickCount}/5`;
    if (clickCount === maxClicks) {
      shareBtn.disabled = true;
      shareBtn.textContent = "Sharing complete ✅";
    }
  }
});

// Form Submission Logic
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (clickCount < maxClicks) {
    alert("Please complete WhatsApp sharing first.");
    return;
  }

  const name = form.name.value;
  const phone = form.phone.value;
  const email = form.email.value;
  const college = form.college.value;
  const file = document.getElementById("screenshot").files[0];

  if (!file) {
    alert("Please upload a screenshot!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const base64 = reader.result.split(',')[1];
    const data = {
      name,
      phone,
      email,
      college,
      file: base64,
      filename: file.name
    };

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.text();
      if (result.includes("Success")) {
        form.reset();
        localStorage.setItem("submitted", "true");
        submitBtn.disabled = true;
        responseMsg.innerHTML = "🎉 Your submission has been recorded. Thanks!";
        launchConfetti();
      } else {
        throw new Error(result);
      }
    } catch (err) {
      alert("❌ Error submitting form. Try again.");
      console.error(err);
    }
  };
  reader.readAsDataURL(file);
});

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const confetti = window.confetti.create(canvas, { resize: true });
  confetti({ particleCount: 200, spread: 70 });
}
