import { z } from 'zod';
import { ImprovementMemory } from '@/app/db/schema';

/**
 * Shared types for improvement memories API
 */

// Save endpoint
export const SaveImprovementMemoriesRequest = z.object({
  improvements: z.array(
    z.object({
      key: z.string().min(1),
      description: z.string().min(1),
    })
  ).min(1),
});

export type SaveImprovementMemoriesRequest = z.infer<typeof SaveImprovementMemoriesRequest>;

export interface SaveImprovementMemoriesResponse {
  success: boolean;
  memories: ImprovementMemory[];
}

// List endpoint
export interface ListImprovementMemoriesResponse {
  success: boolean;
  memories: ImprovementMemory[];
}

// Update endpoint
export const UpdateImprovementMemoryRequest = z.object({
  id: z.number(),
  newDescription: z.string().min(1),
});

export type UpdateImprovementMemoryRequest = z.infer<typeof UpdateImprovementMemoryRequest>;

export interface UpdateImprovementMemoryResponse {
  success: boolean;
  memory: ImprovementMemory;
}

// Delete endpoint
export const DeleteImprovementMemoryRequest = z.object({
  id: z.number(),
});

export type DeleteImprovementMemoryRequest = z.infer<typeof DeleteImprovementMemoryRequest>;

export interface DeleteImprovementMemoryResponse {
  success: boolean;
  deletedId: number;
}

// Error response
export interface ErrorResponse {
  error: string;
}
