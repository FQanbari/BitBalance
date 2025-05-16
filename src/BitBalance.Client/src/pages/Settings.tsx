
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useSettingsStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { currency, setCurrency, theme, setTheme } = useSettingsStore();
  const [email, setEmail] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [telegramNotifications, setTelegramNotifications] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'BTC', label: 'Bitcoin (₿)' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application settings */}
          <div className="crypto-card">
            <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
            
            <div className="space-y-4">
              {/* Currency preference */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Default Currency
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currencies.map((currencyOption) => (
                    <button
                      key={currencyOption.value}
                      type="button"
                      onClick={() => setCurrency(currencyOption.value)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 border rounded-md",
                        currency === currencyOption.value
                          ? "border-primary bg-primary/5"
                          : "border-input bg-background hover:bg-accent"
                      )}
                    >
                      <span>{currencyOption.label}</span>
                      {currency === currencyOption.value && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Theme preference */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      type="button"
                      onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'system')}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 border rounded-md",
                        theme === themeOption.value
                          ? "border-primary bg-primary/5"
                          : "border-input bg-background hover:bg-accent"
                      )}
                    >
                      <span>{themeOption.label}</span>
                      {theme === themeOption.value && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification settings */}
          <div className="crypto-card">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-4">
                {/* Email notifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Email Notifications
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        name="email-notifications"
                        id="email-notifications"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="email-notifications"
                        className={cn(
                          "block h-6 w-10 rounded-full cursor-pointer transition-colors",
                          emailNotifications ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "block h-4 w-4 mt-1 rounded-full bg-white shadow-md transform transition-transform",
                            emailNotifications ? "ml-5" : "ml-1"
                          )}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {emailNotifications && (
                    <div className="mt-3">
                      <label htmlFor="email" className="block text-sm text-muted-foreground mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-input px-3 py-2 bg-background"
                        placeholder="your@email.com"
                      />
                    </div>
                  )}
                </div>
                
                {/* Telegram notifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Telegram Notifications
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        name="telegram-notifications"
                        id="telegram-notifications"
                        checked={telegramNotifications}
                        onChange={() => setTelegramNotifications(!telegramNotifications)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="telegram-notifications"
                        className={cn(
                          "block h-6 w-10 rounded-full cursor-pointer transition-colors",
                          telegramNotifications ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "block h-4 w-4 mt-1 rounded-full bg-white shadow-md transform transition-transform",
                            telegramNotifications ? "ml-5" : "ml-1"
                          )}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {telegramNotifications && (
                    <div className="mt-3">
                      <label htmlFor="telegram" className="block text-sm text-muted-foreground mb-1">
                        Telegram Username
                      </label>
                      <input
                        type="text"
                        id="telegram"
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        className="w-full rounded-md border border-input px-3 py-2 bg-background"
                        placeholder="@username"
                      />
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  >
                    Save Notification Settings
                  </button>
                  
                  {saveSuccess && (
                    <p className="mt-2 text-sm text-crypto-green flex items-center">
                      <Check size={16} className="mr-1" />
                      Settings saved successfully
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="crypto-card h-min">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground">Version</h3>
              <p className="font-medium">1.0.0</p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground">Last Updated</h3>
              <p className="font-medium">May 16, 2025</p>
            </div>
            
            <div className="pt-2">
              <a 
                href="#" 
                className="text-sm text-primary hover:underline"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
