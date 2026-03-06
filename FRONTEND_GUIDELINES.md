# FRONTEND_GUIDELINES.md - Design System (Imascono)

## Colors

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| black | #000000 | Texto principal, fondos oscuros |
| white | #FFFFFF | Fondos claros, texto sobre negro |
| gray-dark | #647483 | Texto secundario, bordes |
| gray-medium | #CED4D8 | Bordes, separadores |
| gray-light | #EBF0F2 | Fondos de tarjetas, hover states |

### Accent Palette (Secundarios)

| Name | Hex | Usage |
|------|-----|-------|
| accent-red | #F20505 | Alertas, eliminar |
| accent-pink | #F20544 | Acentos hover |
| accent-magenta | #F20574 | Destacados, badges |
| accent-light | #F9AAAA | Estados suaves |

### Kanban Column Colors

| Column | Background | Border |
|--------|------------|--------|
| backlog | #EBF0F2 | #CED4D8 |
| todo | #EBF0F2 | #647483 |
| in-progress | #F9AAAA | #F20574 |
| review | #CED4D8 | #647483 |
| done | #000000 | #000000 |

## Typography

### Font Family

- Primary: Inter (Google Fonts - alternativa a Visuelt PRO)
- Monospace: JetBrains Mono (para código)

### Font Sizes (Perfect Fourth Scale 1.333)

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| h1 | 76px | 1.1 | Títulos principales (no usado en dashboard) |
| h2 | 56px | 1.2 | Título de página |
| h3 | 42px | 1.2 | Nombre de proyecto |
| h4 | 32px | 1.3 | Títulos de columna |
| h5 | 24px | 1.3 | Títulos de tarjeta |
| h6 | 18px | 1.4 | Subtítulos |
| body | 18px | 1.5 | Texto de tarjetas |
| small | 14px | 1.4 | Metadatos, fechas |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| light | 300 | Subtítulos |
| regular | 400 | Texto cuerpo |
| medium | 500 | Labels |
| bold | 700 | Títulos |
| black | 900 | Hero text |

## Spacing

Base unit: 4px

| Name | Value | CSS Variable |
|------|-------|--------------|
| xs | 4px | --space-xs |
| sm | 8px | --space-sm |
| md | 16px | --space-md |
| lg | 24px | --space-lg |
| xl | 32px | --space-xl |
| 2xl | 48px | --space-2xl |
| 3xl | 64px | --space-3xl |

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| none | 0 | Preferido (estilo Imascono) |
| minimal | 2px | Solo si necesario por usabilidad |
| sm | 4px | Inputs, botones (mínimo) |

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| subtle | 0 1px 3px rgba(0,0,0,0.05) | Tarjetas (muy sutil) |
| hover | 0 2px 8px rgba(0,0,0,0.08) | Hover en tarjetas |

## Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| mobile | 0 | Base styles |
| tablet | 768px | Ajustar grid |
| desktop | 1024px | Full Kanban view |
| wide | 1440px | Columnas más anchas |

## Component Patterns

### Buttons

- Primary: Fondo negro #000000, texto blanco
- Secondary: Borde negro, fondo transparente
- Destructive: Fondo #F20505, texto blanco
- Sin redondeos (o border-radius: 2px máximo)

### Cards (Tarjetas Kanban)

- Fondo: #FFFFFF
- Borde: 1px solid #CED4D8
- Sin redondeos (border-radius: 0 o 2px)
- Sombra: subtle
- Padding: 16px (--space-md)

### Forms

- Labels: arriba del input, font-weight: 500
- Inputs: borde #CED4D8, sin redondeos
- Focus: borde #000000
- Error: borde #F20505, mensaje debajo

### Columns (Kanban)

- Header: fondo según estado, texto bold
- Gap entre columnas: 16px
- Padding interno: 8px

## Iconography

- Library: Phosphor Icons
- Style: Outline (preferido) o Filled
- NO usar: Duotone
- Stroke weight: mínimo para legibilidad

## Rules

- Mobile-first approach
- Sin redondeos (estilo Imascono)
- Sombras muy sutiles o ninguna
- Grid de 12 columnas para layouts
- CSS custom properties para tokens
- NO usar frameworks CSS
