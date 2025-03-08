"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ArrowLeft } from "lucide-react";
import { getPostById, toggleThumbsUp, hasUserThumbsUp, addComment, saveToLocalStorage, loadFromLocalStorage } from '@/app/lib/data';
import { Textarea } from "@/components/ui/textarea";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromLocalStorage();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    const fetchedPost = getPostById(params.id);
    if (fetchedPost) {
      // Ensure post has the required fields
      setPost({
        ...fetchedPost,
        thumbsUp: fetchedPost.thumbsUp || 0,
        thumbsUpBy: fetchedPost.thumbsUpBy || [],
        comments: fetchedPost.comments || []
      });
    }
    setLoading(false);
  }, [params.id]);

  const handleThumbsUp = () => {
    if (!user) return; // Only logged in users can thumbs up
    
    toggleThumbsUp(post.id, user.username);
    const updatedPost = getPostById(post.id);
    // Ensure post has the required fields
    setPost({
      ...updatedPost,
      thumbsUp: updatedPost.thumbsUp || 0,
      thumbsUpBy: updatedPost.thumbsUpBy || [],
      comments: updatedPost.comments || []
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    
    addComment(post.id, {
      text: comment,
      postedBy: user.username
    });
    
    setComment('');
    const updatedPost = getPostById(post.id);
    // Ensure post has the required fields
    setPost({
      ...updatedPost,
      thumbsUp: updatedPost.thumbsUp || 0,
      thumbsUpBy: updatedPost.thumbsUpBy || [],
      comments: updatedPost.comments || []
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
          </Button>
          <p>Post not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className={`px-2 py-1 rounded-full text-xs ${
                post.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {post.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {post.price && (
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">${post.price}</p>
                </div>
              )}
              {post.time && (
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{post.time}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Posted by</p>
                <p className="font-semibold">{post.postedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-semibold">{formatDate(post.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold capitalize">{post.tag}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-6">
              <Button 
                variant={user && hasUserThumbsUp(post.id, user.username) ? "default" : "outline"}
                size="sm" 
                onClick={handleThumbsUp}
                disabled={!user}
                className="mr-2"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {user && hasUserThumbsUp(post.id, user.username) ? "Interested" : "I'm interested"}
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {post.thumbsUp}
                </span>
              </Button>
              {!user && <p className="text-sm text-gray-500 ml-2">Login to show interest</p>}
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Comments ({post.comments.length})</h2>
          
          {user ? (
            <form onSubmit={handleAddComment} className="mb-6">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" disabled={!comment.trim()}>
                Post Comment
              </Button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-6">Login to leave a comment</p>
          )}
          
          {post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{comment.postedBy}</p>
                      <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    <p>{comment.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>
      </main>
    </div>
  );
} 