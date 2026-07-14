import React from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = "July 14, 2026";
  const legalEntity = "Zibmate Pvt. Ltd.";
  const address = "Sirsa, Haryana, 125055, India";
  const email = "houseofsole.contact@gmail.com";
  const grievanceEmail = "houseofsole.contact@gmail.com";
  const grievanceOfficer = "Mr. Aman Monga";
  const grievanceDesignation = "CEO";

  return (
    <div className="min-h-screen bg-[#fffbfb] text-[#333333] font-sans antialiased selection:bg-[#ff1761] selection:text-white">
      {/* Hero Header */}
      <div className="relative py-16 text-center bg-gradient-to-b from-[#fff0f2] to-[#fffbfb] border-b border-pink-100">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#ff1761] block mb-2">
          Legal & Policies
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] font-medium tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#857568] italic">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white border border-[#f3e8e8] shadow-sm rounded-2xl p-6 md:p-10 leading-relaxed text-gray-700 space-y-8">
          
          <p className="text-sm md:text-base text-gray-600 border-b border-gray-100 pb-6">
            This Privacy Policy describes how <span className="font-semibold text-black">{legalEntity}</span> ("HouseOfSole", "we", "us", or "our"), operating the website <span className="font-semibold text-black">www.houseofsole.in</span> ("Website"), collects, uses, discloses, and protects the personal information of visitors and customers ("you", "your") who use our Website or purchase our products. 
            This Policy is published in compliance with the Information Technology Act, 2000, the IT Rules 2011, and the Digital Personal Data Protection Act, 2023 ("DPDP Act") in India.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">01.</span> Information We Collect
            </h2>
            <div className="pl-6 space-y-4 text-sm md:text-base text-gray-600">
              <div>
                <h3 className="font-medium text-black mb-1">1.1 Information you provide to us</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Name, email address, phone number, billing and shipping address.</li>
                  <li>Account login credentials (email/password or OTP-based login).</li>
                  <li>Order details, including products purchased, size, and preferences.</li>
                  <li>Payment-related information (processed securely via our third-party payment gateway).</li>
                  <li>Communications with our customer support team and any reviews, ratings, or wishlists you submit.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-black mb-1">1.2 Information collected automatically</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>IP address, browser type, device information, and operating system.</li>
                  <li>Pages viewed, time spent on the Website, and referring/exit pages.</li>
                  <li>Cookies, tracking technologies, and approximate location.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-black mb-1">1.3 Information from third parties</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Transaction confirmations from payment gateways.</li>
                  <li>Social login profile data if you choose to sign in via Google or alternative systems.</li>
                  <li>Delivery and tracking statuses from logistics partners.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">02.</span> How We Use Your Information
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600 mb-2">
              We use the collected information for purposes including:
            </p>
            <ul className="list-disc list-inside pl-8 text-sm md:text-base text-gray-600 space-y-1">
              <li>Processing, fulfilling, and shipping your custom orders.</li>
              <li>Managing your account and communicating tracking updates or support information.</li>
              <li>Sending promotional updates via SMS, email, or WhatsApp (with clear opt-out functions).</li>
              <li>Enhancing store functionality, fraud prevention, and regulatory adherence.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">03.</span> Legal Basis for Processing
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Data handling functions on your explicit consent (for marketing/cookies), contract execution (delivering purchases), statutory mandates (tax laws), or recognized legitimate business operations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">04.</span> Sharing of Information
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              We do not sell personal information. We share metrics strictly with secure data handlers: certified payment networks (e.g., Razorpay, PayU), fulfillment couriers (e.g., Delhivery, Blue Dart), analytical tracking assets, or compliance panels under official authorization rules.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">05.</span> Data Retention
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Records are maintained safely over durations essential for legal criteria. Transaction logs are stored for up to 8 years in alignment with standard Indian accounting laws. Users hold the right to claim profile deletion at any given interval.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">06.</span> Cookies and Tracking Technologies
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Cookies recognize system preferences, support checkout flows, and track traffic behavior maps. Disabling browser cookie functions can disrupt shopping cart features and active browsing updates.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">07.</span> Data Security & Payment Safety
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              We execute administrative SSL/TLS encryptions across our domain architecture. All banking transactions run strictly over outsourced PCI-DSS structures; full CVV parameters or net banking card credentials are never archived locally.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">08.</span> Your Rights
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Subject to your legal rights under Indian data rules, you hold authorizations to review, alter, delete, or withdraw handling permissions at any point. Contact options are detailed explicitly below.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">09.</span> Children's Privacy & Third-Party Links
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Our site is restricted from handling registrations under 18 years of age without parental insight. We lack administrative jurisdiction over independent third-party links and advise validating external rules prior to processing actions.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">10.</span> Grievance Redressal
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 bg-[#fff5f6] p-5 rounded-xl border border-pink-50 space-y-2">
              <p><span className="font-medium text-black">Grievance Officer:</span> {grievanceOfficer}</p>
              <p><span className="font-medium text-black">Designation:</span> {grievanceDesignation}</p>
              <p><span className="font-medium text-black">Email:</span> <a href={`mailto:${grievanceEmail}`} className="text-[#ff1761] hover:underline">{grievanceEmail}</a></p>
              <p><span className="font-medium text-black">Address:</span> {address}</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">11.</span> Contact Us
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              For privacy queries or rights execution requests, write to our data panel via:{" "}
              <a href={`mailto:${email}`} className="text-[#ff1761] hover:underline font-medium">
                {email}
              </a>.
            </p>
          </section>

          {/* Fine Print Footer */}
          <div className="pt-8 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} House of Sole. Crafted with grace. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;