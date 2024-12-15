import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
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
    this.openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
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

  async analyzeKeywords(jobDescription: string, region: Region): Promise<string[]> {
    const provider = this.getProvider(region);
    
    switch (provider) {
      case 'openai':
        const openaiResponse = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "Extract key technical skills, qualifications, and requirements from the job description."
          }, {
            role: "user",
            content: jobDescription
          }]
        });
        return JSON.parse(openaiResponse.choices[0].message.content || '[]');

      case 'anthropic':
        const anthropicResponse = await this.anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: `Extract key technical skills, qualifications, and requirements from this job description: ${jobDescription}`
          }]
        });
        return JSON.parse(anthropicResponse.content[0].text || '[]');

      case 'gemini':
        const geminiModel = this.gemini.getGenerativeModel({ model: "gemini-pro" });
        const geminiResponse = await geminiModel.generateContent(
          `Extract key technical skills, qualifications, and requirements from this job description: ${jobDescription}`
        );
        const geminiResult = await geminiResponse.response.text();
        try {
          return JSON.parse(geminiResult);
        } catch (e) {
          // Fallback if response isn't valid JSON
          const skills = geminiResult
            .replace(/[*\n]/g, '') // Remove asterisks and newlines
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);
          return skills;
        }
    }
  }
  async identifyGaps(resume: string, keywords: string[], region: Region): Promise<string[]> {
    const provider = this.getProvider(region);
    let response;

    try {
      if (provider === 'openai') {
        response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "Compare the resume against the required keywords and identify missing skills or qualifications. Return as JSON array."
          }, {
            role: "user",
            content: `Resume: ${resume}\nRequired Keywords: ${keywords.join(', ')}`
          }]
        });
        return JSON.parse(response.choices[0].message.content || '[]');
      } else if (provider === 'anthropic') {
        response = await this.anthropic.completions.create({
          model: "claude-2",
          prompt: `Compare the resume against the required keywords and identify missing skills or qualifications. Return as JSON array.\n\nResume: ${resume}\nRequired Keywords: ${keywords.join(', ')}`,
          max_tokens_to_sample: 300
        });
        return JSON.parse(response.completion || '[]');
      } else {
        const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
        response = await model.generateContent(`Compare the resume against the required keywords and identify missing skills or qualifications.\n\nResume: ${resume}\nRequired Keywords: ${keywords.join(', ')}`);
        const textResult = await response.response.text();
      
        try {
          return JSON.parse(textResult || '[]');
        } catch (e) {
          // Fallback if response isn't valid JSON
          return textResult
            .replace(/[*\n]/g, '') // Remove asterisks and newlines
            .split(',')
            .map(gap => gap.trim())
            .filter(gap => gap.length > 0);
        }
      }
    } catch (error) {
      console.error('Error in identifyGaps:', error);
      return []; // Return empty array as fallback
    }
  }
  async generateTailoredResume(
    originalResume: string,
    jobDescription: string,
    gaps: string[],
    region: Region
  ): Promise<string> {
    const provider = this.getProvider(region);
    let response;

    if (provider === 'openai') {
      response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Rewrite the resume to better match the job description while maintaining truthfulness and addressing identified gaps."
        }, {
          role: "user",
          content: `Original Resume: ${originalResume}\nJob Description: ${jobDescription}\nIdentified Gaps: ${gaps.join(', ')}`
        }]
      });
      return response.choices[0].message.content || '';
    } else if (provider === 'anthropic') {
      response = await this.anthropic.completions.create({
        model: "claude-2",
        prompt: `Rewrite the resume to better match the job description while maintaining truthfulness and addressing identified gaps.\n\nOriginal Resume: ${originalResume}\nJob Description: ${jobDescription}\nIdentified Gaps: ${gaps.join(', ')}`,
        max_tokens_to_sample: 1000
      });
      return response.completion || '';
    } else {
      const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
      response = await model.generateContent(`Rewrite the resume to better match the job description while maintaining truthfulness and addressing identified gaps.\n\nOriginal Resume: ${originalResume}\nJob Description: ${jobDescription}\nIdentified Gaps: ${gaps.join(', ')}`);
      return response.response.text() || '';
    }
  }

  async generateCoverLetter(
    resume: string,
    jobDescription: string,
    company: string,
    region: Region
  ): Promise<string> {
    const provider = this.getProvider(region);
    let response;

    if (provider === 'openai') {
      response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Generate a professional cover letter that highlights relevant experience and demonstrates enthusiasm for the role."
        }, {
          role: "user",
          content: `Resume: ${resume}\nJob Description: ${jobDescription}\nCompany: ${company}`
        }]
      });
      return response.choices[0].message.content || '';
    } else if (provider === 'anthropic') {
      response = await this.anthropic.completions.create({
        model: "claude-2",
        prompt: `Generate a professional cover letter that highlights relevant experience and demonstrates enthusiasm for the role.\n\nResume: ${resume}\nJob Description: ${jobDescription}\nCompany: ${company}`,
        max_tokens_to_sample: 1000
      });
      return response.completion || '';
    } else {
      const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
      response = await model.generateContent(`Generate a professional cover letter that highlights relevant experience and demonstrates enthusiasm for the role.\n\nResume: ${resume}\nJob Description: ${jobDescription}\nCompany: ${company}`);
      return response.response.text() || '';
    }
  }

  async calculateATSScore(
    tailoredResume: string,
    jobDescription: string,
    region: Region
  ): Promise<{ score: number; feedback: string[] }> {
    const provider = this.getProvider(region);
    let response;

    try {
      if (provider === 'openai') {
        response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "Analyze the resume against the job description and provide an ATS compatibility score (0-100) and detailed feedback. Return response in JSON format like: {\"score\": number, \"feedback\": string[]}"
          }, {
            role: "user",
            content: `Resume: ${tailoredResume}\nJob Description: ${jobDescription}`
          }]
        });
        return this.parseATSResponse(response.choices[0].message.content);
      } else if (provider === 'anthropic') {
        response = await this.anthropic.completions.create({
          model: "claude-2",
          prompt: `Analyze the resume against the job description and provide an ATS compatibility score (0-100) and detailed feedback. Return response in JSON format like: {"score": number, "feedback": string[]}\n\nResume: ${tailoredResume}\nJob Description: ${jobDescription}`,
          max_tokens_to_sample: 500
        });
        return this.parseATSResponse(response.completion);
      } else {
        const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
        response = await model.generateContent(
          `Analyze the resume against the job description and provide an ATS compatibility score (0-100) and detailed feedback. Return response in JSON format like: {"score": number, "feedback": string[]}\n\nResume: ${tailoredResume}\nJob Description: ${jobDescription}`
        );
        const textResult = await response.response.text();
        return this.parseATSResponse(textResult);
      }
    } catch (error) {
      console.error('Error in ATS score calculation:', error);
      return { score: 0, feedback: ['Error calculating ATS score'] };
    }
  }

  private parseATSResponse(response: string | null | undefined): { score: number; feedback: string[] } {
    if (!response) {
      return { score: 0, feedback: ['No response received'] };
    }

    try {
      // Try direct JSON parse first
      return JSON.parse(response);
    } catch (e) {
      try {
        // Try to extract score and feedback from text response
        const scoreMatch = response.match(/score[:\s]+(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        // Extract feedback points (assuming they're marked with asterisks or numbers)
        const feedbackPoints = response
          .split(/[\n\r]+/)
          .filter(line => line.match(/^[\s*\-•]|^\d+\./))
          .map(line => line.replace(/^[\s*\-•]|\d+\.\s*/, '').trim())
          .filter(line => line.length > 0);

        return {
          score: Math.min(Math.max(score, 0), 100), // Ensure score is between 0-100
          feedback: feedbackPoints.length > 0 ? feedbackPoints : ['No specific feedback available']
        };
      } catch (e2) {
        console.error('Error parsing ATS response:', e2);
        return { score: 0, feedback: ['Error parsing ATS score response'] };
      }
    }
  }}