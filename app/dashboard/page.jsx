"use client"

import React, { useEffect, useState } from 'react'
import AddNewInterview from './_components/AddNewInterview'
import { motion } from 'framer-motion'
import { FaRocket, FaChartLine, FaMicrophone, FaCrown, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

function Dashboard() {
  const { user } = useUser();
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (email) {
          const res = await fetch(`/api/subscription?email=${email}`);
          const data = await res.json();
          setUserSubscription(data);
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        toast.error("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const canCreateProject = () => {
    if (!userSubscription) return false;
    return userSubscription.isSubscribed || userSubscription.projectCount < 5;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-4 rounded-full shadow-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Interview Dashboard
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Ready to ace your next interview? Let's practice together!
            </p>
          </div>
        </motion.div>

        {/* Subscription Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mb-8 rounded-2xl p-6 shadow-lg backdrop-blur-sm ${
            userSubscription?.isSubscribed
              ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30'
              : 'bg-gradient-to-br from-gray-800 to-gray-700/90 border border-gray-600'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-xl ${
                userSubscription?.isSubscribed
                  ? 'bg-purple-600/20 text-purple-300'
                  : 'bg-blue-600/20 text-blue-300'
              }`}>
                <FaCrown className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {userSubscription?.isSubscribed
                    ? `Premium Membership (${userSubscription.subscriptionType})`
                    : 'Free Account'}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {userSubscription?.isSubscribed
                    ? 'Enjoy unlimited interviews and premium features'
                    : 'Create up to 5 interviews for free'}
                </p>
              </div>
            </div>

            {!userSubscription?.isSubscribed && (
              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-48">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Interview Limit</span>
                      <span>{userSubscription?.projectCount || 0}/5</span>
                    </div>
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, (userSubscription?.projectCount || 0) * 20)}%` }}
                      />
                    </div>
                  </div>
                  {userSubscription?.projectCount >= 5 && (
                    <Link href="/dashboard/premium" className="w-full sm:w-auto">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md">
                        Upgrade Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Quick Actions</h2>
            <p className="text-gray-400">Start your journey to interview success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Analytics Card (Coming Soon) */}
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 cursor-pointer opacity-50"
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur opacity-20"></div>
                  <div className="relative bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <FaChartLine className="text-purple-400 text-xl" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Analytics</h3>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </motion.div>

            {/* Main Interview Card */}
            {canCreateProject() ? (
              <AddNewInterview />
            ) : (
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl p-6 hover:border-red-400 transition-all duration-300 group"
              >
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                  Limit Reached
                </div>
                <div className="text-center h-full flex flex-col">
                  <div className="relative mb-4 flex-1 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <FaRocket className="text-red-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">New Interview</h3>
                    <p className="text-sm text-gray-400 mb-4">You've reached your free limit</p>
                  </div>
                  <Link href="/dashboard/premium">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2 shadow-md">
                      <FaCrown className="text-yellow-300" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Voice Training Card (Coming Soon) */}
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl p-6 hover:border-green-400 transition-all duration-300 cursor-pointer opacity-50"
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-20"></div>
                  <div className="relative bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <FaMicrophone className="text-green-400 text-xl" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Voice Training</h3>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Features Highlight (for free users) */}
        {!userSubscription?.isSubscribed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Unlock Premium Features</h3>
                <p className="text-gray-300 mb-4">
                  Get unlimited interviews and advanced feedback to maximize your preparation.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: <FaCheckCircle className="text-purple-400" />, text: 'Unlimited interviews' },
                    { icon: <FaCheckCircle className="text-purple-400" />, text: 'Detailed analytics' },
                    { icon: <FaCheckCircle className="text-purple-400" />, text: 'Priority support' },
                    { icon: <FaCheckCircle className="text-purple-400" />, text: 'Exclusive content' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-48 flex-shrink-0">
                <Link href="/dashboard/premium">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2 shadow-lg">
                    <FaCrown />
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard