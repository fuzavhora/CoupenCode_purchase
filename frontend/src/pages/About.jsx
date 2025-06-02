import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to bring you high-quality products at affordable prices. We believe
            in building trust with our customers and providing seamless online shopping experiences.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Why Shop With Us?</h2>
          <ul className="list-disc ml-5 text-lg leading-relaxed">
            <li>Curated products with premium quality</li>
            <li>Secure online payments via UPI, cards, and net banking</li>
            <li>Fast and reliable shipping</li>
            <li>Dedicated customer support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-lg leading-relaxed">
            Have questions? Reach out to us at:{" "}
            <a
              href="mailto:support@yourecommercesite.com"
              className="text-blue-600 hover:underline"
            >
              support@yourecommercesite.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
