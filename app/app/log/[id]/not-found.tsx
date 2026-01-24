import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, List } from 'lucide-react';

export default function LogNotFound() {
  return (
    <div className="container mx-auto px-6 py-32">
      <div className="max-w-2xl mx-auto text-center">
        <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground opacity-50 mb-8" />

        <h1 className="text-5xl font-display font-bold mb-4">Log Not Found</h1>

        <p className="text-xl text-muted-foreground mb-8">
          The log you're looking for doesn't exist or may have been deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/dashboard">
              <List className="mr-2 h-5 w-5" />
              View All Logs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
