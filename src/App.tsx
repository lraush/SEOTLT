import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";
import checkedIcon from "./assets/checked.png";
import cancelIcon from "./assets/cancel.png";

interface Post {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  // Загрузка постов из localStorage
  const loadPostsFromLocalStorage = () => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts && JSON.parse(savedPosts).length > 0) {
      setPosts(JSON.parse(savedPosts));
    } else {
      loadPostsFromAPI();
    }
  };

  // Функция для загрузки постов из API

  function loadPostsFromAPI() {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      const fetchedPosts = response.data as Post[];

      localStorage.setItem("posts", JSON.stringify(fetchedPosts)); // Сохраняем данные в localStorage
      setPosts(fetchedPosts); // Устанавливаем данные в состояние
    });
  }

  useEffect(() => {
    loadPostsFromLocalStorage();

    // }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (editedPost) {
      setEditedPost({
        ...editedPost,
        [field]: e.target.value,
      });
    }
  };

  const handleSaveEdit = () => {
    if (editedPost) {
      const updatedPosts = posts.map((post) =>
        post.id === editedPost.id
          ? { ...post, title: editedPost.title, body: editedPost.body }
          : post
      );

      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // Останавливаем редактирование
      setEditPostId(null);
      setEditedPost(null);
    }
  };

  const editHandler = (postId: number) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit) {
      setEditPostId(postId); // Устанавливаем id редактируемого поста
      setEditedPost(postToEdit); // Загружаем данные в форму
    }
  };

  const handleDelete = (postId: number) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);

    // Сохраняем обновленный список постов в localStorage
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  return (
    <>
      <h1 className="title">Новости</h1>
      <div className="container">
        {posts.map((post) => (
          <div className="post-container" key={post.id}>
            {editPostId === post.id ? (
              <form>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={editedPost?.title || ""}
                    onChange={(e) => handleInputChange(e, "title")}
                  />
                </label>
                <br />
                <label>
                  Body:
                  <textarea
                    name="body"
                    value={editedPost?.body || ""}
                    onChange={(e) => handleInputChange(e, "body")}
                  />
                </label>
                <br />
                <button
                  className="post-btn post-btn-active"
                  type="button"
                  onClick={handleSaveEdit}
                >
                  <img className="post-icon" src={checkedIcon} />
                </button>
                <button
                  className="post-btn"
                  type="button"
                  onClick={() => {
                    setEditPostId(null);
                    setEditedPost(null);
                  }}
                >
                  <img className="post-icon" src={cancelIcon} />
                </button>
              </form>
            ) : (
              <div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <button
                  className="post-btn"
                  onClick={() => editHandler(post.id)}
                >
                  <img className="post-icon" src={editIcon} />
                </button>
                <button
                  className="post-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  <img className="post-icon" src={deleteIcon} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
