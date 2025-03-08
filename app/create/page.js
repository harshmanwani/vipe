"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createPost, saveToLocalStorage, availableTags } from '@/app/lib/data';

export default function CreatePost() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'For Sale',
    description: '',
    price: '',
    time: '',
    tag: 'general',
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const post = {
      ...formData,
      postedBy: user.username,
    };
    
    createPost(post);
    saveToLocalStorage();
    router.push('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (value) => {
    setFormData({
      ...formData,
      type: value,
      // Clear irrelevant field when type changes
      price: value === 'Service' ? '' : formData.price,
      time: value === 'For Sale' ? '' : formData.time,
    });
  };

  const handleTagChange = (value) => {
    setFormData({
      ...formData,
      tag: value,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.tag}
                    onValueChange={handleTagChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map(tag => (
                        <SelectItem key={tag} value={tag}>
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Max 100 characters"
                  />
                </div>

                {formData.type === 'For Sale' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {formData.type === 'Service' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      name="time"
                      placeholder="e.g., 5 PM"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  <p>After creating your post:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>People can view your post details</li>
                    <li>Show interest with the thumbs up button</li>
                    <li>Leave comments on your post</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full">
                  Create Post
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 