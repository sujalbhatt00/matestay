import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Finding the Perfect Roommate",
    excerpt: "Finding a roommate is easy, but finding the right one takes effort. Here are our top tips for compatibility.",
    category: "Guides",
    author: "Sujal Bhatt",
    date: "Oct 15, 2025",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
  },
  {
    id: 2,
    title: "Safety First: How to Spot Rental Scams",
    excerpt: "Learn the red flags of rental scams and how to protect yourself when searching for properties online.",
    category: "Safety",
    author: "Shashank Kumar",
    date: "Oct 10, 2025",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
  },
  {
    id: 3,
    title: "Budgeting for Shared Living: A Complete Guide",
    excerpt: "How to split bills, manage groceries, and handle shared expenses without awkward conversations.",
    category: "Finance",
    author: "Matestay Team",
    date: "Sep 28, 2025",
    image: "https://flatmates-res.cloudinary.com/t_blog/blog/iqo4df6zjqs5c2byibzm.jpg"
  }
];

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-30 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Matestay Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stories, tips, and guides to help you navigate shared living and find your perfect home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> {post.date}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary cursor-pointer">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" /> {post.author}
              </div>
              <Button variant="link" className="px-0">Read More →</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;