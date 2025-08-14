"use client"

import React, { useState } from "react";
import {
  ChatBubbleLeftIcon,
  HomeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { title: "Home", icon: HomeIcon, active: true },
  { title: "New Chat", icon: ChatBubbleLeftIcon },
  { title: "Explore", icon: GlobeAltIcon },
  { title: "Vault", icon: LockClosedIcon },
  { title: "Archive", icon: ArchiveBoxIcon },
  { title: "Settings", icon: Cog6ToothIcon },
];

function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="relative h-screen">
      {/* Sidebar Container */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-out z-40
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="font-semibold text-gray-900 dark:text-white">Query</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item, index) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a
                href="#"
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${item.active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {/* Icon */}
                <item.icon 
                  className={`
                    w-5 h-5 flex-shrink-0 transition-colors
                    ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                  `} 
                />
                
                {/* Label */}
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">
                    {item.title}
                  </span>
                )}

                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-r-full"></div>
                )}
              </a>

              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === index && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800">
          {!isCollapsed ? (
            <div className="text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">Query AI v2.1.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300
          ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        onClick={() => setIsCollapsed(true)}
      />
    </div>
  );
}

export default AppSidebar;