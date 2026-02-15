import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { OPENAI_API_KEY } from '@/lib/env'
import { OPENAI_MODELS } from '@/lib/openai-service'
import { CVSettings, CVSettingsSchema, CVSettingsSchemaForOpenAI } from '@/types'

export interface CVPersonalizationOptions {
  cvData: CVSettings
  jobDescription: string
  positionSummary?: string
}

/**
 * Convert undefined to null recursively for OpenAI compatibility
 * OpenAI Structured Outputs requires all fields to be present (but can be null)
 */
function undefinedToNull<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as T
  }
  if (Array.isArray(obj)) {
    return obj.map(undefinedToNull) as T
  }
  if (typeof obj === 'object') {
    const result: any = {}
    for (const key in obj) {
      result[key] = undefinedToNull(obj[key])
    }
    return result
  }
  return obj
}

export class CVPersonalizationService {
  /**
   * Personalize a CV for a specific job position using the original prompt format
   */
  static async personalizeCV(options: CVPersonalizationOptions): Promise<CVSettings> {
    const { cvData, jobDescription, positionSummary: _positionSummary } = options

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    console.log(`CVPersonalizationService - Starting CV personalization with ${OPENAI_MODELS.LATEST_MINI}`)

    // Convert undefined to null for OpenAI compatibility
    const cvForOpenAI = undefinedToNull(cvData)

    let completion
    try {
      completion = await openai.chat.completions.parse({
        model: OPENAI_MODELS.LATEST_MINI,
        messages: [
          {
            role: 'user',
            content: `You are an elite HR specializing at getting people their dream jobs. A candidate sent you a cv.`,
          },
          {
            role: 'user',
            content: JSON.stringify(cvForOpenAI),
          },
          {
            role: 'user',
            content: `
            The candidate is applying for a position: ${jobDescription}.

            Improve the CV to match this position. Keep the CV approximately the same length as the original.
            Focus on adjusting existing content rather than adding lots of new content.
            Keep all existing company names and workplace information exactly as they are - do not modify, hide, or replace them.
            `,
          },
          ],
        response_format: zodResponseFormat(CVSettingsSchemaForOpenAI, 'personalized_cv'),
      })
      console.log('CVPersonalizationService - CV personalization completed')
    } catch (e) {
      console.error('CVPersonalizationService - OpenAI API call failed:', e)
      throw new Error(`Failed to personalize CV: ${e instanceof Error ? e.message : 'Unknown OpenAI API error'}`)
    }

    // Get the parsed response (OpenAI guarantees it matches CVSettingsSchemaForOpenAI structure)
    const openaiResponse = completion.choices[0].message.parsed

    if (!openaiResponse) {
      console.error('CVPersonalizationService - No parsed CV from OpenAI')
      throw new Error('OpenAI did not return a parsed CV (response was empty or refused)')
    }

    // Parse through full schema to ensure all fields have their default values
    const personalizedCV = CVSettingsSchema.parse(openaiResponse)
    return personalizedCV
  }
}