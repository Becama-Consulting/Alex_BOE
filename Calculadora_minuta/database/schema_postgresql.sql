-- =============================================================================
-- NOTARIAL INVOICE CALCULATOR — POSTGRESQL DDL
-- Covers: Family, Commercial, Real Estate, Successions, Powers,
--         Policies, Legitimations, Testimonials, Second Copies
-- =============================================================================

-- =============================================================================
-- PRE-CLEANUP (uncomment if you need to re-run the script)
-- Drops everything and starts fresh:
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- =============================================================================

BEGIN;

-- =============================================================================
-- ENUM TYPES (must be declared before use)
-- Using DO blocks to avoid errors if the type already exists
-- =============================================================================

DO $$ BEGIN CREATE TYPE field_data_type AS ENUM ('integer','decimal','currency','radio','select',
    'checkbox','text','date','integer_range');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE fee_type AS ENUM ('without_amount','with_amount','deed',
    'fixed','policy_scale');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE invoice_line_type AS ENUM (
    'fee_without_amount','fee_with_amount','matrix_page',
    'simple_copy','authorized_copy','electronic_copy',
    'testimony','proceeding','legitimation','notary_travel',
    'courier','commercial_registry','apostille','electronic_protocol',
    'processing','custody','paper_expense','other_expense',
    'subtotal','vat','withholding','total');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE copy_type      AS ENUM ('simple','authorized','electronic');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE invoice_type   AS ENUM ('simulation','quote','invoice');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE invoice_status AS ENUM ('draft','issued','sent',
    'accepted','billed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE user_role      AS ENUM ('admin','notary','official','assistant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE client_type    AS ENUM ('individual','company');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE constant_type  AS ENUM ('price','percentage','factor','integer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE maturity_type  AS ENUM ('short','long');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE email_status   AS ENUM ('pending','sent','error');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE apostille_type AS ENUM ('urgent','standard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- HELPER FUNCTION: automatically update updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =============================================================================
-- BLOCK 1: SERVICE CATALOGUE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Calculator modules (9 notarial areas)
-- -----------------------------------------------------------------------------
CREATE TABLE modules (
    id          SMALLINT            NOT NULL GENERATED ALWAYS AS IDENTITY,
    code        VARCHAR(30)         NOT NULL,
    name        VARCHAR(100)        NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    sort_order  SMALLINT            NOT NULL DEFAULT 0,
    active      BOOLEAN             NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_module_code UNIQUE (code)
);

INSERT INTO modules (code, name, sort_order) VALUES
    ('familia',           'Familia',                  1),
    ('mercantil',         'Mercantil',                2),
    ('inmobiliario',      'Inmobiliario',             3),
    ('sucesiones',        'Sucesiones',               4),
    ('poderes',           'Poderes',                  5),
    ('polizas',           'Pólizas',                  6),
    ('legitimaciones',    'Legitimaciones',           7),
    ('testimonios',       'Testimonios',              8),
    ('segundas_copias',   'Segundas Copias',          9);

-- -----------------------------------------------------------------------------
-- Act types within each module
-- -----------------------------------------------------------------------------
CREATE TABLE act_types (
    id                          SMALLINT            NOT NULL GENERATED ALWAYS AS IDENTITY,
    module_id                   SMALLINT            NOT NULL,
    code                        VARCHAR(10)         NOT NULL,
    name                        VARCHAR(200)        NOT NULL,
    description                 TEXT,
    matrix_pages                SMALLINT,
    matrix_pages_min            SMALLINT,
    matrix_pages_max            SMALLINT            DEFAULT 999,
    proceedings                 SMALLINT            DEFAULT 0,
    simple_copies_default       SMALLINT            DEFAULT 1,
    auth_copies_default         SMALLINT            DEFAULT 1,
    electronic_copies_default   SMALLINT            DEFAULT 0,
    fee_type                    fee_type            NOT NULL DEFAULT 'without_amount',
    fixed_fee                   NUMERIC(10,4),
    fee_factor                  NUMERIC(5,4)        DEFAULT 1.0000,
    discount_pct                NUMERIC(5,2)        DEFAULT 0.00,
    applies_vat                 BOOLEAN             NOT NULL DEFAULT TRUE,
    applies_withholding         BOOLEAN             NOT NULL DEFAULT FALSE,
    active                      BOOLEAN             NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_act_type UNIQUE (module_id, code),
    CONSTRAINT fk_act_type_module FOREIGN KEY (module_id) REFERENCES modules(id)
);

-- Family
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'PDR','Pareja de Hecho Registrada',       5, 5, 3, 1, 1, 1, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'DPE','Disolución de Pareja Estable',      4, 4, 3, 1, 1, 1, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'MAT','Matrimonio',                        5, 5, 5, 2, 1, 1, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'FEM','Formalización Expediente Matrimonial', 15, 15, 3, 1, 1, 1, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'DIV','Divorcio',                          5, 5, 5, 2, 3, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CAA','Capitulaciones Antes del Matrimonio', 6, 6, 6, 2, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CAD','Capitulaciones Después del Matrimonio', 5, 5, 5, 2, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'EMA','Emancipación',                      4, 4, 5, 1, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'NDT','Nombramiento de Tutor',             3, 3, 5, 1, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'AUC','Autocuratela',                      3, 3, 5, 1, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CDA','Consentimiento Divorciado Ascendientes', 8, 8, 5, 1, 2, 0, 'without_amount' FROM modules WHERE code='familia';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CMP','Constitución de Patrimonio Protegido', 3, 3, 2, 1, 0, 'with_amount' FROM modules WHERE code='familia';

-- Commercial
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CS', 'Constitución de Sociedad',           18, 18, 18, 1, 1, 1, 1, 'with_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'ACS','Ampliación de Capital Social',        10,  8, 25, 1, 1, 1, 1, 'with_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'RCS','Reducción de Capital Social',         10,  8, 25, 1, 1, 1, 1, 'with_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'DL', 'Disolución y Liquidación',            10,  8, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CPS','Comprobante de Participaciones Sociales', 8, 8, 25, 1, 1, 1, 0, 'with_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'ATR','Acta de Tribunal Real',                4,  4, 25, 1, 1, 1, 0, 'deed'        FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CN', 'Cese y Nombramiento',                 12, 12, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'TDS','Traslado de Domicilio Social',        14, 14, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'CDS','Cambio de Domicilio Social',          15, 15, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'EP', 'Elevación a Público',                  8,  8, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'ME', 'Modificación Estatutaria',              6,  6, 25, 1, 1, 1, 0, 'without_amount' FROM modules WHERE code='mercantil';
INSERT INTO act_types (module_id, code, name, matrix_pages, matrix_pages_min, matrix_pages_max, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type)
SELECT id, 'PJ', 'Presencia en Junta',                   8,  8, 25, 1, 1, 1, 0, 'deed'        FROM modules WHERE code='mercantil';

-- Real Estate
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'COMP','Compraventa',           NULL, 3, 3, 1, 1, 'with_amount', 28.75 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'PRES','Préstamo Hipotecario',  NULL, 3, 1, 1, 1, 'with_amount', 46.56 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'NOSU','Novación/Subrogación',  NULL, 3, 1, 1, 1, 'with_amount', 52.50 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'ARRA','Arras',                 NULL, 3, 2, 1, 1, 'with_amount',  5.00 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'EDCO','Extinción de Condominio', NULL, 3, 3, 1, 1, 'with_amount', 5.00 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'OPCO','Opción de Compra',      NULL, 3, 2, 1, 1, 'with_amount',  5.00 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'OBNU','Obra Nueva',            NULL, 3, 1, 1, 1, 'with_amount',  5.00 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, discount_pct)
SELECT id,'DIHO','División Horizontal',   NULL, 3, 1, 1, 1, 'with_amount',  5.00 FROM modules WHERE code='inmobiliario';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fixed_fee, discount_pct)
SELECT id,'AFSA','Acta de Fijación de Saldo', NULL, 3, 1, 1, 0, 'fixed', 36.06, 0.00 FROM modules WHERE code='inmobiliario';

-- Successions
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'TE', 'Testamento',                          3, 0, 1, 0, 0, 'without_amount', 1.0000 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'DH', 'Declaración de Herederos',            8, 0, 1, 1, 0, 'deed',           1.0000 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'RH', 'Renuncia de Herencia',                3, 0, 1, 1, 0, 'without_amount', 1.0000 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'UV', 'Últimas Voluntades / Testamento Vital', 4, 0, 1, 1, 0, 'without_amount', 1.0000 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'ACS','Acta Certificado Sucesorio Europeo',  11, 0, 1, 1, 0, 'deed',           1.0000 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'ELD','Entrega de Legítima Dineraria',       11, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'ELB','Entrega de Legítima de Bienes',       11, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'VDH','Venta de Derechos Hereditarios',      11, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'DO', 'Donación',                          NULL, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'AH', 'Acta de Herencia',                  NULL, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, proceedings, simple_copies_default, auth_copies_default, electronic_copies_default, fee_type, fee_factor)
SELECT id,'HE', 'Herencia',                          NULL, 0, 1, 1, 0, 'with_amount',    0.9500 FROM modules WHERE code='sucesiones';

-- Powers of Attorney
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'P','Personalizado',           6, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'G','General',                 7, 2, 1, 'without_amount', FALSE FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'E','Especial',                6, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'M','Mercantil General',       9, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'S','Preventivo Simple',       8, 2, 1, 'without_amount', FALSE FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'R','Preventivo Recíproco',    8, 3, 1, 'without_amount', FALSE FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'L','Pleitos',                 8, 1, 1, 'without_amount', FALSE FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'T','Sustitución',             4, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'A','Subapoderamiento',        4, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'V','Revocación',              7, 2, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'N','Renuncia',                7, 2, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';
INSERT INTO act_types (module_id, code, name, matrix_pages_min, simple_copies_default, auth_copies_default, fee_type, applies_withholding)
SELECT id,'F','Ratificación',            4, 1, 1, 'without_amount', TRUE  FROM modules WHERE code='poderes';

-- Policies
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'POL_SC_C','Póliza sin garantes, venc. ≤6 meses', 'policy_scale', TRUE FROM modules WHERE code='polizas';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'POL_CC_C','Póliza con garantes, venc. ≤6 meses', 'policy_scale', TRUE FROM modules WHERE code='polizas';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'POL_SC_L','Póliza sin garantes, venc. >6 meses', 'policy_scale', TRUE FROM modules WHERE code='polizas';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'POL_CC_L','Póliza con garantes, venc. >6 meses', 'policy_scale', TRUE FROM modules WHERE code='polizas';

-- Legitimations, Testimonials, Second Copies
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'LEGI','Legitimación de Firma',     'fixed', TRUE FROM modules WHERE code='legitimaciones';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'TEST','Testimonio de Documento',   'fixed', TRUE FROM modules WHERE code='testimonios';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'SC_S','Segunda Copia Simple',      'fixed', TRUE FROM modules WHERE code='segundas_copias';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'SC_A','Segunda Copia Autorizada',  'fixed', TRUE FROM modules WHERE code='segundas_copias';
INSERT INTO act_types (module_id, code, name, fee_type, applies_withholding)
SELECT id,'SC_E','Segunda Copia Electrónica', 'fixed', TRUE FROM modules WHERE code='segundas_copias';

-- -----------------------------------------------------------------------------
-- Form fields by act type
-- -----------------------------------------------------------------------------
CREATE TABLE form_fields (
    id              INTEGER             NOT NULL GENERATED ALWAYS AS IDENTITY,
    act_type_id     SMALLINT            NOT NULL,
    code            VARCHAR(60)         NOT NULL,
    label           VARCHAR(200)        NOT NULL,
    data_type       field_data_type     NOT NULL DEFAULT 'integer',
    default_value   VARCHAR(200),
    min_value       NUMERIC(15,2),
    max_value       NUMERIC(15,2),
    required        BOOLEAN             NOT NULL DEFAULT TRUE,
    read_only       BOOLEAN             NOT NULL DEFAULT FALSE,
    is_testimony    BOOLEAN             NOT NULL DEFAULT FALSE,
    is_amount       BOOLEAN             NOT NULL DEFAULT FALSE,
    tooltip         TEXT,
    sort_order      SMALLINT            NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_field_act_type FOREIGN KEY (act_type_id) REFERENCES act_types(id)
);

CREATE INDEX idx_field_act_type ON form_fields(act_type_id);

-- Options for radio/select fields
CREATE TABLE field_options (
    id          INTEGER      NOT NULL GENERATED ALWAYS AS IDENTITY,
    field_id    INTEGER      NOT NULL,
    value       VARCHAR(50)  NOT NULL,
    label       VARCHAR(200) NOT NULL,
    sort_order  SMALLINT     NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_option_field FOREIGN KEY (field_id) REFERENCES form_fields(id)
);

CREATE INDEX idx_option_field ON field_options(field_id);

-- Attachable documents by act type
CREATE TABLE attachable_documents (
    id              INTEGER      NOT NULL GENERATED ALWAYS AS IDENTITY,
    act_type_id     SMALLINT     NOT NULL,
    code            VARCHAR(60)  NOT NULL,
    name            VARCHAR(200) NOT NULL,
    default_pages   SMALLINT     NOT NULL DEFAULT 1,
    required        BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order      SMALLINT     NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_doc_act_type FOREIGN KEY (act_type_id) REFERENCES act_types(id)
);

CREATE INDEX idx_doc_act_type ON attachable_documents(act_type_id);

-- PDR Documents
INSERT INTO attachable_documents (act_type_id, code, name, default_pages, required, sort_order)
SELECT id,'libro_familia',      'Libro de Familia',      2, FALSE, 1 FROM act_types WHERE code='PDR';
INSERT INTO attachable_documents (act_type_id, code, name, default_pages, required, sort_order)
SELECT id,'sentencia_divorcio', 'Sentencia de Divorcio', 2, FALSE, 2 FROM act_types WHERE code='PDR';
INSERT INTO attachable_documents (act_type_id, code, name, default_pages, required, sort_order)
SELECT id,'convivencia_previa', 'Convivencia Previa',    2, FALSE, 3 FROM act_types WHERE code='PDR';
INSERT INTO attachable_documents (act_type_id, code, name, default_pages, required, sort_order)
SELECT id,'contrato_alquiler',  'Contrato de Alquiler',  4, FALSE, 4 FROM act_types WHERE code='PDR';

-- =============================================================================
-- BLOCK 2: FEE SCALES
-- =============================================================================

CREATE TABLE fee_scales (
    id          SMALLINT     NOT NULL GENERATED ALWAYS AS IDENTITY,
    code        VARCHAR(50)  NOT NULL,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_scale_code UNIQUE (code)
);

INSERT INTO fee_scales (code, name) VALUES
    ('general',          'Escala General (actos con cuantía)'),
    ('polizas_sg_corto', 'Pólizas sin garantes, vencimiento ≤6 meses'),
    ('polizas_cg_corto', 'Pólizas con garantes, vencimiento ≤6 meses'),
    ('polizas_sg_largo', 'Pólizas sin garantes, vencimiento >6 meses'),
    ('polizas_cg_largo', 'Pólizas con garantes, vencimiento >6 meses');

CREATE TABLE fee_brackets (
    id              SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    scale_id        SMALLINT        NOT NULL,
    lower_limit     NUMERIC(15,2)   NOT NULL DEFAULT 0.00,
    upper_limit     NUMERIC(15,2),
    fixed_amount    NUMERIC(12,4)   NOT NULL DEFAULT 0.0000,
    marginal_rate   NUMERIC(10,8)   NOT NULL DEFAULT 0.00000000,
    sort_order      SMALLINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_bracket_scale FOREIGN KEY (scale_id) REFERENCES fee_scales(id)
);

CREATE INDEX idx_bracket_scale ON fee_brackets(scale_id);

-- General scale
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,      0.00,   6010.12,   90.1500, 0.00000000, 1 FROM fee_scales WHERE code='general';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,   6010.13,  30050.61,   90.1500, 0.00450000, 2 FROM fee_scales WHERE code='general';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,  30050.62,  60101.21,  198.3300, 0.00150000, 3 FROM fee_scales WHERE code='general';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,  60101.22, 150253.03,  243.4100, 0.00100000, 4 FROM fee_scales WHERE code='general';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 150253.04, 601012.10,  333.5600, 0.00050000, 5 FROM fee_scales WHERE code='general';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 601012.11,       NULL, 558.9400, 0.00030000, 6 FROM fee_scales WHERE code='general';

-- Policies without guarantors, maturity <= 6 months
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,      0.00, 240404.84,    0.0000, 0.00200000, 1 FROM fee_scales WHERE code='polizas_sg_corto';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 240404.85, 300506.05,  480.8097, 0.00100000, 2 FROM fee_scales WHERE code='polizas_sg_corto';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 300506.06,       NULL, 541.3097, 0.00025000, 3 FROM fee_scales WHERE code='polizas_sg_corto';

-- Policies with guarantors, maturity <= 6 months
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,      0.00,  90151.81,    0.0000, 0.00300000, 1 FROM fee_scales WHERE code='polizas_cg_corto';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,  90151.82, 150253.03,  270.4555, 0.00200000, 2 FROM fee_scales WHERE code='polizas_cg_corto';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 150253.04, 300506.05,  390.9594, 0.00100000, 3 FROM fee_scales WHERE code='polizas_cg_corto';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 300506.06,       NULL, 541.4594, 0.00025000, 4 FROM fee_scales WHERE code='polizas_cg_corto';

-- Policies without guarantors, maturity > 6 months (same brackets as polizas_cg_corto)
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT dest.id, src.lower_limit, src.upper_limit, src.fixed_amount, src.marginal_rate, src.sort_order
FROM fee_brackets src
JOIN fee_scales eh_src  ON src.scale_id = eh_src.id  AND eh_src.code = 'polizas_cg_corto'
JOIN fee_scales dest    ON dest.code = 'polizas_sg_largo';

-- Policies with guarantors, maturity > 6 months
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,      0.00,  48080.97,    0.0000, 0.00450000, 1 FROM fee_scales WHERE code='polizas_cg_largo';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,  48080.98,  90151.81,  216.3644, 0.00150000, 2 FROM fee_scales WHERE code='polizas_cg_largo';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id,  90151.82, 150253.03,  279.6421, 0.00300000, 3 FROM fee_scales WHERE code='polizas_cg_largo';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 150253.04, 300506.05,  460.0978, 0.00100000, 4 FROM fee_scales WHERE code='polizas_cg_largo';
INSERT INTO fee_brackets (scale_id, lower_limit, upper_limit, fixed_amount, marginal_rate, sort_order)
SELECT id, 300506.06,       NULL, 610.5978, 0.00025000, 5 FROM fee_scales WHERE code='polizas_cg_largo';

-- System constants
CREATE TABLE constants (
    id              SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    code            VARCHAR(60)     NOT NULL,
    name            VARCHAR(200)    NOT NULL,
    value           NUMERIC(15,6)   NOT NULL,
    type            constant_type   NOT NULL DEFAULT 'price',
    description     TEXT,
    effective_from  DATE,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_constant_code UNIQUE (code)
);

INSERT INTO constants (code, name, value, type, description) VALUES
    ('precio_sin_cuantia',      'Honorarios acto sin cuantía',              30.050000, 'price',      'Honorario base para documentos sin cuantía'),
    ('acta_sin_cuantia',        'Honorarios acta sin cuantía',              36.060000, 'price',      'Honorario acta (DH, ATR, ACS, etc.)'),
    ('precio_folio_matriz',     'Precio por folio de matriz (>4 folios)',    6.010121, 'price',      'Aplicable a partir del 5º folio'),
    ('precio_copia_simple',     'Precio copia simple por folio',            0.601012, 'price',      '100/166.386'),
    ('precio_copia_aut_1_11',   'Precio copia autorizada folios 1-11',      3.005060, 'price',      '500/166.386'),
    ('precio_copia_aut_12_plus','Precio copia autorizada folios ≥12',       1.502530, 'price',      '250/166.386'),
    ('precio_testimonio_1',     'Precio testimonio 1 folio',                3.005060, 'price',      '500/166.386'),
    ('precio_testimonio_add',   'Precio testimonio por folio adicional',    0.601012, 'price',      '100/166.386'),
    ('precio_legitimacion_1',   'Precio legitimación 1 firma',              6.010120, 'price',      '1000/166.386'),
    ('precio_legitimacion_add', 'Precio legitimación por firma adicional',  3.005060, 'price',      '500/166.386'),
    ('coste_diligencia',        'Coste por diligencia',                     3.010000, 'price',      ''),
    ('coste_papel',             'Coste papel por folio',                    0.150000, 'price',      'Papel timbrado'),
    ('iva',                     'IVA',                                     21.000000, 'percentage',  ''),
    ('irpf',                    'IRPF',                                    15.000000, 'percentage',  'Solo aplica si titular es empresa'),
    ('protocolo_electronico',   'Protocolo electrónico',                    9.030000, 'price',      ''),
    ('mensajeria',              'Gastos de mensajería',                    18.000000, 'price',      ''),
    ('salida_notario',          'Desplazamiento del notario (por hora)',    18.030000, 'price',      ''),
    ('apostilla_urgente',       'Apostilla urgente',                       47.000000, 'price',      ''),
    ('apostilla_normal',        'Apostilla normal',                        39.000000, 'price',      ''),
    ('registro_mercantil',      'Consulta Registro Mercantil',             12.000000, 'price',      ''),
    ('tramite_mercantil',       'Trámite mercantil por poderdante',       150.000000, 'price',      ''),
    ('importe_por_cargos',      'Importe por cargos (por apoderado)',      24.040000, 'price',      ''),
    ('gestion_poder_mercantil', 'Gestión poder mercantil',                 75.000000, 'price',      ''),
    ('poliza_honor_minimo',     'Honorario mínimo en pólizas',            12.020000, 'price',      ''),
    ('factor_conversion',       'Factor conversión pesetas→euros',        166.386000, 'factor',      '1/166.386 = constante arancelaria'),
    ('custodia_copia_por_anno', 'Custodia segunda copia por año',          0.601012, 'price',      'Solo aplica si antigüedad > 5 años'),
    ('suplido_papel_copia_aut', 'Suplido papel copia autorizada/folio',    0.150000, 'price',      '');

-- =============================================================================
-- BLOCK 3: USERS AND CLIENTS
-- =============================================================================

CREATE TABLE users (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(150),
    email           VARCHAR(200)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    role            user_role       NOT NULL DEFAULT 'assistant',
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT uq_user_email UNIQUE (email)
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TABLE clients (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    type            client_type     NOT NULL DEFAULT 'individual',
    first_name      VARCHAR(100),
    last_name       VARCHAR(150),
    company_name    VARCHAR(200),
    tax_id          VARCHAR(20),
    email           VARCHAR(200),
    phone           VARCHAR(20),
    address         VARCHAR(300),
    city            VARCHAR(100),
    postal_code     VARCHAR(10),
    province        VARCHAR(100),
    country         VARCHAR(50)     NOT NULL DEFAULT 'España',
    is_company      BOOLEAN         NOT NULL DEFAULT FALSE,
    notes           TEXT,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE INDEX idx_client_tax_id ON clients(tax_id);
CREATE INDEX idx_client_email  ON clients(email);

CREATE TRIGGER trg_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================================
-- BLOCK 4: INVOICES AND QUOTES
-- =============================================================================

CREATE TABLE invoices (
    id                  INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    reference           VARCHAR(30)     UNIQUE,
    type                invoice_type    NOT NULL DEFAULT 'simulation',
    status              invoice_status  NOT NULL DEFAULT 'draft',
    user_id             INTEGER,
    client_id           INTEGER,
    act_type_id         SMALLINT        NOT NULL,
    holder_name         VARCHAR(300),
    holder_is_company   BOOLEAN         NOT NULL DEFAULT FALSE,
    act_description     TEXT,
    subtotal            NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    vat_pct             NUMERIC(5,2)    NOT NULL DEFAULT 21.00,
    vat_amount          NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    withholding_pct     NUMERIC(5,2)    NOT NULL DEFAULT 15.00,
    withholding_amount  NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    paper_amount        NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    other_expenses      NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    total               NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    origin_ip           VARCHAR(45),
    comment             TEXT,
    email_sent          BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_invoice_user      FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE SET NULL,
    CONSTRAINT fk_invoice_client    FOREIGN KEY (client_id)    REFERENCES clients(id)    ON DELETE SET NULL,
    CONSTRAINT fk_invoice_act_type  FOREIGN KEY (act_type_id)  REFERENCES act_types(id)
);

CREATE INDEX idx_invoice_user     ON invoices(user_id);
CREATE INDEX idx_invoice_client   ON invoices(client_id);
CREATE INDEX idx_invoice_act_type ON invoices(act_type_id);
CREATE INDEX idx_invoice_status   ON invoices(status);
CREATE INDEX idx_invoice_date     ON invoices(created_at);

CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Input parameters
CREATE TABLE invoice_parameters (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER         NOT NULL,
    field_code      VARCHAR(60)     NOT NULL,
    field_label     VARCHAR(200),
    text_value      VARCHAR(500),
    numeric_value   NUMERIC(15,4),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_param_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_param_invoice ON invoice_parameters(invoice_id);

-- Breakdown lines
CREATE TABLE invoice_lines (
    id              INTEGER             NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER             NOT NULL,
    section         VARCHAR(80)         NOT NULL DEFAULT 'notaria',
    description     VARCHAR(250)        NOT NULL,
    line_type       invoice_line_type   NOT NULL,
    quantity        NUMERIC(10,3)       DEFAULT 1.000,
    unit_price      NUMERIC(14,6),
    amount          NUMERIC(12,2)       NOT NULL,
    is_negative     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_subtotal     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_total        BOOLEAN             NOT NULL DEFAULT FALSE,
    sort_order      SMALLINT            NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_line_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_line_invoice ON invoice_lines(invoice_id);

-- Copies
CREATE TABLE invoice_copies (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER     NOT NULL,
    copy_type       copy_type   NOT NULL,
    quantity        SMALLINT    NOT NULL DEFAULT 1,
    n_pages         SMALLINT,
    unit_cost       NUMERIC(12,6),
    total_cost      NUMERIC(12,2),
    destination     VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_copy_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_copy_invoice ON invoice_copies(invoice_id);

-- Incorporated documents
CREATE TABLE invoice_documents (
    id               INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id       INTEGER     NOT NULL,
    document_id      INTEGER,
    custom_name      VARCHAR(200),
    n_pages          SMALLINT    NOT NULL DEFAULT 1,
    testimony_cost   NUMERIC(10,2),
    incorporated     BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_invoicedoc_invoice  FOREIGN KEY (invoice_id)  REFERENCES invoices(id)              ON DELETE CASCADE,
    CONSTRAINT fk_invoicedoc_catalog  FOREIGN KEY (document_id) REFERENCES attachable_documents(id)  ON DELETE SET NULL
);

CREATE INDEX idx_invoicedoc_invoice ON invoice_documents(invoice_id);

-- =============================================================================
-- BLOCK 5: MODULE-SPECIFIC DATA
-- =============================================================================

CREATE TABLE invoice_policies (
    invoice_id          INTEGER             NOT NULL,
    contract_amount     NUMERIC(15,2)       NOT NULL,
    maturity            maturity_type       NOT NULL,
    has_guarantors      BOOLEAN             NOT NULL DEFAULT FALSE,
    gross_fees          NUMERIC(12,4),
    applied_minimum     BOOLEAN             NOT NULL DEFAULT FALSE,
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_policy_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE invoice_legitimations (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER     NOT NULL,
    document_number SMALLINT    NOT NULL DEFAULT 1,
    n_signatures    SMALLINT    NOT NULL DEFAULT 1,
    cost            NUMERIC(10,2),
    PRIMARY KEY (id),
    CONSTRAINT fk_legit_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_legit_invoice ON invoice_legitimations(invoice_id);

CREATE TABLE invoice_testimonials (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER     NOT NULL,
    document_number SMALLINT    NOT NULL DEFAULT 1,
    n_pages         SMALLINT    NOT NULL DEFAULT 1,
    n_copies        SMALLINT    NOT NULL DEFAULT 1,
    fee_cost        NUMERIC(10,2),
    expense_cost    NUMERIC(10,2),
    PRIMARY KEY (id),
    CONSTRAINT fk_testimony_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_testimony_invoice ON invoice_testimonials(invoice_id);

CREATE TABLE invoice_second_copies (
    invoice_id      INTEGER         NOT NULL,
    copy_type       copy_type       NOT NULL,
    n_pages         SMALLINT        NOT NULL,
    original_date   DATE,
    n_copies        SMALLINT        NOT NULL DEFAULT 1,
    age_years       SMALLINT,
    applied_double  BOOLEAN         NOT NULL DEFAULT FALSE,
    base_fee        NUMERIC(12,4),
    custody_cost    NUMERIC(10,2)   DEFAULT 0.00,
    expense_cost    NUMERIC(10,2)   DEFAULT 0.00,
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_second_copy_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE invoice_real_estate (
    invoice_id                  INTEGER         NOT NULL,
    n_properties                SMALLINT        NOT NULL DEFAULT 1,
    is_dwelling                 BOOLEAN         NOT NULL DEFAULT FALSE,
    buyer_is_company            BOOLEAN         NOT NULL DEFAULT FALSE,
    seller_is_company           BOOLEAN         NOT NULL DEFAULT FALSE,
    has_deposit                 BOOLEAN         NOT NULL DEFAULT FALSE,
    deposit_amount              NUMERIC(15,2),
    has_pledge                  BOOLEAN         NOT NULL DEFAULT FALSE,
    pledge_amount               NUMERIC(15,2),
    has_distribution            BOOLEAN         NOT NULL DEFAULT FALSE,
    distribution_amount         NUMERIC(15,2),
    ordinary_interest_pct       NUMERIC(6,4),
    ordinary_interest_years     SMALLINT,
    default_interest_pct        NUMERIC(6,4),
    default_interest_years      SMALLINT,
    legal_costs_amount          NUMERIC(12,2),
    main_fee                    NUMERIC(12,4),
    deposit_fee                 NUMERIC(12,4),
    pledge_fee                  NUMERIC(12,4),
    distribution_fee            NUMERIC(12,4),
    applied_discount_pct        NUMERIC(5,2),
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_real_estate_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE invoice_powers (
    invoice_id                  INTEGER         NOT NULL,
    n_grantors                  SMALLINT        NOT NULL DEFAULT 1,
    n_agents                    SMALLINT        NOT NULL DEFAULT 1,
    has_processing              BOOLEAN         NOT NULL DEFAULT FALSE,
    has_apostille               BOOLEAN         NOT NULL DEFAULT FALSE,
    apostille_type              apostille_type,
    has_substitution            BOOLEAN         NOT NULL DEFAULT FALSE,
    substitution_pages          SMALLINT,
    has_courier                 BOOLEAN         NOT NULL DEFAULT FALSE,
    notary_travel               BOOLEAN         NOT NULL DEFAULT FALSE,
    n_mail_notifications        SMALLINT        NOT NULL DEFAULT 0,
    n_personal_notifications    SMALLINT        NOT NULL DEFAULT 0,
    n_municipal_notifications   SMALLINT        NOT NULL DEFAULT 0,
    processing_fee              NUMERIC(12,2)   DEFAULT 0.00,
    management_fee              NUMERIC(12,2)   DEFAULT 0.00,
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_power_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE invoice_succession_heirs (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id      INTEGER         NOT NULL,
    heir_number     SMALLINT        NOT NULL,
    name            VARCHAR(200),
    amount          NUMERIC(15,2)   NOT NULL DEFAULT 0.00,
    calculated_fee  NUMERIC(12,4),
    PRIMARY KEY (id),
    CONSTRAINT fk_heir_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_heir_invoice ON invoice_succession_heirs(invoice_id);

-- =============================================================================
-- BLOCK 6: HISTORY AND COMMUNICATIONS
-- =============================================================================

CREATE TABLE invoice_emails (
    id                  INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    invoice_id          INTEGER         NOT NULL,
    destination_email   VARCHAR(200)    NOT NULL,
    subject             VARCHAR(300),
    status              email_status    NOT NULL DEFAULT 'pending',
    error_detail        TEXT,
    recaptcha_token     VARCHAR(500),
    sent_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_email_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX idx_email_invoice ON invoice_emails(invoice_id);

CREATE TABLE activity_log (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id         INTEGER,
    action          VARCHAR(100)    NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       INTEGER,
    detail          JSONB,
    ip              VARCHAR(45),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_log_user   ON activity_log(user_id);
CREATE INDEX idx_log_date   ON activity_log(created_at);
CREATE INDEX idx_log_detail ON activity_log USING GIN (detail);  -- GIN index for JSONB

-- =============================================================================
-- BLOCK 7: USEFUL VIEWS
-- =============================================================================

CREATE OR REPLACE VIEW v_invoices_summary AS
SELECT
    m.id,
    m.reference,
    m.type,
    m.status,
    mo.name             AS module,
    ta.code             AS act_code,
    ta.name             AS act_type,
    m.holder_name,
    m.holder_is_company,
    m.subtotal,
    m.vat_amount,
    m.withholding_amount,
    m.paper_amount,
    m.total,
    u.first_name        AS user_name,
    COALESCE(c.company_name, c.first_name || ' ' || COALESCE(c.last_name,'')) AS client_name,
    c.type              AS client_type,
    m.created_at
FROM invoices m
LEFT JOIN act_types  ta ON m.act_type_id = ta.id
LEFT JOIN modules    mo ON ta.module_id  = mo.id
LEFT JOIN users      u  ON m.user_id     = u.id
LEFT JOIN clients    c  ON m.client_id   = c.id;

CREATE OR REPLACE VIEW v_invoice_breakdown AS
SELECT
    m.id                AS invoice_id,
    m.reference,
    mo.name             AS module,
    ta.name             AS act_type,
    ml.section,
    ml.description,
    ml.line_type,
    ml.quantity,
    ml.unit_price,
    ml.amount,
    ml.is_negative,
    ml.is_subtotal,
    ml.is_total,
    ml.sort_order
FROM invoice_lines ml
JOIN invoices   m  ON ml.invoice_id  = m.id
JOIN act_types  ta ON m.act_type_id  = ta.id
JOIN modules    mo ON ta.module_id   = mo.id
ORDER BY m.id, ml.sort_order;

COMMIT;

-- =============================================================================
-- END OF POSTGRESQL SCHEMA
-- =============================================================================
