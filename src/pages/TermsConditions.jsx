import React from 'react';
import { FileText, Users, Shield, AlertTriangle } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FileText className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-xl text-gray-600">
          Please read these terms carefully before using our services
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Agreement to Terms</h2>
          <p className="text-purple-800">
            By accessing and using Cremson Publications website, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>
        </div>

        {/* Definitions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definitions</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <ul className="space-y-3 text-gray-600">
              <li><strong>"Company"</strong> refers to Cremson Publications</li>
              <li><strong>"Service"</strong> refers to our website, mobile applications, and educational materials</li>
              <li><strong>"User"</strong> refers to anyone who accesses or uses our services</li>
              <li><strong>"Content"</strong> refers to all materials, information, and resources available on our platform</li>
              <li><strong>"Products"</strong> refers to educational books, sample papers, and study materials</li>
            </ul>
          </div>
        </section>

        {/* Use of Service */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-600" />
            2. Use of Service
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Eligibility</h3>
              <p className="text-gray-600 mb-3">
                Our services are available to users who are:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>18 years or older, or minors with parental consent</li>
                <li>Capable of forming legally binding contracts</li>
                <li>Not prohibited from using our services under applicable law</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Acceptable Use</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-900 mb-2">You agree to:</h4>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
                  <li>Use our services for lawful purposes only</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Respect intellectual property rights</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">You agree NOT to:</h4>
                <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                  <li>Copy, distribute, or reproduce our content without permission</li>
                  <li>Use automated systems to access our services</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use our services to harm, threaten, or harass others</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Account Responsibilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Responsibilities</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Account Security</h3>
              <p className="text-gray-600 mb-2">You are responsible for:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Immediately notifying us of any unauthorized use</li>
                <li>Ensuring your contact information is current and accurate</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" />
            4. Intellectual Property Rights
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">4.1 Our Rights</h3>
              <p className="text-blue-800 text-sm">
                All content on our platform, including books, sample papers, text, images, logos, and software,
                is owned by Cremson Publications or our licensors and is protected by copyright, trademark,
                and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Limited License</h3>
              <p className="text-gray-600">
                We grant you a limited, non-exclusive, non-transferable license to access and use our
                services for personal, educational purposes only. This license does not include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                <li>The right to copy, modify, or distribute our content</li>
                <li>The right to create derivative works</li>
                <li>The right to reverse engineer our software</li>
                <li>Any commercial use without explicit permission</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Orders and Payments */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payments</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Order Acceptance</h3>
              <p className="text-gray-600">
                All orders are subject to acceptance and availability. We reserve the right to refuse
                or cancel any order for any reason, including but not limited to product availability,
                errors in pricing, or fraud detection.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Pricing and Payment</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                <li>Payment must be received in full before order processing</li>
                <li>We accept major credit cards, debit cards, and digital payment methods</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
            6. Disclaimer of Warranties
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 text-sm">
              Our services are provided "as is" and "as available" without any warranties of any kind,
              either express or implied. We do not warrant that our services will be uninterrupted,
              error-free, or completely secure. Your use of our services is at your own risk.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              To the maximum extent permitted by law, Cremson Publications shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Loss of profits, data, or other intangible losses</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from any content obtained through our services</li>
              <li>Damages resulting from service interruptions or delays</li>
            </ul>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Termination by Us</h3>
              <p className="text-gray-600">
                We may terminate or suspend your account and access to our services immediately,
                without prior notice, if you breach these terms or engage in prohibited activities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Effect of Termination</h3>
              <p className="text-gray-600">
                Upon termination, your right to use our services will cease immediately.
                Provisions that should survive termination will remain in effect.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction
              of the courts of Tamil Nadu, India.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              We reserve the right to modify these terms at any time. Changes will be posted on this page
              with an updated revision date. Your continued use of our services after such modifications
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-purple-800 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-purple-700">
              <p><strong>Email:</strong> legal@cremsonpublications.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> Cremson Publications, Tirunelveli, Tamil Nadu, India</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;