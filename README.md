# 🛍️ Catálogo Web — E-commerce con Google Sheets como Backend

<div align="center">

**Una aplicación web de catálogo de productos con carrito de compras, checkout y panel administrativo, usando Google Sheets como base de datos en tiempo real.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-API-34A853?style=for-the-badge&logo=googlesheets)

</div>

---

## 📌 Índice

- [Filosofía del proyecto](#-filosofía-del-proyecto)
- [Características principales](#-características-principales)
- [Arquitectura del sistema](#-arquitectura-del-sistema)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Flujos de usuario](#-flujos-de-usuario)
- [Capa de datos — Google Sheets](#-capa-de-datos--google-sheets)
- [Patrones y decisiones técnicas](#-patrones-y-decisiones-técnicas)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Variables de entorno](#-variables-de-entorno)
- [Roadmap](#-roadmap)

---

## 💡 Filosofía del proyecto

### El problema

Muchos pequeños emprendedores y negocios locales necesitan una presencia web para mostrar y vender sus productos, pero enfrentan barreras comunes:

- **Costo elevado** de plataformas e-commerce tradicionales (Shopify, WooCommerce, etc.)
- **Complejidad técnica** para configurar y mantener una base de datos relacional
- **Dependencia de un desarrollador** para actualizar productos, precios o contenido

### La solución

**Catálogo Web** invierte el paradigma tradicional: en lugar de usar una base de datos convencional, utiliza **Google Sheets** como backend. Esto significa que:

- 📊 **El cliente gestiona sus productos desde una hoja de cálculo** que ya sabe usar
- 💰 **Cero costo de infraestructura de base de datos** — Google Sheets es gratuito
- ⚡ **Despliegue inmediato** — sin migraciones, sin esquemas SQL, sin servidores de BD
- 🔄 **Actualización en tiempo real** — cambiar un precio en la hoja se refleja al instante en la web
- 📱 **Confirmación de pedidos por WhatsApp** — el canal que los clientes ya usan

> **En resumen:** una solución e-commerce completa que un emprendedor puede gestionar enteramente desde Google Sheets y WhatsApp, sin necesitar conocimientos técnicos.

---

## ✨ Características principales

### 🛒 Tienda (Landing)
- **Catálogo de productos** con imágenes, precios y categorías
- **Búsqueda en tiempo real** por nombre, descripción y categoría
- **Filtro por categorías** con chips interactivos
- **Carrito de compras** con gestión completa (agregar, quitar, modificar cantidad)
- **Hero section** configurable con carrusel de imágenes auto-rotativo
- **Diseño responsivo** adaptado a móvil, tablet y desktop

### 💳 Checkout
- Formulario de datos del cliente (nombre, apellido, teléfono)
- Resumen visual del pedido con desglose de productos
- **Confirmación automática vía WhatsApp** con mensaje pre-formateado incluyendo todos los detalles del pedido

### 🔐 Panel de administración
- **Login por PIN de 6 dígitos** con inputs individuales y auto-focus
- **Gestión de pedidos** — tabla con estado, cliente, totales y detalle expandible
- **Configuración del sitio** — editar títulos, descripciones, imágenes del hero, color primario y número de WhatsApp desde un formulario
- Persistencia de sesión con `localStorage`

### 🎨 UI/UX
- Tema claro/oscuro con soporte nativo de Tailwind
- Animaciones de transición (hover, scale, fade-in)
- Glassmorphism en header y elementos flotantes
- Modal reutilizable con soporte para acciones CRUD
- Micro-interacciones (feedback visual al agregar al carrito, badge animado)

---

## 🏗️ Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Landing  │  │ Carrito  │  │ Checkout │  │ Admin Panel   │  │
│  │  Page     │  │  Modal   │  │  Page    │  │ (PIN Login)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │             │               │            │
│  ┌────┴──────────────┴─────────────┴───────────────┴────────┐  │
│  │              React Context Layer                          │  │
│  │   CartContext  •  ConfigContext  •  AuthContext            │  │
│  └──────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                    Next.js Server Actions
                         ("use server")
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    SERVICE LAYER                                 │
│                                                                  │
│  ProductosService • CartService • ConfigService • AuthService    │
│  CategoryService                                                 │
│                              │                                   │
│              ┌───────────────┴────────────────┐                  │
│              │  GoogleSheetServiceConnect      │                  │
│              │  (CRUD genérico reutilizable)   │                  │
│              └───────────────┬────────────────┘                  │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    Google Sheets API (JWT)
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                     GOOGLE SPREADSHEET                           │
│                                                                  │
│  📄 productos    │ 📄 categorias  │ 📄 carrito                   │
│  📄 carrito_detalle │ 📄 configuracion │ 📄 usuarios             │
└──────────────────────────────────────────────────────────────────┘
```

### Flujo de datos

1. **Server-side:** Los servicios se ejecutan como **Server Actions** de Next.js (`"use server"`), lo que significa que las credenciales de Google nunca se exponen al cliente
2. **Cliente:** Los componentes React consumen los datos a través de **Context Providers** que centralizan el estado global
3. **Google Sheets:** Actúa como base de datos con hojas separadas que simulan tablas relacionales

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.3 | Framework fullstack (SSR, Server Actions, App Router) |
| **React** | 19.2 | Biblioteca de UI con hooks y composición de componentes |
| **TypeScript** | 5.x | Tipado estático para seguridad y autocompletado |
| **TailwindCSS** | 4.x | Utility-first CSS para diseño responsivo y theming |
| **Flowbite React** | 0.12 | Componentes UI complementarios |
| **google-spreadsheet** | 5.3 | SDK para interactuar con Google Sheets API v4 |
| **google-auth-library** | 11.x | Autenticación JWT con Service Account |
| **SweetAlert2** | 11.x | Alertas y confirmaciones mejoradas |
| **react-imask** | 7.x | Máscaras de input para formato de datos |

---

## 📁 Estructura del proyecto

```
src/app/
├── components/
│   ├── landing/
│   │   ├── Header.tsx          # Header sticky con búsqueda y carrito
│   │   ├── HeroSection.tsx     # Banner hero con carrusel de imágenes
│   │   └── Footer.tsx          # Footer con branding y enlaces
│   ├── ui/
│   │   └── Modal.tsx           # Modal reutilizable con soporte CRUD
│   ├── CardCatalogo.tsx        # Tarjeta de producto con add-to-cart
│   ├── CartModalContent.tsx    # Contenido del modal de carrito
│   ├── LoginForm.tsx           # Login por PIN de 6 dígitos
│   └── PayPage.tsx             # Página de checkout y confirmación
│
├── context/
│   ├── AuthContext.tsx          # Estado de autenticación + localStorage
│   ├── CartContext.tsx          # Estado del carrito (items, totales)
│   ├── ConfigContext.tsx        # Configuración del sitio (colores, textos)
│   └── ProductosContext.tsx     # Estado de productos
│
├── services/
│   ├── GoogleSheetServiceConnect.ts  # 🔑 Capa de abstracción CRUD sobre Google Sheets
│   ├── ProductosServices.ts     # CRUD de productos
│   ├── CartService.ts           # Gestión de pedidos + WhatsApp
│   ├── CategoryService.ts       # Lectura de categorías
│   ├── ConfigService.ts         # Lectura/escritura de configuración
│   └── AuthService.ts           # Autenticación por PIN
│
├── types/
│   ├── productos.type.ts        # Tipado de productos
│   ├── cart.type.ts             # Tipado de carrito y items
│   ├── category.type.ts        # Tipado de categorías
│   ├── config.type.ts           # Tipado de configuración del sitio
│   └── auth.type.ts             # Tipado de autenticación
│
├── modulos/
│   ├── landing/
│   │   └── page.tsx             # Página principal del catálogo
│   └── administrador/
│       ├── page.tsx             # Panel admin con login y menú
│       ├── HomePedidos.tsx      # Dashboard y listado de pedidos
│       ├── HomeConfiguracion.tsx # Formulario de configuración del sitio
│       ├── menuOptions.ts       # Definición de opciones del menú admin
│       └── pedidos/
│           ├── TablaPedidos.tsx        # Tabla interactiva de pedidos
│           └── PedidoDetalleModal.tsx  # Modal de detalle de un pedido
│
├── helpers/                     # Utilidades (extensible)
├── layout.tsx                   # Layout raíz con metadata dinámica
├── page.tsx                     # Entry point → Landing
└── globals.css                  # Estilos globales + TailwindCSS
```

---

## 🔄 Flujos de usuario

### 1. Compra de productos (Cliente)

```mermaid
flowchart LR
    A[Explorar catálogo] --> B[Filtrar por categoría / buscar]
    B --> C[Agregar al carrito]
    C --> D[Revisar carrito]
    D --> E[Completar datos personales]
    E --> F[Enviar pedido]
    F --> G[Pedido guardado en Google Sheets]
    G --> H[Confirmar por WhatsApp]
```

### 2. Gestión administrativa

```mermaid
flowchart LR
    A[Acceder a /administrador] --> B[Ingresar PIN de 6 dígitos]
    B --> C{¿PIN válido?}
    C -->|Sí| D[Dashboard admin]
    C -->|No| E[Error - Reintentar]
    D --> F[Gestionar pedidos]
    D --> G[Configurar sitio]
    F --> H[Ver detalle / Cambiar estado]
    G --> I[Editar títulos, imágenes, color, WhatsApp]
```

---

## 📊 Capa de datos — Google Sheets

El archivo `GoogleSheetServiceConnect.ts` implementa una **capa de abstracción tipo ORM** sobre Google Sheets, exponiendo operaciones CRUD genéricas:

| Función | Equivalente SQL | Descripción |
|---|---|---|
| `gssc_get_all()` | `SELECT *` | Obtiene todos los registros de una hoja |
| `gssc_get_by_id()` | `SELECT * WHERE id = ?` | Busca un registro por ID |
| `gssc_get_like_column()` | `SELECT * WHERE col LIKE '%?%'` | Búsqueda parcial (case-insensitive) |
| `gssc_insert_record()` | `INSERT INTO` | Inserta un nuevo registro |
| `gssc_update_record()` | `UPDATE WHERE id = ?` | Actualiza un registro existente |
| `gssc_delete_record()` | `DELETE WHERE id = ?` | Elimina un registro por ID |

### Hojas del spreadsheet (tablas)

| Hoja | Propósito | Campos clave |
|---|---|---|
| `productos` | Inventario de productos | id, name, descripcion, price, category, stock, imageurl |
| `categorias` | Categorías de productos | id, name |
| `carrito` | Pedidos (cabecera) | id, client_id, guest_client_fname/lname/phone, subtotal, total, status |
| `carrito_detalle` | Items de cada pedido | id, product_id, cantidad, carrito_id |
| `configuracion` | Configuración del sitio (key-value) | site_title, hero_title, primary_color, whatsapp_number, etc. |
| `usuarios` | Credenciales admin | pin |

---

## 🧩 Patrones y decisiones técnicas

### ¿Por qué Google Sheets como base de datos?

| Ventaja | Detalle |
|---|---|
| **Familiar para el cliente** | Cualquier persona puede editar una hoja de cálculo |
| **Costo cero** | Sin servidores de BD, sin costos mensuales |
| **API robusta** | Google Sheets API v4 soporta lectura/escritura programática |
| **Escalable para PYMES** | Suficiente para catálogos de hasta ~10,000 productos |

### Server Actions (`"use server"`)
Todos los servicios se ejecutan como **Server Actions de Next.js**, lo que garantiza que:
- Las credenciales de Google (Service Account key) **nunca se envían al navegador**
- Las llamadas a la API se realizan desde el servidor, no desde el cliente
- Se mantiene el modelo mental de "funciones de backend" sin necesidad de un API REST separado

### Context API para estado global
Se eligió **React Context** sobre soluciones como Redux o Zustand por:
- Simplicidad acorde al tamaño del proyecto
- Integración nativa con React 19
- Separación clara de responsabilidades: `CartContext`, `ConfigContext`, `AuthContext`

### Componentes reutilizables
- **Modal genérico** con soporte para título, subtítulo, y botones de acción CRUD opcionales
- **Tarjetas de producto** con feedback visual inmediato (animación de "¡Agregado!")
- **HeroSection** configurable con carrusel automático y gradientes personalizables

### Integración con WhatsApp
Los pedidos generan automáticamente un **link `wa.me`** pre-formateado con:
- Datos del cliente
- Lista detallada de productos
- Total a pagar

Esto elimina la fricción del proceso de confirmación y aprovecha el canal que los clientes ya usan.

---

## 🚀 Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- Una cuenta de Google con acceso a Google Cloud Console
- Service Account con permisos de Google Sheets API

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/catalogo-app.git
cd catalogo-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Google

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🔐 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id
```

> ⚠️ **Importante:** Nunca subas credenciales al repositorio. Asegúrate de que `.env.local` esté incluido en `.gitignore`.

---

## 🗺️ Roadmap

- [ ] Migrar credenciales a variables de entorno
- [ ] Paginación del catálogo para grandes volúmenes
- [ ] Sistema de búsqueda avanzada con filtros múltiples
- [ ] Notificaciones push al admin cuando llega un nuevo pedido
- [ ] Integración con pasarelas de pago (Stripe / PayPal)
- [ ] Dashboard de analíticas (productos más vendidos, ingresos por período)
- [ ] Soporte multi-idioma (i18n)
- [ ] PWA (Progressive Web App) para uso offline

---

## 👨‍💻 Desarrollado por

**Devjuand** — con 💙 y mucho café.

---

<div align="center">

*Este proyecto demuestra la capacidad de construir soluciones completas y funcionales usando herramientas no convencionales, priorizando la experiencia del usuario final (tanto el comprador como el administrador del negocio).*

</div>
