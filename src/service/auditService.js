import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

const sanitizeForFirestore = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [key, sanitizeForFirestore(nestedValue)])
        .filter(([, nestedValue]) => nestedValue !== undefined)
    );
  }

  return value === undefined ? undefined : value;
};

export const saveAudit = async (id, auditData) => {
  const docRef = doc(db, "audits", id);
  const sanitizedAuditData = sanitizeForFirestore(auditData);

  await setDoc(docRef, sanitizedAuditData);

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
