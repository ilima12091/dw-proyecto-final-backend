import { Router } from "express";
import { Post } from "../interface/post";

const router = Router();

const posts: Post[] = [];

// Nuevo endpoint para crear un nuevo post
router.post("/:username/posts", (req, res) => {
  const { username } = req.params;
  const { title, content } = req.body as Post;

  // lógica para crear un nuevo post

  if (username) {
    // Si el usuario está autenticado, crea el nuevo post
    const postId = String(posts.length + 1); // ID del nuevo post creado
    const post: Post = { postId, title, content, username };
    posts.push(post);
    res.status(200).json(post);
  } else {
    // Si el usuario no está autenticado, devuelve el error 401
    res.status(401).json({
      errorCode: "unauthenticated",
      errorMessage: "Usuario no autenticado",
    });
  }
});

// Endpoint para eliminar un post existente
router.delete("/:username/posts/:postId", (req, res) => {
  const { username, postId } = req.params;

  // Busca el post por su ID y usuario asociado
  const index = posts.findIndex(
    (post) => post.postId === postId && post.username === username
  );
  if (index !== -1) {
    // Si se encuentra el post, elimínalo del array de posts
    posts.splice(index, 1);
    res.status(200).send("Post has been deleted successfully");
  } else {
    // Si el post no existe, devuelve el error 404
    res.status(404).json({
      errorCode: "post_not_found",
      errorMessage: "El post no existe",
    });
  }
});

// Endpoint para modificar un post existente
router.put("/:username/posts/:postId", (req, res) => {
  const { username, postId } = req.params;
  const { title, content } = req.body as Post;

  // Busca el post por su ID y usuario asociado
  const index = posts.findIndex(
    (post) => post.postId === postId && post.username === username
  );
  if (index !== -1) {
    // Si se encuentra el post, modifica sus propiedades
    posts[index].title = title;
    posts[index].content = content;

    const modifiedPost = posts[index];
    res.status(200).json({
      postId: modifiedPost.postId,
      title: modifiedPost.title,
      content: modifiedPost.content,
      userId: modifiedPost.username,
    });
  } else {
    // Si el post no existe, devuelve el error 404
    res.status(404).json({
      errorCode: "post_not_found",
      errorMessage: "El post no existe",
    });
  }
});

export default router;
