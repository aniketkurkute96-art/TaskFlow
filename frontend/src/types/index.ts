export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId?: string;
  active: boolean;
}

export interface Department {
  id: string;
  name: string;
  parentId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  assigneeId?: string;
  assigneeType?: string;
  departmentId?: string;
  amount?: number;
  approvalType: '360' | 'specific' | 'predefined';
  approvalTemplateId?: string;
  status: 'open' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  creator?: User;
  assignee?: User;
  department?: Department;
  nodes?: TaskNode[];
  approvers?: TaskApprover[];
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface TaskNode {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  forwardedAt: string;
  fromUser?: User;
  toUser?: User;
}

export interface TaskApprover {
  id: string;
  taskId: string;
  levelOrder: number;
  approverUserId: string;
  status: 'pending' | 'approved' | 'rejected';
  actionAt?: string;
  approver?: User;
  task?: Task;
}

export interface ApprovalTemplate {
  id: string;
  name: string;
  conditionJson: string;
  isActive: boolean;
  stages?: ApprovalTemplateStage[];
}

export interface ApprovalTemplateStage {
  id: string;
  templateId: string;
  levelOrder: number;
  approverType: 'user' | 'role' | 'dynamic_role';
  approverValue: string;
  conditionJson: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  filename: string;
  filepath: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  user?: User;
}
