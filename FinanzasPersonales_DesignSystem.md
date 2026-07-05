# Design System – Finanzas Personales

Basado en las propuestas **6 (Light)** y **10 (Night)**.

## Principios
- Minimalista
- Alto contraste
- Espacios amplios
- Accesibilidad WCAG AA
- Una sola acción primaria

## Design Tokens

### Colores

```css
--color-primary:#1F6F5F;
--color-primary-hover:#18594C;
--color-bg:#F7F8FA;
--color-surface:#FFFFFF;
--color-text:#111827;
--color-text-secondary:#6B7280;
--color-border:#E5E7EB;
--color-success:#16A34A;
--color-error:#DC2626;

--dark-bg:#0F172A;
--dark-surface:#161F2F;
--dark-text:#F8FAFC;
--dark-text-secondary:#94A3B8;
--dark-border:#2B3648;
```

### Tipografía

- Font: **Inter**
- H1: 36/700
- H2: 28/700
- H3: 22/600
- Body: 16/400
- Small: 14/400
- Caption: 12/500

### Espaciado (8pt Grid)

| Token | Valor |
|---|---|
|xs|4px|
|sm|8px|
|md|16px|
|lg|24px|
|xl|32px|
|2xl|48px|
|3xl|64px|

### Radios

- Input: 12px
- Card: 24px
- Button: 14px
- Chip: 999px

### Sombras

```css
shadow-sm:0 2px 8px rgba(0,0,0,.06);
shadow-md:0 8px 24px rgba(0,0,0,.08);
shadow-lg:0 20px 60px rgba(0,0,0,.12);
```

## Componentes

### Login Card
- Width: 420px
- Padding: 40px
- Border: 1px
- Shadow MD

### Inputs
- Altura:56px
- Icono izquierda
- Mostrar contraseña
- Focus con borde Primary

### Botón Primario
- Alto:56px
- Radius:14px
- Full Width
- Hover: Primary Hover

### Estados
Default, Hover, Focus, Disabled, Error, Success.

## Layout

### Light
- Fondo #F7F8FA
- Tarjeta blanca
- Ilustración financiera sutil

### Night
- Fondo #0F172A
- Tarjeta #161F2F
- Ilustraciones lineales de baja opacidad

## Iconografía
- Lucide Icons
- Stroke 1.75

## Animaciones
- Duración:200ms
- Ease-out
- Elevación en hover

## Accesibilidad
- Contraste AA
- Focus visible
- Navegación teclado
- Labels siempre visibles

## Identidad
La marca comunica confianza, claridad, tranquilidad y control financiero. Evitar gradientes llamativos y efectos glassmorphism excesivos. Priorizar superficies limpias, colores neutros y un único color de acento verde petróleo.
