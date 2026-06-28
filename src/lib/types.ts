export type UserRole = "seller" | "designer" | "manufacturer";

export type OrderStatus =
  | "pending"
  | "assigned"
  | "in_design"
  | "design_review"
  | "approved"
  | "manufacturing"
  | "completed"
  | "rejected";

export type FileType = "stl" | "3dm" | "jpg" | "png" | "reference";

export type OrderUrgency = "urgent" | "normal" | "low";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface OrderFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  version?: number;
}

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "order" | "file" | "status" | "comment";
}

export interface Order {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  status: OrderStatus;
  customer: Customer;
  seller: { id: string; name: string; email: string };
  designer?: { id: string; name: string; email: string };
  manufacturer?: { id: string; name: string; email: string };
  requirements: string;
  referenceImages: OrderFile[];
  designFiles: OrderFile[];
  previewImages: OrderFile[];
  comments: Comment[];
  activity: ActivityItem[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  progress: number;
  /** Priority set by seller when creating the order */
  urgency?: OrderUrgency;
  /** Step (1–4) where seller left off when create order was not finished */
  draftStep?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "new_order" | "accepted" | "file_upload" | "manufacturing_start" | "manufacturing_complete" | "general";
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  inDesign: number;
  manufacturing: number;
  completedOrders: number;
}

export interface ManagedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  url: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  designerId?: string;
  designerName?: string;
  sellerId?: string;
  sellerName?: string;
  manufacturerId?: string;
  manufacturerName?: string;
  version?: number;
  designerNote?: string;
}

export interface FileRepairRequest {
  id: string;
  fileId: string;
  orderId: string;
  orderNumber: string;
  fileName: string;
  productTitle: string;
  notes: string[];
  status: "pending" | "resolved";
  createdAt: string;
  sellerName: string;
}

export interface ForwardedFile {
  id: string;
  name: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  type: string;
}

export interface FileForwardPackage {
  id: string;
  fileIds: string[];
  files: ForwardedFile[];
  manufacturerId: string;
  manufacturerName: string;
  sellerName: string;
  note?: string;
  createdAt: string;
}
