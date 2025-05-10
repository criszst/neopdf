import React from "react";
import { FileText } from "lucide-react";

const FooterComponent = () => {
  return (
    <footer className="bg-black py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-700">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NeoPDF</span>
            </div>
            <p className="mt-4 max-w-xs text-sm">
              Transform how you interact with PDFs with our powerful, intuitive document management platform.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white">Features</a></li>
              <li><a href="#" className="text-sm hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-sm hover:text-white">Security</a></li>
              <li><a href="#" className="text-sm hover:text-white">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-sm hover:text-white">Guides</a></li>
              <li><a href="#" className="text-sm hover:text-white">API Status</a></li>
              <li><a href="#" className="text-sm hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white">About</a></li>
              <li><a href="#" className="text-sm hover:text-white">Blog</a></li>
              <li><a href="#" className="text-sm hover:text-white">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-white">Press</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm">© 2025 NeoPDF, Inc. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;