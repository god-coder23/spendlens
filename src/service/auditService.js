import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const saveAudit = async (id, auditData) => {
  const docRef = doc(db, "audits", id);

  await setDoc(docRef, auditData);

  return id;
};

export const getAudit = async (id) => {
  const docRef = doc(db, "audits", id);

  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};
