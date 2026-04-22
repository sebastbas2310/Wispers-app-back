# Like Module

## Descripción
El módulo Like permite a los usuarios dar "likes" a posts. Cada like guarda:
- **userId**: ID del usuario que dio el like
- **postId**: ID del post al que le dieron like
- **createdAt**: Fecha y hora en que se dio el like (timestamp)

## Endpoints

### 1. Crear un Like
**POST** `/like`

Requiere autenticación JWT.

**Body:**
```json
{
  "postId": "123abc"
}
```

**Respuesta (201):**
```json
{
  "id": "like123",
  "userId": "user456",
  "postId": "123abc",
  "createdAt": "2026-04-22T10:30:00.000Z"
}
```

**Errores:**
- 400: "Ya has dado like a este post" (si ya existe)
- 401: No autenticado

---

### 2. Obtener todos los likes de un post
**GET** `/like/post/:postId`

**Respuesta (200):**
```json
[
  {
    "id": "like123",
    "userId": "user456",
    "postId": "123abc",
    "createdAt": "2026-04-22T10:30:00.000Z"
  },
  {
    "id": "like124",
    "userId": "user789",
    "postId": "123abc",
    "createdAt": "2026-04-22T11:15:00.000Z"
  }
]
```

---

### 3. Contar likes de un post
**GET** `/like/post/:postId/count`

**Respuesta (200):**
```json
{
  "count": 5
}
```

---

### 4. Verificar si el usuario actual dio like a un post
**GET** `/like/user/liked/:postId`

Requiere autenticación JWT.

**Respuesta (200):**
```json
{
  "liked": true
}
```

---

### 5. Obtener todos los likes de un usuario
**GET** `/like/user/:userId`

**Respuesta (200):**
```json
[
  {
    "id": "like123",
    "userId": "user456",
    "postId": "123abc",
    "createdAt": "2026-04-22T10:30:00.000Z"
  }
]
```

---

### 6. Obtener un like específico
**GET** `/like/:id`

**Respuesta (200):**
```json
{
  "id": "like123",
  "userId": "user456",
  "postId": "123abc",
  "createdAt": "2026-04-22T10:30:00.000Z"
}
```

---

### 7. Eliminar un like por su ID
**DELETE** `/like/:id`

Requiere autenticación JWT. Solo el usuario que dio el like puede eliminarlo.

**Respuesta (200):**
```json
{
  "deleted": true
}
```

**Errores:**
- 400: "No puedes eliminar likes de otros usuarios"
- 404: Like no encontrado
- 401: No autenticado

---

### 8. Eliminar like de un post por el usuario autenticado
**DELETE** `/like/post/:postId`

Requiere autenticación JWT. Elimina el like del post por el usuario actual.

**Respuesta (200):**
```json
{
  "deleted": true
}
```

**Errores:**
- 401: No autenticado

---

## Ejemplos de uso

### Dar like a un post
```bash
curl -X POST http://localhost:3000/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"postId": "123abc"}'
```

### Obtener cantidad de likes de un post
```bash
curl http://localhost:3000/like/post/123abc/count
```

### Obtener todos los likes de un post con detalles de usuario
```bash
curl http://localhost:3000/like/post/123abc
```

### Dar unlike (eliminar like)
```bash
curl -X DELETE http://localhost:3000/like/post/123abc \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Esquema de la Base de Datos

**Colección: likes**
```javascript
{
  "_id": ObjectId,
  "id": "like123",
  "userId": "user456",
  "postId": "123abc",
  "createdAt": ISODate("2026-04-22T10:30:00.000Z")
}
```

---

## Notas importantes

- Cada usuario solo puede dar un like por post (validación implementada)
- El timestamp se asigna automáticamente al crear el like
- Los likes se pueden usar para contar interacciones en posts
- Se recomienda agregar paginación si hay muchos likes por post
