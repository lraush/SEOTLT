import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

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
    console.log("WORK STEP 2");
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      const fetchedPosts = response.data as Post[];

      localStorage.setItem("posts", JSON.stringify(fetchedPosts)); // Сохраняем данные в localStorage
      setPosts(fetchedPosts); // Устанавливаем данные в состояние
    });
  }

  // const loadPostsFromAPI = async () => {
  //   console.log("WORK STEP 2");
  //   try {
  //     const response = await axios.get(
  //       "https://jsonplaceholder.typicode.com/posts"
  //     );
  //     const data = response.data as Post[];
  //     console.log("data: ", data);
  //     localStorage.setItem("posts", JSON.stringify(data));
  //     setPosts(data);
  //   } catch (error) {
  //     console.error("Ошибка загрузки:", error);
  //     // Можно показать toast-уведомление
  //   }
  // };

  // useEffect с проверкой на наличие данных в localStorage
  useEffect(() => {
    console.log("WORK");
    // if (posts.length > 0) {
    console.log("WORK2");
    loadPostsFromLocalStorage();
    // } else {
    //   console.log("WORK3");
    //   loadPostsFromAPI();
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
    <div className="container">
      <h1 className="title">Новости</h1>
      {posts.map((post) => (
        <div key={post.id}>
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
              <button type="button" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditPostId(null);
                  setEditedPost(null);
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.body}</p>
              <button className="post-btn" onClick={() => editHandler(post.id)}>
                Edit
              </button>
              <button
                className="post-btn"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
