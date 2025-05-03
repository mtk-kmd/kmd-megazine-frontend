export const ROLE = {
  admin: 1,
  manager: 2,
  marketing_coordinator: 3,
  student: 4,
  guest: 5,
} as const


export const ROLE_NAME = {
  1: 'admin',
  2: 'manager',
  3: 'marketing_coordinator',
  4: 'student',
  5: 'guest',
} as const


export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
export const ACCEPTED_ARTICLE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]