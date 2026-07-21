import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // 
import { authStart, authSuccess, authFailure, clearError } from '../../Redux/Slices/AuthSlice';
import { loginUserAPI } from '../../api/AuthAPI';
import logo from '../../assets/HomeAssets/OrderUKLogo.png';

const Login = ({ embedded = false, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const apiResponse = await loginUserAPI(formData);
      
      if (apiResponse.token?.access) {
        localStorage.setItem("authToken", apiResponse.token.access);
      }

      const userData = apiResponse.data;
      const isAdmin = userData?.is_admin === true || String(userData?.is_admin).toLowerCase() === "true";
      
      localStorage.setItem("userRole", isAdmin ? "admin" : "customer");
      localStorage.setItem("authUser", JSON.stringify(userData));

      dispatch(authSuccess(apiResponse));

      // 👈 Success Toast
      toast.success(`Welcome back, ${userData?.first_name || userData?.name || 'User'}!`);

      if (isAdmin) {
        if (embedded && onSuccess) onSuccess();
        navigate('/admin/dashboard', { replace: true });
      } else {
        if (embedded && onSuccess) {
          onSuccess();
        } else {
          const origin = location.state?.from?.pathname || '/';
          navigate(origin, { replace: true });
        }
      }
    } catch (err) {
      dispatch(authFailure(err.message));
      
      // 👈 Error Toast
      toast.error(err.message || "Failed to log in.");
    }
  };

  const cardContent = (
    <div className={embedded ? "w-full" : "w-full max-w-[440px] bg-[#fbfbfb] dark:bg-[#0a0f2e] rounded-[12px] shadow-[5px_5px_14px_0px_rgba(0,0,0,0.15)] p-8 lg:p-10"}>
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-block dark:bg-white dark:rounded-[12px] dark:px-4 dark:py-2">
            <img src={logo} alt="Order UK Logo" className="w-[160px] h-auto object-contain" />
          </Link>
        </div>

        <h1 className="text-[26px] font-bold text-[#03081F] dark:text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-[14px] text-black/60 dark:text-white/60 text-center mb-6">
          Log in to continue ordering.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[14px] font-medium text-[#03081F] dark:text-white">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} className="h-[52px] w-full rounded-[12px] border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 px-5 text-[15px] text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:border-[#fc8a06] transition-colors" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[14px] font-medium text-[#03081F] dark:text-white">Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="h-[52px] w-full rounded-[12px] border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 px-5 text-[15px] text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:border-[#fc8a06] transition-colors" />
          </div>

          <button type="submit" disabled={loading} className="h-[52px] w-full mt-2 rounded-full bg-[#fc8a06] disabled:bg-orange-300 text-white font-bold text-[16px] hover:bg-[#e07a00] active:scale-[0.98] transition-all shadow-md">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {!embedded && (
          <p className="text-[14px] text-center text-black/70 dark:text-white/70 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#fc8a06] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        )}
    </div>
  );

  if (embedded) return cardContent;

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-brand-dark transition-colors">
      {cardContent}
    </div>
  );
};

export default Login;