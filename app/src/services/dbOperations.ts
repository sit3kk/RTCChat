import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  QueryConstraint,
  DocumentData,
  arrayUnion,
  OrderByDirection,
} from "firebase/firestore";

export const executeQuery = async (
  collectionName: string,
  constraints: QueryConstraint[]
) => {
  const colRef = collection(db, collectionName);
  const queryRef = query(colRef, ...constraints);
  return getDocs(queryRef);
};

export const fetchDoc = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  return getDoc(docRef);
};

export const createDoc = (collectionName: string, data: any) => {
  const colRef = collection(db, collectionName);
  return addDoc(colRef, data);
};

export const updateDocById = (
  collectionName: string,
  docId: string,
  data: any
) => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, data);
};

export const deleteDocById = (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  return deleteDoc(docRef);
};

export const createSnapshotListener = (
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (snapshot: any) => void
) => {
  const colRef = collection(db, collectionName);
  const queryRef = query(colRef, ...constraints);
  return onSnapshot(queryRef, callback);
};

export const onQuerySnapshot = (
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (documents: any[]) => void
) => {
  const colRef = collection(db, collectionName);
  const compoundQuery = query(colRef, ...constraints);
  return onSnapshot(compoundQuery, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};

export const pushToArrayInDoc = (
  collectionName: string,
  docId: string,
  arrayField: string,
  value: any
) => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, {
    [arrayField]: arrayUnion(value),
  });
};

export const getTimestamp = () => Timestamp.now();
