import { RecommendationForm } from '@/components/recommendation-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Background mountain SVG pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="mountains" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M0 150 L50 100 L100 150 L150 80 L200 150 Z" fill="currentColor" className="text-slate-900"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#mountains)" />
        </svg>
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Snowboard Advisor
          </h1>
          <p className="text-slate-600 text-lg">AI-powered gear recommendations for your riding style</p>
        </div>

        {/* Form */}
        <RecommendationForm />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Powered by AI and expert snowboard knowledge</p>
        </footer>
      </main>
    </div>
  );
}
