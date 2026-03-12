-- =============================================================================
-- CALCULADORA DE MINUTAS NOTARIALES — DDL POSTGRESQL
-- Cubre: Familia, Mercantil, Inmobiliario, Sucesiones, Poderes,
--        Pólizas, Legitimaciones, Testimonios, Segundas Copias
-- =============================================================================

-- =============================================================================
-- LIMPIEZA PREVIA (descomenta si necesitas re-ejecutar el script)
-- Elimina todo y empieza desde cero:
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- =============================================================================

BEGIN;

-- =============================================================================
-- TIPOS ENUM (deben declararse antes de usarlos)
-- Usamos bloques DO para evitar errores si el tipo ya existe
-- =============================================================================

DO $$ BEGIN CREATE TYPE tipo_dato_campo AS ENUM ('entero','decimal','moneda','radio','select',
    'checkbox','texto','fecha','rango_entero');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_honorario AS ENUM ('sin_cuantia','con_cuantia','acta',
    'fijo','escala_polizas');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_linea_minuta AS ENUM (
    'honorario_sin_cuantia','honorario_con_cuantia','folio_matriz',
    'copia_simple','copia_autorizada','copia_electronica',
    'testimonio','diligencia','legitimacion','salida_notario',
    'mensajeria','registro_mercantil','apostilla','protocolo_electronico',
    'tramitacion','custodia','suplido_papel','suplido_otro',
    'subtotal','iva','irpf','total');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_copia       AS ENUM ('simple','autorizada','electronica');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_minuta      AS ENUM ('simulacion','presupuesto','factura');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE estado_minuta    AS ENUM ('borrador','emitido','enviado',
    'aceptado','facturado','cancelado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE rol_usuario      AS ENUM ('admin','notario','oficial','auxiliar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_cliente     AS ENUM ('particular','empresa');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_constante   AS ENUM ('precio','porcentaje','factor','entero');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_vencimiento AS ENUM ('corto','largo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE estado_email     AS ENUM ('pendiente','enviado','error');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE tipo_apostilla   AS ENUM ('urgente','normal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- FUNCIÓN AUXILIAR: actualizar updated_at automáticamente
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =============================================================================
-- BLOQUE 1: CATÁLOGO DE SERVICIOS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Módulos de la calculadora (9 áreas notariales)
-- -----------------------------------------------------------------------------
CREATE TABLE modulos (
    id          SMALLINT            NOT NULL GENERATED ALWAYS AS IDENTITY,
    codigo      VARCHAR(30)         NOT NULL,
    nombre      VARCHAR(100)        NOT NULL,
    descripcion TEXT,
    icono       VARCHAR(50),
    orden       SMALLINT            NOT NULL DEFAULT 0,
    activo      BOOLEAN             NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_modulo_codigo UNIQUE (codigo)
);

INSERT INTO modulos (codigo, nombre, orden) VALUES
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
-- Tipos de acto dentro de cada módulo
-- -----------------------------------------------------------------------------
CREATE TABLE tipos_acto (
    id                  SMALLINT            NOT NULL GENERATED ALWAYS AS IDENTITY,
    modulo_id           SMALLINT            NOT NULL,
    codigo              VARCHAR(10)         NOT NULL,
    nombre              VARCHAR(200)        NOT NULL,
    descripcion         TEXT,
    folios_matriz       SMALLINT,
    folios_matriz_min   SMALLINT,
    folios_matriz_max   SMALLINT            DEFAULT 999,
    diligencias         SMALLINT            DEFAULT 0,
    cs_defecto          SMALLINT            DEFAULT 1,
    ca_defecto          SMALLINT            DEFAULT 1,
    ce_defecto          SMALLINT            DEFAULT 0,
    honorario_tipo      tipo_honorario      NOT NULL DEFAULT 'sin_cuantia',
    honorario_fijo      NUMERIC(10,4),
    honorario_factor    NUMERIC(5,4)        DEFAULT 1.0000,
    descuento_pct       NUMERIC(5,2)        DEFAULT 0.00,
    aplica_iva          BOOLEAN             NOT NULL DEFAULT TRUE,
    aplica_irpf         BOOLEAN             NOT NULL DEFAULT FALSE,
    activo              BOOLEAN             NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_tipo_acto UNIQUE (modulo_id, codigo),
    CONSTRAINT fk_tipo_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(id)
);

-- Familia
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'PDR','Pareja de Hecho Registrada',       5, 5, 3, 1, 1, 1, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'DPE','Disolución de Pareja Estable',      4, 4, 3, 1, 1, 1, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'MAT','Matrimonio',                        5, 5, 5, 2, 1, 1, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'FEM','Formalización Expediente Matrimonial', 15, 15, 3, 1, 1, 1, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'DIV','Divorcio',                          5, 5, 5, 2, 3, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CAA','Capitulaciones Antes del Matrimonio', 6, 6, 6, 2, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CAD','Capitulaciones Después del Matrimonio', 5, 5, 5, 2, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'EMA','Emancipación',                      4, 4, 5, 1, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'NDT','Nombramiento de Tutor',             3, 3, 5, 1, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'AUC','Autocuratela',                      3, 3, 5, 1, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CDA','Consentimiento Divorciado Ascendientes', 8, 8, 5, 1, 2, 0, 'sin_cuantia' FROM modulos WHERE codigo='familia';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CMP','Constitución de Patrimonio Protegido', 3, 3, 2, 1, 0, 'con_cuantia' FROM modulos WHERE codigo='familia';

-- Mercantil
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CS', 'Constitución de Sociedad',           18, 18, 18, 1, 1, 1, 1, 'con_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'ACS','Ampliación de Capital Social',        10,  8, 25, 1, 1, 1, 1, 'con_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'RCS','Reducción de Capital Social',         10,  8, 25, 1, 1, 1, 1, 'con_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'DL', 'Disolución y Liquidación',            10,  8, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CPS','Comprobante de Participaciones Sociales', 8, 8, 25, 1, 1, 1, 0, 'con_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'ATR','Acta de Tribunal Real',                4,  4, 25, 1, 1, 1, 0, 'acta'        FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CN', 'Cese y Nombramiento',                 12, 12, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'TDS','Traslado de Domicilio Social',        14, 14, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'CDS','Cambio de Domicilio Social',          15, 15, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'EP', 'Elevación a Público',                  8,  8, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'ME', 'Modificación Estatutaria',              6,  6, 25, 1, 1, 1, 0, 'sin_cuantia' FROM modulos WHERE codigo='mercantil';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo)
SELECT id, 'PJ', 'Presencia en Junta',                   8,  8, 25, 1, 1, 1, 0, 'acta'        FROM modulos WHERE codigo='mercantil';

-- Inmobiliario
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'COMP','Compraventa',           NULL, 3, 3, 1, 1, 'con_cuantia', 28.75 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'PRES','Préstamo Hipotecario',  NULL, 3, 1, 1, 1, 'con_cuantia', 46.56 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'NOSU','Novación/Subrogación',  NULL, 3, 1, 1, 1, 'con_cuantia', 52.50 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'ARRA','Arras',                 NULL, 3, 2, 1, 1, 'con_cuantia',  5.00 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'EDCO','Extinción de Condominio', NULL, 3, 3, 1, 1, 'con_cuantia', 5.00 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'OPCO','Opción de Compra',      NULL, 3, 2, 1, 1, 'con_cuantia',  5.00 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'OBNU','Obra Nueva',            NULL, 3, 1, 1, 1, 'con_cuantia',  5.00 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct)
SELECT id,'DIHO','División Horizontal',   NULL, 3, 1, 1, 1, 'con_cuantia',  5.00 FROM modulos WHERE codigo='inmobiliario';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_fijo, descuento_pct)
SELECT id,'AFSA','Acta de Fijación de Saldo', NULL, 3, 1, 1, 0, 'fijo', 36.06, 0.00 FROM modulos WHERE codigo='inmobiliario';

-- Sucesiones
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'TE', 'Testamento',                          3, 0, 1, 0, 0, 'sin_cuantia', 1.0000 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'DH', 'Declaración de Herederos',            8, 0, 1, 1, 0, 'acta',        1.0000 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'RH', 'Renuncia de Herencia',                3, 0, 1, 1, 0, 'sin_cuantia', 1.0000 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'UV', 'Últimas Voluntades / Testamento Vital', 4, 0, 1, 1, 0, 'sin_cuantia', 1.0000 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'ACS','Acta Certificado Sucesorio Europeo',  11, 0, 1, 1, 0, 'acta',        1.0000 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'ELD','Entrega de Legítima Dineraria',       11, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'ELB','Entrega de Legítima de Bienes',       11, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'VDH','Venta de Derechos Hereditarios',      11, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'DO', 'Donación',                          NULL, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'AH', 'Acta de Herencia',                  NULL, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor)
SELECT id,'HE', 'Herencia',                          NULL, 0, 1, 1, 0, 'con_cuantia', 0.9500 FROM modulos WHERE codigo='sucesiones';

-- Poderes
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'P','Personalizado',           6, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'G','General',                 7, 2, 1, 'sin_cuantia', FALSE FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'E','Especial',                6, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'M','Mercantil General',       9, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'S','Preventivo Simple',       8, 2, 1, 'sin_cuantia', FALSE FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'R','Preventivo Recíproco',    8, 3, 1, 'sin_cuantia', FALSE FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'L','Pleitos',                 8, 1, 1, 'sin_cuantia', FALSE FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'T','Sustitución',             4, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'A','Subapoderamiento',        4, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'V','Revocación',              7, 2, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'N','Renuncia',                7, 2, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf)
SELECT id,'F','Ratificación',            4, 1, 1, 'sin_cuantia', TRUE  FROM modulos WHERE codigo='poderes';

-- Pólizas
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'POL_SC_C','Póliza sin garantes, venc. ≤6 meses', 'escala_polizas', TRUE FROM modulos WHERE codigo='polizas';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'POL_CC_C','Póliza con garantes, venc. ≤6 meses', 'escala_polizas', TRUE FROM modulos WHERE codigo='polizas';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'POL_SC_L','Póliza sin garantes, venc. >6 meses', 'escala_polizas', TRUE FROM modulos WHERE codigo='polizas';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'POL_CC_L','Póliza con garantes, venc. >6 meses', 'escala_polizas', TRUE FROM modulos WHERE codigo='polizas';

-- Legitimaciones, Testimonios, Segundas Copias
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'LEGI','Legitimación de Firma',     'fijo', TRUE FROM modulos WHERE codigo='legitimaciones';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'TEST','Testimonio de Documento',   'fijo', TRUE FROM modulos WHERE codigo='testimonios';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'SC_S','Segunda Copia Simple',      'fijo', TRUE FROM modulos WHERE codigo='segundas_copias';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'SC_A','Segunda Copia Autorizada',  'fijo', TRUE FROM modulos WHERE codigo='segundas_copias';
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf)
SELECT id,'SC_E','Segunda Copia Electrónica', 'fijo', TRUE FROM modulos WHERE codigo='segundas_copias';

-- -----------------------------------------------------------------------------
-- Campos de formulario por tipo de acto
-- -----------------------------------------------------------------------------
CREATE TABLE campos_formulario (
    id              INTEGER             NOT NULL GENERATED ALWAYS AS IDENTITY,
    tipo_acto_id    SMALLINT            NOT NULL,
    codigo          VARCHAR(60)         NOT NULL,
    etiqueta        VARCHAR(200)        NOT NULL,
    tipo_dato       tipo_dato_campo     NOT NULL DEFAULT 'entero',
    valor_defecto   VARCHAR(200),
    valor_min       NUMERIC(15,2),
    valor_max       NUMERIC(15,2),
    requerido       BOOLEAN             NOT NULL DEFAULT TRUE,
    solo_lectura    BOOLEAN             NOT NULL DEFAULT FALSE,
    es_testimonio   BOOLEAN             NOT NULL DEFAULT FALSE,
    es_importe      BOOLEAN             NOT NULL DEFAULT FALSE,
    tooltip         TEXT,
    orden           SMALLINT            NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_campo_tipo FOREIGN KEY (tipo_acto_id) REFERENCES tipos_acto(id)
);

CREATE INDEX idx_campo_tipo ON campos_formulario(tipo_acto_id);

-- Opciones para campos radio/select
CREATE TABLE campos_opciones (
    id          INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    campo_id    INTEGER     NOT NULL,
    valor       VARCHAR(50) NOT NULL,
    etiqueta    VARCHAR(200) NOT NULL,
    orden       SMALLINT    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_opcion_campo FOREIGN KEY (campo_id) REFERENCES campos_formulario(id)
);

CREATE INDEX idx_opcion_campo ON campos_opciones(campo_id);

-- Documentos incorporables por tipo de acto
CREATE TABLE documentos_incorporables (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    tipo_acto_id    SMALLINT    NOT NULL,
    codigo          VARCHAR(60) NOT NULL,
    nombre          VARCHAR(200) NOT NULL,
    folios_defecto  SMALLINT    NOT NULL DEFAULT 1,
    obligatorio     BOOLEAN     NOT NULL DEFAULT FALSE,
    orden           SMALLINT    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_doc_tipo FOREIGN KEY (tipo_acto_id) REFERENCES tipos_acto(id)
);

CREATE INDEX idx_doc_tipo ON documentos_incorporables(tipo_acto_id);

-- Documentos PDR
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id,'libro_familia',      'Libro de Familia',      2, FALSE, 1 FROM tipos_acto WHERE codigo='PDR';
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id,'sentencia_divorcio', 'Sentencia de Divorcio', 2, FALSE, 2 FROM tipos_acto WHERE codigo='PDR';
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id,'convivencia_previa', 'Convivencia Previa',    2, FALSE, 3 FROM tipos_acto WHERE codigo='PDR';
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id,'contrato_alquiler',  'Contrato de Alquiler',  4, FALSE, 4 FROM tipos_acto WHERE codigo='PDR';

-- =============================================================================
-- BLOQUE 2: ESCALAS ARANCELARIAS
-- =============================================================================

CREATE TABLE escalas_honorarios (
    id          SMALLINT    NOT NULL GENERATED ALWAYS AS IDENTITY,
    codigo      VARCHAR(50) NOT NULL,
    nombre      VARCHAR(150) NOT NULL,
    descripcion TEXT,
    activo      BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_escala_codigo UNIQUE (codigo)
);

INSERT INTO escalas_honorarios (codigo, nombre) VALUES
    ('general',          'Escala General (actos con cuantía)'),
    ('polizas_sg_corto', 'Pólizas sin garantes, vencimiento ≤6 meses'),
    ('polizas_cg_corto', 'Pólizas con garantes, vencimiento ≤6 meses'),
    ('polizas_sg_largo', 'Pólizas sin garantes, vencimiento >6 meses'),
    ('polizas_cg_largo', 'Pólizas con garantes, vencimiento >6 meses');

CREATE TABLE escalas_tramos (
    id                  SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    escala_id           SMALLINT        NOT NULL,
    limite_inferior     NUMERIC(15,2)   NOT NULL DEFAULT 0.00,
    limite_superior     NUMERIC(15,2),
    importe_fijo        NUMERIC(12,4)   NOT NULL DEFAULT 0.0000,
    porcentaje_marginal NUMERIC(10,8)   NOT NULL DEFAULT 0.00000000,
    orden               SMALLINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_tramo_escala FOREIGN KEY (escala_id) REFERENCES escalas_honorarios(id)
);

CREATE INDEX idx_tramo_escala ON escalas_tramos(escala_id);

-- Escala general
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      0.00,   6010.12,   90.1500, 0.00000000, 1 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,   6010.13,  30050.61,   90.1500, 0.00450000, 2 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,  30050.62,  60101.21,  198.3300, 0.00150000, 3 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,  60101.22, 150253.03,  243.4100, 0.00100000, 4 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 150253.04, 601012.10,  333.5600, 0.00050000, 5 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 601012.11,       NULL, 558.9400, 0.00030000, 6 FROM escalas_honorarios WHERE codigo='general';

-- Pólizas sin garantes, vencimiento <= 6 meses
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      0.00, 240404.84,    0.0000, 0.00200000, 1 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 240404.85, 300506.05,  480.8097, 0.00100000, 2 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 300506.06,       NULL, 541.3097, 0.00025000, 3 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';

-- Pólizas con garantes, vencimiento <= 6 meses
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      0.00,  90151.81,    0.0000, 0.00300000, 1 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,  90151.82, 150253.03,  270.4555, 0.00200000, 2 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 150253.04, 300506.05,  390.9594, 0.00100000, 3 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 300506.06,       NULL, 541.4594, 0.00025000, 4 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';

-- Pólizas sin garantes, vencimiento > 6 meses (idéntica a polizas_cg_corto)
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT dest.id, src.limite_inferior, src.limite_superior, src.importe_fijo, src.porcentaje_marginal, src.orden
FROM escalas_tramos src
JOIN escalas_honorarios eh_src  ON src.escala_id = eh_src.id  AND eh_src.codigo = 'polizas_cg_corto'
JOIN escalas_honorarios dest    ON dest.codigo = 'polizas_sg_largo';

-- Pólizas con garantes, vencimiento > 6 meses
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      0.00,  48080.97,    0.0000, 0.00450000, 1 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,  48080.98,  90151.81,  216.3644, 0.00150000, 2 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,  90151.82, 150253.03,  279.6421, 0.00300000, 3 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 150253.04, 300506.05,  460.0978, 0.00100000, 4 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id, 300506.06,       NULL, 610.5978, 0.00025000, 5 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';

-- Constantes del sistema
CREATE TABLE constantes (
    id              SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    codigo          VARCHAR(60)     NOT NULL,
    nombre          VARCHAR(200)    NOT NULL,
    valor           NUMERIC(15,6)   NOT NULL,
    tipo            tipo_constante  NOT NULL DEFAULT 'precio',
    descripcion     TEXT,
    vigente_desde   DATE,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uq_constante_codigo UNIQUE (codigo)
);

INSERT INTO constantes (codigo, nombre, valor, tipo, descripcion) VALUES
    ('precio_sin_cuantia',      'Honorarios acto sin cuantía',              30.050000, 'precio',      'Honorario base para documentos sin cuantía'),
    ('acta_sin_cuantia',        'Honorarios acta sin cuantía',              36.060000, 'precio',      'Honorario acta (DH, ATR, ACS, etc.)'),
    ('precio_folio_matriz',     'Precio por folio de matriz (>4 folios)',    6.010121, 'precio',      'Aplicable a partir del 5º folio'),
    ('precio_copia_simple',     'Precio copia simple por folio',            0.601012, 'precio',      '100/166.386'),
    ('precio_copia_aut_1_11',   'Precio copia autorizada folios 1-11',      3.005060, 'precio',      '500/166.386'),
    ('precio_copia_aut_12_plus','Precio copia autorizada folios ≥12',       1.502530, 'precio',      '250/166.386'),
    ('precio_testimonio_1',     'Precio testimonio 1 folio',                3.005060, 'precio',      '500/166.386'),
    ('precio_testimonio_add',   'Precio testimonio por folio adicional',    0.601012, 'precio',      '100/166.386'),
    ('precio_legitimacion_1',   'Precio legitimación 1 firma',              6.010120, 'precio',      '1000/166.386'),
    ('precio_legitimacion_add', 'Precio legitimación por firma adicional',  3.005060, 'precio',      '500/166.386'),
    ('coste_diligencia',        'Coste por diligencia',                     3.010000, 'precio',      ''),
    ('coste_papel',             'Coste papel por folio',                    0.150000, 'precio',      'Papel timbrado'),
    ('iva',                     'IVA',                                     21.000000, 'porcentaje',  ''),
    ('irpf',                    'IRPF',                                    15.000000, 'porcentaje',  'Solo aplica si titular es empresa'),
    ('protocolo_electronico',   'Protocolo electrónico',                    9.030000, 'precio',      ''),
    ('mensajeria',              'Gastos de mensajería',                    18.000000, 'precio',      ''),
    ('salida_notario',          'Desplazamiento del notario (por hora)',    18.030000, 'precio',      ''),
    ('apostilla_urgente',       'Apostilla urgente',                       47.000000, 'precio',      ''),
    ('apostilla_normal',        'Apostilla normal',                        39.000000, 'precio',      ''),
    ('registro_mercantil',      'Consulta Registro Mercantil',             12.000000, 'precio',      ''),
    ('tramite_mercantil',       'Trámite mercantil por poderdante',       150.000000, 'precio',      ''),
    ('importe_por_cargos',      'Importe por cargos (por apoderado)',      24.040000, 'precio',      ''),
    ('gestion_poder_mercantil', 'Gestión poder mercantil',                 75.000000, 'precio',      ''),
    ('poliza_honor_minimo',     'Honorario mínimo en pólizas',            12.020000, 'precio',      ''),
    ('factor_conversion',       'Factor conversión pesetas→euros',        166.386000, 'factor',      '1/166.386 = constante arancelaria'),
    ('custodia_copia_por_anno', 'Custodia segunda copia por año',          0.601012, 'precio',      'Solo aplica si antigüedad > 5 años'),
    ('suplido_papel_copia_aut', 'Suplido papel copia autorizada/folio',    0.150000, 'precio',      '');

-- =============================================================================
-- BLOQUE 3: USUARIOS Y CLIENTES
-- =============================================================================

CREATE TABLE usuarios (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre          VARCHAR(100)    NOT NULL,
    apellidos       VARCHAR(150),
    email           VARCHAR(200)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    rol             rol_usuario     NOT NULL DEFAULT 'auxiliar',
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_acceso   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT uq_usuario_email UNIQUE (email)
);

CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TABLE clientes (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    tipo            tipo_cliente    NOT NULL DEFAULT 'particular',
    nombre          VARCHAR(100),
    apellidos       VARCHAR(150),
    razon_social    VARCHAR(200),
    nif_cif         VARCHAR(20),
    email           VARCHAR(200),
    telefono        VARCHAR(20),
    direccion       VARCHAR(300),
    ciudad          VARCHAR(100),
    codigo_postal   VARCHAR(10),
    provincia       VARCHAR(100),
    pais            VARCHAR(50)     NOT NULL DEFAULT 'España',
    es_empresa      BOOLEAN         NOT NULL DEFAULT FALSE,
    observaciones   TEXT,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE INDEX idx_cliente_nif   ON clientes(nif_cif);
CREATE INDEX idx_cliente_email ON clientes(email);

CREATE TRIGGER trg_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================================
-- BLOQUE 4: MINUTAS Y PRESUPUESTOS
-- =============================================================================

CREATE TABLE minutas (
    id                  INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    referencia          VARCHAR(30)     UNIQUE,
    tipo                tipo_minuta     NOT NULL DEFAULT 'simulacion',
    estado              estado_minuta   NOT NULL DEFAULT 'borrador',
    usuario_id          INTEGER,
    cliente_id          INTEGER,
    tipo_acto_id        SMALLINT        NOT NULL,
    titular_nombre      VARCHAR(300),
    titular_es_empresa  BOOLEAN         NOT NULL DEFAULT FALSE,
    descripcion_acto    TEXT,
    subtotal            NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    iva_pct             NUMERIC(5,2)    NOT NULL DEFAULT 21.00,
    iva_importe         NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    irpf_pct            NUMERIC(5,2)    NOT NULL DEFAULT 15.00,
    irpf_importe        NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    papel_importe       NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    suplidos_otros      NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    total               NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    ip_origen           VARCHAR(45),
    comentario          TEXT,
    enviado_email       BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_minuta_usuario    FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE SET NULL,
    CONSTRAINT fk_minuta_cliente    FOREIGN KEY (cliente_id)   REFERENCES clientes(id)   ON DELETE SET NULL,
    CONSTRAINT fk_minuta_tipo_acto  FOREIGN KEY (tipo_acto_id) REFERENCES tipos_acto(id)
);

CREATE INDEX idx_minuta_usuario   ON minutas(usuario_id);
CREATE INDEX idx_minuta_cliente   ON minutas(cliente_id);
CREATE INDEX idx_minuta_tipo_acto ON minutas(tipo_acto_id);
CREATE INDEX idx_minuta_estado    ON minutas(estado);
CREATE INDEX idx_minuta_fecha     ON minutas(created_at);

CREATE TRIGGER trg_minutas_updated_at
    BEFORE UPDATE ON minutas
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Parámetros de entrada
CREATE TABLE minuta_parametros (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER         NOT NULL,
    campo_codigo    VARCHAR(60)     NOT NULL,
    campo_etiqueta  VARCHAR(200),
    valor_texto     VARCHAR(500),
    valor_numerico  NUMERIC(15,4),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_param_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_param_minuta ON minuta_parametros(minuta_id);

-- Líneas del desglose
CREATE TABLE minuta_lineas (
    id              INTEGER             NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER             NOT NULL,
    seccion         VARCHAR(80)         NOT NULL DEFAULT 'notaria',
    concepto        VARCHAR(250)        NOT NULL,
    tipo_linea      tipo_linea_minuta   NOT NULL,
    cantidad        NUMERIC(10,3)       DEFAULT 1.000,
    precio_unitario NUMERIC(14,6),
    importe         NUMERIC(12,2)       NOT NULL,
    es_negativo     BOOLEAN             NOT NULL DEFAULT FALSE,
    es_subtotal     BOOLEAN             NOT NULL DEFAULT FALSE,
    es_total        BOOLEAN             NOT NULL DEFAULT FALSE,
    orden           SMALLINT            NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_linea_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_linea_minuta ON minuta_lineas(minuta_id);

-- Copias
CREATE TABLE minuta_copias (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER     NOT NULL,
    tipo_copia      tipo_copia  NOT NULL,
    cantidad        SMALLINT    NOT NULL DEFAULT 1,
    n_folios        SMALLINT,
    coste_unitario  NUMERIC(12,6),
    coste_total     NUMERIC(12,2),
    destino         VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_copia_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_copia_minuta ON minuta_copias(minuta_id);

-- Documentos incorporados
CREATE TABLE minuta_documentos (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER     NOT NULL,
    documento_id    INTEGER,
    nombre_libre    VARCHAR(200),
    n_folios        SMALLINT    NOT NULL DEFAULT 1,
    coste_testimonio NUMERIC(10,2),
    incorporado     BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_docminuta_minuta   FOREIGN KEY (minuta_id)    REFERENCES minutas(id)                 ON DELETE CASCADE,
    CONSTRAINT fk_docminuta_catalogo FOREIGN KEY (documento_id) REFERENCES documentos_incorporables(id) ON DELETE SET NULL
);

CREATE INDEX idx_docminuta_minuta ON minuta_documentos(minuta_id);

-- =============================================================================
-- BLOQUE 5: DATOS ESPECÍFICOS POR MÓDULO
-- =============================================================================

CREATE TABLE minuta_polizas (
    minuta_id           INTEGER             NOT NULL,
    importe_contrato    NUMERIC(15,2)       NOT NULL,
    vencimiento         tipo_vencimiento    NOT NULL,
    tiene_garantes      BOOLEAN             NOT NULL DEFAULT FALSE,
    honorarios_brutos   NUMERIC(12,4),
    aplico_minimo       BOOLEAN             NOT NULL DEFAULT FALSE,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_poliza_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE TABLE minuta_legitimaciones (
    id          INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id   INTEGER     NOT NULL,
    n_documento SMALLINT    NOT NULL DEFAULT 1,
    n_firmas    SMALLINT    NOT NULL DEFAULT 1,
    coste       NUMERIC(10,2),
    PRIMARY KEY (id),
    CONSTRAINT fk_legi_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_legi_minuta ON minuta_legitimaciones(minuta_id);

CREATE TABLE minuta_testimonios (
    id          INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id   INTEGER     NOT NULL,
    n_documento SMALLINT    NOT NULL DEFAULT 1,
    n_paginas   SMALLINT    NOT NULL DEFAULT 1,
    n_copias    SMALLINT    NOT NULL DEFAULT 1,
    coste_honor NUMERIC(10,2),
    coste_suplido NUMERIC(10,2),
    PRIMARY KEY (id),
    CONSTRAINT fk_testi_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_testi_minuta ON minuta_testimonios(minuta_id);

CREATE TABLE minuta_segundas_copias (
    minuta_id           INTEGER         NOT NULL,
    tipo_copia          tipo_copia      NOT NULL,
    n_folios            SMALLINT        NOT NULL,
    fecha_original      DATE,
    n_copias            SMALLINT        NOT NULL DEFAULT 1,
    antiguedad_annos    SMALLINT,
    aplico_doble        BOOLEAN         NOT NULL DEFAULT FALSE,
    honor_base          NUMERIC(12,4),
    coste_custodia      NUMERIC(10,2)   DEFAULT 0.00,
    coste_suplido       NUMERIC(10,2)   DEFAULT 0.00,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_sc_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE TABLE minuta_inmobiliario (
    minuta_id               INTEGER         NOT NULL,
    n_fincas                SMALLINT        NOT NULL DEFAULT 1,
    es_vivienda             BOOLEAN         NOT NULL DEFAULT FALSE,
    comprador_es_empresa    BOOLEAN         NOT NULL DEFAULT FALSE,
    vendedor_es_empresa     BOOLEAN         NOT NULL DEFAULT FALSE,
    tiene_fianza            BOOLEAN         NOT NULL DEFAULT FALSE,
    importe_fianza          NUMERIC(15,2),
    tiene_pigno             BOOLEAN         NOT NULL DEFAULT FALSE,
    importe_pigno           NUMERIC(15,2),
    tiene_distribucion      BOOLEAN         NOT NULL DEFAULT FALSE,
    importe_distribucion    NUMERIC(15,2),
    interes_ordinario_pct   NUMERIC(6,4),
    interes_ordinario_annos SMALLINT,
    interes_demora_pct      NUMERIC(6,4),
    interes_demora_annos    SMALLINT,
    importe_costas          NUMERIC(12,2),
    honor_principal         NUMERIC(12,4),
    honor_fianza            NUMERIC(12,4),
    honor_pigno             NUMERIC(12,4),
    honor_distribucion      NUMERIC(12,4),
    descuento_pct_aplicado  NUMERIC(5,2),
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_inmo_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE TABLE minuta_poderes (
    minuta_id               INTEGER         NOT NULL,
    n_poderdantes           SMALLINT        NOT NULL DEFAULT 1,
    n_apoderados            SMALLINT        NOT NULL DEFAULT 1,
    tiene_tramitacion       BOOLEAN         NOT NULL DEFAULT FALSE,
    tiene_apostilla         BOOLEAN         NOT NULL DEFAULT FALSE,
    apostilla_tipo          tipo_apostilla,
    tiene_sustitucion       BOOLEAN         NOT NULL DEFAULT FALSE,
    n_folios_sustitucion    SMALLINT,
    tiene_mensajeria        BOOLEAN         NOT NULL DEFAULT FALSE,
    salida_notario          BOOLEAN         NOT NULL DEFAULT FALSE,
    n_notif_correo          SMALLINT        NOT NULL DEFAULT 0,
    n_notif_persona         SMALLINT        NOT NULL DEFAULT 0,
    n_notif_municipio       SMALLINT        NOT NULL DEFAULT 0,
    honor_tramitacion       NUMERIC(12,2)   DEFAULT 0.00,
    honor_gestion           NUMERIC(12,2)   DEFAULT 0.00,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_poder_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE TABLE minuta_sucesiones_herederos (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER         NOT NULL,
    n_heredero      SMALLINT        NOT NULL,
    nombre          VARCHAR(200),
    importe         NUMERIC(15,2)   NOT NULL DEFAULT 0.00,
    honor_calculado NUMERIC(12,4),
    PRIMARY KEY (id),
    CONSTRAINT fk_hered_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_hered_minuta ON minuta_sucesiones_herederos(minuta_id);

-- =============================================================================
-- BLOQUE 6: HISTORIAL Y COMUNICACIONES
-- =============================================================================

CREATE TABLE minuta_emails (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    minuta_id       INTEGER         NOT NULL,
    email_destino   VARCHAR(200)    NOT NULL,
    asunto          VARCHAR(300),
    estado          estado_email    NOT NULL DEFAULT 'pendiente',
    error_detalle   TEXT,
    recaptcha_token VARCHAR(500),
    enviado_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_email_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_email_minuta ON minuta_emails(minuta_id);

CREATE TABLE log_actividad (
    id              INTEGER         NOT NULL GENERATED ALWAYS AS IDENTITY,
    usuario_id      INTEGER,
    accion          VARCHAR(100)    NOT NULL,
    entidad_tipo    VARCHAR(50),
    entidad_id      INTEGER,
    detalle         JSONB,
    ip              VARCHAR(45),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_log_usuario ON log_actividad(usuario_id);
CREATE INDEX idx_log_fecha   ON log_actividad(created_at);
CREATE INDEX idx_log_detalle ON log_actividad USING GIN (detalle);  -- índice GIN para JSONB

-- =============================================================================
-- BLOQUE 7: VISTAS ÚTILES
-- =============================================================================

CREATE OR REPLACE VIEW v_minutas_resumen AS
SELECT
    m.id,
    m.referencia,
    m.tipo,
    m.estado,
    mo.nombre           AS modulo,
    ta.codigo           AS codigo_acto,
    ta.nombre           AS tipo_acto,
    m.titular_nombre,
    m.titular_es_empresa,
    m.subtotal,
    m.iva_importe,
    m.irpf_importe,
    m.papel_importe,
    m.total,
    u.nombre            AS usuario,
    COALESCE(c.razon_social, c.nombre || ' ' || COALESCE(c.apellidos,'')) AS cliente_nombre,
    c.tipo              AS cliente_tipo,
    m.created_at
FROM minutas m
LEFT JOIN tipos_acto  ta ON m.tipo_acto_id = ta.id
LEFT JOIN modulos     mo ON ta.modulo_id   = mo.id
LEFT JOIN usuarios    u  ON m.usuario_id   = u.id
LEFT JOIN clientes    c  ON m.cliente_id   = c.id;

CREATE OR REPLACE VIEW v_minuta_desglose AS
SELECT
    m.id                AS minuta_id,
    m.referencia,
    mo.nombre           AS modulo,
    ta.nombre           AS tipo_acto,
    ml.seccion,
    ml.concepto,
    ml.tipo_linea,
    ml.cantidad,
    ml.precio_unitario,
    ml.importe,
    ml.es_negativo,
    ml.es_subtotal,
    ml.es_total,
    ml.orden
FROM minuta_lineas ml
JOIN minutas    m  ON ml.minuta_id   = m.id
JOIN tipos_acto ta ON m.tipo_acto_id = ta.id
JOIN modulos    mo ON ta.modulo_id   = mo.id
ORDER BY m.id, ml.orden;

COMMIT;

-- =============================================================================
-- FIN DEL ESQUEMA POSTGRESQL
-- =============================================================================
