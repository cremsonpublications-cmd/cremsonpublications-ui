import React from 'react';
import { RotateCcw, DollarSign, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const CancellationRefund = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <RotateCcw className="w-12 h-12 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation & Refund Policy</h1>
        <p className="text-xl text-gray-600">
          Understanding your rights for order cancellations and refunds
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-orange-900 mb-2">Our Promise</h2>
          <p className="text-orange-800">
            We want you to be completely satisfied with your purchase. This policy outlines your options
            for cancellations and refunds to ensure a fair and transparent process.
          </p>
        </div>

        {/* Order Cancellation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <XCircle className="w-6 h-6 mr-2 text-red-600" />
            1. Order Cancellation
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Cancellation Time Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-900">Before Processing</h4>
                  </div>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>Within 1 hour:</strong> Free cancellation</li>
                    <li>• <strong>Before dispatch:</strong> Full refund</li>
                    <li>• <strong>No questions asked:</strong> Easy online cancellation</li>
                    <li>• <strong>Instant confirmation:</strong> Email notification</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-900">After Processing</h4>
                  </div>
                  <ul className="space-y-2 text-yellow-800 text-sm">
                    <li>• <strong>After dispatch:</strong> Return required</li>
                    <li>• <strong>In transit:</strong> Contact customer support</li>
                    <li>• <strong>Delivered:</strong> Return policy applies</li>
                    <li>• <strong>Processing time:</strong> 3-5 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 How to Cancel</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">Cancellation Methods:</h4>
                <ol className="list-decimal list-inside text-blue-800 space-y-2 text-sm">
                  <li><strong>Online:</strong> Log into your account and cancel from "My Orders"</li>
                  <li><strong>Phone:</strong> Call our customer support at +91-9876543210</li>
                  <li><strong>Email:</strong> Send cancellation request to orders@cremsonpublications.com</li>
                  <li><strong>WhatsApp:</strong> Message us at +91-9876543210</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <RotateCcw className="w-6 h-6 mr-2 text-orange-600" />
            2. Return Policy
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Return Eligibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-3">✅ Eligible for Return</h4>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Books in original condition</li>
                    <li>• Unused and unmarked items</li>
                    <li>• Items with original packaging</li>
                    <li>• Defective or damaged products</li>
                    <li>• Wrong item delivered</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-medium text-red-900 mb-3">❌ Not Eligible for Return</h4>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Used or marked books</li>
                    <li>• Damaged due to misuse</li>
                    <li>• Items without original packaging</li>
                    <li>• Digital products (if any)</li>
                    <li>• Books returned after 7 days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Return Process</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Request Return</h4>
                    <p className="text-xs text-gray-600">Within 7 days of delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Get Approval</h4>
                    <p className="text-xs text-gray-600">We'll review and approve</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Ship Back</h4>
                    <p className="text-xs text-gray-600">Use provided return label</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">4</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Get Refund</h4>
                    <p className="text-xs text-gray-600">Within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            3. Refund Policy
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Refund Timeline</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Order Cancellation</h4>
                    <p className="text-green-800 text-sm">
                      <strong>1-3 business days</strong><br/>
                      For orders cancelled before processing
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Product Return</h4>
                    <p className="text-green-800 text-sm">
                      <strong>5-7 business days</strong><br/>
                      After we receive the returned item
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Quality Issues</h4>
                    <p className="text-green-800 text-sm">
                      <strong>2-4 business days</strong><br/>
                      For defective or damaged items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Refund Methods</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Original Payment Method</h4>
                  <p className="text-blue-800 text-sm">
                    Refunds will be processed to your original payment method (credit card, debit card, UPI, etc.)
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Bank Transfer (If Required)</h4>
                  <p className="text-purple-800 text-sm">
                    In some cases, we may process refunds via bank transfer. Additional verification may be required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Circumstances */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-yellow-600" />
            4. Special Circumstances
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Defective Products</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 mb-3">
                  If you receive a defective or damaged product:
                </p>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                  <li>Contact us immediately with photos of the damage</li>
                  <li>We'll arrange for immediate replacement or full refund</li>
                  <li>No return shipping charges for defective items</li>
                  <li>Priority processing within 24-48 hours</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Wrong Item Delivered</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-800 mb-3">
                  If you receive the wrong item:
                </p>
                <ul className="list-disc list-inside text-orange-800 space-y-1 text-sm">
                  <li>We'll arrange pickup of the wrong item at no cost</li>
                  <li>Correct item will be dispatched immediately</li>
                  <li>Full refund if correct item is unavailable</li>
                  <li>Expedited shipping for replacement</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Partial Orders</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-3">
                  For orders with multiple items where only some items are cancelled/returned:
                </p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                  <li>Partial refunds will be processed for cancelled items</li>
                  <li>Shipping charges will be adjusted proportionally</li>
                  <li>Remaining items will be shipped as scheduled</li>
                  <li>No additional shipping charges for partial orders</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Return Shipping */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Return Shipping</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Free Return Shipping</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Defective or damaged products</li>
                <li>• Wrong item delivered</li>
                <li>• Quality issues</li>
                <li>• Our shipping error</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Customer Pays Shipping</h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li>• Change of mind returns</li>
                <li>• Customer ordered wrong item</li>
                <li>• Size/specification mismatch</li>
                <li>• Personal preference returns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exceptions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Policy Exceptions</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Non-Refundable Items</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Gift cards and vouchers</li>
              <li>Digital downloads (if applicable)</li>
              <li>Personalized or custom-made items</li>
              <li>Items returned after 30 days from delivery</li>
              <li>Items damaged due to misuse or normal wear</li>
            </ul>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Need Help?</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-orange-800 mb-4">
              Our customer support team is here to help with cancellations, returns, and refunds:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-orange-700">
                <p><strong>Email:</strong> returns@cremsonpublications.com</p>
                <p><strong>Phone:</strong> +91-9876543210</p>
                <p><strong>WhatsApp:</strong> +91-9876543210</p>
              </div>
              <div className="space-y-2 text-orange-700">
                <p><strong>Support Hours:</strong> Mon-Sat, 9 AM - 7 PM</p>
                <p><strong>Average Response:</strong> Within 2 hours</p>
                <p><strong>Live Chat:</strong> Available on website</p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-3">Important Notes</h2>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• This policy is subject to change without prior notice</li>
              <li>• All refund timelines are approximate and may vary during peak seasons</li>
              <li>• Processing times may be longer during holidays and weekends</li>
              <li>• For international orders, additional terms may apply</li>
              <li>• We reserve the right to refuse returns that don't meet our policy criteria</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CancellationRefund;