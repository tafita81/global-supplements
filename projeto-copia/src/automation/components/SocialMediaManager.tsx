import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Share2, Calendar, Send, Sparkles } from 'lucide-react';
import { socialMediaService } from '../services/socialMediaService';
import { SOCIAL_PLATFORMS } from '../types/analytics';
import type { SocialMediaPost } from '../types/analytics';

const NICHES = ['beauty', 'skincare', 'fitness', 'wellness', 'vitamins'];
const COUNTRIES = ['US', 'UK', 'DE', 'FR', 'CA', 'AU'];

export function SocialMediaManager() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [platform, setPlatform] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await socialMediaService.getPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    const niche = NICHES[Math.floor(Math.random() * NICHES.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const generatedContent = await socialMediaService.generatePostContent(niche, country, 'engaging');
    setContent(generatedContent);
    toast({
      title: 'Content Generated!',
      description: 'AI-powered content is ready'
    });
  };

  const handleCreate = async () => {
    if (!platform || !content) {
      toast({
        title: 'Validation Error',
        description: 'Please select platform and enter content',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      await socialMediaService.createPost({
        platform: platform as any,
        content,
        scheduled_date: scheduledDate || undefined,
        status: scheduledDate ? 'scheduled' : 'draft'
      });

      toast({
        title: 'Success!',
        description: 'Post created successfully'
      });

      setPlatform('');
      setContent('');
      setScheduledDate('');
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const publishPost = async (postId: string) => {
    try {
      await socialMediaService.publishPost(postId);
      toast({
        title: 'Published!',
        description: 'Post has been published'
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish post',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Create Social Media Post
          </CardTitle>
          <CardDescription>Schedule posts across multiple platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule Date (optional)</Label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Content</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={generateContent}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Content
              </Button>
            </div>
            <Textarea
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleCreate} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                {scheduledDate ? 'Schedule Post' : 'Save as Draft'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts yet</p>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {SOCIAL_PLATFORMS.find(p => p.id === post.platform)?.icon}
                        </span>
                        <span className="font-medium">
                          {SOCIAL_PLATFORMS.find(p => p.id === post.platform)?.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.content}</p>
                      {post.scheduled_date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Scheduled: {new Date(post.scheduled_date).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {post.status === 'draft' && (
                      <Button size="sm" onClick={() => publishPost(post.id)}>
                        <Send className="mr-1 h-3 w-3" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
