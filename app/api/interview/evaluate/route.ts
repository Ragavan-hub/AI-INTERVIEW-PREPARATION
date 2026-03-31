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

    const { interviewId, questionIndex, answer } = await req.json();

    if (!interviewId || typeof questionIndex !== 'number' || !answer) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();
    const interview = await Interview.findOne({ _id: interviewId, userId: session.user.id });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const question = interview.questions[questionIndex].question;

    const prompt = `Evaluate the following answer for the interview question:
Question: ${question}
User answer: ${answer}

Please provide the evaluation strictly in a valid JSON format matching the structure below exactly:
{
  "score": <number between 0 and 10>,
  "strengths": "<brief description of what was good>",
  "weaknesses": "<brief description of what could be improved>",
  "improvedAnswer": "<a suggested better answer>"
}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const evaluation = JSON.parse(content);

    interview.questions[questionIndex].userAnswer = answer;
    interview.questions[questionIndex].score = evaluation.score;
    interview.questions[questionIndex].feedback = `Strengths: ${evaluation.strengths}\nWeaknesses: ${evaluation.weaknesses}`;
    interview.questions[questionIndex].strengths = evaluation.strengths;
    interview.questions[questionIndex].weaknesses = evaluation.weaknesses;
    interview.questions[questionIndex].improvedAnswer = evaluation.improvedAnswer;

    if (questionIndex === interview.questions.length - 1) {
      interview.status = 'completed';
      const totalScore = interview.questions.reduce((acc: number, q: any) => acc + (q.score || 0), 0);
      interview.overallScore = totalScore / interview.questions.length;
    }

    await interview.save();

    return NextResponse.json(evaluation, { status: 200 });

  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
