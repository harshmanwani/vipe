"use client";

import { supabase } from './supabase';
import { normalizeUserData } from './userUtils';

// Posts
export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
};

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  return data;
};

export const createPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: post.title,
      type: post.type,
      description: post.description,
      price: post.price,
      time: post.time,
      status: 'Available',
      posted_by: post.postedBy,
      tag: post.tag || 'general',
      thumbs_up: 0,
      thumbs_up_by: [],
      comments: []
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  
  return data;
};

export const deletePost = async (id) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  
  return true;
};

// Users
export const getUser = async (username) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return normalizeUserData(data);
};

export const createUser = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: user.username,
      password: user.password, // Note: In a production app, you should hash passwords
      discord_name: user.discordName,
      role: 'user'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  
  return normalizeUserData(data);
};

// Authorization
export const canModifyPost = async (username, postId) => {
  const user = await getUser(username);
  const post = await getPostById(postId);
  
  if (!user || !post) return false;
  return user.role === 'admin' || post.posted_by === username;
};

// Thumbs up functionality
export const toggleThumbsUp = async (postId, username) => {
  // First get the current post
  const post = await getPostById(postId);
  if (!post) return false;
  
  // Ensure arrays exist
  const thumbsUpBy = post.thumbs_up_by || [];
  
  // Check if user already liked the post
  const userIndex = thumbsUpBy.indexOf(username);
  let newThumbsUpBy = [...thumbsUpBy];
  let newThumbsUp = post.thumbs_up || 0;
  
  if (userIndex === -1) {
    // User hasn't liked the post yet, add thumbs up
    newThumbsUpBy.push(username);
    newThumbsUp += 1;
  } else {
    // User already liked the post, remove thumbs up
    newThumbsUpBy.splice(userIndex, 1);
    newThumbsUp -= 1;
  }
  
  // Update the post
  const { error } = await supabase
    .from('posts')
    .update({
      thumbs_up: newThumbsUp,
      thumbs_up_by: newThumbsUpBy
    })
    .eq('id', postId);
  
  if (error) {
    console.error('Error updating thumbs up:', error);
    return false;
  }
  
  return true;
};

// Comment functionality
export const addComment = async (postId, comment) => {
  // First get the current post
  const post = await getPostById(postId);
  if (!post) return false;
  
  // Ensure comments array exists
  const comments = post.comments || [];
  
  // Create new comment
  const newComment = {
    id: comments.length + 1,
    text: comment.text,
    posted_by: comment.postedBy,
    created_at: new Date().toISOString()
  };
  
  // Add comment to array
  const newComments = [...comments, newComment];
  
  // Update the post
  const { error } = await supabase
    .from('posts')
    .update({
      comments: newComments
    })
    .eq('id', postId);
  
  if (error) {
    console.error('Error adding comment:', error);
    return false;
  }
  
  return newComment;
};

// Check if user has thumbs up a post
export const hasUserThumbsUp = (post, username) => {
  if (!post || !post.thumbs_up_by) return false;
  return post.thumbs_up_by.includes(username);
};

// Filter posts
export const filterPosts = async (searchTerm = "", tag = "", status = "") => {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Apply filters if provided
  if (tag && tag !== 'all') {
    query = query.eq('tag', tag);
  }
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error filtering posts:', error);
    return [];
  }
  
  // Filter by search term client-side (since Supabase doesn't support full-text search easily)
  if (searchTerm) {
    return data.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return data || [];
};

// Available tags and statuses
export const availableTags = ["goods", "services", "education", "money", "general"];
export const availableStatuses = ["Available", "Sold", "Pending"]; 