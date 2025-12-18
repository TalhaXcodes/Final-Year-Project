const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-700 p-6 max-w-7xl mx-auto">

      <h1 className="text-4xl font-bold text-rose-700 mb-8 text-center">Contact Us</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-rose-600 mb-4">Get in Touch</h2>
        <p className="mb-4">For queries, suggestions, or feedback regarding BASKETRIES, you can contact us using the form below:</p>

        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-2 rounded-md border border-rose-300 focus:ring-2 focus:ring-rose-400"/>
          <input type="email" placeholder="Your Email" className="w-full p-2 rounded-md border border-rose-300 focus:ring-2 focus:ring-rose-400"/>
          <textarea placeholder="Your Message" className="w-full p-2 rounded-md border border-rose-300 focus:ring-2 focus:ring-rose-400"></textarea>
          <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-md shadow-md transition">
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
};

export default Contact;
