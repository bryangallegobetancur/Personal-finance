# Entrega 1: proyecto y material técnico

## Contexto académico

- Actividad: Taller ABP, Proyecto y Material Técnico.
- Ponderación: 20% de la nota final.
- Competencia: identificar fundamentos teóricos, aplicaciones y aspectos éticos de la inteligencia artificial para resolver situaciones de la organización.
- Entrega: únicamente el enlace público del repositorio en el buzón de Canvas.
- Plazo: el enunciado compartido no especifica una fecha. Consultar el calendario del curso.

## Situación problema

El caso de trabajo del proyecto es el control de las finanzas personales de quien registra ingresos y gastos en medios dispersos. Esa dispersión dificulta conocer el saldo de un período, identificar categorías de gasto y advertir cuándo se supera un presupuesto.

Se plantea para personas que administran su economía y para trabajadores independientes que necesitan ordenar sus movimientos personales. Este es el problema inferido del producto existente, no una transcripción de un caso específico del docente ni el resultado de una investigación de usuarios. Si el docente asigna una situación organizacional distinta, el equipo debe validar su correspondencia antes de entregar.

## Objetivo del proyecto

Centralizar el registro y la consulta de movimientos en una aplicación web desplegada en la nube, con acceso por usuario, reportes por período y alertas al superar topes.

## Alcance implementado

- Registro, inicio de sesión y recuperación de contraseña mediante Supabase Auth.
- Creación, edición, clonación y eliminación de transacciones.
- Categorías y presupuestos mensuales o anuales, con fechas de vigencia opcionales.
- Dashboard por mes, categoría o rango de fechas, con ingresos, gastos y balance.
- Historial de alertas, trigger SQL y suscripción a Supabase Realtime.
- Modo exploración con datos de ejemplo en memoria.
- Interfaz adaptable y temas Vidrio, Menta, Aurora y Profundo.
- Selección de formato monetario. No realiza conversión de divisas.

No incluye conexión bancaria, pagos, contabilidad empresarial, recomendaciones de inversión ni modelos de IA en ejecución. El análisis relacionado con la competencia de IA está en [IA y ética](IA_Y_ETICA.md).

## Correspondencia con la rúbrica

| Criterio | Evidencia en el repositorio | Estado |
| --- | --- | --- |
| Análisis del problema | Este documento | Caso del producto documentado; falta ratificación del docente si exige un caso específico |
| Arquitectura tecnológica en la nube | [Arquitectura](ARQUITECTURA.md), `vercel.json` y migraciones SQL | Implementación y diagrama documentados |
| Funcionalidad y despliegue | [Demo pública](https://personal-finance-taupe-psi.vercel.app/explore/dashboard) | Acceso público y exploración verificados |
| Buenas prácticas de ingeniería | TypeScript, Zod, separación de componentes/hooks, ESLint y workflow de CI | Comprobaciones locales documentadas; pruebas de integración cloud pendientes |
| Organización técnica en GitHub | README, `src`, `supabase/migrations`, `docs` | Material organizado |
| Presentación clara | [PDF](presentacion-proyecto.pdf) y [PPTX](presentacion-proyecto.pptx) | Una diapositiva ejecutiva en estilo Vidrio |
| Fundamentos y ética de IA | [IA y ética](IA_Y_ETICA.md) | Uso actual y propuesta futura diferenciados |
| Visibilidad pública | [Repositorio](https://github.com/bryangallegobetancur/Personal-finance) | Verificada sin autenticación el 11 de octubre de 2026 |
| Entrega oportuna | Buzón de Canvas | Pendiente del estudiante; no se ha enviado a Canvas |

## Autoría y modalidad

El README previo identifica a **Bryan Stiven Gallego Betancur, John Alejandro Alvarez Muñoz y Daniel Santiago Naranjo Rodriguez**. Se conserva esa atribución. El enunciado indica trabajo individual o en parejas según el docente: confirmar si los tres autores pueden presentar juntos o cuál es el equipo formal de entrega. No se atribuyen roles individuales sin confirmación.

## Lista final para el estudiante

- [ ] Confirmar modalidad de trabajo y autores admitidos con el docente.
- [ ] Confirmar que el caso de finanzas personales responde a la situación asignada.
- [ ] Confirmar si la competencia exige implementar IA o admite el análisis conceptual y ético incluido.
- [ ] Completar las pruebas con usuarios de prueba en Supabase indicadas en [Evidencias](EVIDENCIAS.md).
- [ ] Comprobar el workflow de GitHub y el despliegue asociado al último commit.
- [ ] Verificar el plazo y pegar únicamente el enlace del repositorio en Canvas.
