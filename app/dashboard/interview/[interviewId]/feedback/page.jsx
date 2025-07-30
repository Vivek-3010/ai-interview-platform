"use client";

import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDown, Star, Brain, FileText, Home, Trophy, Target, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { interviewId } = useParams();
  const router = useRouter();

  const getFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch(`/api/userAnswer/get?mockId=${interviewId}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await res.json();
      
      // Sort by createdAt to maintain question order
      const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      // Add question index based on order
      const dataWithIndex = sortedData.map((item, index) => ({
        ...item,
        displayIndex: index + 1
      }));
      
      setFeedbackList(dataWithIndex);

      if (dataWithIndex.length > 0) {
        const total = dataWithIndex.reduce((sum, item) => sum + (item.rating || 0), 0);
        const average = total / dataWithIndex.length;
        setOverallRating(average.toFixed(1));
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeedback();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4) return "from-green-500 to-emerald-600";
    if (rating >= 3) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-600";
  };

  const getOverallRatingColor = (rating) => {
    if (rating >= 4) return "text-green-400";
    if (rating >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 rounded-full h-8 w-16 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-700 rounded h-4 w-3/4 animate-pulse"></div>
              <div className="bg-gray-700 rounded h-3 w-1/2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Loading state for overall rating
  const LoadingRatingCard = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md mx-auto mb-8"
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <Target className="text-2xl text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Overall Rating</h3>
      </div>
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-400 mb-2 animate-pulse">
          <Loader2 className="w-16 h-16 mx-auto animate-spin" />
        </div>
        <div className="text-gray-400 text-lg">Calculating...</div>
        <div className="flex justify-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-5 h-5 text-gray-600 animate-pulse"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
                <Trophy className="text-white text-3xl" />
              </div>
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                🎉 Congratulations!
              </h1>
              <p className="text-xl text-gray-300">Interview completed successfully</p>
            </div>
          </div>

          {/* Overall Rating Card */}
          {isLoading ? (
            <LoadingRatingCard />
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md mx-auto mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Target className="text-2xl text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Overall Rating</h3>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getOverallRatingColor(overallRating)} mb-2`}>
                  {overallRating ? `${overallRating}` : "N/A"}
                </div>
                <div className="text-gray-400 text-lg">out of 5.0</div>
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(overallRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-gray-400 text-lg">
            {isLoading 
              ? "Loading your performance feedback..." 
              : "Review your performance and feedback below to improve for next time."
            }
          </p>
        </motion.div>

        {/* Feedback Content */}
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/50 rounded-xl p-8 max-w-md mx-auto">
              <FileText className="text-4xl text-red-400 mx-auto mb-4" />
              <p className="text-red-300 text-lg mb-4">{error}</p>
              <Button 
                onClick={getFeedback}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : feedbackList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
              <FileText className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No feedback found for this interview.</p>
              <p className="text-gray-500 text-sm">The interview might not have been completed or feedback is still being processed.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {feedbackList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Collapsible>
                  <CollapsibleTrigger className="w-full cursor-pointer p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-blue-400 transition-all duration-300 flex justify-between items-center gap-4 text-left group">
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-r ${getRatingColor(item.rating)} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2`}>
                        <span>Q{item.displayIndex}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <span className="text-white font-medium flex-1">{item.question}</span>
                    </div>
                    <ChevronsUpDown className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6 px-6">
                      {/* Textual Feedback - LEFT SIDE (60%) */}
                      <div className="lg:w-[60%] w-full space-y-4">
                        {/* Rating Card */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Star className="text-yellow-400 w-5 h-5 fill-current" />
                            <span className="font-semibold text-white">Rating</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{item.rating}/5</div>
                        </div>

                        {/* Your Answer Card */}
                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Brain className="text-blue-400 w-5 h-5" />
                            <span className="font-semibold text-white">Your Answer</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{item.userAns}</p>
                        </div>

                        {/* Feedback Card */}
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="text-green-400 w-5 h-5" />
                            <span className="font-semibold text-white">Feedback</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{item.feedback}</p>
                        </div>
                      </div>

                      {/* Video - RIGHT SIDE (40%) */}
                      {item.videoUrl && (
                        <div className="lg:w-[40%] w-full flex items-center justify-center">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <video
                              src={item.videoUrl}
                              controls
                              className="relative w-full rounded-xl border border-gray-600 shadow-2xl"
                              style={{ maxHeight: "320px", backgroundColor: "#1f2937" }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Home Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button 
            onClick={() => router.replace('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-medium"
            disabled={isLoading}
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default Feedback;