En el directorio boe_lector esta el script en python que comprueba el boe por fecha y dentro de los resultados extrae los BOE-A que son los consolidados y busca referencias a los aranceles notariasles.


```
══════════════════════════════════════════════════════════════════════
  ▶ BOE LECTOR  —  Sumario del 22/12/2022
══════════════════════════════════════════════════════════════════════

  10:01:04 ℹ  Carpeta de datos: datos/20221222

──────────────────────────────────────────────────────────────────────

  10:01:04 ℹ  Paso 1/3 — Descargando sumario del BOE: https://www.boe.es/boe/dias/2022/12/22/
  10:01:04 💾  XML guardado  datos/20221222/sumario_20221222_100104.xml
  10:01:04 ✓  Encontrados 170 ítems en el sumario

──────────────────────────────────────────────────────────────────────

  10:01:04 ℹ  Paso 3/3 — Consultando legislación y buscando coincidencias
  10:01:04 💾  XML guardado  datos/20221222/BOE-A-2022-21739.xml
  10:01:04 ★  [1/170] 5 coincidencias en BOE-A-2022-21739

  [MATCH #1]
  ID:      BOE-A-2022-21739
  Título:  Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  Palabra: novaci  +  igual
  Frase:   Incrementando los índices de innovación en el conjunto del territorio, más allá de las concentraciones urbanas, se podrá configurar una red de oportunidades para todos los ciudadanos independientemente del lugar en el que residan, favoreciendo la desconcentración de población y actividades y promoviendo la igualdad de derechos y oportunidades en todo el territorio.
  URL:     https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739

  [MATCH #2]
  ID:      BOE-A-2022-21739
  Título:  Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  Palabra: exenci  +  igual
  Frase:   Así, se eleva el importe de la exención de los 12.000 a los 50.000 euros anuales en el caso de entrega de acciones o participaciones a los empleados de empresas emergentes, exención aplicable igualmente cuando dicha entrega sea consecuencia del ejercicio de opciones de compra previamente concedidas a aquellos.
  URL:     https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739

  [MATCH #3]
  ID:      BOE-A-2022-21739
  Título:  Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  Palabra: emprendedor  +  superior
  Frase:   El procedimiento de evaluación llevado a cabo por ENISA se efectuará en un plazo, no superior a tres meses, a contar desde la fecha en que la solicitud, completa con toda la información requerida, efectuada por los emprendedores que quieran acogerse a los beneficios y especialidades de esta ley haya tenido entrada en el registro electrónico habilitado a tal fin.
  URL:     https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739

  [MATCH #4]
  ID:      BOE-A-2022-21739
  Título:  Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  Palabra: arancel  +  inferior
  Frase:   Los aranceles notariales y registrales, en el caso de que los emprendedores que se acojan a los estatutos tipo adaptados a las necesidades de las empresas emergentes, a los que se refiere la disposición final duodécima, utilicen el sistema de tramitación telemática del Centro de Información y Red de Creación de Empresas y el capital social sea inferior a 3.100 euros, serán de 60 y 40 euros respectivamente.
  URL:     https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739

  [MATCH #5]
  ID:      BOE-A-2022-21739
  Título:  Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  Palabra: exenci  +  euros
  Frase:   La exención prevista en el párrafo anterior será de 50.000 euros anuales en el caso de entrega de acciones o participaciones concedidas a los trabajadores de una empresa emergente a las que se refiere la Ley 28/2022, de 21 de diciembre, de fomento del ecosistema de las empresas emergentes.
  URL:     https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739

──────────────────────────────────────────────────────────────────────


══════════════════════════════════════════════════════════════════════
  ▶ RESUMEN FINAL
══════════════════════════════════════════════════════════════════════

  10:01:38 ✓  Ítems procesados: 170
  10:01:38 ✓  Coincidencias encontradas: 5
  10:01:38 💾  JSON guardado  resultados/resultados_20221222_100104.json
  10:01:38 💾  Resultados TXT guardados  resultados/resultados_20221222_100104.txt
  10:01:38 ✓  Proceso completado.

```

