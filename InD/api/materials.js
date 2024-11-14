import { auth, db } from "./config/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export const displayUserProgress = async () => {
    const user = auth.currentUser;
  
    if (user) {
        try {
            const userDocRefIntegral = doc(db, "Integral", user.uid);
            const userDocRefDerivative = doc(db, "Derivative", user.uid);
            const userDocIntegral = await getDoc(userDocRefIntegral);
            const userDocDerivative = await getDoc(userDocRefDerivative);
            
            
            const userDataIntegral = userDocIntegral.data();
            const userDataDerivative = userDocDerivative.data();
            const unlockedIntegralLevels = userDataIntegral.completedLevels || 0;
            const unlockedDerivativeLevels = userDataDerivative.completedLevels || 0;
            const totalLevels = 5; // Assuming there are 4 collectible cards
            const progressPercentageIntegral = (unlockedIntegralLevels / totalLevels) * 100;
            const progressPercentageDerivative = (unlockedDerivativeLevels / totalLevels) * 100;
  
            if (userDocIntegral.exists()) {
                // Update progress bar width and text
                const progressTextIntegral = document.getElementById("progress-text-integral");
                progressTextIntegral.innerHTML = `<b>${progressPercentageIntegral.toFixed(0)}%`;
                document.querySelector(".progress-bar.integral").style.width = `${progressPercentageIntegral}%`;

                const progressTextDerivative = document.getElementById("progress-text-derivative");
                progressTextDerivative.innerHTML = `<b>${progressPercentageIntegral.toFixed(0)}%`;
                document.querySelector(".progress-bar.derivative").style.width = `${progressPercentageIntegral}%`;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.log("No user is signed in.");
        window.location.href = "login.html";
    }
};