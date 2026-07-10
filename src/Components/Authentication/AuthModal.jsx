import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useDispatch } from 'react-redux';
import { clearError } from '../../Redux/Slices/AuthSlice';
import Login from '../../Pages/Customer/Login';
import Signup from '../../Pages/Customer/Signup';

const AuthModal = () => {
  const { isOpen, mode, setMode, close } = useAuthModal();
  const cardRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      close();
    }
  };

  const handleModeSwitch = (newMode) => {
    dispatch(clearError()); 
    setMode(newMode);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[480px] bg-[#fbfbfb] dark:bg-[#0a0f2e] rounded-[12px] shadow-2xl p-8 lg:p-10 my-auto"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-[36px] h-[36px] flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
        >
          <X size={18} className="text-brand-dark dark:text-white" />
        </button>

        {mode === 'login' ? (
          <Login embedded onSuccess={close} />
        ) : (
          <Signup embedded onSuccess={close} />
        )}

        <p className="text-[14px] text-center text-black/70 dark:text-white/70 mt-6">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => handleModeSwitch('signup')}
                className="text-[#fc8a06] font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => handleModeSwitch('login')}
                className="text-[#fc8a06] font-semibold hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;