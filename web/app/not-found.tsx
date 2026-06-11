import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary-600 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-dark-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
