import type { Module } from '../types'

export interface CourseMeta {
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  accentColor: string
}

export const COURSE_METADATA: Record<string, CourseMeta> = {
  mod_1: {
    category: 'Frontend',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  },
  mod_2: {
    category: 'Architecture',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#3B82F6',
  },
  mod_3: {
    category: 'Backend',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    accentColor: '#10B981',
  },
  mod_4: {
    category: 'Full-Stack',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#F59E0B',
  },
  mod_5: {
    category: 'DevOps',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    accentColor: '#6366F1',
  },
}

export function getCourseMeta(module: Module): CourseMeta {
  if (COURSE_METADATA[module.id]) {
    return COURSE_METADATA[module.id]
  }
  return {
    category: module.weekNumber <= 2 ? 'Frontend' : module.weekNumber <= 3 ? 'Backend' : 'DevOps',
    difficulty: module.weekNumber <= 1 ? 'Beginner' : module.weekNumber <= 3 ? 'Intermediate' : 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  }
}

