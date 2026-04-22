# Comment Module

## Descripción
El módulo Comment permite a los usuarios comentar en posts. Cada comentario guarda:
- **message**: El contenido del comentario
- **userId**: ID de quién escribió el comentario
- **postId**: ID del post comentado
- **createdAt**: Fecha y hora de creación
- **updatedAt**: Fecha y hora de última edición (opcional)
- **likes**: Array con los likes al comentario, guardando userId y createdAt de cada like

## Estructura del Comentario

```json
{
  "id": "comment123",
  "message": "Este es un comentario excelente",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "updatedAt": null,
  "likes": [
    {
      "userId": "user101",
      "createdAt": "2026-04-22T10:35:00.000Z"
    },
    {
      "userId": "user102",
      "createdAt": "2026-04-22T10:40:00.000Z"
    }
  ]
}
```

## Endpoints

### 1. Crear un Comentario
**POST** `/comment`

Requiere autenticación JWT.

**Body:**
```json
{
  "message": "Este es mi comentario",
  "postId": "post789"
}
```

**Respuesta (201):**
```json
{
  "id": "comment123",
  "message": "Este es mi comentario",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "updatedAt": null,
  "likes": []
}
```

**Errores:**
- 401: No autenticado

---

### 2. Obtener todos los comentarios
**GET** `/comment`

Retorna comentarios ordenados por fecha de creación (más recientes primero).

**Respuesta (200):**
```json
[
  {
    "id": "comment123",
    "message": "Primer comentario",
    "userId": "user456",
    "postId": "post789",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "likes": []
  }
]
```

---

### 3. Obtener comentarios de un post
**GET** `/comment/post/:postId`

Retorna todos los comentarios de un post, ordenados por fecha (más recientes primero).

**Respuesta (200):**
```json
[
  {
    "id": "comment123",
    "message": "Comentario al post",
    "userId": "user456",
    "postId": "post789",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "likes": []
  }
]
```

---

### 4. Contar comentarios de un post
**GET** `/comment/post/:postId/count`

**Respuesta (200):**
```json
{
  "count": 5
}
```

---

### 5. Obtener comentarios de un usuario
**GET** `/comment/user/:userId`

**Respuesta (200):**
```json
[
  {
    "id": "comment123",
    "message": "Mi comentario",
    "userId": "user456",
    "postId": "post789",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "likes": []
  }
]
```

---

### 6. Obtener un comentario específico
**GET** `/comment/:id`

**Respuesta (200):**
```json
{
  "id": "comment123",
  "message": "Comentario específico",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "likes": []
}
```

**Errores:**
- 404: Comentario no encontrado

---

### 7. Editar un comentario
**PATCH** `/comment/:id`

Requiere autenticación JWT. Solo el autor del comentario puede editarlo.

**Body:**
```json
{
  "message": "Comentario editado"
}
```

**Respuesta (200):**
```json
{
  "id": "comment123",
  "message": "Comentario editado",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "updatedAt": "2026-04-22T10:45:00.000Z",
  "likes": []
}
```

**Errores:**
- 400: "No puedes editar comentarios de otros usuarios"
- 404: Comentario no encontrado
- 401: No autenticado

---

### 8. Eliminar un comentario
**DELETE** `/comment/:id`

Requiere autenticación JWT. Solo el autor puede eliminarlo.

**Respuesta (200):**
```json
{
  "deleted": true
}
```

**Errores:**
- 400: "No puedes eliminar comentarios de otros usuarios"
- 404: Comentario no encontrado
- 401: No autenticado

---

## Endpoints de Likes en Comentarios

### 9. Dar like a un comentario
**POST** `/comment/:id/like`

Requiere autenticación JWT.

**Respuesta (200):**
```json
{
  "id": "comment123",
  "message": "Comentario con like",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "likes": [
    {
      "userId": "user789",
      "createdAt": "2026-04-22T10:50:00.000Z"
    }
  ]
}
```

**Errores:**
- 400: "Ya has dado like a este comentario"
- 404: Comentario no encontrado
- 401: No autenticado

---

### 10. Eliminar like de un comentario
**DELETE** `/comment/:id/like`

Requiere autenticación JWT. Elimina el like del usuario autenticado.

**Respuesta (200):**
```json
{
  "id": "comment123",
  "message": "Comentario sin like",
  "userId": "user456",
  "postId": "post789",
  "createdAt": "2026-04-22T10:30:00.000Z",
  "likes": []
}
```

**Errores:**
- 404: Comentario no encontrado
- 401: No autenticado

---

### 11. Contar likes de un comentario
**GET** `/comment/:id/like/count`

**Respuesta (200):**
```json
{
  "count": 3
}
```

**Errores:**
- 404: Comentario no encontrado

---

### 12. Verificar si el usuario dio like al comentario
**GET** `/comment/:id/like/user`

Requiere autenticación JWT.

**Respuesta (200):**
```json
{
  "liked": true
}
```

**Errores:**
- 404: Comentario no encontrado
- 401: No autenticado

---

## Ejemplos de uso

### Comentar en un post
```bash
curl -X POST http://localhost:3000/comment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Excelente post!",
    "postId": "post789"
  }'
```

### Obtener comentarios de un post
```bash
curl http://localhost:3000/comment/post/post789
```

### Editar un comentario
```bash
curl -X PATCH http://localhost:3000/comment/comment123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Comentario corregido"}'
```

### Dar like a un comentario
```bash
curl -X POST http://localhost:3000/comment/comment123/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Eliminar like de un comentario
```bash
curl -X DELETE http://localhost:3000/comment/comment123/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Contar likes de un comentario
```bash
curl http://localhost:3000/comment/comment123/like/count
```

---

## Esquema de la Base de Datos

**Colección: comments**
```javascript
{
  "_id": ObjectId,
  "id": "comment123",
  "message": "Contenido del comentario",
  "userId": "user456",
  "postId": "post789",
  "createdAt": ISODate("2026-04-22T10:30:00.000Z"),
  "updatedAt": ISODate("2026-04-22T10:45:00.000Z"),
  "likes": [
    {
      "userId": "user101",
      "createdAt": ISODate("2026-04-22T10:35:00.000Z")
    },
    {
      "userId": "user102",
      "createdAt": ISODate("2026-04-22T10:40:00.000Z")
    }
  ]
}
```

---

## Características principales

✅ Crear comentarios en posts  
✅ Editar comentarios propios  
✅ Eliminar comentarios propios  
✅ Dar likes a comentarios  
✅ Eliminar likes de comentarios  
✅ Verificar si el usuario actual dio like  
✅ Contar likes por comentario  
✅ Ordenamiento automático por fecha (más recientes primero)  
✅ Control de permisos: solo el autor puede editar/eliminar  
✅ Timestamps automáticos de creación y edición  

---

## Notas importantes

- Cada usuario solo puede dar un like por comentario (validación implementada)
- Los likes se guardan con timestamp de cuándo se dieron
- Los comentarios mantienen el historial con `updatedAt`
- El ordenamiento es automático por fecha más reciente
- Los permisos se verifican automáticamente
- Se requiere autenticación JWT para operaciones que modifiquen datos
