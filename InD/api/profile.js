import { auth, db } from "./config/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { unlockCard } from "../api/card.js";

export const displayUserProfile = async () => {
    const user = auth.currentUser;
  
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const unlockedCards = userData.unlockedCards || [];
                const totalCards = 4; // Assuming there are 4 collectible cards
                const progressPercentage = (unlockedCards.length / totalCards) * 100;
  
                document.getElementById("profile-picture").src = userData.profilePicture || "../assets/green_player.png";
                document.getElementById("username").value = userData.username;
                document.getElementById("email").textContent = `📧 ${userData.email}`;
                document.getElementById("join-date").textContent = `🕗 Joined ${new Date(userData.createdAt).toLocaleDateString()}`;
  
                // Update progress bar width and text
                const progressText = document.getElementById("progress-text");
                progressText.innerHTML = `<b>${unlockedCards.length}/${totalCards}`;
                document.querySelector(".progress-bar").style.width = `${progressPercentage}%`;
  
                // Display cards based on unlocked status
                const cards = document.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    const cardNumber = index + 1;
                    if (unlockedCards.includes(cardNumber)) {
                        card.classList.remove("locked");
                    } else {
                        card.classList.add("locked");
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.log("No user is signed in.");
        window.location.href = "login.html";
    }
  };

// Toggle username edit mode
document.getElementById("edit-button").addEventListener("click", () => {
    const editButton = document.getElementById("edit-button");
    const usernameInput = document.getElementById("username");
  
    if (editButton.textContent === "Edit Username") {
        // Enable username editing
        usernameInput.disabled = false;
        editButton.textContent = "Save Changes";
    } else {
        // Save username changes
        saveUsername();
        editButton.textContent = "Edit Username";
        usernameInput.disabled = true;
    }
  });

// Save Username and Set Flag
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
    
    reader.onloadend = async () => {
        temporaryProfilePicture = reader.result;
        document.getElementById("profile-picture").src = temporaryProfilePicture;

        const user = auth.currentUser;
        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    profilePicture: temporaryProfilePicture
                }, { merge: true });

                console.log("Profile picture updated successfully in Firestore!");
                temporaryProfilePicture = null;

                // Unlock card 1 when photo is updated
                await unlockCard(1);

            } catch (error) {
                console.error("Error updating profile picture:", error);
                alert("Error updating profile picture: " + error.message);
            }
        } else {
            console.log("No user is signed in.");
        }
    };

    reader.readAsDataURL(file);
}
});

