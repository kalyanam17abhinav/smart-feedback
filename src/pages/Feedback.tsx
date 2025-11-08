import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback } from "@/lib/api";
import { Loader2, Smile, Meh, Frown, CheckCircle2 } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    sentiment: string;
    score: number;
    reasoning: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const userId = user && user.role !== 'guest' ? user.id : null;
      
      const { feedback, sentiment: sentimentResult } = await submitFeedback(feedbackText, userId);
      
      setResult({
        sentiment: sentimentResult.sentiment.toLowerCase(),
        score: sentimentResult.confidence,
        reasoning: `Detected ${sentimentResult.sentiment.toLowerCase()} sentiment using ${sentimentResult.method}`
      });
      
      toast({
        title: "Success!",
        description: "Your feedback has been analyzed and saved.",
      });

      // Clear form
      setTimeout(() => {
        setFeedbackText("");
        setCategory("");
        setResult(null);
      }, 5000);

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-12 w-12 text-success" />;
      case 'negative':
        return <Frown className="h-12 w-12 text-destructive" />;
      default:
        return <Meh className="h-12 w-12 text-neutral" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold">Submit Feedback</h1>
            <p className="text-muted-foreground">
              Share your thoughts and get instant sentiment analysis
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Feedback</CardTitle>
              <CardDescription>
                Tell us what you think. Lets analyze the sentiment of your feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="feature-request">Feature Request</SelectItem>
                      <SelectItem value="bug-report">Bug Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback *</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={6}
                    className="resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    {feedbackText.length} characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2f4375] hover:bg-[#2f4375]/90 text-white"
                  disabled={isSubmitting || !feedbackText.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>

              {result && (
                <div className="mt-8 rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Sentiment Analysis Result</h3>
                    {getSentimentIcon(result.sentiment)}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Sentiment: </span>
                      <span className={`text-lg font-bold capitalize ${getSentimentColor(result.sentiment)}`}>
                        {result.sentiment}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Confidence Score: </span>
                      <span className="text-lg font-semibold">
                        {(result.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    {result.reasoning && (
                      <div>
                        <span className="text-sm text-muted-foreground">Analysis: </span>
                        <p className="mt-1 text-sm">{result.reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;