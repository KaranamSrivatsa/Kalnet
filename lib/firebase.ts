import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  DocumentData
} from "firebase/firestore";
import { AnalysisResult } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let db: ReturnType<typeof getFirestore> | null = null;
let firebaseInitialized = false;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  firebaseInitialized = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed, using localStorage:", error);
}

export function isFirebaseReady(): boolean {
  return firebaseInitialized && db !== null;
}

export async function saveAnalysis(analysis: Omit<AnalysisResult, "id">): Promise<string> {
  // Try Firebase first if initialized
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "analyses"), {
        ...analysis,
        createdAt: Timestamp.fromDate(new Date(analysis.createdAt)),
      });
      console.log("Analysis saved to Firebase with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Firebase save failed, falling back to localStorage:", error);
    }
  }

  // Fallback to localStorage
  const analyses = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("analyses") || "[]" : "[]");
  const newAnalysis = { ...analysis, id: Date.now().toString() };
  analyses.push(newAnalysis);
  if (typeof window !== "undefined") {
    localStorage.setItem("analyses", JSON.stringify(analyses));
  }
  console.log("Analysis saved to localStorage with ID:", newAnalysis.id);
  return newAnalysis.id;
}

export async function getAnalyses(): Promise<AnalysisResult[]> {
  // Try Firebase first if initialized
  if (db) {
    try {
      const q = query(collection(db, "analyses"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const analyses: AnalysisResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        analyses.push({
          id: doc.id,
          originalInput: data.originalInput,
          structuredOutput: data.structuredOutput,
          missingElements: data.missingElements,
          actionableSteps: data.actionableSteps,
          clarityScore: data.clarityScore,
          createdAt: data.createdAt.toDate().toISOString(),
        });
      });
      console.log("Fetched", analyses.length, "analyses from Firebase");
      return analyses;
    } catch (error) {
      console.error("Firebase fetch failed, falling back to localStorage:", error);
    }
  }

  // Fallback to localStorage
  const analyses = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("analyses") || "[]" : "[]");
  console.log("Fetched", analyses.length, "analyses from localStorage");
  return analyses.sort((a: AnalysisResult, b: AnalysisResult) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export { db };
