-- ============================================================
--  DDL + DATA  ·  Calculadora Notarial
--  Generado desde datos_extraidos.json
-- ============================================================

BEGIN;

-- ─── EXTENSIONES ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TIPOS ENUM ─────────────────────────────────────────────────────────────
CREATE TYPE tipo_concepto_notarial AS ENUM (
    'honorario_fijo',
    'testimonio',
    'diligencia'
);

CREATE TYPE tipo_medio_pago AS ENUM (
    'No',
    'Si',
    'Op'
);


-- ============================================================
--  1. CONSTANTES DEL ARANCEL
-- ============================================================
CREATE TABLE constante_arancel (
    clave                       VARCHAR(60)     PRIMARY KEY,
    descripcion                 TEXT            NOT NULL,
    valor                       NUMERIC(12,6)   NOT NULL
);
COMMENT ON TABLE constante_arancel IS
    'Valores base del arancel notarial (IVA, IRPF, precios por folio, etc.)';


-- ============================================================
--  2. TABLA DE TRAMOS DEL ARANCEL (honorarios por cuantía)
-- ============================================================
CREATE TABLE arancel_tramo (
    id                          SERIAL          PRIMARY KEY,
    orden                       SMALLINT        NOT NULL,
    desde                       NUMERIC(14,2)   NOT NULL,
    hasta                       NUMERIC(14,2)   NOT NULL,
    fijo                        NUMERIC(10,4)   NOT NULL DEFAULT 0,
    permil                      NUMERIC(8,5)    NOT NULL DEFAULT 0,
    acumulado                   NUMERIC(10,4)   NOT NULL DEFAULT 0,
    CONSTRAINT arancel_tramo_orden_unique UNIQUE (orden)
);
COMMENT ON TABLE arancel_tramo IS
    'Tramos del arancel notarial para calcular honorarios según cuantía del acto';
COMMENT ON COLUMN arancel_tramo.permil     IS 'Tanto por mil aplicado dentro del tramo';
COMMENT ON COLUMN arancel_tramo.acumulado  IS 'Honorario acumulado de tramos anteriores';


-- ============================================================
--  3. CONCEPTOS NOTARIALES (honorarios fijos, testimonios, diligencias)
-- ============================================================
CREATE TABLE concepto_notarial (
    id                          VARCHAR(60)     PRIMARY KEY,
    label                       TEXT            NOT NULL,
    tipo                        tipo_concepto_notarial NOT NULL,
    coste                       NUMERIC(10,4),              -- para honorarios fijos y diligencias
    folios_defecto              SMALLINT,                   -- para testimonios
    formula_especial            BOOLEAN         NOT NULL DEFAULT FALSE,
    nota_coste                  TEXT,
    CONSTRAINT chk_coste_o_folios CHECK (
        (tipo IN ('honorario_fijo','diligencia') AND coste IS NOT NULL)
        OR (tipo = 'testimonio' AND folios_defecto IS NOT NULL)
    )
);
COMMENT ON TABLE concepto_notarial IS
    'Ítems del arancel notarial: honorarios fijos, testimonios/certificaciones y diligencias';
COMMENT ON COLUMN concepto_notarial.formula_especial IS
    'TRUE = usa fórmula copia_autorizada_folio (test_medio_pago); FALSE = usa testimonio_base + folios*copia_simple';


-- ============================================================
--  4. GASTOS
-- ============================================================
CREATE TABLE gasto (
    id                          VARCHAR(60)     PRIMARY KEY,
    label                       TEXT            NOT NULL,
    coste                       NUMERIC(10,2)   NOT NULL DEFAULT 0,
    editable                    BOOLEAN         NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE gasto IS
    'Gastos de gestión asociables a un acto notarial';


-- ============================================================
--  5. SUPLIDOS
-- ============================================================
CREATE TABLE suplido (
    id                          VARCHAR(60)     PRIMARY KEY,
    label                       TEXT            NOT NULL,
    coste                       NUMERIC(10,2)   NOT NULL DEFAULT 0,
    editable                    BOOLEAN         NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE suplido IS
    'Suplidos (desembolsos por cuenta del cliente) asociables a un acto notarial';


-- ============================================================
--  6. ROLES DE PARTICIPANTES
-- ============================================================
CREATE TABLE rol_participante (
    id                          SERIAL          PRIMARY KEY,
    nombre                      VARCHAR(80)     NOT NULL UNIQUE
);
COMMENT ON TABLE rol_participante IS
    'Roles posibles de los participantes en un acto notarial';


-- ============================================================
--  7. CATEGORÍAS DE LA CALCULADORA
--     (las 4 categorías de cálculo: compraventa, hipoteca, testamento, sociedad)
-- ============================================================
CREATE TABLE categoria_calc (
    id                          VARCHAR(30)     PRIMARY KEY,
    label                       TEXT            NOT NULL,
    match_prefix                VARCHAR(10)     NOT NULL
);
COMMENT ON TABLE categoria_calc IS
    'Categorías de la calculadora notarial (compraventa, hipoteca, testamento, sociedad). '
    'match_prefix identifica el prefijo del ID de acto notarial que activa esta categoría';


-- ============================================================
--  8. RELACIONES CATEGORÍA_CALC ↔ CONCEPTO_NOTARIAL
-- ============================================================
CREATE TABLE categoria_calc_concepto (
    categoria_id                VARCHAR(30)     NOT NULL
        REFERENCES categoria_calc(id) ON DELETE CASCADE,
    concepto_id                 VARCHAR(60)     NOT NULL
        REFERENCES concepto_notarial(id) ON DELETE CASCADE,
    orden                       SMALLINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (categoria_id, concepto_id)
);
COMMENT ON TABLE categoria_calc_concepto IS
    'Conceptos notariales (arancel) pre-asociados a cada categoría de la calculadora';


-- ============================================================
--  9. RELACIONES CATEGORÍA_CALC ↔ GASTO
-- ============================================================
CREATE TABLE categoria_calc_gasto (
    categoria_id                VARCHAR(30)     NOT NULL
        REFERENCES categoria_calc(id) ON DELETE CASCADE,
    gasto_id                    VARCHAR(60)     NOT NULL
        REFERENCES gasto(id) ON DELETE CASCADE,
    orden                       SMALLINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (categoria_id, gasto_id)
);
COMMENT ON TABLE categoria_calc_gasto IS
    'Gastos pre-asociados a cada categoría de la calculadora';


-- ============================================================
--  10. RELACIONES CATEGORÍA_CALC ↔ SUPLIDO
-- ============================================================
CREATE TABLE categoria_calc_suplido (
    categoria_id                VARCHAR(30)     NOT NULL
        REFERENCES categoria_calc(id) ON DELETE CASCADE,
    suplido_id                  VARCHAR(60)     NOT NULL
        REFERENCES suplido(id) ON DELETE CASCADE,
    orden                       SMALLINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (categoria_id, suplido_id)
);
COMMENT ON TABLE categoria_calc_suplido IS
    'Suplidos pre-asociados a cada categoría de la calculadora';


-- ============================================================
--  11. CATEGORÍAS DE ACTOS NOTARIALES  (catálogo principal)
-- ============================================================
CREATE TABLE categoria_acto (
    id                          CHAR(2)         PRIMARY KEY,
    nombre                      VARCHAR(80)     NOT NULL,
    icono                       VARCHAR(10),
    orden                       SMALLINT        NOT NULL
);
COMMENT ON TABLE categoria_acto IS
    'Categorías del catálogo completo de actos notariales (20 categorías)';


-- ============================================================
--  12. ACTOS NOTARIALES
-- ============================================================
CREATE TABLE acto_notarial (
    id                          VARCHAR(10)     PRIMARY KEY,
    categoria_id                CHAR(2)         NOT NULL
        REFERENCES categoria_acto(id) ON DELETE RESTRICT,
    label                       TEXT            NOT NULL,
    con_cuantia                 BOOLEAN         NOT NULL DEFAULT FALSE,
    arancel_fijo                NUMERIC(8,4)    NOT NULL DEFAULT 0,
    folio_fijo                  NUMERIC(8,4)    NOT NULL DEFAULT 0,
    iva_aplicable               BOOLEAN         NOT NULL DEFAULT TRUE,
    requiere_cuantia_registro   BOOLEAN         NOT NULL DEFAULT FALSE,
    medio_pago                  tipo_medio_pago NOT NULL DEFAULT 'No',
    clase_liquidacion           VARCHAR(10)     NOT NULL DEFAULT '',
    liquidacion_fiscal          BOOLEAN         NOT NULL DEFAULT FALSE,
    tiene_variantes             BOOLEAN         NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE acto_notarial IS
    'Catálogo completo de actos notariales (411+ actos en 20 categorías)';
COMMENT ON COLUMN acto_notarial.arancel_fijo          IS 'Multiplicador de arancel fijo (>0 si aplica reducción/bonificación)';
COMMENT ON COLUMN acto_notarial.folio_fijo            IS 'Folios fijos para el cálculo cuando no depende de cuantía';
COMMENT ON COLUMN acto_notarial.clase_liquidacion     IS 'Código de clase/modalidad para liquidación fiscal';
COMMENT ON COLUMN acto_notarial.tiene_variantes       IS 'TRUE si el acto tiene sub-variantes registradas en acto_notarial_variante';


-- ============================================================
--  13. VARIANTES DE ACTOS NOTARIALES
-- ============================================================
CREATE TABLE acto_notarial_variante (
    id                          SERIAL          PRIMARY KEY,
    acto_id                     VARCHAR(10)     NOT NULL
        REFERENCES acto_notarial(id) ON DELETE CASCADE,
    label_variante              TEXT            NOT NULL,   -- nombre corto de la variante
    label_completo              TEXT            NOT NULL,   -- label completo (acto + variante)
    con_cuantia                 BOOLEAN         NOT NULL DEFAULT FALSE,
    arancel_fijo                NUMERIC(8,4)    NOT NULL DEFAULT 0,
    folio_fijo                  NUMERIC(8,4)    NOT NULL DEFAULT 0,
    iva_aplicable               BOOLEAN         NOT NULL DEFAULT TRUE,
    requiere_cuantia_registro   BOOLEAN         NOT NULL DEFAULT FALSE,
    medio_pago                  tipo_medio_pago NOT NULL DEFAULT 'No',
    clase_liquidacion           VARCHAR(10)     NOT NULL DEFAULT '',
    liquidacion_fiscal          BOOLEAN         NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE acto_notarial_variante IS
    'Variantes de actos notariales con sus propios parámetros de cálculo';
CREATE INDEX idx_variante_acto ON acto_notarial_variante(acto_id);


-- ============================================================
--  14. DEFAULTS — PROTOCOLO ELECTRÓNICO
-- ============================================================
CREATE TABLE default_pe (
    concepto_id                 VARCHAR(60)     PRIMARY KEY
        REFERENCES concepto_notarial(id) ON DELETE CASCADE,
    folios_override             SMALLINT                    -- NULL = sin override de folios
);
COMMENT ON TABLE default_pe IS
    'Conceptos notariales activados por defecto cuando el protocolo electrónico está activo';


-- ============================================================
--  15. DEFAULTS — GASTOS PRE-MARCADOS
-- ============================================================
CREATE TABLE default_gasto (
    gasto_id                    VARCHAR(60)     PRIMARY KEY
        REFERENCES gasto(id) ON DELETE CASCADE
);
COMMENT ON TABLE default_gasto IS
    'Gastos marcados por defecto al iniciar la calculadora';


-- ============================================================
--  16. DEFAULTS — SUPLIDOS PRE-MARCADOS
-- ============================================================
CREATE TABLE default_suplido (
    suplido_id                  VARCHAR(60)     PRIMARY KEY
        REFERENCES suplido(id) ON DELETE CASCADE
);
COMMENT ON TABLE default_suplido IS
    'Suplidos marcados por defecto al iniciar la calculadora';


-- ============================================================
--  ÍNDICES ADICIONALES
-- ============================================================
CREATE INDEX idx_acto_notarial_categoria ON acto_notarial(categoria_id);
CREATE INDEX idx_concepto_tipo           ON concepto_notarial(tipo);
CREATE INDEX idx_gasto_editable          ON gasto(editable) WHERE editable = TRUE;
CREATE INDEX idx_suplido_editable        ON suplido(editable) WHERE suplido.editable = TRUE;


-- ============================================================
--  DATA INSERTS
-- ============================================================

-- 1. Constantes del arancel
INSERT INTO constante_arancel (clave, descripcion, valor) VALUES
    ('doc_sin_cuantia', 'Documento sin cuantía (base fija)', 30.05),
    ('copia_autorizada_folio', 'Copia autorizada por folio (fórmula estándar)', 3.005061),
    ('copia_autorizada_folio_12', 'Copia autorizada por folio (artículo 12)', 1.50253),
    ('copia_simple_folio', 'Copia simple por folio', 0.601012),
    ('folio_matriz_desde_5', 'Folio de matriz desde el 5º folio', 6.010121),
    ('folio_timbrado', 'Folio timbrado', 0.15),
    ('testimonio_base', 'Base fija del testimonio/certificación', 3.01),
    ('diligencia_base', 'Base fija de la diligencia', 3.01),
    ('diligencia_inscripcion', 'Diligencia relativa a la inscripción', 6.01),
    ('iva', 'IVA aplicable (%)', 21),
    ('irpf', 'IRPF a retener (%)', 15);

-- 2. Tramos del arancel
INSERT INTO arancel_tramo (orden, desde, hasta, fijo, permil, acumulado) VALUES
    (1, 0, 6010.12, 90.15, 0, 0),
    (2, 6010.13, 30050.61, 0, 4.5, 90.15),
    (3, 30050.62, 60101.21, 0, 1.5, 198.33),
    (4, 60101.22, 150253.03, 0, 1, 243.41),
    (5, 150253.04, 601012.1, 0, 0.5, 333.56),
    (6, 601012.11, 6010121.04, 0, 0.3, 558.94);

-- 3. Conceptos notariales
INSERT INTO concepto_notarial (id, label, tipo, coste, folios_defecto, formula_especial, nota_coste) VALUES
    ('apod_tramit', 'Apoderamiento para tramitación', 'honorario_fijo', 30.05, NULL, FALSE, NULL),
    ('req_art106', 'Requerimiento comunicación art.106.1.b LHL', 'honorario_fijo', 36.06, NULL, FALSE, NULL),
    ('cert_catastral', 'Certificación catastral', 'testimonio', NULL, 3, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('cert_energetica', 'Certificación energética', 'testimonio', NULL, 3, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('cons_titular_real', 'Consulta de titular real', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('cons_ibi', 'Consulta relativa al pago del IBI', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('ficha_liq_trib', 'Ficha notarial liquidación tributaria', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('nota_simple', 'Nota simple', 'testimonio', NULL, 2, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('otros_test', 'Otros testimonios', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('otros_test_cotejo', 'Otros testimonios de cotejo', 'testimonio', NULL, 0, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('solic_info_reg', 'Solicitud información registral', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('test_cotejo_pe', 'Testimonio cotejo protocolo electrónico', 'testimonio', NULL, 0, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('test_recibo_ibi', 'Testimonio del recibo del IBI', 'testimonio', NULL, 1, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('test_facult_repr', 'Testimonio facultades representativas', 'testimonio', NULL, 0, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('test_hash', 'Testimonio HASH', 'testimonio', NULL, 0, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('verif_csv', 'Verificación CSV documento electrónico', 'testimonio', NULL, 2, FALSE, 'testimonio_base (3.01) + folios * copia_simple_folio (0.601012)'),
    ('test_medio_pago', 'Testimonio de medio de pago', 'testimonio', NULL, 0, TRUE, 'folios * copia_autorizada_folio (3.005061)'),
    ('dil_envio_rc', 'Diligencia de envío de copia al Registro Civil', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_pres_telem', 'Diligencia de presentación telemática art. 249', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_recep_asiento', 'Diligencia de recepción de asiento presentación', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_recep_catastro', 'Diligencia de recepción de Catastro', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_recep_pres_telem', 'Diligencia de recepción de la presentación telemática', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_recep_ayto', 'Diligencia de recepción del justif. del Ayuntamiento', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_recep_registro', 'Diligencia de recepción del justif. del Registro', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_deposito_pe', 'Diligencia depósito protocolo electrónico', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_incorp_pe', 'Diligencia incorporación prot. electrónico', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_incorp_dep_cotejo', 'Diligencia incorporación, depósito y cotejo P.E.', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_envio_catastro', 'Diligencia por envío de copia al Catastro', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_envio_ayto', 'Diligencia por envío de copia Ayuntamiento', 'diligencia', 3.01, NULL, FALSE, NULL),
    ('dil_inscripcion', 'Diligencia relativa a la inscripción', 'diligencia', 6.01, NULL, FALSE, NULL),
    ('dil_otras', 'Otras diligencias', 'diligencia', 3.01, NULL, FALSE, NULL);

-- 4. Gastos
INSERT INTO gasto (id, label, coste, editable) VALUES
    ('g_afeccion_fiscal', 'Afección fiscal', 3, FALSE),
    ('g_cancelacion_fiscal', 'Cancelación fiscal', 3, FALSE),
    ('g_cert_const_energ', 'Cert. constancia cert. energética', 6, FALSE),
    ('g_cert_pres_telem', 'Cert. pres telemática documento', 12, FALSE),
    ('g_cert_militar', 'Certificado militar', 50, FALSE),
    ('g_cert_seguro_vida', 'Certificado r seguro vida', 20, FALSE),
    ('g_cert_ult_volunt', 'Certificado ultimas voluntades', 20, FALSE),
    ('g_const_idufir', 'Constancia código idufir', 9, FALSE),
    ('g_const_coord_catas', 'Constancia estado coord. catas.', 24, FALSE),
    ('g_const_ref_catastral', 'Constancia referencia catastral', 24, FALSE),
    ('g_consulta_rm', 'Consulta al registro mercantil', 20, FALSE),
    ('g_consulta_deudas', 'Consulta de deudas', 15, FALSE),
    ('g_consulta_nif', 'Consulta NIF revocado', 4, FALSE),
    ('g_consulta_valor_ref', 'Consulta valor referencia', 15, FALSE),
    ('g_elab_estatutos', 'Elaboración de estatutos', 60, FALSE),
    ('g_elab_instancias', 'Elaboración de instancias', 60, FALSE),
    ('g_gestion_impuestos', 'Gestión de impuestos', 20, FALSE),
    ('g_gestion_plusvalias', 'Gestión de plusvalías', 20, FALSE),
    ('g_incr_anejo', 'Incr. anejo solarium', 3, FALSE),
    ('g_nota_marg_energ', 'Nota marginal cert. energética', 9, FALSE),
    ('g_obt_cert_seguros', 'Obtención cert. registro seguros', 20, FALSE),
    ('g_obt_cert_catastral', 'Obtención certificado catastral', 20, FALSE),
    ('g_obt_cert_rauv', 'Obtención certificados del rauv', 20, FALSE),
    ('g_otros_gastos', 'Otros gastos', 40, TRUE),
    ('g_peticion_nota', 'Petición de nota', 15, FALSE),
    ('g_pres_fax', 'Presentación por fax', 15, FALSE),
    ('g_pres_telematica', 'Presentación telemática', 15, FALSE),
    ('g_solicitud_cif', 'Solicitud de CIF', 30, FALSE),
    ('g_solicitud_denom', 'Solicitud denominación RMC', 30, FALSE),
    ('g_tramit_copia_plusv', 'Tramitación copia plusvalía', 0, TRUE),
    ('g_tramit_sti', 'Tramitación STI', 0, TRUE),
    ('g_varios', 'Varios', 20, TRUE);

-- 5. Suplidos
INSERT INTO suplido (id, label, coste, editable) VALUES
    ('s_na_octava', 'Nª Octava', 1.8, FALSE),
    ('s_correos', 'Correos', 10, FALSE),
    ('s_otros_suplidos', 'Otros suplidos', 10, TRUE),
    ('s_pago_signo', 'Pago por uso plataforma SIGNO (ANCERT)', 0, TRUE),
    ('s_taxi', 'Taxi', 10, FALSE);

-- 6. Roles de participantes
INSERT INTO rol_participante (nombre) VALUES
    ('Poderdante'),
    ('Apoderado'),
    ('Concedente/Consentidor'),
    ('Albacea/Contador'),
    ('Hijos'),
    ('Letrado'),
    ('Testigos'),
    ('Causante'),
    ('Invitado'),
    ('Menor'),
    ('Socio'),
    ('Requerido'),
    ('Sociedad Creada');

-- 7. Categorías de la calculadora
INSERT INTO categoria_calc (id, label, match_prefix) VALUES
    ('compraventa', 'Compraventa', '0501'),
    ('hipoteca', 'Hipoteca', '12'),
    ('testamento', 'Testamento', '02'),
    ('sociedad', 'Sociedad', '19');

-- 8. Relaciones categoría_calc ↔ concepto_notarial
INSERT INTO categoria_calc_concepto (categoria_id, concepto_id, orden) VALUES
    ('compraventa', 'cert_catastral', 1),
    ('compraventa', 'cert_energetica', 2),
    ('compraventa', 'cons_titular_real', 3),
    ('compraventa', 'cons_ibi', 4),
    ('compraventa', 'ficha_liq_trib', 5),
    ('compraventa', 'nota_simple', 6),
    ('compraventa', 'test_medio_pago', 7),
    ('compraventa', 'test_recibo_ibi', 8),
    ('compraventa', 'verif_csv', 9),
    ('compraventa', 'dil_pres_telem', 10),
    ('compraventa', 'dil_recep_asiento', 11),
    ('compraventa', 'dil_recep_catastro', 12),
    ('compraventa', 'dil_recep_ayto', 13),
    ('compraventa', 'dil_recep_registro', 14),
    ('compraventa', 'dil_deposito_pe', 15),
    ('compraventa', 'dil_incorp_pe', 16),
    ('compraventa', 'dil_envio_catastro', 17),
    ('compraventa', 'dil_envio_ayto', 18),
    ('compraventa', 'dil_inscripcion', 19),
    ('hipoteca', 'cert_catastral', 1),
    ('hipoteca', 'cons_titular_real', 2),
    ('hipoteca', 'nota_simple', 3),
    ('hipoteca', 'test_medio_pago', 4),
    ('hipoteca', 'verif_csv', 5),
    ('hipoteca', 'dil_pres_telem', 6),
    ('hipoteca', 'dil_recep_asiento', 7),
    ('hipoteca', 'dil_recep_registro', 8),
    ('hipoteca', 'dil_deposito_pe', 9),
    ('hipoteca', 'dil_incorp_pe', 10),
    ('hipoteca', 'dil_inscripcion', 11),
    ('testamento', 'dil_deposito_pe', 1),
    ('testamento', 'dil_incorp_pe', 2),
    ('sociedad', 'dil_pres_telem', 1),
    ('sociedad', 'dil_recep_asiento', 2),
    ('sociedad', 'dil_recep_registro', 3),
    ('sociedad', 'dil_deposito_pe', 4),
    ('sociedad', 'dil_incorp_pe', 5);

-- 9. Relaciones categoría_calc ↔ gasto
INSERT INTO categoria_calc_gasto (categoria_id, gasto_id, orden) VALUES
    ('compraventa', 'g_cert_const_energ', 1),
    ('compraventa', 'g_cert_pres_telem', 2),
    ('compraventa', 'g_const_idufir', 3),
    ('compraventa', 'g_const_coord_catas', 4),
    ('compraventa', 'g_const_ref_catastral', 5),
    ('compraventa', 'g_consulta_valor_ref', 6),
    ('compraventa', 'g_gestion_impuestos', 7),
    ('compraventa', 'g_gestion_plusvalias', 8),
    ('compraventa', 'g_nota_marg_energ', 9),
    ('compraventa', 'g_obt_cert_catastral', 10),
    ('compraventa', 'g_peticion_nota', 11),
    ('compraventa', 'g_pres_telematica', 12),
    ('hipoteca', 'g_cert_pres_telem', 1),
    ('hipoteca', 'g_const_idufir', 2),
    ('hipoteca', 'g_const_ref_catastral', 3),
    ('hipoteca', 'g_consulta_valor_ref', 4),
    ('hipoteca', 'g_peticion_nota', 5),
    ('hipoteca', 'g_pres_telematica', 6),
    ('sociedad', 'g_cert_pres_telem', 1),
    ('sociedad', 'g_consulta_rm', 2),
    ('sociedad', 'g_elab_estatutos', 3),
    ('sociedad', 'g_solicitud_cif', 4),
    ('sociedad', 'g_solicitud_denom', 5),
    ('sociedad', 'g_pres_telematica', 6);

-- 10. Relaciones categoría_calc ↔ suplido
INSERT INTO categoria_calc_suplido (categoria_id, suplido_id, orden) VALUES
    ('compraventa', 's_na_octava', 1),
    ('compraventa', 's_correos', 2),
    ('hipoteca', 's_na_octava', 1),
    ('hipoteca', 's_correos', 2),
    ('sociedad', 's_na_octava', 1);

-- 11. Categorías de actos notariales
INSERT INTO categoria_acto (id, nombre, icono, orden) VALUES
    ('01', 'Familia y Personal', '👨‍👩‍👧', 1),
    ('02', 'Testamentos', '📜', 2),
    ('03', 'Régimen Matrimonial', '💍', 3),
    ('04', 'Urbanismo y Fincas', '🏗️', 4),
    ('05', 'Transmisiones', '🏠', 5),
    ('06', 'Arrendamientos', '🔑', 6),
    ('07', 'Donaciones', '🎁', 7),
    ('08', 'Derechos Reales', '⚖️', 8),
    ('09', 'Actuaciones Urbanísticas', '🏙️', 9),
    ('10', 'Contratos y Obligaciones', '📝', 10),
    ('11', 'Herencias y Particiones', '📋', 11),
    ('12', 'Garantías e Hipotecas', '🏦', 12),
    ('13', 'Cancelaciones y Cartas de Pago', '❌', 13),
    ('14', 'Poderes y Autorizaciones', '✍️', 14),
    ('15', 'Protestos', '📄', 15),
    ('16', 'Actas', '📑', 16),
    ('17', 'Pólizas Mercantiles', '💼', 17),
    ('18', 'Comunidades y Entidades', '🏘️', 18),
    ('19', 'Sociedades Mercantiles', '🏢', 19),
    ('20', 'Especiales (DANA)', '🌊', 20);

-- 12. Actos notariales
INSERT INTO acto_notarial
    (id, categoria_id, label, con_cuantia, arancel_fijo, folio_fijo, iva_aplicable,
     requiere_cuantia_registro, medio_pago, clase_liquidacion, liquidacion_fiscal, tiene_variantes)
VALUES
    ('0101', '01', 'Emancipacion o habilitacion de edad', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0102', '01', 'Consentimiento complementario a menor o incapaz', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0103', '01', 'Documentacion de voluntades anticipadas', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0104', '01', 'Constitucion de patrimonio protegido', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0105', '01', 'Aportaciones a patrimonio protegido', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, TRUE),
    ('0106', '01', 'Modificacion de patrimonio protegido', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, TRUE),
    ('0107', '01', 'Extincion de patrimonio protegido', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0108', '01', 'Nombramientos de cargo tutelar para si mismo o autotutela', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0109', '01', 'Nombramientos de cargos tutelares - otros', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0110', '01', 'Actos relativos a la tutela - otros', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0111', '01', 'Reconocimiento de hijos', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0112', '01', 'Actos de orden familiar o personal - otros', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0113', '01', 'Acta de requerimiento de expediente matrimonial', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0114', '01', 'Escritura de celebracion de matrimonio', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0115', '01', 'Escritura de divorcio', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('0116', '01', 'Modificacion de acuerdo de separacion o divorcio', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0117', '01', 'Escritura de auxilio o extension de la guarda de un menor', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0118', '01', 'Acta de resolucion de Expediente Matrimonial', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0119', '01', 'Constitucion de asistencia (Decreto-ley 19/2021)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0120', '01', 'Acta de adquisicion o conservacion de la vecindad civil', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0121', '01', 'Escrituras de medidas de apoyo (ley 8/2021)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0201', '02', 'Testamento unipersonal abierto', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('0202', '02', 'Testamento mancomunado o de hermandad abierto', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0203', '02', 'Testamento cerrado y protocolizacion de testamento olografo o parroquial', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0204', '02', 'Testamento o acto de ultima voluntad - otros tipos', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0205', '02', 'Actos de trascendencia sucesoria - otros', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0206', '02', 'Contratos sucesorios forales', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0207', '02', 'Contratos sucesorios de derecho comun', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE, FALSE),
    ('0301', '03', 'Capitulaciones prenupciales - regimen de separacion de bienes', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0302', '03', 'Capitulaciones prenupciales - regimen ganancial u otro regimen', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0303', '03', 'Capitulaciones prenupciales - regimen participacion en la ganancia', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0304', '03', 'Capitulaciones prenupciales - otro regimen matrimonial', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0305', '03', 'Capitulaciones postnupciales - regimen de separacion de bienes', FALSE, 0, 36.06, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0306', '03', 'Capitulaciones postnupciales - regimen de gananciales u otro', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0307', '03', 'Capitulaciones postnupciales - regimen de partic. en la ganancia', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0308', '03', 'Capitulaciones postnupciales - otro regimen matrimonial', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0309', '03', 'Capitulaciones matrimoniales sin pactar regimen matrimonial', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0310', '03', 'Acuerdo de separacion de hecho', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0311', '03', 'Acuerdos relativos a uniones de hecho', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0312', '03', 'Liquidacion de comunidad conyugal (inter vivos)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE, FALSE),
    ('0313', '03', 'Aportacion a la sociedad conyugal', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE, TRUE),
    ('0314', '03', 'Escritura confesion privatividad/acuerdos alteran caracter bienes', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0315', '03', 'Renuncia a viudedad aragonesa', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('0316', '03', 'Acta de notoriedad para la constancia del regimen economico matrimonial', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0317', '03', 'Convenio regulador', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0318', '03', 'Modificacion convenio regulador', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0401', '04', 'Segregacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0402', '04', 'Agregacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE, FALSE),
    ('0403', '04', 'Agrupacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE, TRUE),
    ('0404', '04', 'Division material', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('0405', '04', 'Declaracion de obra nueva terminada o ampliacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN2', FALSE, TRUE),
    ('0406', '04', 'Declaracion de obra nueva en construccion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN2', FALSE, TRUE),
    ('0407', '04', 'Modificacion de obra nueva en construccion o ampliacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN2', FALSE, FALSE),
    ('0408', '04', 'Acta de finalizacion de obra nueva en construccion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0409', '04', 'Division horizontal', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE, TRUE),
    ('0410', '04', 'Extincion de division horizontal', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('0411', '04', 'Constitucion y modificacion de estatutos de division horizontal', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0412', '04', 'Constitucion, modificacion y extincion de servidumbres', TRUE, 0, 0, TRUE, TRUE, 'Op', 'IM0', FALSE, FALSE),
    ('0413', '04', 'Constitucion y modificacion y extincion der. de vuelo/subedific.', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU5', FALSE, FALSE),
    ('0414', '04', 'Constitucion, modificacion y extincion aprovechamiento por turno', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, FALSE),
    ('0415', '04', 'Constitucion de complejo urbanistico', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE, FALSE),
    ('0416', '04', 'Rectificacion descriptiva de una finca', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE, TRUE),
    ('0417', '04', 'Aprobacion o modificacion de Reglamento regimen interior de D.H y C.U.', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE, FALSE),
    ('0418', '04', 'Vinculacion OB REM', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0419', '04', 'Desvinculacion OB REM', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0501', '05', 'Compraventa inmuebles', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE, TRUE),
    ('0502', '05', 'Compraventa de otros bienes o derechos', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('0503', '05', 'Permuta', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE, TRUE),
    ('0504', '05', 'Cesion de suelo por obra futura o urbanizacion futura', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU0', FALSE, FALSE),
    ('0505', '05', 'Entrega de inmueble en ejecucion de cesion de suelo por obra', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('0506', '05', 'Transferencia onerosa de aprovechamiento urbanistico', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU0', FALSE, FALSE),
    ('0507', '05', 'Extincion de condominio', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('0508', '05', 'Adjudicacion de cooperativa a sus socios', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN4', FALSE, TRUE),
    ('0509', '05', 'Constitucion o transmision onerosa de concesiones administrativas', TRUE, 0, 0, TRUE, TRUE, 'Si', 'SD0', FALSE, FALSE),
    ('0510', '05', 'Constitucion onerosa o redencion de censo', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE, FALSE),
    ('0511', '05', 'Constitucion onerosa de derechos de uso o habitacion', TRUE, 0, 0, TRUE, TRUE, 'Si', '', FALSE, FALSE),
    ('0512', '05', 'Cesion de bienes a cambio de alimentos y/o renta', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE, FALSE),
    ('0513', '05', 'Adjudicacion a comuneros en comunidad de promocion inmobiliaria', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE, FALSE),
    ('0514', '05', 'Cesion en pago o para pago de deudas', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE, TRUE),
    ('0515', '05', 'Cesiones de bienes o derechos - otras', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE, TRUE),
    ('0516', '05', 'Compraventa de valores', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE, TRUE),
    ('0517', '05', 'Compraventa de aprovechamiento por turnos', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE, FALSE),
    ('0518', '05', 'Compraventa de Buque', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, FALSE),
    ('0519', '05', 'Adjudicacion de bienes en pago de asuncion de deuda', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, FALSE),
    ('0601', '06', 'Arrendamiento o Subarrendamiento de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', 'AU0', FALSE, TRUE),
    ('0602', '06', 'Arrendamiento de bienes muebles', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN4', FALSE, FALSE),
    ('0603', '06', 'Arrendamiento financiero', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN4', FALSE, TRUE),
    ('0604', '06', 'Escritura de ejercicio de opcion del leasing', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE, FALSE),
    ('0605', '06', 'Contrato de renting', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0606', '06', 'Contrato de franchising', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0607', '06', 'Traspaso y cesion de arrendamiento', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, FALSE),
    ('0608', '06', 'Cesion en precario o comodato', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, TRUE),
    ('0609', '06', 'Novacion de arrendamiento de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN4', FALSE, FALSE),
    ('0610', '06', 'Novacion de arrendamiento de bienes muebles', TRUE, 0, 0, TRUE, TRUE, 'No', 'TM0', FALSE, FALSE),
    ('0611', '06', 'Novacion de arrendamiento financiero', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN4', FALSE, FALSE),
    ('0612', '06', 'Resolucion o extincion convencional de arrendamiento de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0613', '06', 'Resolucion o extincion de arrendamiento de bienes muebles', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0614', '06', 'Resolucion o extincion de arrendamiento de financieros', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, TRUE),
    ('0701', '07', 'Donaciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, TRUE),
    ('0702', '07', 'Cesiones obligatorias gratuitas terrenos por oblig. Urbanisticas', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, FALSE),
    ('0703', '07', 'Condonacion de deuda', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0704', '07', 'Reversion de donacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0705', '07', 'Revocacion o resolucion de la donacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0706', '07', 'Aceptacion de donacion', FALSE, 0, 0, TRUE, FALSE, 'No', 'SD0', FALSE, FALSE),
    ('0707', '07', 'Donacion de uso o habitacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, FALSE),
    ('0708', '07', 'Donaciones pendientes de aceptacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0801', '08', 'Condicion resolutoria', TRUE, 0, 0, TRUE, TRUE, 'No', 'DG0', FALSE, TRUE),
    ('0802', '08', 'Afianzamiento', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0803', '08', 'Reserva de dominio', TRUE, 0, 0, TRUE, TRUE, 'No', 'DG0', FALSE, FALSE),
    ('0804', '08', 'Pacto de retroventa', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE, FALSE),
    ('0805', '08', 'Subrogacion en posicion deudora', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('0806', '08', 'Exceso de adjudicacion oneroso', TRUE, 0, 0, TRUE, TRUE, 'Op', 'SMC', FALSE, FALSE),
    ('0807', '08', 'Exceso de adjudicacion gratuito', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE, FALSE),
    ('0808', '08', 'Afeccion o vinculacion a comunidad de bienes', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0809', '08', 'Pacto al mas viviente o pacto de supervivencia', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0810', '08', 'Minoracion de valor por carga real preexistente', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('0901', '09', 'Reparcelacion, compensacion u otro sistema de ejec. Urbanistica', TRUE, 0, 0, TRUE, TRUE, 'No', 'IM0', FALSE, FALSE),
    ('0902', '09', 'Escritura de adhesion a entidad u otras actuaciones urbanisticas', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0904', '09', 'Sistemas de ejecucion urbanistica', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, TRUE),
    ('0905', '09', 'Protocolizacion de acta de reorganizacion de concent. Parcelaria', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('0906', '09', 'Convenios urbanisticos', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('0907', '09', 'Transmision y distribucion de aprov. Urb. entre fincas un propietario', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE, FALSE),
    ('1001', '10', 'Opcion de compra y promesa de venta', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE, TRUE),
    ('1002', '10', 'Constitucion de tanteo y retracto convencional', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE, TRUE),
    ('1003', '10', 'Cesion de creditos, derechos o posiciones contractuales', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE, TRUE),
    ('1004', '10', 'Reconocimiento de deuda', TRUE, 0, 0, TRUE, TRUE, 'Op', 'PO0', FALSE, FALSE),
    ('1005', '10', 'Transacciones y renuncia de acciones y derechos no hereditarias', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE, FALSE),
    ('1006', '10', 'Contratos de prestacion de servicios', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1007', '10', 'Acta de subsanacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1008', '10', 'Escritura de adhesion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1009', '10', 'Contrato de deposito', TRUE, 0.85, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1010', '10', 'Convenios concursales', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1011', '10', 'Contrato de seguro', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1012', '10', 'Escrituras de renuncias a los derechos de adquisicion prefente', FALSE, 0, 0, TRUE, FALSE, 'No', 'TU1', FALSE, TRUE),
    ('1013', '10', 'Contrato de factoring', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1014', '10', 'Contrato de confirming', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1015', '10', 'Renuncia de acciones o derechos no hereditarios', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, TRUE),
    ('1016', '10', 'Renuncia a cargos no societarios', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1017', '10', 'Pactos sociales o acuerdos de socios', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1018', '10', 'Escritura de revocacion, resolucion o anulacion (C/Cuantia) -salvo donaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1019', '10', 'Renuncia al derecho de usufructo y otros derechos reales', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1020', '10', 'Constitucion de Renta o pension', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1021', '10', 'Renuncia de derecho real limitativo sobre inmuebles', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1022', '10', 'Acuerdo de refinanciacion (Ley Concursal DA 1ª, RD ley 3/2009)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1023', '10', 'Modificacion acuerdo de refinanciacion (Ley Concursal DA 1ª, RD ley 3/2009)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1024', '10', 'Fusion de fondos de Inversion y otras entidades de contenido financiero', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1025', '10', 'Desafectacion de comun. de bienes, c. foral aragones/otras com.', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1026', '10', 'Regulacion de comunidades especiales', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1027', '10', 'Acuerdo de mediacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1028', '10', 'Acta Complementaria de Cesion de Activos a la SAREB', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1029', '10', 'Escritura o acta de procedimiento de mediacion concursal', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1030', '10', 'Escritura de nombramiento de perito en contrato de seguro', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1031', '10', 'Nombramiento de perito en general', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1032', '10', 'Escritura de conciliacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1033', '10', 'Acta complementaria de cesion de activos entre entidades financieras', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1101', '11', 'Aceptacion de herencia S/Adjudicacion o de cualidad heredero', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1102', '11', 'Liquidacion de comunidad conyugal (en herencias)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE, FALSE),
    ('1103', '11', 'Adicion de herencia', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1104', '11', 'Renuncia pura y simple de herencia', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE, TRUE),
    ('1105', '11', 'Renuncia traslativa de herencia', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE, TRUE),
    ('1106', '11', 'Extincion de usufructo, uso o habitacion por fallecimiento/otros', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1107', '11', 'Inventario Sucesorio', TRUE, 0, 0, TRUE, FALSE, 'No', 'SMC', FALSE, FALSE),
    ('1108', '11', 'Aprobacion de la particion realizada por el contador partidor', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1109', '11', 'Aceptacion de herencia a beneficio de inventario', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1110', '11', 'Reserva del derecho a deliberar', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1201', '12', 'Prestamo o credito personal', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, FALSE),
    ('1202', '12', 'Escritura de protocolizacion de poliza o credito personal', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1203', '12', 'Hipoteca inmobiliaria en garantia', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE, TRUE),
    ('1204', '12', 'Hipoteca inmobiliaria en garantia de otras obligaciones', TRUE, 0, 0, TRUE, FALSE, 'Op', '', FALSE, TRUE),
    ('1205', '12', 'Hipoteca mobiliaria en garantia prestamo', TRUE, 0.25, 0, TRUE, FALSE, 'No', 'DN6', FALSE, TRUE),
    ('1206', '12', 'Hipoteca mobiliaria en garantia de otras obligaciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, FALSE),
    ('1207', '12', 'Hipoteca naval en garantia de prestamo/creditos/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('1208', '12', 'Hipoteca naval en garantia de otras obligaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1209', '12', 'Pignoracion en garantia de prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'PO0', FALSE, TRUE),
    ('1210', '12', 'Pignoracion mobiliaria en garantia de otras obligaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1211', '12', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('1212', '12', 'Prenda sin desplazamiento en garantia de otras obligaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1213', '12', 'Hipoteca cambiaria', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN5', FALSE, FALSE),
    ('1214', '12', 'Posposicion, permuta o igualacion de rango', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DG0', FALSE, FALSE),
    ('1215', '12', 'Distribucion de responsabilidad Hipotecaria', TRUE, 0.4375, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1216', '12', 'Novacion de prestamo segun ley 2/1994', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1217', '12', 'Subrogacion de Prestamo/C.Hipotecario', TRUE, 0.5, 0, TRUE, TRUE, 'Si', '', FALSE, TRUE),
    ('1218', '12', 'Contrato de garantia entre afianzados no incluido en algunas de las garantias anteriores', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1219', '12', 'Liberacion por el acreedor de deudor solidario/mancomunado/fiado', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1220', '12', 'Escritura de afianzamiento', TRUE, 0, 0, TRUE, TRUE, 'No', 'FZ0', FALSE, TRUE),
    ('1221', '12', 'Adhesion asuncion de deuda', TRUE, 0, 0, TRUE, TRUE, 'No', 'PO0', FALSE, FALSE),
    ('1222', '12', 'Garantias innominadas o atipicas - otras', TRUE, 0, 0, TRUE, TRUE, 'No', 'FZ0', FALSE, TRUE),
    ('1223', '12', 'Novaciones de prestamo - otras', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('1224', '12', 'Ampliacion de Hipoteca (Inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN5', FALSE, TRUE),
    ('1225', '12', 'Subrogacion Hipotecaria por cambio de acreedor - otras', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN5', FALSE, TRUE),
    ('1226', '12', 'Hipoteca de Concesion Administrativa', TRUE, 0.25, 0, TRUE, TRUE, 'Op', '', FALSE, FALSE),
    ('1227', '12', 'Hipoteca Inversa', TRUE, 0.4375, 0, TRUE, TRUE, 'Si', '', FALSE, TRUE),
    ('1228', '12', 'Pacto Anticretico', TRUE, 0, 0, TRUE, TRUE, 'Si', '', FALSE, TRUE),
    ('1229', '12', 'Ampliacion garantia hipotecaria con otros bienes', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1230', '12', 'Moratorias RD-Ley 2020', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE, TRUE),
    ('1231', '12', 'Moratorias RD-Ley 6/2024', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE, TRUE),
    ('1301', '13', 'Carta de Pago', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1302', '13', 'Carta de Pago', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('1303', '13', 'Carta de Pago y Canc. Cond. Resolutoria u otras garantias Reales', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN5', FALSE, FALSE),
    ('1304', '13', 'Cancelacion de Hipoteca', FALSE, 0, 15, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1305', '13', 'Cancelacion de Hipoteca por exhibicion e inutilizacion efectos', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('1306', '13', 'Cancelacion de C. Resolutoria por exhib.o inutilizacion efectos', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE, TRUE),
    ('1307', '13', 'Cancelacion de prenda con o sin desplazamiento', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1308', '13', 'Cancelacion de C. Resolutoria y garantias sin Carta de Pago', TRUE, 0, 0, TRUE, TRUE, 'No', 'DG0', FALSE, TRUE),
    ('1309', '13', 'Liberacion de hipoteca sin cancelacion', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1310', '13', 'Acta de inutilizacion de titulos', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1401', '14', 'Poder general', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1402', '14', 'Poder electoral', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1403', '14', 'Poder para pleitos', FALSE, 1, 15.03, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1404', '14', 'Sustitucion de poder para pleitos', FALSE, 1, 15.03, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1405', '14', 'Poder mercantil', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1406', '14', 'Revocacion de apoderamiento mercantil', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1407', '14', 'Autorizaciones de viaje al extranjero para menores españoles', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1408', '14', 'Renuncia del Apoderado', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1409', '14', 'Escritura de ratificacion o aceptacion', FALSE, 0, 0, TRUE, FALSE, 'No', 'TU1', FALSE, TRUE),
    ('1410', '14', 'Poder preventivo para el caso de incapacidad', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1411', '14', 'Sustitucion de otros poderes', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1412', '14', 'Aceptacion de cargos no societarios', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1413', '14', 'Revocacion de poder para pleitos', FALSE, 1, 15.03, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1414', '14', 'Poder general mercantil', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1415', '14', 'Poder de representacion tributaria', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1416', '14', 'Designacion o nombramiento de contador partidor dativo o albacea', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1417', '14', 'Prorroga en el cargo de contador partidor o albacea', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1418', '14', 'Revocacion de autorizacion de viaje al extranjero para menores españoles', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1501', '15', 'Protesto de letras, cheques, pagares y otros efectos', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1601', '16', 'Acta de requerimiento de conciliacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1602', '16', 'Actas de manifestaciones', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1603', '16', 'Actas de exhibicion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1604', '16', 'Compromisos de invitacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1605', '16', 'Actas de presencia', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1606', '16', 'Actas de presencia para reunificacion familiar', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1607', '16', 'Actas de presencia en materia electoral', FALSE, 1, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1608', '16', 'Actas de protocolizacion en general', TRUE, 0.85, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1609', '16', 'Actas de protocolizacion de bases de sorteo', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1610', '16', 'Actas de incorporacion de base grafica', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'DN5', FALSE, FALSE),
    ('1611', '16', 'Actas de incorporacion de referencia catastral', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1612', '16', 'Actas de entrega', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('1613', '16', 'Actas de protocolizacion de laudo arbitral', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1614', '16', 'Actas de reunion de organo colegiado', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1615', '16', 'Actas de fe de vida', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1616', '16', 'Actas de sorteo', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1617', '16', 'Actas de subasta', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1618', '16', 'Actas de inutilizacion de titulos', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1619', '16', 'Actas de deposito en consignacion', TRUE, 0.85, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('1620', '16', 'Actas de deposito - otras', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE, TRUE),
    ('1621', '16', 'Actas de legitimacion de firmas para efecto en pais extranjero', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1622', '16', 'Actas de fijacion de saldo para despachar ejecucion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1623', '16', 'Actas de tramitacion de venta extrajudicial', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1624', '16', 'Acta declaracion de notoriedad de herederos abintestato (requerimiento)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1625', '16', 'Actas de notoriedad para la inmatriculacion de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, TRUE),
    ('1626', '16', 'Acta de notoriedad para la constancia de exceso de cabida', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, TRUE),
    ('1627', '16', 'Acta de notoriedad para la reanudacion de tracto sucesivo', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE, FALSE),
    ('1628', '16', 'Actas de notoriedad - otras', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1629', '16', 'Acta de remision por correo', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1630', '16', 'Acta declaracion de notoriedad de herederos abintestato directos', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1631', '16', 'Acta de requerimiento para Declaracion de Inmatriculacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1632', '16', 'Acta de requerimiento para Declaracion de Notoriedad de constancia de exceso de cabida', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1633', '16', 'Actas de fijacion de saldo - otras', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1634', '16', 'Acta de requerimiento RDL 6/2010 (recuperacion IVA incobrable)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1635', '16', 'Acta de Titular Real Ley 10/2010', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1636', '16', 'Acta de jura de nacionalidad', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1637', '16', 'Acta de emprendedor individual de responsabilidad limitada', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1638', '16', 'Acta declaracion de notoriedad de herederos abintestato colaterales', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1639', '16', 'Acta de requerimiento al heredero para aceptar la herencia', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1640', '16', 'Acta de ofrecimiento de pago y consignacion de deuda', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, FALSE),
    ('1641', '16', 'Acta de procedimiento de reclamacion de deudas dinerarias no contradichas', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, TRUE),
    ('1642', '16', 'Acta de subasta electronica notarial', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, FALSE),
    ('1643', '16', 'Acta de jurisdiccion voluntaria sobre recuperacion depositos y titulos valores', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1644', '16', 'Acta de notoriedad para la concesion de nacionalidad española', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1645', '16', 'Expediente de dominio', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, TRUE),
    ('1646', '16', 'Acta de deslinde o subsanacion de discrepancias', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE, TRUE),
    ('1647', '16', 'Certificado sucesorio europeo', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1648', '16', 'Acta de requerimiento de expedicion y deposito de copias electronicas autorizadas en SIGNO', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1649', '16', 'Acta de extravio, sustraccion o destruccion del conocimiento de embarque', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1650', '16', 'Acta de transparencia material ley 5/2019', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1651', '16', 'Acta de constancia de omision de numero de protocolo', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1652', '16', 'Acta de llamamientos forales', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1653', '16', 'Acta de constancia de la guarda de hecho', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1701', '17', 'Prestamo, Creditos y Descuentos sin Afianzamiento', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1702', '17', 'Prestamo, Creditos y Descuentos con Afianzamiento', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1703', '17', 'Afianzamiento o Aval', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1704', '17', 'Constitucion de Contragarantia o Aval', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1705', '17', 'Constitucion de Prenda', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1706', '17', 'Hipoteca Naval', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1707', '17', 'Arrendamiento Financiero', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1708', '17', 'Renting', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1709', '17', 'Cesion de Credito o Derechos', TRUE, 0, 0, TRUE, FALSE, 'Op', '', FALSE, FALSE),
    ('1710', '17', 'Compraventa de Valores', TRUE, 0, 0, TRUE, FALSE, 'Op', '', FALSE, FALSE),
    ('1711', '17', 'Suscripcion de Titulos', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1712', '17', 'Contrato de Transporte', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1713', '17', 'Contrato de Seguro', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1714', '17', 'Subasta de Valores o Mercancias', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1715', '17', 'Solicitud Cert. Electronico', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1716', '17', 'Notificacion a Intervinientes en las Polizas', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1717', '17', 'Poliza de Rectificacion, Aclaracion o Modificacion de Otras', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1718', '17', 'Otros Contratos Mercantiles Distintos de los Anteriores', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1720', '17', 'Subrogacion o modificacion de operacion de leasing', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1721', '17', 'Intervencion de letra de cambio y otros efectos', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1722', '17', 'Factoring', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1723', '17', 'Confirming', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1724', '17', 'Contrato de Franchising', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1725', '17', 'Liberacion de deudor, fiador o garantia prendaria', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1726', '17', 'Precontratos en general y otros pactos de alcance meramente obligacional', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1727', '17', 'Aval', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1728', '17', 'Poliza e-notario', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1729', '17', 'Poliza de ratificacion de poliza desdoblada', TRUE, 1, 5000.0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1730', '17', 'Poliza de constancia de omision de numero de protocolo', TRUE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1731', '17', 'Moratorias RD-Ley 2020', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1732', '17', 'Moratorias RD-Ley 6/2024 (legal)', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1801', '18', 'Joint venture', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1802', '18', 'Contrato de cuentas en participacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1803', '18', 'Constitucion de comunidad de bienes', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1804', '18', 'Entidades sin personalidad juridica - otras (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1805', '18', 'Extincion de entidad sin personalidad juridica', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1806', '18', 'Constitucion de comunidad para la promocion inmobiliaria', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1807', '18', 'Extincion de comunidad para la promocion inmobiliaria', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1808', '18', 'Constitucion de union o agrupacion temporal de empresas', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1809', '18', 'Extincion de union temporal de empresas', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, FALSE),
    ('1901', '19', 'Constitucion de sociedad civil', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1902', '19', 'Constitucion de sociedad agraria de transformacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1903', '19', 'Agrupacion de interes urbanistico, J.Compensacion o Entidad Act.Urbanistica', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1904', '19', 'Agrupacion de interes economico', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE, FALSE),
    ('1905', '19', 'Entidad urbanistica colaboradora', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1906', '19', 'Constitucion de partido politico', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1907', '19', 'Constitucion de sindicato', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1908', '19', 'Constitucion de asociacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1909', '19', 'Constitucion de asociacion patronal', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1910', '19', 'Constitucion de fundacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1911', '19', 'Constitucion de otro tipo de entidades no mercantiles', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1912', '19', 'Constitucion de sociedad limitada', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1913', '19', 'Constitucion de sociedad limitada laboral', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1914', '19', 'Constitucion de sociedad anonima', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX0', FALSE, FALSE),
    ('1915', '19', 'Constitucion de sociedad anonima laboral', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX0', FALSE, FALSE),
    ('1916', '19', 'Constitucion de sociedad anonima deportiva', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX0', FALSE, FALSE),
    ('1917', '19', 'Constitucion de sociedad limitada nueva empresa', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1918', '19', 'Constitucion de sociedad anonima profesional', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1919', '19', 'Constitucion de sociedad de inversion mobiliaria de capital fijo', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1920', '19', 'Constitucion de inversion mobiliaria de capital variable', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1921', '19', 'Constitucion de sociedad comanditaria por acciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1922', '19', 'Constitucion de sociedad de garantia reciproca', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1923', '19', 'Constitucion de sociedad regular colectiva', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1924', '19', 'Constitucion de sociedad comanditaria', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1925', '19', 'Constitucion de cooperativa', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1926', '19', 'Constitucion de mutua', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1927', '19', 'Constitucion de mutualidad', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1928', '19', 'Constitucion de fondo de pensiones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1929', '19', 'Constitucion de fondo de inversion mobiliaria', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1930', '19', 'Constitucion de fondo de inversion en activos mercado monetario', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1931', '19', 'Constitucion de otras instituciones de inversion colectiva', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1932', '19', 'Agrupacion europea de interes economico', TRUE, 0, 0, TRUE, FALSE, 'No', 'SO0', FALSE, FALSE),
    ('1933', '19', 'La Sociedad Anonima Europea', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX0', FALSE, FALSE),
    ('1934', '19', 'Los planes de pensiones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1935', '19', 'Los fondos de inversion o titulacion inmobiliaria', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, FALSE),
    ('1936', '19', 'Ampliacion de capital societario con suscripcion', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'SO1', FALSE, TRUE),
    ('1937', '19', 'Desembolso de dividendos pasivos', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1938', '19', 'Aportacion de bienes a sociedad en constit. o aumento de capital', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO1', FALSE, TRUE),
    ('1939', '19', 'Determinacion de suscriptores', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1940', '19', 'Reduccion de capital con amortizacion de acciones/participaciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO3', FALSE, FALSE),
    ('1941', '19', 'Disolucion de sociedad mercantil', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1942', '19', 'Disolucion de sociedad por cesion global de activo y pasivo', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, FALSE),
    ('1943', '19', 'Cesion global de activo y pasivo en caso de disolucion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, FALSE),
    ('1944', '19', 'Disolucion y extincion de entidades no mercantiles', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, FALSE),
    ('1945', '19', 'Adjudicacion de bienes a socios en liquidac. o reduc. de capital', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, FALSE),
    ('1946', '19', 'Transformacion en sociedad limitada', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1947', '19', 'Transformacion en sociedad anonima', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1948', '19', 'Transformacion en otro tipo de sociedades', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1949', '19', 'Disolucion de sociedad por fusion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE, TRUE),
    ('1950', '19', 'Constitucion de sociedad por fusion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE, FALSE),
    ('1951', '19', 'Aumento de capital por fusion con suscripcion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE, FALSE),
    ('1952', '19', 'Aportacion de bienes como consecuencia de fusion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE, FALSE),
    ('1953', '19', 'Disolucion de sociedad por escision total', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO6', FALSE, FALSE),
    ('1954', '19', 'Reduccion de capital por escision parcial con devolucion de aportaciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO6', FALSE, FALSE),
    ('1955', '19', 'Constitucion de sociedad por escision total o parcial', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO6', FALSE, FALSE),
    ('1956', '19', 'Aumento de capital por escision con suscripcion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO6', FALSE, FALSE),
    ('1957', '19', 'Aportaciones de bienes como consecuencia de la escision', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO6', FALSE, FALSE),
    ('1958', '19', 'Constitucion de establecimiento mercantil', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE, TRUE),
    ('1959', '19', 'Traslado y modificacion de domicilio social', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE, TRUE),
    ('1960', '19', 'Cambio de denominacion', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1961', '19', 'Modificaciones de estatutos - otras', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1962', '19', 'Adaptacion de estatutos sociales', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1963', '19', 'Redenominacion de capital', FALSE, 0, 0, TRUE, FALSE, 'No', 'SX0', FALSE, TRUE),
    ('1964', '19', 'Cambio de socio unico de entidad unipersonal', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE, FALSE),
    ('1965', '19', 'Declaracion de unipersonalidad', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE, FALSE),
    ('1966', '19', 'Cese de unipersonalidad', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE, FALSE),
    ('1967', '19', 'Separacion o exclusion de socio', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1968', '19', 'Reactivacion de sociedades', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1969', '19', 'Renumeracion de las acciones/participaciones sociales', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1971', '19', 'Liquidacion y extincion de sociedad anonima laboral', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE, TRUE),
    ('1972', '19', 'Reparto de activo sobrevenido de sociedad extinguida', TRUE, 0, 0, TRUE, TRUE, 'Op', 'SO2', FALSE, FALSE),
    ('1973', '19', 'Nombramiento de Liquidador', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1974', '19', 'Nombramiento de auditor', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1975', '19', 'Nombramiento cargos de los restantes tipos de personas juridicas', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, TRUE),
    ('1976', '19', 'Cese de administrador y otros cargos', FALSE, 1, 36.06, TRUE, FALSE, 'No', 'DN5', FALSE, TRUE),
    ('1977', '19', 'Aceptacion del cargo de administrador, auditor u otros en escritura separada', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1978', '19', 'Renuncia del administrador y otros cargos', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1979', '19', 'Emision de obligaciones y otros activos financieros', TRUE, 0, 0, TRUE, TRUE, 'No', 'PO0', FALSE, FALSE),
    ('1980', '19', 'Aumento de dotacion de fundacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1981', '19', 'Aumento de capital sin suscripcion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1982', '19', 'Aumento de capital por escision sin suscripcion', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('1983', '19', 'Reduccion de capital sin amortizacion de acciones/participaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1984', '19', 'Reduccion de capital por escision parcial sin devolucion de aportaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1985', '19', 'Constitucion de estab. de entidad NO mercantil', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1986', '19', 'Aportacion a patrimonio social', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1987', '19', 'Liquidacion y extincion de sociedad anonima SIN identificacion socios', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, TRUE),
    ('1988', '19', 'Ampliacion de capital de sociedades cotizadas sin identificacion de los socios', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO1', FALSE, FALSE),
    ('1989', '19', 'Constitucion de sociedad beneficiaria por segregacion de rama de actividad', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE, FALSE),
    ('1990', '19', 'Aumento de capital de la sociedad beneficiaria por segregacion de la rama de actividad', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE, FALSE),
    ('2001', '20', 'Actas telematicas para la DANA octubre 2024', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('2002', '20', 'Actas de presencia para la DANA octubre 2024', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('2003', '20', 'Actas telematicas para la DANA Tarragona octubre 2025', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE, FALSE),
    ('2004', '20', 'Actas de presencia para la DANA Tarragona octubre 2025', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE, FALSE);

-- 13. Variantes de actos notariales
INSERT INTO acto_notarial_variante
    (acto_id, label_variante, label_completo, con_cuantia, arancel_fijo, folio_fijo, iva_aplicable,
     requiere_cuantia_registro, medio_pago, clase_liquidacion, liquidacion_fiscal)
VALUES
    ('0105', 'C/Cuantia', 'Aportaciones a patrimonio protegido (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0105', 'S/Cuantia', 'Aportaciones a patrimonio protegido (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0106', 'C/Cuantia', 'Modificacion de patrimonio protegido (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0106', 'S/Cuantia', 'Modificacion de patrimonio protegido (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0112', 'C/Cuantia', 'Actos de orden familiar o personal - otros (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0112', 'S/Cuantia', 'Actos de orden familiar o personal - otros (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0115', 'Escritura de divorcio', 'Escritura de divorcio', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0115', 'Escritura de separacion matrimonial', 'Escritura de separacion matrimonial', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0115', 'Escritura de separacion matrimonial o divorcio', 'Escritura de separacion matrimonial o divorcio', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0201', 'Testamento unipersonal abierto', 'Testamento unipersonal abierto', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0201', 'Doble Columna', 'Testamento unipersonal abierto (Doble Columna)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0206', 'GALICIA- Apartacion', 'Contratos sucesorios forales (GALICIA- Apartacion)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'GALICIA- Atribucion de usufructo', 'Contratos sucesorios forales (GALICIA- Atribucion de usufructo)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'GALICIA- C/Transmision de bienes', 'Contratos sucesorios forales (GALICIA- C/Transmision de bienes)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'GALICIA- S/Transmision de bienes', 'Contratos sucesorios forales (GALICIA- S/Transmision de bienes)', FALSE, 0, 0, FALSE, TRUE, 'No', '', FALSE),
    ('0206', 'C/Cuantia', 'Contratos sucesorios sujetos al derecho foral (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'S/Cuantia', 'Contratos sucesorios sujetos al derecho foral (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0206', 'donacion con definicion de legitima y por mas', 'Contratos sucesorios/derecho foral (donacion con definicion de legitima y por mas)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'donacion con definicion de legitima', 'Contratos sucesorios/derecho foral (donacion con definicion de legitima)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0206', 'donacion con definicion por mas de legitima', 'Contratos sucesorios/derecho foral (donacion con definicion por mas de legitima)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0311', 'C/Cuantia', 'Acuerdos relativos a uniones de hecho (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0311', 'S/Cuantia', 'Acuerdos relativos a uniones de hecho (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0313', 'C/Cuantia', 'Aportacion a la sociedad conyugal (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0313', 'S/Cuantia', 'Aportacion a la sociedad conyugal (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Op', 'TU1', FALSE),
    ('0314', 'C/Cuantia', 'Escritura confesion privatividad/acuerdos alteran caracter bienes (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0314', 'S/Cuantia', 'Escritura confesion privatividad/acuerdos alteran caracter bienes (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0315', 'Renuncia a derechos economicos matrimoniales- otra', 'Renuncia a derechos economicos matrimoniales- otra', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0315', 'Renuncia a viudedad aragonesa', 'Renuncia a viudedad aragonesa', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0401', 'Segregacion', 'Segregacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0401', 'Rustica', 'Segregacion (Rustica)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN0', FALSE),
    ('0401', 'Urbana VPO', 'Segregacion (Urbana VPO)', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'DN0', FALSE),
    ('0401', 'Urbana', 'Segregacion (Urbana)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN0', FALSE),
    ('0403', 'Agrupacion', 'Agrupacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE),
    ('0403', 'Rustica', 'Agrupacion (Rustica)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE),
    ('0403', 'Urbana', 'Agrupacion (Urbana)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN1', FALSE),
    ('0403', 'Vpo y Libre', 'Agrupacion (Vpo y Libre)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN1', FALSE),
    ('0403', 'Vpo', 'Agrupacion (Vpo)', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'DN1', FALSE),
    ('0404', 'Division material', 'Division material', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0404', 'Vpo y Libre', 'Division material (Vpo y Libre)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN5', FALSE),
    ('0405', 'Declaracion de obra nueva terminada o ampliacion', 'Declaracion de obra nueva terminada o ampliacion', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN2', FALSE),
    ('0405', 'VPO 50%', 'Declaracion de obra nueva terminada o ampliacion (VPO 50%)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN2', FALSE),
    ('0405', 'Vpo y Libre', 'Declaracion de obra nueva terminada o ampliacion (Vpo y Libre)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN2', FALSE),
    ('0406', 'o ampliacion', 'Declaracion de obra nueva en construccion (o ampliacion)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN2', FALSE),
    ('0406', 'VPO 50%', 'Declaracion de obra nueva en construccion (o ampliacion) (VPO 50%)', TRUE, 0.5, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0406', 'VPO y libre', 'Declaracion de obra nueva en construccion (o ampliacion) (VPO y libre)', TRUE, 0.5, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0409', 'Division horizontal', 'Division horizontal', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE),
    ('0409', 'y supuestos analogos', 'Division horizontal y supuestos analogos', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0409', 'Vpo y Libre', 'Division horizontal y supuestos analogos (Vpo y Libre)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN3', FALSE),
    ('0409', 'Vpo', 'Division horizontal y supuestos analogos (Vpo)', TRUE, 0.5, 0, TRUE, FALSE, 'No', 'DN3', FALSE),
    ('0410', 'Extincion de division horizontal', 'Extincion de division horizontal', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0410', 'C/Cuantia', 'Modificacion de division horizontal (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE),
    ('0410', 'Desafectacion de elemento comun', 'Modificacion de division horizontal (Desafectacion de elemento comun)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU1', FALSE),
    ('0410', 'S/Cuantia', 'Modificacion de division horizontal (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN3', FALSE),
    ('0416', 'Rectificacion descriptiva de una finca', 'Rectificacion descriptiva de una finca', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE),
    ('0416', 'C/Cuantia', 'Rectificacion descriptiva de una finca (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE),
    ('0416', 'cambio de uso', 'Rectificacion descriptiva de una finca (cambio de uso)', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE),
    ('0416', 'C/Cuantia', 'Rectificacion descriptiva de una finca (cambio de uso) (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN3', FALSE),
    ('0416', 'determinacion de resto', 'Rectificacion descriptiva de una finca (determinacion de resto)', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE),
    ('0416', 'Subsanacion Discrepancia Catastral', 'Rectificacion descriptiva de una finca (Subsanacion Discrepancia Catastral)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0501', 'Elevacion a publico', 'Compraventa de Inmuebles (Elevacion a publico)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vivienda - Elevacion a publico', 'Compraventa de Inmuebles (Vivienda - Elevacion a publico)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Agricultor prioritario', 'Compraventa inmuebles (Agricultor prioritario)', TRUE, 0.3, 0, TRUE, TRUE, 'Si', 'TR1', FALSE),
    ('0501', 'Aparcamiento 1ª T', 'Compraventa inmuebles (Aparcamiento 1ª T)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Aparcamiento 2ª T', 'Compraventa inmuebles (Aparcamiento 2ª T)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Empresarial', 'Compraventa inmuebles (Empresarial)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Inmuebles 1ª T', 'Compraventa inmuebles (Inmuebles 1ª T)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Inmuebles 2ª T', 'Compraventa inmuebles (Inmuebles 2ª T)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Mixta 1ª T', 'Compraventa inmuebles (Mixta 1ª T)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Mixta 2ª T', 'Compraventa inmuebles (Mixta 2ª T)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Mixta VPO 1ª T', 'Compraventa inmuebles (Mixta VPO 1ª T)', TRUE, 0.625, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Rustica Jovenes Agric.', 'Compraventa inmuebles (Rustica Jovenes Agric.)', TRUE, 0.3, 0, TRUE, TRUE, 'Si', 'TR1', FALSE),
    ('0501', 'Rustica', 'Compraventa inmuebles (Rustica)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TR1', FALSE),
    ('0501', 'Solar', 'Compraventa inmuebles (Solar)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vivienda piso 1ª T habitual', 'Compraventa inmuebles (Vivienda piso 1ª T habitual)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Vivienda piso 1ª T NO habitual', 'Compraventa inmuebles (Vivienda piso 1ª T NO habitual)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Vivienda piso 2ª T habitual', 'Compraventa inmuebles (Vivienda piso 2ª T habitual)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vivienda piso 2ª T NO habitual', 'Compraventa inmuebles (Vivienda piso 2ª T NO habitual)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vivienda unifam. 1ª T habitual', 'Compraventa inmuebles (Vivienda unifam. 1ª T habitual)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Vivienda unifam. 1ª T NO habitual', 'Compraventa inmuebles (Vivienda unifam. 1ª T NO habitual)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'DN4', FALSE),
    ('0501', 'Vivienda unifam. 2ª T habitual', 'Compraventa inmuebles (Vivienda unifam. 2ª T habitual)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vivienda unifam. 2ª T NO habitual', 'Compraventa inmuebles (Vivienda unifam. 2ª T NO habitual)', TRUE, 0, 0, TRUE, TRUE, 'Si', 'TU1', FALSE),
    ('0501', 'Vpo 50%', 'Compraventa inmuebles (Vpo 50%)', TRUE, 0.625, 0, TRUE, FALSE, 'Si', 'DN4', FALSE),
    ('0501', 'Vpo Tasa', 'Compraventa inmuebles (Vpo Tasa)', TRUE, 1, 60.05, TRUE, FALSE, 'Si', 'DN4', FALSE),
    ('0502', 'Compraventa de otros bienes o derechos', 'Compraventa de otros bienes o derechos', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('0502', 'Aeronave', 'Compraventa de otros bienes o derechos (Aeronave)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TM0', FALSE),
    ('0502', 'Farmacia', 'Compraventa de otros bienes o derechos (Farmacia)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE),
    ('0502', 'Marca Industrial', 'Compraventa de otros bienes o derechos (Marca Industrial)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('0502', 'Mueble', 'Compraventa de otros bienes o derechos (Mueble)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('0503', 'Permuta', 'Permuta', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0503', 'Activos Financieros', 'Permuta (Activos Financieros)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('0503', 'conmutacion del legado de usufructo viudal', 'Permuta (conmutacion del legado de usufructo viudal)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0503', 'Empresarial', 'Permuta (Empresarial)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN4', FALSE),
    ('0503', 'forzosa de inmueble', 'Permuta (forzosa de inmueble)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0503', 'Inmuebles y Otros', 'Permuta (Inmuebles y Otros)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0503', 'Inmuebles', 'Permuta (Inmuebles)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0503', 'Local', 'Permuta (Local)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE),
    ('0503', 'Mueble', 'Permuta (Mueble)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TM0', FALSE),
    ('0503', 'Regadio', 'Permuta (Regadio)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TR1', FALSE),
    ('0503', 'Secano', 'Permuta (Secano)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TR0', FALSE),
    ('0503', 'Solar', 'Permuta (Solar)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU0', FALSE),
    ('0503', 'Vivienda', 'Permuta (Vivienda)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0505', 'C/Cuantia', 'Entrega de inmueble en ejecucion de cesion de suelo por obra (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('0505', 'S/Cuantia', 'Entrega de inmueble en ejecucion de cesion de suelo por obra (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('0507', 'Extincion de condominio', 'Extincion de condominio', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0507', 'VPO', 'Extincion de condominio (VPO)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0508', 'Adjudicacion de cooperativa a sus socios', 'Adjudicacion de cooperativa a sus socios', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN4', FALSE),
    ('0508', 'inmuebles', 'Adjudicacion de cooperativa a sus socios (inmuebles)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN4', FALSE),
    ('0508', 'VPO 50%', 'Adjudicacion de cooperativa a sus socios (VPO 50%)', TRUE, 0.5, 0, TRUE, FALSE, 'Op', '', FALSE),
    ('0508', 'VPO TASA', 'Adjudicacion de cooperativa a sus socios (VPO TASA)', TRUE, 1, 60.05, TRUE, FALSE, 'Op', '', FALSE),
    ('0514', 'Cesion en pago o para pago de deudas', 'Cesion en pago o para pago de deudas', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0514', 'RDL 6/12 - hipotecarios sin recursos', 'Cesion en pago o para pago de deudas RDL 6/12 - hipotecarios sin recursos', TRUE, 1, 30, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0515', 'onerosa', 'Cesiones de bienes o derechos - otras (onerosa)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('0515', 'S/Cuantia', 'Cesiones onerosas de bienes o derechos - otras (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Op', 'TU1', FALSE),
    ('0516', 'Participac. Sociales', 'Compraventa de otros bienes o derechos (Participac. Sociales)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('0516', 'Acciones', 'Compraventa de valores (Acciones)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('0516', 'Activos Financieros', 'Compraventa de valores (Activos Financieros)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('0516', 'Participac. Sociales', 'Compraventa de valores (Participac. Sociales)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('0601', 'Local comercial', 'Arrendamiento o Subarrendamiento de fincas (Local comercial)', TRUE, 0, 0, TRUE, TRUE, 'No', 'AU0', FALSE),
    ('0601', 'Rustico', 'Arrendamiento o Subarrendamiento de fincas (Rustico)', TRUE, 0, 0, TRUE, TRUE, 'No', 'AR0', FALSE),
    ('0601', 'Urbano', 'Arrendamiento o Subarrendamiento de fincas (Urbano)', TRUE, 0, 0, TRUE, TRUE, 'No', 'AU0', FALSE),
    ('0601', 'Vivienda', 'Arrendamiento o Subarrendamiento de fincas (Vivienda)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0603', 'Inmobiliario', 'Arrendamiento financiero (Inmobiliario)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN4', FALSE),
    ('0603', 'Mobiliario', 'Arrendamiento financiero (Mobiliario)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('0608', 'C/Cuantia', 'Cesion en precario o comodato (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0608', 'S/Cuantia', 'Cesion en precario o comodato (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SD0', FALSE),
    ('0612', 'Resolucion o extincion convencional de arrendamiento de fincas', 'Resolucion o extincion convencional de arrendamiento de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0612', 'S/Cuantia', 'Resolucion o extincion convencional de arrendamiento de fincas (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0613', 'Resolucion o extincion de arrendamiento de bienes muebles', 'Resolucion o extincion de arrendamiento de bienes muebles', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0613', 'S/Cuantia', 'Resolucion o extincion de arrendamiento de bienes muebles (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0614', 'Resolucion o extincion de arrendamiento de financieros', 'Resolucion o extincion de arrendamiento de financieros', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE),
    ('0614', 'S/Cuantia', 'Resolucion o extincion de arrendamiento de financieros (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'TU2', FALSE),
    ('0701', 'Donaciones', 'Donaciones', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0701', 'Activos Financieros', 'Donaciones (Activos Financieros)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0701', 'Dinerarias', 'Donaciones (Dinerarias)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0701', 'Otros Inmuebles', 'Donaciones (Otros Inmuebles)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0701', 'Rustica', 'Donaciones (Rustica)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0701', 'Urbana', 'Donaciones (Urbana)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0701', 'Vivienda', 'Donaciones (Vivienda)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('0801', 'Condicion resolutoria', 'Condicion resolutoria', TRUE, 0, 0, TRUE, TRUE, 'No', 'DG0', FALSE),
    ('0801', 'Sujeccion a IVA', 'Condicion resolutoria (Sujeccion a IVA)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0801', 'Vpo 50%', 'Condicion resolutoria (Vpo 50%)', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'DG0', FALSE),
    ('0802', 'Afianzamiento', 'Afianzamiento', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0802', 'en garantia de prestamo inmueble', 'Afianzamiento en garantia de prestamo inmueble', TRUE, 0.4375, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0802', 'en garantia de prestamo vivienda', 'Afianzamiento en garantia de prestamo vivienda', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0805', 'Subrogacion en posicion deudora', 'Subrogacion en posicion deudora', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0805', 'gratuito', 'Subrogacion en posicion deudora (gratuito)', TRUE, 1, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0805', 'IVA', 'Subrogacion en posicion deudora (IVA)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0805', 'Ley 8/2012', 'Subrogacion en posicion deudora (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0805', 'Vivienda VPO Tasa', 'Subrogacion en posicion deudora (Vivienda VPO Tasa)', TRUE, 1, 60.05, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0805', 'Vivienda VPO', 'Subrogacion en posicion deudora (Vivienda VPO)', TRUE, 0.625, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0805', 'Vivienda', 'Subrogacion en posicion deudora (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('0805', 'RD 1612/2011', 'Subrogacion Hipotecaria en posicion deudora (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', TRUE),
    ('0902', 'C/Cuantia', 'Escritura de adhesion a entidad u otras actuaciones urbanisticas (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0902', 'S/Cuantia', 'Escritura de adhesion a entidad u otras actuaciones urbanisticas (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('0904', 'Adjudicacion por reparcelacion/compensacion o ejec. Urbanisticas', 'Adjudicacion por reparcelacion/compensacion o ejec. Urbanisticas', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('0904', 'Otros', 'Sistemas de ejecucion urbanistica (Otros)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('0906', 'C/Cuantia', 'Convenios urbanisticos (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('0906', 'S/Cuantia', 'Convenios urbanisticos (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1001', 'Opcion de compra y promesa de venta', 'Opcion de compra y promesa de venta', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE),
    ('1001', 'Activos Financieros', 'Opcion de compra y promesa de venta (Activos Financieros)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU0', FALSE),
    ('1001', 'Inmuebles', 'Opcion de compra y promesa de venta (Inmuebles)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE),
    ('1001', 'Mueble', 'Opcion de compra y promesa de venta (Mueble)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1001', 'Solar', 'Opcion de compra y promesa de venta (Solar)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU0', FALSE),
    ('1001', 'Vivienda', 'Opcion de compra y promesa de venta (Vivienda)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('1002', 'C/Cuantia', 'Constitucion de tanteo y retracto convencional (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU2', FALSE),
    ('1002', 'S/Cuantia', 'Constitucion de tanteo y retracto convencional (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Op', '', FALSE),
    ('1003', 'Cesion de creditos, derechos o posiciones contractuales', 'Cesion de creditos, derechos o posiciones contractuales', TRUE, 0, 0, TRUE, TRUE, 'Op', 'AD0', FALSE),
    ('1003', 'Reconocimiento Dominio - Cesion de creditos, derechos o posiciones contractuales', 'Reconocimiento Dominio - Cesion de creditos, derechos o posiciones contractuales', FALSE, 0, 0, TRUE, FALSE, 'Op', 'TU1', FALSE),
    ('1007', 'Acta de subsanacion', 'Acta de subsanacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1007', 'Anulacion', 'Escritura de modificacion, aclaracion o rectificacion (Anulacion)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1007', 'Articulo 153', 'Escritura de modificacion, aclaracion o rectificacion (Articulo 153)', FALSE, 1, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1007', 'C/Cuantia', 'Escritura de modificacion, aclaracion o rectificacion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1007', 'S/Cuantia', 'Escritura de modificacion, aclaracion o rectificacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1007', 'S/Cuantia', 'Subsanacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1008', 'C/Cuantia', 'Escritura de adhesion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1008', 'S/Cuantia', 'Escritura de adhesion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1010', 'Convenios concursales', 'Convenios concursales', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1010', 'S/Cuantia', 'Convenios concursales (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1012', 'Escrituras de renuncias a los derechos de adquisicion prefente', 'Escrituras de renuncias a los derechos de adquisicion prefente', FALSE, 0, 0, TRUE, FALSE, 'No', 'TU1', FALSE),
    ('1012', 'S/Cuantia', 'Escrituras de renuncias a los derechos de adquisicion preferente (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'TU1', FALSE),
    ('1015', 'Renuncia de acciones o derechos no hereditarios', 'Renuncia de acciones o derechos no hereditarios', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('1015', 'S/Cuantia', 'Renuncia de acciones o derechos no hereditarios (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '-', FALSE),
    ('1017', 'Pactos sociales o acuerdos de socios', 'Pactos sociales o acuerdos de socios', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1017', 'C/Cuantia', 'Precontratos en general y otros pactos de alcance meramente obligacional (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1017', 'S/Cuantia', 'Precontratos en general y otros pactos de alcance meramente obligacional (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1018', 'Escritura de revocacion, resolucion o anulacion (C/Cuantia) -salvo donaciones', 'Escritura de revocacion, resolucion o anulacion (C/Cuantia) -salvo donaciones', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1018', 'Escritura de revocacion, resolucion o anulacion (S/Cuantia) -salvo donaciones', 'Escritura de revocacion, resolucion o anulacion (S/Cuantia) -salvo donaciones', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1025', 'C/Cuantia', 'Desafectacion de comun. de bienes, c. foral aragones/otras com. (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1025', 'S/Cuantia', 'Desafectacion de comun. de bienes, c. foral aragones/otras com. (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1029', 'Escritura o acta de procedimiento de mediacion concursal', 'Escritura o acta de procedimiento de mediacion concursal', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1029', 'gratuito', 'Escritura o acta de procedimiento de mediacion concursal (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1032', 'C/Cuantia', 'Escritura de conciliacion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1032', 'S/Cuantia', 'Escritura de conciliacion (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1101', 'C/Cuantia', 'Aceptacion de herencia S/Adjudicacion o de cualidad heredero (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1101', 'S/Cuantia', 'Aceptacion de herencia S/Adjudicacion o de cualidad heredero (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'SMC', FALSE),
    ('1103', 'Adicion de herencia', 'Adicion de herencia', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1103', 'Adjudicacion por titulo sucesorio con o sin liquidacion de comunidad conyugal', 'Adjudicacion por titulo sucesorio con o sin liquidacion de comunidad conyugal', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE),
    ('1103', 'Escritura de entrega de legado', 'Escritura de entrega de legado', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1103', 'Pago de Legitima - Adjudicacion por titulo sucesorio', 'Pago de Legitima - Adjudicacion por titulo sucesorio', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE),
    ('1104', 'C/Cuantia', 'Renuncia a Legitima incluida la futura (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SMC', FALSE),
    ('1104', 'S/Cuantia', 'Renuncia a Legitima incluida la futura (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SMC', FALSE),
    ('1104', 'C/Cuantia', 'Renuncia pura y simple de herencia (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('1104', 'S/Cuantia', 'Renuncia pura y simple de herencia (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SD0', FALSE),
    ('1105', 'C/Cuantia', 'Renuncia traslativa de herencia (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SD0', FALSE),
    ('1105', 'S/Cuantia', 'Renuncia traslativa de herencia (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SD0', FALSE),
    ('1106', 'C/Cuantia', 'Extincion de usufructo, uso o habitacion por fallecimiento/otros (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1106', 'S/Cuantia', 'Extincion de usufructo, uso o habitacion por fallecimiento/otros (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1108', 'C/Cuantia', 'Aprobacion de la particion realizada por el contador partidor (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1108', 'S/Cuantia', 'Aprobacion de la particion realizada por el contador partidor (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1202', 'Credito e-not@rio', 'Escritura de protocolizacion de poliza o credito personal (Credito e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1202', 'Prestamo e-not@rio', 'Escritura de protocolizacion de poliza o credito personal (Prestamo e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1203', 'Vivienda', 'Hipoteca BBVA inmobiliaria en garantia P/C/D (Vivienda)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'Vivienda', 'Hipoteca inmobiliaria en garantia (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'de prestamo/credito/deuda', 'Hipoteca inmobiliaria en garantia de prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN6', FALSE),
    ('1203', 'e-not@rio', 'Hipoteca inmobiliaria en garantia P/C/D (e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'Op', 'DN6', FALSE),
    ('1203', 'Inmueble', 'Hipoteca inmobiliaria en garantia P/C/D (Inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN6', FALSE),
    ('1203', 'Prestamo e-not@rio', 'Hipoteca inmobiliaria en garantia P/C/D (Prestamo e-not@rio)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN6', FALSE),
    ('1203', 'Promotor', 'Hipoteca inmobiliaria en garantia P/C/D (Promotor)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'Reconocimiento Deuda', 'Hipoteca inmobiliaria en garantia P/C/D (Reconocimiento Deuda)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'PO0', FALSE),
    ('1203', 'Rustica Jovenes Agric.', 'Hipoteca inmobiliaria en garantia P/C/D (Rustica Jovenes Agric.)', TRUE, 0.475, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'Sujeta a IVA', 'Hipoteca inmobiliaria en garantia P/C/D (Sujeta a IVA)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'Unilateral Inmueble', 'Hipoteca inmobiliaria en garantia P/C/D (Unilateral Inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1203', 'Unilateral Vivienda', 'Hipoteca inmobiliaria en garantia P/C/D (Unilateral Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', 'DN6', FALSE),
    ('1203', 'Vivienda', 'Hipoteca inmobiliaria en garantia P/C/D (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', 'DN6', FALSE),
    ('1203', 'Vpo 50%', 'Hipoteca inmobiliaria en garantia P/C/D (Vpo 50%)', TRUE, 0.625, 0, TRUE, FALSE, 'Op', 'DN5', FALSE),
    ('1204', 'e-not@rio', 'Hipoteca inmobiliaria en garantia de otras obligaciones (e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'Op', '', FALSE),
    ('1204', 'Inmueble', 'Hipoteca inmobiliaria en garantia de otras obligaciones (Inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1204', 'Vivienda', 'Hipoteca inmobiliaria en garantia de otras obligaciones (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1205', 'e-not@rio', 'Hipoteca mobiliaria en garantia prestamo (e-not@rio)', TRUE, 0.25, 0, TRUE, FALSE, 'No', 'DN6', FALSE),
    ('1205', '/credito/deuda', 'Hipoteca mobiliaria en garantia prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN6', FALSE),
    ('1205', 'Credito e-not@rio', 'Hipoteca mobiliaria en garantia prestamo/credito/deuda (Credito e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'No', 'DN6', FALSE),
    ('1205', 'Mobiliaria', 'Hipoteca mobiliaria en garantia prestamo/credito/deuda (Mobiliaria)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN6', FALSE),
    ('1205', 'Reconocimiento Deuda', 'Hipoteca mobiliaria en garantia prestamo/credito/deuda (Reconocimiento Deuda)', TRUE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE),
    ('1205', 'Reconocimiento Deuda', 'Hipoteca mobiliaria en garantia prestamo/credito/deuda (Reconocimiento Deuda)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1207', 'Hipoteca naval en garantia de prestamo/creditos/deuda', 'Hipoteca naval en garantia de prestamo/creditos/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1207', 'Reconocimiento Deuda', 'Hipoteca naval en garantia de prestamo/creditos/deuda (Reconocimiento Deuda)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1209', 'Pignoracion en garantia de prestamo/credito/deuda', 'Pignoracion en garantia de prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'PO0', FALSE),
    ('1209', 'Reconocimiento de deuda - Pignoracion en garantia de P/C/D', 'Reconocimiento de deuda - Pignoracion en garantia de P/C/D', TRUE, 0, 0, TRUE, TRUE, 'No', 'PO0', FALSE),
    ('1211', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1211', 'Credito e-not@rio', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda (Credito e-not@rio)', TRUE, 0, 0, TRUE, FALSE, 'No', 'DN6', FALSE),
    ('1211', 'Prestamo e-not@rio', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda (Prestamo e-not@rio)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1211', 'Sin Desplazamiento', 'Prenda sin desplazamiento en garantia prestamo/credito/deuda (Sin Desplazamiento)', TRUE, 0, 0, TRUE, TRUE, 'No', 'PO0', FALSE),
    ('1215', 'Distribucion de responsabilidad Hipot Vivienda', 'Distribucion de responsabilidad Hipot Vivienda', TRUE, 0.4375, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1215', 'Distribucion de responsabilidad Hipot Vivienda VPO', 'Distribucion de responsabilidad Hipot Vivienda VPO', TRUE, 0.625, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1215', 'Distribucion de responsabilidad Hipotecaria', 'Distribucion de responsabilidad Hipotecaria', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1216', 'Novacion de prestamo Ley 8/2012 - Afianzamiento', 'Novacion de prestamo Ley 8/2012 - Afianzamiento', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1216', 'Novacion de prestamo Ley 8/2012 - Ampliacion o Reduccion', 'Novacion de prestamo Ley 8/2012 - Ampliacion o Reduccion', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1216', 'Novacion de prestamo RD 19/2022 - vulnerabilidad', 'Novacion de prestamo RD 19/2022 - vulnerabilidad', FALSE, 1, 7.5, TRUE, FALSE, 'No', '', TRUE),
    ('1216', 'Novacion de prestamo RDL 6/12 - hipotecarios sin recursos', 'Novacion de prestamo RDL 6/12 - hipotecarios sin recursos', FALSE, 1, 30, TRUE, FALSE, 'No', '', FALSE),
    ('1216', 'Novacion de prestamo segun ley 2/1994', 'Novacion de prestamo segun ley 2/1994', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1216', 'Afianzamiento', 'Novacion de prestamo segun ley 2/1994 - Afianzamiento', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1216', 'Alteracion de plazo', 'Novacion de prestamo segun ley 2/1994 - Alteracion de plazo', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1216', 'Ampliacion o Reduccion', 'Novacion de prestamo segun ley 2/1994 - Ampliacion o Reduccion', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1216', 'Ley 8/2012', 'Novacion de Prestamo/C.Hipotecario (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1217', 'Ley 8/2012', 'Subrogacion de Prestamo/C.Hipotecario (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'Si', '', FALSE),
    ('1217', 'Ley 2/1994', 'Subrogacion Hipotecaria por cambio de acreedor (Ley 2/1994)', FALSE, 0, 0, TRUE, FALSE, 'Si', 'DN5', FALSE),
    ('1220', 'Escritura de afianzamiento', 'Escritura de afianzamiento', TRUE, 0, 0, TRUE, TRUE, 'No', 'FZ0', FALSE),
    ('1220', 'Operacion subsidiaria con IVA', 'Escritura de afianzamiento (Operacion subsidiaria con IVA)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1220', 'Vivienda', 'Escritura de afianzamiento (Vivienda)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'FZ0', FALSE),
    ('1220', 'minuta deudor', 'Escritura de afianzamiento (Vivienda) (minuta deudor)', TRUE, 0.4375, 0, TRUE, TRUE, 'No', 'FZ0', FALSE),
    ('1222', 'Garantias innominadas o atipicas - otras', 'Garantias innominadas o atipicas - otras', TRUE, 0, 0, TRUE, TRUE, 'No', 'FZ0', FALSE),
    ('1222', 'Garantias reales', 'Garantias innominadas o atipicas - otras (Garantias reales)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1222', 'S/Cuantia', 'Garantias innominadas o atipicas - otras (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'FZ0', FALSE),
    ('1223', 'C/Cuantia', 'Novaciones de prestamo - otras (C/Cuantia)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1223', 'codigo de buenas practicas', 'Novaciones de prestamo - otras (codigo de buenas practicas)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1223', 'Ley 8/2012', 'Novaciones de prestamo - otras (codigo de buenas practicas) (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1223', 'Derechos Reales', 'Novaciones de prestamo - otras (Derechos Reales)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1223', 'Hipotecario Vivienda', 'Novaciones de prestamo - otras (Hipotecario Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1223', 'moratoria RD ley 8/2020', 'Novaciones de prestamo - otras (moratoria RD ley 8/2020)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1223', 'S/Cuantia', 'Novaciones de prestamo - otras (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1223', 'Ley Concursal DA 1ª, RD ley 3/2009', 'Novaciones de prestamo (Ley Concursal DA 1ª, RD ley 3/2009)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1224', 'aumento capital', 'Ampliacion de Hipoteca (Inmueble) (aumento capital)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN5', FALSE),
    ('1224', 'aumento capital', 'Ampliacion de Hipoteca (Vivienda) (aumento capital)', TRUE, 0.4375, 0, TRUE, TRUE, 'Si', 'DN5', FALSE),
    ('1225', 'C/Cuantia', 'Subrogacion Hipotecaria por cambio de acreedor - otras (C/Cuantia)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', 'DN5', FALSE),
    ('1225', 'S/Cuantia', 'Subrogacion Hipotecaria por cambio de acreedor - otras (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Si', 'DN5', FALSE),
    ('1227', 'C/Cuantia sobre vivienda', 'Hipoteca Inversa (C/Cuantia sobre vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Si', '', FALSE),
    ('1227', 'C/Cuantia', 'Hipoteca Inversa (C/Cuantia)', TRUE, 0.25, 0, TRUE, TRUE, 'Si', '', FALSE),
    ('1227', 'S/Cuantia', 'Hipoteca Inversa (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Si', '', FALSE),
    ('1228', 'C/Cuantia', 'Pacto Anticretico (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Si', '', FALSE),
    ('1228', 'S/Cuantia', 'Pacto Anticretico (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Si', 'DN5', TRUE),
    ('1229', 'inmueble', 'Ampliacion garantia hipotecaria con otros bienes (inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1229', 'vivienda', 'Ampliacion garantia hipotecaria con otros bienes (vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1230', 'legal hipotecaria-unilateral', 'Moratorias RD-Ley 2020 (legal hipotecaria-unilateral)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'legal hipotecaria', 'Moratorias RD-Ley 2020 (legal hipotecaria)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'legal no hipotecaria', 'Moratorias RD-Ley 2020 (legal no hipotecaria)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'mixta-bilateral', 'Moratorias RD-Ley 2020 (mixta-bilateral)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'mixta-unilateral', 'Moratorias RD-Ley 2020 (mixta-unilateral)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'sectorial-bilateral con ampliacion de plazo', 'Moratorias RD-Ley 2020 (sectorial-bilateral con ampliacion de plazo)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'sectorial-bilateral sin ampliacion de plazo', 'Moratorias RD-Ley 2020 (sectorial-bilateral sin ampliacion de plazo)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'sectorial-bilateral', 'Moratorias RD-Ley 2020 (sectorial-bilateral)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'sectorial-unilateral con ampliacion de plazo', 'Moratorias RD-Ley 2020 (sectorial-unilateral con ampliacion de plazo)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'sectorial', 'Moratorias RD-Ley 2020 (sectorial)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'transporte', 'Moratorias RD-Ley 2020 (transporte)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1230', 'turistica', 'Moratorias RD-Ley 2020 (turistica)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1231', 'legal hipotecaria', 'Moratorias RD-Ley 6/2024 (legal hipotecaria)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1231', 'legal no hipotecaria', 'Moratorias RD-Ley 6/2024 (legal no hipotecaria)', FALSE, 0.5, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1301', 'sin cancelacion de garantia real', 'Carta de Pago (sin cancelacion de garantia real)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1301', 'S/Cuantia', 'Carta de Pago (sin cancelacion de garantia real) (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1302', 'C/Cuantia', 'Carta de Pago (C/Cuantia)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1302', 'S/Cuantia', 'Carta de Pago (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'Op', '', FALSE),
    ('1302', 'y cancelacion de Hipoteca', 'Carta de Pago y cancelacion de Hipoteca', TRUE, 0.25, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1302', 'Ley 8/2012', 'Carta de Pago y cancelacion de Hipoteca (Ley 8/2012)', TRUE, 0.7, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1302', 'RD 1612/2011', 'Carta de Pago y Cancelacion de Hipoteca (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'Op', 'DN5', TRUE),
    ('1302', 'Sin garantia de prestamo', 'Carta de Pago y cancelacion de Hipoteca (Sin garantia de prestamo)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1302', 'Vivienda', 'Carta de Pago y cancelacion de Hipoteca (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'Op', 'DN5', FALSE),
    ('1304', 'deudores sin recursos', 'Cancelacion de Hipoteca (deudores sin recursos)', FALSE, 0, 15, TRUE, FALSE, 'No', '', FALSE),
    ('1304', 'RD 1612/2011', 'Cancelacion de Hipoteca (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1304', 'Inmueble', 'Cancelacion de Hipoteca sin Carta de Pago (Inmueble)', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1304', 'Ley 8/2012', 'Cancelacion de Hipoteca sin Carta de Pago (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1304', 'Otras Garantias', 'Cancelacion de Hipoteca sin Carta de Pago (Otras Garantias)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1304', 'RD 1612/2011', 'Cancelacion de Hipoteca sin Carta de Pago (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1304', 'Vivienda', 'Cancelacion de Hipoteca sin Carta de Pago (Vivienda)', TRUE, 0.4375, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1305', 'C/Cuantia', 'Cancelacion de Hipoteca por exhibicion e inutilizacion efectos (C/Cuantia)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1305', 'Ley 8/2012', 'Cancelacion de Hipoteca por exhibicion e inutilizacion efectos (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1305', 'RD 1612/2011', 'Cancelacion de Hipoteca por exhibicion e inutilizacion efectos (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', TRUE),
    ('1306', 'C/Cuantia', 'Cancelacion de C. Resolutoria por exhib.o inutilizacion efectos (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1306', 'S/Cuantia', 'Cancelacion de C. Resolutoria por exhib.o inutilizacion efectos (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE),
    ('1307', 'Ley 8/2012', 'Cancelacion de Hipoteca mobiliaria (Ley 8/2012)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1307', 'RD 1612/2011', 'Cancelacion de Hipoteca mobiliaria (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', '', TRUE),
    ('1307', 'Cancelacion de prenda con o sin desplazamiento', 'Cancelacion de prenda con o sin desplazamiento', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1307', 'C/Cuantia', 'Cancelacion de prenda con o sin desplazamiento o Hipoteca mobiliaria (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1308', 'C/Cuantia', 'Cancelacion de C. Resolutoria y garantias sin Carta de Pago (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DG0', FALSE),
    ('1308', 'Por Renuncia Acreedor', 'Cancelacion de C. Resolutoria y garantias sin Carta de Pago (Por Renuncia Acreedor)', TRUE, 0.25, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1308', 'S/Cuantia', 'Cancelacion de C. Resolutoria y garantias sin Carta de Pago (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DG0', FALSE),
    ('1309', 'minuta banco', 'Liberacion de hipoteca sin cancelacion (Ley 8/2012) (minuta banco)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1309', 'minuta deudor', 'Liberacion de hipoteca sin cancelacion (minuta deudor)', TRUE, 0, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1309', 'RD 1612/2011', 'Liberacion de hipoteca sin cancelacion (RD 1612/2011)', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', TRUE),
    ('1309', 'S/Cuantia', 'Liberacion de hipoteca sin cancelacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1309', 'Vivienda', 'Liberacion de hipoteca sin cancelacion (Vivienda)', TRUE, 0.25, 0, TRUE, TRUE, 'No', 'DN5', FALSE),
    ('1401', 'Poder general', 'Poder general', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1401', 'hipoteca', 'Poder general (hipoteca)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1401', 'y preventivo', 'Poder general y preventivo', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'rep 143 rm', 'Designacion de persona fisica representante (rep 143 rm)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'Otro tipo de apoderamientos y/o autorizaciones', 'Otro tipo de apoderamientos y/o autorizaciones', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'Poder - Otro tipo de apoderamientos', 'Poder - Otro tipo de apoderamientos', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'doble columna', 'Poder - Otro tipo de apoderamientos (doble columna)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'gestoria', 'Poder especial (gestoria)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'Poder mercantil', 'Poder mercantil', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1405', 'Poder para Presentacion Telematica - otros', 'Poder para Presentacion Telematica - otros', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1406', 'Revocacion de apoderamiento mercantil', 'Revocacion de apoderamiento mercantil', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1406', 'Revocacion de apoderamiento o autorizacion', 'Revocacion de apoderamiento o autorizacion', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1409', 'Escritura de ratificacion o aceptacion', 'Escritura de ratificacion o aceptacion', FALSE, 0, 0, TRUE, FALSE, 'No', 'TU1', FALSE),
    ('1409', 'S/Cuantia', 'Escritura de ratificacion o aceptacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1601', 'Acta de requerimiento de conciliacion', 'Acta de requerimiento de conciliacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1601', 'Actas de notificacion y requerimiento', 'Actas de notificacion y requerimiento', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1601', 'Ley 2/1994', 'Actas de notificacion y requerimiento (Ley 2/1994)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1601', 'por exhorto de otro Notario', 'Actas de notificacion y requerimiento (por exhorto de otro Notario)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1602', 'Aportacion a sociedad conyugal', 'Actas de manifestaciones (Aportacion a sociedad conyugal)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1602', 'Hijo comun', 'Actas de manifestaciones (Hijo comun)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1602', 'Reagrupacion Familiar', 'Actas de manifestaciones (Reagrupacion Familiar)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1602', 'y referencia', 'Actas de manifestaciones y referencia', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1608', 'C/Cuantia-Reduccion', 'Actas de protocolizacion en general (C/Cuantia-Reduccion)', TRUE, 0.85, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1608', 'C/Cuantia', 'Actas de protocolizacion en general (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('1608', 'S/Cuantia', 'Actas de protocolizacion en general (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1612', 'C/Cuantia', 'Actas de entrega (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1612', 'Capital de Prestamo', 'Actas de entrega (Capital de Prestamo)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1612', 'Embarcacion C/Cuantia', 'Actas de entrega (Embarcacion C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1612', 'Embarcacion', 'Actas de entrega (Embarcacion)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1612', 'Inmueble por cesion', 'Actas de entrega (Inmueble por cesion)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'TU1', FALSE),
    ('1612', 'Inmueble S/Cuantia', 'Actas de entrega (Inmueble S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1612', 'Legado', 'Actas de entrega (Legado)', TRUE, 0, 0, TRUE, TRUE, 'Op', 'SMC', FALSE),
    ('1612', 'S/Cuantia', 'Actas de entrega (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1614', 'Actas de reunion de organo colegiado', 'Actas de reunion de organo colegiado', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1614', 'Comunidad Propietarios', 'Actas de reunion de organo colegiado (Comunidad Propietarios)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1614', 'Consejo Administracion', 'Actas de reunion de organo colegiado (Consejo Administracion)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1614', 'Junta General', 'Actas de reunion de organo colegiado (Junta General)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1616', 'Actas de sorteo', 'Actas de sorteo', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1616', 'C/Cuantia', 'Actas de sorteo (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1619', 'C/Cuantia - bonificado', 'Actas de deposito en consignacion (C/Cuantia - bonificado)', TRUE, 0.85, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1619', 'C/Cuantia', 'Actas de deposito en consignacion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1619', 'S/Cuantia', 'Actas de deposito en consignacion (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1620', 'C/Cuantia', 'Actas de deposito - otras (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'Op', '', FALSE),
    ('1620', 'S/Cuantia', 'Actas de deposito - otras (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'Op', '', FALSE),
    ('1622', 'Actas de fijacion de saldo para despachar ejecucion', 'Actas de fijacion de saldo para despachar ejecucion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1622', 'C/Cuantia', 'Actas de fijacion de saldo para despachar ejecucion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1623', 'C/Cuantia', 'Actas de tramitacion de venta extrajudicial (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1623', 'S/Cuantia', 'Actas de tramitacion de venta extrajudicial (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1625', 'Actas de notoriedad para la inmatriculacion de fincas', 'Actas de notoriedad para la inmatriculacion de fincas', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('1625', 'S/Cuantia', 'Actas de notoriedad para la inmatriculacion de fincas (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'TU0', FALSE),
    ('1626', 'Acta de notoriedad para la constancia de exceso de cabida', 'Acta de notoriedad para la constancia de exceso de cabida', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU0', FALSE),
    ('1626', 'S/Cuantia', 'Acta de notoriedad para la constancia de exceso de cabida (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'TU0', FALSE),
    ('1631', 'Acta de requerimiento para Declaracion de Inmatriculacion', 'Acta de requerimiento para Declaracion de Inmatriculacion', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1631', '/Reanudacion de tracto registral', 'Acta de requerimiento para Declaracion de Inmatriculacion/Reanudacion de tracto registral', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1631', 'Acta de requerimiento para Reanudacion de tracto registral', 'Acta de requerimiento para Reanudacion de tracto registral', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1631', 'Acta de requerimiento para Reanudacion de tracto registral', 'Acta de requerimiento para Reanudacion de tracto registral', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1632', 'Acta de requerimiento para Declaracion de Notoriedad de constancia de exceso de cabida', 'Acta de requerimiento para Declaracion de Notoriedad de constancia de exceso de cabida', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1632', 'Acta de requerimiento para Declaracion de Notoriedad de constancia de exceso de cabida', 'Acta de requerimiento para Declaracion de Notoriedad de constancia de exceso de cabida', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1641', 'C/Cuantia', 'Acta de procedimiento de reclamacion de deudas dinerarias no contradichas (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE),
    ('1641', 'S/Cuantia', 'Acta de procedimiento de reclamacion de deudas dinerarias no contradichas (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'TU2', FALSE),
    ('1643', 'C/Cuantia', 'Acta de jurisdiccion voluntaria sobre recuperacion depositos y titulos valores (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1643', 'S/Cuantia', 'Acta de jurisdiccion voluntaria sobre recuperacion depositos y titulos valores (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1645', 'C/Cuantia', 'Expediente de dominio (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE),
    ('1645', 'S/Cuantia', 'Expediente de dominio (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1646', 'Acta de deslinde o subsanacion de discrepancias', 'Acta de deslinde o subsanacion de discrepancias', TRUE, 0, 0, TRUE, TRUE, 'No', 'TU2', FALSE),
    ('1646', 'S/Cuantia', 'Acta de deslinde o subsanacion de discrepancias (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', 'TU2', FALSE),
    ('1649', 'C/Cuantia', 'Acta de extravio, sustraccion o destruccion del conocimiento de embarque (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1649', 'S/Cuantia', 'Acta de extravio, sustraccion o destruccion del conocimiento de embarque (S/Cuantia)', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1715', 'Poliza de Solicitud de Certificado Electronico', 'Poliza de Solicitud de Certificado Electronico', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1715', 'Corporativo', 'Solicitud Cert. Electronico (Corporativo)', TRUE, 1, 140, TRUE, FALSE, 'No', '', FALSE),
    ('1715', 'Fundaciones Catalanas', 'Solicitud Cert. Electronico (Fundaciones Catalanas)', TRUE, 1, 80, TRUE, FALSE, 'No', '', FALSE),
    ('1715', 'Personal', 'Solicitud Cert. Electronico (Personal)', TRUE, 1, 120, TRUE, FALSE, 'No', '', FALSE),
    ('1715', 'Servidor Seguro', 'Solicitud Cert. Electronico (Servidor Seguro)', TRUE, 1, 500, TRUE, FALSE, 'No', '', FALSE),
    ('1718', 'Moratoria - Otros Contratos Mercantiles Distintos de los Anteriores', 'Moratoria - Otros Contratos Mercantiles Distintos de los Anteriores', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE),
    ('1718', 'Otros Contratos Mercantiles Distintos de los Anteriores', 'Otros Contratos Mercantiles Distintos de los Anteriores', TRUE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1731', 'legal', 'Moratorias RD-Ley 2020 (legal)', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE),
    ('1731', 'sectorial', 'Moratorias RD-Ley 2020 (sectorial)', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE),
    ('1731', 'transporte', 'Moratorias RD-Ley 2020 (transporte)', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE),
    ('1731', 'turistica', 'Moratorias RD-Ley 2020 (turistica)', TRUE, 1, 47.17, TRUE, FALSE, 'No', '', FALSE),
    ('1803', 'Constitucion de comunidad de bienes', 'Constitucion de comunidad de bienes', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1803', 'S/Cuantia', 'Constitucion de comunidad de bienes (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SO0', FALSE),
    ('1808', 'Constitucion de union o agrupacion temporal de empresas', 'Constitucion de union o agrupacion temporal de empresas', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1808', 'S/Cuantia', 'Constitucion de union o agrupacion temporal de empresas (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', 'SO0', FALSE),
    ('1901', 'Constitucion de sociedad civil', 'Constitucion de sociedad civil', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1901', 'profesional', 'Constitucion de sociedad civil profesional', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1903', 'C/Cuantia', 'Agrupacion de interes urbanistico, J.Compensacion o Entidad Act.Urbanistica (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1903', 'S/Cuantia', 'Agrupacion de interes urbanistico, J.Compensacion o Entidad Act.Urbanistica (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1908', 'Constitucion de asociacion', 'Constitucion de asociacion', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1908', 'S/Cuantia', 'Constitucion de asociacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1912', 'Constitucion de sociedad limitada', 'Constitucion de sociedad limitada', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1912', 'art. 5.1 RDL 3/12/10', 'Constitucion de sociedad limitada (art. 5.1 RDL 3/12/10)', TRUE, 1, 150, TRUE, TRUE, 'No', '', FALSE),
    ('1912', 'art. 5.2 RDL 3/12/10', 'Constitucion de sociedad limitada (art. 5.2 RDL 3/12/10)', TRUE, 1, 60, TRUE, TRUE, 'No', '', FALSE),
    ('1912', 'profesional', 'Constitucion de sociedad limitada profesional', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1918', 'Constitucion de sociedad anonima nueva empresa', 'Constitucion de sociedad anonima nueva empresa', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1918', 'Constitucion de sociedad anonima profesional', 'Constitucion de sociedad anonima profesional', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1936', 'Soc. Limitada Laboral', 'Ampliacion de capital con suscripcion (Soc. Limitada Laboral)', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'SO1', FALSE),
    ('1936', 'Ampliacion de capital societario con suscripcion', 'Ampliacion de capital societario con suscripcion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO1', FALSE),
    ('1938', 'Aportacion de bienes a sociedad en constit. o aumento de capital', 'Aportacion de bienes a sociedad en constit. o aumento de capital', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO1', FALSE),
    ('1938', 'gratuito', 'Aportacion de bienes a sociedad en constit. o aumento de capital (gratuito)', TRUE, 1, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1941', 'Disolucion de sociedad mercantil', 'Disolucion de sociedad mercantil', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1941', 'Cooperativa fiscalmente protegida', 'Disolucion de sociedad mercantil (Cooperativa fiscalmente protegida)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1946', 'Transformacion en sociedad limitada', 'Transformacion en sociedad limitada', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1946', 'desde Cooperativa fiscalmente protegida', 'Transformacion en sociedad limitada (desde Cooperativa fiscalmente protegida)', TRUE, 0.5, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1946', 'profesional', 'Transformacion en sociedad limitada profesional', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1947', 'Transformacion en sociedad anonima', 'Transformacion en sociedad anonima', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1947', 'profesional', 'Transformacion en sociedad anonima profesional', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1949', 'Disolucion de sociedad por fusion', 'Disolucion de sociedad por fusion', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO5', FALSE),
    ('1949', 'S/Cuantia', 'Disolucion de sociedad por fusion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1958', 'C/Cuantia', 'Constitucion de establecimiento mercantil (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO0', FALSE),
    ('1958', 'S/Cuantia', 'Constitucion de establecimiento mercantil (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1959', 'Traslado y modificacion de domicilio social', 'Traslado y modificacion de domicilio social', FALSE, 0, 0, TRUE, FALSE, 'No', 'DN5', FALSE),
    ('1959', 'C/Cuantia', 'Traslado y modificacion de domicilio social (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1959', 'Origen España', 'Traslado y modificacion de domicilio social (Origen España)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1959', 'C/Cuantia', 'Traslado y modificacion de domicilio social (Origen extranjero) (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1959', 'S/Cuantia', 'Traslado y modificacion de domicilio social (Origen extranjero) (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1960', 'Cambio de denominacion', 'Cambio de denominacion', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1960', 'SLNE Ley 24/2005 de 18N', 'Cambio de denominacion (SLNE Ley 24/2005 de 18N)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1961', 'Modificacion de estatutos - Objeto social', 'Modificacion de estatutos - Objeto social', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1961', 'Modificacion de estatutos - Retribucion del organo de Administracion', 'Modificacion de estatutos - Retribucion del organo de Administracion', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1961', 'Modificaciones de estatutos - otras', 'Modificaciones de estatutos - otras', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1961', 'C/Cuantia', 'Modificaciones de estatutos - otras (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1961', 'Cooperativa imp. Legal', 'Modificaciones de estatutos - otras (Cooperativa imp. Legal)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1961', 'Modificaciones de regulacion de personas juridicas - otras', 'Modificaciones de regulacion de personas juridicas - otras', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1962', 'Adaptacion de estatutos sociales', 'Adaptacion de estatutos sociales', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1962', 'S/cuantia', 'Adaptacion de estatutos sociedad profesional (S/cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1963', 'Redenominacion de capital', 'Redenominacion de capital', FALSE, 0, 0, TRUE, FALSE, 'No', 'SX0', FALSE),
    ('1963', 'C/Cuantia', 'Redenominacion de capital (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX0', FALSE),
    ('1967', 'Separacion o exclusion de socio', 'Separacion o exclusion de socio', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1967', 's', 'Separacion o exclusion de socios', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1968', 'Reactivacion de sociedades', 'Reactivacion de sociedades', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1968', 'Cooperativa', 'Reactivacion de sociedades (Cooperativa)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1969', 'C/Cuantia', 'Actos relativos a entidades juridicas - otros supuestos (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1969', 'S/Cuantia', 'Actos relativos a entidades juridicas - otros supuestos (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1969', 'Renumeracion de las acciones/participaciones sociales', 'Renumeracion de las acciones/participaciones sociales', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1971', 'Liquidacion y extincion de otras sociedades CON identificacion de socios', 'Liquidacion y extincion de otras sociedades CON identificacion de socios', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE),
    ('1971', 'Liquidacion y extincion de sociedad anonima CON identificacion socios', 'Liquidacion y extincion de sociedad anonima CON identificacion socios', TRUE, 0, 0, TRUE, TRUE, 'No', 'SX2', FALSE),
    ('1971', 'Liquidacion y extincion de sociedad anonima laboral', 'Liquidacion y extincion de sociedad anonima laboral', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE),
    ('1971', 'S/Cuantia', 'Liquidacion y extincion de sociedad CON identificacion de socios (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1971', 'Liquidacion y extincion de sociedad Cooperativa fiscalmente protegida', 'Liquidacion y extincion de sociedad Cooperativa fiscalmente protegida', TRUE, 0.5, 0, TRUE, TRUE, 'No', 'SO2', FALSE),
    ('1971', 'no Nueva Empresa ni Laboral', 'Liquidacion y extincion de sociedad limitada (no Nueva Empresa ni Laboral)', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE),
    ('1971', 'Liquidacion y extincion de sociedad limitada laboral', 'Liquidacion y extincion de sociedad limitada laboral', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1971', 'Liquidacion y extincion de sociedad limitada Nueva Empresa', 'Liquidacion y extincion de sociedad limitada Nueva Empresa', TRUE, 0, 0, TRUE, TRUE, 'No', 'SO2', FALSE),
    ('1973', 'Nombramiento de Consejero Delegado', 'Nombramiento de Consejero Delegado', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'gratuito', 'Nombramiento de Consejero Delegado (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'Nombramiento de Liquidador', 'Nombramiento de Liquidador', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'gratuito', 'Nombramiento de Liquidador (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'Nombramiento de miembro del organo administracion', 'Nombramiento de miembro del organo administracion', FALSE, 0, 36.05, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'gratuito', 'Nombramiento de miembro del organo administracion (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'Nombramiento y distribucion de cargos societarios', 'Nombramiento y distribucion de cargos societarios', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1973', 'gratuito', 'Nombramiento y distribucion de cargos societarios (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1974', 'Nombramiento de auditor', 'Nombramiento de auditor', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1974', 'gratuito', 'Nombramiento de auditor (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1975', 'Nombramiento cargos de los restantes tipos de personas juridicas', 'Nombramiento cargos de los restantes tipos de personas juridicas', FALSE, 0, 6.01, TRUE, FALSE, 'No', '', FALSE),
    ('1975', 'gratuito', 'Nombramiento cargos de los restantes tipos de personas juridicas (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1976', 'Cese de administrador y otros cargos', 'Cese de administrador y otros cargos', FALSE, 1, 36.06, TRUE, FALSE, 'No', 'DN5', FALSE),
    ('1976', 'gratuito', 'Cese de administrador y otros cargos (gratuito)', FALSE, 1, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1980', 'C/Cuantia', 'Aumento de dotacion de fundacion (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1980', 'S/Cuantia', 'Aumento de dotacion de fundacion (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1985', 'C/Cuantia', 'Constitucion de estab. de entidad NO mercantil (C/Cuantia)', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1985', 'S/Cuantia', 'Constitucion de estab. de entidad NO mercantil (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE),
    ('1987', 'Liquidacion y extincion de otras sociedades SIN identificacion de los socios', 'Liquidacion y extincion de otras sociedades SIN identificacion de los socios', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1987', 'Liquidacion y extincion de sociedad anonima SIN identificacion socios', 'Liquidacion y extincion de sociedad anonima SIN identificacion socios', TRUE, 0, 0, TRUE, TRUE, 'No', '', FALSE),
    ('1987', 'S/Cuantia', 'Liquidacion y extincion de sociedad SIN identificacion de los socios (S/Cuantia)', FALSE, 0, 0, TRUE, FALSE, 'No', '', FALSE);

-- 14. Defaults protocolo electrónico
INSERT INTO default_pe (concepto_id, folios_override) VALUES
    ('test_cotejo_pe', 4),
    ('test_hash', NULL),
    ('dil_deposito_pe', NULL),
    ('dil_incorp_pe', NULL);

-- 15. Defaults gastos
INSERT INTO default_gasto (gasto_id) VALUES
    ('g_consulta_deudas'),
    ('g_obt_cert_catastral'),
    ('g_otros_gastos'),
    ('g_peticion_nota'),
    ('g_pres_telematica'),
    ('g_solicitud_cif');

-- 16. Defaults suplidos
INSERT INTO default_suplido (suplido_id) VALUES
    ('s_pago_signo'),
    ('s_na_octava');

COMMIT;
