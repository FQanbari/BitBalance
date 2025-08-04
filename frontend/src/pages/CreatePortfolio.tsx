
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { portfolioApi } from '../lib/api';

const CreatePortfolio = () => {
    const navigate = useNavigate();
    const { toast } = useToast(); 
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter a portfolio name');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a portfolio name",
            });
            return;
        }

        setError('');
        setIsCreating(true);

        try {
         
            await portfolioApi.create({ name });
            toast({
                title: "Success",
                description: "Portfolio created successfully!",
            });
            setIsCreating(false);
            navigate('/portfolios');
        } catch (error) {
            setIsCreating(false);
            let errorMessage = "Failed to create portfolio. Please try again.";

    
            if (error.message.includes("CORS")) {
                errorMessage = "CORS error: Unable to connect to the server.";
            } else if (error.response?.status === 400) {
                errorMessage = "Invalid portfolio name.";
            } else if (error.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            }

            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
    };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/portfolios"
          className="text-muted-foreground mb-2 inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolios</span>
        </Link>
        <h1 className="text-3xl font-bold">Create Portfolio</h1>
        <p className="text-muted-foreground">Start tracking your crypto investments</p>
      </div>

      <div className="crypto-card mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Portfolio Name *
            </label>
            <input
              type="text"
              id="name"
              placeholder="My Crypto Portfolio"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Choose a descriptive name for your portfolio
            </p>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to="/portfolios"
              className="border-input bg-background inline-block rounded-md border px-4 py-2 hover:bg-accent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isCreating}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground",
                isCreating ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
              )}
            >
              {isCreating ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Creating...
                </>
              ) : (
                'Create Portfolio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolio;
