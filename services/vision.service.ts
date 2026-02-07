import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc,
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { IVisionItem, ICreateVisionDTO } from '@interfaces/vision.interface';

const COLLECTION_NAME = 'visions';

export class VisionService {
  private get userId() {
    return auth.currentUser?.uid;
  }

  async getVisions(): Promise<IVisionItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', this.userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    })) as IVisionItem[];
  }

  async addVision(data: ICreateVisionDTO): Promise<IVisionItem> {
    if (!this.userId) throw new Error('User not authenticated');

    const visionData = {
      userId: this.userId,
      title: data.title,
      imageUrl: data.imageUrl || '',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), visionData);
    
    return {
      id: docRef.id,
      ...visionData,
    } as IVisionItem;
  }

  async deleteVision(visionId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const visionRef = doc(db, COLLECTION_NAME, visionId);
    await deleteDoc(visionRef);
  }
}

export const visionService = new VisionService();
