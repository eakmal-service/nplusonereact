
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone_number: string | null
                    email: string | null
                    avatar_url: string | null
                    address_line1: string | null
                    address_line2: string | null
                    city: string | null
                    state: string | null
                    pincode: string | null
                    country: string | null
                    is_admin: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone_number?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    address_line1?: string | null
                    address_line2?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    country?: string | null
                    is_admin?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone_number?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    address_line1?: string | null
                    address_line2?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    country?: string | null
                    is_admin?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            products: {
                Row: {
                    id: string
                    title: string
                    brand_name: string | null
                    style_code: string | null
                    short_description: string | null
                    description: string | null
                    mrp: number
                    selling_price: number
                    price: number | null // Generated
                    sale_price: number | null // Generated
                    category: 'SUIT SET' | 'WESTERN WEAR' | 'CO-ORD SET' | 'KIDS WEAR' | 'INDO-WESTERN' | 'MENS WEAR'
                    subcategory: string | null
                    image_url: string | null
                    image_urls: string[] | null
                    video_url: string | null
                    stock_quantity: number | null
                    in_stock: boolean | null // Generated
                    sku_map: Json | null
                    default_sku: string | null
                    color_options: Json | null
                    main_color: string | null
                    sizes: string[] | null
                    fabric: string | null
                    work_type: string | null
                    neck_design: string | null
                    sleeve_length: string | null
                    fit_type: string | null
                    bottom_type: string | null
                    set_contains: string | null
                    product_weight: number | null
                    wash_care: string | null
                    search_keywords: string[] | null
                    slug: string | null
                    meta_title: string | null
                    meta_description: string | null
                    alt_text: string | null
                    hsn_code: string | null
                    gst_percentage: number | null
                    view_count: number | null
                    average_rating: number | null
                    status: string | null
                    is_admin_uploaded: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    brand_name?: string | null
                    style_code?: string | null
                    short_description?: string | null
                    description?: string | null
                    mrp: number
                    selling_price: number
                    category: 'SUIT SET' | 'WESTERN WEAR' | 'CO-ORD SET' | 'KIDS WEAR' | 'INDO-WESTERN' | 'MENS WEAR'
                    subcategory?: string | null
                    image_url?: string | null
                    image_urls?: string[] | null
                    video_url?: string | null
                    stock_quantity?: number | null
                    sku_map?: Json | null
                    default_sku?: string | null
                    color_options?: Json | null
                    main_color?: string | null
                    sizes?: string[] | null
                    fabric?: string | null
                    work_type?: string | null
                    neck_design?: string | null
                    sleeve_length?: string | null
                    fit_type?: string | null
                    bottom_type?: string | null
                    set_contains?: string | null
                    product_weight?: number | null
                    wash_care?: string | null
                    search_keywords?: string[] | null
                    slug?: string | null
                    meta_title?: string | null
                    meta_description?: string | null
                    alt_text?: string | null
                    hsn_code?: string | null
                    gst_percentage?: number | null
                    view_count?: number | null
                    average_rating?: number | null
                    status?: string | null
                    is_admin_uploaded?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    brand_name?: string | null
                    style_code?: string | null
                    short_description?: string | null
                    description?: string | null
                    mrp?: number
                    selling_price?: number
                    category?: 'SUIT SET' | 'WESTERN WEAR' | 'CO-ORD SET' | 'KIDS WEAR' | 'INDO-WESTERN' | 'MENS WEAR'
                    subcategory?: string | null
                    image_url?: string | null
                    image_urls?: string[] | null
                    video_url?: string | null
                    stock_quantity?: number | null
                    sku_map?: Json | null
                    default_sku?: string | null
                    color_options?: Json | null
                    main_color?: string | null
                    sizes?: string[] | null
                    fabric?: string | null
                    work_type?: string | null
                    neck_design?: string | null
                    sleeve_length?: string | null
                    fit_type?: string | null
                    bottom_type?: string | null
                    set_contains?: string | null
                    product_weight?: number | null
                    wash_care?: string | null
                    search_keywords?: string[] | null
                    slug?: string | null
                    meta_title?: string | null
                    meta_description?: string | null
                    alt_text?: string | null
                    hsn_code?: string | null
                    gst_percentage?: number | null
                    view_count?: number | null
                    average_rating?: number | null
                    status?: string | null
                    is_admin_uploaded?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            cart_items: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    quantity: number | null
                    selected_size: string | null
                    selected_color: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    quantity?: number | null
                    selected_size?: string | null
                    selected_color?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    quantity?: number | null
                    selected_size?: string | null
                    selected_color?: string | null
                    created_at?: string | null
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    subtotal: number
                    tax_total: number | null
                    shipping_cost: number | null
                    discount_total: number | null
                    total_amount: number
                    coupon_code: string | null
                    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | null
                    payment_status: string | null
                    payment_method: string | null
                    payment_id: string | null
                    shipping_address: Json
                    tracking_id: string | null
                    carrier: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    subtotal: number
                    tax_total?: number | null
                    shipping_cost?: number | null
                    discount_total?: number | null
                    total_amount: number
                    coupon_code?: string | null
                    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | null
                    payment_status?: string | null
                    payment_method?: string | null
                    payment_id?: string | null
                    shipping_address: Json
                    tracking_id?: string | null
                    carrier?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    subtotal?: number
                    tax_total?: number | null
                    shipping_cost?: number | null
                    discount_total?: number | null
                    total_amount?: number
                    coupon_code?: string | null
                    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | null
                    payment_status?: string | null
                    payment_method?: string | null
                    payment_id?: string | null
                    shipping_address?: Json
                    tracking_id?: string | null
                    carrier?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    product_name: string
                    selected_size: string | null
                    selected_color: string | null
                    quantity: number
                    price_per_unit: number
                    inventory_sku: string | null
                    gst_percentage: number | null
                    hsn_code: string | null
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    product_name: string
                    selected_size?: string | null
                    selected_color?: string | null
                    quantity: number
                    price_per_unit: number
                    inventory_sku?: string | null
                    gst_percentage?: number | null
                    hsn_code?: string | null
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    product_name?: string
                    selected_size?: string | null
                    selected_color?: string | null
                    quantity?: number
                    price_per_unit?: number
                    inventory_sku?: string | null
                    gst_percentage?: number | null
                    hsn_code?: string | null
                }
            }
            coupons: {
                Row: {
                    id: string
                    code: string
                    type: 'PERCENTAGE' | 'FIXED_AMOUNT'
                    value: number
                    min_order_value: number | null
                    max_discount_amount: number | null
                    start_date: string | null
                    end_date: string | null
                    usage_limit: number | null
                    usage_count: number | null
                    is_active: boolean | null
                    status: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    code: string
                    type: 'PERCENTAGE' | 'FIXED_AMOUNT'
                    value: number
                    min_order_value?: number | null
                    max_discount_amount?: number | null
                    start_date?: string | null
                    end_date?: string | null
                    usage_limit?: number | null
                    usage_count?: number | null
                    is_active?: boolean | null
                    status?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    code?: string
                    type?: 'PERCENTAGE' | 'FIXED_AMOUNT'
                    value?: number
                    min_order_value?: number | null
                    max_discount_amount?: number | null
                    start_date?: string | null
                    end_date?: string | null
                    usage_limit?: number | null
                    usage_count?: number | null
                    is_active?: boolean | null
                    status?: string | null
                    created_at?: string | null
                }
            }
            website_content: {
                Row: {
                    section_id: string
                    content: Json
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    section_id: string
                    content: Json
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    section_id?: string
                    content?: Json
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            content_banners: {
                Row: {
                    id: string
                    title: string | null
                    image_url_desktop: string
                    image_url_mobile: string | null
                    link_url: string | null
                    section: string | null
                    display_order: number | null
                    is_active: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    title?: string | null
                    image_url_desktop: string
                    image_url_mobile?: string | null
                    link_url?: string | null
                    section?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string | null
                    image_url_desktop?: string
                    image_url_mobile?: string | null
                    link_url?: string | null
                    section?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                }
            }
        }
    }
}
