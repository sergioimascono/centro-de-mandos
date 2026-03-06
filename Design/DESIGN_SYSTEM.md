# IMASCONO Design System

> Documento interno - Version Febrero 2026
> Basado en: Imascono_Manual_de_Marca_Brandbook_001.pdf

---

## 1. Identidad de Marca

### Valores

| # | Valor | Descripcion |
|---|-------|-------------|
| 1 | **Innovacion con proposito** | Exploramos constantemente con un objetivo claro: crear soluciones que aporten valor real a las marcas |
| 2 | **Creatividad estrategica** | Cada idea nace del analisis, la vision de marca y la busqueda de resultados medibles |
| 3 | **Experiencia centrada en las personas** | La tecnologia es el medio; las personas son el centro |
| 4 | **Metodologia y calidad** | Cuidamos cada detalle del proceso, desde la conceptualizacion hasta la implementacion |
| 5 | **Colaboracion y cercania** | Trabajamos como un equipo junto a nuestros clientes, entendiendo sus retos como propios |
| 6 | **Espiritu explorador** | Experimentamos, probamos y evolucionamos constantemente para mantenernos a la vanguardia |

### Tono de Comunicacion

- **Visionario y cercano**: Hablamos desde el conocimiento experto, pero con un lenguaje claro y accesible. No buscamos impresionar con tecnicismos, sino inspirar con ideas.
- **Inspirador y creativo**: Nuestra comunicacion transmite entusiasmo por la innovacion y pasion por crear experiencias que generan valor y emocionan.
- **Estrategico y seguro**: Cada mensaje refleja criterio, direccion y proposito. La marca proyecta confianza, liderazgo y claridad en la toma de decisiones.
- **Humano y colaborativo**: Aunque trabajamos con tecnologia avanzada, siempre ponemos a las personas en el centro. Somos empaticos, abiertos y dialogantes.

---

## 2. Logotipo

### Versiones

| Tipo | Descripcion | Uso |
|------|-------------|-----|
| **Principal** | Isotipo + "imascono" sobre fondo negro | Uso preferente |
| **Solo isotipo** | Simbolo sin texto | Para espacios reducidos o cuando la marca ya esta establecida |
| **Version color** | Con degradado de colores | EN DESUSO - evitar |

### Area de Seguridad

El area de seguridad se define usando la palabra "mas" como unidad de medida alrededor del logotipo. Mantener este espacio libre de otros elementos graficos.

### Tamanos Minimos

| Formato | Logotipo completo | Solo isotipo |
|---------|-------------------|--------------|
| **Digital** | 70px (72ppi) | 30px (72ppi) |
| **Impresion** | 20mm (300dpi) | 15mm (300dpi) |

### Usos Incorrectos

- NO usar degradados no contemplados
- NO rotar el logo
- NO usar sombreados
- NO modificar las proporciones
- NO usar bordes ni biseles
- NO usar logo en color sobre fotos/texturas

---

## 3. Colores Corporativos

### Paleta Principal

```css
:root {
  /* Principales */
  --color-black: #000000;      /* CMYK: 100/90/70/100 */
  --color-white: #FFFFFF;      /* CMYK: 0/0/0/0 */

  /* Grises */
  --color-gray-dark: #647483;  /* CMYK: 63/44/34/18 */
  --color-gray-medium: #CED4D8; /* CMYK: 23/13/14/0 */
  --color-gray-light: #EBF0F2; /* CMYK: 10/4/5/0 */
}
```

### Colores Secundarios (Acentos)

```css
:root {
  --color-accent-red: #F20505;
  --color-accent-pink: #F20544;
  --color-accent-magenta: #F20574;
  --color-accent-light-pink: #F9AAAA;
}
```

> **Nota**: Los colores secundarios se usan para generar acentos expresivos. Ajustar la proporcion de cada color para lograr combinaciones mas dinamicas.

### Colores de Submarcas

#### Imascono Health
```css
--health-primary: #45BAA3;  /* CMYK: 68/0/45/0 */
--health-secondary: #FFFFFF;
```

#### V·E·G·A
```css
--vega-blue: #0400FF;
--vega-purple: #3D174C;
--vega-white: #FFFFFF;
```

### Gradientes Permitidos

Los gradientes deben construirse usando combinaciones de:
- Grises (de claro a oscuro)
- Rojos/Rosas (entre los colores secundarios)
- Siempre manteniendo coherencia con la paleta corporativa

---

## 4. Tipografia

### Tipografia Corporativa: Visuelt PRO

| Peso | Uso recomendado |
|------|-----------------|
| **Light** | Textos largos, subtitulos |
| **Regular** | Cuerpo de texto, parrafos |
| **Medium** | Enfasis moderado |
| **Bold** | Titulos, destacados |
| **Black** | Headlines principales, impacto |

### Tipografia Alternativa Web: Inter

> Solo aplicable para determinados desarrollos de software que requieran una alternativa de Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet">
```

### Escala Tipografica (Perfect Fourth Scale - 1.333)

| Elemento | Tamano | Peso |
|----------|--------|------|
| H1 | 76px | Black |
| H2 | 56px | Black |
| H3 | 42px | Bold |
| H4 | 32px | Bold |
| H5 | 24px | Bold |
| H6 | 18px | Bold |
| Paragraph | 18px | Regular |
| Small | 14px | Regular |

```css
:root {
  --font-size-h1: 4.75rem;   /* 76px */
  --font-size-h2: 3.5rem;    /* 56px */
  --font-size-h3: 2.625rem;  /* 42px */
  --font-size-h4: 2rem;      /* 32px */
  --font-size-h5: 1.5rem;    /* 24px */
  --font-size-h6: 1.125rem;  /* 18px */
  --font-size-body: 1.125rem; /* 18px */
  --font-size-small: 0.875rem; /* 14px */
}
```

---

## 5. Iconografia

### Libreria: Phosphor Icons

**URL**: https://phosphoricons.com/

### Variaciones Aprobadas

- **Outline** (linea)
- **Filled** (relleno)

### Reglas de Uso

- Evitar el modo **Duotone**
- En modo Outline, el grosor de linea debe ser el minimo necesario que garantice la correcta legibilidad
- Mantener consistencia en el estilo elegido dentro de cada proyecto

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

---

## 6. Recursos Graficos y Estilos

### Redondeos (Border Radius)

> **Premisa: EVITAR redondeos**

```css
/* Por defecto */
border-radius: 0;

/* Solo si es necesario por usabilidad */
border-radius: 2px; /* Minimo apreciable */
```

### Sombreados

> **Premisa: Evitar sombreados muy marcados**

Solo usar para generar contraste sutil entre colores claros:

```css
/* Sombreado minimo permitido */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
```

---

## 7. Composicion y Reticulas

### Sistema de 12 Columnas

La estructura compositiva se basa en una **reticula de 12 columnas** que proporciona flexibilidad sin comprometer la coherencia visual.

### Combinaciones Permitidas

| Columnas | Uso |
|----------|-----|
| 12 | Full width |
| 6 + 6 | Dos columnas iguales |
| 4 + 4 + 4 | Tres columnas iguales |
| 3 + 3 + 3 + 3 | Cuatro columnas iguales |
| 8 + 4 | Contenido principal + sidebar |
| 3 + 9 | Navegacion + contenido |

---

## 8. Motion / Micro Animaciones

### Objetivo

Integrar un sistema de animacion **discreto, elegante y funcional**, aplicado de forma puntual.

### Casos de Uso

- Confirmar acciones
- Guiar la atencion
- Indicar estados o transiciones
- Aportar fluidez a la navegacion

### Principios

- Microanimaciones **sobrias y estrategicas**
- Se activan **solo cuando mejoran la experiencia**
- **No interferir** con la funcionalidad

### Duraciones Recomendadas

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

---

## 9. Estilo Fotografico

### Principios

1. **Orientacion a la tecnologia y el producto**
   - Recursos que destaquen los aspectos funcionales y experienciales de la tecnologia

2. **Composicion conceptual y experiencial**
   - Imagenes que representen experiencias inmersivas o escenarios creados digitalmente
   - Transmitir innovacion, interaccion y narrativa visual

3. **Mezcla de real y digital**
   - Integracion visual de recursos XR en planos reales

4. **Enfoque en personas y emociones**
   - Poner de relevancia lo que nuestra tecnologia genera en las personas y su entorno

---

## 10. Assets Disponibles

### Logos

| Archivo | Formato | Uso |
|---------|---------|-----|
| `Logo_2025_B&W_Imascono_RGB.png` | PNG | Digital, web |
| `Logo_2025_B&W_Imascono_RGB.ai` | AI | Edicion vectorial |
| `Logo_2025_B&W_Imascono_RGB.pdf` | PDF | Impresion |
| `Logo_2025_Color_Imascono_RGB_Raster.png` | PNG | Digital (EN DESUSO) |
| `Imascono_Logo_Blanco_Negativo 4.png` | PNG | Fondos oscuros |

### Tipografias

Ubicacion: `002_Tipografias Corporativas/Visuelt Pro/`

| Archivo | Peso |
|---------|------|
| VisueltPro-Light.ttf | 300 |
| VisueltPro-Regular.ttf | 400 |
| VisueltPro-Medium.ttf | 500 |
| VisueltPro-Bold.ttf | 700 |
| VisueltPro-Black.ttf | 900 |

*(Tambien disponibles versiones Italic)*

---

## 11. Implementacion CSS (Variables)

```css
:root {
  /* ===== COLORES ===== */
  /* Principales */
  --color-black: #000000;
  --color-white: #FFFFFF;

  /* Grises */
  --color-gray-dark: #647483;
  --color-gray-medium: #CED4D8;
  --color-gray-light: #EBF0F2;

  /* Acentos */
  --color-accent-red: #F20505;
  --color-accent-pink: #F20544;
  --color-accent-magenta: #F20574;
  --color-accent-light: #F9AAAA;

  /* ===== TIPOGRAFIA ===== */
  --font-family: 'Visuelt Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Escala Perfect Fourth (1.333) */
  --font-size-h1: 4.75rem;
  --font-size-h2: 3.5rem;
  --font-size-h3: 2.625rem;
  --font-size-h4: 2rem;
  --font-size-h5: 1.5rem;
  --font-size-h6: 1.125rem;
  --font-size-body: 1.125rem;
  --font-size-small: 0.875rem;

  /* ===== ESPACIADO ===== */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* ===== EFECTOS ===== */
  /* Sin border-radius por defecto */
  --radius-none: 0;
  --radius-minimal: 2px; /* Solo si es necesario */

  /* Sombras minimas */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);

  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

---

## 12. Checklist de Revision

Antes de publicar cualquier material, verificar:

- [ ] Logo usado correctamente (sin rotacion, sin distorsion)
- [ ] Colores dentro de la paleta corporativa
- [ ] Tipografia Visuelt Pro o Inter
- [ ] Escala tipografica respetada
- [ ] Iconos Phosphor (Outline o Filled, no Duotone)
- [ ] Sin border-radius (o minimo si es necesario)
- [ ] Sombras minimas o inexistentes
- [ ] Microanimaciones discretas y funcionales
- [ ] Reticula de 12 columnas aplicada

---

*Documento generado a partir del Manual de Marca Imascono - Febrero 2026*
*Para usos no contemplados, consultar con el equipo de Imagen Corporativa*
