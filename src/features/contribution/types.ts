import { Closure } from "../magazine/types";

export type CreatedContributionResponse = {
    message: string
}

export type Role = {
  role_id: number;
  role_name: string;
  createdAt: string;
  updatedAt: string;
};

export type Faculty = {
  faculty_id: number;
  name: string;
  coordinator_id: number;
  createdAt: string;
  updatedAt: string;
};

export type StudentFaculty = {
  student_faculty_id: number;
  student_id: number;
  faculty_id: number;
  faculty: Faculty;
};

export type User = {
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  auth_id: number | null;
  role_id: number;
  faculty_id: number | null;
  student_faculty_id: number | null;
  guest_faculty_id: number | null;
  role: Role;
  StudentFaculty?: StudentFaculty;
};

export type Comment = {
  comment_id: number;
  content: string;
  user_id: number;
  createdAt: string;
  submission_id: number;
  contributor: User;
};

export type ViewCount = {
  view_count_id: number;
  count: number;
  event_id: number;
};

export type ContributionEvent = {
  event_id: number;
  title: string;
  description: string;
  contribution_content_upload_url: string[];
  status: 'OPEN' | 'CLOSED';
  allowPublication: boolean;
  createdAt: string;
  updatedAt: string;
  userUser_id: number;
  faculty_id: number | null;
  closure_id: number;
  facultyFaculty_id: number | null;
  Faculty: Faculty | null;
  User: User;
  closure: Closure;
  view_count: ViewCount[];
};

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
  student: User;
  comments: Comment[];
};

export type GetContributionsResponse = {
    message: string;
    result: Contribution[];
}

export type GetContributionResponse = {
    message: string;
    result: Contribution;
}

export type UpdateSubmissionStatusResponse = {
    message: string;
}
    