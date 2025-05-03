import { Role } from "@/types";
import { User, UserWithOptionalFaculty } from "../users/types";
import { Closure } from "../magazine/types";

export type CreatedContributionResponse = {
    message: string
}

export type Comment = {
  comment_id: number;
  content: string;
  user_id: number;
  createdAt: string;
  submission_id: number;
  contributor: User;
};

export type ContributionViewCount = Array<{
    view_count_id: number;
    count: number;
    event_id: number;
  }>

export type ContributionEvent = {
    event_id: number;
    title: string;
    description: string;
    contribution_content_upload_url: string[];
    status: 'OPEN' | 'CLOSED' | 'FINALIZED';
    allowPublication: boolean;
    createdAt: string;
    updatedAt: string;
    userUser_id: number;
    faculty_id: number | null;
    closure_id: number;
    facultyFaculty_id: number | null;
    Faculty: null;
    User: User,
    closure: Closure;
    view_count: ContributionViewCount;
  }

export type Contribution = {
  submission_id: number;
  student_id: number;
  title: string;
  content: string;
  submission_status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  agreed_to_terms: boolean;
  submittedAt: string;
  updatedAt: string;
  uploadUrl: string[];
  event_id: number;
  event: ContributionEvent;
  student: UserWithOptionalFaculty;
  comments: Comment[];
};

export type GetContributionsResponse = {
    message: string;
    result: Contribution[];
}