'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Key, CheckCircle, Shield, Loader2 } from 'lucide-react';

interface ApiKeyFormProps {
  onSuccess?: () => void;
}

export function ApiKeyForm({ onSuccess }: ApiKeyFormProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [accountInfo, setAccountInfo] = useState<{
    accountName: string;
    permissions: string[];
  } | null>(null);

  // Fetch existing API key info on mount
  useEffect(() => {
    fetchApiKeyInfo();
  }, []);

  const fetchApiKeyInfo = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('/api/gw2/account');

      if (response.ok) {
        const data = await response.json();
        // API key exists and is valid
        setAccountInfo({
          accountName: data.account.name,
          permissions: data.permissions || [],
        });
      }
    } catch (error) {
      // No API key or error - this is fine
      console.log('No existing API key found');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/gw2/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate API key');
      }

      setAccountInfo({
        accountName: data.accountName,
        permissions: data.permissions,
      });

      showToast('success', 'API key validated and saved successfully!');
      setApiKey('');

      // Refresh to fetch full account info
      await fetchApiKeyInfo();

      if (onSuccess) onSuccess();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to validate API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass border border-primary-500/20 h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <Key className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">GW2 API Key</h2>
            <p className="text-sm text-gray-400">Connect your Guild Wars 2 account</p>
          </div>
        </div>

        {/* Loading State */}
        {isFetching && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
          </div>
        )}

        {/* Form */}
        {!isFetching && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              required
              disabled={isLoading}
              helperText="Get your API key from account.arena.net/applications"
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              {accountInfo ? 'Update API Key' : 'Validate & Save API Key'}
            </Button>
          </form>
        )}

        {/* Connected Account Info */}
        {accountInfo && (
          <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-primary-300">Connected Account</h3>
            </div>
            <p className="text-gray-200 font-medium mb-3">{accountInfo.accountName}</p>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary-400" />
                <p className="text-xs text-gray-400 font-medium">Permissions:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {accountInfo.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs bg-primary-500/20 border border-primary-500/30 text-primary-300 px-2 py-1 rounded"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
