import React from 'react';
import ContactSection from '../components/contact/ContactSection';

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help you with all your educational needs. Get in touch with us today!
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
};

export default ContactPage;
