
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, persona } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in Edge Function secrets');
    }

    // Construct system message based on persona
    let systemMessage = "You are a helpful AI assistant.";
    if (persona === "professional") {
      systemMessage = "You are a professional AI assistant. Respond in a formal, business-like manner.";
    } else if (persona === "casual") {
      systemMessage = "You are a casual, friendly AI assistant. Respond in a relaxed, conversational tone.";
    } else if (persona === "sarcastic") {
      systemMessage = "You are a witty, sarcastic AI assistant. Include light humor in your responses.";
    } else if (persona === "motivational") {
      systemMessage = "You are a motivational AI assistant. Be encouraging and inspiring in your responses.";
    }

    console.log("Sending request to Gemini API with messages:", JSON.stringify(messages, null, 2));

    // Check if the latest message has an image
    const latestUserMessage = messages[messages.length - 1];
    const hasImage = latestUserMessage.role === 'user' && latestUserMessage.imageUrl;

    // Choose API endpoint based on content (text-only or multimodal)
    let apiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
    
    // If there's an image, use the multimodal model
    if (hasImage) {
      apiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-pro-vision:generateContent';
    }

    // Prepare request content
    let requestContents = [
      { role: "user", parts: [{ text: systemMessage }] },
    ];

    // For multimodal input (with image)
    if (hasImage) {
      // Process previous messages (excluding the latest with image)
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        requestContents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }

      // Add latest message with image
      requestContents.push({
        role: "user",
        parts: [
          // If there's text with the image
          ...(latestUserMessage.content ? [{ text: latestUserMessage.content }] : []),
          // Add the image
          {
            inlineData: {
              mimeType: latestUserMessage.imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
              data: latestUserMessage.imageUrl.split(',')[1] // Remove the data:image/... prefix
            }
          }
        ]
      });
    } else {
      // Text-only processing
      for (const msg of messages) {
        requestContents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }

    const response = await fetch(`${apiEndpoint}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: requestContents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("Gemini API Response:", JSON.stringify(data, null, 2));
    
    // Handle different response structures
    let generatedText = "";
    if (data.candidates && data.candidates[0].content) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message || "Error generating response");
    } else {
      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response format from Gemini API");
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
