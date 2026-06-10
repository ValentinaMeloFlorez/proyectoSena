# Módulo 4 — Usuarios (CRUD)

## Campos

| Campo API | Etiqueta UI | Validación |
|-----------|-------------|------------|
| `firstName` | Nombre | 2-100 chars, requerido |
| `lastName` | Apellido | 2-100 chars, requerido |
| `document` | Documento | 5-20 chars, alfanumérico |
| `email` | Correo | Email válido, único |
| `password` | Contraseña | Mín. 8, fortaleza bcrypt |
| `roleId` | Rol | UUID válido, rol existente |

## Endpoints

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/v1/users` | `users:manage` |
| GET | `/api/v1/users/:id` | `users:manage` |
| POST | `/api/v1/users` | `users:manage` |
| PUT | `/api/v1/users/:id` | `users:manage` |
| DELETE | `/api/v1/users/:id` | `users:manage` |

## Restricciones

- No eliminar la propia cuenta
- No cambiar el propio rol si es Administrador
- Debe existir al menos un Administrador
- Email y documento únicos por empresa

## Frontend

| Ruta | Página |
|------|--------|
| `/login` | Login |
| `/users` | Lista de usuarios |
| `/users/new` | Crear usuario |
| `/users/:id/edit` | Editar usuario |
