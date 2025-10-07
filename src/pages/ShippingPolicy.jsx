import React from 'react';
import { Truck, Clock, MapPin, Package, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Truck className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
        <p className="text-xl text-gray-600">
          Fast, reliable delivery for all your educational needs
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-2">Free Shipping</h2>
          <p className="text-green-800">
            We're excited to offer <strong>FREE SHIPPING</strong> on all orders across India!
            No minimum order value required.
          </p>
        </div>

        {/* Shipping Options */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-6 h-6 mr-2 text-green-600" />
            Shipping Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Standard Delivery
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Delivery Time:</strong> 5-7 business days</li>
                <li>• <strong>Cost:</strong> FREE</li>
                <li>• <strong>Coverage:</strong> All major cities and towns</li>
                <li>• <strong>Tracking:</strong> Available</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Express Delivery
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Delivery Time:</strong> 2-3 business days</li>
                <li>• <strong>Cost:</strong> Available on request</li>
                <li>• <strong>Coverage:</strong> Major metropolitan cities</li>
                <li>• <strong>Tracking:</strong> Real-time tracking</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Processing Time */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Processing Timeline</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Order Confirmation:</strong> Within 1 hour of payment</li>
              <li>• <strong>Processing Time:</strong> 1-2 business days</li>
              <li>• <strong>Dispatch Notification:</strong> Email with tracking details</li>
              <li>• <strong>Quality Check:</strong> All items inspected before shipping</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              <strong>Note:</strong> Orders placed after 3:00 PM on Friday will be processed on the next business day.
              Weekend and holiday orders will be processed on the following working day.
            </p>
          </div>
        </section>

        {/* Delivery Areas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            Delivery Coverage
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Domestic Shipping (India)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Zone 1 (Metro Cities)</h4>
                  <p className="text-sm text-green-800">Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune</p>
                  <p className="text-xs text-green-600 mt-1">3-5 business days</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Zone 2 (Major Cities)</h4>
                  <p className="text-sm text-blue-800">State capitals and major cities</p>
                  <p className="text-xs text-blue-600 mt-1">4-6 business days</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Zone 3 (Other Areas)</h4>
                  <p className="text-sm text-gray-800">Towns, villages, and remote areas</p>
                  <p className="text-xs text-gray-600 mt-1">6-8 business days</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">International Shipping</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">
                  International shipping is available for selected countries. Please contact our customer support
                  team for shipping rates and delivery timelines. Additional customs duties may apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Packaging */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Packaging & Handling</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Packaging Promise</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Eco-Friendly:</strong> Recyclable and biodegradable packaging materials</li>
                <li>• <strong>Secure Packaging:</strong> Books wrapped in protective materials</li>
                <li>• <strong>Weather Protection:</strong> Moisture-resistant packaging</li>
                <li>• <strong>Damage Prevention:</strong> Extra padding for fragile items</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tracking */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Track Your Order</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Tracking ID:</strong> Provided via email and SMS once shipped</li>
              <li>• <strong>Real-time Updates:</strong> Track your package journey</li>
              <li>• <strong>Delivery Alerts:</strong> Notifications before delivery</li>
              <li>• <strong>My Orders:</strong> Check status in your account dashboard</li>
            </ul>
          </div>
        </section>

        {/* Delivery Issues */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed Delivery Attempts</h3>
              <p className="text-gray-600 mb-2">
                If delivery fails due to incorrect address or recipient unavailability:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Our delivery partner will make up to 3 delivery attempts</li>
                <li>Package will be held at local facility for 7 days</li>
                <li>Customer will be notified via SMS and email</li>
                <li>Unclaimed packages will be returned to our warehouse</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Damaged or Lost Packages</h3>
              <p className="text-red-800 text-sm">
                If your package arrives damaged or gets lost in transit, please contact us within 48 hours
                of delivery date. We will arrange for a replacement or full refund as per our return policy.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Support</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 mb-4">
              Need help with your shipment or have questions about our shipping policy?
            </p>
            <div className="space-y-2 text-green-700">
              <p><strong>Email:</strong> shipping@cremsonpublications.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>WhatsApp:</strong> +91-9876543210</p>
              <p><strong>Support Hours:</strong> Monday to Saturday, 9:00 AM - 7:00 PM IST</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;