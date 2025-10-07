import React from 'react';
import { DollarSign, Package, Truck, CreditCard } from 'lucide-react';

const PricingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <DollarSign className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Policy</h1>
        <p className="text-xl text-gray-600">
          Transparent pricing for all our educational materials
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Our Commitment</h2>
          <p className="text-blue-800">
            At Cremson Publications, we believe in fair and transparent pricing for quality educational content.
            All our prices are clearly displayed with no hidden charges.
          </p>
        </div>

        {/* Pricing Structure */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Pricing Structure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Papers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Class 1-5: ₹50 - ₹150 per set</li>
                <li>• Class 6-8: ₹100 - ₹250 per set</li>
                <li>• Class 9-10: ₹150 - ₹350 per set</li>
                <li>• Class 11-12: ₹200 - ₹450 per set</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Textbooks</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Class 1-5: ₹200 - ₹500 per book</li>
                <li>• Class 6-8: ₹300 - ₹700 per book</li>
                <li>• Class 9-10: ₹400 - ₹900 per book</li>
                <li>• Class 11-12: ₹500 - ₹1200 per book</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Discounts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Discounts & Offers</h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Available Discounts</h3>
            <ul className="space-y-2 text-green-800">
              <li>• <strong>Bulk Orders:</strong> 10% off on orders above ₹2000</li>
              <li>• <strong>Student Discount:</strong> 15% off with valid student ID</li>
              <li>• <strong>Early Bird:</strong> 20% off on pre-orders</li>
              <li>• <strong>Seasonal Sales:</strong> Up to 25% off during festive seasons</li>
            </ul>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
            Payment Terms
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accepted Payment Methods</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Credit Cards (Visa, MasterCard, American Express)</li>
                <li>Debit Cards</li>
                <li>UPI (PhonePe, Google Pay, Paytm)</li>
                <li>Net Banking</li>
                <li>Digital Wallets</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Security</h3>
              <p className="text-gray-600">
                All payments are processed through secure payment gateways with SSL encryption.
                We do not store your payment information on our servers.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Costs */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Truck className="w-6 h-6 mr-2 text-blue-600" />
            Shipping Costs
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Free Shipping:</strong> On all orders (Currently applicable)</li>
              <li>• <strong>Standard Delivery:</strong> 5-7 business days</li>
              <li>• <strong>Express Delivery:</strong> Available on request</li>
              <li>• <strong>International Shipping:</strong> Contact customer support</li>
            </ul>
          </div>
        </section>

        {/* Price Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Price Changes</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              <strong>Notice:</strong> Prices are subject to change without prior notice.
              However, any price changes will not affect orders already placed and confirmed.
              We recommend checking the current pricing before placing your order.
            </p>
          </div>
        </section>

        {/* Tax Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              All prices displayed on our website are inclusive of applicable taxes unless otherwise specified.
              GST will be calculated and displayed separately during checkout where applicable.
            </p>
            <p>
              <strong>GST Rate:</strong> Educational materials may be eligible for reduced GST rates as per government regulations.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Pricing?</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              If you have any questions about our pricing policy or need clarification on any charges,
              please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-blue-700">
              <p><strong>Email:</strong> pricing@cremsonpublications.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Hours:</strong> Monday to Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPolicy;