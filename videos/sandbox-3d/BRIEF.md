---
workflow: general-video
flow: companion
storyboard: yes
message: "Antes de tocar dinero real, tu agente opera dentro de un sandbox financiero sellado; ahí encontramos dónde falla."
destination: web
aspect: 1920x1080
language: es-CL
audience: "bancos, fintech y empresas con agentes de IA que mueven dinero (gerente de riesgo, líder de producto del agente, CTO)"
length: 18s
angle: concept
---

## Intent

Video 3D en bucle para la sección "Cómo funciona" del sitio de Axiomic. Concepto elegido: **la caja de cristal**. El sandbox es un cubo de vidrio flotando en la oscuridad con un mundo financiero en miniatura adentro (bloques grafito: banco, proveedores, facturas). El agente es la bola azul del logo de Axiomic recorriendo rieles de luz. Un pago termina en una cuenta que no existe: su riel se corta en el vacío. La cámara se aleja y revela cientos de cajas idénticas (escala de infraestructura: 430 episodios, 6 mundos). Debe ser "impresionante", con aura oscura, de élite y misteriosa ("tipo Linear de noche"), no para el público general sino para bancos y fintech.

## Assets

- ../../public/brand/axiomic-mark.png — logo (x de dos trazos grafito→azul + bola azul); la bola es el agente.
- ../../axiomic-paleta.md — paleta oficial (azul Axiomic #2563FF / #3d7bff en oscuro, grafito #0B1120).
- ../../src/components/AgentCard.tsx — tarjeta metálica esmeralda "Cuentas por pagar" (card-emerald) para la llave.

## Customizations

- La tarjeta esmeralda "Cuentas por pagar" entra flotando y se inserta en la caja como la llave que la activa (conecta con las tarjetas del hero).
- Escena 3D real (Three.js) con cámara orbitando y profundidad de campo.

## Notes

- Sin texto dentro del video (el sitio es bilingüe; títulos y etiquetas van en HTML).
- Sin audio (autoplay silenciado en la web).
- Bucle perfecto: el último cuadro empalma con el primero.
- Acción centrada para que en celular se pueda recortar al centro (vertical) sin perder el cubo.
- Paleta monocroma: casi negro #05070e / grafito #0b1120, blanco como énfasis, azul Axiomic solo en la bola del agente. Nunca morado ni rojo (el usuario los rechazó). Falla = blanco brillante.
- Cifras solo de src/lib/evidence.ts; nada de números inventados dentro del video.
- El video reemplaza el diagrama de flujo y las fichas de sandbox actuales de "Cómo funciona"; queda el título "Así probamos a tu agente." en HTML.
