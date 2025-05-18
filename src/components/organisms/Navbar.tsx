import React from 'react';
import Link from 'next/link';
import Logo from '../atoms/Logo';
import Button from '../atoms/Button';
import { useLogout } from '../../features/auth/presentation/hooks/useLogout';
import { UserRole } from '@/features/users/domain/entities/UserRole';

interface NavbarProps {
  username?: string;
  userRole?: UserRole;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, userRole, onLogout }) => {
  // Use the logout hook from the auth presentation layer
  const { logout } = useLogout();

  // Handle logout with the hook
  const handleLogout = () => {
    logout(onLogout);
  };

  return (
    <nav className='bg-[#0f766e] text-white shadow-md'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex flex-shrink-0 items-center'>
              <Logo />
            </div>

            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {/* Analytics tab is visible to all users */}
              <Link
                href='/analytics'
                className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-teal-100 hover:border-teal-300 hover:text-white'
              >
                Analytics
              </Link>

              {/* Create Kudos tab is visible to only tech_lead */}
              {userRole === UserRole.TECH_LEAD && (
                <Link
                  href='/create-kudos'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-teal-100 hover:border-teal-300 hover:text-white'
                >
                  Create Kudos
                </Link>
              )}

              {/* Team Members tab is visible only to admin */}
              {userRole === UserRole.ADMIN && (
                <Link
                  href='/team-members'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-teal-100 hover:border-teal-300 hover:text-white'
                >
                  Team Members
                </Link>
              )}

              {/* Tech Leads tab is visible only to admin */}
              {userRole === UserRole.ADMIN && (
                <Link
                  href='/tech-leads'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-teal-100 hover:border-teal-300 hover:text-white'
                >
                  Tech Leads
                </Link>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            <button type='button' className='p-1 rounded-full text-teal-200 hover:text-white'>
              <span className='sr-only'>View notifications</span>
              <svg
                className='h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                />
              </svg>
            </button>

            <div className='ml-3 relative flex items-center'>
              <div className='flex items-center'>
                <div className='h-8 w-8 rounded-full bg-teal-200 flex items-center justify-center text-sm font-medium text-teal-800'>
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span className='ml-2 text-sm font-medium text-white'>{username}</span>
              </div>

              <div className='ml-4'>
                <Button variant='secondary' size='sm' onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
