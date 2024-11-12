// api/login.js
import { auth, db, storage } from "./config/firebaseConfig.js";
import { collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
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
      createdAt: new Date().toISOString(),
      profilePicture: "../assets/green-player.png" // Default profile picture
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

        // Display the profile picture, username, email, and join date
        document.getElementById("profile-picture").src = userData.profilePicture || "../assets/green_player.png";
        document.getElementById("username").value = userData.username;
        document.getElementById("email").textContent = userData.email;
        document.getElementById("join-date").textContent = `🕗 Joined ${new Date(userData.createdAt).toLocaleDateString()}`;
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


// Toggle username edit mode
document.getElementById("edit-button").addEventListener("click", () => {
  const editButton = document.getElementById("edit-button");
  const usernameInput = document.getElementById("username");

  if (editButton.textContent === "Edit Profile") {
      // Enable username editing
      usernameInput.disabled = false;
      editButton.textContent = "Save Changes";
  } else {
      // Save username changes
      saveUsername();
      editButton.textContent = "Edit Profile";
      usernameInput.disabled = true;
  }
});

// Function to save updated username to Firestore
const saveUsername = async () => {
  const user = auth.currentUser;
  const username = document.getElementById("username").value;

  try {
      await setDoc(doc(db, "users", user.uid), { username: username }, { merge: true });
      console.log("Username updated successfully!");
  } catch (error) {
      console.error("Error updating username:", error);
  }
};

let temporaryProfilePicture = null; // Variable to store Base64 data

// Function to handle profile picture upload, preview, and save automatically
document.getElementById("profile-picture-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        // When the file is read, update the profile picture preview and save it to Firestore
        reader.onloadend = async () => {
            temporaryProfilePicture = reader.result; // Store Base64 data
            document.getElementById("profile-picture").src = temporaryProfilePicture; // Show preview

            // Save the Base64 data to Firestore
            const user = auth.currentUser;
            if (user) {
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        profilePicture: temporaryProfilePicture
                    }, { merge: true });

                    console.log("Profile picture updated successfully in Firestore!");
                    // Clear temporary profile picture after saving
                    temporaryProfilePicture = null;
                } catch (error) {
                    console.error("Error updating profile picture:", error);
                    alert("Error updating profile picture: " + error.message);
                }
            } else {
                console.log("No user is signed in.");
            }
        };

        // Start reading the file as a Base64 string
        reader.readAsDataURL(file);
    }
});