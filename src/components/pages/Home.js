import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Brain,
  Gift,
  UserRound,
  ShoppingBag,
  ShieldCheck,
  PackageCheck,
  Star,
} from "lucide-react";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user, loading } = useAuth();

  const getQuestionnaireLink = () => {
    if (!loading && user) return "/questionnaire";
    return "/guest-access";
  };

  const howItWorksSteps = [
    {
      id: 1,
      title: "Share Recipient Details",
      description: "Tell us the occasion, age group, gender, and relationship.",
      icon: UserRound,
    },
    {
      id: 2,
      title: "GiftPilot Finds the Match",
      description: "Our system studies preferences, personality, and budget.",
      icon: Brain,
    },
    {
      id: 3,
      title: "Build the Basket",
      description: "Get a personalized basket with suitable gift items.",
      icon: Gift,
    },
  ];

  const featureCards = [
    {
      id: 1,
      icon: Brain,
      title: "AI-Based Recommendations",
      description:
        "Gift ideas are selected using recipient preferences, occasion, and personality traits.",
    },
    {
      id: 2,
      icon: Heart,
      title: "Personalized Experience",
      description:
        "Every basket is designed to feel thoughtful, relevant, and meaningful.",
    },
    {
      id: 3,
      icon: PackageCheck,
      title: "Ready-to-Gift Baskets",
      description:
        "Users can view complete basket ideas with packaging and included items.",
    },
    {
      id: 4,
      icon: ShieldCheck,
      title: "Simple & Secure",
      description:
        "Guest users can explore, while checkout stays protected through login.",
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50 text-gray-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-4 py-20 sm:py-24">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl" />
        <div className="absolute top-20 -right-24 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-300/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[75vh]">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-rose-200 mb-6">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium text-rose-900">
                Basketries GiftPilot
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-rose-950 mb-6 leading-tight">
              Find Thoughtful Gifts with our GiftPilot
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Basketries helps users discover personalized gift basket ideas
              based on recipient details, occasion, personality, and budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={getQuestionnaireLink()}
                className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-rose-700 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Start GiftPilot
                <Sparkles className="w-5 h-5" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-rose-700 px-8 py-4 rounded-2xl hover:bg-rose-50 transition-all shadow-md border border-rose-300"
              >
                Browse Collection
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
              <div className="bg-white/70 border border-white rounded-2xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-rose-900">AI</p>
                <p className="text-xs text-gray-600">Powered</p>
              </div>

              <div className="bg-white/70 border border-white rounded-2xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-rose-900">COD</p>
                <p className="text-xs text-gray-600">Checkout</p>
              </div>

              <div className="bg-white/70 border border-white rounded-2xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-rose-900">Guest</p>
                <p className="text-xs text-gray-600">Access</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/65 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl p-5 sm:p-7">
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-[1.5rem] p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm opacity-90">Personalized Basket</p>
                    <h3 className="text-2xl font-bold">GiftPilot Match</h3>
                  </div>

                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-2xl p-4">
                    <Heart className="w-5 h-5 mb-3" />
                    <p className="font-semibold">Occasion Based</p>
                    <p className="text-xs opacity-90 mt-1">
                      Birthday, wedding, anniversary, and more.
                    </p>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-4">
                    <Brain className="w-5 h-5 mb-3" />
                    <p className="font-semibold">Smart Matching</p>
                    <p className="text-xs opacity-90 mt-1">
                      Personality and preference analysis.
                    </p>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-4">
                    <PackageCheck className="w-5 h-5 mb-3" />
                    <p className="font-semibold">Basket Preview</p>
                    <p className="text-xs opacity-90 mt-1">
                      See included items before checkout.
                    </p>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-4">
                    <Star className="w-5 h-5 mb-3" />
                    <p className="font-semibold">Curated Ideas</p>
                    <p className="text-xs opacity-90 mt-1">
                      Useful, creative, and thoughtful gifts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white border border-rose-200 rounded-2xl shadow-xl p-4 max-w-[220px]">
                <p className="text-sm font-semibold text-rose-900">
                  Recommendation Ready
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Based on budget, relationship, and recipient profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-rose-600 font-semibold mb-2">
              Simple Process
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-4">
              How Basketries GiftPilot Works
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple questionnaire turns recipient preferences into
              personalized gift basket recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="relative bg-gradient-to-br from-white to-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-rose-100 text-rose-700 text-sm font-bold flex items-center justify-center">
                    {step.id}
                  </div>

                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-rose-600" />
                  </div>

                  <h3 className="font-bold text-rose-900 mb-3 text-xl">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-rose-600 font-semibold mb-2">
              Why Choose Us
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-rose-900">
              Designed for Thoughtful Gifting
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.id}
                  className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-rose-600" />
                  </div>

                  <h3 className="text-lg font-bold text-rose-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mb-6">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Build a Personalized Gift Basket?
          </h2>

          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start the questionnaire and let our GiftPilot recommend a thoughtful
            basket according to your selected preferences.
          </p>

          <Link
            to={getQuestionnaireLink()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-rose-600 px-10 py-4 rounded-2xl hover:bg-rose-50 hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg font-semibold"
          >
            Start GiftPilot
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;