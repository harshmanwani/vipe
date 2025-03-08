"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ArrowLeft } from "lucide-react";
import { getPostById, toggleThumbsUp, hasUserThumbsUp, addComment } from '@/app/lib/supabaseData';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    // Fetch post data
    fetchPost();
  }, [params.id]);
  
  const fetchPost = async () => {
    setLoading(true);
    try {
      const fetchedPost = await getPostById(params.id);
      if (fetchedPost) {
        setPost(fetchedPost);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbsUp = async () => {
    if (!user) return; // Only logged in users can thumbs up
    
    try {
      const success = await toggleThumbsUp(post.id, user.username);
      if (success) {
        // Refresh post data
        fetchPost();
      }
    } catch (err) {
      console.error('Error toggling thumbs up:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    
    try {
      const newComment = await addComment(post.id, {
        text: comment,
        postedBy: user.username
      });
      
      if (newComment) {
        setComment('');
        // Refresh post data
        fetchPost();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
          </Button>
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-muted-foreground">Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
          </Button>
          <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
            <Button variant="link" className="ml-2 p-0 h-auto" onClick={fetchPost}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Post not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={post.status === 'Available' ? 'default' : post.status === 'Pending' ? 'outline' : 'secondary'}>
                {post.status}
              </Badge>
              <Badge variant="outline">{post.type}</Badge>
              {post.tag && (
                <Badge variant="outline" className="capitalize">
                  {post.tag}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{post.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {post.price && (
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold">${post.price}</p>
                </div>
              )}
              {post.time && (
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{post.time}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Posted by</p>
                <p className="font-semibold">{post.posted_by}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-semibold">{formatDate(post.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-6">
              <Button 
                variant={user && hasUserThumbsUp(post, user.username) ? "default" : "outline"}
                size="sm" 
                onClick={handleThumbsUp}
                disabled={!user}
                className="mr-2"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {user && hasUserThumbsUp(post, user.username) ? "Interested" : "I'm interested"}
                <span className="ml-2 bg-background text-foreground px-2 py-0.5 rounded-full text-xs">
                  {post.thumbs_up || 0}
                </span>
              </Button>
              {!user && <p className="text-sm text-muted-foreground ml-2">Login to show interest</p>}
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Comments ({post.comments?.length || 0})</h2>
          
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
            <p className="text-sm text-muted-foreground mb-6">Login to leave a comment</p>
          )}
          
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{comment.posted_by}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                    </div>
                    <p>{comment.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No comments yet</p>
          )}
        </div>
      </main>
    </div>
  );
} 