import React, { useState } from 'react';
import AboutUsSettings from './AboutUsSettings.js';
import LandingPageSetting from './LandingPageSetting.js';
import { MdProductionQuantityLimits } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { RiDiscountPercentLine } from "react-icons/ri";
import ListDesProduitSettings from './ListDesProduitSettings.js';
import PromotionPageSettings from './PromotionPageSettings.js';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('Acceuil');

  return (
    <div>
            <div className="p-4 sm:ml-64">
            <div className=" min-h-screen">
      {/* Header */}
      <div className="font-sans p-4">
        <ul className="flex">
          <li
            onClick={() => setActiveTab('Acceuil')}
            className={`tab text-blue-600 flex items-center justify-center font-bold text-[15px]  py-3.5 px-7 border-b-2 cursor-pointer ${activeTab === 'Acceuil' ? 'border-blue-600' : 'text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 mr-3" viewBox="0 0 511 511.999">
              <path d="M498.7 222.695c-.016-.011-.028-.027-.04-.039L289.805 13.81C280.902 4.902 269.066 0 256.477 0c-12.59 0-24.426 4.902-33.332 13.809L14.398 222.55c-.07.07-.144.144-.21.215-18.282 18.386-18.25 48.218.09 66.558 8.378 8.383 19.44 13.235 31.273 13.746.484.047.969.07 1.457.07h8.32v153.696c0 30.418 24.75 55.164 55.168 55.164h81.711c8.285 0 15-6.719 15-15V376.5c0-13.879 11.293-25.168 25.172-25.168h48.195c13.88 0 25.168 11.29 25.168 25.168V497c0 8.281 6.715 15 15 15h81.711c30.422 0 55.168-24.746 55.168-55.164V303.14h7.719c12.586 0 24.422-4.903 33.332-13.813 18.36-18.367 18.367-48.254.027-66.633zm-21.243 45.422a17.03 17.03 0 0 1-12.117 5.024h-22.72c-8.285 0-15 6.714-15 15v168.695c0 13.875-11.289 25.164-25.168 25.164h-66.71V376.5c0-30.418-24.747-55.168-55.169-55.168H232.38c-30.422 0-55.172 24.75-55.172 55.168V482h-66.71c-13.876 0-25.169-11.29-25.169-25.164V288.14c0-8.286-6.715-15-15-15H48a13.9 13.9 0 0 0-.703-.032c-4.469-.078-8.66-1.851-11.8-4.996-6.68-6.68-6.68-17.55 0-24.234.003 0 .003-.004.007-.008l.012-.012L244.363 35.02A17.003 17.003 0 0 1 256.477 30c4.574 0 8.875 1.781 12.113 5.02l208.8 208.796.098.094c6.645 6.692 6.633 17.54-.031 24.207zm0 0" />
            </svg>
            Acceuil
          </li>
          <li
            onClick={() => setActiveTab('settings')}
            className={`tab text-gray-600 flex items-center justify-center font-semibold text-[15px] py-3.5 px-7 border-b-2 cursor-pointer ${activeTab === 'settings' ? 'border-blue-600' : 'text-gray-600'}`}
          >
        
            <BsQuestionCircle   className="w-4 mr-3 "/>

            Qui sommes nous
          </li>
          <li
            onClick={() => setActiveTab('profile')}
            className={`tab text-gray-600 flex items-center justify-center font-semibold text-[15px] py-3.5 px-7 border-b-2 cursor-pointer ${activeTab === 'profile' ? 'border-blue-600' : 'text-gray-600'}`}
          >
         
            <MdProductionQuantityLimits className="w-4 mr-3 "/>

            List Des Produits
          </li>
          <li
            onClick={() => setActiveTab('promotion')}
            className={`tab text-gray-600 flex items-center justify-center font-semibold text-[15px] py-3.5 px-7 border-b-2 cursor-pointer ${activeTab === 'promotion' ? 'border-blue-600' : 'text-gray-600'}`}
          >
        <RiDiscountPercentLine  className="w-4 mr-3 "/>

            Promotion
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'Acceuil' && (
          <div>
            <LandingPageSetting/>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
          <AboutUsSettings/>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <ListDesProduitSettings/>
          </div>
        )}
     
              {activeTab === 'promotion' && (
          <div>
        <PromotionPageSettings/>
          </div>
        )}
      </div>
    </div>
  

</div>
    </div>
  )
}
