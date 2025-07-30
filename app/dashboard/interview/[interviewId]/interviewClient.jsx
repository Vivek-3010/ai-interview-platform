"use client";

import { Button } from '@/components/ui/button';
import { Lightbulb, Webcam, Mic, ChevronRight, Settings, User, Briefcase } from 'lucide-react';
import WebcamComponent from 'react-webcam';
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InterviewClient({ interview }) {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, []);

  const startRecording = useCallback(() => {
    setRecording(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [handleDataAvailable]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }, []);

  const handleStartInterview = () => {
    startRecording();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* New Header Section */}
      <header className="border-b border-gray-800 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Webcam className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Interview Prep</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <Settings className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* New Progress Indicator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-1 bg-gray-800 rounded-full">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-1/3"></div>
          </div>
          <span className="text-sm text-gray-400">Step 1 of 3</span>
        </div>

        {/* New Split Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Interview Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {interview.jobPosition} Interview
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <Briefcase className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Role</h3>
                    <p className="text-lg">{interview.jobPosition}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <User className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Experience</h3>
                    <p className="text-lg">{interview.jobExperience} years</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-3">JOB DESCRIPTION</h3>
                <p className="text-gray-300 leading-relaxed">
                  {interview.jobDesc}
                </p>
              </div>
            </motion.div>

            {/* New Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Lightbulb className="text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Interview Preparation Tips</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                  <p className="text-gray-300">Ensure good lighting and a quiet environment</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                  <p className="text-gray-300">Position your camera at eye level</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                  <p className="text-gray-300">Answer naturally as you would in a real interview</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                  <p className="text-gray-300">You'll receive detailed feedback after completion</p>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Panel - Webcam Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-6 h-fit"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              {/* Webcam Preview */}
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {webCamEnabled ? (
                  <WebcamComponent
                    ref={webcamRef}
                    mirrored
                    className="w-full h-full object-cover"
                    audio={true}
                    muted={true}
                    audioConstraints={{
                      echoCancellation: true,
                      noiseSuppression: true,
                      autoGainControl: true,
                    }}
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "user"
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <Webcam className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                    <p className="text-gray-500">Camera preview</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Camera Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    webCamEnabled 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {webCamEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <Button
                  onClick={() => setWebCamEnabled(!webCamEnabled)}
                  className={`w-full ${
                    webCamEnabled 
                      ? 'bg-red-900/30 hover:bg-red-900/40 text-red-400' 
                      : 'bg-blue-900/30 hover:bg-blue-900/40 text-blue-400'
                  }`}
                >
                  <Mic className="mr-2" size={18} />
                  {webCamEnabled ? 'Disable Devices' : 'Enable Camera & Mic'}
                </Button>

                <Link href={`/dashboard/interview/${interview.mockId}/start`}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
                    onClick={handleStartInterview}
                    disabled={!webCamEnabled}
                  >
                    <span className=''>Begin Interview</span>
                    <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* New Help Section */}
            <div className="mt-2 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-gray-400 text-sm mb-3">NEED HELP?</h4>
              <p className="text-gray-300 text-sm mb-4">
                If you're having trouble with your camera or microphone, check your browser permissions.
              </p>
              <Button variant="outline" className="border-gray-700 text-black w-full">
                Troubleshoot Issues
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}