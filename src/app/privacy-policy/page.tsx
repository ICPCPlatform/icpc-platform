import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground dark:bg-black dark:text-white p-4">
      <Card className="w-full max-w-3xl p-6 shadow-lg rounded-lg bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Welcome to the Privacy Policy of our website. This document outlines how we collect, use, and protect your personal information when you visit our site.
        </p>
        <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
        <p className="mb-2">
          We may collect the following types of information:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Personal Information:</strong> This includes your name, email address, and any other information you provide when you register or use our services.
          </li>
          <li>
            <strong>Usage Information:</strong> This includes your IP address, browser type, operating system, and the pages you view on our site.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
        <p className="mb-4">
          The information we collect is used to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide and maintain our services.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website.</li>
          <li>Process your transactions and send you transaction-related notifications.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6">Data Protection</h2>
        <p className="mb-4">
          We take the security of your personal information seriously and implement various measures to protect it. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.
        </p>
        <h2 className="text-xl font-semibold mt-6">Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of any inaccurate information.</li>
          <li>Request deletion of your personal information.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6">Changes to This Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Please review this policy periodically for any changes. Your continued use of the site after any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide by and be bound by the modified policy.
        </p>
      </Card>
    </div>
  );
} 
