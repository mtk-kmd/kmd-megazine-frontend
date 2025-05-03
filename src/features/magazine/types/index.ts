import { User } from "@/features/users/types";

export interface Closure {
  closure_id: number;
  entry_closure: string;
  final_closure: string;
}

export interface Event {
  event_id: number;
  title: string;
  description: string;
  contribution_content_upload_url: string[];
  status: 'OPEN' | 'CLOSED' | 'FINALIZED';
  allowPublication: boolean;
  createdAt: string;
  updatedAt: string;
  userUser_id: number;
  closure_id: number;
  User: User;
  closure: Closure;
}


export interface EventResponse {
  message: string;
  result: Event[];
}

export interface EventItemResponse {
  message: string;
  result: Event
}


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