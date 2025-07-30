"use client"

import { Lightbulb, Volume2, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

function QuestionSection({ questions, activeQuestion, setActiveQuestion }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    } else {
      toast.error("Your browser does not support text to speech")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full"
    >

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-300">Question Progress</h2>
          <span className="text-blue-400">{activeQuestion + 1}/{questions.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
            style={{ width: `${((activeQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question Navigation */}
      <div className="flex flex-wrap gap-3 mb-8">
        {questions.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full transition-all ${
              activeQuestion === index
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            onClick={() => setActiveQuestion(index)}
          >
            Q{index + 1}
          </motion.button>
        ))}
      </div>

      {/* Current Question */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Current Question
          </h2>
          <button
            onClick={() => textToSpeech(questions[activeQuestion]?.question)}
            className="text-blue-400 hover:text-blue-300 p-2 rounded-full bg-blue-900/20"
          >
            <Volume2 size={20} />
          </button>
        </div>
        <motion.p 
          key={activeQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-300 bg-gray-900/50 p-4 rounded-lg border border-gray-700"
        >
          {questions[activeQuestion]?.question}
        </motion.p>
      </div>

      {/* Interview Tip */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-5 mt-8"
      >
        <div className="flex items-center gap-3 text-purple-400 mb-3">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-semibold">How to Answer</h3>
        </div>
        <p className="text-gray-300 text-sm">
          Speak clearly and structure your answer using the STAR method (Situation, Task, Action, Result) 
          for behavioral questions. Aim for 1-2 minute responses.
        </p>
      </motion.div>

      {/* Navigation Arrows (mobile) */}
      <div className="flex justify-between mt-6 md:hidden">
        {activeQuestion > 0 && (
          <button
            onClick={() => setActiveQuestion(prev => prev - 1)}
            className="flex items-center gap-1 text-blue-400"
          >
            <ChevronLeft size={18} /> Previous
          </button>
        )}
        {activeQuestion < questions.length - 1 && (
          <button
            onClick={() => setActiveQuestion(prev => prev + 1)}
            className="flex items-center gap-1 text-blue-400 ml-auto"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default QuestionSection