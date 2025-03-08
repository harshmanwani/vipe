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
  saveToLocalStorage, 
  loadFromLocalStorage, 
  toggleThumbsUp, 
  hasUserThumbsUp,
  filterPosts,
  availableTags,
  availableStatuses
} from '@/app/lib/data';
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

  useEffect(() => {
    loadFromLocalStorage();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    // Get posts and ensure they have the required fields
    const allPosts = getAllPosts().map(post => ({
      ...post,
      thumbsUp: post.thumbsUp || 0,
      thumbsUpBy: post.thumbsUpBy || [],
      comments: post.comments || [],
      tag: post.tag || "general"
    }));
    
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

  // Apply filters when search term, tag, or status changes
  useEffect(() => {
    const filtered = filterPosts(
      searchTerm, 
      selectedTag === 'all' ? '' : selectedTag, 
      selectedStatus === 'all' ? '' : selectedStatus
    );
    
    // Ensure all posts have the required fields
    const processedPosts = filtered.map(post => ({
      ...post,
      thumbsUp: post.thumbsUp || 0,
      thumbsUpBy: post.thumbsUpBy || [],
      comments: post.comments || [],
      tag: post.tag || "general"
    }));
    
    setFilteredPosts(processedPosts);
  }, [searchTerm, selectedTag, selectedStatus]);

  const handleDelete = (postId) => {
    deletePost(postId);
    
    // Get updated posts and ensure they have the required fields
    const updatedPosts = getAllPosts().map(post => ({
      ...post,
      thumbsUp: post.thumbsUp || 0,
      thumbsUpBy: post.thumbsUpBy || [],
      comments: post.comments || [],
      tag: post.tag || "general"
    }));
    
    setPosts(updatedPosts);
    
    // Apply current filters to the updated posts
    const filtered = filterPosts(searchTerm, selectedTag, selectedStatus);
    setFilteredPosts(filtered);
    
    saveToLocalStorage();
  };

  const handleThumbsUp = (e, postId) => {
    e.preventDefault(); // Prevent navigation to post detail
    if (!user) return; // Only logged in users can thumbs up
    
    toggleThumbsUp(postId, user.username);
    
    // Get updated posts and ensure they have the required fields
    const updatedPosts = getAllPosts().map(post => ({
      ...post,
      thumbsUp: post.thumbsUp || 0,
      thumbsUpBy: post.thumbsUpBy || [],
      comments: post.comments || [],
      tag: post.tag || "general"
    }));
    
    setPosts(updatedPosts);
    
    // Apply current filters to the updated posts
    const filtered = filterPosts(searchTerm, selectedTag, selectedStatus);
    setFilteredPosts(filtered);
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

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Community Marketplace</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Select
                value={selectedTag}
                onValueChange={setSelectedTag}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Statuses" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {availableStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active filters */}
          {(searchTerm || selectedTag !== 'all' || selectedStatus !== 'all') && (
            <div className="mt-4 flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                </Badge>
              )}
              
              {selectedTag !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)}
                </Badge>
              )}
              
              {selectedStatus !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {selectedStatus}
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-2">
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        
        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <Card className="relative h-full hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      {user && canModifyPost(user.username, post.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            handleDelete(post.id);
                          }}
                          className="absolute top-4 right-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{post.description}</p>
                    {post.price && (
                      <p className="font-semibold">Price: ${post.price}</p>
                    )}
                    {post.time && (
                      <p className="font-semibold">Time: {post.time}</p>
                    )}
                    <Badge className="mt-2 capitalize">{post.tag}</Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Posted by {post.postedBy}</span>
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`p-0 h-auto ${user && hasUserThumbsUp(post.id, user.username) ? 'text-blue-600' : 'text-gray-500'}`}
                          onClick={(e) => handleThumbsUp(e, post.id)}
                          disabled={!user}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.thumbsUp || 0}</span>
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{post.comments ? post.comments.length : 0}</span>
                      </div>
                    </div>
                    <span>{formatDate(post.createdAt)}</span>
                  </CardFooter>
                  <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded-full text-xs ${
                    post.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {post.status}
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No posts found matching your filters.</p>
              <Button variant="outline" onClick={handleClearFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 