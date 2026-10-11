# Fundamentos y aspectos éticos de la IA

## Relación con el elemento de competencia

La actividad pide identificar fundamentos, aplicaciones y aspectos éticos de la IA. Esta entrega documenta esos conceptos aplicados al dominio financiero y distingue la asistencia usada durante el desarrollo de una funcionalidad de IA ofrecida al usuario.

## Fundamentos relevantes

| Concepto | Aplicación al problema |
| --- | --- |
| Automatización por reglas | Comparar una suma de gastos con un presupuesto, usando condiciones explícitas |
| Aprendizaje supervisado | Aprender de ejemplos etiquetados para sugerir una categoría a partir de una descripción |
| Inferencia | Aplicar un modelo entrenado a un movimiento nuevo; requiere medir errores fuera del conjunto de entrenamiento |
| IA generativa | Producir texto o recursos gráficos a partir de instrucciones; requiere revisión porque puede producir contenido incorrecto |
| Evaluación | Comparar una propuesta con una línea base y revisar errores por categoría, no solo una cifra global |

El dashboard calcula sumas y el trigger aplica reglas SQL. **No hay entrenamiento, inferencia, chatbot, clasificación automática ni API de modelos de IA en la aplicación actual.** No se debe presentar el cálculo del balance o las alertas como aprendizaje automático.

## Uso de IA durante esta entrega

Se utilizó un asistente de IA para apoyar ajustes de interfaz, revisión del código, documentación y material de presentación. El fondo decorativo Vidrio de la diapositiva se generó con IA. La captura de la aplicación corresponde al modo exploración real y contiene datos de ejemplo. Los textos y el diagrama arquitectónico se construyeron a partir del código revisado.

El equipo conserva la responsabilidad de contrastar las afirmaciones con el repositorio y de explicar las decisiones en la exposición. El uso de IA como apoyo no prueba que el producto implemente IA ni sustituye la evaluación del docente.

## Aplicación futura propuesta: sugerencia de categoría

Una posible ampliación sería sugerir categorías para las descripciones de movimientos. Se documenta como propuesta, **no se implementa en esta entrega**.

1. Definir categorías y reunir ejemplos consentidos o sintéticos, sin identificadores financieros.
2. Comparar un clasificador supervisado con una línea base sencilla de reglas.
3. Separar entrenamiento y evaluación para evitar que el mismo texto aparezca en ambos conjuntos.
4. Medir precisión por categoría y macro-F1, revisar falsos positivos y establecer cuándo abstenerse de sugerir.
5. Mostrar la sugerencia al usuario para confirmación antes de guardar. No modificar importes ni ejecutar pagos.

Esta propuesta no tiene métricas de calidad ni resultados experimentales todavía. Requeriría datos adecuados, evaluación y autorización antes de cualquier integración con proveedores externos.

## Riesgos y controles

| Riesgo | Control actual o necesario |
| --- | --- |
| Divulgación de datos personales | Usar datos de ejemplo en evidencias; no enviar movimientos reales a modelos externos |
| Acceso entre usuarios | RLS implementada en SQL; completar pruebas con dos cuentas y revisar claves foráneas |
| Error o alucinación | Verificar documentación y código; validar cualquier sugerencia futura con el usuario |
| Sesgo | Evaluar categorías poco representadas, lenguaje local y casos ambiguos antes de desplegar un modelo |
| Automatización excesiva | Mantener revisión humana y no delegar decisiones financieras a la propuesta de IA |
| Falta de transparencia | Informar qué parte usa reglas, qué parte usa IA y cuáles son sus límites |
| Autoría y trazabilidad | Conservar atribuciones, código versionado, fuentes y registro del uso de IA |

Como marco de referencia para gestionar riesgos se puede consultar el [AI Risk Management Framework del NIST](https://www.nist.gov/itl/ai-risk-management-framework). No se afirma que el proyecto tenga certificación o cumplimiento formal de ese marco.

## Condición académica pendiente

Si el docente exige una funcionalidad de IA implementada, el estado actual del producto no satisface ese requisito adicional. Confirmarlo antes de entregar, ya que los pasos de la actividad compartida exigen una solución en la nube, pero no especifican un modelo o una tarea de IA concreta.
