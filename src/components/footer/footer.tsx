import React, { JSX } from "react";

const FooterComponent = (): JSX.Element => {
  return (
    <footer className="bg-black py-5 border-t border-black">
      <div className="mx-auto max-w-7xl px-2 sm:px- lg:px-8">
        <div className="mt-0 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} NeoPDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent;