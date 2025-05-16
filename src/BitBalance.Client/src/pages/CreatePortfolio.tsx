
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a portfolio name');
      return;
    }
    
    setError('');
    setIsCreating(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsCreating(false);
      navigate('/portfolios');
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/portfolios"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolios</span>
        </Link>
        <h1 className="text-3xl font-bold">Create Portfolio</h1>
        <p className="text-muted-foreground">Start tracking your crypto investments</p>
      </div>

      <div className="crypto-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Portfolio Name *
            </label>
            <input
              type="text"
              id="name"
              placeholder="My Crypto Portfolio"
              className="w-full rounded-md border border-input px-3 py-2 bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choose a descriptive name for your portfolio
            </p>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to="/portfolios"
              className="inline-block rounded-md px-4 py-2 border border-input bg-background hover:bg-accent"
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
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
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
