/**
 * Shared AI prompts and configurations for CV processing
 */

export interface PromptConfig {
  systemPrompt: string;
  userPromptTemplate: (params: any) => string;
  temperature: number;
  maxTokens: number;
}

/**
 * Common system prompt for CV adjustments
 */
export const CV_ADJUSTMENT_SYSTEM_PROMPT = `You are an expert CV/resume optimizer and HR specialist. Your job is to improve CV content to better match specific job positions while maintaining complete accuracy and truthfulness.

Guidelines:
- Keep all information truthful and accurate - NEVER add false information or experiences
- Adjust wording and descriptions to highlight relevant skills and experiences for the target position
- Reorganize sections and bullet points to prioritize most relevant items first
- Use keywords from the job description where naturally appropriate
- Maintain professional tone and original structure
- Focus on making existing content more relevant rather than adding extensive new content
- When enhancing content, ensure it's based on existing experiences and remains truthful
- Preserve the overall length and don't make sections excessively longer`;

/**
 * Constraints that apply to all CV adjustments
 */
export const COMMON_CONSTRAINTS = `
IMPORTANT CONSTRAINTS:
- Keep response length similar to original (max 50% longer per section)
- Focus on reordering and tweaking existing content rather than adding extensive new content
- Use relevant keywords from the job description naturally
- Prioritize most relevant experiences and skills first
- If adding new content, it must be truthful and based on existing experiences
- Maintain the same JSON structure and format exactly
- Keep all modifications professional and accurate

IMPORTANT: You must respond with valid JSON only that matches the input structure exactly.`;

/**
 * Configuration for full CV personalization
 */
export const PERSONALIZE_CV_CONFIG: PromptConfig = {
  systemPrompt: CV_ADJUSTMENT_SYSTEM_PROMPT,
  userPromptTemplate: (params: {
    position: string;
    cv: any;
    positionSummary?: string;
    jobIntersection?: any;
  }) => `Please personalize this CV for the following position:

Position: ${params.position}

Current CV: ${JSON.stringify(params.cv, null, 2)}

${params.positionSummary ? `Position Summary: ${params.positionSummary}` : ''}

${params.jobIntersection ? `Relevant Skills/Keywords from Job Analysis: ${JSON.stringify(params.jobIntersection, null, 2)}` : ''}

${COMMON_CONSTRAINTS}

Please return the personalized CV in the exact same JSON format.`,
  temperature: 0.3,
  maxTokens: 4000,
};

/**
 * Configuration for individual section adjustment
 */
export const ADJUST_SECTION_CONFIG: PromptConfig = {
  systemPrompt: `${CV_ADJUSTMENT_SYSTEM_PROMPT}

Focus on adjusting a single CV section to better match a specific job position while maintaining accuracy and truthfulness.

Additional Section Guidelines:
- Reorganize bullet points to prioritize most relevant items first
- Use keywords from the job description where appropriate
- Don't add false information or experiences
- Keep the same number of bullet points or fewer
- Maintain the same structure and format`,
  userPromptTemplate: (params: {
    positionDescription: string;
    section: any;
    sectionType?: string;
  }) => `Please adjust this CV section to better match the following position:

Position Description: ${params.positionDescription}

Current Section: ${JSON.stringify(params.section, null, 2)}

Section Type: ${params.sectionType || 'general'}

${COMMON_CONSTRAINTS}

Please return the adjusted section in the same JSON format.

IMPORTANT: You must respond with valid JSON only. If the position description is unclear or invalid, still return the original section in JSON format.`,
  temperature: 0.3,
  maxTokens: 2000,
};

/**
 * Helper function to create OpenAI chat completion request
 */
export function createChatCompletionRequest(config: PromptConfig, params: any) {
  return {
    model: 'gpt-4',
    messages: [
      { role: 'system' as const, content: config.systemPrompt },
      { role: 'user' as const, content: config.userPromptTemplate(params) },
    ],
    temperature: config.temperature,
    max_completion_tokens: config.maxTokens,
  };
}
