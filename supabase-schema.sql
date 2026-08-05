-- Supabase PostgreSQL Schema for LGU ICT Ticketing & Asset Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & USERS
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Department User', 'Admin', 'ICT Support'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Maps to auth.users in Supabase
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    office_id UUID REFERENCES offices(id) ON DELETE SET NULL,
    contact_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ASSETS
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    office_id UUID REFERENCES offices(id) ON DELETE RESTRICT,
    equipment_type VARCHAR(100) NOT NULL,
    property_number VARCHAR(100) UNIQUE,
    inventory_number VARCHAR(100) UNIQUE,
    serial_number VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    hostname VARCHAR(100),
    processor VARCHAR(100),
    memory VARCHAR(100),
    disk_storage VARCHAR(100),
    operating_system VARCHAR(100),
    microsoft_office VARCHAR(100),
    other_software TEXT,
    license_status VARCHAR(100),
    assigned_to VARCHAR(255),
    position VARCHAR(100),
    building VARCHAR(100),
    floor VARCHAR(50),
    room VARCHAR(100),
    exact_location VARCHAR(255),
    condition VARCHAR(50) NOT NULL, -- Excellent, Good, Fair, Poor, Damaged, For Repair, Unserviceable
    operational_status VARCHAR(50) NOT NULL, -- Operational, Under Maintenance, Non-Operational, For Replacement, Retired, Lost/Missing
    acquisition_cost DECIMAL(12, 2),
    date_acquired DATE,
    warranty_expiration DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE asset_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'REPAIR', 'AUDIT', 'ASSIGNMENT', 'ACQUISITION', 'STATUS_CHANGE'
    description TEXT,
    performed_by UUID REFERENCES users(id),
    ticket_id UUID, -- References ticket if applicable
    previous_condition VARCHAR(50),
    new_condition VARCHAR(50),
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE asset_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    audited_by UUID REFERENCES users(id),
    audit_date DATE NOT NULL,
    audit_result VARCHAR(50) NOT NULL, -- Verified, Not Found, Transferred, Damaged, For Verification
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TICKETS
CREATE TABLE ticket_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE, -- Hardware, Software, Network, etc.
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., ICT-2026-00001
    requester_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    office_id UUID REFERENCES offices(id) ON DELETE RESTRICT,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    category_id UUID REFERENCES ticket_categories(id) ON DELETE RESTRICT,
    priority VARCHAR(50) NOT NULL, -- Critical, High, Medium, Low
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, ASSIGNED, IN PROGRESS, PENDING, RESOLVED, CLOSED
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL, -- Must be an ICT Support role
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    diagnosis TEXT,
    action_taken TEXT,
    parts_used TEXT,
    technical_notes TEXT,
    pending_reason VARCHAR(100),
    pending_remarks TEXT,
    expected_resume_date DATE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    department_confirmation BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ticket_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ticket_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    upload_type VARCHAR(50), -- 'INITIAL', 'BEFORE_REPAIR', 'AFTER_REPAIR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Examples
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Department users can only see their own office tickets
CREATE POLICY department_ticket_select ON tickets
    FOR SELECT USING (
        office_id = (SELECT office_id FROM users WHERE id = auth.uid())
    );

-- Admins and ICT Support can see all tickets
CREATE POLICY admin_support_ticket_select ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('Admin', 'ICT Support')
        )
    );
