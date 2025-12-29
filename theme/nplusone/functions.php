<?php
/**
 * NPlusOne Theme functions and definitions
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!defined('_S_VERSION')) {
    define('_S_VERSION', '1.0.0');
}

// Theme Setup
function nplusone_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Register nav menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'nplusone'),
        'footer' => esc_html__('Footer Menu', 'nplusone'),
    ));

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    // Add support for custom logo
    add_theme_support('custom-logo', array(
        'height' => 250,
        'width' => 250,
        'flex-width' => true,
        'flex-height' => true,
    ));
}
add_action('after_setup_theme', 'nplusone_setup');

// Enqueue scripts and styles
function nplusone_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('nplusone-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', array(), null);

    // Enqueue main stylesheet
    wp_enqueue_style('nplusone-style', get_stylesheet_uri(), array(), _S_VERSION);
    
    // Enqueue custom styles
    wp_enqueue_style('nplusone-header', get_template_directory_uri() . '/assets/header.css', array(), _S_VERSION);
    wp_enqueue_style('nplusone-footer', get_template_directory_uri() . '/assets/footer.css', array(), _S_VERSION);
    
    // Enqueue navigation script
    wp_enqueue_script('nplusone-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true);

    // Enqueue slider script
    wp_enqueue_script('nplusone-slider', get_template_directory_uri() . '/js/slider.js', array(), _S_VERSION, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'nplusone_scripts');

// Custom post types for products
function nplusone_custom_post_types() {
    register_post_type('product_category', array(
        'labels' => array(
            'name' => __('Product Categories', 'nplusone'),
            'singular_name' => __('Product Category', 'nplusone'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-category',
    ));
}
add_action('init', 'nplusone_custom_post_types');

// Add WooCommerce support
if (class_exists('WooCommerce')) {
    require get_template_directory() . '/inc/woocommerce.php';
}

// Custom widget areas
function nplusone_widgets_init() {
    register_sidebar(array(
        'name' => esc_html__('Footer Widget Area', 'nplusone'),
        'id' => 'footer-1',
        'description' => esc_html__('Add widgets here to appear in your footer.', 'nplusone'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h2 class="widget-title">',
        'after_title' => '</h2>',
    ));
}
add_action('widgets_init', 'nplusone_widgets_init');

// Custom template tags
require get_template_directory() . '/inc/template-tags.php';

// Theme customizer options
require get_template_directory() . '/inc/customizer.php';

// AJAX handlers for cart and wishlist
function nplusone_ajax_add_to_cart() {
    // Add to cart functionality
    check_ajax_referer('nplusone-add-to-cart', 'nonce');
    
    if (isset($_POST['product_id'])) {
        $product_id = absint($_POST['product_id']);
        $quantity = isset($_POST['quantity']) ? absint($_POST['quantity']) : 1;
        
        if (WC()->cart->add_to_cart($product_id, $quantity)) {
            wp_send_json_success();
        }
    }
    
    wp_send_json_error();
}
add_action('wp_ajax_nplusone_add_to_cart', 'nplusone_ajax_add_to_cart');
add_action('wp_ajax_nopriv_nplusone_ajax_add_to_cart', 'nplusone_ajax_add_to_cart');

// Add custom image sizes
add_image_size('nplusone-product-thumbnail', 300, 300, true);
add_image_size('nplusone-product-gallery', 600, 600, true);
add_image_size('nplusone-hero', 1920, 800, true);

/**
 * Register Custom Post Type for Collections
 */
function nplusone_register_collection_post_type() {
    $labels = array(
        'name' => _x('Collections', 'Post Type General Name', 'nplusone'),
        'singular_name' => _x('Collection', 'Post Type Singular Name', 'nplusone'),
        'menu_name' => __('Collections', 'nplusone'),
        'all_items' => __('All Collections', 'nplusone'),
        'add_new' => __('Add New', 'nplusone'),
        'add_new_item' => __('Add New Collection', 'nplusone'),
        'edit_item' => __('Edit Collection', 'nplusone'),
        'new_item' => __('New Collection', 'nplusone'),
        'view_item' => __('View Collection', 'nplusone'),
        'search_items' => __('Search Collections', 'nplusone'),
        'not_found' => __('No collections found', 'nplusone'),
        'not_found_in_trash' => __('No collections found in Trash', 'nplusone'),
    );

    $args = array(
        'label' => __('Collections', 'nplusone'),
        'description' => __('Fashion Collections', 'nplusone'),
        'labels' => $labels,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-grid-view',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'capability_type' => 'post',
        'show_in_rest' => true,
    );

    register_post_type('collection', $args);
}
add_action('init', 'nplusone_register_collection_post_type');

/**
 * Add theme customizer settings
 */
function nplusone_customize_register($wp_customize) {
    // Add section for slider images
    $wp_customize->add_section('nplusone_slider', array(
        'title' => __('Hero Slider', 'nplusone'),
        'priority' => 30,
    ));

    // Add setting for slider images
    $wp_customize->add_setting('nplusone_slider_images', array(
        'default' => '',
        'sanitize_callback' => 'nplusone_sanitize_slider_images',
    ));

    // Add control for slider images
    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'nplusone_slider_images', array(
        'label' => __('Add Slider Images', 'nplusone'),
        'section' => 'nplusone_slider',
        'settings' => 'nplusone_slider_images',
        'mime_type' => 'image',
    )));
}
add_action('customize_register', 'nplusone_customize_register');

/**
 * Sanitize slider images
 */
function nplusone_sanitize_slider_images($value) {
    if (!is_array($value)) {
        return array();
    }
    return array_map('absint', $value);
}

/**
 * Register navigation menus
 */
function nplusone_register_menus() {
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'nplusone'),
        'footer-1' => esc_html__('Footer Menu 1', 'nplusone'),
        'footer-2' => esc_html__('Footer Menu 2', 'nplusone'),
        'footer-3' => esc_html__('Footer Menu 3', 'nplusone'),
    ));
}
add_action('init', 'nplusone_register_menus');

/**
 * Set the content width in pixels
 */
function nplusone_content_width() {
    $GLOBALS['content_width'] = apply_filters('nplusone_content_width', 1170);
}
add_action('after_setup_theme', 'nplusone_content_width', 0); 