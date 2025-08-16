import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  selectedCategory,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  loading = false
}) {
  const getEmptyStateMessage = () => {
    if (selectedCategory === 'All Tasks') {
      return {
        title: 'No tasks yet',
        subtitle: 'Create your first task to get started organizing your life'
      };
    } else {
      return {
        title: `No ${selectedCategory.toLowerCase()} tasks`,
        subtitle: `Add your first ${selectedCategory.toLowerCase()} task to get organized`
      };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory}
          </h2>
          <p className="text-gray-500 mt-1">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            {tasks.length > 0 && (
              <span className="ml-2">
                • {tasks.filter(t => t.completed).length} completed
              </span>
            )}
          </p>
        </div>
        
        <button
          onClick={onAddTask}
          disabled={loading}
          className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <span className="ml-3 text-gray-600">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {emptyState.title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {emptyState.subtitle}
            </p>
            <button
              onClick={onAddTask}
              className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Task
            </button>
          </div>
        ) : (
          // Task Items
          <div className="space-y-3">
            {/* Pending Tasks */}
            {tasks.filter(task => !task.completed).length > 0 && (
              <>
                {tasks
                  .filter(task => !task.completed)
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onTaskToggle}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      loading={loading}
                    />
                  ))}
              </>
            )}

            {/* Completed Tasks */}
            {tasks.filter(task => task.completed).length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Completed ({tasks.filter(task => task.completed).length})
                  </span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.completed)
                    .map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onTaskToggle}
                        onEdit={onTaskEdit}
                        onDelete={onTaskDelete}
                        loading={loading}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}