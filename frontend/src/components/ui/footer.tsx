import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-600">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} SwiftPay All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a
            href="https://www.linkedin.com/in/marvellous-popoola/"
            className="hover:underline text-cyan-900"
          >
            Linkedin
          </a>
          <a
            href="https://github.com/Marvy-ctrl"
            className="hover:underline text-cyan-900"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
