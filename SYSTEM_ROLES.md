# Sistema de Roles para Grupos (Echoes)

## Descripción

Este documento explica cómo funciona el nuevo sistema de asignación automática de roles al crear un grupo.

## Características

1. **Rol de Creador Automático**: Cuando se crea un grupo (echo), el usuario creador automáticamente recibe el rol de "creador" con todos los permisos del servidor.

2. **Persistencia en Base de Datos**: Todas las asignaciones de roles se guardan en la colección `memberroles`.

3. **Gestión de Roles por Grupo**: Cada usuario puede tener un rol diferente en cada grupo.

## Estructura de Datos

### Entidad MemberRole
```
{
  echoId: ObjectId,          // ID del grupo
  userId: String,            // ID del usuario
  roleId: ObjectId,          // ID del rol
  assignedAt: Date           // Fecha de asignación
}
```

### Rol de Creador
```
{
  _id: ObjectId,
  name: "creator",
  color: "#FF0000",
  permissions: [
    "read",
    "write", 
    "delete",
    "manage_members",
    "manage_roles",
    "manage_settings",
    "create_posts",
    "delete_posts",
    "manage_comments",
    "moderate"
  ]
}
```

## Uso

### 1. Crear un Grupo con Rol de Creador Automático

```bash
POST /echo
Content-Type: application/json

{
  "echoName": "Mi Grupo",
  "echoDesc": "Descripción del grupo",
  "echoCreator": "user123",
  "membershipType": "open",
  "privacy": "public",
  "echoType": "group"
}
```

**Respuesta**: El usuario `user123` automáticamente tendrá el rol de "creador" con todos los permisos.

### 2. Obtener Roles de Miembros en un Grupo

```bash
GET /member-role/echo/:echoId
```

**Respuesta**:
```json
[
  {
    "_id": "...",
    "echoId": "...",
    "userId": "user123",
    "roleId": {
      "_id": "...",
      "name": "creator",
      "color": "#FF0000",
      "permissions": [...]
    },
    "assignedAt": "2024-04-27T10:00:00Z"
  }
]
```

### 3. Obtener Rol de un Usuario en un Grupo

```bash
GET /member-role/echo/:echoId/user/:userId
```

### 4. Obtener todos los Grupos de un Usuario (con sus Roles)

```bash
GET /member-role/user/:userId
```

### 5. Asignar un Rol a un Usuario en un Grupo

```bash
POST /member-role
Content-Type: application/json

{
  "echoId": "...",
  "userId": "user456",
  "roleId": "..."
}
```

### 6. Remover Rol de un Usuario en un Grupo

```bash
DELETE /member-role/echo/:echoId/user/:userId
```

## Inicialización de Roles

Para crear los roles de sistema (creator, moderator, member), ejecuta el seed script:

```bash
npx ts-node src/seeding/seed-roles.ts
```

O agregalo a tu package.json:

```json
{
  "scripts": {
    "seed:roles": "ts-node src/seeding/seed-roles.ts"
  }
}
```

Luego ejecuta:
```bash
npm run seed:roles
```

## Permisos Disponibles

- `read`: Leer contenido del grupo
- `write`: Escribir/publicar en el grupo
- `delete`: Eliminar contenido
- `manage_members`: Gestionar miembros
- `manage_roles`: Gestionar roles
- `manage_settings`: Cambiar configuración del grupo
- `create_posts`: Crear posts
- `delete_posts`: Eliminar posts
- `manage_comments`: Gestionar comentarios
- `moderate`: Moderar contenido

Puedes personalizar estos permisos según necesites.

## Flujo de Creación de Grupo

1. Usuario envía `POST /echo` con `echoCreator`
2. Se crea el grupo en la base de datos
3. Se busca/crea el rol de "creator"
4. Se asigna automáticamente el rol al usuario creador en la tabla `memberroles`

## Consideraciones

- Si la creación del grupo es exitosa pero la asignación del rol falla, el grupo se crea de todas formas (el error se loguea pero no aborta la operación).
- Si no existe el rol de "creator", se crea automáticamente con todos los permisos por defecto.
- Cada usuario puede tener solo un rol por grupo.

## Modificaciones Futuras

Puedes:
- Agregar más permisos a la lista según necesites
- Crear roles adicionales (admin, guest, etc.)
- Implementar validaciones de permisos en los endpoints
- Agregar auditoría de cambios de roles
