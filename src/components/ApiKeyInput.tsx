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
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey);
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
            <DialogTitle>Enter Stability AI Key</DialogTitle>
            <DialogDescription>
              Provide your Stability AI key to generate Ghibli-style selfies
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Stability AI Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Stability AI key"
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
