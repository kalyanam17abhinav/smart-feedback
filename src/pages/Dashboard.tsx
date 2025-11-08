import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeedback, getAnalytics } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, MessageSquare, Smile, Meh, Frown } from "lucide-react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface AnalyticsData {
  total: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentPercentages: {
    positive: string;
    neutral: string;
    negative: string;
  };
  categoryDistribution: Record<string, number>;
  dailyTrends: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user || user.role === 'guest') {
        setAnalytics({
          total: 0,
          sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
          sentimentPercentages: { positive: '0', neutral: '0', negative: '0' },
          categoryDistribution: {},
          dailyTrends: []
        });
        setIsLoading(false);
        return;
      }

      const feedbackData = await getFeedback(user.id);

      const total = feedbackData?.length || 0;
      const sentimentCounts = {
        positive: feedbackData?.filter(f => f.sentiment === 'Positive').length || 0,
        neutral: feedbackData?.filter(f => f.sentiment === 'Neutral').length || 0,
        negative: feedbackData?.filter(f => f.sentiment === 'Negative').length || 0,
      };

      const sentimentPercentages = {
        positive: total > 0 ? ((sentimentCounts.positive / total) * 100).toFixed(1) : '0',
        neutral: total > 0 ? ((sentimentCounts.neutral / total) * 100).toFixed(1) : '0',
        negative: total > 0 ? ((sentimentCounts.negative / total) * 100).toFixed(1) : '0',
      };

      // Generate daily trends for last 7 days
      const dailyTrends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayData = feedbackData?.filter(f => 
          f.timestamp.startsWith(dateStr)
        ) || [];
        
        dailyTrends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          positive: dayData.filter(f => f.sentiment === 'Positive').length,
          neutral: dayData.filter(f => f.sentiment === 'Neutral').length,
          negative: dayData.filter(f => f.sentiment === 'Negative').length,
        });
      }

      setAnalytics({
        total,
        sentimentCounts,
        sentimentPercentages,
        categoryDistribution: {},
        dailyTrends
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  if (!analytics || analytics.total === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Your personal feedback sentiment analysis and trends
            </p>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No Feedback Yet</h3>
              <p className="text-muted-foreground mb-4">
                Submit your first feedback to see analytics and insights here.
              </p>
              <a href="/feedback" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Submit Feedback
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pieChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          analytics.sentimentCounts.positive,
          analytics.sentimentCounts.neutral,
          analytics.sentimentCounts.negative,
        ],
        backgroundColor: [
          'hsl(142, 76%, 36%)',
          'hsl(221, 83%, 53%)',
          'hsl(0, 84%, 60%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: analytics.dailyTrends.map((d) => d.date),
    datasets: [
      {
        label: 'Positive',
        data: analytics.dailyTrends.map((d) => d.positive),
        borderColor: 'hsl(142, 76%, 36%)',
        backgroundColor: 'hsl(142, 76%, 36%, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Neutral',
        data: analytics.dailyTrends.map((d) => d.neutral),
        borderColor: 'hsl(221, 83%, 53%)',
        backgroundColor: 'hsl(221, 83%, 53%, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Negative',
        data: analytics.dailyTrends.map((d) => d.negative),
        borderColor: 'hsl(0, 84%, 60%)',
        backgroundColor: 'hsl(0, 84%, 60%, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive feedback sentiment analysis and trends
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive</CardTitle>
              <Smile className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {analytics.sentimentPercentages.positive}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.sentimentCounts.positive} responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neutral</CardTitle>
              <Meh className="h-4 w-4 text-neutral" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral">
                {analytics.sentimentPercentages.neutral}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.sentimentCounts.neutral} responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negative</CardTitle>
              <Frown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {analytics.sentimentPercentages.negative}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.sentimentCounts.negative} responses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Overall sentiment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 sm:p-6">
              <div className="h-[250px] w-[250px] sm:h-[300px] sm:w-[300px]">
                <Pie data={pieChartData} options={{ maintainAspectRatio: true }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends</CardTitle>
              <CardDescription>Daily sentiment over time</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="h-[250px] sm:h-[300px]">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;