import { collection, addDoc, doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const saveAudit = async (auditData) => {
  const docRef = await addDoc(
    collection(db, "audits"),
    auditData
  );

  return docRef.id;
};

export const getAudit = async (id) => {
  const docRef = doc(db, "audits", id);

  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};