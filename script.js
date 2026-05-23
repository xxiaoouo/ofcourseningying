/* =====================
   PROFILE (LOCAL STORAGE ONLY)
===================== */

function saveProfile() {

    const username = document.getElementById("editUsername")?.value;
    const birthday = document.getElementById("editBirthday")?.value;
    const phone = document.getElementById("editPhone")?.value;
    const password = document.getElementById("editPassword")?.value;

    if (username) localStorage.setItem("username", username);
    if (birthday) localStorage.setItem("birthday", birthday);
    if (phone) localStorage.setItem("phone", phone);
    if (password) localStorage.setItem("password", password);

    if (username) {
        document.getElementById("userNameDisplay").innerText = username;
    }

    if (birthday) {
        document.getElementById("birthday").innerText = birthday;
    }

    if (phone) {
        document.getElementById("phone").innerText = phone;
    }

    closeModal();
}

function loadProfile() {

    const username = localStorage.getItem("username");
    const birthday = localStorage.getItem("birthday");
    const phone = localStorage.getItem("phone");

    if (username) document.getElementById("userNameDisplay").innerText = username;
    if (birthday) document.getElementById("birthday").innerText = birthday;
    if (phone) document.getElementById("phone").innerText = phone;
}

/* =====================
   DEBT (DATABASE ONLY)
===================== */

let debts = [];

/* LOAD FROM DB */
async function loadDebtsFromDB() {
    try {
        const res = await fetch("http://127.0.0.1:8000/get-debts");
        debts = await res.json();

        renderDebts();

    } catch (err) {
        console.error("❌ load debts error:", err);
    }
}

/* RENDER UI */
function renderDebts() {

    const main = document.querySelector("main");
    if (!main) return;

    document.querySelectorAll(".dynamic-debt").forEach(e => e.remove());

    let html = "";

    debts.forEach(d => {

        const percent = d.total
            ? Math.min((d.paid / d.total) * 100, 100)
            : 0;

        html += `
            <div class="card dynamic-debt">
                <h3>${d.name}</h3>
                <p>RM ${d.paid} / RM ${d.total}</p>

                <div class="progress-bar">
                    <div class="progress-fill"
                         style="width:${percent}%; background:#7da88b;">
                    </div>
                </div>
            </div>
        `;
    });

    const aiCard = document.getElementById("recommendation")?.closest(".card");

    if (!aiCard) return;

    aiCard.insertAdjacentHTML("beforebegin", html);
}

/* ADD DEBT → DATABASE */
async function addDebt() {

    const name = document.getElementById("debtName")?.value.trim();
    const amount = Number(document.getElementById("debtAmount")?.value);

    if (!name || !amount) {
        alert("Fill in both fields");
        return;
    }

    try {
        await fetch("http://127.0.0.1:8000/add-debt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                paid: 0,
                total: amount
            })
        });

        await loadDebtsFromDB();

        document.getElementById("debtName").value = "";
        document.getElementById("debtAmount").value = "";

    } catch (err) {
        console.error("❌ add debt error:", err);
    }
}

/* =====================
   INIT
===================== */

window.addEventListener("DOMContentLoaded", async () => {

    loadProfile();
    await loadDebtsFromDB();

    const btn = document.getElementById("repaymentBtn");

    if (btn) {
        btn.addEventListener("click", async () => {

            const recommendation = document.getElementById("recommendation");

            recommendation.innerText = "Generating AI repayment plan...";

            try {
                const res = await fetch("http://127.0.0.1:8000/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: `
User debts:
${debts.map(d => `- ${d.name}: RM${d.paid}/RM${d.total}`).join("\n")}

Give repayment plan.
                        `
                    })
                });

                const data = await res.json();

                recommendation.innerText = data.reply;

            } catch (err) {
                recommendation.innerText = "AI error";
            }
        });
    }
});