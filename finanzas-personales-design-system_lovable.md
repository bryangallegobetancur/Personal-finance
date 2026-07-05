# Finanzas Personales — Design System
**Dirección visual:** Glassmorphism Aurora
**Versión:** 1.0 · Junio 2026

Un sistema de identidad construido sobre superficies de cristal traslúcido, gradientes aurora y tipografía geométrica. Premium, contemporáneo y emocional — pensado para que hablar de dinero se sienta menos frío y más humano.

---

## 1. Principios de diseño

1. **Profundidad por luz, no por sombra.** Las superficies flotan gracias a blur y gradientes de fondo, no a drop-shadows duros.
2. **Cristal sobre color.** Los contenedores son traslúcidos (`bg-white/10`) sobre fondos oscuros saturados. El color vive detrás del contenido, no encima.
3. **Tipografía como ancla.** En un entorno difuso, el texto es el elemento más nítido. Alto contraste siempre.
4. **Movimiento sutil.** Las orbes aurora respiran (20–30s). Las interacciones usan transiciones cortas (150–200ms).
5. **Datos primero, decoración después.** Las cifras tienen jerarquía máxima; el cristal nunca compite con ellas.

---

## 2. Identidad de marca

### 2.1 Nombre y voz
- **Nombre:** Finanzas Personales
- **Tagline corto:** *Tu panorama financiero, claro.*
- **Tono:** cercano pero competente. Tutea. Evita jerga bancaria. Frases cortas.
- **Microcopy ejemplo:**
  - ✅ "Bienvenida de vuelta"
  - ✅ "Accede a tu panorama financiero"
  - ❌ "Autenticación de usuario requerida"

### 2.2 Logo
- Marca tipográfica sobre contenedor cuadrado redondeado (`rounded-xl`, 36×36 px).
- Glifo: ícono `Sparkles` blanco a 16 px, centrado.
- Contenedor: `bg-white/20` con `backdrop-blur`.
- Versión monocromática para fondos claros: contenedor `bg-night-900`, glifo blanco.

---

## 3. Design Tokens

### 3.1 Color — Paleta base

Todos los colores en formato `oklch` para gradientes perceptualmente uniformes.

| Token              | Light                       | Night                       | Uso                              |
| ------------------ | --------------------------- | --------------------------- | -------------------------------- |
| `--bg-canvas`      | `oklch(0.99 0.005 90)`      | `oklch(0.15 0.02 270)`      | Fondo de página                  |
| `--bg-surface`     | `oklch(1 0 0)`              | `oklch(0.20 0.025 270)`     | Cards opacas                     |
| `--bg-glass`       | `oklch(1 0 0 / 0.65)`       | `oklch(1 0 0 / 0.10)`       | Superficies de cristal           |
| `--border-glass`   | `oklch(0 0 0 / 0.08)`       | `oklch(1 0 0 / 0.20)`       | Bordes de cristal                |
| `--text-primary`   | `oklch(0.20 0.02 270)`      | `oklch(0.98 0 0)`           | Texto principal                  |
| `--text-secondary` | `oklch(0.45 0.02 270)`      | `oklch(0.98 0 0 / 0.70)`    | Texto de apoyo                   |
| `--text-muted`     | `oklch(0.60 0.02 270)`      | `oklch(0.98 0 0 / 0.50)`    | Placeholders, hints              |

### 3.2 Color — Aurora (acentos)

Los tres acentos del gradiente. Usar solo como fondo difuso (blur ≥ 64px) o en gradientes de marca.

| Token            | Valor                       | Hex aprox. | Rol                          |
| ---------------- | --------------------------- | ---------- | ---------------------------- |
| `--aurora-fuchsia` | `oklch(0.70 0.25 340)`    | `#E879B8`  | Orbe superior izquierda      |
| `--aurora-indigo`  | `oklch(0.55 0.22 270)`    | `#6366F1`  | Orbe superior derecha        |
| `--aurora-cyan`    | `oklch(0.80 0.15 220)`    | `#5CD9F0`  | Orbe inferior centro         |

### 3.3 Color — Semánticos

| Token           | Valor                    | Uso                          |
| --------------- | ------------------------ | ---------------------------- |
| `--success`     | `oklch(0.72 0.18 155)`   | Ingresos, ahorros, +%        |
| `--warning`     | `oklch(0.78 0.15 75)`    | Alertas suaves, límites      |
| `--danger`      | `oklch(0.62 0.22 25)`    | Gastos excedidos, errores    |
| `--info`        | `oklch(0.70 0.12 240)`   | Notificaciones neutras       |

### 3.4 Gradientes

```css
--gradient-aurora: radial-gradient(at 20% 20%, var(--aurora-fuchsia) 0%, transparent 50%),
                   radial-gradient(at 80% 30%, var(--aurora-indigo) 0%, transparent 50%),
                   radial-gradient(at 50% 90%, var(--aurora-cyan) 0%, transparent 50%);

--gradient-cta: linear-gradient(135deg, oklch(1 0 0) 0%, oklch(0.95 0.01 270) 100%);
--gradient-text-hero: linear-gradient(180deg, oklch(1 0 0) 0%, oklch(1 0 0 / 0.7) 100%);
```

---

## 4. Tipografía

### 4.1 Familias

| Rol      | Familia            | Fallback                          | Notas                           |
| -------- | ------------------ | --------------------------------- | ------------------------------- |
| Display  | **Geist**          | `ui-sans-serif, system-ui`        | Encabezados, montos, hero       |
| Body     | **Inter**          | `ui-sans-serif, system-ui`        | Párrafos, UI, labels            |
| Mono     | **Geist Mono**     | `ui-monospace, SFMono-Regular`    | Códigos, IDs de transacción     |

Carga vía `<link>` en `__root.tsx` (nunca con `@import` remoto en CSS).

### 4.2 Escala tipográfica

| Token          | Tamaño / Line-height | Peso | Tracking   | Uso                  |
| -------------- | -------------------- | ---- | ---------- | -------------------- |
| `text-display` | 48 / 52 px           | 600  | -0.02em    | Hero, landing        |
| `text-h1`      | 32 / 38 px           | 600  | -0.015em   | Títulos de pantalla  |
| `text-h2`      | 24 / 30 px           | 600  | -0.01em    | Secciones            |
| `text-h3`      | 20 / 26 px           | 600  | -0.005em   | Subsecciones         |
| `text-body-lg` | 16 / 24 px           | 400  | 0          | Párrafos destacados  |
| `text-body`    | 14 / 20 px           | 400  | 0          | Texto base           |
| `text-sm`      | 13 / 18 px           | 400  | 0          | Labels, captions     |
| `text-xs`      | 11 / 16 px           | 500  | 0.04em UC  | Etiquetas, badges    |
| `text-mono`    | 13 / 18 px           | 500  | 0          | Datos tabulares      |

### 4.3 Reglas
- Montos siempre en Geist `font-variant-numeric: tabular-nums`.
- Etiquetas `text-xs` siempre en MAYÚSCULAS con tracking `0.04em`.
- Nunca usar peso 700+ en pantallas oscuras sobre cristal — satura.

---

## 5. Espaciado

Escala basada en múltiplos de 4 px.

| Token   | Valor  | Uso                                      |
| ------- | ------ | ---------------------------------------- |
| `s-0`   | 0      | reset                                    |
| `s-1`   | 4 px   | gaps internos en chips e íconos          |
| `s-2`   | 8 px   | gap entre label e input                  |
| `s-3`   | 12 px  | padding vertical de inputs               |
| `s-4`   | 16 px  | gap entre campos de formulario           |
| `s-5`   | 20 px  | gap entre secciones cortas               |
| `s-6`   | 24 px  | padding interior de cards                |
| `s-8`   | 32 px  | padding de cards principales             |
| `s-10`  | 40 px  | separación entre bloques                 |
| `s-12`  | 48 px  | márgenes de página en desktop            |
| `s-16`  | 64 px  | separadores entre secciones grandes      |
| `s-24`  | 96 px  | secciones de landing                     |

**Reglas:**
- Padding mínimo de card: `s-6` (24 px).
- Tap target mínimo: 44×44 px.
- Gap vertical entre inputs en formulario: `s-3` (12 px).

---

## 6. Radios y bordes

| Token        | Valor   | Uso                            |
| ------------ | ------- | ------------------------------ |
| `radius-xs`  | 6 px    | badges, chips                  |
| `radius-sm`  | 10 px   | inputs, botones secundarios    |
| `radius-md`  | 14 px   | botones primarios              |
| `radius-lg`  | 20 px   | cards de cristal               |
| `radius-xl`  | 28 px   | hero cards, modales            |
| `radius-full`| 9999 px | avatars, pills                 |

Borde de cristal: `1px solid var(--border-glass)`.

---

## 7. Elevación y blur

En lugar de sombras duras, este sistema usa **blur** como mecanismo principal de elevación.

| Token         | Definición                                     | Uso                    |
| ------------- | ---------------------------------------------- | ---------------------- |
| `blur-glass`  | `backdrop-filter: blur(24px) saturate(180%)`   | Cards de cristal       |
| `blur-aurora` | `filter: blur(64px)`                           | Orbes de fondo         |
| `shadow-soft` | `0 1px 2px oklch(0 0 0 / 0.04)`                | Inputs, botones        |
| `shadow-lift` | `0 10px 40px -10px oklch(0 0 0 / 0.30)`        | Modales sobre claro    |
| `shadow-glow` | `0 0 60px oklch(0.55 0.22 270 / 0.25)`         | CTA hover (opcional)   |

---

## 8. Componentes clave

### 8.1 Input glass
- Alto: 44 px (`py-2.5`)
- Padding horizontal: `s-3` (12 px)
- Fondo: `var(--bg-glass)`
- Borde: `1px solid var(--border-glass)`
- Radio: `radius-sm` (10 px)
- Ícono prefijo: 16 px, `var(--text-muted)`
- Focus: borde `oklch(1 0 0 / 0.40)`, sin outline.

### 8.2 Botón primario (light over dark)
- Fondo: `oklch(1 0 0)`
- Texto: `var(--text-primary)` (siempre `oklch(0.20 0.02 270)`)
- Alto: 44 px
- Radio: `radius-md` (14 px)
- Peso de texto: 600, tamaño `text-sm`
- Hover: opacidad 0.95
- Activo: scale `0.98`

### 8.3 Card de cristal
```
background: var(--bg-glass);
border: 1px solid var(--border-glass);
border-radius: var(--radius-xl);   /* 28px */
backdrop-filter: blur(24px) saturate(180%);
padding: var(--s-8);               /* 32px */
```

### 8.4 Orbe aurora
- Tamaño: 288 × 288 px (puede escalar)
- Forma: círculo perfecto
- Opacidad: 30–40%
- Blur: 64 px
- Posiciones canónicas:
  - Fuchsia: `top: -80px, left: -80px`
  - Indigo:  `top: 80px,  right: -80px`
  - Cyan:    `bottom: 0,  left: 33%`

---

## 9. Iconografía

- **Librería:** `lucide-react`
- **Tamaño base:** 16 px en UI, 20 px en headers, 24 px en estados vacíos.
- **Stroke:** 1.75 px (no usar el default de 2 sobre cristal — se ve grueso).
- **Color:** hereda de `currentColor`. Sobre cristal oscuro: `var(--text-secondary)`.

---

## 10. Motion

| Token              | Duración | Easing                          | Uso                     |
| ------------------ | -------- | ------------------------------- | ----------------------- |
| `motion-instant`   | 100 ms   | `cubic-bezier(0.4, 0, 0.2, 1)`  | Hover de íconos         |
| `motion-quick`     | 200 ms   | `cubic-bezier(0.4, 0, 0.2, 1)`  | Botones, inputs         |
| `motion-smooth`    | 400 ms   | `cubic-bezier(0.16, 1, 0.3, 1)` | Aparición de cards      |
| `motion-aurora`    | 24 s     | `ease-in-out infinite`          | Respiración de orbes    |

Respeta `prefers-reduced-motion: reduce` — desactiva animaciones de orbes y traslaciones, mantén solo cambios de opacidad ≤ 200 ms.

---

## 11. Modos Light y Night

Ambos modos comparten estructura, blur y aurora. La diferencia clave:

| Aspecto         | Light                              | Night                              |
| --------------- | ---------------------------------- | ---------------------------------- |
| Fondo canvas    | Crema casi blanco                  | Azul muy oscuro casi negro         |
| Cristal         | Blanco 65% opacidad                | Blanco 10% opacidad                |
| Texto principal | Casi negro                         | Blanco puro                        |
| Aurora opacidad | 18–25%                             | 30–40%                             |
| Botón primario  | Fondo oscuro, texto claro          | Fondo claro, texto oscuro          |

Cambio vía clase `.dark` en `<html>`. Persistir preferencia en `localStorage`. Detectar `prefers-color-scheme` por defecto.

---

## 12. Accesibilidad

- **Contraste mínimo:** WCAG AA (4.5:1 para texto base, 3:1 para texto grande).
- Sobre cristal: probar contraste contra el peor caso del fondo (zona más clara del aurora).
- Focus visible obligatorio: `outline: 2px solid oklch(1 0 0 / 0.6); outline-offset: 2px`.
- Inputs siempre con `<label>` asociado (no solo placeholder).
- Estados de error con ícono + color + texto, nunca solo color.

---

## 13. Snippet — Tokens en `src/styles.css`

```css
@theme inline {
  --color-canvas: var(--bg-canvas);
  --color-surface: var(--bg-surface);
  --color-glass: var(--bg-glass);
  --color-aurora-fuchsia: var(--aurora-fuchsia);
  --color-aurora-indigo: var(--aurora-indigo);
  --color-aurora-cyan: var(--aurora-cyan);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --radius-glass: 28px;
  --font-display: "Geist", ui-sans-serif, system-ui;
  --font-body: "Inter", ui-sans-serif, system-ui;
}

:root {
  --bg-canvas: oklch(0.99 0.005 90);
  --bg-surface: oklch(1 0 0);
  --bg-glass: oklch(1 0 0 / 0.65);
  --border-glass: oklch(0 0 0 / 0.08);
  --text-primary: oklch(0.20 0.02 270);
  --text-secondary: oklch(0.45 0.02 270);
  --text-muted: oklch(0.60 0.02 270);
  --aurora-fuchsia: oklch(0.70 0.25 340);
  --aurora-indigo: oklch(0.55 0.22 270);
  --aurora-cyan: oklch(0.80 0.15 220);
  --success: oklch(0.72 0.18 155);
  --warning: oklch(0.78 0.15 75);
  --danger: oklch(0.62 0.22 25);
  --info: oklch(0.70 0.12 240);
}

.dark {
  --bg-canvas: oklch(0.15 0.02 270);
  --bg-surface: oklch(0.20 0.025 270);
  --bg-glass: oklch(1 0 0 / 0.10);
  --border-glass: oklch(1 0 0 / 0.20);
  --text-primary: oklch(0.98 0 0);
  --text-secondary: oklch(0.98 0 0 / 0.70);
  --text-muted: oklch(0.98 0 0 / 0.50);
}
```

---

## 14. Checklist de implementación

- [ ] Cargar Geist e Inter desde `<link>` en `__root.tsx`.
- [ ] Tokens publicados en `src/styles.css` (light + dark).
- [ ] Componente `<AuroraBackground />` reutilizable con 3 orbes.
- [ ] Componente `<GlassCard />` con padding, blur y borde estándar.
- [ ] Variante `glass` en `<Button />` y `<Input />` de shadcn.
- [ ] Toggle de tema con persistencia y `prefers-color-scheme`.
- [ ] Test de contraste sobre los tres orbes del aurora.
- [ ] `prefers-reduced-motion` respetado en orbes y transiciones.

---

*Documento vivo. Cualquier cambio de token requiere bump de versión y nota en el changelog.*
