import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomePage from '../features/kudos/presentation/template/home';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // If authentication is still loading, wait
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    setIsPageLoading(false);
  }, [user, isLoading, router]);

  if (isLoading || isPageLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  return <HomePage userRole={user.role} />;
}
