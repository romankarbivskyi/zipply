export const metadata = {
  title: "Privacy Policy | Zipply",
  description: "Privacy policy for Zipply URL shortener.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 sm:mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none text-muted-foreground font-medium leading-relaxed space-y-4 sm:space-y-6">
          <p>
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us. This information may include your name, email address, password, and any other information you choose to provide.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, such as to securely shorten URLs, provide you with tracking analytics via our Tinybird integration, and send you technical notices and support messages.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">3. Data Sharing and Security</h2>
          <p>
            We do not share or sell your personal information to third parties except as necessary to provide the Zipply service, comply with the law, or protect our rights. We use industry-standard security measures to protect your data, but please remember that no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track user activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@zipply.example.com.
          </p>
        </div>
    </div>
  );
}
