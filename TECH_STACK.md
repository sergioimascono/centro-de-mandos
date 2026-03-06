# TECH_STACK.md - Locked Dependencies

## Core

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime del servidor |
| HTML5 | - | Estructura del frontend |
| CSS3 | - | Estilos (vanilla, sin frameworks) |
| JavaScript | ES2022 | Lógica del frontend (vanilla) |

## Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| Inter | Google Fonts | Tipografía (alternativa a Visuelt PRO) |
| Phosphor Icons | latest | Iconografía corporativa |

## Backend

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.18.x | Servidor HTTP |
| gray-matter | 4.0.x | Parsear frontmatter YAML de archivos MD |
| chokidar | 3.5.x | Watch de cambios en archivos |

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| File System | - | Persistencia basada en archivos MD |

## Testing

| Package | Version | Purpose |
|---------|---------|---------|
| - | - | Testing manual (proyecto interno simple) |

## DevOps

| Technology | Version | Purpose |
|------------|---------|---------|
| npm scripts | - | Start/dev scripts |

## Rules

- Do NOT add dependencies without updating this file
- Do NOT upgrade versions without testing
- Do NOT use deprecated packages
- Keep dependencies minimal (proyecto sencillo)
- Puerto fijo: 9500

## Forbidden

- React/Vue/Angular - Overkill para este proyecto
- Tailwind CSS - Usamos CSS vanilla con variables
- Bases de datos - Usamos sistema de archivos
- Bundlers (Webpack/Vite) - No necesarios para HTML/CSS/JS vanilla
