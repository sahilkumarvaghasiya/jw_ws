import type {
  Order,
  Notification,
  DashboardStats,
  User,
} from "./types";

export const currentUser: User = {
  id: "u1",
  name: "Eleanor Whitmore",
  email: "eleanor@luxejewels.com",
  role: "seller",
  company: "Luxe Jewels Co.",
  phone: "+1 (555) 123-4567",
};

export const dashboardStats: DashboardStats = {
  totalOrders: 248,
  pendingOrders: 18,
  inDesign: 34,
  manufacturing: 22,
  completedOrders: 174,
};

export const monthlyOrderData = [
  { month: "Jan", orders: 28, completed: 22 },
  { month: "Feb", orders: 32, completed: 28 },
  { month: "Mar", orders: 38, completed: 30 },
  { month: "Apr", orders: 35, completed: 32 },
  { month: "May", orders: 42, completed: 38 },
  { month: "Jun", orders: 45, completed: 40 },
];

export const orderProgressData = [
  { name: "Pending", value: 18, color: "#9CA3AF" },
  { name: "In Design", value: 34, color: "#D4AF37" },
  { name: "Manufacturing", value: 22, color: "#F59E0B" },
  { name: "Completed", value: 174, color: "#10B981" },
];

export const teamPerformance = [
  { name: "Sarah Chen", role: "Designer", completed: 42, rating: 4.9 },
  { name: "Marcus Webb", role: "Designer", completed: 38, rating: 4.8 },
  { name: "Elena Rossi", role: "Manufacturer", completed: 56, rating: 4.9 },
  { name: "James Park", role: "Manufacturer", completed: 48, rating: 4.7 },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "New Order Assigned",
    message: "Order #JW-2024-089 has been assigned to you for design.",
    type: "new_order",
    read: false,
    createdAt: "2024-06-28T10:30:00Z",
    orderId: "o1",
  },
  {
    id: "n2",
    title: "Designer Accepted Order",
    message: "Sarah Chen accepted order #JW-2024-087.",
    type: "accepted",
    read: false,
    createdAt: "2024-06-28T09:15:00Z",
    orderId: "o2",
  },
  {
    id: "n3",
    title: "Files Uploaded",
    message: "STL and preview files uploaded for order #JW-2024-085.",
    type: "file_upload",
    read: true,
    createdAt: "2024-06-27T16:45:00Z",
    orderId: "o3",
  },
  {
    id: "n4",
    title: "Manufacturing Started",
    message: "Production has begun for order #JW-2024-082.",
    type: "manufacturing_start",
    read: true,
    createdAt: "2024-06-27T11:00:00Z",
    orderId: "o4",
  },
  {
    id: "n5",
    title: "Manufacturing Completed",
    message: "Order #JW-2024-078 is ready for delivery.",
    type: "manufacturing_complete",
    read: true,
    createdAt: "2024-06-26T14:30:00Z",
    orderId: "o5",
  },
];

const sampleReferenceImages = [
  {
    id: "f1",
    name: "ring-reference-1.jpg",
    type: "reference" as const,
    size: 2450000,
    uploadedAt: "2024-06-20T10:00:00Z",
    uploadedBy: "Eleanor Whitmore",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
  },
  {
    id: "f2",
    name: "ring-reference-2.jpg",
    type: "reference" as const,
    size: 1890000,
    uploadedAt: "2024-06-20T10:05:00Z",
    uploadedBy: "Eleanor Whitmore",
    url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
  },
];

const sampleDesignFiles = [
  {
    id: "f3",
    name: "diamond-ring-v2.stl",
    type: "stl" as const,
    size: 15600000,
    uploadedAt: "2024-06-25T14:00:00Z",
    uploadedBy: "Sarah Chen",
    url: "#",
    version: 2,
  },
  {
    id: "f4",
    name: "diamond-ring-v2.3dm",
    type: "3dm" as const,
    size: 8900000,
    uploadedAt: "2024-06-25T14:05:00Z",
    uploadedBy: "Sarah Chen",
    url: "#",
    version: 2,
  },
];

const samplePreviews = [
  {
    id: "f5",
    name: "diamond-ring-preview.jpg",
    type: "jpg" as const,
    size: 3200000,
    uploadedAt: "2024-06-25T14:10:00Z",
    uploadedBy: "Sarah Chen",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    orderNumber: "JW-2024-089",
    title: "Platinum Diamond Engagement Ring",
    description:
      "Custom platinum engagement ring featuring a 2-carat round brilliant diamond with pavé band accents.",
    status: "in_design",
    customer: {
      name: "Michael & Jessica Thompson",
      email: "j.thompson@email.com",
      phone: "+1 (555) 234-5678",
      address: "742 Park Avenue, New York, NY 10021",
    },
    seller: { id: "u1", name: "Eleanor Whitmore", email: "eleanor@luxejewels.com" },
    designer: { id: "u2", name: "Sarah Chen", email: "sarah@designstudio.com" },
    requirements:
      "Platinum 950, 2ct round brilliant center stone, pavé band with 0.5ct total weight side stones. Ring size 6.5.",
    referenceImages: sampleReferenceImages,
    designFiles: sampleDesignFiles,
    previewImages: samplePreviews,
    comments: [
      {
        id: "c1",
        author: "Sarah Chen",
        authorRole: "designer",
        content: "Initial CAD model complete. Please review the proportions of the pavé setting.",
        createdAt: "2024-06-25T14:30:00Z",
      },
      {
        id: "c2",
        author: "Eleanor Whitmore",
        authorRole: "seller",
        content: "Looks great! Please adjust the band width to 2.5mm as discussed.",
        createdAt: "2024-06-26T09:00:00Z",
      },
    ],
    activity: [
      { id: "a1", action: "Order created", user: "Eleanor Whitmore", timestamp: "2024-06-20T10:00:00Z", type: "order" },
      { id: "a2", action: "Assigned to Sarah Chen", user: "Eleanor Whitmore", timestamp: "2024-06-21T11:00:00Z", type: "status" },
      { id: "a3", action: "Design accepted", user: "Sarah Chen", timestamp: "2024-06-22T09:30:00Z", type: "status" },
      { id: "a4", action: "STL files uploaded (v2)", user: "Sarah Chen", timestamp: "2024-06-25T14:00:00Z", type: "file" },
    ],
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2024-06-26T09:00:00Z",
    dueDate: "2024-07-15",
    progress: 65,
  },
  {
    id: "o2",
    orderNumber: "JW-2024-088",
    title: "Rose Gold Sapphire Pendant",
    description: "Elegant rose gold pendant with oval blue sapphire centerpiece.",
    status: "assigned",
    customer: {
      name: "Amanda Brooks",
      email: "a.brooks@email.com",
      phone: "+1 (555) 345-6789",
    },
    seller: { id: "u1", name: "Eleanor Whitmore", email: "eleanor@luxejewels.com" },
    designer: { id: "u3", name: "Marcus Webb", email: "marcus@designstudio.com" },
    requirements: "18K rose gold, 3ct oval sapphire, delicate chain 18 inches.",
    referenceImages: [
      {
        id: "f6",
        name: "pendant-ref.jpg",
        type: "reference",
        size: 2100000,
        uploadedAt: "2024-06-22T08:00:00Z",
        uploadedBy: "Eleanor Whitmore",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
      },
    ],
    designFiles: [],
    previewImages: [],
    comments: [],
    activity: [
      { id: "a5", action: "Order created", user: "Eleanor Whitmore", timestamp: "2024-06-22T08:00:00Z", type: "order" },
      { id: "a6", action: "Assigned to Marcus Webb", user: "Eleanor Whitmore", timestamp: "2024-06-23T10:00:00Z", type: "status" },
    ],
    createdAt: "2024-06-22T08:00:00Z",
    updatedAt: "2024-06-23T10:00:00Z",
    dueDate: "2024-07-20",
    progress: 15,
  },
  {
    id: "o3",
    orderNumber: "JW-2024-087",
    title: "Emerald Cut Diamond Earrings",
    description: "Pair of emerald cut diamond drop earrings in white gold.",
    status: "manufacturing",
    customer: {
      name: "David & Lisa Chen",
      email: "d.chen@email.com",
      phone: "+1 (555) 456-7890",
    },
    seller: { id: "u1", name: "Eleanor Whitmore", email: "eleanor@luxejewels.com" },
    designer: { id: "u2", name: "Sarah Chen", email: "sarah@designstudio.com" },
    manufacturer: { id: "u4", name: "Elena Rossi", email: "elena@manufacturing.com" },
    requirements: "18K white gold, 1.5ct emerald cut diamonds each, lever-back closures.",
    referenceImages: sampleReferenceImages,
    designFiles: sampleDesignFiles,
    previewImages: samplePreviews,
    comments: [],
    activity: [],
    createdAt: "2024-06-10T09:00:00Z",
    updatedAt: "2024-06-27T11:00:00Z",
    dueDate: "2024-07-05",
    progress: 80,
  },
  {
    id: "o4",
    orderNumber: "JW-2024-086",
    title: "Vintage Art Deco Bracelet",
    description: "Art deco inspired bracelet with geometric diamond pattern.",
    status: "completed",
    customer: {
      name: "Robert Williams",
      email: "r.williams@email.com",
      phone: "+1 (555) 567-8901",
    },
    seller: { id: "u1", name: "Eleanor Whitmore", email: "eleanor@luxejewels.com" },
    designer: { id: "u3", name: "Marcus Webb", email: "marcus@designstudio.com" },
    manufacturer: { id: "u4", name: "Elena Rossi", email: "elena@manufacturing.com" },
    requirements: "Platinum, art deco geometric design, 5ct total diamond weight.",
    referenceImages: [],
    designFiles: sampleDesignFiles,
    previewImages: samplePreviews,
    comments: [],
    activity: [],
    createdAt: "2024-05-15T08:00:00Z",
    updatedAt: "2024-06-26T14:30:00Z",
    progress: 100,
  },
  {
    id: "o5",
    orderNumber: "JW-2024-085",
    title: "Pearl & Diamond Necklace",
    description: "South Sea pearl necklace with diamond clasp.",
    status: "pending",
    customer: {
      name: "Catherine Moore",
      email: "c.moore@email.com",
      phone: "+1 (555) 678-9012",
    },
    seller: { id: "u1", name: "Eleanor Whitmore", email: "eleanor@luxejewels.com" },
    requirements: "12mm South Sea pearls, 18K white gold diamond clasp, 16 inch length.",
    referenceImages: [],
    designFiles: [],
    previewImages: [],
    comments: [],
    activity: [],
    createdAt: "2024-06-27T15:00:00Z",
    updatedAt: "2024-06-27T15:00:00Z",
    dueDate: "2024-08-01",
    progress: 5,
  },
];

export const allFiles = orders.flatMap((order) => [
  ...order.referenceImages.map((f) => ({
    ...f,
    id: `${order.id}-${f.id}`,
    orderNumber: order.orderNumber,
    orderId: order.id,
  })),
  ...order.designFiles.map((f) => ({
    ...f,
    id: `${order.id}-${f.id}`,
    orderNumber: order.orderNumber,
    orderId: order.id,
  })),
  ...order.previewImages.map((f) => ({
    ...f,
    id: `${order.id}-${f.id}`,
    orderNumber: order.orderNumber,
    orderId: order.id,
  })),
]);

export const designers = [
  { id: "u2", name: "Sarah Chen", email: "sarah@designstudio.com", activeOrders: 8 },
  { id: "u3", name: "Marcus Webb", email: "marcus@designstudio.com", activeOrders: 6 },
];

export const manufacturers = [
  { id: "u4", name: "Elena Rossi", email: "elena@manufacturing.com", activeOrders: 12 },
  { id: "u5", name: "James Park", email: "james@manufacturing.com", activeOrders: 10 },
];
