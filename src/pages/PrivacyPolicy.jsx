import React from 'react';
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">
          Your privacy is important to us. Learn how we protect and use your information.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Our Commitment</h2>
          <p className="text-blue-800">
            At Cremson Publications, we are committed to protecting your privacy and ensuring the security
            of your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Database className="w-6 h-6 mr-2 text-blue-600" />
            1. Information We Collect
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 mb-3">We may collect the following personal information:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Account credentials and preferences</li>
                  <li>Educational background and interests (optional)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Automatically Collected Information</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 mb-3">We automatically collect certain information when you visit our website:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referral sources and search terms</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Eye className="w-6 h-6 mr-2 text-blue-600" />
            2. How We Use Your Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Primary Uses</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support</li>
                <li>• Send order confirmations and updates</li>
                <li>• Manage your account and preferences</li>
                <li>• Improve our products and services</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Secondary Uses</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Send promotional emails (with consent)</li>
                <li>• Analyze website usage and trends</li>
                <li>• Prevent fraud and enhance security</li>
                <li>• Comply with legal obligations</li>
                <li>• Personalize your experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            3. Information Sharing and Disclosure
          </h2>

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">We DO NOT Sell Your Information</h3>
              <p className="text-red-800 text-sm">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Limited Sharing</h3>
              <p className="text-gray-600 mb-3">We may share your information only in these situations:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our business (payment processors, shipping companies, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>Safety and Security:</strong> To protect rights, property, or safety of our users</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-2 text-blue-600" />
            4. Data Security
          </h2>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Security Measures</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• SSL encryption for all data transmission</li>
                <li>• Secure payment processing through certified providers</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and authentication protocols</li>
                <li>• Encrypted data storage</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> While we implement strong security measures, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Essential Cookies</h4>
                  <p className="text-blue-800 text-sm">Required for website functionality and security</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Analytics Cookies</h4>
                  <p className="text-green-800 text-sm">Help us understand how visitors use our website</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Preference Cookies</h4>
                  <p className="text-purple-800 text-sm">Remember your settings and preferences</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Marketing Cookies</h4>
                  <p className="text-orange-800 text-sm">Used to deliver relevant advertisements</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Management</h3>
              <p className="text-gray-600 text-sm">
                You can control cookies through your browser settings. Note that disabling cookies may
                affect website functionality and your user experience.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">You Have the Right To:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• <strong>Access:</strong> Request a copy of your personal information</li>
              <li>• <strong>Update:</strong> Correct any inaccurate or incomplete information</li>
              <li>• <strong>Delete:</strong> Request deletion of your personal information</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li>• <strong>Data Portability:</strong> Request your data in a portable format</li>
              <li>• <strong>Object:</strong> Object to certain processing of your information</li>
            </ul>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              We retain your personal information only as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Provide our services and support your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our products and services</li>
            </ul>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                <strong>Typical Retention Periods:</strong><br/>
                • Account information: Until account deletion<br/>
                • Order history: 7 years for tax/legal compliance<br/>
                • Marketing data: Until you unsubscribe<br/>
                • Website analytics: 26 months
              </p>
            </div>
          </div>
        </section>

        {/* International Users */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-600" />
            8. International Users
          </h2>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-orange-800 text-sm">
              Our services are operated from India. If you are accessing our services from outside India,
              please note that your information may be transferred to, stored, and processed in India.
              By using our services, you consent to such transfer and processing.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 text-sm">
              Our services are not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian and
              believe your child has provided us with personal information, please contact us immediately.
            </p>
          </div>
        </section>

        {/* Updates to Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Updates to This Policy</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 text-sm">
              We may update this Privacy Policy from time to time to reflect changes in our practices
              or for legal, operational, or regulatory reasons. We will notify you of any material
              changes by posting the updated policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 mb-4">
              If you have questions about this Privacy Policy or want to exercise your privacy rights:
            </p>
            <div className="space-y-2 text-green-700">
              <p><strong>Email:</strong> privacy@cremsonpublications.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> Cremson Publications, Tirunelveli, Tamil Nadu, India</p>
              <p><strong>Data Protection Officer:</strong> dpo@cremsonpublications.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;