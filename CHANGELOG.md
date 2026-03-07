# Changelog - Centro de Mando

Todos los cambios importantes en el Centro de Mando se documentan aqui.

## [1.1.0] - 2026-03-07

### Added
- Validacion de workflow al mover tarjetas
  - Requiere `ai_description` y `acceptance_criteria` para mover a "En Progreso"
  - Requiere todos los criterios completados para mover a "Done"
- Criterios de aceptacion como objetos `{text, completed}`
- Modal de edicion muestra campos IA completos
- Indicador de progreso de criterios en tarjetas (ej: "3/5")

### Changed
- Vista de tarjetas simplificada (solo badge IA + contador)
- Los detalles de IA se muestran al editar, no en la tarjeta

### Breaking Changes
- `acceptance_criteria` ahora debe ser array de objetos:
  ```json
  [{"text": "Criterio", "completed": false}]
  ```
- El endpoint PUT `/move` ahora valida campos IA

### Para actualizar skills en otros proyectos
1. Copiar `.claude/skills/centro-de-mando.md` al proyecto
2. Asegurar que el skill rellena campos IA antes de mover a in-progress
3. Marcar criterios como completados antes de mover a done

---

## [1.0.0] - 2026-03-06

### Added
- Servidor Express con API REST
- Tablero Kanban con 5 columnas
- Campos IA opcionales: `ai_description`, `acceptance_criteria`, `linked_plan`
- Skill para integracion con Claude Code
- Archivar/restaurar proyectos

---

## Como notificar cambios a otros proyectos

Cuando hay cambios importantes (breaking changes):

1. Actualizar este CHANGELOG.md
2. Incrementar version en skill (`## Versionado`)
3. Los proyectos pueden consultar:
   ```bash
   curl http://localhost:9500/api/version
   ```

Si usas Claude Code, el skill deberia verificar compatibilidad al inicio.
