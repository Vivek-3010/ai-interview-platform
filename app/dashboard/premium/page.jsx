// app/dashboard/premium/page.js
"use client"

import React, { useEffect, useState } from 'react'
import pricing from './_data/pricing'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle, Crown, Zap, Rocket, Star, Infinity, Shield, Headphones, BarChart2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

function Premium() {
  const { user } = useUser()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for Stripe success/cancel
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')

    if (success) {
      toast.success('Subscription successful! Your account has been upgraded.')
      router.replace('/dashboard/premium') // Clean the URL
    } else if (canceled) {
      toast.info('Subscription canceled. You can try again anytime.')
    }

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/subscription?email=${user?.primaryEmailAddress?.emailAddress}`)
        const data = await res.json()
        setSubscription(data)
      } catch (err) {
        console.error("Error fetching subscription:", err)
        toast.error("Failed to load subscription status")
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchSubscription()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {subscription?.isSubscribed ? (
          // SUBSCRIBED USER VIEW
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
            >
              Premium Membership Active
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              You're on the <span className="font-semibold text-purple-300">{subscription.subscriptionType}</span> plan. 
              Thank you for choosing <span className="font-semibold text-purple-300">IntervuX</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <button
                onClick={() => router.push('/dashboard')}
                className="relative group inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Creating Interviews
                </span>
                <span className="absolute inset-0 bg-gradient-to-br from-purple-700 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          // NON-SUBSCRIBED USER VIEW
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <Star className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Unlock unlimited interviews and premium features
            </p>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {subscription?.isSubscribed ? (
          // SUBSCRIBED USER BENEFITS
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Infinity className="w-8 h-8 text-purple-400" />,
                title: "Unlimited Interviews",
                description: "Create as many mock interviews as you need with no restrictions"
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-400" />,
                title: "Priority Support",
                description: "Get faster responses from our dedicated support team"
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-green-400" />,
                title: "Advanced Analytics",
                description: "Detailed performance metrics and improvement suggestions"
              },
              {
                icon: <Headphones className="w-8 h-8 text-yellow-400" />,
                title: "Voice Coach",
                description: "Access to our AI-powered voice modulation training"
              },
              {
                icon: <Lock className="w-8 h-8 text-red-400" />,
                title: "Exclusive Content",
                description: "Premium-only interview questions and scenarios"
              },
              {
                icon: <Zap className="w-8 h-8 text-pink-400" />,
                title: "Early Access",
                description: "Try new features before they're released to everyone"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-purple-400 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // PRICING PLANS FOR NON-SUBSCRIBED USERS
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {pricing.map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-2xl border ${index === 1 ? 'border-yellow-500/30' : 'border-blue-500/30'} bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-xl`}
                >
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{plan.duration} Plan</h3>
                    <p className="text-gray-400">Perfect for {plan.duration === 'Monthly' ? 'getting started' : 'long-term savings'}</p>
                  </div>

                  <div className="mb-8">
                    <p className="text-4xl font-bold text-white mb-1">
                      ${plan.price}
                      <span className="text-lg font-normal text-gray-400">/{plan.duration.toLowerCase()}</span>
                    </p>
                    {plan.duration === 'Yearly' && (
                      <p className="text-green-400 text-sm">Save 25% compared to monthly</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited interviews',
                      'Priority support',
                      'Advanced analytics',
                      'Voice coach access',
                      'Exclusive content'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`${plan.link}?prefilled_email=${user?.primaryEmailAddress?.emailAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3 px-6 rounded-lg font-medium transition-all ${index === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'}`}
                  >
                    Choose {plan.duration} Plan
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Free vs Premium Comparison */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-4 px-6 text-left font-medium text-gray-300">Feature</th>
                      <th className="py-4 px-6 text-center font-medium text-gray-300">Free</th>
                      <th className="py-4 px-6 text-center font-medium text-purple-400">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Interview Limit', '5', <Infinity className="w-5 h-5 text-purple-400 mx-auto" />],
                      ['Priority Support', '✗', '✓'],
                      ['Advanced Analytics', 'Basic', 'Detailed'],
                      ['Voice Coach', '✗', '✓'],
                      ['Exclusive Content', '✗', '✓'],
                      ['Response Time', '48 hours', '<12 hours']
                    ].map(([feature, free, premium], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-800/20' : ''}>
                        <td className="py-4 px-6 text-gray-300">{feature}</td>
                        <td className="py-4 px-6 text-center text-gray-400">{free}</td>
                        <td className="py-4 px-6 text-center text-purple-300">{premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Premium