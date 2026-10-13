# Oferta: auditoría de un agente de pagos (piloto)

*Borrador para el primer cliente. Los precios son hipótesis por validar; los decide Cristóbal.*

## Para quién

Una fintech o un comercio que ya tiene, o está por lanzar, un agente de IA que toca dinero:
- pagos a proveedores;
- devoluciones y reembolsos;
- conciliación;
- reclamos con efecto financiero.

## Alcance

| | Incluye |
| --- | --- |
| **Flujo** | Uno, acordado al inicio. Por ejemplo: pagos a proveedores con presupuesto, o devoluciones de cobros duplicados. |
| **Agente** | El tuyo, con tu prompt, tu modelo y tu runtime, conectado por el puente HTTP/JSON de Axiomic. Hasta dos versiones o configuraciones. |
| **Escenarios** | Nuestras disciplinas conocidas, adaptadas a tu flujo, más un conjunto reservado que tu equipo no ve antes de la medición. |
| **Medición** | Preregistrada: reglas, escenarios y presupuesto congelados antes de correr. Cada episodio se puede reproducir. |

## Entregables

1. **Informe** con aprobación por criterio (objetivo, seguridad, declaración, terminación), pesos en
   riesgo por millón delegado, episodios con pérdida e intervalo de confianza.
2. **Casos reproducibles:** cada falla con su transcripción, su clasificación (tu configuración, tu
   agente o una ambigüedad nuestra) y el comando para reproducirla.
3. **Recomendación de controles:** las reglas de Gateway que habrían bloqueado cada pérdida, y qué
   cambiar en el prompt o en las herramientas.
4. **Una repetición** después de tus cambios, con la misma batería, para comparar versiones.

## Plazo

| Semana | Trabajo |
| --- | --- |
| 1 | Acordar el flujo, conectar el agente y adaptar los escenarios. |
| 2 | Medición y auditoría. |
| 3 | Informe, revisión con tu equipo y repetición. |

## Qué necesitamos de ti

- **Un endpoint o runtime de tu agente** que reciba observaciones JSON y devuelva una decisión por
  turno. Usamos un token por episodio y nunca credenciales de producción.
- **Las llamadas a modelos.** Corren con tu cuenta, o con la nuestra con un tope acordado.
- **Datos ficticios.** El flujo se modela sin datos reales de clientes.
- **Una persona técnica** disponible unas 2 horas por semana.

## Precio (hipótesis por validar)

| Formato | Hipótesis | Para validar |
| --- | --- | --- |
| Piloto | Precio fijo bajo, por ejemplo entre 30 y 60 UF, o sin costo a cambio de un caso publicable. | ¿Paga algo? ¿Quién aprueba el gasto? |
| Auditoría completa | Entre 120 y 250 UF por flujo y versión. | ¿Lo compara con QA interno, consultoría o seguros? |
| Re-pruebas por versión | Suscripción mensual según el número de versiones y escenarios. | ¿Cada cuánto cambian su agente? |

Las cifras son puntos de partida para conversar, no un tarifario.

## Qué no incluye

- Certificación ni opinión regulatoria; Axiomic no es aliado ni certificador de la CMF.
- Dinero real ni conexión a cuentas productivas.
- El Gateway productivo. Se cotiza aparte si el piloto demuestra valor.
- Entrenamiento de pesos de modelos.

## Criterio de éxito del piloto (compuerta D)

**Se cumple si:**
1. El cliente reconoce al menos un caso como un riesgo real de su flujo.
2. Cambia algo (prompt, herramientas o controles) por el informe.
3. Pide repetir la prueba en la siguiente versión de su agente.
