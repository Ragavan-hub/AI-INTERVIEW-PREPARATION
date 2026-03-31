"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Trophy, CheckCircle, XCircle, Lightbulb, Star, Mic } from "lucide-react";

export default function ResultsPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetch(`/api/interview/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.interview) {
            setInterview(data.interview);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, params.id, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>;
  }

  if (!interview) {
    return <div className="text-center py-20 text-xl font-bold">Results not found.</div>;
  }

  const overallScore = interview.overallScore || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-2xl mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Interview Results</h1>
            <p className="text-xl text-gray-400">
              Role: <span className="text-purple-400 font-semibold">{interview.jobRole}</span> • {interview.experienceLevel}
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-center">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 drop-shadow-sm">
              {overallScore.toFixed(1)} <span className="text-3xl text-gray-600">/ 10</span>
            </div>
            <span className="text-sm uppercase tracking-widest text-gray-400 font-bold mt-2">Overall Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold border-b border-gray-800 pb-4">Detailed Question Breakdown</h2>
        
        {interview.questions.map((q: any, idx: number) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
            <div className="bg-gray-800/50 p-6 flex items-start justify-between border-b border-gray-800">
              <div className="pr-6">
                <span className="text-sm font-bold text-gray-400 mb-2 block tracking-wider uppercase">Question {idx + 1}</span>
                <h3 className="text-xl font-semibold text-white leading-relaxed">{q.question}</h3>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-950 px-4 py-2 rounded-xl border border-gray-800 shrink-0">
                <div className="text-2xl font-black text-white">{q.score}</div>
                <div className="text-xs text-gray-500 font-bold uppercase">Score</div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  <Mic className="h-4 w-4" /> Your Answer
                </h4>
                <div className="bg-gray-950 p-4 rounded-xl text-gray-300 italic">
                  "{q.userAnswer}"
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-wider mb-3">
                    <CheckCircle className="h-4 w-4" /> Strengths
                  </h4>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-300/90 text-sm leading-relaxed">
                    {q.strengths}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider mb-3">
                    <XCircle className="h-4 w-4" /> Areas to Improve
                  </h4>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300/90 text-sm leading-relaxed">
                    {q.weaknesses}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  <Lightbulb className="h-4 w-4" /> Suggested Improved Answer
                </h4>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-xl text-yellow-100 leading-relaxed font-medium">
                  {q.improvedAnswer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
