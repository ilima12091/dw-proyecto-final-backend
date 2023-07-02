import { Router } from "express";
import { User } from "./user";
import { Timestamp } from "./timestamp";
import { PostCard } from "../interface/post-card";

const router = Router();

const posts: PostCard[] = [];

// Endpoint para obtener las tarjetas de un usuario
router.get("/:username/posts", (req, res) => {
  const { username } = req.params;

  // Filtra las tarjetas por el nombre de usuario
  const userPosts = posts.filter((post) => post.userName === username);

  if (userPosts.length > 0) {
    res.status(200).json(userPosts);
  } else {
    res.status(404).json({
      errorCode: "user_posts_not_found",
      errorMessage: "No se encontraron tarjetas para el usuario",
    });
  }
});

// Nuevo endpoint para crear un nuevo post
router.post("/:username/posts", (req, res) => {
  const { username } = req.params;
  const { userImage, userName, content, timeStamp } = req.body as PostCard;

  // lógica para crear un nuevo post

  if (username) {
    // Si el usuario está autenticado, crea el nuevo post
    const postId = posts.length + 1; // ID del nuevo post creado
    const post: PostCard = {
      PostId: postId,
      UserId: 0, // Provide the appropriate User ID
      userName,
      content,
      timeStamp,
      userImage,
    };
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
    (post) => post.PostId === Number(postId) && post.userName === username
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
  const { content, UserId } = req.body as PostCard;

  // Busca el post por su ID y usuario asociado
  const index = posts.findIndex(
    (post) => post.PostId === Number(postId) && post.userName === username
  );
  if (index !== -1) {
    // Si se encuentra el post, modifica su contenido
    posts[index].content = content;

    const modifiedPost = posts[index];
    res.status(200).json(modifiedPost);
  } else {
    // Si el post no existe, devuelve el error 404
    res.status(404).json({
      errorCode: "post_not_found",
      errorMessage: "El post no existe",
    });
  }
});

export default router;
