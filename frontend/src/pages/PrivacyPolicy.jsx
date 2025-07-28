import React from 'react';


const PrivacyPolicy = () => (
  <>
    <div className="relative flex flex-col items-center bg-gradient-to-br from-[#181824] via-[#232946] to-[#181824] py-8 px-2">
      <div className="w-full max-w-3xl mx-auto my-8 bg-[#1a1a2e]/90 rounded-3xl shadow-2xl border border-[#232946]/60 px-6 sm:px-10 py-10 flex flex-col items-center h-fit">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#38BDF8] tracking-tight drop-shadow-lg">Privacy Policy</h1>
        <section className="mb-8 w-full">
          <ul className="list-disc list-inside text-[#E0E7EF] mb-8 space-y-4 pl-6 text-base">
            <li>We collect messages you send, and optionally your name or <a href="mailto:abhithakur7891@gmail.com" className="text-[#38BDF8] underline hover:text-[#FF61A6] font-semibold">Email</a> if you provide them.</li>
            <li>We also collect basic device info like IP address, browser type, and usage data.</li>
            <li>We use this data to improve chatbot performance, respond accurately, and fix issues.</li>
            <li>We do not sell your data to anyone.</li>
            <li>We may use third-party AI services (like OpenAI, Google Gemini, or Groq) to process responses.</li>
            <li>We may share data with legal authorities if required by law.</li>
            <li>You can ask us to view or delete your data at any time by contacting <a href="mailto:abhithakur7891@gmail.com" className="text-[#38BDF8] underline hover:text-[#FF61A6] font-semibold">Email</a>.</li>
            <li>We use reasonable security measures to protect your data, but no system is 100% secure.</li>
            <li>Cookies may be used on web versions to enhance user experience.</li>
            <li>The chatbot is not intended for children under 13.</li>
            <li>We may update this privacy policy and will post changes with a new date.</li>
            <li>By using the chatbot, you agree to this privacy policy.</li>
          </ul>
          <div className="flex justify-center mt-8">
            <span className="inline-block bg-gradient-to-r from-[#232946] to-[#232946]/80 text-[#38BDF8] px-6 py-3 rounded-xl font-semibold shadow-lg border border-[#232946]/40 text-base">Contact us at <a href="mailto:abhithakur7891@gmail.com" className="text-[#FF61A6] underline font-semibold">Email</a> for any privacy questions.</span>
          </div>
    </section>
        <hr className="border-t border-[#232946] opacity-30 my-8 w-full" />
      </div>
  </div>
  </>
);

export default PrivacyPolicy; 