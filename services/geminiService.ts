import { GoogleGenAI, Type } from "@google/genai";
import { type FormData, type DesignAssets, type ShoppingListItem, type GenerationStatus, type Plan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (formData: FormData): string => {
    return `
    Design a home based on the following specifications:
    - Plot Dimensions: ${formData.plotDimensions}
    - Plot Orientation (Facing): ${formData.orientation}
    - Number of Floors: ${formData.floors}
    - Bedrooms: ${formData.bedrooms}
    - Bathrooms: ${formData.bathrooms}
    - Architectural Style: ${formData.style}
    - Outdoor Features: ${formData.outdoorFeatures.join(', ') || 'None'}
    - Special Rooms: ${formData.specialRooms.join(', ') || 'None'}
    - Additional Details: ${formData.additionalDetails || 'None'}

    The design should be cohesive, functional, and aesthetically pleasing, reflecting the specified style and considering the plot's orientation for optimal natural light.
    `;
};

const updateStatus = (setter: React.Dispatch<React.SetStateAction<GenerationStatus>>, stage: string, newMessage: string) => {
    setter(prev => ({
        stage,
        messages: [...prev.messages, newMessage].slice(-5) // Keep last 5 messages
    }));
};

const generateImages = async (prompt: string): Promise<string[]> => {
    const exteriorPrompt = `Photorealistic, ultra-detailed exterior view of a ${prompt}. Cinematic lighting, 8k resolution.`;
    const interiorPrompt = `Photorealistic, ultra-detailed interior view of the living room and kitchen area of a ${prompt}. Natural lighting, warm and inviting, 8k resolution.`;
    
    const imagePrompts = [exteriorPrompt, interiorPrompt];
    const imageResults = await Promise.all(
        imagePrompts.map(p => ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: p,
            config: {
                numberOfImages: 1,
                aspectRatio: "16:9",
            },
        }))
    );
    
    return imageResults.map(res => `data:image/png;base64,${res.generatedImages[0].image.imageBytes}`);
};

/**
 * NOTE: Video generation is rate-limited to one generation per hour
 * to manage API costs.
 */
const generateVideo = async (prompt: string, setter: React.Dispatch<React.SetStateAction<GenerationStatus>>): Promise<string> => {
    const videoPrompt = `An aerial and cinematic 3D architectural walkthrough video tour of a ${prompt}. Show the exterior, then smoothly transition inside to showcase the main living areas. Hyperrealistic rendering.`;

    updateStatus(setter, 'Video Generation', 'Starting video generation... this may take a few minutes.');
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: videoPrompt,
        config: { numberOfVideos: 1 }
    });
    
    const videoMessages = [
        "The digital architect is sketching the initial concepts...",
        "Rendering the structural framework in high definition...",
        "Applying textures and lighting to bring the design to life...",
        "Polishing the final details for a stunning visual tour...",
        "Almost there! Preparing your video for presentation."
    ];
    
    let messageIndex = 0;
    while (!operation.done) {
        updateStatus(setter, 'Video Generation', videoMessages[messageIndex % videoMessages.length]);
        messageIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    updateStatus(setter, 'Video Generation', 'Video generation complete!');
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to produce a download link.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

const generateWalkthroughScript = async (prompt: string): Promise<string> => {
    const scriptPrompt = `You are a professional and eloquent real estate agent. Write a compelling and descriptive voice-guided walkthrough script for a home with the following features: ${prompt}. The script should be around 150 words and highlight the key selling points in an engaging tone.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: scriptPrompt,
    });
    return response.text;
};

const generate2DPlan = async (prompt: string): Promise<Plan> => {
    const descriptionPrompt = `Provide a detailed textual description of a 2D floor plan for the ground floor of a home with these features: ${prompt}. Describe the layout, room placement, approximate dimensions, and flow. Use clear, architectural language.`;
    const imagePrompt = `Create a detailed, black and white 2D architectural floor plan blueprint for a house with the following features: ${prompt}. Top-down view, clean lines, room labels, architectural style. Minimalist and clear.`;

    const [descriptionResponse, imageResponse] = await Promise.all([
        ai.models.generateContent({ model: 'gemini-2.5-flash', contents: descriptionPrompt }),
        ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: { numberOfImages: 1, aspectRatio: '4:3' }
        })
    ]);
    
    return {
        description: descriptionResponse.text,
        imageUrl: `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`,
    };
};

const generate3DPlan = async (prompt: string): Promise<Plan> => {
    const descriptionPrompt = `Provide a descriptive overview of a 3D floor plan for a home with these features: ${prompt}. Describe the furnished layout from a dollhouse perspective, highlighting the spatial relationships and interior design style.`;
    const imagePrompt = `Generate a photorealistic 3D floor plan of a house with the following features: ${prompt}. Dollhouse view, cutaway walls, furnished rooms, realistic lighting, 4K resolution.`;

    const [descriptionResponse, imageResponse] = await Promise.all([
        ai.models.generateContent({ model: 'gemini-2.5-flash', contents: descriptionPrompt }),
        ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: { numberOfImages: 1, aspectRatio: '16:9' }
        })
    ]);

    return {
        description: descriptionResponse.text,
        imageUrl: `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`,
    };
};

const generateShoppingList = async (prompt: string): Promise<ShoppingListItem[]> => {
    const shoppingPrompt = `Based on the following home design, suggest a list of 5 key furniture and decor items that would fit the style perfectly. For each item, provide a name, a brief description, and a price range.
    Home Design: ${prompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: shoppingPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        priceRange: { type: Type.STRING },
                    },
                    required: ["name", "description", "priceRange"],
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse shopping list JSON:", e);
        return [];
    }
};

export const generateDesignAssets = async (formData: FormData, setGenerationStatus: React.Dispatch<React.SetStateAction<GenerationStatus>>): Promise<DesignAssets> => {
    const basePrompt = generatePrompt(formData);

    updateStatus(setGenerationStatus, 'Initialization', 'Crafting the perfect design brief...');
    
    updateStatus(setGenerationStatus, 'Content Generation', 'Generating textual descriptions...');
    const [walkthroughScript, shoppingList] = await Promise.all([
        generateWalkthroughScript(basePrompt),
        generateShoppingList(basePrompt),
    ]);
    updateStatus(setGenerationStatus, 'Content Generation', 'Descriptions and shopping list are ready!');
    
    updateStatus(setGenerationStatus, 'Image Generation', 'Generating photorealistic images...');
    const images = await generateImages(basePrompt);
    updateStatus(setGenerationStatus, 'Image Generation', 'Images generated successfully!');

    updateStatus(setGenerationStatus, 'Floor Plan Generation', 'Designing the 2D blueprint...');
    const plan2D = await generate2DPlan(basePrompt);
    updateStatus(setGenerationStatus, 'Floor Plan Generation', 'Architecting the 3D floor plan...');
    const plan3D = await generate3DPlan(basePrompt);
    updateStatus(setGenerationStatus, 'Floor Plan Generation', 'Floor plans are complete!');

    // --- Video Generation with Rate Limiting ---
    const VIDEO_GENERATION_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
    const lastVideoGenTimestamp = localStorage.getItem('lastVideoGenerationTimestamp');
    const now = Date.now();

    let isRateLimited = false;
    if (lastVideoGenTimestamp) {
        const timeSinceLastGen = now - parseInt(lastVideoGenTimestamp, 10);
        if (timeSinceLastGen < VIDEO_GENERATION_COOLDOWN_MS) {
            isRateLimited = true;
        }
    }

    let videoUrl: string | undefined = undefined;
    if (!isRateLimited) {
        // This is a costly operation, proceed with generation.
        videoUrl = await generateVideo(basePrompt, setGenerationStatus);
        // Set the timestamp to enforce rate limit for all users.
        localStorage.setItem('lastVideoGenerationTimestamp', now.toString());
    } else {
        const timeSinceLastGen = now - parseInt(lastVideoGenTimestamp!, 10);
        const minutesRemaining = Math.ceil((VIDEO_GENERATION_COOLDOWN_MS - timeSinceLastGen) / 60000);
        updateStatus(setGenerationStatus, 'Video Generation', `Skipped: Hourly limit active. Try again in ${minutesRemaining} mins.`);
    }

    updateStatus(setGenerationStatus, 'Finalizing', 'Assembling your complete design package...');
    
    return {
        images,
        videoUrl,
        walkthroughScript,
        shoppingList,
        plan2D,
        plan3D,
    };
};