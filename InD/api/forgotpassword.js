import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();
const forgotPasswordForm = document.getElementById("forgot-password-form");

forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get('oobCode'); // Firebase sends this code in the URL

    try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        alert("Password has been reset successfully!");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Error resetting password:", error);
        alert("Failed to reset password: " + error.message);
    }
});
``