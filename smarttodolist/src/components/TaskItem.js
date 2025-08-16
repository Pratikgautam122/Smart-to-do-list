import React from 'react';
import { Calendar, Bell, Home, Edit3, Trash2, Check, Clock } from 'lucide-react';

export default function TaskItem({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete,
  loading = false 
}) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isOverdue = (dateString, timeString) => {
    if (!dateString) return false;
    
    const now = new Date();
    const taskDateTime = new Date(dateString);
    
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      taskDateTime.setHours(parseInt(hours), parseInt(minutes));
    } else {
      taskDateTime.setHours(23, 59, 59, 999);
    }
    
    return taskDateTime < now && !task.completed;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 hover:shadow-md transition-all duration-200 animate-slideIn ${
      getPriorityColor(task.priority)
    } ${task.completed ? 'opacity-60' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Task Header */}
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => onToggle(task.id, !task.completed)}
                disabled={loading}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <h3 className={`text-lg font-semibold flex-1 ${
                task.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {task.text}
              </h3>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getPriorityBadgeColor(task.priority)
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            
            {/* Task Description */}
            {task.description && (
              <p className={`mb-3 leading-relaxed ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            {/* Task Meta Information */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className={`flex items-center gap-1 ${
                task.completed ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Home className="w-4 h-4" />
                {task.category}
              </span>
              
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${
                  isOverdue(task.dueDate, task.dueTime) 
                    ? 'text-red-600 font-medium' 
                    : task.completed 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  <Calendar className="w-4 h-4" />
                  {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate, task.dueTime) && (
                    <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Overdue
                    </span>
                  )}
                </span>
              )}

              {task.dueTime && (
                <span className={`flex items-center gap-1 ${
                  isOverdue(task.dueDate, task.dueTime) 
                    ? 'text-red-600 font-medium' 
                    : task.completed 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(task.dueTime)}
                </span>
              )}
              
              {task.reminder && (
                <span className={`flex items-center gap-1 ${
                  task.completed ? 'text-gray-400' : 'text-yellow-600'
                }`}>
                  <Bell className="w-4 h-4" />
                  Reminder
                </span>
              )}
            </div>
            
            {/* Creation Date */}
            {task.createdAt && (
              <div className="mt-2 text-xs text-gray-400">
                Created {task.createdAt.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit task"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}