import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Brain, Gift, UserRound } from "lucide-react";
import Footer from "../Footer";

const Home = () => {
  const howItWorksSteps = [
    {
      id: 1,
      title: "Enter Preferences",
      description: "Tell us about the person, occasion, and your budget.",
      icon: UserRound,
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Our model analyzes personality and context to find the best match.",
      icon: Brain,
    },
    {
      id: 3,
      title: "Get Recommendations",
      description: "Receive a curated gift basket tailored perfectly to your needs.",
      icon: Gift,
    },
  ];

  const featureCards = [
    {
      id: 1,
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Smart recommendations based on personality, occasion, and preferences.",
    },
    {
      id: 2,
      icon: Heart,
      title: "Personalized Gifting",
      description: "Every gift is tailored to the recipient for a meaningful experience.",
    },
    {
      id: 3,
      icon: Sparkles,
      title: "Unique & Creative Ideas",
      description: "Discover curated and thoughtful gift combinations you won’t find elsewhere.",
    },
    {
      id: 4,
      icon: Gift,
      title: "Complete Gift Baskets",
      description: "Get ready-to-gift basket ideas with perfect packaging suggestions.",
    },
  ];

  return (
    <div className="bg-rose-50 min-h-screen text-gray-700">

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50 px-4 py-20 sm:py-24 flex items-center">
        <div className="max-w-5xl mx-auto text-center w-full">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/50 bg-white/55 backdrop-blur-md shadow-xl px-6 py-10 sm:px-10 sm:py-14">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-rose-200 mb-6 justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="text-sm text-rose-900">Basketries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-rose-900 mb-6">
              Find the Perfect Gift, Every Time
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered personalized gift recommendations based on personality, relationship, and occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/predict"
                className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-rose-700 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Try Live Prediction
                <ArrowRight className="w-5 h-5" />
              </Link>
            <Link
              to="/questionnaire"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors shadow-md border border-rose-300"
            >
              Start AI Gift Finder
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors shadow-md border border-rose-300"
            >
              Browse Collection
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-4 text-center">
            How Basketries Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Three simple steps to get personalized gift recommendations instantly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="relative bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                    {step.id}
                  </div>
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-rose-900 mb-2 text-xl">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-12 text-center">
            Why Choose Basketries?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-rose-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.14),transparent_40%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Find the Perfect Gift?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let Basketries do the thinking for you. Get personalized gift recommendations in seconds.
          </p>
          <Link
            to="/predict"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-rose-600 px-10 py-4 rounded-2xl hover:bg-rose-50 hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg font-semibold"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;