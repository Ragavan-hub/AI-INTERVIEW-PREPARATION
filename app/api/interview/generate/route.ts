import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobRole, experienceLevel } = await req.json();

    if (!jobRole || !experienceLevel) {
      return NextResponse.json({ error: 'Missing role or experience' }, { status: 400 });
    }

    const prompt = `Generate 5 technical interview questions for a ${jobRole} with ${experienceLevel} experience. Include a mix of easy, medium, and hard questions.
Output ONLY a valid JSON array of strings containing the questions, like: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    let questionsArray;
    try {
      questionsArray = JSON.parse(content);
      if (!Array.isArray(questionsArray)) {
          questionsArray = content.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim());
      }
    } catch(e) {
      questionsArray = content.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim());
    }

    const questionsDoc = questionsArray.map((q: string) => ({ question: q }));

    await dbConnect();
    const newInterview = await Interview.create({
      userId: session.user.id,
      jobRole,
      experienceLevel,
      questions: questionsDoc,
    });

    return NextResponse.json({ interviewId: newInterview._id, questions: questionsArray }, { status: 200 });

  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
