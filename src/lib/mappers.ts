export const mapAssetFromDB = (dbAsset: any) => ({
  id: dbAsset.id,
  officeId: dbAsset.department_id,
  equipmentType: dbAsset.equipment_type,
  propertyNumber: dbAsset.property_number,
  inventoryNumber: dbAsset.inventory_number,
  brand: dbAsset.brand,
  model: dbAsset.model,
  serialNumber: dbAsset.serial_number,
  hostname: dbAsset.hostname,
  processor: dbAsset.processor,
  memory: dbAsset.memory,
  diskStorage: dbAsset.disk_storage,
  assignedTo: dbAsset.assigned_to,
  exactLocation: dbAsset.exact_location,
  operatingSystem: dbAsset.operating_system,
  microsoftOffice: dbAsset.microsoft_office,
  condition: dbAsset.condition,
  operationalStatus: dbAsset.operational_status,
  acquisitionCost: dbAsset.acquisition_cost,
  dateAcquired: dbAsset.date_acquired,
  dateAudited: dbAsset.date_audited,
  auditedBy: dbAsset.audited_by,
  remarks: dbAsset.remarks,
});

export const mapAssetToDB = (asset: any) => ({
  department_id: asset.officeId,
  equipment_type: asset.equipmentType,
  property_number: asset.propertyNumber,
  inventory_number: asset.inventoryNumber,
  brand: asset.brand,
  model: asset.model,
  serial_number: asset.serialNumber,
  hostname: asset.hostname,
  processor: asset.processor,
  memory: asset.memory,
  disk_storage: asset.diskStorage,
  assigned_to: asset.assignedTo,
  exact_location: asset.exactLocation,
  operating_system: asset.operatingSystem,
  microsoft_office: asset.microsoftOffice,
  condition: asset.condition,
  operational_status: asset.operationalStatus,
  acquisition_cost: asset.acquisitionCost,
  date_acquired: asset.dateAcquired,
  date_audited: asset.dateAudited,
  audited_by: asset.auditedBy,
  remarks: asset.remarks,
});

export const mapTicketFromDB = (dbTicket: any) => ({
  id: dbTicket.id,
  ticketNumber: dbTicket.id.split('-')[0].toUpperCase(),
  requesterId: dbTicket.reported_by,
  officeId: dbTicket.department_id,
  categoryId: dbTicket.category,
  priority: dbTicket.priority,
  subject: dbTicket.title,
  description: dbTicket.description,
  status: dbTicket.status,
  assignedToId: dbTicket.assigned_to,
  createdAt: dbTicket.created_at,
  updatedAt: dbTicket.updated_at,
  recommendation: dbTicket.recommendation,
  comments: [] // We'll fetch comments separately if needed or join them
});

export const mapTicketToDB = (ticket: any) => ({
  title: ticket.subject,
  description: ticket.description,
  status: ticket.status || 'NEW',
  priority: ticket.priority,
  category: ticket.categoryId,
  reported_by: ticket.requesterId,
  assigned_to: ticket.assignedToId,
  department_id: ticket.officeId,
  recommendation: ticket.recommendation
});

export const mapUserFromDB = (dbProfile: any) => ({
  id: dbProfile.id,
  name: dbProfile.full_name,
  email: dbProfile.email,
  role: dbProfile.role === 'system_admin' ? 'Admin' : (dbProfile.role === 'ict_support' ? 'ICT Support' : 'Department User'),
  officeId: dbProfile.department_id,
});

export const mapOfficeFromDB = (dbDepartment: any) => ({
  id: dbDepartment.id,
  name: dbDepartment.name
});
