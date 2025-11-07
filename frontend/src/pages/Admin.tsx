import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Users, MessageSquare, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface FeedbackItem {
  id: string;
  user_id: string | null;
  message: string;
  sentiment: string;
  sentiment_score: number;
  timestamp: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    registered: 0,
    anonymous: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Access Denied",
        description: "Please sign in to access admin dashboard",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const userRole = session.user.user_metadata?.role;
    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchAllFeedback();
  };

  const fetchAllFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setFeedback(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const positive = data?.filter(f => f.sentiment === 'Positive').length || 0;
      const negative = data?.filter(f => f.sentiment === 'Negative').length || 0;
      const neutral = data?.filter(f => f.sentiment === 'Neutral').length || 0;
      const registered = data?.filter(f => f.user_id !== null).length || 0;
      const anonymous = data?.filter(f => f.user_id === null).length || 0;

      setStats({ total, positive, negative, neutral, registered, anonymous });
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      });

      fetchAllFeedback();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive",
      });
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800';
      case 'Negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and analyze all feedback submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negative</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neutral</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.registered}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.anonymous}</div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle>All Feedback</CardTitle>
            <CardDescription>Manage all feedback submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No feedback found</p>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getSentimentColor(item.sentiment)}>
                          {item.sentiment}
                        </Badge>
                        <Badge variant="outline">
                          {item.user_id ? 'Registered' : 'Anonymous'}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {format(new Date(item.timestamp), 'PPp')}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteFeedback(item.id)}
                        className="self-end sm:self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm break-words">{item.message}</p>
                    <div className="mt-2 text-xs text-muted-foreground break-all">
                      Score: {item.sentiment_score} | ID: {item.id.slice(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;