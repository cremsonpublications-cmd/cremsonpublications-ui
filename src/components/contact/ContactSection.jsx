import React from "react";
import {
  MapPin,
  Phone,
  Smartphone,
  Mail,
  Clock,
  Navigation,
} from "lucide-react";

const MapIframe = () => {
  return (
    <iframe
      title="Cremson Publications Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674920656613!2d77.243199!3d28.6489313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfdb930b05529%3A0xc91931c5625f55a3!2sCremson%20Publications%204578%2F15%2C%20Ansari%20Rd%20opp.%20Happy%20School%2C%20Daryaganj%20New%20Delhi%2C%20Delhi%2C%20110002!5e0!3m2!1sen!2sin!4v1750450282497!5m2!1sen!2sin"
      className="w-full h-full rounded-lg"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

const ContactSection = () => {
  const handleDirectionClick = () => {
    const mapsUrl =
      "https://www.google.com/maps/dir//Cremson+Publications+4578%2F15,+Ansari+Rd+opp.+Happy+School,+Daryaganj+New+Delhi,+Delhi,+110002/@28.6489313,77.243199,12z/data=!4m5!4m4!1m0!1m2!1m1!1s0x390cfdb930b05529:0xc91931c5625f55a3";
    window.open(mapsUrl, "_blank");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visit our office or contact us for any inquiries about our
            publications and educational materials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                CREMSON PUBLICATIONS
              </h3>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-2">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Address:
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      4578/15 (Basement), Aggarwal Road,
                      <br />
                      Opp. Happy School, Darya Ganj,
                      <br />
                      New Delhi – 110002
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      Phone (Landline):{" "}
                    </span>
                    <a
                      href="tel:011-4578594"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      011-4578594
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      Mobile:{" "}
                    </span>
                    <a
                      href="tel:+917982645175"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      +91 79826 45175
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      Email:{" "}
                    </span>
                    <a
                      href="mailto:info@cremsonpublications.com"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      info@cremsonpublications.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Working Hours:
                    </h4>
                    <p className="text-gray-700">
                      Monday - Saturday, 09:00 AM - 06:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-[500px] relative">
              <MapIframe />

              {/* Overlay Button
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleDirectionClick}
                  className="w-[60%] bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg border border-gray-200"
                >
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Open in Google Maps
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Additional Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
            <p className="text-gray-600 text-sm">Monday to Saturday</p>
            <p className="text-blue-600 font-medium">011-4578594</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
            <p className="text-gray-600 text-sm">Get in touch anytime</p>
            <p className="text-blue-600 font-medium">
              info@cremsonpublications.com
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
            <p className="text-gray-600 text-sm">Darya Ganj, New Delhi</p>
            <p className="text-blue-600 font-medium">110002</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
