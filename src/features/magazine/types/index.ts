import { Contribution } from "@/features/contribution/types";
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
  StudentSubmission: Contribution[]
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
  
