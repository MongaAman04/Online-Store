import React from 'react';

const TermsAndConditions = () => {
  const lastUpdated = "July 14, 2026";
  const legalEntity = "Zibmate Private Limited";
  const address = "Sirsa, Haryana, 125055, India";
  const email = "houseofsole.contact@gmail.com";
  const grievanceEmail = "houseofsole.contact@gmail.com";

  return (
    <div className="min-h-screen bg-[#fffbfb] text-[#333333] font-sans antialiased selection:bg-[#ff1761] selection:text-white">
      {/* Hero Section */}
      <div className="relative py-16 text-center bg-gradient-to-b from-[#fff0f2] to-[#fffbfb] border-b border-pink-100">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#ff1761] block mb-2">
          Legal & Policies
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] font-medium tracking-tight mb-4">
          Terms and Conditions
        </h1>
        <p className="text-sm text-[#857568] italic">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white border border-[#f3e8e8] shadow-sm rounded-2xl p-6 md:p-10 leading-relaxed text-gray-700 space-y-8">
          
          <p className="text-sm text-gray-600 border-b border-gray-100 pb-6">
            Welcome to <span className="font-semibold text-black">www.houseofsole.in</span> (the "Website"), owned and operated by <span className="font-semibold text-black">{legalEntity}</span> ("HouseOfSole", "we", "us", "our"), having its registered office at {address}. By accessing or using the Website, you agree to be bound by these Terms.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">01.</span> Eligibility
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              You must be at least 18 years of age and capable of entering into a legally binding contract to use this Website and make purchases. If you are under 18, you may use the Website only under the supervision of a parent or legal guardian.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">02.</span> Account Registration
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 space-y-2">
              <p>You may be required to create an account to place orders. You agree to provide accurate, current, and complete information during registration.</p>
              <p>You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts that provide false information.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">03.</span> Products and Pricing
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 space-y-2">
              <p>We make reasonable efforts to display product colors, sizes, and details accurately. However, actual colors may vary slightly due to screen/display settings.</p>
              <p>All prices listed are in <span className="font-medium text-black">Indian Rupees (INR)</span> and are inclusive of applicable taxes (GST), unless stated otherwise.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">04.</span> Orders and Acceptance
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Placing an order constitutes an offer to purchase. An order is confirmed only upon our acceptance, communicated via an order confirmation email/SMS. We reserve the right to refuse or cancel any order at our discretion due to technical errors, stock unavailability, or fraud suspicion.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">05.</span> Payments
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              We accept payments via credit/debit cards, UPI, net banking, wallets, and Cash on Delivery (COD). All online payments are processed through secure, PCI-DSS compliant third-party payment gateways. We do not store your complete banking credentials.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">06.</span> Shipping and Delivery
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              We ship to addresses within India. Delivery timelines vary by location and are estimates only, typically taking 3–7 business days. Risk of loss passes to you upon delivery to the shipping address provided.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">07.</span> Cancellations, Returns, and Refunds
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 space-y-2">
              <p><span className="font-medium text-black">Cancellation:</span> Orders can only be cancelled before they are shipped.</p>
              <p><span className="font-medium text-black">Returns/Exchanges:</span> Products can be replaced (not returned) within 7 days of delivery if they are unused, unworn, and have original packaging/tags intact.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">08.</span> Intellectual Property
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              All content on the Website—including the House Of Sole name, logo, images, design layouts, and descriptions—is the exclusive property of {legalEntity}. Unauthorized reproduction is strictly prohibited.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">09.</span> Grievance Redressal
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 bg-[#fff5f6] p-4 rounded-xl border border-pink-50 space-y-1">
              <p><span className="font-medium text-black">Grievance Officer:</span> Contact Person Name</p>
              <p><span className="font-medium text-black">Email:</span> <a href={`mailto:${grievanceEmail}`} className="text-[#ff1761] hover:underline">{grievanceEmail}</a></p>
              <p><span className="font-medium text-black">Address:</span> {address}</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">10.</span> Contact Us
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              For any questions regarding these Terms, please contact us at{" "}
              <a href={`mailto:${email}`} className="text-[#ff1761] hover:underline font-medium">
                {email}
              </a>.
            </p>
          </section>

          {/* CTA Action Button */}
          {/* <div className="pt-8 text-center border-t border-gray-100">
            <button className="bg-[#ff1761] text-white font-medium text-sm tracking-wider uppercase px-8 py-3.5 rounded-full shadow-md hover:bg-[#d60e4c] transition-all duration-300 transform hover:-translate-y-0.5">
              Accept Terms & Conditions
            </button>
            <p className="text-xs text-gray-400 mt-3">
              By proceeding, you agree to comply with all rules stated above.
            </p>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;