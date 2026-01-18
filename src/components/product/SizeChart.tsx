import React from 'react';

interface SizeChartProps {
    isOpen: boolean;
    onClose: () => void;
    category?: string;
}

const SizeChart: React.FC<SizeChartProps> = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    const isGirls = category === 'GIRLS WEAR';

    // Girl's Chart Data
    const girlsData = [
        { size: '1', chest: '21', length: '10-12' },
        { size: '2', chest: '22', length: '12-14' },
        { size: '3', chest: '23', length: '14-15' },
        { size: '4', chest: '23', length: '17-16' },
        { size: '5', chest: '24', length: '16-18' },
        { size: '6', chest: '26', length: '10-18' },
        { size: '7', chest: '25', length: '10-19' },
        { size: '8', chest: '25', length: '19-21' },
        { size: '9', chest: '26', length: '19-21' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200 ${isGirls ? 'bg-black text-silver border border-gray-700' : 'bg-white text-black'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 transition-colors ${isGirls ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wide">Size Guide</h2>

                    {isGirls ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Girls Size Chart</h3>
                                <p className="mb-4 text-sm text-center">All Dimensions In Inch</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse border border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-900">
                                                <th className="p-3 border border-gray-700 text-silver">Size</th>
                                                <th className="p-3 border border-gray-700 text-silver">Chest</th>
                                                <th className="p-3 border border-gray-700 text-silver">Length</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {girlsData.map((row) => (
                                                <tr key={row.size} className="hover:bg-gray-900/50">
                                                    <td className="p-3 border border-gray-700 font-medium">{row.size}</td>
                                                    <td className="p-3 border border-gray-700">{row.chest}</td>
                                                    <td className="p-3 border border-gray-700">{row.length}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Top / Kurti Chart (Standard) */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Top / Kurti Size Chart (in inches)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 border">Size</th>
                                                <th className="p-3 border">Bust</th>
                                                <th className="p-3 border">Waist</th>
                                                <th className="p-3 border">Hip</th>
                                                <th className="p-3 border">Shoulder</th>
                                                <th className="p-3 border">Length</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td className="p-3 border font-medium">S</td><td className="p-3 border">36</td><td className="p-3 border">34</td><td className="p-3 border">39</td><td className="p-3 border">14</td><td className="p-3 border">41</td></tr>
                                            <tr><td className="p-3 border font-medium">M</td><td className="p-3 border">38</td><td className="p-3 border">36</td><td className="p-3 border">41</td><td className="p-3 border">14.5</td><td className="p-3 border">41</td></tr>
                                            <tr><td className="p-3 border font-medium">L</td><td className="p-3 border">40</td><td className="p-3 border">38</td><td className="p-3 border">43</td><td className="p-3 border">15</td><td className="p-3 border">41</td></tr>
                                            <tr><td className="p-3 border font-medium">XL</td><td className="p-3 border">42</td><td className="p-3 border">40</td><td className="p-3 border">45</td><td className="p-3 border">15.5</td><td className="p-3 border">41</td></tr>
                                            <tr><td className="p-3 border font-medium">XXL</td><td className="p-3 border">44</td><td className="p-3 border">42</td><td className="p-3 border">47</td><td className="p-3 border">16</td><td className="p-3 border">41</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Bottom Chart */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Bottom (Pant / Palazzo) Size Chart (in inches)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 border">Size</th>
                                                <th className="p-3 border">Waist Full Elastic</th>
                                                <th className="p-3 border">Waist Half Elastic</th>
                                                <th className="p-3 border">Half Canvas</th>
                                                <th className="p-3 border">Bottom Length</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td className="p-3 border font-medium">S</td><td className="p-3 border">28</td><td className="p-3 border">30</td><td className="p-3 border">16</td><td className="p-3 border">38</td></tr>
                                            <tr><td className="p-3 border font-medium">M</td><td className="p-3 border">30</td><td className="p-3 border">32</td><td className="p-3 border">17</td><td className="p-3 border">38</td></tr>
                                            <tr><td className="p-3 border font-medium">L</td><td className="p-3 border">32</td><td className="p-3 border">34</td><td className="p-3 border">18</td><td className="p-3 border">38</td></tr>
                                            <tr><td className="p-3 border font-medium">XL</td><td className="p-3 border">34</td><td className="p-3 border">36</td><td className="p-3 border">19</td><td className="p-3 border">38</td></tr>
                                            <tr><td className="p-3 border font-medium">XXL</td><td className="p-3 border">36</td><td className="p-3 border">38</td><td className="p-3 border">20</td><td className="p-3 border">38</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Dupatta Info */}
                            <div className="mt-6 bg-gray-50 p-4 rounded text-sm">
                                <p><span className="font-semibold">Dupatta Length:</span> Standard 2 meters</p>
                                <p><span className="font-semibold">Dupatta Width:</span> 24-32 inches</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeChart;
