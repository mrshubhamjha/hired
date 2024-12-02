import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user, isLoaded, isSignedIn } = useUser(); // Get user data and loading state

  useEffect(() => {
    if (search.get('sign-in')) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-4 px-8 flex justify-between items-center mt-6">
        <Link to="/">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Onboard
          </h1>


        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)} aria-label="Login">
              Login
            </Button>
          </SignedOut>

          {/* Render SignedIn state only if Clerk is fully loaded */}
          {isLoaded && (
            <SignedIn>
              {/* Temporarily remove role check to render the button */}
              {user?.unsafeMetadata?.role==='recruiter' && (
                <Link to="/post-job">
                  <Button variant="destructive" className="rounded-full">
                    <PenBox size={20} className="mr-2" />
                    Post a Job
                  </Button>
                </Link>
              )}

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-job"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          )}
        </div>
      </nav>

      {showSignIn && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={handleOverlayClick}
          >
            {/* Modal */}
            <div className="z-50">
              <SignIn
                signUpForceRedirectUrl="/onboarding"
                fallbackRedirectUrl="/onboarding"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
