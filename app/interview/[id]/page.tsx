"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Mic, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";

export default function MockInterview() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  
  const [interview, setInterview] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

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
            // Find first unanswered question
            const firstUnanswered = data.interview.questions.findIndex((q: any) => !q.userAnswer);
            if (firstUnanswered !== -1) {
              setCurrentIndex(firstUnanswered);
            } else {
              router.push(`/results/${params.id}`);
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, params.id, router]);

  // Dummy speech-to-text integration for UI purpose since actual API takes complex setup
  let recognition: any;
  if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswer(prev => prev + " " + finalTranscript);
      }
    };
  }

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsRecording(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handleNext = async () => {
    if (!answer.trim()) return;

    setEvaluating(true);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: params.id,
          questionIndex: currentIndex,
          answer: answer
        }),
      });

      if (res.ok) {
        setAnswer("");
        if (currentIndex < interview.questions.length - 1) {
          setCurrentIndex(curr => curr + 1);
        } else {
          router.push(`/results/${params.id}`);
        }
      } else {
        alert("Failed to evaluate answer.");
      }
    } catch (error) {
      alert("An error occurred during evaluation.");
    } finally {
      if(isRecording) toggleRecording();
      setEvaluating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>;
  }

  if (!interview) {
    return <div className="text-center py-20 text-xl font-bold">Interview not found.</div>;
  }

  const currentQuestion = interview.questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Mock Interview
          <span className="bg-purple-500/10 text-purple-400 text-sm px-3 py-1 rounded-full border border-purple-500/20">
            {interview.jobRole}
          </span>
        </h1>
        <div className="flex space-x-2">
          {interview.questions.map((_: any, i: number) => (
            <div
              key={i}
              className={`h-2.5 w-8 rounded-full ${
                i < currentIndex ? "bg-green-500" : i === currentIndex ? "bg-purple-500 scale-110" : "bg-gray-800"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress bar background */}
        <div className="absolute top-0 left-0 h-1 bg-purple-500 transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / interview.questions.length) * 100}%` }} />

        <div className="mb-6">
          <span className="text-purple-400 font-semibold mb-2 block">Question {currentIndex + 1} of {interview.questions.length}</span>
          <h2 className="text-3xl font-bold leading-tight text-white mb-6">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="relative mb-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={evaluating}
            className="w-full h-48 bg-gray-950 border border-gray-800 rounded-xl p-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-medium leading-relaxed"
            placeholder="Type your answer here or use the microphone..."
          />
          <button
            onClick={toggleRecording}
            className={`absolute bottom-4 right-4 p-3 rounded-full transition-all flex items-center gap-2 ${
              isRecording 
                ? "bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Mic className="h-5 w-5" />
            <span className="text-sm font-medium pr-2">{isRecording ? "Listening..." : "Speak"}</span>
          </button>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800 mt-6">
          <button
            onClick={handleNext}
            disabled={evaluating || !answer.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(147,51,234,0.39)]"
          >
            {evaluating ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Evaluating...</>
            ) : currentIndex === interview.questions.length - 1 ? (
              <><CheckCircle className="h-5 w-5" /> Finish Interview</>
            ) : (
              <>Next Question <ChevronRight className="h-5 w-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
