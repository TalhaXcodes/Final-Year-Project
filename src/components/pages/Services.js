const Services = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-700 p-6 max-w-7xl mx-auto">

      <h1 className="text-4xl font-bold text-rose-700 mb-8 text-center">Services</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-rose-600 mb-3">Gift Recommendations</h2>
          <p>AI-powered suggestions based on user personality and preferences.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-rose-600 mb-3">Questionnaire Analysis</h2>
          <p>Structured questionnaire collects meaningful insights for better recommendations.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-rose-600 mb-3">Packaging Options</h2>
          <p>Users can select packaging styles that fit their gift aesthetic and occasion.</p>
        </div>
      </div>

    </div>
  );
};

export default Services;
