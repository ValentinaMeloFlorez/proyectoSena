# CONTAIA PRO — Guía de Diseño UX/UI

## Identidad Visual

| Elemento | Valor |
|----------|-------|
| Paleta principal | Azul corporativo (`brand-600: #2563eb`) |
| Fondo | Gris claro (`#f8fafc`) |
| Superficies | Blanco con bordes sutiles |
| Tipografía | Inter (Google Fonts) |
| Iconografía | Lucide React |

## Principios de Diseño

1. **Claridad contable** — La información financiera debe ser legible, jerárquica y sin ambigüedad.
2. **Consistencia modular** — Todos los módulos comparten layout, componentes y patrones de interacción.
3. **Feedback inmediato** — Estados de carga, error y éxito visibles en cada acción.
4. **Accesibilidad** — Contraste WCAG AA, labels en botones de icono, navegación por teclado.

## Layout Base (Módulo 1)

```
┌──────────────┬──────────────────────────────────────┐
│   Sidebar    │  Header (título + acciones usuario)  │
│   (240px)    ├──────────────────────────────────────┤
│              │                                      │
│  • Dashboard │         Contenido principal          │
│  • Módulos   │         (scroll independiente)       │
│    (pronto)  │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

## Componentes Base

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `MainLayout` | `components/layout/` | Shell de la aplicación |
| `Sidebar` | `components/layout/` | Navegación lateral |
| `Header` | `components/layout/` | Título de página y acciones |
| `Button` | `components/ui/` | Acciones primarias/secundarias |
| `.card` | `globals.css` | Contenedores de contenido |
| `.status-badge` | `globals.css` | Indicadores de estado |

## Estados del Sistema

| Estado | Color | Uso |
|--------|-------|-----|
| Healthy | Verde (`emerald`) | Sistema operativo |
| Degraded | Ámbar (`amber`) | BD desconectada, servicio parcial |
| Error | Rojo (`red`) | Fallo de conexión |

---

*Diseñador UX/UI — CONTAIA PRO*
