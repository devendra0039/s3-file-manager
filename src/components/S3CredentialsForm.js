'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from "sonner";

// Dummy S3 credentials for testing
const INNITIAL_CREDENTIALS = {
  accessKeyId: '',
  secretAccessKey: '',
  region: '',
  bucketName: ''
};
const S3CredentialsForm = ({onCredentialsChange}) => {
  const [credentials, setCredentials] = useState(INNITIAL_CREDENTIALS);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false); // Start with dummy credentials

  useEffect(() => {
    // Check if there are saved credentials, otherwise use dummy
    const savedCredentials = localStorage.getItem('s3-credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        setCredentials(parsed);
        setHasCredentials(true);
        onCredentialsChange(parsed);
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
        // Fallback to dummy credentials
        setCredentials(INNITIAL_CREDENTIALS);
        onCredentialsChange(INNITIAL_CREDENTIALS);
      }
    }
  }, [onCredentialsChange]);

  const handleSave = () => {
    if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.bucketName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Save to localStorage
    localStorage.setItem('s3-credentials', JSON.stringify(credentials));
    setHasCredentials(true);
    onCredentialsChange(credentials);
    setIsOpen(false);
    
    toast.success("Your S3 credentials have been saved locally");
  };

  const handleClear = () => {
    localStorage.removeItem('s3-credentials');
    setCredentials({
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
      bucketName: ''
    });
    setHasCredentials(false);
    onCredentialsChange(null);
    
    toast.success("Your S3 credentials have been removed");
    
  };

  return (
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={hasCredentials ? "border-green-500 text-green-600" : ""}
        >
          <Settings className="h-4 w-4 mr-2" />
          {hasCredentials ? 'S3 Connected' : 'Configure S3'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>S3 Credentials Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
            <p className="text-sm text-blue-700 mb-3">
              Dummy credentials are pre-loaded for testing. File operations will be simulated.
            </p>
            <Button
              onClick={handleLoadDummy}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              Load Demo Credentials
            </Button>
          </div> */}

          <div className="space-y-4">
            <div>
              <Label htmlFor="accessKeyId">Access Key ID *</Label>
              <Input
                id="accessKeyId"
                type="text"
                value={credentials.accessKeyId}
                onChange={(e) => setCredentials(prev => ({ ...prev, accessKeyId: e.target.value }))}
                placeholder="AKIA..."
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="secretAccessKey">Secret Access Key *</Label>
              <div className="relative">
                <Input
                  id="secretAccessKey"
                  type={showSecretKey ? "text" : "password"}
                  value={credentials.secretAccessKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                  placeholder="Enter your secret access key"
                  className="font-mono pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                type="text"
                value={credentials.region}
                onChange={(e) => setCredentials(prev => ({ ...prev, region: e.target.value }))}
                placeholder="us-east-1"
              />
            </div>

            <div>
              <Label htmlFor="bucketName">Bucket Name *</Label>
              <Input
                id="bucketName"
                type="text"
                value={credentials.bucketName}
                onChange={(e) => setCredentials(prev => ({ ...prev, bucketName: e.target.value }))}
                placeholder="my-bucket-name"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!hasCredentials}
            >
              Clear Credentials
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Credentials
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default S3CredentialsForm