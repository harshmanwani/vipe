"use client";

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ThumbsUp, MessageSquare, Search, Tag, Filter } from "lucide-react";
import { 
  getAllPosts, 
  canModifyPost, 
  deletePost, 
  toggleThumbsUp, 
  hasUserThumbsUp,
  filterPosts,
  availableTags,
  availableStatuses
} from '@/app/lib/supabaseData';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    // Fetch posts
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTag, selectedStatus, posts]);

  const applyFilters = async () => {
    try {
      const filtered = await filterPosts(
        searchTerm, 
        selectedTag !== 'all' ? selectedTag : '', 
        selectedStatus !== 'all' ? selectedStatus : ''
      );
      setFilteredPosts(filtered);
    } catch (err) {
      console.error('Error filtering posts:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const canModify = await canModifyPost(user.username, postId);
      if (!canModify) {
        alert('You do not have permission to delete this post');
        return;
      }
      
      const success = await deletePost(postId);
      if (success) {
        // Refresh posts after deletion
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('An error occurred while deleting the post');
    }
  };

  const handleThumbsUp = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to like posts');
      return;
    }
    
    try {
      const success = await toggleThumbsUp(postId, user.username);
      if (success) {
        // Refresh posts after thumbs up
        fetchPosts();
      }
    } catch (err) {
      console.error('Error toggling thumbs up:', err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTag('all');
    setSelectedStatus('all');
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Listings</h1>
          {user && (
            <Link href="/create">
              <Button>Create New Listing</Button>
            </Link>
          )}
        </div>
        
        {/* Filters */}
        <div className="mb-8 bg-card p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <Tag className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {availableStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} listings
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
            <Button variant="link" className="ml-2 p-0 h-auto" onClick={fetchPosts}>
              Try Again
            </Button>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-muted-foreground">Loading listings...</p>
          </div>
        )}
        
        {/* Listings */}
        {!loading && filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No listings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      {user && (user.username === post.posted_by || user.role === 'admin') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
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
                  <CardContent className="pb-2">
                    <p className="line-clamp-2 text-muted-foreground">{post.description}</p>
                    {post.price && <p className="font-semibold mt-2">${post.price}</p>}
                    {post.time && <p className="font-medium mt-2">Time: {post.time}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 px-2 ${user && hasUserThumbsUp(post, user.username) ? 'text-blue-600 dark:text-blue-400' : ''}`}
                        onClick={(e) => handleThumbsUp(e, post.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.thumbs_up || 0}</span>
                      </Button>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>Posted by {post.posted_by}</span>
                      <span className="block">{formatDate(post.created_at)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 