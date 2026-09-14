import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'info';
  className?: string;
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
  const variants = {
    default: 'bg-gray-800 border-gray-700 text-gray-300',
    destructive: 'bg-red-900/30 border-red-500 text-red-300',
    success: 'bg-green-900/30 border-green-500 text-green-300',
    info: 'bg-blue-900/30 border-blue-500 text-blue-300',
  };

  const icons = {
    default: null,
    destructive: <AlertCircle className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border p-4',
        variants[variant],
        className
      )}
      role="alert"
    >
      {icons[variant]}
      <div>{children}</div>
    </div>
  );
} 