import Link from "next/link";
import { ArrowRight, BrainCircuit, Target, History } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          AI-Powered Mock Interviews
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Ace your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI precision</span>.
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Practice role-specific questions, receive instant actionable feedback, and track your progress to land your dream job faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
            Start Practicing Now
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all">
            Login to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
        <FeatureCard 
          icon={<BrainCircuit className="h-8 w-8 text-purple-400" />}
          title="Smart Generation"
          description="AI generates tailored questions based on your specific job role and experience level."
        />
        <FeatureCard 
          icon={<Target className="h-8 w-8 text-pink-400" />}
          title="In-depth Evaluation"
          description="Get scored out of 10 along with detailed strengths, weaknesses, and improved answers."
        />
        <FeatureCard 
          icon={<History className="h-8 w-8 text-blue-400" />}
          title="Performance Tracking"
          description="Save past sessions and monitor your progress over time."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
