-- =============================================================================
-- CALCULADORA DE MINUTAS NOTARIALES — DDL COMPLETO
-- Cubre: Familia, Mercantil, Inmobiliario, Sucesiones, Poderes,
--        Pólizas, Legitimaciones, Testimonios, Segundas Copias
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- BLOQUE 1: CATÁLOGO DE SERVICIOS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Módulos de la calculadora (9 áreas notariales)
-- -----------------------------------------------------------------------------
CREATE TABLE modulos (
    id          TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    codigo      VARCHAR(30)         NOT NULL,   -- 'familia', 'mercantil', etc.
    nombre      VARCHAR(100)        NOT NULL,
    descripcion TEXT,
    icono       VARCHAR(50),
    orden       TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    activo      TINYINT(1)          NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_modulo_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    id                  SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    modulo_id           TINYINT UNSIGNED    NOT NULL,
    codigo              VARCHAR(10)         NOT NULL,
    nombre              VARCHAR(200)        NOT NULL,
    descripcion         TEXT,
    -- Folios de escritura matriz
    folios_matriz       SMALLINT UNSIGNED,          -- Valor fijo (NULL = variable)
    folios_matriz_min   SMALLINT UNSIGNED,
    folios_matriz_max   SMALLINT UNSIGNED DEFAULT 999,
    -- Diligencias por defecto
    diligencias         TINYINT UNSIGNED    DEFAULT 0,
    -- Copias por defecto
    cs_defecto          TINYINT UNSIGNED    DEFAULT 1,  -- Copias Simples
    ca_defecto          TINYINT UNSIGNED    DEFAULT 1,  -- Copias Autorizadas
    ce_defecto          TINYINT UNSIGNED    DEFAULT 0,  -- Copias Electrónicas
    -- Tipo de honorario base
    honorario_tipo      ENUM('sin_cuantia','con_cuantia','acta','fijo','escala_polizas')
                        NOT NULL DEFAULT 'sin_cuantia',
    honorario_fijo      DECIMAL(10,4),               -- Si es importe fijo (AFSA=36.06)
    honorario_factor    DECIMAL(5,4) DEFAULT 1.0000, -- Factor sobre escala (0.95 en sucesiones)
    descuento_pct       DECIMAL(5,2)  DEFAULT 0.00,  -- Descuento sobre honorario con cuantía
    -- Impuestos
    aplica_iva          TINYINT(1) NOT NULL DEFAULT 1,
    aplica_irpf         TINYINT(1) NOT NULL DEFAULT 0, -- Solo si empresa/profesional
    -- Control
    activo              TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tipo_acto (modulo_id, codigo),
    CONSTRAINT fk_tipo_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Familia
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo) VALUES
    (1,'PDR','Pareja de Hecho Registrada',       5, 5, 3, 1, 1, 1, 'sin_cuantia'),
    (1,'DPE','Disolución de Pareja Estable',      4, 4, 3, 1, 1, 1, 'sin_cuantia'),  -- diligencias: 3 o 4 según opción
    (1,'MAT','Matrimonio',                        5, 5, 5, 2, 1, 1, 'sin_cuantia'),
    (1,'FEM','Formalización Expediente Matrimonial', 15, 15, 3, 1, 1, 1, 'sin_cuantia'),
    (1,'DIV','Divorcio',                          5, 5, 5, 2, 3, 0, 'sin_cuantia'),
    (1,'CAA','Capitulaciones Antes del Matrimonio', 6, 6, 6, 2, 2, 0, 'sin_cuantia'),
    (1,'CAD','Capitulaciones Después del Matrimonio', 5, 5, 5, 2, 2, 0, 'sin_cuantia'),
    (1,'EMA','Emancipación',                      4, 4, 5, 1, 2, 0, 'sin_cuantia'),
    (1,'NDT','Nombramiento de Tutor',             3, 3, 5, 1, 2, 0, 'sin_cuantia'),
    (1,'AUC','Autocuratela',                      3, 3, 5, 1, 2, 0, 'sin_cuantia'),
    (1,'CDA','Consentimiento Divorciado Ascendientes', 8, 8, 5, 1, 2, 0, 'sin_cuantia'),
    (1,'CMP','Constitución de Patrimonio Protegido', NULL, 3, 3, 2, 1, 0, 'con_cuantia');

-- Mercantil
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz, folios_matriz_min, folios_matriz_max, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo) VALUES
    (2,'CS', 'Constitución de Sociedad',           18, 18, 18, 1, 1, 1, 1, 'con_cuantia'),
    (2,'ACS','Ampliación de Capital Social',        10, 8,  25, 1, 1, 1, 1, 'con_cuantia'),
    (2,'RCS','Reducción de Capital Social',         10, 8,  25, 1, 1, 1, 1, 'con_cuantia'),
    (2,'DL', 'Disolución y Liquidación',            10, 8,  25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'CPS','Comprobante de Participaciones Sociales', 8, 8, 25, 1, 1, 1, 0, 'con_cuantia'),
    (2,'ATR','Acta de Tribunal Real',               4,  4,  25, 1, 1, 1, 0, 'acta'),
    (2,'CN', 'Cese y Nombramiento',                 12, 12, 25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'TDS','Traslado de Domicilio Social',        14, 14, 25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'CDS','Cambio de Domicilio Social',          15, 15, 25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'EP', 'Elevación a Público',                 8,  8,  25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'ME', 'Modificación Estatutaria',            6,  6,  25, 1, 1, 1, 0, 'sin_cuantia'),
    (2,'PJ', 'Presencia en Junta',                  8,  8,  25, 1, 1, 1, 0, 'acta');

-- Inmobiliario
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, descuento_pct) VALUES
    (3,'COMP','Compraventa',           NULL, 3, 3, 1, 1, 'con_cuantia', 28.75), -- descuento variable (5% o 28.75%)
    (3,'PRES','Préstamo Hipotecario',  NULL, 3, 1, 1, 1, 'con_cuantia', 46.56),
    (3,'NOSU','Novación/Subrogación',  NULL, 3, 1, 1, 1, 'con_cuantia', 52.50),
    (3,'ARRA','Arras',                 NULL, 3, 2, 1, 1, 'con_cuantia',  5.00),
    (3,'EDCO','Extinción de Condominio', NULL, 3, 3, 1, 1, 'con_cuantia', 5.00),
    (3,'OPCO','Opción de Compra',      NULL, 3, 2, 1, 1, 'con_cuantia',  5.00),
    (3,'OBNU','Obra Nueva',            NULL, 3, 1, 1, 1, 'con_cuantia',  5.00),
    (3,'DIHO','División Horizontal',   NULL, 3, 1, 1, 1, 'con_cuantia',  5.00),
    (3,'AFSA','Acta de Fijación de Saldo', NULL, 3, 1, 1, 0, 'fijo',    0.00);

UPDATE tipos_acto SET honorario_fijo = 36.06 WHERE codigo = 'AFSA' AND modulo_id = 3;

-- Sucesiones
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, diligencias, cs_defecto, ca_defecto, ce_defecto, honorario_tipo, honorario_factor) VALUES
    (4,'TE', 'Testamento',                         3,  0, 1, 0, 0, 'sin_cuantia',  1.0000),
    (4,'DH', 'Declaración de Herederos',           8,  0, 1, 1, 0, 'acta',         1.0000),
    (4,'RH', 'Renuncia de Herencia',               3,  0, 1, 1, 0, 'sin_cuantia',  1.0000),
    (4,'UV', 'Últimas Voluntades / Testamento Vital', 4, 0, 1, 1, 0, 'sin_cuantia', 1.0000),
    (4,'ACS','Acta Certificado Sucesorio Europeo', 11, 0, 1, 1, 0, 'acta',         1.0000),
    (4,'ELD','Entrega de Legítima Dineraria',      11, 0, 1, 1, 0, 'con_cuantia',  0.9500),
    (4,'ELB','Entrega de Legítima de Bienes',      11, 0, 1, 1, 0, 'con_cuantia',  0.9500),
    (4,'VDH','Venta de Derechos Hereditarios',     11, 0, 1, 1, 0, 'con_cuantia',  0.9500),
    (4,'DO', 'Donación',                           NULL,0, 1, 1, 0, 'con_cuantia', 0.9500),
    (4,'AH', 'Acta de Herencia',                   NULL,0, 1, 1, 0, 'con_cuantia', 0.9500),
    (4,'HE', 'Herencia',                           NULL,0, 1, 1, 0, 'con_cuantia', 0.9500);

-- Poderes
INSERT INTO tipos_acto (modulo_id, codigo, nombre, folios_matriz_min, cs_defecto, ca_defecto, honorario_tipo, aplica_irpf) VALUES
    (5,'P','Personalizado',           6,  1, 1, 'sin_cuantia', 1),
    (5,'G','General',                 7,  2, 1, 'sin_cuantia', 0),
    (5,'E','Especial',                6,  1, 1, 'sin_cuantia', 1),
    (5,'M','Mercantil General',       9,  1, 1, 'sin_cuantia', 1),
    (5,'S','Preventivo Simple',       8,  2, 1, 'sin_cuantia', 0),
    (5,'R','Preventivo Recíproco',    8,  3, 1, 'sin_cuantia', 0),
    (5,'L','Pleitos',                 8,  1, 1, 'sin_cuantia', 0),  -- cuantia / 2
    (5,'T','Sustitución',             4,  1, 1, 'sin_cuantia', 1),
    (5,'A','Subapoderamiento',        4,  1, 1, 'sin_cuantia', 1),
    (5,'V','Revocación',              7,  2, 1, 'sin_cuantia', 1),
    (5,'N','Renuncia',                7,  2, 1, 'sin_cuantia', 1),
    (5,'F','Ratificación',            4,  1, 1, 'sin_cuantia', 1);

-- Pólizas (sub-tipos por vencimiento/garantes)
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf) VALUES
    (6,'POL_SC_C','Póliza sin garantes, venc. ≤6 meses',  'escala_polizas', 1),
    (6,'POL_CC_C','Póliza con garantes, venc. ≤6 meses',  'escala_polizas', 1),
    (6,'POL_SC_L','Póliza sin garantes, venc. >6 meses',  'escala_polizas', 1),
    (6,'POL_CC_L','Póliza con garantes, venc. >6 meses',  'escala_polizas', 1);

-- Legitimaciones, Testimonios, Segundas Copias (actos por ítem)
INSERT INTO tipos_acto (modulo_id, codigo, nombre, honorario_tipo, aplica_irpf) VALUES
    (7,'LEGI','Legitimación de Firma',        'fijo', 1),
    (8,'TEST','Testimonio de Documento',      'fijo', 1),
    (9,'SC_S','Segunda Copia Simple',         'fijo', 1),
    (9,'SC_A','Segunda Copia Autorizada',     'fijo', 1),
    (9,'SC_E','Segunda Copia Electrónica',    'fijo', 1);

-- -----------------------------------------------------------------------------
-- Campos de formulario por tipo de acto
-- -----------------------------------------------------------------------------
CREATE TABLE campos_formulario (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    tipo_acto_id    SMALLINT UNSIGNED   NOT NULL,
    codigo          VARCHAR(60)         NOT NULL,
    etiqueta        VARCHAR(200)        NOT NULL,
    tipo_dato       ENUM('entero','decimal','moneda','radio','select',
                         'checkbox','texto','fecha','rango_entero')
                    NOT NULL DEFAULT 'entero',
    valor_defecto   VARCHAR(200),
    valor_min       DECIMAL(15,2),
    valor_max       DECIMAL(15,2),
    requerido       TINYINT(1)          NOT NULL DEFAULT 1,
    solo_lectura    TINYINT(1)          NOT NULL DEFAULT 0,
    es_testimonio   TINYINT(1)          NOT NULL DEFAULT 0,  -- Suma al coste de testimonios
    es_importe      TINYINT(1)          NOT NULL DEFAULT 0,  -- Es una cuantía para calcular honorarios
    tooltip         TEXT,
    orden           TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_campo_tipo (tipo_acto_id),
    CONSTRAINT fk_campo_tipo FOREIGN KEY (tipo_acto_id) REFERENCES tipos_acto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opciones para campos radio/select
CREATE TABLE campos_opciones (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    campo_id    INT UNSIGNED    NOT NULL,
    valor       VARCHAR(50)     NOT NULL,
    etiqueta    VARCHAR(200)    NOT NULL,
    orden       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_opcion_campo (campo_id),
    CONSTRAINT fk_opcion_campo FOREIGN KEY (campo_id) REFERENCES campos_formulario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Documentos que se pueden incorporar en un acto
CREATE TABLE documentos_incorporables (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    tipo_acto_id    SMALLINT UNSIGNED   NOT NULL,
    codigo          VARCHAR(60)         NOT NULL,
    nombre          VARCHAR(200)        NOT NULL,
    folios_defecto  TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    obligatorio     TINYINT(1)          NOT NULL DEFAULT 0,
    orden           TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_doc_tipo (tipo_acto_id),
    CONSTRAINT fk_doc_tipo FOREIGN KEY (tipo_acto_id) REFERENCES tipos_acto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Documentos PDR
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id, 'libro_familia',        'Libro de Familia',        2, 0, 1 FROM tipos_acto WHERE codigo='PDR' AND modulo_id=1;
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id, 'sentencia_divorcio',   'Sentencia de Divorcio',   2, 0, 2 FROM tipos_acto WHERE codigo='PDR' AND modulo_id=1;
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id, 'convivencia_previa',   'Convivencia Previa',      2, 0, 3 FROM tipos_acto WHERE codigo='PDR' AND modulo_id=1;
INSERT INTO documentos_incorporables (tipo_acto_id, codigo, nombre, folios_defecto, obligatorio, orden)
SELECT id, 'contrato_alquiler',    'Contrato de Alquiler',    4, 0, 4 FROM tipos_acto WHERE codigo='PDR' AND modulo_id=1;

-- =============================================================================
-- BLOQUE 2: ESCALAS ARANCELARIAS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Escalas de honorarios (progresivas por cuantía)
-- -----------------------------------------------------------------------------
CREATE TABLE escalas_honorarios (
    id          TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    codigo      VARCHAR(50)         NOT NULL UNIQUE,
    nombre      VARCHAR(150)        NOT NULL,
    descripcion TEXT,
    activo      TINYINT(1)          NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO escalas_honorarios (codigo, nombre) VALUES
    ('general',             'Escala General (actos con cuantía)'),
    ('polizas_sg_corto',    'Pólizas sin garantes, vencimiento ≤6 meses'),
    ('polizas_cg_corto',    'Pólizas con garantes, vencimiento ≤6 meses'),
    ('polizas_sg_largo',    'Pólizas sin garantes, vencimiento >6 meses'),
    ('polizas_cg_largo',    'Pólizas con garantes, vencimiento >6 meses');

-- Tramos de cada escala
CREATE TABLE escalas_tramos (
    id                  SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    escala_id           TINYINT UNSIGNED    NOT NULL,
    limite_inferior     DECIMAL(15,2)       NOT NULL DEFAULT 0.00,
    limite_superior     DECIMAL(15,2),                              -- NULL = sin límite
    importe_fijo        DECIMAL(12,4)       NOT NULL DEFAULT 0.0000, -- Acumulado de tramos anteriores
    porcentaje_marginal DECIMAL(10,8)       NOT NULL DEFAULT 0.00000000, -- % aplicado al exceso
    orden               TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_tramo_escala (escala_id),
    CONSTRAINT fk_tramo_escala FOREIGN KEY (escala_id) REFERENCES escalas_honorarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Escala general
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,          0.00,      6010.12,   90.1500, 0.00000000, 1 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,       6010.13,     30050.61,   90.1500, 0.00450000, 2 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      30050.62,     60101.21,  198.3300, 0.00150000, 3 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      60101.22,    150253.03,  243.4100, 0.00100000, 4 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     150253.04,    601012.10,  333.5600, 0.00050000, 5 FROM escalas_honorarios WHERE codigo='general';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     601012.11,         NULL,  558.9400, 0.00030000, 6 FROM escalas_honorarios WHERE codigo='general';

-- Pólizas sin garantes, vencimiento <= 6 meses
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,          0.00,    240404.84,    0.0000, 0.00200000, 1 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     240404.85,    300506.05,  480.8097, 0.00100000, 2 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     300506.06,         NULL,  541.3097, 0.00025000, 3 FROM escalas_honorarios WHERE codigo='polizas_sg_corto';

-- Pólizas con garantes, vencimiento <= 6 meses  (= sin garantes vencimiento largo)
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,          0.00,     90151.81,    0.0000, 0.00300000, 1 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      90151.82,    150253.03,  270.4555, 0.00200000, 2 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     150253.04,    300506.05,  390.9594, 0.00100000, 3 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     300506.06,         NULL,  541.4594, 0.00025000, 4 FROM escalas_honorarios WHERE codigo='polizas_cg_corto';

-- Pólizas sin garantes, vencimiento > 6 meses (igual a polizas_cg_corto)
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT et.escala_id_destino, et.limite_inferior, et.limite_superior, et.importe_fijo, et.porcentaje_marginal, et.orden
FROM escalas_tramos et
INNER JOIN escalas_honorarios eh ON et.escala_id = eh.id AND eh.codigo = 'polizas_cg_corto'
CROSS JOIN (SELECT id AS escala_id_destino FROM escalas_honorarios WHERE codigo = 'polizas_sg_largo') destino;

-- Pólizas con garantes, vencimiento > 6 meses (tabla más alta)
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,          0.00,     48080.97,    0.0000, 0.00450000, 1 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      48080.98,     90151.81,  216.3644, 0.00150000, 2 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,      90151.82,    150253.03,  279.6421, 0.00300000, 3 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     150253.04,    300506.05,  460.0978, 0.00100000, 4 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';
INSERT INTO escalas_tramos (escala_id, limite_inferior, limite_superior, importe_fijo, porcentaje_marginal, orden)
SELECT id,     300506.06,         NULL,  610.5978, 0.00025000, 5 FROM escalas_honorarios WHERE codigo='polizas_cg_largo';

-- -----------------------------------------------------------------------------
-- Constantes del sistema (tarifas y precios unitarios)
-- -----------------------------------------------------------------------------
CREATE TABLE constantes (
    id              TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    codigo          VARCHAR(60)         NOT NULL UNIQUE,
    nombre          VARCHAR(200)        NOT NULL,
    valor           DECIMAL(15,6)       NOT NULL,
    tipo            ENUM('precio','porcentaje','factor','entero') NOT NULL DEFAULT 'precio',
    descripcion     TEXT,
    vigente_desde   DATE,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)        NOT NULL,
    apellidos       VARCHAR(150),
    email           VARCHAR(200)        NOT NULL,
    password_hash   VARCHAR(255)        NOT NULL,
    rol             ENUM('admin','notario','oficial','auxiliar') NOT NULL DEFAULT 'auxiliar',
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    ultimo_acceso   TIMESTAMP           NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE clientes (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    tipo            ENUM('particular','empresa') NOT NULL DEFAULT 'particular',
    -- Persona física
    nombre          VARCHAR(100),
    apellidos       VARCHAR(150),
    -- Empresa
    razon_social    VARCHAR(200),
    -- Datos comunes
    nif_cif         VARCHAR(20),
    email           VARCHAR(200),
    telefono        VARCHAR(20),
    direccion       VARCHAR(300),
    ciudad          VARCHAR(100),
    codigo_postal   VARCHAR(10),
    provincia       VARCHAR(100),
    pais            VARCHAR(50)         NOT NULL DEFAULT 'España',
    -- Relación notaría
    es_empresa      TINYINT(1)          NOT NULL DEFAULT 0,  -- Aplica IRPF
    observaciones   TEXT,
    activo          TINYINT(1)          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_cliente_nif (nif_cif),
    KEY idx_cliente_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- BLOQUE 4: MINUTAS Y PRESUPUESTOS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Minuta principal (cabecera del presupuesto/cálculo)
-- -----------------------------------------------------------------------------
CREATE TABLE minutas (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    referencia      VARCHAR(30)                                 UNIQUE, -- Ej: 2024/001234
    tipo            ENUM('simulacion','presupuesto','factura')  NOT NULL DEFAULT 'simulacion',
    estado          ENUM('borrador','emitido','enviado','aceptado','facturado','cancelado')
                    NOT NULL DEFAULT 'borrador',
    -- Relaciones
    usuario_id      INT UNSIGNED,
    cliente_id      INT UNSIGNED,
    tipo_acto_id    SMALLINT UNSIGNED   NOT NULL,
    -- Datos del titular (en el momento del cálculo)
    titular_nombre  VARCHAR(300),
    titular_es_empresa TINYINT(1)       NOT NULL DEFAULT 0,
    -- Datos del acto
    descripcion_acto TEXT,                  -- Nombre del tipo de acto en texto libre
    -- Importes calculados
    subtotal        DECIMAL(12,2)       NOT NULL DEFAULT 0.00,
    iva_pct         DECIMAL(5,2)        NOT NULL DEFAULT 21.00,
    iva_importe     DECIMAL(12,2)       NOT NULL DEFAULT 0.00,
    irpf_pct        DECIMAL(5,2)        NOT NULL DEFAULT 15.00,
    irpf_importe    DECIMAL(12,2)       NOT NULL DEFAULT 0.00,
    papel_importe   DECIMAL(12,2)       NOT NULL DEFAULT 0.00,   -- Papel timbrado (suplido)
    suplidos_otros  DECIMAL(12,2)       NOT NULL DEFAULT 0.00,   -- Otros suplidos
    total           DECIMAL(12,2)       NOT NULL DEFAULT 0.00,
    -- Trazabilidad
    ip_origen       VARCHAR(45),
    comentario      TEXT,
    -- Email
    enviado_email   TINYINT(1)          NOT NULL DEFAULT 0,
    -- Timestamps
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_minuta_usuario (usuario_id),
    KEY idx_minuta_cliente (cliente_id),
    KEY idx_minuta_tipo_acto (tipo_acto_id),
    KEY idx_minuta_estado (estado),
    KEY idx_minuta_fecha (created_at),
    CONSTRAINT fk_minuta_usuario   FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)   ON DELETE SET NULL,
    CONSTRAINT fk_minuta_cliente   FOREIGN KEY (cliente_id)    REFERENCES clientes(id)   ON DELETE SET NULL,
    CONSTRAINT fk_minuta_tipo_acto FOREIGN KEY (tipo_acto_id)  REFERENCES tipos_acto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Parámetros de entrada de cada minuta (valores que introdujo el usuario)
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_parametros (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    campo_codigo    VARCHAR(60)         NOT NULL,   -- Código del campo del formulario
    campo_etiqueta  VARCHAR(200),                   -- Texto del label
    valor_texto     VARCHAR(500),                   -- Valor como string
    valor_numerico  DECIMAL(15,4),                  -- Valor numérico si aplica
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_param_minuta (minuta_id),
    CONSTRAINT fk_param_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Líneas del desglose de resultado
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_lineas (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    seccion         VARCHAR(80)         NOT NULL DEFAULT 'notaria',
                    -- 'notaria','correos','persona','municipio','tramitacion','acta_final'
    concepto        VARCHAR(250)        NOT NULL,
    tipo_linea      ENUM(
                        'honorario_sin_cuantia',
                        'honorario_con_cuantia',
                        'folio_matriz',
                        'copia_simple',
                        'copia_autorizada',
                        'copia_electronica',
                        'testimonio',
                        'diligencia',
                        'legitimacion',
                        'salida_notario',
                        'mensajeria',
                        'registro_mercantil',
                        'apostilla',
                        'protocolo_electronico',
                        'tramitacion',
                        'custodia',
                        'suplido_papel',
                        'suplido_otro',
                        'subtotal',
                        'iva',
                        'irpf',
                        'total'
                    ) NOT NULL,
    cantidad        DECIMAL(10,3)                   DEFAULT 1.000,
    precio_unitario DECIMAL(14,6),
    importe         DECIMAL(12,2)       NOT NULL,
    es_negativo     TINYINT(1)          NOT NULL DEFAULT 0,  -- 1 = descuento/retención
    es_subtotal     TINYINT(1)          NOT NULL DEFAULT 0,
    es_total        TINYINT(1)          NOT NULL DEFAULT 0,
    orden           SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_linea_minuta (minuta_id),
    CONSTRAINT fk_linea_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Copias solicitadas en una minuta
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_copias (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    tipo_copia      ENUM('simple','autorizada','electronica') NOT NULL,
    cantidad        TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    n_folios        SMALLINT UNSIGNED,
    coste_unitario  DECIMAL(12,6),
    coste_total     DECIMAL(12,2),
    destino         VARCHAR(100),                   -- 'Registro Civil', 'Interesado', etc.
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_copia_minuta (minuta_id),
    CONSTRAINT fk_copia_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Documentos incorporados en una minuta
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_documentos (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    documento_id    INT UNSIGNED,                   -- NULL si es documento libre
    nombre_libre    VARCHAR(200),                   -- Si no está en el catálogo
    n_folios        SMALLINT UNSIGNED   NOT NULL DEFAULT 1,
    coste_testimonio DECIMAL(10,2),                 -- Coste calculado del testimonio
    incorporado     TINYINT(1)          NOT NULL DEFAULT 1, -- Si se suma al total de folios
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_docminuta_minuta (minuta_id),
    KEY idx_docminuta_doc (documento_id),
    CONSTRAINT fk_docminuta_minuta   FOREIGN KEY (minuta_id)   REFERENCES minutas(id) ON DELETE CASCADE,
    CONSTRAINT fk_docminuta_catalogo FOREIGN KEY (documento_id) REFERENCES documentos_incorporables(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- BLOQUE 5: DATOS ESPECÍFICOS POR MÓDULO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Datos específicos de pólizas
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_polizas (
    minuta_id           INT UNSIGNED    NOT NULL,
    importe_contrato    DECIMAL(15,2)   NOT NULL,
    vencimiento         ENUM('corto','largo') NOT NULL,  -- corto=≤6m, largo=>6m
    tiene_garantes      TINYINT(1)      NOT NULL DEFAULT 0,
    honorarios_brutos   DECIMAL(12,4),
    aplico_minimo       TINYINT(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_poliza_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de legitimaciones
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_legitimaciones (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    n_documento     TINYINT UNSIGNED    NOT NULL DEFAULT 1,  -- Número de documento
    n_firmas        TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    coste           DECIMAL(10,2),
    PRIMARY KEY (id),
    KEY idx_legi_minuta (minuta_id),
    CONSTRAINT fk_legi_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de testimonios
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_testimonios (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    n_documento     TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    n_paginas       SMALLINT UNSIGNED   NOT NULL DEFAULT 1,
    n_copias        TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    coste_honor     DECIMAL(10,2),
    coste_suplido   DECIMAL(10,2),
    PRIMARY KEY (id),
    KEY idx_testi_minuta (minuta_id),
    CONSTRAINT fk_testi_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de segundas copias
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_segundas_copias (
    minuta_id           INT UNSIGNED    NOT NULL,
    tipo_copia          ENUM('simple','autorizada','electronica') NOT NULL,
    n_folios            SMALLINT UNSIGNED NOT NULL,
    fecha_original      DATE,
    n_copias            TINYINT UNSIGNED NOT NULL DEFAULT 1,
    antiguedad_annos    SMALLINT UNSIGNED,          -- Calculado desde fecha_original
    aplico_doble        TINYINT(1) NOT NULL DEFAULT 0, -- Si antigüedad > 5 años
    honor_base          DECIMAL(12,4),
    coste_custodia      DECIMAL(10,2) DEFAULT 0.00,
    coste_suplido       DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_sc_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de inmobiliario (detalles extra)
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_inmobiliario (
    minuta_id               INT UNSIGNED    NOT NULL,
    n_fincas                TINYINT UNSIGNED NOT NULL DEFAULT 1,
    es_vivienda             TINYINT(1)      NOT NULL DEFAULT 0,
    comprador_es_empresa    TINYINT(1)      NOT NULL DEFAULT 0,
    vendedor_es_empresa     TINYINT(1)      NOT NULL DEFAULT 0,
    -- Préstamo específico
    tiene_fianza            TINYINT(1)      NOT NULL DEFAULT 0,
    importe_fianza          DECIMAL(15,2),
    tiene_pigno             TINYINT(1)      NOT NULL DEFAULT 0,
    importe_pigno           DECIMAL(15,2),
    tiene_distribucion      TINYINT(1)      NOT NULL DEFAULT 0,
    importe_distribucion    DECIMAL(15,2),
    interes_ordinario_pct   DECIMAL(6,4),
    interes_ordinario_annos TINYINT UNSIGNED,
    interes_demora_pct      DECIMAL(6,4),
    interes_demora_annos    TINYINT UNSIGNED,
    importe_costas          DECIMAL(12,2),
    -- Totales de honorarios
    honor_principal         DECIMAL(12,4),
    honor_fianza            DECIMAL(12,4),
    honor_pigno             DECIMAL(12,4),
    honor_distribucion      DECIMAL(12,4),
    descuento_pct_aplicado  DECIMAL(5,2),
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_inmo_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de poderes
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_poderes (
    minuta_id           INT UNSIGNED        NOT NULL,
    n_poderdantes       TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    n_apoderados        TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    tiene_tramitacion   TINYINT(1)          NOT NULL DEFAULT 0,
    tiene_apostilla     TINYINT(1)          NOT NULL DEFAULT 0,
    apostilla_tipo      ENUM('urgente','normal'),
    tiene_sustitucion   TINYINT(1)          NOT NULL DEFAULT 0,
    n_folios_sustitucion TINYINT UNSIGNED,
    tiene_mensajeria    TINYINT(1)          NOT NULL DEFAULT 0,
    salida_notario      TINYINT(1)          NOT NULL DEFAULT 0,
    -- Notificaciones
    n_notif_correo      TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    n_notif_persona     TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    n_notif_municipio   TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    -- Honor tramitación
    honor_tramitacion   DECIMAL(12,2)       DEFAULT 0.00,
    honor_gestion       DECIMAL(12,2)       DEFAULT 0.00,
    PRIMARY KEY (minuta_id),
    CONSTRAINT fk_poder_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Datos específicos de sucesiones (herederos)
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_sucesiones_herederos (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    n_heredero      TINYINT UNSIGNED    NOT NULL,
    nombre          VARCHAR(200),
    importe         DECIMAL(15,2)       NOT NULL DEFAULT 0.00,
    honor_calculado DECIMAL(12,4),
    PRIMARY KEY (id),
    KEY idx_hered_minuta (minuta_id),
    CONSTRAINT fk_hered_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- BLOQUE 6: HISTORIAL Y COMUNICACIONES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Historial de envíos por email
-- -----------------------------------------------------------------------------
CREATE TABLE minuta_emails (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    minuta_id       INT UNSIGNED        NOT NULL,
    email_destino   VARCHAR(200)        NOT NULL,
    asunto          VARCHAR(300),
    estado          ENUM('pendiente','enviado','error') NOT NULL DEFAULT 'pendiente',
    error_detalle   TEXT,
    recaptcha_token VARCHAR(500),
    enviado_at      TIMESTAMP           NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_email_minuta (minuta_id),
    CONSTRAINT fk_email_minuta FOREIGN KEY (minuta_id) REFERENCES minutas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Log de actividad del sistema
-- -----------------------------------------------------------------------------
CREATE TABLE log_actividad (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    usuario_id      INT UNSIGNED,
    accion          VARCHAR(100)        NOT NULL,   -- 'crear_minuta', 'enviar_email', etc.
    entidad_tipo    VARCHAR(50),                    -- 'minuta', 'cliente', etc.
    entidad_id      INT UNSIGNED,
    detalle         JSON,
    ip              VARCHAR(45),
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_log_usuario (usuario_id),
    KEY idx_log_fecha (created_at),
    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- BLOQUE 7: VISTAS ÚTILES
-- =============================================================================

CREATE OR REPLACE VIEW v_minutas_resumen AS
SELECT
    m.id,
    m.referencia,
    m.tipo,
    m.estado,
    mo.nombre       AS modulo,
    ta.codigo       AS codigo_acto,
    ta.nombre       AS tipo_acto,
    m.titular_nombre,
    m.titular_es_empresa,
    m.subtotal,
    m.iva_importe,
    m.irpf_importe,
    m.papel_importe,
    m.total,
    u.nombre        AS usuario,
    c.nombre        AS cliente_nombre,
    c.tipo          AS cliente_tipo,
    m.created_at
FROM minutas m
LEFT JOIN tipos_acto  ta ON m.tipo_acto_id = ta.id
LEFT JOIN modulos     mo ON ta.modulo_id   = mo.id
LEFT JOIN usuarios    u  ON m.usuario_id   = u.id
LEFT JOIN clientes    c  ON m.cliente_id   = c.id;

CREATE OR REPLACE VIEW v_minuta_desglose AS
SELECT
    m.id            AS minuta_id,
    m.referencia,
    mo.nombre       AS modulo,
    ta.nombre       AS tipo_acto,
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
INNER JOIN minutas    m  ON ml.minuta_id  = m.id
INNER JOIN tipos_acto ta ON m.tipo_acto_id = ta.id
INNER JOIN modulos    mo ON ta.modulo_id   = mo.id
ORDER BY m.id, ml.orden;

SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================
-- FIN DEL ESQUEMA
-- =============================================================================
