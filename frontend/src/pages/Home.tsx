
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart, Bell, ArrowRight, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/store';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - in a real app, you would connect to your API
    setTimeout(() => {
      if (email && password) {
        // Simulate successful login with complete user object matching the User type
        login('fake-token-123', {
          id: '1',
          name: 'Demo User',
          email: email,
          preferences: {
            defaultCurrency: 'USD',
            notifications: {
              email: true,
              telegram: false
            }
          }
        });
        
        toast({
          title: 'Login successful',
          description: 'Welcome to your portfolio dashboard!',
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: 'Please enter both email and password.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">Crypto Portfolio Tracker</h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Track your cryptocurrency investments, monitor performance, and analyze your portfolio allocation all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get Started
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl"></div>
                <div className="relative p-8 rounded-3xl bg-card border border-border/50 shadow-xl">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <PieChart className="w-32 h-32 text-primary/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="crypto-card p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">Portfolio Management</h2>
            <p className="text-muted-foreground">
              Create and manage multiple portfolios, add assets, and track their performance over time.
            </p>
          </div>

          <div className="crypto-card p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <PieChart size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">Portfolio Analysis</h2>
            <p className="text-muted-foreground">
              Visualize your portfolio allocation and gain insights through interactive charts and data.
            </p>
          </div>

          <div className="crypto-card p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">Price Alerts</h2>
            <p className="text-muted-foreground">
              Set up price alerts to notify you when cryptocurrencies reach your target prices.
            </p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div id="login-form" className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Login to Your Account</CardTitle>
              <CardDescription>
                Enter your credentials to access your portfolio
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Demo login: Use any email and password combination
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
