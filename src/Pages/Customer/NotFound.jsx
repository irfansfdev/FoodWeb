import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">404</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-base text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
