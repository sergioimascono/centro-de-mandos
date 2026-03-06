# Integración Centro de Mando con Claude Code

Permite gestionar tarjetas del Centro de Mando desde cualquier proyecto con Claude Code.

## Requisitos

- Centro de Mando corriendo en `http://localhost:9500`
- Claude Code con plugin superpowers instalado
- Proyecto creado en Centro de Mando

## Instalación Rápida (1 minuto)

### 1. Copiar el skill a tu proyecto

```bash
# Desde tu proyecto
mkdir -p .claude/skills

# Copiar skill (ajusta la ruta según tu sistema)
cp "C:\Users\...\Centro de Mando Desarrollo\.claude\skills\centro-de-mando.md" .claude/skills/
```

### 2. Usar el skill

```
> /task
```

La primera vez te pedirá configurar el proyecto:

```
🔧 Configuración Centro de Mando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Servidor: http://localhost:9500 ✓

Proyectos disponibles:
1. factoria-de-ventas
2. factoria-de-licitaciones
3. [Crear nuevo proyecto]

¿Con cuál trabajas? _
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `/task` | Ver y seleccionar tarjeta del backlog |
| `/task new <título>` | Crear nueva tarjeta con análisis IA |
| `/task new-and-start <título>` | Crear y empezar a trabajar |
| `/task done` | Marcar tarea completada → review |
| `/task verify` | Verificar criterios → done |
| `/task status` | Ver estado de tarjeta actual |
| `/task link-plan <ruta>` | Vincular plan a tarjeta |
| `/task config` | Cambiar proyecto vinculado |

## Flujo de Trabajo Recomendado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BACKLOG   │ ──► │ IN-PROGRESS │ ──► │   REVIEW    │ ──► │    DONE     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
   /task              trabajar            /task done         /task verify
   (seleccionar)      (implementar)       (completar)        (verificar)
```

## Campos IA en Tarjetas

Al crear o tomar una tarjeta, Claude genera automáticamente:

- **ai_description**: Descripción expandida con contexto técnico
- **acceptance_criteria**: Lista de criterios verificables (3-5)
- **linked_plan**: Referencia a plan de implementación (si existe)

## Ejemplo de Sesión

```
> /task

📋 Backlog de factoria-de-ventas (3 tarjetas)

1. [HIGH] Implementar OAuth
2. [MEDIUM] Validar emails
3. [LOW] Actualizar docs

¿Cuál quieres tomar? 1

✓ Tomando "Implementar OAuth"
✓ Moviendo a in-progress
✓ Generando análisis IA...

📋 Tarea: Implementar OAuth
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Descripción IA:
Esta tarea implica integrar OAuth 2.0 para autenticación
federada con Google y Microsoft...

Criterios de aceptación:
1. Usuario puede hacer login con Google
2. Usuario puede hacer login con Microsoft
3. Tokens se almacenan de forma segura
4. Tests e2e cubren ambos flujos

¿Comenzamos con brainstorming? (s/n)
```

## Configuración Manual

Si prefieres configurar manualmente, crea `.claude/centro-de-mando.json`:

```json
{
  "enabled": true,
  "server": "http://localhost:9500",
  "project": "tu-proyecto",
  "auto_move": true,
  "auto_analyze": true
}
```

## Troubleshooting

### El servidor no responde

```bash
# Verificar que está corriendo
curl http://localhost:9500/api/health

# Si no responde, iniciarlo
cd "C:\...\Centro de Mando Desarrollo"
node server/index.js
```

### El proyecto no aparece en la lista

```bash
# Crear proyecto manualmente
curl -X POST http://localhost:9500/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "mi-proyecto"}'
```

### Resetear configuración

```bash
# Eliminar config para reconfigurar
rm .claude/centro-de-mando.json
```

## API Reference

El skill usa estos endpoints:

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/projects` | Listar proyectos |
| GET | `/api/projects/:slug/cards` | Obtener tarjetas |
| GET | `/api/projects/:slug/cards?column=X` | Filtrar por columna |
| GET | `/api/projects/:slug/cards/next` | Siguiente sugerida |
| POST | `/api/projects/:slug/cards` | Crear tarjeta |
| PUT | `/api/projects/:slug/cards/:id/move` | Mover tarjeta |
| PATCH | `/api/projects/:slug/cards/:id` | Actualizar campos IA |
