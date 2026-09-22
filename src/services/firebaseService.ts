import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  initialMembers, 
  initialNonMembers, 
  initialAnnouncements, 
  initialInstructors, 
  initialBoxingSchedules, 
  initialTransactions,
  initialPricing,
  initialGallery,
  initialAppSettings
} from '../data/initialData';
import { Member, NonMemberPass, Announcement, Instructor, BoxingSchedule, Transaction, GymPricing, GalleryItem, AppSettings } from '../types';

const COLLECTIONS = {
  MEMBERS: 'members',
  NON_MEMBERS: 'nonMembers',
  ANNOUNCEMENTS: 'announcements',
  INSTRUCTORS: 'instructors',
  BOXING_SCHEDULES: 'boxingSchedules',
  TRANSACTIONS: 'transactions',
  PRICING: 'pricings',
  GALLERY: 'gallery',
  SETTINGS: 'appSettings'
};

// Generic fetcher with auto-seed
export async function fetchCollection<T>(collectionName: string, initialData: T[]): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Seed initial data
      for (const item of initialData) {
        const itemWithId = item as any;
        const docId = itemWithId.id || doc(collection(db, collectionName)).id;
        await setDoc(doc(db, collectionName, docId), { ...itemWithId, id: docId });
      }
      return initialData;
    }
    
    const items: T[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
    });
    return items;
  } catch (error) {
    console.warn(`Error fetching ${collectionName} from Firebase, falling back to localStorage/initial:`, error);
    const local = localStorage.getItem(`gogym_${collectionName}`);
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* ignore */ }
    }
    return initialData;
  }
}

export async function saveLocalCache(collectionName: string, data: any) {
  try {
    localStorage.setItem(`gogym_${collectionName}`, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

// Specific entity services
export async function getMembers(): Promise<Member[]> {
  const data = await fetchCollection<Member>(COLLECTIONS.MEMBERS, initialMembers);
  saveLocalCache(COLLECTIONS.MEMBERS, data);
  return data;
}

export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  const docRef = await addDoc(collection(db, COLLECTIONS.MEMBERS), member);
  const newMember = { ...member, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newMember;
}

export async function updateMember(id: string, data: Partial<Member>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MEMBERS, id);
  await updateDoc(docRef, data);
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.MEMBERS, id));
}

// Non-Members
export async function getNonMembers(): Promise<NonMemberPass[]> {
  const data = await fetchCollection<NonMemberPass>(COLLECTIONS.NON_MEMBERS, initialNonMembers);
  saveLocalCache(COLLECTIONS.NON_MEMBERS, data);
  return data;
}

export async function addNonMember(pass: Omit<NonMemberPass, 'id'>): Promise<NonMemberPass> {
  const docRef = await addDoc(collection(db, COLLECTIONS.NON_MEMBERS), pass);
  const newPass = { ...pass, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newPass;
}

export async function updateNonMember(id: string, data: Partial<NonMemberPass>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.NON_MEMBERS, id);
  await updateDoc(docRef, data);
}

export async function deleteNonMember(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.NON_MEMBERS, id));
}

// Announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await fetchCollection<Announcement>(COLLECTIONS.ANNOUNCEMENTS, initialAnnouncements);
  saveLocalCache(COLLECTIONS.ANNOUNCEMENTS, data);
  return data;
}

export async function addAnnouncement(item: Omit<Announcement, 'id'>): Promise<Announcement> {
  const docRef = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ANNOUNCEMENTS, id);
  await updateDoc(docRef, data);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
}

// Instructors
export async function getInstructors(): Promise<Instructor[]> {
  const data = await fetchCollection<Instructor>(COLLECTIONS.INSTRUCTORS, initialInstructors);
  saveLocalCache(COLLECTIONS.INSTRUCTORS, data);
  return data;
}

export async function addInstructor(item: Omit<Instructor, 'id'>): Promise<Instructor> {
  const docRef = await addDoc(collection(db, COLLECTIONS.INSTRUCTORS), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

export async function updateInstructor(id: string, data: Partial<Instructor>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.INSTRUCTORS, id);
  await updateDoc(docRef, data);
}

export async function deleteInstructor(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.INSTRUCTORS, id));
}

// Boxing Schedules
export async function getBoxingSchedules(): Promise<BoxingSchedule[]> {
  const data = await fetchCollection<BoxingSchedule>(COLLECTIONS.BOXING_SCHEDULES, initialBoxingSchedules);
  saveLocalCache(COLLECTIONS.BOXING_SCHEDULES, data);
  return data;
}

export async function addBoxingSchedule(item: Omit<BoxingSchedule, 'id'>): Promise<BoxingSchedule> {
  const docRef = await addDoc(collection(db, COLLECTIONS.BOXING_SCHEDULES), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

export async function updateBoxingSchedule(id: string, data: Partial<BoxingSchedule>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.BOXING_SCHEDULES, id);
  await updateDoc(docRef, data);
}

export async function deleteBoxingSchedule(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BOXING_SCHEDULES, id));
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const data = await fetchCollection<Transaction>(COLLECTIONS.TRANSACTIONS, initialTransactions);
  saveLocalCache(COLLECTIONS.TRANSACTIONS, data);
  return data;
}

export async function addTransaction(item: Omit<Transaction, 'id'>): Promise<Transaction> {
  const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

// Pricings
export async function getPricings(): Promise<GymPricing[]> {
  const data = await fetchCollection<GymPricing>(COLLECTIONS.PRICING, initialPricing);
  saveLocalCache(COLLECTIONS.PRICING, data);
  return data;
}

export async function addPricing(item: Omit<GymPricing, 'id'>): Promise<GymPricing> {
  const docRef = await addDoc(collection(db, COLLECTIONS.PRICING), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

export async function updatePricing(id: string, data: Partial<GymPricing>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRICING, id);
  await updateDoc(docRef, data);
}

export async function deletePricing(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRICING, id));
}

// Gallery
export async function getGallery(): Promise<GalleryItem[]> {
  const data = await fetchCollection<GalleryItem>(COLLECTIONS.GALLERY, initialGallery);
  saveLocalCache(COLLECTIONS.GALLERY, data);
  return data;
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const docRef = await addDoc(collection(db, COLLECTIONS.GALLERY), item);
  const newItem = { ...item, id: docRef.id };
  await updateDoc(docRef, { id: docRef.id });
  return newItem;
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.GALLERY, id);
  await updateDoc(docRef, data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}

// App Settings (Hero Image & Info)
export async function getAppSettings(): Promise<AppSettings> {
  const cacheKey = 'gogym_appSettings';
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'main_settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as AppSettings;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } else {
      await setDoc(docRef, initialAppSettings);
      localStorage.setItem(cacheKey, JSON.stringify(initialAppSettings));
      return initialAppSettings;
    }
  } catch (e) {
    const local = localStorage.getItem(cacheKey);
    if (local) {
      try { return JSON.parse(local); } catch (err) { /* ignore */ }
    }
    return initialAppSettings;
  }
}

export async function updateAppSettings(data: Partial<AppSettings>): Promise<void> {
  const cacheKey = 'gogym_appSettings';
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'main_settings');
    await setDoc(docRef, data, { merge: true });
  } catch (e) {
    console.warn('Error saving appSettings to Firestore, saving to local cache:', e);
  }
  const local = localStorage.getItem(cacheKey);
  let current = local ? JSON.parse(local) : initialAppSettings;
  const updated = { ...current, ...data };
  localStorage.setItem(cacheKey, JSON.stringify(updated));
}

