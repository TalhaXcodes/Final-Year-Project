const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-700 px-4 py-6 sm:p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-rose-700 mb-4 sm:mb-6 text-center sm:text-left">About BASKETRIES</h1>

      <div className="space-y-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
          <h2 className="text-xl sm:text-2xl font-semibold text-rose-600 mb-2 sm:mb-3">Project Overview</h2>
          <p className="text-sm sm:text-base leading-relaxed">BASKETRIES is an AI-powered personalized gifting system designed to simplify gift selection based on user preferences and personality traits.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
          <h2 className="text-xl sm:text-2xl font-semibold text-rose-600 mb-2 sm:mb-3">Objectives</h2>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
            <li>Collect user preferences through an intelligent questionnaire</li>
            <li>Train AI models for accurate gift recommendations</li>
            <li>Provide a simple, elegant interface for users to select gifts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
