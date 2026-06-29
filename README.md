<p align="center">
  <img src="frontend/muebleria-app/src/assets/logo/muebleria_igen.png" alt="Mueblería IGEN Logo" width="120">
</p>

<h1 align="center">🪑 Mueblería IGEN POS</h1>
<p align="center">
  <strong>Sistema de Punto de Venta y Gestión Empresarial para Mueblerías</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Producción%20(Activo)-blue" alt="Estado: Producción (Activo)">
  <img src="https://img.shields.io/badge/versión-1.0.0-blue" alt="Versión 1.0.0">
  <img src="https://img.shields.io/badge/Licencia-MIT-green" alt="Licencia MIT">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-Angular%20%7C%20Ionic%20%7C%20Node.js%20%7C%20Express%20%7C%20Prisma%20%7C%20PostgreSQL-333333" alt="Tech Stack">
  <img src="https://img.shields.io/badge/Type-ERP%20%26%20POS-5C2D91" alt="Tipo: ERP y POS">
</p>

---

## 📖 **Descripción General**

**Mueblería IGEN** es un sistema de gestión empresarial completo, diseñado específicamente para optimizar las operaciones de una mueblería. Desarrollado como proyecto académico, este software resuelve problemas cotidianos como la falta de control de inventario, la gestión manual de ventas, la ausencia de métricas en tiempo real y la dificultad para generar reportes profesionales.

El sistema ofrece una experiencia unificada: desde un **Punto de Venta (POS)** ágil e intuitivo hasta un potente **panel de control** con gráficos interactivos y alertas automatizadas, todo construido sobre una arquitectura moderna y escalable.

---

## ✨ **Funcionalidades Principales**

- **📊 Dashboard Ejecutivo**: Visualiza en tiempo real las métricas más importantes del negocio: ventas totales, productos más vendidos, stock crítico y evolución de ingresos con gráficos dinámicos.

- **🧾 Punto de Venta (POS)**: Interfaz rápida para registrar ventas, gestionar carrito de compras, seleccionar clientes (con creación rápida), y elegir entre múltiples métodos de pago (efectivo, tarjeta, transferencia). Genera comprobantes descargables en PDF con un diseño profesional.

- **🏷️ Gestión de Inventario**: Controla el stock con actualización automática tras cada venta. Administra productos con categorías, imágenes, precios y estados (activo/inactivo). Sistema de búsqueda y filtrado avanzado.

- **👥 Gestión de Usuarios y Roles**: Sistema de autenticación seguro con JWT y roles de `ADMIN` y `SELLER`, permitiendo control granular de accesos y permisos en todas las funcionalidades.

- **📊 Centro de Reportes y Análisis**: Genera reportes de ventas por períodos personalizados, visualiza gráficos de barras de evolución diaria, tabla de productos más vendidos y exporta a PDF profesional con todos los detalles.

- **📈 Panel Estadístico**: Muestra KPIs clave con gráficos de barras (evolución de ingresos) y gráficos circulares (distribución de ventas por producto). Actualización automática cada 30 segundos para datos en tiempo real.

- **🔄 Actualizaciones en Tiempo Real**: La información de inventario, ventas y reportes se actualiza automáticamente después de cada operación, reflejando cambios sin necesidad de recargar la página.

- **📜 Historial de Ventas**: Consulta el historial completo de ventas con diseño moderno en modal, mostrando código, cliente, total y fecha.

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**

- **Angular 18** con **Ionic 8**: Para una aplicación web/móvil híbrida de alto rendimiento y experiencia nativa.
- **Chart.js**: Para visualización de datos y gráficos analíticos interactivos.
- **SCSS**: Estilos avanzados con diseño responsivo y temas personalizados.
- **JSPDF + AutoTable**: Para generación de reportes y comprobantes en PDF profesionales.

### **Backend**

- **Node.js** con **Express**: API REST robusta, escalable y bien estructurada.
- **Prisma ORM**: Para una interacción segura y tipada con la base de datos.
- **PostgreSQL**: Base de datos relacional confiable y potente.
- **JWT (JSON Web Tokens)**: Para autenticación segura y manejo de sesiones.
- **Zod**: Validación de datos y esquemas en el backend.
- **Bcryptjs**: Hash de contraseñas para máxima seguridad.

### **Funcionalidades Extra**

- **Manejo de Stock Automático**: El stock se actualiza en tiempo real al registrar ventas.
- **Generación de PDFs**: Facturas de venta y reportes personalizados.
- **Diseño Responsive**: Adaptado perfectamente a móviles, tablets y escritorio.
- **Sistema de Categorías**: Organización de productos por categorías.

---

## 🚀 **Instalación y Configuración**

Sigue estos pasos para levantar el proyecto en tu entorno local.

### **Prerrequisitos**

- Node.js (versión 18+)
- npm o yarn
- PostgreSQL (versión 14+)

### **1. Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/muebleria-igen.git
cd muebleria-igen
```

### **2. Instalar Dependencias e Inicializar la Base de Datos**

```bash
# Instalar dependencias del backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init

# Instalar dependencias del frontend
cd ../frontend/muebleria-app
npm install
```

## **3.Configurar la Base de Datos**

Crea una base de datos PostgreSQL llamada muebleria_igen_db.
El archivo en backend example.env debe ser cambio según tus propios datos puedes tener en cuenta en crear otro como: .env y conservar ambos.
Edita el archivo .env con tus credenciales de base de datos:

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/muebleria_igen_db?schema=public"

# JWT
JWT_SECRET="muebleria_igen"
JWT_EXPIRES_IN="8h"

# Servidor
PORT=3000
NODE_ENV="development"

# SMTP (correo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=correo
SMTP_PASS=clave de verificacion de 2 pasos
SMTP_FROM=correo

# URL del frontend
FRONTEND_URL=http://localhost:4200
```

## **4.Iniciar la Aplicación**

```bash
# Iniciar el backend:
cd backend
npm run dev
```

```bash
# Iniciar el frontend:
cd frontend/muebleria-app
ng serve
# o con Ionic:
ionic serve
```

La aplicación estará disponible en http://localhost:4200 y el backend en http://localhost:3000.

## **🏗️ Arquitectura del Proyecto**

El sistema está construido bajo una Screaming Architecture y Clean Architecture Simplificada, separando el código en capas bien definidas para garantizar mantenibilidad y escalabilidad. Mientras que Clean Architecture provee las reglas técnicas de desacoplamiento y dirección de dependencias, Screaming Architecture define cómo debe organizarse visualmente el proyecto para que la estructura de carpetas refleje el negocio (las intenciones del sistema) y no las herramientas técnicas.

## **Estructura del Backend**

```bash
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticación y registro
│   │   ├── clientes/      # Gestión de clientes
│   │   ├── dashboard/     # Métricas del dashboard
│   │   ├── inventario/    # Control de stock
│   │   ├── productos/     # CRUD de productos y categorías
│   │   ├── reportes/      # Reportes y análisis
│   │   ├── usuarios/      # Gestión de usuarios y roles
│   │   └── ventas/        # Punto de venta y transacciones
│   ├── shared/            # Utilidades, middlewares, errores
│   └── config/            # Configuración de base de datos
└── prisma/                # Esquema de base de datos y migraciones
```

## **Estructura del Frontend**

```bash
frontend/muebleria-app/
├── src/
│   ├── app/
│   │   ├── core/          # Servicios, guards, interceptores
│   │   ├── modules/       # Módulos funcionales
│   │   │   ├── clients/   # Gestión de clientes
│   │   │   ├── dashboard/ # Dashboard ejecutivo
│   │   │   ├── inventory/ # Gestión de inventario
│   │   │   ├── reports/   # Reportes y gráficos
│   │   │   ├── sales/     # Punto de venta
│   │   │   └── statistics/# Panel estadístico
│   │   └── shell/         # Layout principal (sidebar, header)
│   └── environments/      # Configuración de entorno
└── angular.json
```

## **🤝 Contribuciones**

¡Gracias por tu interés en este proyecto!

Si encuentras un error, tienes una sugerencia o deseas proponer una mejora, puedes:

- Abrir un Issue describiendo el problema o la idea.

- Hacer un Fork del repositorio y enviar un Pull Request con tus cambios.

Todas las contribuciones serán revisadas antes de ser integradas al proyecto.

Si este proyecto te resultó útil o te sirvió como referencia, considera darle una ⭐ al repositorio. ¡Gracias por tu apoyo!

## **👨‍💻 Desarrollador**

<p align="center"> <br> <img src="frontend/muebleria-app/src/assets/icon/wangling.jpg" alt="Foto de perfil" width="120" style="border-radius: 50%;"> <br> <strong>WangLing</strong> <br> <em>Desarrollador Full-Stack | Apasionado por la tecnología y las soluciones empresariales</em> </p><p align="center"> <a href="https://github.com/wangling941"> <img src="https://img.shields.io/badge/GitHub-wangling941-181717?style=for-the-badge&logo=github" alt="GitHub"> </a> &nbsp; <a href="mailto:kevinvillegas.dev@gmail.com"> <img src="https://img.shields.io/badge/Email-Contacto-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"> </a> &nbsp; <a href="https://www.linkedin.com/in/kevin-villegas-solis-7b0038366/"> <img src="https://img.shields.io/badge/LinkedIn-Kevin%20Villegas%20Solis-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"> </a> </p><p align="center"> Hecho con ❤️ para Mueblería IGEN. </p>
