import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { ITask, ICreateTaskDTO } from '@interfaces/task.interface';

const COLLECTION_NAME = 'tasks';

export class TaskService {
  private get userId() {
    return auth.currentUser?.uid;
  }

  async getTasks(): Promise<ITask[]> {
    if (!this.userId) throw new Error('User not authenticated');

    // Query without orderBy to avoid requiring a composite index
    // We'll sort client-side instead
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', this.userId)
    );
    
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      scheduledFor: doc.data().scheduledFor?.toDate?.()?.toISOString() || doc.data().scheduledFor,
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || doc.data().completedAt,
    })) as ITask[];

    // Sort by scheduledFor ascending (upcoming tasks first)
    return tasks.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }

  async createTask(data: ICreateTaskDTO): Promise<ITask> {
    if (!this.userId) throw new Error('User not authenticated');

    const taskData = {
      userId: this.userId,
      title: data.title,
      category: data.category,
      type: 'one-time',
      isCompleted: false,
      scheduledFor: new Date(data.scheduledFor),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), taskData);
    
    return {
      id: docRef.id,
      ...taskData,
      scheduledFor: data.scheduledFor,
    } as ITask;
  }

  async toggleTask(taskId: string, currentStatus: boolean): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await updateDoc(taskRef, {
      isCompleted: !currentStatus,
      completedAt: !currentStatus ? serverTimestamp() : null,
    });
  }

  async updateTask(taskId: string, updates: Partial<ICreateTaskDTO>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const taskRef = doc(db, COLLECTION_NAME, taskId);
    const updatePayload: any = { ...updates };
    if (updates.scheduledFor) {
        updatePayload.scheduledFor = new Date(updates.scheduledFor);
    }
    
    await updateDoc(taskRef, updatePayload);
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await deleteDoc(taskRef);
  }
}

export const taskService = new TaskService();
