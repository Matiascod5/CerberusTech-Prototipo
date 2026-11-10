# Prototipo navegable Red Ñielol — Cerberus Tech

Versión web del prototipo de alta fidelidad diseñado en Figma (archivo «CERBERUSTECH - Prototipo Red Ñielol (avance Informe 3)», página «02 · Prototipo navegable»). Reúne 68 pantallas generadas desde Figma, para escritorio, tableta, teléfono y pantalla grande, y 8 pantallas del tótem de autoadmisión dibujadas directamente en HTML, organizadas por actor.

## Cómo abrirlo

- **En línea:** con GitHub Pages activo, el prototipo queda en `https://matiascod5.github.io/CerberusTech-Prototipo/`.
- **En el computador:** descargar el repositorio y abrir `index.html` en Chrome, Edge, Firefox o Safari. No requiere instalar nada ni conexión a internet; las tipografías van incluidas.

## Uso

- `index.html` presenta los seis actores: paciente, paciente (tótem de atención), personal de mesón y admisión, profesional de la salud, jefatura de agenda y contact center, y administración del sistema.
- «Ver su flujo» abre la página del actor (`actores/`), con sus recorridos y los pasos de cada uno en orden. «Comenzar» abre la primera pantalla.
- La barra superior de cada pantalla muestra el actor, el recorrido y el paso. El nombre del actor lleva de vuelta a su flujo.
- **Salir al inicio**, en el extremo derecho de la barra, cierra el recorrido y vuelve a la página inicial del prototipo.
- **Atrás** (o la tecla Retroceso) vuelve a la pantalla anterior. Las flechas de la derecha (o las teclas ← y →) pasan al paso anterior o siguiente del recorrido.
- Cada pantalla se ajusta al tamaño de la ventana. Botones, enlaces, menús y tarjetas llevan a la pantalla siguiente, igual que en Figma. Si una acción lleva a una pantalla de otro actor, la barra cambia a ese actor.
- Al hacer clic en una zona sin acción se resaltan las zonas clicables. «Zonas clicables» (tecla H) las deja resaltadas y «Ajustar» (tecla F) alterna entre ajustar a la ventana y tamaño real.
- Las ventanas de firma (M1) y de liberación de cupo (M2) se abren sobre la pantalla de origen; «Cancelar» o «Cerrar» las cierra.
- Los desplegables de período y profesional se abren con un clic. Los botones cambian de aspecto al pasar el cursor y al presionarlos.
- La pantalla de carga K0 avanza sola al tablero K1.

## Flujos por actor

Cada actor recorre solo sus propias pantallas. El personal de la Red ingresa por una variante del inicio de sesión con la pestaña «Personal de la Red» seleccionada (A1p y A2p), que lo lleva al inicio de su perfil; la opción «Tarjeta del box» se muestra solo al profesional de la salud. Los botones que en Figma conectaban con pantallas de otro actor se dirigieron a la pantalla equivalente del mismo actor o quedaron sin enlace. Las pestañas «Paciente» y «Personal de la Red» del inicio de sesión son la única forma de cambiar de actor desde una pantalla.

## Tótem de autoadmisión

Las pantallas TT0 a TT7 forman el flujo del actor «Paciente (tótem de atención)» y siguen el requerimiento RF-C2-10, el caso de uso 3.4.2.12, la regla RN-IDE-07 y los supuestos S-04, S-17 y S-59 del Subdocumento 3: confirmación de la llegada con la cédula, ingreso con RUN y huella para quien la registró en el mesón, derivación al mesón cuando no hay hora, hay copago o falla la lectura, y funcionamiento sin conexión solo con cédula. Los botones de letra grande, alto contraste y guía por voz funcionan en el navegador.

## Estilo visual

La versión web usa una paleta de cinco colores base, con tintes derivados de ellos: blanco, tinta (#1F1A2E), morado (#5B2A8C), ámbar (#D99A26) y rojo (#B3263E). Sobre el diseño de Figma agrega profundidad sobria: sombras leves en tarjetas y botones principales, degradados suaves en las áreas de color y en el fondo, y una barra de navegación clara. La distribución, los textos y las interacciones de cada pantalla se mantienen.

Como referencia de usabilidad se revisaron los sitios de Clínica Alemana, Clínica Las Condes, UC CHRISTUS, RedSalud, IntegraMédica y Red Dávila: fondo blanco con un color institucional fuerte para la acción principal, reserva de hora visible desde el inicio, accesos rápidos en tarjetas con íconos de línea y bordes redondeados con sombras suaves.

## Estructura

```
index.html              Selección de actor y listado de pantallas
actores/                Flujo de cada actor: recorridos y pasos
pantallas/              Una página HTML por pantalla
assets/css/             Estilos del visor e índice
assets/js/              Actores y recorridos, navegación, ventanas superpuestas y escalado
assets/svg/             Íconos y gráficos exportados desde Figma
assets/fonts/           Atkinson Hyperlegible Next y Literata
```

Cada pantalla se construyó con elementos HTML a partir de las capas de Figma (posición, colores, bordes, sombras y textos). Los textos son seleccionables. Los íconos y gráficos se exportaron como SVG.

## Activar GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guardar. El sitio queda publicado en uno o dos minutos.

## Tipografías

Atkinson Hyperlegible Next (Braille Institute of America) y Literata (TypeTogether para Google) se distribuyen con la [SIL Open Font License 1.1](https://openfontlicense.org).
