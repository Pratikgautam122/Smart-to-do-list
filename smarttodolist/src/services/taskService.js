import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const taskService = {
  // Get all tasks for a user
  async getTasks(userId) {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate || '',
        dueTime: doc.data().dueTime || '',
        reminderTime: doc.data().reminderTime || '30'
      }));
    } catch (error) {
      throw new Error('Failed to load tasks: ' + error.message);
    }
  },

  // Add a new task
  async addTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        completed: false,
        createdAt: serverTimestamp(),
        dueTime: taskData.dueTime || '',
        reminderTime: taskData.reminderTime || '30'
      });
      return docRef.id;
    } catch (error) {
      throw new Error('Failed to add task: ' + error.message);
    }
  },

  // Update a task
  async updateTask(taskId, updateData) {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updateData,
        dueTime: updateData.dueTime || '',
        reminderTime: updateData.reminderTime || '30'
      });
    } catch (error) {
      throw new Error('Failed to update task: ' + error.message);
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      throw new Error('Failed to delete task: ' + error.message);
    }
  },

  // Toggle task completion
  async toggleTask(taskId, completed) {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed });
    } catch (error) {
      throw new Error('Failed to toggle task: ' + error.message);
    }
  }
};