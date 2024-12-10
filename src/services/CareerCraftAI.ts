import OpenAI from 'openai';
import Anthropic from 'anthropic';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Region, AIProvider } from '../types';

export class CareerCraftAI {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private gemini: GoogleGenerativeAI;
  
  constructor(
    openaiKey: string,
    anthropicKey: string,
    geminiKey: string
  ) {
    this.openai = new OpenAI({ apiKey: openaiKey });
    this.anthropic = new Anthropic({ apiKey: anthropicKey });
    this.gemini = new GoogleGenerativeAI(geminiKey);
  }

  private getProvider(region: Region): AIProvider {
    switch (region) {
      case 'US':
        return 'openai';
      case 'EU':
      case 'UAE':
      case 'Africa':
        return 'anthropic';
      default:
        return 'gemini';
    }
  }

  async analyzeKeywords(jobDescription: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Extract key technical skills, qualifications, and requirements from the job description."
      }, {
        role: "user",
        content: jobDescription
      }]
    });

    return JSON.parse(response.choices[0].message.content || '[]');
  }

  async identifyGaps(resume: string, keywords: string[]): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Compare the resume against the required keywords and identify missing skills or qualifications."
      }, {
        role: "user",
        content: `Resume: ${resume}\nRequired Keywords: ${keywords.join(', ')}`
      }]
    });

    return JSON.parse(response.choices[0].message.content || '[]');
  }

  async generateTailoredResume(
    originalResume: string,
    jobDescription: string,
    gaps: string[]
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Rewrite the resume to better match the job description while maintaining truthfulness and addressing identified gaps."
      }, {
        role: "user",
        content: `Original Resume: ${originalResume}\nJob Description: ${jobDescription}\nIdentified Gaps: ${gaps.join(', ')}`
      }]
    });

    return response.choices[0].message.content || '';
  }

  async generateCoverLetter(
    resume: string,
    jobDescription: string,
    company: string
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate a professional cover letter that highlights relevant experience and demonstrates enthusiasm for the role."
      }, {
        role: "user",
        content: `Resume: ${resume}\nJob Description: ${jobDescription}\nCompany: ${company}`
      }]
    });

    return response.choices[0].message.content || '';
  }

  async calculateATSScore(
    tailoredResume: string,
    jobDescription: string
  ): Promise<{ score: number; feedback: string[] }> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze the resume against the job description and provide an ATS compatibility score and detailed feedback."
      }, {
        role: "user",
        content: `Resume: ${tailoredResume}\nJob Description: ${jobDescription}`
      }]
    });

    return JSON.parse(response.choices[0].message.content || '{ "score": 0, "feedback": [] }');
  }
}