import React from 'react';

const TermsOfService = () => (
  <>
    <div className="relative flex flex-col items-center bg-gradient-to-br from-[#181824] via-[#232946] to-[#181824] py-8 px-2">
      <div className="w-full max-w-3xl mx-auto my-8 bg-[#1a1a2e]/90 rounded-3xl shadow-2xl border border-[#232946]/60 px-6 sm:px-10 py-10 flex flex-col items-center h-fit">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#38BDF8] tracking-tight drop-shadow-lg">Terms of Service</h1>
        <section className="mb-10 w-full">
          <p className="mb-6 text-lg text-[#A1A1AA] text-center">By using <span className="font-semibold text-[#38BDF8]">ALVERGE AI</span>, you agree to follow these terms.</p>
          <ul className="list-disc list-inside text-[#E0E7EF] mb-10 space-y-4 pl-6 text-base">
            <li>You can use the chatbot for personal, non-commercial purposes. Please don’t use it to send harmful, illegal, or offensive content.</li>
            <li>The chatbot is powered by AI and may sometimes give incorrect or outdated answers. Use the information at your own risk.</li>
            <li>You're responsible for anything you type into the chatbot. Avoid sharing sensitive personal info like passwords, credit card numbers, or private data.</li>
            <li>We collect and use data as explained in our <a href="/privacy" className="underline text-[#38BDF8] hover:text-[#FF61A6]">Privacy Policy</a>. By using the chatbot, you agree to that policy.</li>
            <li>Some responses come from third-party services like OpenAI, Google Gemini, or Groq. Their terms may also apply.</li>
            <li>We may change, improve, or remove the chatbot at any time without notice.</li>
            <li>We're not responsible for any losses or damages that happen because of using the chatbot.</li>
            <li>If you break these rules or misuse the chatbot, we may block or suspend your access.</li>
            <li>We may update these terms in the future. By continuing to use the chatbot, you accept the changes.</li>
          </ul>
          <div className="flex justify-center mt-8">
            <span className="inline-block bg-gradient-to-r from-[#232946] to-[#232946]/80 text-[#38BDF8] px-6 py-3 rounded-xl font-semibold shadow-lg border border-[#232946]/40 text-base">If you have any questions, contact us at <a href="mailto:abhithakur7891@gmail.com" className="text-[#FF61A6] underline font-semibold">Email</a>.</span>
          </div>
    </section>
        <hr className="border-t border-[#232946] opacity-30 my-8 w-full" />
      </div>
  </div>
  </>
);

export default TermsOfService; 