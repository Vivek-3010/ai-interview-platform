"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateFeedback } from "@/utils/gemini";
import { useUser, useAuth } from "@clerk/nextjs";
import { Loader2, Mic, MicOff, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

function RecordSection({ questions, activeQuestion, mockId, setActiveQuestion, endInterview }) {
  const [micPermission, setMicPermission] = useState("unknown");
  const [userAnswer, setUserAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable} = useSpeechRecognition();

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, []);

  const startRecording = useCallback(() => {
    try {
      if (!webcamRef.current?.stream) {
        throw new Error("Webcam stream not available");
      }

      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000
      };

      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, options);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onerror = (e) => {
        console.error("MediaRecorder error:", e.error);
        toast.error("Recording error occurred");
        setRecording(false);
      };

      mediaRecorderRef.current.start(1000);
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
      setRecording(false);
      throw error;
    }
  }, [handleDataAvailable]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current?.state === "recording") {
      return new Promise((resolve) => {
        mediaRecorderRef.current.onstop = () => {
          setRecording(false);
          resolve(true);
        };
        mediaRecorderRef.current.stop();
      });
    }
    return false;
  }, []);

  const uploadVideo = async (videoBlob) => {
    try {
      if (!videoBlob || videoBlob.size === 0) {
        throw new Error("Empty video blob");
      }

      console.log(`Uploading video for question ${activeQuestion+1}, size: ${videoBlob.size} bytes`);

      const fileName = `interview-${mockId}-${Date.now()}.webm`;
      const filePath = `${user.id}/${fileName}`;
      
      const token = await getToken();
      
      const { data, error } = await supabase.storage
        .from('interview-videos')
        .upload(filePath, videoBlob, {
          contentType: 'video/webm',
          upsert: false,
          cacheControl: '3600',
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('interview-videos')
        .getPublicUrl(filePath);

      console.log(`Video uploaded for question ${activeQuestion+1}: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      console.error('Video upload failed:', error);
      throw error;
    }
  };

  const saveAnswerData = async (answer, questionObj, result, videoUrl) => {
    const dataToSend = {
      mockIdRef: mockId,
      question: questionObj?.question || "",
      correctAns: questionObj?.answer || "",
      userAns: answer,
      feedback: result.feedback,
      rating: Number(result.rating),
      userEmail: user?.primaryEmailAddress?.emailAddress || "anonymous",
      videoUrl: videoUrl || null,
    };

    console.log("Saving answer with data:", dataToSend);
    
    const response = await fetch('/api/userAnswer/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log("Response from API:", responseData);
    
    return responseData;
  };

  const handleRecordClick = async () => {
    if (!listening) {
      try {
        setIsStartingRecording(true);
        
        // Get microphone permissions with echo cancellation
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });
        
        // Clean up the temporary stream since webcam will handle its own
        stream.getTracks().forEach(track => track.stop());

        // Start speech recognition
        resetTranscript();
        await SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });

        // Start video recording
        startRecording();
        
        toast.success("Recording started");
      } catch (err) {
        console.error("Recording start error:", err);
        setMicPermission("denied");
        toast.error("Failed to start recording");
      } finally {
        setIsStartingRecording(false);
      }
    } else {
      try {
        setIsSaving(true);
        toast.info("Processing your answer...");
        
        // First stop speech recognition
        await SpeechRecognition.stopListening();
        
        // Then stop video recording
        const wasRecording = await stopRecording();
        
        const answer = transcript.trim();
        if (answer.split(/\s+/).length < 2) {
          toast.error("❌ Answer too short. Please try again.");
          return;
        }

        const questionObj = questions[activeQuestion];
        const result = await generateFeedback(questionObj?.question || "", answer);

        if (!result?.feedback || !result?.rating) {
          toast.error("⚠️ Could not generate valid feedback");
          return;
        }

        let videoUrl = null;
        if (wasRecording && recordedChunks.length > 0) {
          const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
          videoUrl = await uploadVideo(videoBlob);
          setRecordedChunks([]);
        }

        try {
          const responseData = await saveAnswerData(answer, questionObj, result, videoUrl);
          toast.success("✅ Answer & Feedback saved");
          setUserAnswer(answer);
        } catch (error) {
          console.error("Error saving answer:", error);
          toast.error("⚠️ Failed to save answer: " + error.message);
        }

      } catch (error) {
        console.error("Error in recording process:", error);
        toast.error("⚠️ Something went wrong");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEndInterview = async () => {
    try {
      await stopRecording();
      endInterview();
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Failed to end interview properly");
    }
  };

  useEffect(() => {
    return () => {
      SpeechRecognition.abortListening();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: "microphone" });
          setMicPermission(result.state);
          result.onchange = () => setMicPermission(result.state);
        }
      } catch (error) {
        console.warn("Permission API not supported");
      }
    };
    checkPermissions();
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-red-500">Your browser does not support Speech Recognition.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              listening || recording ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
            }`}>
              {listening || recording ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-current" />
                  <span>Ready</span>
                </div>
              )}
            </div>
            <span className="text-gray-400 text-sm">
              Question {activeQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>AI Analysis</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>


        {/* Webcam Feed */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gray-900 rounded-xl overflow-hidden mb-6 border border-gray-700 shadow-lg"
        >
          <Webcam
            ref={webcamRef}
            mirrored
            style={{ width: "100%", height: "auto" }}
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
        </motion.div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-6 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            listening ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              listening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
            }`} />
            <span>{listening ? 'Listening' : 'Mic Off'}</span>
          </div>

          {recording && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Recording</span>
            </div>
          )}
        </div>

        {/* Permission Error */}
        {micPermission === "denied" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-center"
          >
            <p className="text-red-400">
              Microphone access is denied. Please enable it in your browser settings to continue.
            </p>
          </motion.div>
        )}

        {/* Main Record Button */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={handleRecordClick}
            disabled={micPermission === "denied" || isSaving || isStartingRecording}
            className={`px-8 py-6 text-lg ${
              listening 
                ? 'bg-red-900/30 hover:bg-red-900/40 text-red-400' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : isStartingRecording ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting...
              </>
            ) : listening ? (
              <>
                <MicOff className="mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2" /> Record Answer
              </>
            )}
          </Button>
        </motion.div>

        {/* Transcript */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded">
              <Mic className="text-white w-4 h-4" />
            </span>
            Your Transcript
          </h3>
          <div className="min-h-[120px] p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            {transcript ? (
              <p className="text-gray-300 whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p className="text-gray-500 italic">
                {listening ? "Speak now, your words will appear here..." : "Your transcript will appear here"}
              </p>
            )}
          </div>
        </motion.div>

        {/* Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-between gap-4"
        >
          {activeQuestion > 0 && (
            <Button 
              onClick={() => setActiveQuestion((prev) => prev - 1)}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
          )}

          {activeQuestion < questions.length - 1 && (
            <Button 
              onClick={() => setActiveQuestion((prev) => prev + 1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-auto"
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          )}

          {activeQuestion === questions.length - 1 && (
            <Link href={`/dashboard/interview/${mockId}/feedback`} className="w-full md:w-auto">
              <Button 
                onClick={handleEndInterview}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Finish Interview
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RecordSection;