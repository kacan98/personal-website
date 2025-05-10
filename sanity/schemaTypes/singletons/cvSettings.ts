import { defineType, Image } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export type CVSettings = {
  on: boolean
  name: string
  subtitle: string
  mainColumn: CvSection[]
  sideColumn: CvSection[]
  mainImage?: Image;
}

export interface CvSubSection {
  title?: string
  subtitles?: {
    left?: string
    right?: string
  }
  paragraphs?: string[]
  bulletPoints?: BulletPoint[]
}

export interface CvSection extends CvSubSection {
  subSections?: CvSubSection[]
  bulletPoints?: BulletPoint[]
}

export type BulletPoint = {
  iconName: string
  text: string
  url?: string
}

const TITLE = 'CV Settings'

export default defineType({
  title: TITLE,
  name: 'cvSettings',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    {
      title: 'CV modal on',
      name: 'on',
      type: 'boolean',
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string',
    },
    {
      title: 'Main Column',
      name: 'mainColumn',
      type: 'array',
      of: [
        {
          type: 'cvSection',
        },
      ],
    },
    {
      title: 'Side Column',
      name: 'sideColumn',
      type: 'array',
      of: [
        {
          type: 'cvSection',
        },
      ],
    },
    {
      title: 'Profile Picture',
      name: 'profilePicture',
      type: 'image',
    },
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
