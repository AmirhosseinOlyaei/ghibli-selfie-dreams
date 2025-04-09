
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string, provider: 'stability' | 'leonardo') => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'stability' | 'leonardo'>('stability');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey, provider);
      setOpen(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="text-sm"
      >
        Use your own API key
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="ghibli-card">
          <DialogHeader>
            <DialogTitle>Enter API Key</DialogTitle>
            <DialogDescription>
              Provide your own API key to generate Ghibli-style selfies
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Select Provider</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={provider === 'stability' ? 'default' : 'outline'}
                  onClick={() => setProvider('stability')}
                  className={provider === 'stability' ? 'bg-ghibli-blue text-foreground' : ''}
                >
                  Stability AI
                </Button>
                <Button
                  type="button"
                  variant={provider === 'leonardo' ? 'default' : 'outline'}
                  onClick={() => setProvider('leonardo')}
                  className={provider === 'leonardo' ? 'bg-ghibli-blue text-foreground' : ''}
                >
                  Leonardo AI
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="ghibli-input"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ghibli-button">
                Save API Key
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeyInput;
