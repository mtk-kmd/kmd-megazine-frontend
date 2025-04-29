export interface Magazine {
  id: string
  title: string
  openDate: string
  closeDate: string
  finalCloseDate: string
  published: boolean
}

export type MagazineFormValues = Omit<Magazine, 'id'>

export type SubmissionState =
  | 'submitted'
  | 'underReview'
  | 'selected'
  | 'rejected'

export interface Contribution {
  id: string
  title: string
  student: {
    id: string
    name: string
    email: string
  }
  faculty: {
    id: string
    name: string
  }
  state: SubmissionState
  submittedDate: string
  documentUrl?: string
  images?: string[]
  createdAt: string
  articleFile?: {
    id: string
    name: string
    url: string
  }
  comments: {
    id: string
    text: string
    coordinator: {
      id: string
      name: string
    }
    createdAt: string
  }[]
}
