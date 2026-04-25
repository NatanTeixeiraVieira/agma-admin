import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps, toast } from 'sonner';
import { Icon } from '../icon';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <Icon name="CircleCheckIcon" className="size-4" />,
        info: <Icon name="InfoIcon" className="size-4" />,
        warning: <Icon name="TriangleAlertIcon" className="size-4" />,
        error: <Icon name="OctagonXIcon" className="size-4" />,
        loading: <Icon name="Loader2Icon" className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--color-popover)',
          '--normal-text': 'var(--color-popover-foreground)',
          '--normal-border': 'var(--color-border)',
          '--border-radius': 'var(--color-radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
