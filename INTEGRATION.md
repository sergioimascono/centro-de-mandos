# Integracion con Centro de Mando

## Configuracion

1. El Centro de Mando debe estar corriendo en `localhost:9500`
2. Tu proyecto debe tener una carpeta en `projects/{tu-proyecto-slug}/`

## Anadir a tu CLAUDE.md

Anade esta seccion a tu CLAUDE.md:

## Centro de Mando Integration

Este proyecto esta conectado al Centro de Mando en:
`C:\Users\Sergio - Imascono\Documents\Escritor de Memorias Tecnicas\Centro de Mando Desarrollo`

### Leer tareas actuales

Al inicio de sesion, consulta las tareas del proyecto:

```bash
curl -s http://localhost:9500/api/projects/{SLUG}/cards
```

### Actualizar estado de tarea

Cuando completes una tarea, muevela:

```bash
curl -s -X POST http://localhost:9500/api/projects/{SLUG}/cards/{ID}/move \
  -H "Content-Type: application/json" \
  -d '{"toColumn": "done"}'
```

## Crear nuevo proyecto

1. Crea la carpeta: `mkdir -p projects/{tu-slug}/{backlog,todo,in-progress,review,done}`
2. El proyecto aparecera automaticamente en el dashboard
