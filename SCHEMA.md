# RoadSafe360 — Database Schema

## Firebase Configuration

```typescript
const firebaseConfig = {
  apiKey: 'AIzaSyBHkqVST88k1Ojdx_96QWbnjky3-xnwBF8',
  authDomain: 'roadsafe360-95d87.firebaseapp.com',
  projectId: 'roadsafe360-95d87',
  storageBucket: 'roadsafe360-95d87.firebasestorage.app',
  messagingSenderId: '64803316056',
  appId: '1:64803316056:web:5814a4f41f6b467123452d',
  measurementId: 'G-41EBGVFB9N',
};
```

Firebase Services: Auth, Firestore, Storage, Functions

---

## PostgreSQL / Firebase SQL Connect Schema

```sql
-- ============================================================
-- ROADSAFE360 DATABASE SCHEMA
-- Firebase SQL Connect (PostgreSQL-compatible)
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'police', 'driver', 'authority');
CREATE TYPE driver_status AS ENUM ('active', 'suspended', 'revoked', 'expired');
CREATE TYPE licence_status AS ENUM ('active', 'suspended', 'revoked', 'expired');
CREATE TYPE licence_class AS ENUM ('A', 'B', 'C', 'D', 'E', 'G');
CREATE TYPE vehicle_status AS ENUM ('active', 'suspended', 'stolen', 'decommissioned');
CREATE TYPE offence_status AS ENUM ('issued', 'paid', 'contested', 'resolved');
CREATE TYPE offence_severity AS ENUM ('minor', 'moderate', 'serious');
CREATE TYPE appeal_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'in_app');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

-- ============================================================
-- USERS (Firebase Auth linked table)
-- ============================================================

CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'driver',
    display_name TEXT,
    profile_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DRIVERS
-- ============================================================

CREATE TABLE drivers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    national_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    photo_url TEXT,
    blood_group TEXT,
    emergency_contact TEXT,
    points_balance INTEGER NOT NULL DEFAULT 20 CHECK (points_balance >= 0 AND points_balance <= 20),
    status driver_status NOT NULL DEFAULT 'active',
    risk_score NUMERIC(3,2) CHECK (risk_score >= 0 AND risk_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES users(uid) ON DELETE SET NULL
);

-- ============================================================
-- LICENCES
-- ============================================================

CREATE TABLE licences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    licence_number TEXT NOT NULL UNIQUE,
    licence_class licence_class NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status licence_status NOT NULL DEFAULT 'active',
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_categories TEXT[],
    endorsements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_expiry CHECK (expiry_date > issue_date)
);

-- ============================================================
-- VEHICLES
-- ============================================================

CREATE TABLE vehicles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_number TEXT NOT NULL UNIQUE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    colour TEXT NOT NULL,
    vehicle_class TEXT NOT NULL,
    chassis_number TEXT NOT NULL,
    engine_number TEXT NOT NULL,
    driver_id TEXT REFERENCES drivers(id) ON DELETE SET NULL,
    status vehicle_status NOT NULL DEFAULT 'active',
    insurance_expiry DATE,
    road_tax_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- POLICE OFFICERS
-- ============================================================

CREATE TABLE police_officers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    badge_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL,
    assigned_station TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES users(uid) ON DELETE SET NULL
);

-- ============================================================
-- OFFENCE CATEGORIES
-- ============================================================

CREATE TABLE offence_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    fine_amount NUMERIC(10,2) NOT NULL CHECK (fine_amount >= 0),
    demerit_points INTEGER NOT NULL CHECK (demerit_points >= 0),
    severity offence_severity NOT NULL DEFAULT 'moderate',
    court_required BOOLEAN NOT NULL DEFAULT FALSE,
    applicable_vehicle_classes TEXT[],
    repeat_offender_multiplier NUMERIC(3,2) DEFAULT 1.0 CHECK (repeat_offender_multiplier >= 1.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- OFFENCES
-- ============================================================

CREATE TABLE offences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    gps_location TEXT,
    notes TEXT,
    points_deducted INTEGER NOT NULL CHECK (points_deducted >= 0),
    fine_amount NUMERIC(10,2) NOT NULL CHECK (fine_amount >= 0),
    status offence_status NOT NULL DEFAULT 'issued',
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    offence_category_id TEXT NOT NULL REFERENCES offence_categories(id) ON DELETE RESTRICT,
    officer_id TEXT REFERENCES police_officers(id) ON DELETE SET NULL,
    media_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- APPEALS
-- ============================================================

CREATE TABLE appeals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reason TEXT NOT NULL,
    evidence_url TEXT,
    status appeal_status NOT NULL DEFAULT 'submitted',
    offence_record_id TEXT NOT NULL REFERENCES offences(id) ON DELETE CASCADE,
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    recipient_id TEXT NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SETTINGS
-- ============================================================

CREATE TABLE settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- REGIONS
-- ============================================================

CREATE TABLE regions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    officer_count INTEGER DEFAULT 0 CHECK (officer_count >= 0),
    driver_count INTEGER DEFAULT 0 CHECK (driver_count >= 0),
    offence_count INTEGER DEFAULT 0 CHECK (offence_count >= 0),
    stations INTEGER DEFAULT 0 CHECK (stations >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SUSPENSION HISTORY
-- ============================================================

CREATE TABLE suspension_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    reason TEXT NOT NULL,
    duration_months INTEGER NOT NULL CHECK (duration_months > 0),
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    suspension_count INTEGER NOT NULL CHECK (suspension_count > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date > start_date)
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    offence_record_id TEXT NOT NULL REFERENCES offences(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    status payment_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    actor_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    target_entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW driver_summary AS
SELECT 
    d.id AS driver_id,
    d.national_id,
    d.full_name,
    d.phone_number,
    d.email,
    d.points_balance,
    d.status AS driver_status,
    d.risk_score,
    l.licence_number,
    l.licence_class,
    l.expiry_date AS licence_expiry,
    l.status AS licence_status,
    COUNT(DISTINCT o.id) AS total_offences,
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'paid') AS paid_offences,
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'contested') AS contested_offences,
    SUM(o.fine_amount) AS total_fines,
    COUNT(DISTINCT v.id) AS vehicle_count
FROM drivers d
LEFT JOIN licences l ON d.id = l.driver_id AND l.status = 'active'
LEFT JOIN offences o ON d.id = o.driver_id
LEFT JOIN vehicles v ON d.id = v.driver_id AND v.status = 'active'
GROUP BY d.id, l.licence_number, l.licence_class, l.expiry_date, l.status;

CREATE VIEW offence_statistics AS
SELECT 
    oc.code,
    oc.name AS offence_name,
    oc.severity,
    COUNT(o.id) AS total_incidents,
    SUM(o.fine_amount) AS total_revenue,
    AVG(o.fine_amount) AS avg_fine,
    COUNT(o.id) FILTER (WHERE o.status = 'paid') AS paid_count,
    COUNT(o.id) FILTER (WHERE o.status = 'contested') AS contested_count,
    COUNT(o.id) FILTER (WHERE o.status = 'issued') AS pending_count
FROM offence_categories oc
LEFT JOIN offences o ON oc.id = o.offence_category_id
GROUP BY oc.id, oc.code, oc.name, oc.severity;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_drivers_national_id ON drivers(national_id);
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_phone ON drivers(phone_number);
CREATE INDEX idx_licences_driver_id ON licences(driver_id);
CREATE INDEX idx_licences_licence_number ON licences(licence_number);
CREATE INDEX idx_licences_expiry ON licences(expiry_date);
CREATE INDEX idx_licences_status ON licences(status);
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_offences_driver_id ON offences(driver_id);
CREATE INDEX idx_offences_officer_id ON offences(officer_id);
CREATE INDEX idx_offences_category_id ON offences(offence_category_id);
CREATE INDEX idx_offences_timestamp ON offences(timestamp);
CREATE INDEX idx_offences_status ON offences(status);
CREATE INDEX idx_appeals_offence_record ON appeals(offence_record_id);
CREATE INDEX idx_appeals_driver_id ON appeals(driver_id);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_payments_driver_id ON payments(driver_id);
CREATE INDEX idx_payments_offence_id ON payments(offence_record_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_suspension_driver_id ON suspension_history(driver_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action_type);
CREATE INDEX idx_offences_driver_status ON offences(driver_id, status);
CREATE INDEX idx_offences_timestamp_status ON offences(timestamp, status);
CREATE INDEX idx_offences_category_status ON offences(offence_category_id, status);
CREATE INDEX idx_licences_driver_status ON licences(driver_id, status);
CREATE INDEX idx_vehicles_driver_status ON vehicles(driver_id, status);
CREATE INDEX idx_appeals_driver_status ON appeals(driver_id, status);
CREATE INDEX idx_payments_driver_status ON payments(driver_id, status);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_licences_updated_at BEFORE UPDATE ON licences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offences_updated_at BEFORE UPDATE ON offences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appeals_updated_at BEFORE UPDATE ON appeals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suspension_updated_at BEFORE UPDATE ON suspension_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_risk_score(p_driver_id TEXT)
RETURNS NUMERIC(3,2) AS $$
DECLARE
    v_offence_count INTEGER;
    v_points_used INTEGER;
    v_recent_offences INTEGER;
    v_risk_score NUMERIC(3,2);
BEGIN
    SELECT COUNT(*) INTO v_offence_count
    FROM offences WHERE driver_id = p_driver_id;
    SELECT COALESCE(SUM(points_deducted), 0) INTO v_points_used
    FROM offences WHERE driver_id = p_driver_id;
    SELECT COUNT(*) INTO v_recent_offences
    FROM offences WHERE driver_id = p_driver_id
        AND timestamp > NOW() - INTERVAL '6 months';
    v_risk_score := LEAST(1.0, (v_offence_count * 0.05) + (v_points_used * 0.03) + (v_recent_offences * 0.08));
    RETURN ROUND(v_risk_score, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_offence(
    p_driver_id TEXT, p_points_deducted INTEGER, p_category_id TEXT, p_officer_id TEXT DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
    v_current_points INTEGER;
    v_licence_id TEXT;
    v_suspension_count INTEGER;
    v_result TEXT;
BEGIN
    SELECT points_balance INTO v_current_points FROM drivers WHERE id = p_driver_id FOR UPDATE;
    SELECT id INTO v_licence_id FROM licences WHERE driver_id = p_driver_id AND status = 'active' LIMIT 1;
    UPDATE drivers SET points_balance = points_balance - p_points_deducted WHERE id = p_driver_id;
    IF v_current_points - p_points_deducted <= 12 THEN
        SELECT COALESCE(COUNT(*) + 1, 1) INTO v_suspension_count
        FROM suspension_history WHERE driver_id = p_driver_id;
        INSERT INTO suspension_history (start_date, duration_months, reason, driver_id, suspension_count)
        VALUES (CURRENT_DATE, CASE WHEN v_suspension_count = 1 THEN 3 WHEN v_suspension_count = 2 THEN 6 ELSE 12 END,
            'Exceeded demerit points threshold', p_driver_id, v_suspension_count);
        IF v_licence_id IS NOT NULL THEN UPDATE licences SET status = 'suspended' WHERE id = v_licence_id; END IF;
        UPDATE drivers SET status = 'suspended' WHERE id = p_driver_id;
        v_result := 'suspended';
    ELSE
        v_result := 'points_deducted';
    END IF;
    INSERT INTO offences (driver_id, points_deducted, fine_amount, offence_category_id, officer_id)
    VALUES (p_driver_id, p_points_deducted, (SELECT fine_amount FROM offence_categories WHERE id = p_category_id), p_category_id, p_officer_id);
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_driver_full_summary(p_driver_id TEXT)
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
    SELECT json_build_object(
        'driver', json_build_object('id', d.id, 'full_name', d.full_name, 'national_id', d.national_id,
            'phone', d.phone_number, 'email', d.email, 'points', d.points_balance, 'status', d.status, 'risk_score', d.risk_score),
        'licence', (SELECT json_build_object('number', l.licence_number, 'class', l.licence_class, 'expiry', l.expiry_date, 'status', l.status)
            FROM licences l WHERE l.driver_id = d.id AND l.status = 'active' LIMIT 1),
        'vehicles', (SELECT COALESCE(json_agg(json_build_object('registration', v.registration_number, 'make', v.make, 'model', v.model, 'status', v.status)), '[]'::json)
            FROM vehicles v WHERE v.driver_id = d.id AND v.status = 'active'),
        'offences', (SELECT COALESCE(json_agg(json_build_object('id', o.id, 'date', o.timestamp, 'category', oc.name,
            'fine', o.fine_amount, 'points', o.points_deducted, 'status', o.status) ORDER BY o.timestamp DESC), '[]'::json)
            FROM offences o JOIN offence_categories oc ON o.offence_category_id = oc.id WHERE o.driver_id = d.id LIMIT 20),
        'stats', json_build_object('total_offences', (SELECT COUNT(*) FROM offences WHERE driver_id = d.id),
            'total_paid', (SELECT COUNT(*) FROM offences WHERE driver_id = d.id AND status = 'paid'),
            'total_fines', (SELECT COALESCE(SUM(fine_amount), 0) FROM offences WHERE driver_id = d.id),
            'pending_appeals', (SELECT COUNT(*) FROM appeals WHERE driver_id = d.id AND status IN ('submitted', 'under_review')))
    ) INTO result FROM drivers d WHERE d.id = p_driver_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE licences ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offence_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE offences ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspension_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================

ALTER TABLE users ADD CONSTRAINT fk_user_driver FOREIGN KEY (profile_id) REFERENCES drivers(id) ON DELETE SET NULL;
ALTER TABLE offences ADD CONSTRAINT fk_offence_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE RESTRICT;
ALTER TABLE offences ADD CONSTRAINT fk_offence_category FOREIGN KEY (offence_category_id) REFERENCES offence_categories(id) ON DELETE RESTRICT;
ALTER TABLE payments ADD CONSTRAINT fk_payment_offence FOREIGN KEY (offence_record_id) REFERENCES offences(id) ON DELETE CASCADE;
```

---

## Seeded Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| Zaahid Abdulmalik | zaahid@roadsafe360.go.ke | Admin123! | admin |
| Khalid Salad | khalid@roadsafe360.go.ke | Auth123! | authority |
| Aisha Abubakar | aisha@roadsafe360.go.ke | Officer123! | police |
| Naila Amour | naila@roadsafe360.go.ke | Officer123! | police |
| Rania Bahlewa | rania@roadsafe360.go.ke | Officer123! | police |
| Zeitun Hussein | zeitun@roadsafe360.go.ke | Officer123! | police |
| Reyhan Fuad | reyhan@roadsafe360.go.ke | Officer123! | police |
| Turq Mahamud | turq@roadsafe360.go.ke | Officer123! | police |
| Fenz Abdisalam | fenz@roadsafe360.go.ke | Officer123! | police |
| UmulKheir Aden | umulkheir@roadsafe360.go.ke | Officer123! | police |
| Mohammed Karshe | mohammed@roadsafe360.go.ke | Officer123! | police |
| Faizaan Mohammed | faizaan@roadsafe360.go.ke | Officer123! | police |
| Adnan Ali | adnan@roadsafe360.go.ke | Officer123! | police |
| Abdulhameed Saleh | abdulhameed@roadsafe360.go.ke | Officer123! | police |

---

## Police Officers

| Badge | Name | Region |
|---|---|---|
| POL-001 | Aisha Abubakar | Nairobi |
| POL-002 | Naila Amour | Mombasa |
| POL-003 | Rania Bahlewa | Kisumu |
| POL-004 | Zeitun Hussein | Nakuru |
| POL-005 | Reyhan Fuad | Eldoret |
| POL-006 | Turq Mahamud | Thika |
| POL-007 | Fenz Abdisalam | Malindi |
| POL-008 | UmulKheir Aden | Garissa |
| POL-009 | Mohammed Karshe | Meru |
| POL-010 | Faizaan Mohammed | Nyeri |
| POL-011 | Adnan Ali | Kitale |
| POL-012 | Abdulhameed Saleh | Nairobi |
