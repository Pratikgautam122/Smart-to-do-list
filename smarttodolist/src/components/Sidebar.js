import React from 'react';
import { Home, Filter, Briefcase, User, GraduationCap, Heart, ShoppingCart } from 'lucide-react';

const CATEGORIES = [
  { key: "Work", label: "Work", icon: Briefcase },
  { key: "Personal", label: "Personal", icon: User },
  { key: "School", label: "School", icon: GraduationCap },
  { key: "Health", label: "Health", icon: Heart },
  { key: "Shopping", label: "Shopping", icon: ShoppingCart }
];

const FILTERS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'high', label: 'High Priority' },
  { key: 'today', label: 'Due Today' }
];

export default function Sidebar({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedFilter, 
  setSelectedFilter,
  taskCounts = {}
}) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-emerald-500" />
          Categories
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('All Tasks')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
              selectedCategory === 'All Tasks'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4" />
              <span className="font-medium">All Tasks</span>
            </div>
            {taskCounts['All Tasks'] !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === 'All Tasks'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {taskCounts['All Tasks']}
              </span>
            )}
          </button>
          
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                  selectedCategory === category.key
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.label}</span>
                </div>
                {taskCounts[category.key] !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.key
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {taskCounts[category.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-500" />
          Filters
        </h2>
        <div className="space-y-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedFilter === filter.key
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-4 text-lg">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-emerald-100">Total Tasks:</span>
            <span className="font-semibold text-xl">{taskCounts.total || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-100">Completed:</span>
            <span className="font-semibold text-xl">{taskCounts.completed || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-100">Pending:</span>
            <span className="font-semibold text-xl">{taskCounts.pending || 0}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-emerald-100">Progress</span>
            <span className="text-sm text-emerald-100">
              {taskCounts.total ? Math.round((taskCounts.completed / taskCounts.total) * 100) : 0}%
            </span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ 
                width: `${taskCounts.total ? (taskCounts.completed / taskCounts.total) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}