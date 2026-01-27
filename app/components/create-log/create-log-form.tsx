'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const createLogSchema = z.object({
  content: z.string().min(1, 'Log content is required').max(100000, 'Log content is too large (max 100,000 characters)'),
});

type CreateLogFormData = z.infer<typeof createLogSchema>;

export interface CreateLogFormProps {
  onSuccess?: (logId: string, url: string) => void;
}

export function CreateLogForm({ onSuccess }: CreateLogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateLogFormData>({
    resolver: zodResolver(createLogSchema),
    defaultValues: {
      content: '',
    },
  });

  const content = watch('content');
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  const onSubmit = async (data: CreateLogFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/logs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create log');
      }

      const result = await response.json();

      toast.success('Log created successfully!');

      if (onSuccess) {
        onSuccess(result.id, result.url);
      } else {
        // Default: redirect to log viewer
        router.push(`/log/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating log:', error);
      toast.error('Failed to create log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async (data: CreateLogFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/logs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create log');
      }

      const result = await response.json();

      // Copy URL to clipboard
      await navigator.clipboard.writeText(result.url);

      toast.success('Log created and link copied to clipboard!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating log:', error);
      toast.error('Failed to create log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Main Textarea */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Log Content
        </label>
        <Textarea
          id="content"
          {...register('content')}
          ref={(e) => {
            register('content').ref(e);
            (textareaRef as any).current = e;
          }}
          placeholder="Paste your terminal output here...

Example:
npm run dev
next dev
▲ Next.js 15.0.0
- Local: http://localhost:3000
✓ Ready in 2.1s"
          className="min-h-[400px] font-mono text-sm resize-y"
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
        )}

        {/* Character and Line Count */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
            <span>{charCount.toLocaleString()} {charCount === 1 ? 'character' : 'characters'}</span>
          </div>
          {charCount > 90000 && (
            <span className="text-yellow-600">
              Approaching character limit ({Math.round((charCount / 100000) * 100)}%)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || charCount === 0}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create & View Log'
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isSubmitting || charCount === 0}
          onClick={handleSubmit(handleCopyLink)}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create & Copy Link'
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={() => router.push('/dashboard')}
        >
          Cancel
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Tips:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Paste any terminal output, error logs, or command output</li>
          <li>Context will be auto-detected (Next.js, Python, Docker, etc.)</li>
          <li>Sensitive data (API keys, passwords, emails) will be automatically redacted</li>
          <li>Syntax highlighting will be applied based on detected context</li>
        </ul>
      </div>
    </form>
  );
}
