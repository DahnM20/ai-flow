export const actions = [
    {
        name: "Summary",
        prompt: "Based on the text I previously provided, please summarize it, highlighting the key points. Respond in the language of the provided text.",
        description: "Summarize the content"
    },
    {
        name: "SpellCheck",
        prompt: "Based on the text I previously provided, review it for spelling errors and highlight any found. Respond in the language of the provided text.",
        description: "Identify orthographic mistakes"
    },
    {
        name: "VisualPrompt",
        prompt: "From the text I previously provided, create a descriptive prompt suitable for an AI visual generator like DALL-E.",
        description: "Generate a visual cue from the content"
    },
    {
        name: "ConstructiveCritique",
        prompt: "Analyze the text I previously provided and give constructive feedback. Respond in the language of the provided text.",
        description: "Provide valuable feedback"
    },
    {
        name: "SimpleExplanation",
        prompt: "Based on the text I previously provided, simplify and explain it. Respond in the language of the provided text.",
        description: "Clarify the topic for a broader audience"
    },
    {
        name: "Paraphrase",
        prompt: "Retain the essence of the text I previously provided, but rephrase it. Respond in the language of the provided text.",
        description: "Alter wording without changing meaning"
    },
    {
        name: "SentimentAnalysis",
        prompt: "Determine the sentiment of the text I previously provided: positive, negative, or neutral. Respond in the language of the provided text.",
        description: "Gauge the mood of the content"
    },
    {
        name: "TextExtension",
        prompt: "Elaborate on the content I previously provided, offering a more detailed explanation. Respond in the language of the provided text.",
        description: "Expand on a concise text"
    }
];
