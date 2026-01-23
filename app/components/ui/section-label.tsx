import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SectionLabel = React.forwardRef<HTMLDivElement, SectionLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4 my-12', className)}
        {...props}
      >
        <hr className="flex-1 border-t border-border" />
        <span className="small-caps text-accent font-mono">
          {children}
        </span>
        <hr className="flex-1 border-t border-border" />
      </div>
    );
  }
);

SectionLabel.displayName = 'SectionLabel';

export { SectionLabel };
