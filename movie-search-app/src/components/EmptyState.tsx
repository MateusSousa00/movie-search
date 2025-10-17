interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon}
      <p className="text-secondary text-lg mb-4">{message}</p>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
