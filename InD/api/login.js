// api/login.js
import { auth, db } from "./config/firebaseConfig.js";
import { collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

// Sign-In Function
const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    window.location.href = "profile.html"; // Redirect on success
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

    // Store user details in Firestore immediately after creating user
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date().toISOString()
    });

    console.log("User signed up and details stored in Firestore:", user);
    window.location.href = "profile.html"; // Redirect on success
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

export const displayUserProfile = async () => {
  const user = auth.currentUser;

  // Check if user is signed in
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If the user document exists, display the user data
      if (userDoc.exists()) {
        const userData = userDoc.data();

        document.querySelector(".profile-details h1").textContent = userData.username;
        document.querySelector(".profile-details h3").textContent = userData.email;
        document.querySelector(".profile-details h2").textContent = `🕗 Joined ${new Date(userData.createdAt).toLocaleDateString()}`;
      } else {
        console.log("User document not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.log("No user is signed in.");
    window.location.href = "login.html"; // Redirect to login if not signed in
  }
};