
import { GoogleGenAI, Type } from "@google/genai";
import { StoryData } from "../types";

// Always use a direct initialization from process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchStory = async (topic: string): Promise<StoryData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tell the epic yet simple story of "${topic}". 
    
    Structure your narrative to be deeply engaging and relatable. For the origin and each major milestone, follow this storytelling flow:
    1. THE CHALLENGE: What was the frustrating problem or human need before this discovery?
    2. THE STRUGGLE: How did this problem make life difficult or limited for people back then?
    3. THE EUREKA: How did the discovery/innovation happen and how did it solve that specific struggle?
    4. THE LEGACY: Why does this matter to us in our everyday lives right now?
    
    Keep the language clear, evocative, and free of overly dense jargon. Use a tone that feels like a conversation with a brilliant storyteller.
    
    Trace its history from the very beginning (origin), through key innovations/modifications, its current form, and a vision of its future narrative. 
    Use grounding for references.`,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          summary: { type: Type.STRING },
          origin: {
            type: Type.OBJECT,
            properties: {
              period: { type: Type.STRING },
              description: { type: Type.STRING, description: "Narrative following the Problem-Effect-Solution flow" },
              imagePrompt: { type: Type.STRING, description: "Highly detailed prompt for an image generator showing the human problem or the moment of discovery" }
            },
            required: ["period", "description", "imagePrompt"]
          },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                event: { type: Type.STRING },
                impact: { type: Type.STRING, description: "Simple story-driven impact explaining the fix and everyday connection" },
                imagePrompt: { type: Type.STRING }
              },
              required: ["year", "event", "impact", "imagePrompt"]
            }
          },
          currentForm: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              description: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ["status", "description", "imagePrompt"]
          },
          futureNarrative: {
            type: Type.OBJECT,
            properties: {
              speculation: { type: Type.STRING },
              vision: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ["speculation", "vision", "imagePrompt"]
          },
          references: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["title", "url"]
            }
          }
        },
        required: ["topic", "summary", "origin", "milestones", "currentForm", "futureNarrative", "references"]
      }
    }
  });

  // Extract story data from the response text.
  const story = JSON.parse(response.text || '{}') as StoryData;
  
  // ALWAYS extract URLs from grounding metadata to list them on the web app.
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    const chunks = response.candidates[0].groundingMetadata.groundingChunks;
    const groundingRefs = chunks
      .filter(c => c.web)
      .map(c => ({ title: c.web?.title || 'Source', url: c.web?.uri || '#' }));
    
    // Supplement existing references with grounding chunks, avoiding duplicates.
    const existingUrls = new Set(story.references.map(r => r.url));
    groundingRefs.forEach(ref => {
      if (!existingUrls.has(ref.url)) {
        story.references.push(ref);
        existingUrls.add(ref.url);
      }
    });
  }

  return story;
};

export const generateThematicImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A cinematic, atmospheric illustration in a storybook style: ${prompt}. Focus on human emotion or the sheer wonder of the scientific moment. Artistic style: Detailed, warm lighting, epic but accessible.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1200/675`;
};
