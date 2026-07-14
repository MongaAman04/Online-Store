import React from 'react';

const CookiePolicy = () => {
  const lastUpdated = "July 14, 2026";
  const legalEntity = "Zibmate Pvt. Ltd.";
  const address = "Sirsa, Haryana, 125055, India";
  const email = "houseofsole.contact@gmail.com";

  return (
    <div className="min-h-screen bg-[#fffbfb] text-[#333333] font-sans antialiased selection:bg-[#ff1761] selection:text-white">
      {/* Hero Header */}
      <div className="relative py-16 text-center bg-gradient-to-b from-[#fff0f2] to-[#fffbfb] border-b border-pink-100">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#ff1761] block mb-2">
          Legal & Policies
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] font-medium tracking-tight mb-4">
          Cookie Policy
        </h1>
        <p className="text-sm text-[#857568] italic">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white border border-[#f3e8e8] shadow-sm rounded-2xl p-6 md:p-10 leading-relaxed text-gray-700 space-y-8">
          
          <p className="text-sm md:text-base text-gray-600 border-b border-gray-100 pb-6">
            This Cookie Policy explains how <span className="font-semibold text-black">{legalEntity}</span> ("HouseOfSole", "we", "us", "our") uses cookies and similar tracking technologies on <span className="font-semibold text-black">www.houseofsole.in</span> ("Website"). This policy should be read together with our Privacy Policy. By continuing to browse or use the Website, you agree to our use of cookies as described in this Policy.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">01.</span> What Are Cookies?
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Cookies are small text files placed on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your actions and preferences (such as items in your cart, login status, and language) over time, and allow us to understand how the Website is used. We also use web beacons, pixels, and local storage, collectively referred to as "cookies".
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">02.</span> Types of Cookies We Use
            </h2>
            
            <div className="pl-6 space-y-6">
              {/* 2.1 */}
              <div className="space-y-2">
                <h3 className="font-medium text-black text-base">2.1 Strictly Necessary Cookies</h3>
                <p className="text-sm text-gray-600">
                  Required for the Website to function properly. These enable core features such as maintaining your shopping cart, keeping you logged in, and remembering items during checkout.
                </p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-left border border-gray-100 text-sm">
                    <thead className="bg-[#fff5f6] text-black font-medium">
                      <tr>
                        <th className="p-3 border-b border-gray-100">Purpose</th>
                        <th className="p-3 border-b border-gray-100">Example</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-50">
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Session management</td>
                        <td className="p-3">Maintaining login sessions</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Shopping cart</td>
                        <td className="p-3">Remembering items added to cart</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Security</td>
                        <td className="p-3">CSRF/fraud prevention tokens</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2.2 */}
              <div className="space-y-2">
                <h3 className="font-medium text-black text-base">2.2 Performance & Analytics Cookies</h3>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with the Website—which pages are visited most, how users navigate, and where errors occur.
                </p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-left border border-gray-100 text-sm">
                    <thead className="bg-[#fff5f6] text-black font-medium">
                      <tr>
                        <th className="p-3 border-b border-gray-100">Provider</th>
                        <th className="p-3 border-b border-gray-100">Example Cookie</th>
                        <th className="p-3 border-b border-gray-100">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-50">
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Google Analytics</td>
                        <td className="p-3">_ga, _ga_*, _gid</td>
                        <td className="p-3">Tracks visits, sessions, and traffic sources</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2.3 & 2.4 */}
              <div className="space-y-2">
                <h3 className="font-medium text-black text-base">2.3 Functional & Marketing Cookies</h3>
                <p className="text-sm text-gray-600">
                  Functional cookies remember preferences (like sizes or recently viewed items). Marketing cookies are used to show you relevant ads on other platforms (retargeting) and measure campaign effectiveness.
                </p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-left border border-gray-100 text-sm">
                    <thead className="bg-[#fff5f6] text-black font-medium">
                      <tr>
                        <th className="p-3 border-b border-gray-100">Provider</th>
                        <th className="p-3 border-b border-gray-100">Example Cookie</th>
                        <th className="p-3 border-b border-gray-100">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-50">
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Meta (Facebook/Instagram)</td>
                        <td className="p-3">_fbp, fr</td>
                        <td className="p-3">Retargeting and ad measurement</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-700">Google Ads</td>
                        <td className="p-3">_gcl_au</td>
                        <td className="p-3">Ad conversion tracking</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">03.</span> Third-Party Cookies
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Some cookies are placed by third-party services that appear on our Website (such as payment networks or advertising suites). We do not control these cookies. Please refer to their respective platforms:
            </p>
            <ul className="list-disc list-inside pl-12 text-sm text-gray-600 space-y-1">
              <li>Google Analytics / Google Ads: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#ff1761] hover:underline">policies.google.com/privacy</a></li>
              <li>Meta Pixel: <a href="https://www.facebook.com/policy/cookies" target="_blank" rel="noreferrer" className="text-[#ff1761] hover:underline">facebook.com/policy/cookies</a></li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">04.</span> How Long Do Cookies Last?
            </h2>
            <ul className="list-disc list-inside pl-8 text-sm md:text-base text-gray-600 space-y-1">
              <li><span className="font-medium text-black">Session cookies:</span> Deleted automatically when you close your browser.</li>
              <li><span className="font-medium text-black">Persistent cookies:</span> Remain on your device for a set period (ranging from a few days up to 2 years) or until manually cleared.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">05.</span> Managing Your Cookie Preferences
            </h2>
            <p className="text-sm md:text-base pl-6 text-gray-600">
              Most browsers allow you to block or delete cookies via <span className="italic">Settings &gt; Privacy</span>. Note that blocking essential cookies may affect Website functionality, such as your ability to log in or complete a checkout sequence.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
              <span className="text-[#ff1761] text-base">06.</span> Contact Us
            </h2>
            <div className="text-sm md:text-base pl-6 text-gray-600 bg-[#fff5f6] p-4 rounded-xl border border-pink-50 space-y-1">
              <p><span className="font-medium text-black">Email:</span> <a href={`mailto:${email}`} className="text-[#ff1761] hover:underline">{email}</a></p>
              <p><span className="font-medium text-black">Address:</span> {address}</p>
            </div>
          </section>

          {/* Footer branding */}
          <div className="pt-8 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} House of Sole. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;