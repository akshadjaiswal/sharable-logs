import * as React from 'react';
import { cn } from '@/lib/utils';

export interface HorizontalRuleProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'default' | 'decorative' | 'offset';
}

const HorizontalRule = React.forwardRef<HTMLHRElement, HorizontalRuleProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    if (variant === 'decorative') {
      return (
        <div className={cn('relative my-12', className)}>
          <hr
            ref={ref}
            className="border-t border-border"
            {...props}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
            <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
          </div>
        </div>
      );
    }

    if (variant === 'offset') {
      return (
        <div className={cn('relative my-8', className)}>
          <hr
            ref={ref}
            className="border-t border-border"
            {...props}
          />
          <div className="absolute left-0 top-0 h-px w-24 bg-accent transform translate-y-2"></div>
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn('border-t border-border my-8', className)}
        {...props}
      />
    );
  }
);

HorizontalRule.displayName = 'HorizontalRule';

export { HorizontalRule };
