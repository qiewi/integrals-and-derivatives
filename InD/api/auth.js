// api/lauth.js
import { auth, db } from "./config/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


// Get elements for sign-in and sign-up forms
const signInForm = document.querySelector(".sign-in-form form");
const signUpForm = document.querySelector(".sign-up-form form");

// Password and confirm password fields in sign-up form
const passwordInput = document.querySelector(".password-input");
const signUpPassword = signUpForm?.querySelector('input[placeholder="Password"]');
const confirmPasswordInput = signUpForm?.querySelector('input[placeholder="Confirm password"]');

// Eye buttons for password toggle
const eyeBtn = document.querySelector(".eye-btn"); // For sign-in form
const signUpPasswordEyeBtn = signUpForm?.querySelector('.password-eye-btn');
const confirmPasswordEyeBtn = signUpForm?.querySelector('.confirm-password-eye-btn');
const usernameInput = document.querySelector('input[placeholder="Username"]');

// Password input restriction (no emojis)
if (signUpPassword) {
    signUpPassword.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
    });
}

// Username input restriction (only letters and numbers)
if (usernameInput) {
  usernameInput.addEventListener("input", (event) => {
      // Restrict to letters and numbers only
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");

      // Limit to maximum of 20 characters
      if (event.target.value.length > 20) {
          event.target.value = event.target.value.slice(0, 20);
      }
  });
}

// Toggle password visibility for sign-in form
if (eyeBtn && passwordInput) {
  eyeBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeBtn.innerHTML = "<i class='uil uil-eye'></i>";
    } else {
      passwordInput.type = "password";
      eyeBtn.innerHTML = "<i class='uil uil-eye-slash'></i>";
    }
  });
}

// Toggle password visibility for sign-up form
if (signUpPasswordEyeBtn && signUpPassword) {
  signUpPasswordEyeBtn.addEventListener("click", () => {
    if (signUpPassword.type === "password") {
      signUpPassword.type = "text";
      signUpPasswordEyeBtn.innerHTML = "<i class='uil uil-eye'></i>";
    } else {
      signUpPassword.type = "password";
      signUpPasswordEyeBtn.innerHTML = "<i class='uil uil-eye-slash'></i>";
    }
  });
}

if (confirmPasswordEyeBtn && confirmPasswordInput) {
    confirmPasswordEyeBtn.addEventListener("click", () => {
      if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        confirmPasswordEyeBtn.innerHTML = "<i class='uil uil-eye'></i>";
      } else {
        confirmPasswordInput.type = "password";
        confirmPasswordEyeBtn.innerHTML = "<i class='uil uil-eye-slash'></i>";
      }
    });
  }

  // Function to fetch user progress from Firestore
const fetchUserProgress = async (userId) => {
  try {
    const userRef = doc(db, "Integral", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log(`User ${userId} has completed ${userData.completedLevels} levels.`);
      return userData.completedLevels;
    } else {
      console.log("No progress found for user.");
      return 0; // Return 0 if no progress found
    }
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return 0; // Default to 0 if an error occurs
  }
};

// Sign-In Function
const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in:", user);

    // Fetch and log user progress after signing in
    const completedLevels = await fetchUserProgress(user.uid);
    console.log(`User progress: ${completedLevels} levels completed`);

    // Redirect or use progress as needed
    window.location.href = "profile.html"; // Example redirect on success
  } catch (error) {
    console.error("Error signing in:", error);
    alert("Login failed: " + error.message);
  }
};

// Sign-Up Function
const handleSignUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Initialize user data in the "users" collection
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
      profilePicture: "../assets/green-player.png",
      unlockedCards: []
    });

    // Initialize user progress in the "Integral" collection
    await setDoc(doc(db, "Integral", user.uid), {
      userId: user.uid,
      completedLevels: 0 // Start progress at level 0
    });

    console.log("User signed up and details stored in Firestore:", user);
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Sign-up failed: " + error.message);
  }
};

// Sign-Out Function
const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    window.location.href = "login.html"; // Redirect to login on sign-out
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Sign-out failed: " + error.message);
  }
};

// Check if sign-out button exists and attach event listener
const signOutButton = document.querySelector(".sign-out-btn");
if (signOutButton) {
  signOutButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleSignOut();
  });
}

// Sign-In Form Submission
if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signInForm.querySelector('input[type="email"]').value;
      const password = passwordInput.value; // Get the password value here

      handleSignIn(email, password);
    });
  }

// Sign-Up Form Submission
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signUpForm.querySelector('input[type="email"]').value;
    const username = signUpForm.querySelector('input[placeholder="Username"]').value; // Get username
    const password = signUpPassword.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password === confirmPassword) {
      handleSignUp(email, password, username); // Pass username to the function
    } else {
      alert("Passwords do not match");
    }
  });
}

// Check if reset-password-form exists before adding an event listener
// Event listener for the reset password form, with re-authentication
// Event listener for the reset password form, with re-authentication using current password
const resetPasswordForm = document.getElementById("reset-password-form");
if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const currentPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert("No user is signed in.");
            return;
        }

        try {
            // Create credentials from the current password and re-authenticate
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            alert("Password reset successfully.");
            window.location.href = "login.html"; // Redirect to login page
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to reset password: " + error.message);
        }
    });
}


