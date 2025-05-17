import React from 'react';
import Logo from '../atoms/Logo';
import Button from '../atoms/Button';

interface NavbarProps {
  username?: string;
  userRole?: 'admin' | 'tech_lead' | 'team_member';
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username = 'User', userRole, onLogout }) => {
  return (
    <nav className='bg-white border-b border-gray-200 shadow-sm'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex flex-shrink-0 items-center'>
              <Logo />
            </div>

            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {/* Analytics tab is visible to admin and tech_lead */}
              {(userRole === 'admin' || userRole === 'tech_lead') && (
                <a
                  href='/analytics'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                >
                  Analytics
                </a>
              )}

              {/* Create Kudos tab is visible to admin and tech_lead */}
              {(userRole === 'admin' || userRole === 'tech_lead') && (
                <a
                  href='/create-kudos'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                >
                  Create Kudos
                </a>
              )}

              {/* Team Members tab is visible only to admin */}
              {userRole === 'admin' && (
                <a
                  href='/team-members'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                >
                  Team Members
                </a>
              )}

              {/* Tech Leads tab is visible only to admin */}
              {userRole === 'admin' && (
                <a
                  href='/tech-leads'
                  className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                >
                  Tech Leads
                </a>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            <button type='button' className='p-1 rounded-full text-gray-400 hover:text-gray-500'>
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
                <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700'>
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className='ml-2 text-sm font-medium text-gray-700'>{username}</span>
              </div>

              <div className='ml-4'>
                <Button variant='secondary' size='sm' onClick={onLogout}>
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
