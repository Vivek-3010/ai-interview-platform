"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { testGemini } from "@/utils/gemini";
import { LoaderCircle, Plus, Briefcase, Code, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [JobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const {user} = useUser();

  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(JobPosition, jobDesc, jobExperience);
    
    const result = await testGemini(JobPosition, jobDesc, jobExperience);
    console.log(result);
    setLoading(false);
    setOpenDialog(false);
    setJsonResponse(result);

    const newMock = {
      mockId: uuidv4(),
      jsonMockResp: JSON.stringify(result),
      jobPosition: JobPosition,
      jobDesc,
      jobExperience,
      createdBy: user?.primaryEmailAddress?.emailAddress || 'anonymous',
    };

    router.push(`/dashboard/interview/${newMock.mockId}`)

    try {
      const res = await fetch('/api/mock/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMock),
      });

      const data = await res.json();
      console.log('Inserted ID:', data.mockId);
    } catch (err) {
      console.error('Error inserting into DB:', err);
    }
  };

  return (
    <div>
      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-8 hover:border-blue-400 transition-all duration-300">
          <div className="text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="text-white text-2xl" />
              </div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2">Start New Interview</h3>
            <p className="text-gray-400 text-sm mb-4">Create a personalized mock interview session</p>
            
            {/* Features */}
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Custom Role
              </span>
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                Tech Stack
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Experience
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              Create Your Mock Interview
            </DialogTitle>
            <DialogDescription className="text-gray-400 mb-6">
              Customize your interview experience by providing details about the role and your background.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Job Role
                </label>
                <Input 
                  placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager" 
                  required 
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400"
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Code className="w-4 h-4 text-purple-400" />
                  Job Description / Tech Stack
                </label>
                <Textarea 
                  placeholder="e.g., React, Node.js, MongoDB, AWS, Docker, Kubernetes, or describe key responsibilities and requirements"
                  required 
                  rows={4}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-400 resize-none"
                  onChange={(event) => setJobDesc(event.target.value)}
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Clock className="w-4 h-4 text-green-400" />
                  Years of Experience
                </label>
                <Input 
                  placeholder="e.g., 3" 
                  type="number" 
                  min="0"
                  max="50" 
                  required 
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-green-400"
                  onChange={(event) => setJobExperience(event.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview