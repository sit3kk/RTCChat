import { db } from "../api/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { Contact } from "../types/ContactData";
import { randomAvatar } from "../utils/utils";

export const fetchContacts = async (userId: string): Promise<Contact[]> => {
  try {
    const contactsQuery = query(
      collection(db, "contacts"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(contactsQuery);

    const contacts: Contact[] = [];
    for (const contactDoc of querySnapshot.docs) {
      const contactData = contactDoc.data();
      const contactUserId = contactData.contactId;

      const contactUserRef = doc(db, "users", contactUserId);
      const contactUserDoc = await getDoc(contactUserRef);

      if (contactUserDoc.exists()) {
        const userData = contactUserDoc.data() as { name: string };
        contacts.push({
          id: contactDoc.id,
          name: userData.name,
          avatar: randomAvatar(), // TODO: fetch user avatar
        });
      }
    }
    return contacts;
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    throw error;
  }
};
