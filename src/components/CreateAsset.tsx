import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, Monitor, Database, UserCheck, HardDrive, ShieldCheck, FileCheck } from 'lucide-react';
import { Toast, ConfirmModal } from '../lib/toast';

export function CreateAsset({ onBack, assetToEdit }: { onBack: () => void, assetToEdit?: any }) {
  const { offices, createNewAsset, updateExistingAsset } = useAppContext();
  
  const [formData, setFormData] = useState({
    officeId: assetToEdit?.officeId || '',
    equipmentType: assetToEdit?.equipmentType || '',
    propertyNumber: assetToEdit?.propertyNumber || '',
    inventoryNumber: assetToEdit?.inventoryNumber || '',
    brand: assetToEdit?.brand || '',
    model: assetToEdit?.model || '',
    serialNumber: assetToEdit?.serialNumber || '',
    hostname: assetToEdit?.hostname || '',
    processor: assetToEdit?.processor || '',
    memory: assetToEdit?.memory || '',
    diskStorage: assetToEdit?.diskStorage || '',
    assignedTo: assetToEdit?.assignedTo || '',
    exactLocation: assetToEdit?.exactLocation || '',
    operatingSystem: assetToEdit?.operatingSystem || '',
    microsoftOffice: assetToEdit?.microsoftOffice || '',
    condition: assetToEdit?.condition || 'Excellent',
    operationalStatus: assetToEdit?.operationalStatus || 'Operational',
    acquisitionCost: assetToEdit?.acquisitionCost || '',
    dateAcquired: assetToEdit?.dateAcquired?.split('T')[0] || '',
    dateAudited: assetToEdit?.dateAudited?.split('T')[0] || '',
    auditedBy: assetToEdit?.auditedBy || '',
    remarks: assetToEdit?.remarks || ''
  });

  const isEditing = !!assetToEdit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await ConfirmModal.fire({
      text: `Are you sure you want to ${isEditing ? 'update' : 'register'} this equipment?`
    });
    
    if (result.isConfirmed) {
      if (isEditing) {
        updateExistingAsset(assetToEdit.id, formData);
        Toast.fire({
          icon: 'success',
          title: 'Equipment updated successfully'
        });
      } else {
        createNewAsset({
          ...formData,
          dateAcquired: formData.dateAcquired || new Date().toISOString()
        });
        Toast.fire({
          icon: 'success',
          title: 'Equipment registered successfully'
        });
      }
      onBack();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <header className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Equipment registry</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{isEditing ? 'Edit equipment record' : 'Register new equipment'}</h1>
            <p className="text-sm text-ink-muted mt-2 max-w-xl">
              {isEditing ? 'Update the details for this ICT asset.' : 'Add a new ICT asset to the municipal registry. The registry number will be generated automatically when the record is saved.'}
            </p>
          </div>
          <button onClick={onBack} className="flex items-center space-x-2 px-4 py-2 border border-border text-ink-muted rounded-lg hover:bg-bg text-xs font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to equipment</span>
          </button>
        </div>
      </header>

      {offices.length === 0 ? (
        <div className="bg-surface p-8 rounded-2xl border border-border text-center">
          <h2 className="text-lg font-bold text-ink">No offices available</h2>
          <p className="text-sm text-ink-muted mt-2">Add at least one active office before registering ICT equipment.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection
            title="Registry information"
            description="Identify the responsible office and official government inventory references."
            icon={<Database className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Office" required>
                <select name="officeId" required value={formData.officeId} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  <option value="" disabled>Select office</option>
                  {offices.map(office => (
                    <option key={office.id} value={office.id}>{office.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Equipment type" required>
                <select name="equipmentType" required value={formData.equipmentType} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  <option value="" disabled>Select equipment type</option>
                  <option value="Desktop Computer">Desktop Computer</option>
                  <option value="Laptop Computer">Laptop Computer</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="Network Switch">Network Switch</option>
                  <option value="Server">Server</option>
                  <option value="UPS">UPS</option>
                </select>
              </FormField>

              <FormField label="Property number">
                <input name="propertyNumber" value={formData.propertyNumber} onChange={handleChange} placeholder="Government property number" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>

              <FormField label="Inventory number">
                <input name="inventoryNumber" value={formData.inventoryNumber} onChange={handleChange} placeholder="Existing inventory number" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Serial number">
                  <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Manufacturer serial number" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </FormField>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Device information"
            description="Record the manufacturer, model and technical specifications of the equipment."
            icon={<Monitor className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Brand">
                <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Dell, HP, Lenovo" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Model">
                <input name="model" value={formData.model} onChange={handleChange} placeholder="OptiPlex 7090" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Hostname">
                <input name="hostname" value={formData.hostname} onChange={handleChange} placeholder="MIO-PC-01" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Processor">
                <input name="processor" value={formData.processor} onChange={handleChange} placeholder="Intel Core i5" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Memory">
                <input name="memory" value={formData.memory} onChange={handleChange} placeholder="16 GB" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Disk storage">
                  <input name="diskStorage" value={formData.diskStorage} onChange={handleChange} placeholder="512 GB SSD" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </FormField>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Assignment and location"
            description="Specify who is using the equipment and where it is physically located."
            icon={<UserCheck className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Assigned to">
                <input name="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="Employee name" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Exact location">
                <input name="exactLocation" value={formData.exactLocation} onChange={handleChange} placeholder="Second floor, workstation 1" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Software information"
            description="Record the primary operating system and productivity software installed."
            icon={<HardDrive className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Operating system">
                <input name="operatingSystem" value={formData.operatingSystem} onChange={handleChange} placeholder="Windows 11 Pro" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Microsoft Office">
                <input name="microsoftOffice" value={formData.microsoftOffice} onChange={handleChange} placeholder="Microsoft Office 2021" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Condition and status"
            description="Indicate the current physical condition and operational use of the equipment."
            icon={<ShieldCheck className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Condition">
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Damaged">Damaged</option>
                  <option value="For Repair">For Repair</option>
                  <option value="Unserviceable">Unserviceable</option>
                </select>
              </FormField>
              <FormField label="Operational status">
                <select name="operationalStatus" value={formData.operationalStatus} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Non-Operational">Non-Operational</option>
                  <option value="For Replacement">For Replacement</option>
                  <option value="Retired">Retired</option>
                  <option value="Lost / Missing">Lost / Missing</option>
                </select>
              </FormField>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Date acquired">
                  <input type="date" name="dateAcquired" value={formData.dateAcquired} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </FormField>
                <FormField label="Acquisition cost">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-ink-muted pointer-events-none">₱</span>
                    <input name="acquisitionCost" type="number" step="0.01" min="0" placeholder="0.00" value={formData.acquisitionCost} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                  </div>
                </FormField>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Audit information"
            description="Record the latest physical audit and any additional observations."
            icon={<FileCheck className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Date audited">
                <input type="date" name="dateAudited" value={formData.dateAudited} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <FormField label="Audited by">
                <input name="auditedBy" value={formData.auditedBy} onChange={handleChange} placeholder="Auditor name" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Remarks">
                  <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={4} placeholder="Additional notes, observations or equipment concerns" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                </FormField>
              </div>
            </div>
          </FormSection>

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface border border-border p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <p className="text-sm text-ink-muted font-medium">Review the information before saving the equipment record.</p>
              <div className="flex gap-3">
                <button type="button" onClick={onBack} className="px-5 py-2.5 border border-border text-ink-muted bg-surface rounded-lg text-xs font-bold hover:bg-bg transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors shadow-sm flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>{isEditing ? 'Update equipment' : 'Save equipment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function FormSection({ title, description, icon, children }: { title: string, description: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <section className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-start gap-4">
        <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-ink tracking-tight">{title}</h2>
          <p className="text-sm text-ink-muted mt-1">{description}</p>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function FormField({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-ink-muted">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
