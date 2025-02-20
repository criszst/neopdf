import React, { JSX } from "react";
const FooterComponent = (): JSX.Element => {
  return (
    <footer className="bg-black py-12 border-t border-black">
      <div className="mx-auto max-w-7xl px-2 sm:px- lg:px-">
        {/* <div className="grid grid-cols-4 gap-2 lg:grid-cols-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  PDF Reader
                </Link>
              </li>
            </ul>
          </div>




        </div> */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} NeoPDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent;