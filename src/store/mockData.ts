export type Role = 'Department User' | 'Admin' | 'ICT Support';

export interface User {
  id: string;
  name: string;
  role: Role;
  officeId?: string;
  email: string;
}

export interface Office {
  id: string;
  name: string;
}

export interface Asset {
  id: string;
  officeId: string;
  equipmentType: string;
  propertyNumber: string;
  inventoryNumber: string;
  brand: string;
  model: string;
  serialNumber: string;
  assignedTo: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Damaged' | 'For Repair' | 'Unserviceable';
  operationalStatus: 'Operational' | 'Under Maintenance' | 'Non-Operational' | 'For Replacement' | 'Retired' | 'Lost / Missing';
  hostname?: string;
  processor?: string;
  memory?: string;
  diskStorage?: string;
  operatingSystem?: string;
  microsoftOffice?: string;
  exactLocation?: string;
  acquisitionCost?: string;
  dateAcquired?: string;
  dateAudited?: string;
  auditedBy?: string;
  remarks?: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  requesterId: string;
  officeId: string;
  assetId?: string;
  categoryId: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  subject: string;
  description: string;
  status: 'NEW' | 'ASSIGNED' | 'IN PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: { status: 'NEW' | 'ASSIGNED' | 'IN PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED', timestamp: string }[];
  comments?: Comment[];
  ictRecommendation?: string;
}

export let mockOffices: Office[] = [
  { id: 'off_1', name: 'Municipal Accounting Office' },
  { id: 'off_2', name: "Mayor's Office" },
  { id: 'off_3', name: 'Human Resources' },
];

export function addOffice(name: string) {
  const newOffice: Office = {
    id: 'off_' + Math.random().toString(36).substr(2, 9),
    name
  };
  mockOffices = [...mockOffices, newOffice];
  return newOffice;
}

export function updateOffice(id: string, name: string) {
  mockOffices = mockOffices.map(o => o.id === id ? { ...o, name } : o);
}

export const mockUsers: User[] = [
  { id: 'usr_admin', name: 'System Admin', role: 'Admin', email: 'admin@lgu.gov.ph' },
  { id: 'usr_ict1', name: 'ICT Support 1', role: 'ICT Support', email: 'ict1@lgu.gov.ph' },
  { id: 'usr_ict2', name: 'ICT Support 2', role: 'ICT Support', email: 'ict2@lgu.gov.ph' },
  { id: 'usr_ict3', name: 'ICT Support 3', role: 'ICT Support', email: 'ict3@lgu.gov.ph' },
  { id: 'usr_ict4', name: 'ICT Support 4', role: 'ICT Support', email: 'ict4@lgu.gov.ph' },
  { id: 'usr_dept1', name: 'Juan Dela Cruz', role: 'Department User', officeId: 'off_1', email: 'juan@lgu.gov.ph' },
];

export const mockCategories = [
  { id: 'cat_hw', name: 'Hardware' },
  { id: 'cat_sw', name: 'Software' },
  { id: 'cat_net', name: 'Network' },
];

export let mockAssets: Asset[] = [
  {
    id: 'ast_1',
    officeId: 'off_1',
    equipmentType: 'Desktop Computer',
    propertyNumber: '2026-ICT-00125',
    inventoryNumber: 'INV-125',
    brand: 'Dell',
    model: 'OptiPlex 7010',
    serialNumber: 'SN-DELL-123',
    assignedTo: 'Juan Dela Cruz',
    condition: 'Poor',
    operationalStatus: 'Non-Operational',
    hostname: 'MAO-DESK-01',
    processor: 'Intel Core i5-10500',
    memory: '8GB DDR4',
    diskStorage: '256GB NVMe SSD',
    operatingSystem: 'Windows 10 Pro',
    microsoftOffice: 'Office 2019 Standard',
    exactLocation: 'Desk 4, East Wing',
    acquisitionCost: 'PHP 45,000.00',
    dateAcquired: '2021-05-15',
    dateAudited: '2025-11-20',
    auditedBy: 'ICT Support 1',
    remarks: 'Motherboard failure. Pending replacement parts.'
  },
  {
    id: 'ast_2',
    officeId: 'off_2',
    equipmentType: 'Laptop',
    propertyNumber: '2026-ICT-00126',
    inventoryNumber: 'INV-126',
    brand: 'Lenovo',
    model: 'ThinkPad T14',
    serialNumber: 'SN-LEN-456',
    assignedTo: 'Mayor',
    condition: 'Excellent',
    operationalStatus: 'Operational',
    hostname: 'MAYOR-LT-01',
    processor: 'Intel Core i7-1165G7',
    memory: '16GB DDR4',
    diskStorage: '512GB NVMe SSD',
    operatingSystem: 'Windows 11 Pro',
    microsoftOffice: 'Microsoft 365 Apps',
    exactLocation: 'Mayor\'s Private Office',
    acquisitionCost: 'PHP 75,000.00',
    dateAcquired: '2022-08-10',
    dateAudited: '2026-01-15',
    auditedBy: 'System Admin',
    remarks: 'In pristine condition.'
  }
];

export let mockTickets: Ticket[] = [
  {
    id: 'tkt_1',
    ticketNumber: 'ICT-2026-00001',
    requesterId: 'usr_dept1',
    officeId: 'off_1',
    assetId: 'ast_1',
    categoryId: 'cat_hw',
    priority: 'High',
    subject: 'Computer does not boot',
    description: 'When I turn on the computer, it just shows a black screen with a flashing cursor. It was working fine yesterday.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    statusHistory: [
      { status: 'NEW', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
    ]
  },
  {
    id: 'tkt_2',
    ticketNumber: 'ICT-2026-00002',
    requesterId: 'usr_dept1',
    officeId: 'off_1',
    categoryId: 'cat_net',
    priority: 'Medium',
    subject: 'Cannot connect to shared drive',
    description: 'The Z: drive is no longer accessible from my computer.',
    status: 'IN PROGRESS',
    assignedToId: 'usr_ict1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    statusHistory: [
      { status: 'NEW', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
      { status: 'IN PROGRESS', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() }
    ]
  }
];

export function addTicket(ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'status' | 'createdAt' | 'updatedAt'>) {
  const newTicket: Ticket = {
    ...ticket,
    id: 'tkt_' + Math.random().toString(36).substr(2, 9),
    ticketNumber: `ICT-2026-\${String(mockTickets.length + 1).padStart(5, '0')}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [{ status: 'NEW', timestamp: new Date().toISOString() }],
  };
  mockTickets = [newTicket, ...mockTickets];
  return newTicket;
}

export function updateTicketStatus(ticketId: string, status: Ticket['status'], assignedToId?: string) {
  mockTickets = mockTickets.map(t => {
    if (t.id === ticketId) {
      const timestamp = new Date().toISOString();
      return {
        ...t,
        status,
        ...(assignedToId ? { assignedToId } : {}),
        updatedAt: timestamp,
        statusHistory: [...(t.statusHistory || []), { status, timestamp }]
      };
    }
    return t;
  });
}

export function addCommentToTicket(ticketId: string, userId: string, text: string) {
  mockTickets = mockTickets.map(t => {
    if (t.id === ticketId) {
      const newComment: Comment = {
        id: 'cmt_' + Math.random().toString(36).substr(2, 9),
        ticketId,
        userId,
        text,
        createdAt: new Date().toISOString()
      };
      return {
        ...t,
        comments: [...(t.comments || []), newComment],
        updatedAt: new Date().toISOString()
      };
    }
    return t;
  });
}

export function updateTicketRecommendation(ticketId: string, recommendation: string) {
  mockTickets = mockTickets.map(t => {
    if (t.id === ticketId) {
      return {
        ...t,
        ictRecommendation: recommendation,
        updatedAt: new Date().toISOString()
      };
    }
    return t;
  });
}

export function addAsset(asset: Omit<Asset, 'id'>) {
  const newAsset: Asset = {
    ...asset,
    id: 'ast_' + Math.random().toString(36).substr(2, 9),
  };
  mockAssets = [newAsset, ...mockAssets];
  return newAsset;
}

export function updateAsset(id: string, updates: Partial<Omit<Asset, 'id'>>) {
  mockAssets = mockAssets.map(a => 
    a.id === id ? { ...a, ...updates } : a
  );
}
