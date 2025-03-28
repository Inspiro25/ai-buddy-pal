
// Array of possible chat suggestions categorized by type
const suggestionsByCategory = {
  technology: [
    "What can you tell me about quantum computing?",
    "Explain the difference between AI, ML, and deep learning",
    "Compare React, Angular, and Vue.js frameworks",
    "Tell me about the latest advancements in robotics",
    "What is Web3 and how is it different from the current web?",
    "Explain blockchain technology in simple terms",
    "What are the ethical concerns around AI development?",
  ],
  
  creativity: [
    "Write a creative story about time travel",
    "Generate a poem about the night sky",
    "Create a short sci-fi plot about AI consciousness",
    "Help me write a song about new beginnings",
    "Describe an alien world with unique physical laws",
    "Write a creative description for a fantasy character",
    "Generate a murder mystery scenario",
  ],
  
  professional: [
    "Write a professional email for a job application",
    "Draft a business proposal for a tech startup",
    "Create a project timeline for software development",
    "Help me write a professional LinkedIn summary",
    "Generate a product description for a new smartphone",
    "Write a company mission statement for a sustainability startup",
    "Draft a professional networking message",
  ],
  
  education: [
    "Explain the theory of relativity in simple terms",
    "Help me understand photosynthesis",
    "What are the key events of World War II?",
    "Explain how the human immune system works",
    "Give me a summary of macroeconomics basics",
    "Explain the process of climate change",
    "What are the main philosophical schools of thought?",
  ]
};

/**
 * Gets a set of random chat suggestions
 * @param count Number of suggestions to return
 * @returns Array of random suggestion strings
 */
export const getRandomSuggestions = (count: number = 4): string[] => {
  // Create a flattened array of all suggestions to pick from
  const allSuggestions: string[] = Object.values(suggestionsByCategory).flat();
  
  // Get random suggestions
  const randomSuggestions: string[] = [];
  const usedIndices = new Set<number>();
  
  // Try to get one from each category first for variety
  const categories = Object.keys(suggestionsByCategory);
  
  for (let i = 0; i < Math.min(count, categories.length); i++) {
    const category = categories[i];
    const categoryArray = suggestionsByCategory[category as keyof typeof suggestionsByCategory];
    const randomIndex = Math.floor(Math.random() * categoryArray.length);
    randomSuggestions.push(categoryArray[randomIndex]);
  }
  
  // Fill remaining slots with random suggestions
  while (randomSuggestions.length < count) {
    const randomIndex = Math.floor(Math.random() * allSuggestions.length);
    
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      randomSuggestions.push(allSuggestions[randomIndex]);
    }
  }
  
  return randomSuggestions;
};
