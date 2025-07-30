"use client"

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaMicrophone, FaChartBar, FaHistory, FaCrown, FaQuestionCircle, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Header() {
  const path = usePathname();

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: <FaChartBar className="text-sm" />
    },
    { 
      href: '/dashboard/history', 
      label: 'History', 
      icon: <FaHistory className="text-sm" />
    },
    { 
      href: '/dashboard/premium', 
      label: 'Premium', 
      icon: <FaCrown className="text-sm" />
    },
    { 
      href: '/dashboard/voice-coach', 
      label: ' Voice Coach', 
      icon: <FaRobot className="text-sm" />
    }
  ];

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/dashboard">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                  <FaMicrophone className="text-white text-xl" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                IntervuX
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-800/50 rounded-full px-2 py-1 backdrop-blur-sm border border-gray-700">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2
                    ${path === item.href 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                  {path === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* User Button */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
            <div className="relative bg-gray-800 p-1 rounded-full border border-gray-700">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-gray-800 border-gray-700",
                    userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700"
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <nav className="flex items-center gap-1 bg-gray-800/50 rounded-full px-2 py-1 backdrop-blur-sm border border-gray-700 overflow-x-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative px-3 py-2 rounded-full transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                    ${path === item.href 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium text-xs">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}

export default Header;