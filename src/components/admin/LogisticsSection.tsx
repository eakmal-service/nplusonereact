import React, { useState } from 'react';
import PincodeChecker from './logistics/PincodeChecker';
import RateCalculator from './logistics/RateCalculator';

export default function LogisticsSection() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Logistics Management</h2>

            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-700 mb-6">
                {['dashboard', 'tools', 'warehouses', 'ndr', 'remittance'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-4 capitalize ${activeTab === tab
                            ? 'border-b-2 border-blue-500 text-blue-400 font-bold'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <h3 className="text-xl font-bold mb-2">Shipments</h3>
                            <p className="text-4xl font-bold text-blue-400">0</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <h3 className="text-xl font-bold mb-2">NDR Pending</h3>
                            <p className="text-4xl font-bold text-yellow-400">0</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <h3 className="text-xl font-bold mb-2">Wallet</h3>
                            <p className="text-lg text-gray-400">₹0.00</p>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <PincodeChecker />
                        <RateCalculator />
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab !== 'dashboard' && activeTab !== 'tools' && (
                    <div className="text-center py-20 text-gray-500">
                        {activeTab.toUpperCase()} Module Coming Soon
                    </div>
                )}
            </div>
        </div>
    );
}
