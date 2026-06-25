# Control Plane — Etapa 3

## Deploy de producción

[https://etapa-3-control-plane-dev-squad.vercel.app/](https://etapa-3-control-plane-dev-squad.vercel.app/)

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin+clerk_test@iaw.com` | `iawuser#` |

## Instrucciones de uso

1. Ingresar al sitio y hacer clic en **Iniciar sesión**.
2. Iniciar sesión con el usuario administrador provisto (Clerk).
3. Navegar las secciones del panel izquierdo:
   - **Usuarios**: listar, buscar y suspender/activar compradores y vendedores.
   - **Órdenes**: visualizar y editar órdenes (estado, dirección, tracking, items).
   - **Productos**: buscar productos y activar/desactivar su visibilidad.
   - **Reseñas**: moderar reseñas de productos y vendedores (editar puntuación, texto, estado).
   - **Reportes**: revisar reportes de usuarios y resolverlos (desestimar o eliminar reseña). Usar el botón **Opinión IA** para obtener una sugerencia automática.
   - **Envíos**: consultar envíos, avanzar su estado y ver historial de tracking.
   - **Pagos/Transferencias**: visualizar transferencias filtradas por estado.
   - **Pagos/Disputas**: gestionar disputas de pagos (abierta/resuelta/perdida).

## Descripción del proyecto

Panel de administración centralizado para un marketplace de zapatillas. Actúa como un **plano de control** que unifica la gestión de cinco microservicios independientes (Compradores, Vendedores, Logística, Pagos y Feedback) en una sola interfaz.

La autenticación y el control de acceso se manejan con **Clerk**, restringiendo el panel exclusivamente a usuarios con rol `admin`. 

## Fortalezas de la App

- **UI completamente en español**: Fechas, moneda y etiquetas usan el locale `es-AR`.
- **Modo oscuro**: Soporte completo con detección de preferencia del sistema y persistencia manual.
- **Responsive**: El panel es funcional en escritorio y mobile. La sección de envíos tiene vistas separadas (tabla en desktop, tarjetas en mobile).
- **Opinión IA en reportes**: Al hacer clic en "Opinión IA" se consulta un endpoint externo que sugiere si mantener o eliminar la reseña reportada.
- **Optimistic UI**: Al suspender/activar usuarios, el cambio se refleja instantáneamente en la UI antes de confirmarse en el servidor.
- **Paginación mixta**: La mayoría de las secciones paganizan del lado del servidor; reseñas y reportes cambian a paginación del lado del cliente cuando se aplican filtros adicionales.
