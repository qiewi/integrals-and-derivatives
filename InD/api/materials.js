import { auth, db } from "./config/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export const displayUserProgress = async () => {
    const user = auth.currentUser;
  
    if (user) {
        try {
            const userDocRef = doc(db, "Integral", user.uid);
            const userDoc = await getDoc(userDocRef);

            
            const userData = userDoc.data();
            const unlockedLevels = userData.completedLevels || 0;
            const totalLevels = 5; // Assuming there are 4 collectible cards
            const progressPercentage = (unlockedLevels / totalLevels) * 100;
  
            if (userDoc.exists()) {
                // Update progress bar width and text
                const progressText = document.getElementById("progress-text-integral");
                progressText.innerHTML = `<b>${progressPercentage.toFixed(0)}%`;
                document.querySelector(".progress-bar").style.width = `${progressPercentage}%`;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.log("No user is signed in.");
        window.location.href = "login.html";
    }
};