import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";
import checkedIcon from "./assets/checked.png";
import cancelIcon from "./assets/cancel.png";
// import addIcon from "./assets/add.png"; // Иконка для кнопки добавления

interface Post {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // Состояние для открытия/закрытия формы добавления
  const [newPost, setNewPost] = useState<Post>({ id: 0, title: "", body: "" }); // Состояние для нового поста

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
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((response) => {
        const fetchedPosts = response.data as Post[];

        localStorage.setItem("posts", JSON.stringify(fetchedPosts)); // Сохраняем данные в localStorage
        setPosts(fetchedPosts);
      });
  }

  useEffect(() => {
    loadPostsFromLocalStorage();
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
    } else {
      setNewPost({
        ...newPost,
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

  const handleAddPost = () => {
    if (newPost.title && newPost.body) {
      // Генерация нового id (в реальной ситуации лучше использовать сервер для генерации id)
      const newId = posts.length
        ? Math.max(...posts.map((post) => post.id)) + 1
        : 1;

      const updatedPost = { ...newPost, id: newId };
      const updatedPosts = [...posts, updatedPost];

      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // Сбросим форму добавления
      setNewPost({ id: 0, title: "", body: "" });
      setIsAddFormOpen(false);
    }
  };

  return (
    <>
      <h1 className="title">Новости</h1>
      <div className="container">
        <div className="container-add">
          <button
            className="post-add"
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          >
            Добавить новость
          </button>
          {isAddFormOpen && (
            <form className="form">
                            <div className="post-btn-wrapper">
                <button
                  className="post-btn-add"
                  type="button"
                  onClick={handleAddPost}
                >
                  <img className="post-icon" src={checkedIcon} />
                </button>
                <button
                  className="post-btn-add"
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                >
                  <img className="post-icon" src={cancelIcon} />
                </button>
              </div>
              <label>
                Title:
                <input
                  className="post-input"
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={(e) => handleInputChange(e, "title")}
                />
              </label>
              <label>
                Body:
                <textarea
                  className="post-input"
                  name="body"
                  value={newPost.body}
                  onChange={(e) => handleInputChange(e, "body")}
                />
              </label>
            </form>
          )}
        </div>

        {posts.map((post) => (
          <div className="post-container" key={post.id}>
            {editPostId === post.id ? (
              <form className="form">
                <label>
                  Title:
                  <input
                    className="post-input"
                    type="text"
                    name="title"
                    value={editedPost?.title || ""}
                    onChange={(e) => handleInputChange(e, "title")}
                  />
                </label>
                <label>
                  Body:
                  <textarea
                    className="post-input"
                    name="body"
                    value={editedPost?.body || ""}
                    onChange={(e) => handleInputChange(e, "body")}
                  />
                </label>
                <div className="post-btn-wrapper">
                  <button
                    className="post-btn-intro"
                    type="button"
                    onClick={handleSaveEdit}
                  >
                    <img className="post-icon" src={checkedIcon} />
                  </button>
                  <button
                    className="post-btn-intro"
                    type="button"
                    onClick={() => {
                      setEditPostId(null);
                      setEditedPost(null);
                    }}
                  >
                    <img className="post-icon" src={cancelIcon} />
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <div className="post-btn-wrapper ">
                  <button
                    className="post-btn-external"
                    onClick={() => editHandler(post.id)}
                  >
                    <img className="post-icon" src={editIcon} />
                  </button>
                  <button
                    className="post-btn-external"
                    onClick={() => handleDelete(post.id)}
                  >
                    <img className="post-icon" src={deleteIcon} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
