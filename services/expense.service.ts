import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { IExpense, ICreateExpenseDTO, ExpenseCategory } from '@interfaces/expense.interface';

const COLLECTION_NAME = 'expenses';

export interface IUpdateExpenseDTO {
  amount?: number;
  category?: ExpenseCategory;
  note?: string;
  date?: string;
}

export class ExpenseService {
  private get userId() {
    return auth.currentUser?.uid;
  }

  async getExpenses(): Promise<IExpense[]> {
    if (!this.userId) throw new Error('User not authenticated');

    // Query without orderBy to avoid requiring a composite index
    // We'll sort client-side instead
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', this.userId)
    );
    
    const snapshot = await getDocs(q);
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    })) as IExpense[];

    // Sort by date descending (newest first) on client side
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async setExpense(data: ICreateExpenseDTO): Promise<IExpense> {
    if (!this.userId) throw new Error('User not authenticated');

    const expenseData = {
      userId: this.userId,
      amount: data.amount,
      category: data.category,
      note: data.note || '',
      date: new Date(data.date),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseData);
    
    return {
      id: docRef.id,
      ...expenseData,
      date: data.date,
    } as IExpense;
  }

  async updateExpense(expenseId: string, data: IUpdateExpenseDTO): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.note !== undefined) updateData.note = data.note;
    if (data.date !== undefined) updateData.date = new Date(data.date);

    const docRef = doc(db, COLLECTION_NAME, expenseId);
    await updateDoc(docRef, updateData);
  }

  async deleteExpense(expenseId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const docRef = doc(db, COLLECTION_NAME, expenseId);
    await deleteDoc(docRef);
  }
}

export const expenseService = new ExpenseService();

