import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/utils/supabaseUpload'; // Ensure this utility exists and accepts file
import { Reorder } from "framer-motion";

interface SectionContent {
    [key: string]: any;
}

const ContentManagementSection = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [content, setContent] = useState<Record<string, any>>({});
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Initial Content State Structure
    // Initial Content State Structure matching the original website data
    const initialContent = {
        hero: [
            { desktopSrc: '/hero-slider-desktop/Slide-1.webp', alt: 'NPlusOne Fashion Collection' },
            { desktopSrc: '/hero-slider-desktop/Slide-2.webp', alt: 'Special Offer - 35% Off' },
            { desktopSrc: '/hero-slider-desktop/Slide-3.webp', alt: 'Stylish Designs' },
            { desktopSrc: '/hero-slider-desktop/Slide-4.webp', alt: 'Fashion Collection' },
            { desktopSrc: '/hero-slider-desktop/Slide-5.webp', alt: 'Slide 5' },
            { desktopSrc: '/hero-slider-desktop/Slide-6.webp', alt: 'Slide 6' },
        ],
        favorites: [
            { src: '/images/favorites/1.png', alt: 'Favorite Item 1', link: '/tshirt-top' },
            { src: '/images/favorites/2.png', alt: 'Favorite Item 2', link: '/co-ord-sets' },
            { src: '/images/favorites/3.png', alt: 'Favorite Item 3', link: '/night-bottoms' },
            { src: '/images/favorites/4.png', alt: 'Favorite Item 4', link: '/girls-wear' }
        ],
        categories: [
            { name: 'SUIT SET', title: 'SUIT SET', image: '/images/categories/17670080328782.webp', link: '/suit-set' },
            { name: 'WESTERN DRESS', title: 'WESTERN DRESS', image: '/images/categories/17670078826332.webp', link: '/western-dress' },
            { name: 'CO-ORD SET', title: 'CO-ORD SET', image: '/images/categories/17670079057732.webp', link: '/co-ord-sets' },
            { name: 'Kids', title: 'Kids', image: '/images/categories/17670079000862.webp', link: '/kids' },
            { name: 'INDI-WESTERN', title: 'INDI-WESTERN', image: '/images/categories/17670078974382.webp', link: '/indi-western' },
            { name: 'man\'s', title: 'man\'s', image: '/images/categories/17670078888742.webp', link: '/mens' }
        ],
        banner: {
            image: '/images/Discount-2.png',
            link: '/sales',
            alt: 'Special Discount Offers'
        },
        collections: [
            { title: 'DENIMWEAR', image: '/images/collections/1.png', link: '/night-bottoms' },
            { title: 'INDIGO CHRONICALS', image: '/images/collections/2.png', link: '/tshirt-top' },
            { title: 'EVERYDAY GRACE', image: '/images/collections/3.png', link: '/co-ord-sets' },
            { title: 'ONLINE EXCLUSIVE', image: '/images/collections/4.png', link: '/tshirt-top' },
            { title: 'Short Kurta', image: '/images/collections/5.png', link: '/co-ord-sets' },
            { title: 'CASUAL CHIC', image: '/images/collections/6.png', link: '/tshirt-top' },
            { title: 'SUMMER VIBES', image: '/images/collections/7.png', link: '/tshirt-top' },
            { title: 'ETHNIC FUSION', image: '/images/collections/8.png', link: '/co-ord-sets' }
        ],
        recommended: [] // Array of product IDs
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/content');
            const data = await res.json();
            if (res.ok) {
                // Merge with initial structure to ensure all keys exist
                setContent(prev => ({ ...initialContent, ...data }));
            }
        } catch (error) {
            console.error('Failed to fetch content:', error);
            setNotification({ message: 'Failed to load content', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const saveContent = async (sectionId: string, sectionData: any) => {
        setIsSaving(true);
        setNotification(null);
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section_id: sectionId, content: sectionData }),
            });

            if (!res.ok) throw new Error('Failed to save');

            setNotification({ message: 'Content saved successfully!', type: 'success' });

            // Update local state
            setContent(prev => ({
                ...prev,
                [sectionId]: sectionData
            }));
        } catch (error) {
            console.error('Failed to save content:', error);
            setNotification({ message: 'Failed to save content', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (file: File): Promise<string | null> => {
        try {
            const path = `cms/${Date.now()}_${file.name}`;
            const publicUrl = await uploadImage(file, 'products', path); // Using existing 'products' bucket for now
            return publicUrl;
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
            return null;
        }
    };

    // --- Renderers for each section ---

    const renderHeroEditor = () => {
        const slides = content.hero || [];

        const updateSlide = (index: number, field: string, value: string) => {
            const newSlides = [...slides];
            newSlides[index] = { ...newSlides[index], [field]: value };
            setContent(prev => ({ ...prev, hero: newSlides })); // Optimistic update
        };

        const addSlide = () => {
            const newSlides = [...slides, { desktopSrc: '', alt: 'New Slide' }];
            setContent(prev => ({ ...prev, hero: newSlides }));
        };

        const removeSlide = (index: number) => {
            const newSlides = slides.filter((_: any, i: number) => i !== index);
            setContent(prev => ({ ...prev, hero: newSlides }));
        };

        return (
            <div className="space-y-6">
                <Reorder.Group axis="y" values={slides} onReorder={(newOrder) => setContent(prev => ({ ...prev, hero: newOrder }))} className="space-y-4">
                    {slides.map((slide: any, index: number) => (
                        <Reorder.Item key={slide.desktopSrc || index} value={slide} className="bg-gray-900 p-4 rounded border border-gray-700 flex flex-col gap-3 cursor-move relative">
                            {/* Drag Handle Indicator */}
                            <div className="absolute top-2 right-1/2 transform translate-x-1/2 w-8 h-1 bg-gray-700 rounded-full opacity-50 hover:opacity-100"></div>

                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-silver">Slide {index + 1}</h4>
                                <button onClick={() => removeSlide(index)} className="text-red-500 text-sm hover:underline z-10 relative">Remove</button>
                            </div>

                            <div className="flex gap-4 items-start" onPointerDown={(e) => e.stopPropagation()}>
                                {/* Image Preview & Upload */}
                                <div className="w-1/3">
                                    <div className="relative h-32 w-full bg-black border border-gray-700 rounded mb-2 overflow-hidden flex items-center justify-center">
                                        {slide.desktopSrc ? (
                                            <img src={slide.desktopSrc} alt="Preview" className="h-full object-contain" />
                                        ) : (
                                            <span className="text-gray-600 text-xs">No Image</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="text-xs text-gray-400"
                                        onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                const url = await handleImageUpload(e.target.files[0]);
                                                if (url) updateSlide(index, 'desktopSrc', url);
                                            }
                                        }}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Rec: 1920x1080px</p>
                                </div>

                                {/* Fields */}
                                <div className="w-2/3 space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            value={slide.desktopSrc}
                                            onChange={(e) => updateSlide(index, 'desktopSrc', e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                                        <input
                                            type="text"
                                            value={slide.alt || ''}
                                            onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <div className="flex gap-2">
                    <button onClick={addSlide} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Add Slide</button>
                    <button onClick={() => saveContent('hero', slides)} className="px-4 py-2 bg-silver text-black rounded hover:bg-white font-bold" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        );
    };

    const renderFavoritesEditor = () => {
        const favorites = content.favorites || [];
        // Similar usage... simplified for brevity, following same pattern
        // Logic for 4 fixed items or dynamic list
        const updateFav = (index: number, field: string, value: string) => {
            const newFavs = [...favorites];
            if (!newFavs[index]) newFavs[index] = {};
            newFavs[index] = { ...newFavs[index], [field]: value };
            setContent(prev => ({ ...prev, favorites: newFavs }));
        };

        return (
            <div className="space-y-6">
                <p className="text-sm text-gray-400">Manage your "My Favorites" section (4 items recommended).</p>
                <Reorder.Group axis="y" values={favorites} onReorder={(newOrder) => setContent(prev => ({ ...prev, favorites: newOrder }))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav: any, index: number) => (
                        <Reorder.Item key={fav.src || index} value={fav} className="bg-gray-900 p-4 rounded border border-gray-700 cursor-move relative">
                            {/* Drag Handle Indicator */}
                            <div className="absolute top-2 right-2 text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                            </div>

                            <h4 className="font-semibold text-silver mb-2">Item {index + 1}</h4>
                            {/* Image */}
                            <div className="mb-2" onPointerDown={(e) => e.stopPropagation()}>
                                <div className="h-40 bg-black border border-gray-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                                    {fav.src ? <img src={fav.src} className="h-full object-contain" /> : <span className="text-gray-600">No Img</span>}
                                </div>
                                <input type="file" className="text-xs text-gray-400" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleImageUpload(e.target.files[0]);
                                        if (url) updateFav(index, 'src', url);
                                    }
                                }} />
                                <p className="text-[10px] text-gray-500 mt-1">Rec: 500x500px</p>
                            </div>
                            <div className="space-y-2" onPointerDown={(e) => e.stopPropagation()}>
                                <input placeholder="Link (e.g. /tshirt-top)" value={fav.link || ''} onChange={(e) => updateFav(index, 'link', e.target.value)} className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                                <input placeholder="Alt Text" value={fav.alt || ''} onChange={(e) => updateFav(index, 'alt', e.target.value)} className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                            </div>
                            <button onClick={() => {
                                const newFavs = favorites.filter((_: any, i: number) => i !== index);
                                setContent(prev => ({ ...prev, favorites: newFavs }));
                            }} className="mt-2 text-red-500 text-xs hover:underline">Remove</button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {favorites.length < 4 && (
                    <button onClick={() => {
                        const newFavs = [...favorites, { src: '', link: '', alt: '' }];
                        setContent(prev => ({ ...prev, favorites: newFavs }));
                    }} className="w-full border-2 border-dashed border-gray-700 rounded flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 py-8">
                        + Add Item
                    </button>
                )}

                <button onClick={() => saveContent('favorites', favorites)} className="px-4 py-2 bg-silver text-black rounded hover:bg-white font-bold" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Favorites'}
                </button>
            </div>
        );
    };

    // ... Implement other editors similarly (Categories, Banner, etc.)
    // For brevity, I will implement a Generic List Editor for Categories and Collections as they are similar

    const renderGenericListEditor = (sectionKey: string, fields: string[]) => {
        const items = content[sectionKey] || [];

        const updateItem = (index: number, field: string, value: string) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            setContent(prev => ({ ...prev, [sectionKey]: newItems }));
        };
        const addItem = () => {
            setContent(prev => ({ ...prev, [sectionKey]: [...items, {}] }));
        };
        const removeItem = (index: number) => {
            const newItems = items.filter((_: any, i: number) => i !== index);
            setContent(prev => ({ ...prev, [sectionKey]: newItems }));
        };

        return (
            <div className="space-y-4">
                <Reorder.Group axis="y" values={items} onReorder={(newOrder) => setContent(prev => ({ ...prev, [sectionKey]: newOrder }))} className="space-y-4">
                    {items.map((item: any, index: number) => (
                        <Reorder.Item key={index} value={item} className="bg-gray-900 p-4 rounded border border-gray-700 flex gap-4 cursor-move">
                            {/* Drag Handle */}
                            <div className="flex items-center text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                            </div>

                            {/* Image uploader for 'image' field if present */}
                            {fields.includes('image') && (
                                <div className="w-32 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                                    <div className="h-24 bg-black border border-gray-800 rounded mb-1 flex items-center justify-center overflow-hidden">
                                        {item.image ? <img src={item.image} className="h-full object-contain" /> : <span className="text-gray-600 text-xs">No Img</span>}
                                    </div>
                                    <input type="file" className="text-[10px] text-gray-400 w-full" onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            const url = await handleImageUpload(e.target.files[0]);
                                            if (url) updateItem(index, 'image', url);
                                        }
                                    }} />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {sectionKey === 'categories' ? 'Rec: 294x370px' :
                                            sectionKey === 'collections' ? 'Rec: 300x400px' :
                                                sectionKey === 'recommended' ? 'Rec: 300x400px' : ''}
                                    </p>
                                </div>
                            )}

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3" onPointerDown={(e) => e.stopPropagation()}>
                                {fields.filter(f => f !== 'image').map(field => (
                                    <div key={field}>
                                        <label className="text-[10px] uppercase text-gray-500 block mb-1">{field}</label>
                                        <input
                                            value={item[field] || ''}
                                            onChange={(e) => updateItem(index, field, e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => removeItem(index)} className="text-red-500 self-start text-xs hover:text-red-400" onPointerDown={(e) => e.stopPropagation()}>X</button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <div className="flex gap-2">
                    <button onClick={addItem} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Add Item</button>
                    <button onClick={() => saveContent(sectionKey, items)} className="px-4 py-2 bg-silver text-black rounded hover:bg-white font-bold" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        )
    };

    return (
        <div className="max-w-5xl">
            {notification && (
                <div className={`p-4 mb-4 rounded ${notification.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                    {notification.message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-2">
                {['Hero Banner', 'My Fav', 'Categories', 'Promo Banner', 'Collections', 'Recommended'].map((tab) => {
                    const key = tab.split(' ')[0].toLowerCase();
                    const sectionKey = key === 'my' ? 'favorites' : key === 'hero' ? 'hero' : key === 'promo' ? 'banner' : key === 'categories' ? 'categories' : key === 'recommended' ? 'recommended' : 'collections';
                    return (
                        <button
                            key={sectionKey}
                            onClick={() => setActiveSection(sectionKey)}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeSection === sectionKey ? 'bg-silver text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    )
                })}
            </div>

            <div className="bg-black border border-gray-800 rounded-lg p-6">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading content...</div>
                ) : (
                    <>
                        {activeSection === 'hero' && renderHeroEditor()}
                        {activeSection === 'favorites' && renderFavoritesEditor()}
                        {activeSection === 'categories' && renderGenericListEditor('categories', ['image', 'title', 'link', 'alt'])}
                        {activeSection === 'banner' && (
                            <div className="bg-gray-900 p-4 rounded border border-gray-700">
                                {/* Single Banner Editor */}
                                <div className="mb-4">
                                    <img src={content.banner?.image} className="max-w-sm border border-gray-800 rounded mb-2" />
                                    <input type="file" onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            const url = await handleImageUpload(e.target.files[0]);
                                            if (url) setContent(prev => ({ ...prev, banner: { ...prev.banner, image: url } }));
                                        }
                                    }} />
                                    <p className="text-xs text-gray-500 mt-1">Recommended Size: 1920x500px</p>
                                </div>
                                <div className="space-y-4 max-w-md">
                                    <input placeholder="Link" value={content.banner?.link || ''} onChange={(e) => setContent(prev => ({ ...prev, banner: { ...prev.banner, link: e.target.value } }))} className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                                    <input placeholder="Alt Text" value={content.banner?.alt || ''} onChange={(e) => setContent(prev => ({ ...prev, banner: { ...prev.banner, alt: e.target.value } }))} className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                                    <div className="flex gap-2">
                                        <button onClick={() => saveContent('banner', content.banner)} className="px-4 py-2 bg-silver text-black rounded hover:bg-white font-bold" disabled={isSaving}>Save Banner</button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to remove the banner?')) {
                                                    const emptyBanner = { image: '', link: '', alt: '' };
                                                    setContent(prev => ({ ...prev, banner: emptyBanner }));
                                                    saveContent('banner', emptyBanner);
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-900/50 text-red-200 border border-red-800 rounded hover:bg-red-900"
                                            disabled={isSaving}
                                        >
                                            Remove Banner
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === 'collections' && renderGenericListEditor('collections', ['image', 'title', 'link'])}
                        {activeSection === 'recommended' && renderGenericListEditor('recommended', ['image', 'title', 'price', 'link', 'discount'])}
                    </>
                )}
            </div>
        </div>
    );
};

export default ContentManagementSection;
