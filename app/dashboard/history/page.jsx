"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/ui/DeleteConfirmDialog";
import { motion } from "framer-motion";
import { 
  History, 
  Briefcase, 
  Clock, 
  Calendar, 
  FileText, 
  Trash2, 
  Eye,
  Code,
  LoaderCircle,
  Archive,
  ArrowRight
} from "lucide-react";

function HistoryPage() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const res = await fetch(`/api/interview/history?email=${email}`);
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Failed to fetch interview history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mockId) => {
    try {
      const res = await fetch(`/api/interview/delete?mockId=${mockId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Interview deleted.");
        setInterviews((prev) => prev.filter((item) => item.mockId !== mockId));
      } else {
        toast.error("Failed to delete interview.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExperienceColor = (experience) => {
    const exp = parseInt(experience);
    if (exp >= 5) return "from-purple-500 to-pink-600";
    if (exp >= 3) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-emerald-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <History className="text-white text-2xl" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Interview History
              </h1>
              <p className="text-gray-300 text-lg mt-1">
                Review your past interview sessions and track your progress
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{interviews.length}</div>
                  <div className="text-sm text-gray-400">Total Interviews</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {interviews.length > 0 ? Math.round(interviews.length / 7 * 100) / 100 : 0}
                  </div>
                  <div className="text-sm text-gray-400">Per Week Avg</div>
                </div> */}
              </div>
              <Archive className="text-gray-500 text-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <LoaderCircle className="text-4xl text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400 text-lg">Loading your interview history...</p>
            </div>
          </motion.div>
        ) : interviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12">
              <Archive className="text-6xl text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Interviews Yet</h3>
              <p className="text-gray-400 text-lg mb-6">
                Start your first mock interview to see your history here
              </p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                  Start First Interview
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.mockId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative group"
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 h-full">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                        <Briefcase className="text-white text-xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                        {interview.jobPosition}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getExperienceColor(interview.jobExperience)} text-white text-sm font-medium`}>
                      <Clock className="w-3 h-3" />
                      <span>{interview.jobExperience} years exp</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Tech Stack</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                      {interview.jobDesc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-700">
                    <Link href={`/dashboard/interview/${interview.mockId}/feedback`}>
                      <Button 
                        variant="outline" 
                        className="group flex items-center gap-2 bg-gray-800 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                        View Feedback
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </Button>
                    </Link>

                    <DeleteConfirmDialog
                      onConfirm={() => handleDelete(interview.mockId)}
                      triggerLabel=""
                      triggerComponent={
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 bg-red-600 text-white hover:bg-red-500 hover:text-white p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;