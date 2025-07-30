"use client"

// app/page.tsx
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaRocket, FaChartLine, FaMicrophone } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaMicrophone className="text-blue-400 text-2xl" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              IntervuAI
            </h1>
          </div>
          <Link href='/dashboard'>
            <Button variant="outline" className="border-blue-400 text-gray-900 hover:bg-gray-200 hover:text-black">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AI-Powered
            </span>{" "}
            Mock Interviews
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Practice with realistic interviews and get instant feedback to ace your next job opportunity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaRocket className="text-3xl text-blue-400" />,
              title: "Instant Setup",
              desc: "Get started in seconds with no complicated configuration"
            },
            {
              icon: <FaChartLine className="text-3xl text-purple-400" />,
              title: "Real Feedback",
              desc: "AI analyzes your answers and provides actionable insights"
            },
            {
              icon: <FaMicrophone className="text-3xl text-green-400" />,
              title: "Voice Analysis",
              desc: "Improve your speech patterns and communication skills"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}







// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, MicOff, RotateCcw, Play, Pause } from 'lucide-react';

// const SpeechAnalyzer = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [fillerWords, setFillerWords] = useState({});
//   const [totalWords, setTotalWords] = useState(0);
//   const [wordsPerMinute, setWordsPerMinute] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isSupported, setIsSupported] = useState(true);
//   const [permissionStatus, setPermissionStatus] = useState('checking');
//   const [error, setError] = useState('');
  
//   const recognitionRef = useRef(null);
//   const intervalRef = useRef(null);

//   // Common filler words to track
//   const fillerWordsList = [
//     'um', 'uh', 'like', 'you know', 'so', 'well', 'actually', 'basically',
//     'literally', 'okay', 'right', 'yeah', 'hmm', 'err', 'ah', 'oh',
//     'kind of', 'sort of', 'i mean', 'you see', 'let me see'
//   ];

//   useEffect(() => {
//     // Check if speech recognition is supported
//     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
//       setIsSupported(false);
//       setPermissionStatus('not_supported');
//       return;
//     }

//     // Check microphone permission
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(() => {
//         setPermissionStatus('granted');
//         initializeSpeechRecognition();
//       })
//       .catch(() => {
//         setPermissionStatus('denied');
//       });

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const initializeSpeechRecognition = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
    
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//       setError('');
//       console.log('Speech recognition started');
//     };

//     recognition.onresult = (event) => {
//       let finalTranscript = '';
//       let interimTranscript = '';
      
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript;
//         } else {
//           interimTranscript += transcript;
//         }
//       }
      
//       setInterimTranscript(interimTranscript);
      
//       if (finalTranscript) {
//         setTranscript(prev => {
//           const newTranscript = prev + finalTranscript + ' ';
//           analyzeText(newTranscript);
//           return newTranscript;
//         });
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setError(`Error: ${event.error}`);
      
//       if (event.error === 'not-allowed') {
//         setPermissionStatus('denied');
//         setIsListening(false);
//       } else if (event.error === 'no-speech') {
//         setError('No speech detected. Please try again.');
//       }
//     };

//     recognition.onend = () => {
//       console.log('Speech recognition ended');
//       if (isListening) {
//         setTimeout(() => {
//           if (recognitionRef.current && isListening) {
//             recognitionRef.current.start();
//           }
//         }, 100);
//       }
//     };

//     recognitionRef.current = recognition;
//   };

//   const analyzeText = (text) => {
//     if (!text) return;

//     const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
//     const wordCount = words.length;
    
//     setTotalWords(wordCount);

//     // Count filler words
//     const fillerCount = {};
//     let totalFillers = 0;

//     fillerWordsList.forEach(filler => {
//       const count = words.filter(word => {
//         // Remove punctuation for comparison
//         const cleanWord = word.replace(/[^\w\s]/g, '');
//         return cleanWord === filler || word.includes(filler);
//       }).length;
      
//       if (count > 0) {
//         fillerCount[filler] = count;
//         totalFillers += count;
//       }
//     });

//     setFillerWords(fillerCount);
//   };

//   const calculateWPM = () => {
//     if (startTime && totalWords > 0) {
//       const minutes = elapsedTime / 60;
//       const wpm = minutes > 0 ? Math.round(totalWords / minutes) : 0;
//       setWordsPerMinute(wpm);
//     }
//   };

//   useEffect(() => {
//     calculateWPM();
//   }, [totalWords, elapsedTime]);

//   const startListening = async () => {
//     if (!isSupported || permissionStatus !== 'granted') {
//       if (permissionStatus === 'denied') {
//         setError('Microphone permission denied. Please allow microphone access and refresh the page.');
//       }
//       return;
//     }
    
//     try {
//       setIsListening(true);
//       setStartTime(Date.now());
//       setError('');
      
//       // Start timer
//       intervalRef.current = setInterval(() => {
//         setElapsedTime(prev => prev + 1);
//       }, 1000);
      
//       if (recognitionRef.current) {
//         recognitionRef.current.start();
//       }
//     } catch (error) {
//       setError('Failed to start speech recognition');
//       setIsListening(false);
//     }
//   };

//   const stopListening = () => {
//     setIsListening(false);
//     setInterimTranscript('');
    
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
    
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   const resetAnalysis = () => {
//     setTranscript('');
//     setInterimTranscript('');
//     setFillerWords({});
//     setTotalWords(0);
//     setWordsPerMinute(0);
//     setElapsedTime(0);
//     setStartTime(null);
//     setError('');
    
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const totalFillerCount = Object.values(fillerWords).reduce((sum, count) => sum + count, 0);

//   const getStatusIndicator = () => {
//     if (permissionStatus === 'checking') {
//       return { text: 'Checking permissions...', color: 'text-yellow-400' };
//     } else if (permissionStatus === 'denied') {
//       return { text: 'Microphone access denied', color: 'text-red-400' };
//     } else if (permissionStatus === 'not_supported') {
//       return { text: 'Speech recognition not supported', color: 'text-red-400' };
//     } else if (isListening) {
//       return { text: 'Listening...', color: 'text-green-400' };
//     } else {
//       return { text: 'Ready to record', color: 'text-blue-400' };
//     }
//   };

//   const status = getStatusIndicator();

//   if (!isSupported) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
//         <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md text-center">
//           <h1 className="text-2xl font-bold text-white mb-4">Speech Analysis Tool</h1>
//           <p className="text-red-300">Speech recognition is not supported in your browser. Please use Chrome, Safari, or Edge.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-white text-center mb-8">
//           Speech Analysis Tool
//         </h1>
        
//         {/* Controls */}
//         <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
//           <div className="flex justify-center items-center gap-4 mb-4">
//             <button
//               onClick={isListening ? stopListening : startListening}
//               disabled={permissionStatus !== 'granted'}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
//                 isListening 
//                   ? 'bg-red-500 hover:bg-red-600 text-white' 
//                   : permissionStatus === 'granted'
//                   ? 'bg-green-500 hover:bg-green-600 text-white'
//                   : 'bg-gray-500 text-gray-300 cursor-not-allowed'
//               }`}
//             >
//               {isListening ? <MicOff size={20} /> : <Mic size={20} />}
//               {isListening ? 'Stop Recording' : 'Start Recording'}
//             </button>
            
//             <button
//               onClick={resetAnalysis}
//               className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all"
//             >
//               <RotateCcw size={20} />
//               Reset
//             </button>
//           </div>
          
//           <div className="text-center mb-2">
//             <span className="text-white text-lg">
//               {formatTime(elapsedTime)}
//             </span>
//           </div>
          
//           <div className="text-center">
//             <div className={`text-sm font-medium ${status.color} flex items-center justify-center gap-2`}>
//               {isListening && <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>}
//               {status.text}
//             </div>
//           </div>
          
//           {error && (
//             <div className="mt-3 text-center">
//               <p className="text-red-300 text-sm">{error}</p>
//             </div>
//           )}
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
//             <div className="text-3xl font-bold text-green-400 mb-2">{totalWords}</div>
//             <div className="text-white">Total Words</div>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
//             <div className="text-3xl font-bold text-blue-400 mb-2">{wordsPerMinute}</div>
//             <div className="text-white">Words per Minute</div>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
//             <div className="text-3xl font-bold text-red-400 mb-2">{totalFillerCount}</div>
//             <div className="text-white">Filler Words</div>
//           </div>
//         </div>

//         {/* Filler Words Breakdown */}
//         {Object.keys(fillerWords).length > 0 && (
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
//             <h2 className="text-xl font-bold text-white mb-4">Filler Words Breakdown</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {Object.entries(fillerWords).map(([word, count]) => (
//                 <div key={word} className="bg-white/20 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-white">{count}</div>
//                   <div className="text-sm text-gray-300 capitalize">{word}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Transcript */}
//         <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
//           <h2 className="text-xl font-bold text-white mb-4">Transcript</h2>
//           <div className="bg-black/20 rounded-lg p-4 min-h-32 max-h-64 overflow-y-auto">
//             {transcript || interimTranscript ? (
//               <div className="text-gray-200 leading-relaxed">
//                 <span>{transcript}</span>
//                 {interimTranscript && (
//                   <span className="text-gray-400 italic">{interimTranscript}</span>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-400 italic">
//                 {permissionStatus === 'granted' 
//                   ? 'Your speech will appear here...' 
//                   : 'Please allow microphone access to see your speech here...'}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-300 text-sm mb-2">
//             Click "Start Recording" and speak naturally. The tool will track your words per minute and identify filler words in real-time.
//           </p>
//           {permissionStatus === 'denied' && (
//             <p className="text-red-300 text-sm">
//               Please allow microphone access in your browser settings and refresh the page.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpeechAnalyzer;