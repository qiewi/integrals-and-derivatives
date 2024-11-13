import { auth, db } from "./config/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export const unlockCard = async (cardNumber) => {
    const user = auth.currentUser;
    
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const unlockedCards = userDoc.data().unlockedCards || [];
  
            // Check if the card is not already unlocked
            if (!unlockedCards.includes(cardNumber)) {
                unlockedCards.push(cardNumber); // Add the card to the unlocked array
                await setDoc(userDocRef, { unlockedCards: unlockedCards }, { merge: true });
                console.log(`Card ${cardNumber} unlocked!`);
                window.location.reload(); // Refresh the page to update the UI
            }
        }
    }
  };