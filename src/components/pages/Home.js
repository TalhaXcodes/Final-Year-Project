import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Brain, Gift } from "lucide-react";
import Footer from "../Footer";

const Home = () => {
  return (
    <div className="bg-rose-50 min-h-screen text-gray-700">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-rose-200 mb-6 justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-sm text-rose-900">AI-Powered Personalized Gifting</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-900 mb-6">
            Find the Perfect Gift<br />with AI Magic
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Answer a few questions and let our AI recommend personalized gift baskets that your loved ones will cherish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/questionnaire"
              className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-xl hover:bg-rose-700 transition-colors shadow-md"
            >
              Start AI Gift Finder
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors shadow-md border border-rose-300"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-4 text-center">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our AI-powered platform makes gift giving effortless and meaningful
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-rose-300 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-rose-900 mb-2 text-xl">1. Answer Questions</h3>
              <p className="text-gray-600">
                Tell us about your recipient, occasion, and preferences through our simple questionnaire
              </p>
            </div>
            <div className="bg-white border border-rose-300 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-rose-900 mb-2 text-xl">2. Get AI Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your answers and curates personalized gift options with match scores
              </p>
            </div>
            <div className="bg-white border border-rose-300 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-rose-900 mb-2 text-xl">3. Order & Delight</h3>
              <p className="text-gray-600">
                Choose your perfect gift and we'll deliver it beautifully packaged to your recipient
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-6">
                Why Choose BASKETRIES?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-900 mb-1">AI-Powered Matching</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced algorithms ensure every recommendation is perfectly tailored
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-900 mb-1">Curated Collections</h3>
                    <p className="text-gray-600 text-sm">
                      Hand-picked premium items from trusted brands and artisans
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-900 mb-1">Beautiful Presentation</h3>
                    <p className="text-gray-600 text-sm">
                      Every gift arrives elegantly packaged and ready to impress
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-rose-300 rounded-xl p-8 shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-rose-200 to-pink-200 rounded-xl flex items-center justify-center">
                <Gift className="w-32 h-32 text-rose-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Find the Perfect Gift?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Let our AI help you discover thoughtful, personalized gifts in minutes
          </p>
          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors shadow-lg justify-center"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;