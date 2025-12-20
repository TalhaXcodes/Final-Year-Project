import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-700">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-rose-700 mb-4 sm:mb-6">
          AI-Powered Personalized Gift Recommendations
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          BASKETRIES is our final year project that uses artificial intelligence to recommend personalized gifts based on user preferences, personality traits, and behavioral patterns.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link
            to="/questionnaire"
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 text-base sm:text-lg rounded-lg font-medium shadow-md transition"
          >
            Fill Questionnaire
          </Link>
          <Link
            to="/about"
            className="border border-rose-300 hover:border-rose-400 px-6 py-3 rounded-lg transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-rose-700 mb-8 sm:mb-12 text-center">
          Key Features
        </h2>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-rose-600 mb-3">Personalized Recommendations</h3>
            <p>AI models recommend gifts based on user preferences and personality traits.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-rose-600 mb-3">Intelligent Questionnaire</h3>
            <p>Structured questions collect meaningful data to understand user interests and gifting intent.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-rose-600 mb-3">Data-Driven Insights</h3>
            <p>Collected responses are cleaned and processed to train the recommendation models for improved accuracy.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-rose-700 mb-3 sm:mb-4">Contribute to Our Research</h2>
        <p className="text-gray-700 mb-8">
          Help us improve our AI model by participating in the questionnaire.
        </p>
        <Link
          to="/questionnaire"
          className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-md transition"
        >
          Start Questionnaire
        </Link>
      </section>

    </div>
  );
};

export default Home;
