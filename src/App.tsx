import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/query-client';
import Router from './router';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
