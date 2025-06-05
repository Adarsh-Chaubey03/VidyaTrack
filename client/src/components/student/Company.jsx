import React from 'react';
import { assets } from '../../assets/assets';

function Company() {
  return (
    <div className="pt-16 text-center">
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
        Trusted by professionals at world-leading companies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mt-8">
        <img src={assets.microsoft_logo} alt="Microsoft" className="h-10 md:h-12 object-contain" />
        <img src={assets.walmart_logo} alt="Walmart" className="h-10 md:h-12 object-contain" />
        <img src={assets.adobe_logo} alt="Adobe" className="h-10 md:h-12 object-contain" />
        <img src={assets.paypal_logo} alt="PayPal" className="h-10 md:h-12 object-contain" />
      </div>
    </div>
  );
}

export default Company;
