# Centro de Mando - Skill de Integración

Gestiona tarjetas del Centro de Mando Kanban desde Claude Code.

## Configuración

El skill busca configuración en `.claude/centro-de-mando.json`:

```json
{
  "enabled": true,
  "server": "http://localhost:9500",
  "project": "nombre-proyecto",
  "auto_move": true,
  "auto_analyze": true
}
```

## Comandos

### /task
Lista tarjetas del backlog y permite seleccionar una para trabajar.

**Comportamiento:**
1. Si no hay config, ejecuta configuración interactiva
2. Muestra tarjetas en backlog ordenadas por prioridad
3. Al seleccionar, mueve a `in-progress`
4. Si `auto_analyze: true`, genera `ai_description` y `acceptance_criteria`

**Ejemplo:**
```
> /task

📋 Backlog de factoria-de-ventas (5 tarjetas)

1. [HIGH] Implementar OAuth - "Añadir login con Google"
2. [HIGH] Validar emails - "Verificar formato de email"
3. [MEDIUM] Refactor API - "Limpiar endpoints legacy"

¿Cuál quieres tomar? (1-3 o 'q' para salir): _
```

### /task new <título>
Crea una nueva tarjeta en backlog.

**Comportamiento:**
1. Pide descripción breve
2. Genera `ai_description` expandiendo contexto del proyecto
3. Genera `acceptance_criteria` (3-5 criterios verificables)
4. Sugiere `priority` basada en análisis
5. Guarda en backlog

**API Call:**
```bash
curl -X POST $SERVER/api/projects/$PROJECT/cards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<título>",
    "description": "<descripción del usuario>",
    "priority": "<sugerida por IA>",
    "ai_description": "<generada>",
    "acceptance_criteria": ["<generados>"]
  }'
```

### /task new-and-start <título>
Crea tarjeta y la toma inmediatamente.

**Comportamiento:**
1. Ejecuta `/task new`
2. Mueve tarjeta a `in-progress`
3. Invoca `superpowers:brainstorming` si es tarea compleja

### /task done
Marca la tarea actual como completada.

**Comportamiento:**
1. Verifica que hay tarea en progreso
2. Mueve de `in-progress` → `review`
3. Actualiza campo `updated`

**API Call:**
```bash
curl -X PUT $SERVER/api/projects/$PROJECT/cards/$CARD_ID/move \
  -H "Content-Type: application/json" \
  -d '{"column": "review"}'
```

### /task verify
Verifica criterios de aceptación.

**Comportamiento:**
1. Lee `acceptance_criteria` de la tarjeta en `review`
2. Para cada criterio, verifica si se cumple
3. Si todos OK: mueve `review` → `done`
4. Si falla alguno: reporta cuáles faltan

### /task status
Muestra estado de la tarjeta actual.

**Output:**
```
📋 Tarea actual: Implementar OAuth
📍 Columna: in-progress
⏱️  Iniciada: hace 2 horas

Criterios de aceptación:
✅ Usuario puede hacer login con Google
⬜ Usuario puede hacer login con Microsoft
⬜ Tests e2e cubren ambos flujos
```

### /task link-plan <ruta>
Vincula un plan a la tarjeta actual.

**API Call:**
```bash
curl -X PATCH $SERVER/api/projects/$PROJECT/cards/$CARD_ID \
  -H "Content-Type: application/json" \
  -d '{"linked_plan": "<ruta>"}'
```

### /task config
Reconfigura el proyecto vinculado.

**Comportamiento:**
1. Consulta API para listar proyectos disponibles
2. Muestra selector interactivo
3. Guarda en `.claude/centro-de-mando.json`

## Configuración Interactiva (Primera Ejecución)

Si no existe `.claude/centro-de-mando.json`:

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

**API para listar proyectos:**
```bash
curl -s http://localhost:9500/api/projects | jq '.projects[].slug'
```

## Flujo de Trabajo Recomendado

```
1. /task              → Seleccionar tarjeta del backlog
                        → Se mueve a in-progress
                        → Se analizan criterios

2. Trabajar           → Implementar la funcionalidad
                        → Usar superpowers si es complejo

3. /task done         → Marcar completada
                        → Se mueve a review

4. /task verify       → Verificar criterios
                        → Si OK, se mueve a done
```

## Integración con Superpowers

- Al tomar tarjeta compleja: `superpowers:brainstorming`
- Antes de /task done: `superpowers:verification-before-completion`
- Si se crea plan: actualizar `linked_plan`

## Estado Interno

El skill mantiene estado de la tarjeta actual en memoria:
- `currentCard`: ID de la tarjeta en progreso
- `project`: Proyecto configurado
- `server`: URL del servidor

Este estado se pierde al cerrar la sesión. Al reiniciar, el skill
detecta tarjetas en `in-progress` y pregunta si continuar.
