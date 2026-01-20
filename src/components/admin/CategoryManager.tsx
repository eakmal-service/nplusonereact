"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/utils/uploadService';
import { Eye, EyeOff, Edit2, Trash2, Plus } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    image_url?: string;
    parent_id?: string;
    level: number;
    is_visible: boolean;
    slug?: string;
    children?: Category[];
}

interface CategoryManagerProps {
    onCategorySelect?: (category: Category | null) => void;
    selectedCategory?: Category | null;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategorySelect, selectedCategory: externalSelection }) => {
    // Data State
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Selection State
    const [selectedSuper, setSelectedSuper] = useState<Category | null>(null);
    const [selectedParent, setSelectedParent] = useState<Category | null>(null);
    const [selectedChild, setSelectedChild] = useState<Category | null>(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [targetLevel, setTargetLevel] = useState<0 | 1 | 2>(0); // Which column are we adding to?

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        image: null as File | null,
        imageUrl: '',
        parentId: '' as string,
        level: 0,
        isVisible: true
    });

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Derived Lists
    const superCategories = categories.filter(c => c.level === 0);
    const parentCategories = selectedSuper ? categories.filter(c => c.parent_id === selectedSuper.id) : [];
    const childCategories = selectedParent ? categories.filter(c => c.parent_id === selectedParent.id) : [];

    // Handlers
    const handleSuperClick = (cat: Category) => {
        setSelectedSuper(cat);
        setSelectedParent(null); // Reset downstream
        setSelectedChild(null);
        if (onCategorySelect) onCategorySelect(cat);
    };

    const handleParentClick = (cat: Category) => {
        setSelectedParent(cat);
        setSelectedChild(null); // Reset downstream
        if (onCategorySelect) onCategorySelect(cat);
    };

    const handleChildClick = (cat: Category) => {
        setSelectedChild(cat);
        if (onCategorySelect) onCategorySelect(cat);
    };

    // Add/Edit Handlers
    const openAddModal = (level: 0 | 1 | 2) => {
        setModalMode('add');
        setTargetLevel(level);

        let parentId = '';
        if (level === 1 && selectedSuper) parentId = selectedSuper.id;
        if (level === 2 && selectedParent) parentId = selectedParent.id;

        setFormData({
            name: '',
            image: null,
            imageUrl: '',
            parentId: parentId,
            level: level,
            isVisible: true
        });
        setShowModal(true);
    };

    const openEditModal = (cat: Category) => {
        setModalMode('edit');
        setEditingId(cat.id);
        const level = cat.level as 0 | 1 | 2;
        setTargetLevel(level);
        setFormData({
            name: cat.name,
            image: null,
            imageUrl: cat.image_url || '',
            parentId: cat.parent_id || '',
            level: level,
            isVisible: cat.is_visible
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name) return alert("Name is required");

        let imageUrl = formData.imageUrl;
        if (formData.image instanceof File) {
            const path = `categories/${Date.now()}_${formData.image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(path, formData.image);
            if (uploadError) {
                alert("Image upload failed");
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path);
            imageUrl = publicUrl;
        }

        // Generate a base slug
        const baseSlug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;

        // Ensure uniqueness for new categories
        if (modalMode === 'add') {
            let isUnique = false;
            let counter = 0;

            while (!isUnique) {
                // Check if slug exists
                const { data, error } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', slug)
                    .maybeSingle(); // Use maybeSingle to avoid error if 0 rows

                if (error) {
                    console.error("Error checking slug uniqueness", error);
                    return alert("Error checking slug: " + error.message);
                }

                if (!data) {
                    isUnique = true;
                } else {
                    counter++;
                    slug = `${baseSlug}-${counter}`; // Append counter if duplicate
                }

                // Safety break to prevent infinite loops (though unlikely)
                if (counter > 20) {
                    slug = `${baseSlug}-${Date.now()}`; // Fallback to timestamp
                    isUnique = true;
                }
            }
        }

        if (modalMode === 'add') {
            const { error } = await supabase.from('categories').insert({
                name: formData.name,
                image_url: imageUrl,
                parent_id: formData.parentId || null,
                level: formData.level,
                is_visible: formData.isVisible,
                slug: slug
            });
            if (error) return alert("Error adding: " + error.message);
        } else {
            const { error } = await supabase.from('categories').update({
                name: formData.name,
                image_url: imageUrl,
                // parent_id and level usually don't change in simple edit, but let's keep it safe
            }).eq('id', editingId);
            if (error) return alert("Error updating: " + error.message);
        }

        setShowModal(false);
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category AND all its subcategories/products?")) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) alert("Error deleting: " + error.message);
        else fetchCategories();
    };

    const handleToggleVisibility = async (cat: Category) => {
        const { error } = await supabase.from('categories').update({ is_visible: !cat.is_visible }).eq('id', cat.id);
        if (error) alert("Error: " + error.message);
        else fetchCategories();
    };

    return (
        <div className="flex flex-col h-[650px] bg-black text-white p-4 gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h2 className="text-xl font-bold">Category Hierarchy</h2>
                <button onClick={fetchCategories} className="text-sm text-gray-400 hover:text-white">Refresh</button>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
                {/* COLUMN 1: SUPER */}
                <Column
                    title="Super Categories"
                    levelLabel="Level 0"
                    items={superCategories}
                    selectedId={selectedSuper?.id}
                    onSelect={handleSuperClick}
                    onAdd={() => openAddModal(0)}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onToggle={handleToggleVisibility}
                />

                {/* COLUMN 2: PARENT */}
                <Column
                    title={selectedSuper ? `In: ${selectedSuper.name}` : "Parent Categories"}
                    levelLabel="Level 1"
                    items={parentCategories}
                    selectedId={selectedParent?.id}
                    onSelect={handleParentClick}
                    onAdd={() => openAddModal(1)}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onToggle={handleToggleVisibility}
                    disabled={!selectedSuper}
                    emptyMsg={selectedSuper ? "No subcategories yet." : "Select a Super Category first."}
                />

                {/* COLUMN 3: CHILD */}
                <Column
                    title={selectedParent ? `In: ${selectedParent.name}` : "Child Categories"}
                    levelLabel="Level 2"
                    items={childCategories}
                    selectedId={selectedChild?.id}
                    onSelect={handleChildClick}
                    onAdd={() => openAddModal(2)}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onToggle={handleToggleVisibility}
                    disabled={!selectedParent}
                    emptyMsg={selectedParent ? "No child categories yet." : "Select a Parent Category first."}
                />
            </div>

            {/* MODAL */}
            {/* Legend */}
            <div className="flex items-center gap-6 p-4 bg-gray-800/50 rounded-lg border border-gray-800 text-sm opacity-80 mt-auto">
                <span className="font-semibold text-gray-400">Icon Legend:</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400"><Eye size={16} /></span>
                    <span className="text-gray-500">Visible on site</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-red-400"><EyeOff size={16} /></span>
                    <span className="text-gray-500">Hidden from site</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-blue-400"><Edit2 size={16} /></span>
                    <span className="text-gray-500">Edit Category</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-red-500"><Trash2 size={16} /></span>
                    <span className="text-gray-500">Delete Category</span>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Add Category' : 'Edit Category'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-1">Name</label>
                                <input
                                    className="w-full bg-black border border-gray-700 p-2 rounded text-white"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Category Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-1">Image</label>
                                <input type="file" className="text-sm text-gray-400" onChange={e => e.target.files && setFormData({ ...formData, image: e.target.files[0] })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for Column
const Column = ({ title, levelLabel, items, selectedId, onSelect, onAdd, onEdit, onDelete, onToggle, disabled, emptyMsg }: any) => {
    return (
        <div className={`flex flex-col bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Header */}
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-sm text-white">{title}</h3>
                    <span className="text-[10px] text-gray-400 uppercase">{levelLabel}</span>
                </div>
                <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded shadow-lg transition-colors group relative">
                    <Plus size={20} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-blue-900 text-white rounded border border-blue-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        Add {levelLabel}
                    </span>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {items.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                        <p className="text-gray-500 text-sm">{emptyMsg}</p>
                    </div>
                ) : (
                    items.map((item: any, index: number) => {
                        const tooltipPos = index === 0 ? "top-full mt-2" : "bottom-full mb-2";
                        return (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className={`
                                    group flex items-center justify-between p-2 rounded cursor-pointer text-sm transition-all
                                    ${item.id === selectedId
                                        ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent'
                                    }
                                    ${!item.is_visible ? 'opacity-60' : ''}
                                `}
                            >
                                <span className="truncate flex-1">{item.name}</span>

                                {/* Hover Actions */}
                                <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${item.id === selectedId ? 'opacity-100' : ''}`}>
                                    <div className="relative group/btn">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggle(item); }}
                                            className={`p-1.5 rounded-md hover:bg-gray-700 transition-colors ${item.is_visible ? 'text-gray-400 hover:text-white' : 'text-red-400 hover:text-red-300'}`}
                                        >
                                            {item.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <span className={`absolute ${tooltipPos} left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg`}>
                                            {item.is_visible ? "Hide Category" : "Show Category"}
                                        </span>
                                    </div>

                                    <div className="relative group/btn">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                            className="p-1.5 rounded-md text-blue-400 hover:bg-blue-900/40 hover:text-blue-300 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <span className={`absolute ${tooltipPos} left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg`}>
                                            Edit Category
                                        </span>
                                    </div>

                                    <div className="relative group/btn">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                            className="p-1.5 rounded-md text-red-500 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <span className={`absolute ${tooltipPos} left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg`}>
                                            Delete Category
                                        </span>
                                    </div>
                                    <span className="text-gray-600">›</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
