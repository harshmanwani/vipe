// In-memory data store
let posts = [
  {
    id: 1,
    title: "Selling Chair - $10",
    type: "For Sale",
    description: "Comfortable wooden chair, barely used",
    price: "10",
    status: "Available",
    postedBy: "maria4b",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    title: "Ride to city - 6 PM",
    type: "Service",
    description: "Going downtown, can take 2 people",
    time: "6 PM",
    status: "Available",
    postedBy: "john12a",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    title: "Old Lamp - $5",
    type: "For Sale",
    description: "Working desk lamp",
    price: "5",
    status: "Available",
    postedBy: "admin",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

let users = [
  {
    username: "admin",
    password: "admin123",
    apartment: "1A",
    role: "admin",
  },
  {
    username: "maria4b",
    password: "password123",
    apartment: "4B",
    role: "user",
  },
  {
    username: "john12a",
    password: "password123",
    apartment: "12A",
    role: "user",
  },
];

// Helper functions
export const getAllPosts = () => posts;

export const createPost = (post) => {
  const newPost = {
    ...post,
    id: posts.length + 1,
    status: "Available",
    createdAt: new Date().toISOString(),
  };
  posts = [newPost, ...posts];
  return newPost;
};

export const deletePost = (id) => {
  posts = posts.filter((post) => post.id !== id);
};

export const getUser = (username) => {
  return users.find((user) => user.username === username);
};

export const createUser = (user) => {
  const newUser = {
    ...user,
    role: "user",
  };
  users = [...users, newUser];
  return newUser;
};

// For checking post ownership or admin rights
export const canModifyPost = (username, postId) => {
  const user = getUser(username);
  const post = posts.find((p) => p.id === postId);
  
  if (!user || !post) return false;
  return user.role === "admin" || post.postedBy === username;
};

// Local storage helpers
export const saveToLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("posts", JSON.stringify(posts));
    localStorage.setItem("users", JSON.stringify(users));
  }
};

export const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedPosts = localStorage.getItem("posts");
    const savedUsers = localStorage.getItem("users");
    if (savedPosts) posts = JSON.parse(savedPosts);
    if (savedUsers) users = JSON.parse(savedUsers);
  }
}; 