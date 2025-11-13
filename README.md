# Inmobix Frontend

Plataforma web para compra, venta y alquiler de propiedades construida con Angular 19.

## 🚀 Tecnologías

- Angular 19.2.0
- TypeScript 5.7.2
- Tailwind CSS 4.1.13
- RxJS 7.8.0
- SweetAlert2

## 📁 Estructura

```
src/app/
├── components/
│   ├── auth/           # Login, registro, verificación
│   ├── dashboard/      # Panel admin y gestión
│   └── landing/        # Página pública
├── estructrales/       # Navbar, footer, hero
├── guards/            # Protección de rutas
├── models/            # Interfaces TypeScript
└── services/          # API y lógica de negocio
```

## ⚙️ Instalación

```bash
# Clonar
git clone https://github.com/Inmobix/inmobix-frontend.git
cd inmobix-frontend

# Instalar
npm install

# Ejecutar
npm start
```

Accede en `http://localhost:4200`

## 🔌 API Backend

**URL:** `https://inmobix-backend-production.up.railway.app/api`

### Endpoints principales
- `POST /register` - Registro
- `POST /login` - Autenticación
- `POST /user/verify` - Verificar email
- `GET /properties` - Listar propiedades
- `POST /properties` - Crear propiedad

## ✨ Funcionalidades

### Autenticación
- Registro con validación
- Login con JWT
- Verificación de email (código 6 dígitos)
- Recuperación de contraseña

### Propiedades
- CRUD completo
- Búsqueda por ciudad, tipo, precio
- Filtros avanzados (habitaciones, baños, área)
- Sistema de favoritos

### Dashboard
- Panel administrativo
- Gestión de propiedades
- Lista de usuarios (ADMIN)

## 📜 Historial de Cambios

| Fecha      | Ticket | Cambio                                              | Autor         |
|------------|--------|-----------------------------------------------------|---------------|
| 13/11/2025 | INF-31 | Ajustes críticos de producción                      | Andrés Gómez  |
| 13/11/2025 | INF-30 | Fix almacenamiento token verificación              | Andrés Gómez  |
| 13/11/2025 | INF-20 | Implementación manejo tokens JWT                    | Andrés Gómez  |
| 06/11/2025 | INF-24 | Mejora mensajes error con SweetAlert2               | Andrés Gómez  |
| 23/10/2025 | INF-18 | Integración API CRUD propiedades                    | Jordy Prada   |
| 16/10/2025 | INF-25 | Actualización Home completa                         | Jordy Prada   |
| 02/10/2025 | INF-24 | Sistema recuperación contraseña                     | Andrés Gómez  |
| 29/09/2025 | INF-19 | Creación ApiService                                 | Andrés Gómez  |
| 28/09/2025 | INF-17 | Dashboard con AuthGuard                             | Andrés Gómez  |
| 28/09/2025 | INF-15 | Formulario ForgotPassword                           | Andrés Gómez  |
| 28/09/2025 | INF-12 | Formulario Register con validaciones                | Andrés Gómez  |
| 28/09/2025 | INF-9  | Formulario Login reactivo                           | Andrés Gómez  |
| 28/09/2025 | INF-7  | Home con navbar funcional                           | Andrés Gómez  |
| 28/09/2025 | INF-23 | Estructura base de carpetas                         | Andrés Gómez  |
| 18/09/2025 | INF-6  | Integración Tailwind CSS 4                          | Jordy Prada   |
| 11/09/2025 | -      | Proyecto Angular 19 inicial                         | Andrés Gómez  |

## 👥 Equipo

- **Andrés Gómez** (@afgomezvufpso)
- **Jordy Prada** (@JordyPradaYanes)

## 📄 Licencia

Proyecto académico - Universidad Francisco de Paula Santander

---

**Backend:** [inmobix-backend](https://github.com/Inmobix/inmobix-backend)