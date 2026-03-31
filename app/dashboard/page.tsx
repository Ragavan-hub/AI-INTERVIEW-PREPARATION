"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Plus, ArrowRight, Clock, Star } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/interview/history")
        .then(res => res.json())
        .then(data => {
          setHistory(data.interviews || []);
          setFetchingHistory(false);
        })
        .catch(() => setFetchingHistory(false));
    }
  }, [status]);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole, experienceLevel }),
      });
      const data = await res.json();
      
      if (res.ok && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        alert("Failed to generate interview. Please try again.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {session?.user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-400">Ready to ace your next technical interview?</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/20 p-2 rounded-lg"><Plus className="h-5 w-5 text-purple-400" /></div>
              <h2 className="text-xl font-bold text-white">New Interview</h2>
            </div>
            
            <form onSubmit={handleStartInterview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Developer"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Experience Level</label>
                <select
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="1-3 years">Junior (1-3 years)</option>
                  <option value="3-5 years">Mid-Level (3-5 years)</option>
                  <option value="5+ years">Senior (5+ years)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>Start Session <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 p-2 rounded-lg"><Clock className="h-5 w-5 text-blue-400" /></div>
              <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
            </div>

            {fetchingHistory ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-400">No mock interviews taken yet.<br/>Start your first session from the left pane!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((interview) => (
                  <Link href={interview.status === 'completed' ? `/results/${interview._id}` : `/interview/${interview._id}`} key={interview._id}>
                    <div className="bg-gray-950 border border-gray-800 hover:border-gray-700 p-4 rounded-xl flex items-center justify-between transition-colors group">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">{interview.jobRole}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="capitalize">{interview.experienceLevel}</span>
                          <span>•</span>
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {interview.status === 'completed' ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 mb-1">Overall Score</span>
                            <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md font-bold">
                              <Star className="h-4 w-4 fill-green-400" />
                              {(interview.overallScore || 0).toFixed(1)}/10
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-md text-sm font-medium">
                            In Progress
                          </div>
                        )}
                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
