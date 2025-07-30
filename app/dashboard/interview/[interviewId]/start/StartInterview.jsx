"use client";

import React, { useEffect, useState } from 'react';
import QuestionSection from './_components/QuestionSection';
import RecordSection from './_components/RecordSection';
import { motion } from 'framer-motion';

function StartInterview({ interview }) {
    const [interviewData, setInterviewData] = useState();
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => {
      const getInterviewDetails = () => {
        const jsonResp = JSON.parse(interview.jsonMockResp);
        console.log(jsonResp);

        setQuestions(jsonResp);
        setInterviewData(interview.jsonMockResp);
      };

      getInterviewDetails();
    }, [interview]);

    const endInterview = () => {
        console.log("Interview ended");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <QuestionSection 
                questions={questions}
                activeQuestion={activeQuestion}
                setActiveQuestion={setActiveQuestion}
            />

            <RecordSection
                questions={questions}
                activeQuestion={activeQuestion}
                mockId={interview.mockId}
                setActiveQuestion={setActiveQuestion}
                endInterview={endInterview}
            />
          </div>
        </motion.div>
      </div>
    );
}

export default StartInterview;