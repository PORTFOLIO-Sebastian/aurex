# AUREX - Inteligencia de Mercado Cripto 🚀

AUREX es un dashboard profesional de seguimiento e inteligencia de mercado para criptomonedas en tiempo real, diseñado con un fuerte enfoque técnico y analítico orientado al sector Fintech.

🔗 **[Visitar AUREX en Vivo](https://aurex-dusky-nine.vercel.app)**

---

## 🌟 Características Principales

- **Métricas Globales (Macro):** Información en tiempo real sobre la capitalización total del ecosistema, volumen de 24 horas y la métrica de dominancia de Bitcoin.
- **Índice de Miedo y Codicia (Fear & Greed):** Termómetro visual y dinámico del sentimiento general del mercado, alimentado en tiempo real.
- **Tabla de Mercado Avanzada:** Explora el ranking de criptomonedas, con columnas ordenables por métricas financieras. Incluye mini-gráficos (*Sparklines*) que muestran la tendencia directa de los últimos 7 días.
- **Comparador Relativo:** Selecciona hasta 3 criptomonedas y contrasta su rendimiento. AUREX normaliza automáticamente los precios a un % de cambio para poder comparar monedas de precios dispares desde un mismo punto de origen.
- **Terminal de Detalle (Velas Japonesas):** Vista detallada que permite alternar entre el clásico gráfico de Línea o un formato avanzado de Velas (OHLC) interactivo, el estándar para traders.
- **Favoritos (Watchlist):** Agrega y quita monedas con un click. El portafolio se guarda localmente para que puedas seguir únicamente los activos que te importan.
- **Diseño Premium y Responsive:** Estética oscura, elegante y completamente adaptable a pantallas móviles y de escritorio.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Gestión de Estado Asíncrono:** TanStack React Query
- **Gráficos y Visualización de Datos:** Recharts & Lightweight Charts (TradingView)
- **Iconografía:** Lucide React
- **Consumo de APIs:** CoinGecko API (con sistema de doble caché local) & Alternative.me API

---

## 🚀 Ejecución Local

Si deseas correr este proyecto en tu propia máquina, sigue estos pasos:

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

*(Nota: Este proyecto utiliza funciones de Edge Caching de Next.js, por lo que su rendimiento máximo se observa al ejecutar `npm run build` y luego `npm run start`).*

---

## 👤 Autor
Este producto es parte del portafolio de desarrollo de **Javier Sebastian**.
*This product is part of Javier Sebastian's portfolio.*
