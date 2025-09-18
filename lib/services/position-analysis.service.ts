import { baseUrl } from '@/util'
import { jobCvIntersectionAPIEndpointName } from '@/app/api/job-cv-intersection/model'
import { POST as POSTIntersection } from '@/app/api/job-cv-intersection/route'
import { positionSummaryAPIRoute } from '@/app/api/position-summary/model'
import {
  PositionSummarizeParams,
  PositionSummarizeResponse,
} from '@/app/api/position-summary/route'
import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { CVSettings } from '@/types'

export interface PositionAnalysisResult {
  positionSummary?: string
  companyName?: string | null
  jobIntersection?: JobCvIntersectionResponse
}

export class PositionAnalysisService {
  /**
   * Run position summary and job intersection analysis in parallel
   */
  static async analyzePosition(
    jobDescription: string,
    cvData: CVSettings,
    request?: Request,
    options?: {
      skipSummary?: boolean
      skipIntersection?: boolean
    }
  ): Promise<PositionAnalysisResult> {
    const needsSummary = !options?.skipSummary
    const needsIntersection = !options?.skipIntersection

    if (!needsSummary && !needsIntersection) {
      return {}
    }

    console.log('PositionAnalysisService - Running analysis tasks in parallel')

    const tasks: Promise<any>[] = []

    // Position summary task
    if (needsSummary) {
      const positionSummaryTask = fetch(
        `${baseUrl}/${positionSummaryAPIRoute}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request?.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            description: jobDescription,
          } as PositionSummarizeParams),
        }
      ).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Position summary failed (${response.status}): ${errorText}`)
        }
        return response.json() as Promise<PositionSummarizeResponse>
      })
      tasks.push(positionSummaryTask)
    }

    // Job intersection task
    if (needsIntersection) {
      const jobIntersectionTask = POSTIntersection(
        new Request(baseUrl + '/' + jobCvIntersectionAPIEndpointName, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request?.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            candidate: cvData,
            jobDescription: jobDescription,
          }),
        })
      ).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Job intersection failed (${response.status}): ${errorText}`)
        }
        return response.json()
      })
      tasks.push(jobIntersectionTask)
    }

    try {
      const results = await Promise.all(tasks)

      const result: PositionAnalysisResult = {}
      let resultIndex = 0

      if (needsSummary) {
        const positionResult = results[resultIndex++] as PositionSummarizeResponse
        result.positionSummary = positionResult.summary
        result.companyName = positionResult.companyName
        console.log('PositionAnalysisService - Position summary completed')
      }

      if (needsIntersection) {
        result.jobIntersection = results[resultIndex++]
        console.log('PositionAnalysisService - Job intersection completed')
      }

      console.log('PositionAnalysisService - Analysis tasks completed')
      return result
    } catch (e) {
      console.error('PositionAnalysisService - Analysis failed:', e)
      throw new Error(`Failed to complete position analysis: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }
}