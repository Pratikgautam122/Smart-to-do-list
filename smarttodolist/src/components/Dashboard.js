import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import Header from './Header';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TaskModal from './TaskModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Tasks');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    text: '',
    description: '',
    category: 'Personal',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    reminder: false,
    reminderTime: '30'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  useEffect(() => {
    let filtered = tasks;
    
    // Filter by category
    if (selectedCategory !== 'All Tasks') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }
    
    // Filter by status
    switch (selectedFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(task => task.dueDate === today);
        break;
    }
    
    setFilteredTasks(filtered);
  }, [tasks, selectedCategory, selectedFilter]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const loadedTasks = await taskService.getTasks(user.uid);
      setTasks(loadedTasks);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTask.text.trim()) {
      setError('Task title is required');
      return;
    }
    
    setLoading(true);
    try {
      const taskData = {
        ...newTask,
        userId: user.uid
      };
      
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        setSuccess('Task updated successfully!');
      } else {
        await taskService.addTask(taskData);
        setSuccess('Task added successfully!');
      }
      
      resetTaskForm();
      await loadTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId, completed) => {
    try {
      await taskService.toggleTask(taskId, completed);
      await loadTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(taskId);
      setSuccess('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      text: task.text,
      description: task.description || '',
      category: task.category,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      priority: task.priority,
      reminder: task.reminder || false,
      reminderTime: task.reminderTime || '30'
    });
    setShowTaskModal(true);
  };

  const resetTaskForm = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setNewTask({
      text: '',
      description: '',
      category: 'Personal',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      reminder: false,
      reminderTime: '30'
    });
  };

  const getTaskCounts = () => {
    const counts = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      'All Tasks': tasks.length
    };

    const categories = ["Work", "Personal", "School", "Health", "Shopping"];
    categories.forEach(category => {
      counts[category] = tasks.filter(t => t.category === category).length;
    });

    return counts;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            taskCounts={getTaskCounts()}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        {success && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg animate-slideIn">
            {success}
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg animate-slideIn">
            {error}
          </div>
        )}

        <div className="flex-1 p-6">
          <TaskList
            tasks={filteredTasks}
            selectedCategory={selectedCategory}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddTask={() => setShowTaskModal(true)}
            loading={loading}
          />
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={resetTaskForm}
        newTask={newTask}
        setNewTask={setNewTask}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
        loading={loading}
      />
    </div>
  );
}