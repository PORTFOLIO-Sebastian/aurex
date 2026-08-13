# AUREX
### Inteligencia de mercado cripto en tiempo real — Documento de especificaciones

**Proyecto:** #8 del portafolio (anteriormente "CoinPulse")
**Autor:** —
**Estado:** Por iniciar
**Última actualización:** 2026-08-12

---

## 0. Nota de naming

Se renombró de **CoinPulse** a **AUREX**.

- **Origen**: de *aureus*, la moneda de oro romana — referencia a valor y solidez, no a una moneda específica (evita quedar atado visualmente solo a Bitcoin/oro digital).
- **Por qué funciona para el nicho**: el público de productos cripto responde mejor a nombres cortos, de una sola palabra, con sonido "fintech serio" (piensa en Kraken, Nexo, Kraken, Bitpanda) en vez de nombres compuestos genéricos tipo "Coin-algo" o "Crypto-algo", que el nicho ya asocia con proyectos amateur o scam-like.
- **Tagline**: *"Inteligencia de mercado cripto en tiempo real."*
- **Tono de marca**: serio, sobrio, confiable — cero emojis de cohetes/lunas, cero verde-rojo saturado tipo casino. La seriedad visual es en sí misma una señal de confiabilidad para este nicho.

---

## 1. Resumen ejecutivo

AUREX es un dashboard de seguimiento de criptomonedas que prioriza **claridad de datos financieros y confianza visual** por sobre la sobrecarga de información típica de estas apps. Mientras la mayoría de trackers cripto amontonan números y colores agresivos, AUREX aplica jerarquía tipográfica seria, un sistema de color contenido, y gráficos legibles — comunicando que quien lo construyó entiende tanto de datos financieros como de diseño de interfaces serias (banca, fintech, dashboards B2B).

Es la pieza del portafolio pensada para demostrar **visualización de datos con librerías de gráficos, manejo de datos que cambian en tiempo real con cuota limitada de API (cache inteligente), y sensibilidad de diseño en un dominio donde "elegante y confiable" es literalmente el producto**.

### 1.1 Objetivos del producto
- Demostrar dominio de visualización de datos (gráficos de línea/velas, sparklines, comparadores).
- Demostrar arquitectura de cache consciente de cuota (CoinGecko Demo plan: ~10,000 llamadas/mes compartidas entre todos los visitantes si no se cachea bien).
- Comunicar "confianza" a través de decisiones de diseño explícitas, no solo de código.
- Deploy en Vercel con manejo correcto de API key como secreto (nunca expuesta en el cliente).

### 1.2 Fuera de alcance (v1)
- Trading real o conexión a wallets/exchanges.
- Alertas push o por correo.
- Datos on-chain (transacciones, gas fees) — solo mercado/precios.
- Cuentas de usuario — el "watchlist" es local, no sincronizado entre dispositivos.

---

## 2. Especificaciones de producto

### 2.1 Usuario objetivo
Reclutadores técnicos y devs revisando el portafolio, con un ángulo adicional: esta es la pieza que mejor resuena si el revisor tiene perfil fintech/data — por eso el estándar visual y de precisión de datos debe ser el más alto de las 12 propuestas.

### 2.2 Historias de usuario (MVP)

| # | Como... | Quiero... | Para... |
|---|---------|-----------|---------|
| HU-1 | visitante | ver un ranking de las principales criptomonedas por capitalización | tener una vista general del mercado |
| HU-2 | visitante | buscar una moneda específica por nombre o símbolo | encontrar rápido lo que me interesa |
| HU-3 | visitante | ver el detalle de una moneda con gráfico histórico (24h/7d/30d/1a) | entender su tendencia |
| HU-4 | visitante | comparar 2–3 monedas en un mismo gráfico | contrastar desempeño relativo |
| HU-5 | visitante | armar una watchlist personal guardada localmente | seguir solo lo que me importa |
| HU-6 | visitante | ver claramente si el mercado está en cache (no en vivo al segundo) | no asumir datos más frescos de lo que son |
| HU-7 | visitante con lector de pantalla | acceder a los datos del gráfico en formato tabla | no depender solo de la representación visual |
| HU-8 | visitante | ver estados de carga/error diseñados, nunca una tabla vacía sin explicación | confiar en que la app funciona bien |

### 2.3 Features MVP (v1)
1. Tabla de top 50–100 monedas: rango, nombre, símbolo, precio, variación 24h, capitalización, sparkline de 7 días.
2. Buscador con autocompletado (nombre/símbolo/ticker).
3. Vista de detalle por moneda: precio actual, variación 24h/7d, market cap, volumen, supply circulante, gráfico histórico interactivo con selector de rango.
4. Comparador: overlay de 2–3 monedas normalizado en % de cambio (no precio absoluto, para que sean comparables aunque tengan órdenes de magnitud distintos).
5. Watchlist local (agregar/quitar con un click, persistida en localStorage).
6. Indicador de "última actualización hace Xm" visible siempre — refuerza transparencia y confianza.
7. Estados: loading (skeleton de tabla y gráfico), error (con retry), vacío (watchlist sin monedas aún).
8. Tabla de datos accesible como alternativa a cada gráfico (`sr-only` pero navegable, no oculta a lectores de pantalla).

### 2.4 Features "nice to have" (v1.1+)
- Conversión a moneda local (PEN, USD, EUR) usando el mismo endpoint de CoinGecko.
- Modo "solo watchlist" como vista de inicio alternativa.
- Indicador de dominancia de BTC/ETH sobre el mercado total.
- Exportar comparador como imagen (`<canvas>`) para compartir.

---

## 3. Especificaciones técnicas

### 3.1 Stack
| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Framework | Next.js 14 (App Router) | necesita rutas serverless para esconder la API key — ningún otro proyecto del portafolio lo requiere, buena variedad técnica |
| Lenguaje | TypeScript | tipado estricto de respuestas financieras (evitar bugs de redondeo/undefined en precios) |
| Estilos | Tailwind CSS | consistencia de tokens con el resto del portafolio |
| Gráficos | Recharts (o D3 si se quiere mostrar más control fino) | line charts, sparklines, overlay de comparación |
| Estado remoto | TanStack Query | cache, `staleTime`/`refetchInterval` controlados, estados loading/error listos |
| Hosting | Vercel | Route Handlers de Next.js corren como funciones serverless nativamente |

> Nota de diseño técnico: **todo el precio "en vivo" en realidad es near-real-time con cache de 60–120s** — se comunica explícitamente en la UI (HU-6) en vez de fingir tiempo real, lo cual además es honesto y evita quemar la cuota de la API. Este es el argumento central de arquitectura del proyecto y debe explicarse en el README.

### 3.2 API y datos

**Proveedor:** CoinGecko API — plan **Demo** gratuito (requiere registro sin tarjeta de crédito, ~10,000 llamadas/mes, header `x-cg-demo-api-key`).

Endpoints principales:

```
# Listado de monedas con datos de mercado + sparkline 7d
GET https://api.coingecko.com/api/v3/coins/markets
  ?vs_currency=usd
  &order=market_cap_desc
  &per_page=100
  &page=1
  &sparkline=true
  &price_change_percentage=24h,7d

# Detalle histórico de una moneda
GET https://api.coingecko.com/api/v3/coins/{id}/market_chart
  ?vs_currency=usd
  &days={1|7|30|365}

# Búsqueda
GET https://api.coingecko.com/api/v3/search?query={q}
```

**Decisión de arquitectura clave — proxy serverless con cache compartido:**

La API key del plan Demo **no debe usarse directamente desde el navegador** (quedaría expuesta y cualquiera podría agotar la cuota). En vez de eso:

1. El cliente llama a rutas propias: `/api/coins`, `/api/coins/[id]/history`, `/api/search`.
2. Cada **Route Handler de Next.js** llama a CoinGecko con la key guardada en variable de entorno (`COINGECKO_API_KEY`, solo server-side).
3. La respuesta se cachea con `Cache-Control: s-maxage=90, stale-while-revalidate=60` — Vercel's Edge Network sirve la respuesta cacheada a **todos los visitantes** durante esos 90s, protegiendo la cuota de 10,000 llamadas/mes sin importar cuántas personas visiten el portafolio simultáneamente.
4. En el cliente, TanStack Query además cachea localmente con `staleTime: 60_000` para evitar refetches innecesarios en la misma sesión.

Este doble nivel de cache (Edge + cliente) es el punto técnico más fuerte del proyecto y el que más vale la pena destacar en una entrevista.

### 3.3 Arquitectura de carpetas (propuesta)

```
aurex/
├── app/
│   ├── api/
│   │   ├── coins/route.ts            # proxy a /coins/markets, con cache
│   │   ├── coins/[id]/history/route.ts
│   │   └── search/route.ts
│   ├── coin/[id]/page.tsx            # vista de detalle
│   ├── compare/page.tsx
│   ├── watchlist/page.tsx
│   └── page.tsx                      # tabla principal
├── components/
│   ├── CoinTable/
│   ├── Sparkline/
│   ├── PriceChart/                   # con tabla accesible alternativa
│   ├── CompareOverlay/
│   ├── SearchBar/
│   ├── WatchlistButton/
│   ├── LastUpdatedBadge/
│   ├── LoadingState/
│   └── ErrorState/
├── lib/
│   ├── coingeckoClient.ts            # solo se importa desde /app/api
│   └── formatters.ts                 # formato de moneda, %, abreviación de market cap
├── hooks/
│   ├── useWatchlist.ts
│   └── useCoins.ts                   # wrapper de TanStack Query sobre /api/coins
├── types/
│   └── coin.d.ts
└── README.md
```

### 3.4 Manejo de errores y edge cases
- Cuota de CoinGecko agotada (HTTP 429) → el Route Handler responde con el último dato cacheado disponible (aunque esté "stale") + header propio indicando degradación, y la UI muestra el badge de "última actualización" con una antigüedad mayor en vez de romperse.
- Moneda no encontrada en búsqueda → mensaje claro, sin resultados falsos.
- Fallo de red en el gráfico de detalle → estado de error local solo en esa sección (el resto de la página sigue funcionando), con retry.
- Números: nunca mostrar `NaN`, `undefined` o precios con más de 2–8 decimales según el orden de magnitud (formatear distinto un precio de $43,000 que uno de $0.00000234).
- Watchlist con IDs de monedas que ya no existen en la API (raro, pero posible) → se filtran silenciosamente al cargar, sin romper la lista.

### 3.5 Performance
- Lighthouse objetivo: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- Tabla de 100 filas: virtualización con `@tanstack/react-virtual` si el scroll se siente pesado en mobile.
- Sparklines: SVG livianos generados con Recharts en modo "mini" (sin ejes ni tooltips), no imágenes.
- `next/image` no aplica aquí (pocos assets gráficos) — el peso a vigilar es el bundle de la librería de gráficos: usar imports específicos de Recharts, no el paquete completo si no es necesario.

---

## 4. Especificaciones de diseño

### 4.1 Concepto visual
"Terminal financiera, no casino." Fondo oscuro sobrio (no negro puro, un carbón cálido), tipografía con jerarquía muy clara entre número principal y metadatos, y un uso **muy controlado** del rojo/verde: solo para variación de precio, nunca como color decorativo de fondo o botones. El dorado como acento de marca (coherente con "AUREX") reemplaza al típico azul genérico de dashboards.

### 4.2 Paleta

| Token | Hex | Uso |
|-------|-----|-----|
| `--aurex-bg` | `#12110F` | fondo base, carbón cálido (no negro puro) |
| `--aurex-surface` | `#1C1A17` | tarjetas, filas de tabla |
| `--aurex-surface-alt` | `#242119` | hover de fila, tarjetas elevadas |
| `--aurex-gold` | `#C9A24B` | acento de marca, elementos activos, bordes de foco |
| `--aurex-gold-soft` | `#E8D9AE` | texto sobre superficies doradas |
| `--aurex-positive` | `#3FAE72` | variación positiva (verde desaturado, no neón) |
| `--aurex-negative` | `#C1554B` | variación negativa (rojo desaturado, no neón) |
| `--aurex-text` | `#EDEAE3` | texto principal sobre fondo oscuro |
| `--aurex-text-muted` | `#9C978C` | metadatos, timestamps, texto secundario |

> Regla de accesibilidad: verde y rojo **siempre acompañados de signo (+/-) y flecha (▲/▼)**, nunca solo color — crítico en un producto financiero donde el daltonismo rojo-verde es particularmente común. Todas las combinaciones de esta tabla deben cumplir contraste AA (4.5:1) para texto normal y AA para componentes gráficos (3:1).

### 4.3 Tipografía
- Familia UI: **Inter**, consistente con el resto del portafolio.
- Familia numérica: Inter con `font-variant-numeric: tabular-nums` en toda cifra de precio/porcentaje — evita que las columnas "bailen" al actualizarse, un detalle que en fintech se nota inmediatamente si falta.
- Precio principal (vista detalle): peso 700, tamaño `clamp(2rem, 6vw, 3.5rem)`.
- Nombre de moneda + símbolo: peso 600, con el símbolo en `--aurex-text-muted` para no competir visualmente con el nombre.

### 4.4 Layout y breakpoints
- Mobile-first, probado en 320px, 375px, 768px, 1024px, 1440px.
- Mobile: tabla principal se convierte en lista de tarjetas (cada fila → card con sparkline a la derecha), no scroll horizontal de tabla.
- Desktop: tabla completa con columnas fijas de rango/nombre (sticky al hacer scroll vertical).
- Vista de detalle: gráfico a ancho completo arriba, métricas clave en grid de 2x3 debajo.
- Comparador: gráfico overlay arriba, leyenda con checkboxes por moneda debajo (permite ocultar/mostrar series individualmente).

### 4.5 Animación
- Actualización de precio: breve destello de fondo (`background-color` pulso de 400ms) en la celda que cambió, coloreado según sube/baja — sutil, nunca un parpadeo agresivo.
- Transición de tabla → detalle: `shared element transition` simple (el nombre/ícono de la moneda se mantiene en la misma posición aproximada al navegar), `duration: 300ms`.
- Sparklines: se dibujan una vez con un trazo animado corto al entrar en viewport (`duration: 600ms`, una sola vez, no loop).
- **`prefers-reduced-motion` respetado**: destello de precio se reduce a un cambio de color sin animación, transición de vista se vuelve fade puro.

### 4.6 Componentes clave — especificación de interacción

**CoinTable**
- Tabla semántica real (`<table>`, `<th scope="col">`, `<caption>` visualmente oculto pero presente describiendo el propósito de la tabla).
- Orden de columnas ajustable por click en encabezado, con `aria-sort` actualizado correctamente.
- Fila completa es un link accesible a la vista de detalle (`<a>` envolvente, no `onClick` en `<div>`).

**PriceChart**
- El gráfico visual tiene `aria-hidden="true"`; justo debajo (visualmente oculta con `sr-only` pero presente en el DOM) hay una tabla con los mismos datos (fecha, precio) para lectores de pantalla — cumple HU-7 de forma real, no simbólica.
- Selector de rango (24h/7d/30d/1a) como grupo de botones tipo tab (`role="tablist"`), no un `<select>` escondido.

**WatchlistButton**
- Ícono tipo estrella/bookmark con `aria-pressed` para comunicar estado on/off, además de cambio visual.
- Feedback inmediato (no requiere recargar ni esperar red, ya que es 100% local).

**LastUpdatedBadge**
- Texto vivo tipo "Actualizado hace 2 min", con `aria-live="off"` (no se anuncia cada cambio, solo está disponible si el usuario lo consulta) para no saturar a usuarios de lector de pantalla con actualizaciones constantes.

### 4.7 Accesibilidad (checklist obligatorio)
- [ ] Toda la navegación (tabla, detalle, comparador, watchlist) operable 100% con teclado.
- [ ] Cada gráfico tiene una tabla de datos alternativa accesible.
- [ ] Variación de precio nunca depende solo del color (signo + flecha siempre presentes).
- [ ] Contraste AA verificado en toda la paleta de la sección 4.2, incluyendo verde/rojo sobre `--aurex-bg` y `--aurex-surface`.
- [ ] `prefers-reduced-motion` respetado en destellos de precio y transiciones.
- [ ] Tabla principal con marcado semántico correcto (`th scope`, `caption`) y `aria-sort` funcional.
- [ ] Foco visible custom consistente con el resto del portafolio.

---

## 5. Modelo de datos (frontend)

```ts
interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  priceChangePct24h: number;
  priceChangePct7d: number;
  sparkline7d: number[];
  lastUpdated: string; // ISO
}

interface CoinHistoryPoint {
  timestamp: number; // epoch ms
  price: number;
}

interface CoinDetail extends CoinMarketData {
  circulatingSupply: number;
  totalSupply: number | null;
  totalVolume24h: number;
  ath: number;
  athDate: string;
}

interface WatchlistItem {
  coinId: string;
  addedAt: string; // ISO
}
```

---

## 6. Plan de desarrollo sugerido

| Fase | Contenido | Estimado |
|------|-----------|----------|
| 1 | Setup del proyecto (Next.js App Router + TS + Tailwind), Route Handlers proxy con cache | 0.75 día |
| 2 | Tabla principal (`CoinTable`) con datos reales, sparklines, orden por columna | 1 día |
| 3 | Buscador + `useWatchlist` con localStorage | 0.5 día |
| 4 | Vista de detalle con `PriceChart` + selector de rango + tabla accesible alternativa | 1 día |
| 5 | Comparador (`CompareOverlay`) normalizado en % de cambio | 0.75 día |
| 6 | Estados loading/error en todas las vistas, manejo de degradación por 429 | 0.5 día |
| 7 | Pase de accesibilidad completo (checklist sección 4.7) | 0.5 día |
| 8 | Responsive final + pulido visual (destellos de precio, transiciones) + Lighthouse audit | 0.5 día |
| 9 | README (explicando la arquitectura de doble cache) + deploy en Vercel + captura/GIF demo | 0.5 día |

**Total estimado:** ~6 días de trabajo enfocado.

---

## 7. Deploy

- Repositorio en GitHub, conectado a **Vercel** (deploy automático en cada push a `main`, preview en cada PR).
- Framework preset en Vercel: Next.js (autodetectado, Route Handlers funcionan como Serverless/Edge Functions sin configuración adicional).
- **Variable de entorno requerida**: `COINGECKO_API_KEY` — configurada en el dashboard de Vercel (Project Settings → Environment Variables), **nunca** en el repositorio ni con prefijo `NEXT_PUBLIC_` (eso la expondría al cliente).
- Cabeceras de cache: definidas directamente en cada Route Handler vía `Cache-Control`, aprovechando la Edge Network de Vercel como capa de cache compartida entre visitantes.
- Dominio: subdominio gratuito de Vercel o dominio propio si ya existe.

---

## 8. Criterios de "terminado" (Definition of Done)

- [ ] Las 8 historias de usuario del MVP funcionan sin errores en consola.
- [ ] Checklist de accesibilidad (sección 4.7) completo.
- [ ] Lighthouse ≥ 90 en Performance/Accessibility/Best Practices, medido en modo incógnito.
- [ ] Verificado manualmente que la API key **no** aparece en ningún request del cliente (inspeccionar Network tab).
- [ ] Comportamiento de degradación ante 429 probado (simulado, ya que agotar la cuota real no es práctico en desarrollo).
- [ ] Watchlist persiste correctamente tras recargar y cerrar/abrir el navegador.
- [ ] Probado en Chrome, Firefox y Safari (o al menos 2 motores: Blink y WebKit).
- [ ] README con: descripción, stack, decisión de arquitectura de cache de doble capa, capturas/GIF, link al deploy.
- [ ] Sin warnings de TypeScript ni de ESLint al hacer build.
