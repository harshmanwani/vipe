"use client";

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
    thumbsUp: 3,
    thumbsUpBy: ["admin", "john12a", "user123"],
    comments: [
      {
        id: 1,
        text: "Is this still available?",
        postedBy: "john12a",
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      }
    ],
    tag: "goods"
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
    thumbsUp: 1,
    thumbsUpBy: ["maria4b"],
    comments: [],
    tag: "services"
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
    thumbsUp: 0,
    thumbsUpBy: [],
    comments: [],
    tag: "goods"
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

// Available tags
export const availableTags = ["goods", "services", "education", "money", "general"];

// Available statuses
export const availableStatuses = ["Available", "Sold", "Pending"];

// Helper functions
export const getAllPosts = () => posts;

export const getPostById = (id) => {
  const post = posts.find(post => post.id === Number(id)) || null;
  if (post) {
    // Ensure post has the required fields
    return {
      ...post,
      thumbsUp: post.thumbsUp || 0,
      thumbsUpBy: post.thumbsUpBy || [],
      comments: post.comments || [],
      tag: post.tag || "general"
    };
  }
  return null;
};

export const createPost = (post) => {
  const newPost = {
    ...post,
    id: posts.length + 1,
    status: "Available",
    createdAt: new Date().toISOString(),
    thumbsUp: 0,
    thumbsUpBy: [],
    comments: [],
    tag: post.tag || "general"
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

// Thumbs up functionality
export const toggleThumbsUp = (postId, username) => {
  const post = posts.find(p => p.id === Number(postId));
  if (!post) return false;
  
  // Ensure post has the required fields
  if (!post.thumbsUpBy) post.thumbsUpBy = [];
  if (post.thumbsUp === undefined) post.thumbsUp = 0;
  
  const userIndex = post.thumbsUpBy.indexOf(username);
  if (userIndex === -1) {
    // User hasn't liked the post yet, add thumbs up
    post.thumbsUpBy.push(username);
    post.thumbsUp += 1;
  } else {
    // User already liked the post, remove thumbs up
    post.thumbsUpBy.splice(userIndex, 1);
    post.thumbsUp -= 1;
  }
  saveToLocalStorage();
  return true;
};

// Comment functionality
export const addComment = (postId, comment) => {
  const post = posts.find(p => p.id === Number(postId));
  if (!post) return false;
  
  // Ensure post has the comments field
  if (!post.comments) post.comments = [];
  
  const newComment = {
    id: post.comments.length + 1,
    text: comment.text,
    postedBy: comment.postedBy,
    createdAt: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  saveToLocalStorage();
  return newComment;
};

// Check if user has thumbs up a post
export const hasUserThumbsUp = (postId, username) => {
  const post = posts.find(p => p.id === Number(postId));
  if (!post) return false;
  if (!post.thumbsUpBy) return false;
  return post.thumbsUpBy.includes(username);
};

// Filter posts by search term, tag, and status
export const filterPosts = (searchTerm = "", tag = "", status = "") => {
  return posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = tag === "" || post.tag === tag;
    
    const matchesStatus = status === "" || post.status === status;
    
    return matchesSearch && matchesTag && matchesStatus;
  });
}; 