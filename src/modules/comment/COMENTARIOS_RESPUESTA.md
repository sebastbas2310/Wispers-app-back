# Estructura de Respuesta de Comentarios de un Post

Cuando consultas los comentarios de un post específico, recibes una respuesta estructurada con toda la información solicitada.

## Endpoint

**GET** `/comment/post/:postId`

## Estructura de la Respuesta

```json
{
  "postId": "post789",
  "total": 3,
  "comments": [
    {
      "id": "comment123",
      "message": "Este es el texto del comentario",
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
      ],
      "likesCount": 2
    },
    {
      "id": "comment124",
      "message": "Otro comentario al mismo post",
      "userId": "user789",
      "postId": "post789",
      "createdAt": "2026-04-22T11:00:00.000Z",
      "updatedAt": null,
      "likes": [],
      "likesCount": 0
    },
    {
      "id": "comment125",
      "message": "Tercer comentario",
      "userId": "user999",
      "postId": "post789",
      "createdAt": "2026-04-22T11:30:00.000Z",
      "updatedAt": "2026-04-22T12:00:00.000Z",
      "likes": [
        {
          "userId": "user456",
          "createdAt": "2026-04-22T11:45:00.000Z"
        }
      ],
      "likesCount": 1
    }
  ]
}
```

## Campos Devueltos

### Nivel Principal
- **postId**: ID del post comentado
- **total**: Cantidad total de comentarios del post
- **comments**: Array de comentarios

### Por Cada Comentario
- **id**: ID único del comentario
- **message**: Texto/contenido del comentario
- **userId**: ID de quién hizo el comentario (comentarista)
- **postId**: ID del post comentado
- **createdAt**: Fecha y hora exacta de creación del comentario
- **updatedAt**: Fecha de última edición (null si no ha sido editado)
- **likes**: Array de likes al comentario con userId y timestamp
- **likesCount**: Número total de likes

## Ejemplo de Uso

```bash
# Obtener comentarios de un post
curl http://localhost:3000/comment/post/post789

# Resultado ordenado por más recientes primero
```

## Notas

✅ Los comentarios se retornan ordenados por fecha (más recientes primero)  
✅ Se incluye el ID del comentarista (userId)  
✅ Se incluye el ID del post comentado (postId)  
✅ Se incluye la fecha exacta de creación (createdAt)  
✅ Se incluye el mensaje del comentario  
✅ Se incluye información sobre likes (usuarios y cuándo dieron like)  
✅ Se cuenta automáticamente el número de likes  
