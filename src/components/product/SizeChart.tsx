import React from 'react';

interface SizeChartProps {
    isOpen: boolean;
    onClose: () => void;
    category?: string;
    title?: string;
}

const SizeChart: React.FC<SizeChartProps> = ({ isOpen, onClose, category, title }) => {
    if (!isOpen) return null;

    console.log('SizeChart Category:', category, 'Title:', title);
    const normalizedCategory = category?.toUpperCase() || '';
    const normalizedTitle = title?.toUpperCase() || '';

    // Check both Category and Title for 'BOY'
    const isBoys = normalizedCategory.includes('BOY') || normalizedTitle.includes('BOY');

    // Girls logic: If 'GIRL' is found, OR 'KID' is found but NOT 'BOY' (fallback for generic Kids Wear that isn't explicitly Boy)
    // Actually, 'KID' in category/title + 'BOY' not present -> might be safe to default to Girl? 
    // Or we should be stricter.
    // Let's mirror the script logic:
    // Boy if BOY in cat/title.
    // Girl if GIRL in cat/title.
    // If neither, but KID is present? The old logic was "KID" -> Girls. 
    // If I have "Boys Cotton" (Title has BOY), isBoys=true.
    // isGirls should be false.

    const isMens = (normalizedCategory.includes('MEN') || normalizedTitle.includes('MEN')) && !normalizedCategory.includes('WOMEN') && !normalizedTitle.includes('WOMEN') && !isBoys;
    const isGirls = (normalizedCategory.includes('GIRL') || normalizedTitle.includes('GIRL') || normalizedCategory.includes('KID')) && !isBoys && !isMens;

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

    // Boy's Chart Data (corrected waist based on progression)
    // Added 'size' column as per request: 20, 22, 24, 26, 28
    const boysData = [
        { size: '20', age: '1-2Y', chest: '20 - 21', topLength: '13-14', waist: '17-18', bottomLength: '10-11', weight: '10-12' },
        { size: '22', age: '2-3Y', chest: '21 - 22', topLength: '14-15', waist: '18-19', bottomLength: '11-12', weight: '11-12' },
        { size: '24', age: '3-4Y', chest: '22 - 23', topLength: '15-16', waist: '19-20', bottomLength: '12-13', weight: '12-13' },
        { size: '26', age: '4-5Y', chest: '23 - 24', topLength: '16-17', waist: '20-21', bottomLength: '13-14', weight: '13-14' },
        { size: '28', age: '5-6Y', chest: '24 - 25', topLength: '17-18', waist: '21 - 22', bottomLength: '14-15', weight: '18-20' },
    ];

    // Men's Bottom Chart Data
    const mensBottomData = [
        { size: 'S', waist: '30', length: '40', thigh: '12.25', rise: '12.5', elasticBelt: '14', bottom: '7' },
        { size: 'M', waist: '32', length: '40', thigh: '12.25', rise: '12.5', elasticBelt: '15', bottom: '7' },
        { size: 'L', waist: '34', length: '41', thigh: '12.5', rise: '13', elasticBelt: '16', bottom: '7.5' },
        { size: 'XL', waist: '36', length: '41', thigh: '13', rise: '13.5', elasticBelt: '17', bottom: '7.5' },
        { size: '2XL', waist: '38', length: '41', thigh: '13.5', rise: '14', elasticBelt: '18', bottom: '8' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200 ${isGirls || isBoys || isMens ? 'bg-black text-silver border border-gray-700' : 'bg-white text-black'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 transition-colors ${isGirls || isBoys || isMens ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wide">Size Guide</h2>

                    {isBoys ? (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">BOYS SHIRT & SHORT SIZE CHART (1-6 YEARS)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-900">
                                            <th className="p-3 border border-gray-700 text-silver">SIZE</th>
                                            <th className="p-3 border border-gray-700 text-silver">AGE (YEARS)</th>
                                            <th className="p-3 border border-gray-700 text-silver">CHEST (IN)</th>
                                            <th className="p-3 border border-gray-700 text-silver">TOP LENGTH (IN)</th>
                                            <th className="p-3 border border-gray-700 text-silver">WAIST (IN)</th>
                                            <th className="p-3 border border-gray-700 text-silver">BOTTOM LENGTH (IN)</th>
                                            <th className="p-3 border border-gray-700 text-silver">WEIGHT (KGS)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boysData.map((row) => (
                                            <tr key={row.age} className="hover:bg-gray-900/50">
                                                <td className="p-3 border border-gray-700 font-bold text-white">{row.size}</td>
                                                <td className="p-3 border border-gray-700 font-medium">{row.age}</td>
                                                <td className="p-3 border border-gray-700">{row.chest}</td>
                                                <td className="p-3 border border-gray-700">{row.topLength}</td>
                                                <td className="p-3 border border-gray-700">{row.waist}</td>
                                                <td className="p-3 border border-gray-700">{row.bottomLength}</td>
                                                <td className="p-3 border border-gray-700">{row.weight}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : isMens ? (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">MEN'S BOTTOM WEAR SIZE CHART (IN INCHES)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-900">
                                            <th className="p-3 border border-gray-700 text-silver">SIZE</th>
                                            <th className="p-3 border border-gray-700 text-silver">WAIST</th>
                                            <th className="p-3 border border-gray-700 text-silver">LENGTH</th>
                                            <th className="p-3 border border-gray-700 text-silver">THIGH</th>
                                            <th className="p-3 border border-gray-700 text-silver">RISE</th>
                                            <th className="p-3 border border-gray-700 text-silver">ELASTIC BELT</th>
                                            <th className="p-3 border border-gray-700 text-silver">BOTTOM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mensBottomData.map((row) => (
                                            <tr key={row.size} className="hover:bg-gray-900/50">
                                                <td className="p-3 border border-gray-700 font-bold text-white">{row.size}</td>
                                                <td className="p-3 border border-gray-700">{row.waist}</td>
                                                <td className="p-3 border border-gray-700">{row.length}</td>
                                                <td className="p-3 border border-gray-700">{row.thigh}</td>
                                                <td className="p-3 border border-gray-700">{row.rise}</td>
                                                <td className="p-3 border border-gray-700">{row.elasticBelt}</td>
                                                <td className="p-3 border border-gray-700">{row.bottom}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : isGirls ? (
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
