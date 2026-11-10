# Prototipo navegable Red Ñielol — Cerberus Tech

Versión web del prototipo de alta fidelidad diseñado en Figma (archivo «CERBERUSTECH - Prototipo Red Ñielol (avance Informe 3)», página «02 · Prototipo navegable»). Reúne 66 pantallas para escritorio, tableta, teléfono y pantalla grande, enlazadas en los mismos 17 recorridos del modo presentación de Figma.

## Cómo abrirlo

- **En línea:** con GitHub Pages activo, el prototipo queda en `https://matiascod5.github.io/CerberusTech-Prototipo/`.
- **En el computador:** descargar el repositorio y abrir `index.html` en Chrome, Edge, Firefox o Safari. No requiere instalar nada ni conexión a internet; las tipografías van incluidas.

## Uso

- `index.html` lista los recorridos y todas las pantallas.
- Cada pantalla se ajusta al tamaño de la ventana. Botones, enlaces, menús y tarjetas llevan a la pantalla siguiente, igual que en Figma.
- Al hacer clic en una zona sin acción se resaltan las zonas clicables. «Zonas clicables» (tecla H) las deja resaltadas.
- «Ajustar» (tecla F) alterna entre ajustar a la ventana y tamaño real. Las teclas ← y → pasan a la pantalla anterior o siguiente.
- Las ventanas de firma (M1) y de liberación de cupo (M2) se abren sobre la pantalla de origen y «Cancelar» o «Cerrar» las cierra.
- Los desplegables de período y profesional se abren con un clic. Los botones cambian de aspecto al pasar el cursor y al presionarlos.
- La pantalla de carga K0 avanza sola al tablero K1.

## Estructura

```
index.html              Índice de recorridos y pantallas
pantallas/              Una página HTML por pantalla
assets/css/             Estilos del visor e índice
assets/js/              Navegación, ventanas superpuestas, desplegables y escalado
assets/svg/             Íconos y gráficos exportados desde Figma
assets/fonts/           Atkinson Hyperlegible Next y Literata
```

Cada pantalla se construyó con elementos HTML a partir de las capas de Figma (posición, colores, bordes, sombras y textos). Los textos son seleccionables. Los íconos y gráficos se exportaron como SVG.

## Activar GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guardar. El sitio queda publicado en uno o dos minutos.

## Tipografías

Atkinson Hyperlegible Next (Braille Institute of America) y Literata (TypeTogether para Google) se distribuyen con la [SIL Open Font License 1.1](https://openfontlicense.org).
