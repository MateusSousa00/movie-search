interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="text-center py-12">
      <div
        data-testid="spinner"
        className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary`}
      ></div>
      {message && <p>{message}</p>}
    </div>
  );
}
