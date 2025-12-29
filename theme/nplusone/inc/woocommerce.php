<?php
/**
 * WooCommerce specific functions and customizations
 */

/**
 * WooCommerce setup function.
 */
function nplusone_woocommerce_setup() {
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}
add_action('after_setup_theme', 'nplusone_woocommerce_setup');

/**
 * WooCommerce specific scripts & stylesheets.
 */
function nplusone_woocommerce_scripts() {
    wp_enqueue_style('nplusone-woocommerce-style', get_template_directory_uri() . '/assets/css/woocommerce.css');

    $font_path = WC()->plugin_url() . '/assets/fonts/';
    $inline_font = '@font-face {
        font-family: "star";
        src: url("' . $font_path . 'star.eot");
        src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
            url("' . $font_path . 'star.woff") format("woff"),
            url("' . $font_path . 'star.ttf") format("truetype"),
            url("' . $font_path . 'star.svg#star") format("svg");
        font-weight: normal;
        font-style: normal;
    }';

    wp_add_inline_style('nplusone-woocommerce-style', $inline_font);
}
add_action('wp_enqueue_scripts', 'nplusone_woocommerce_scripts');

/**
 * Related Products Args.
 */
function nplusone_woocommerce_related_products_args($args) {
    $defaults = array(
        'posts_per_page' => 4,
        'columns'        => 4,
    );

    $args = wp_parse_args($defaults, $args);

    return $args;
}
add_filter('woocommerce_output_related_products_args', 'nplusone_woocommerce_related_products_args');

/**
 * Product gallery thumbnail columns.
 */
function nplusone_woocommerce_thumbnail_columns() {
    return 4;
}
add_filter('woocommerce_product_thumbnails_columns', 'nplusone_woocommerce_thumbnail_columns');

/**
 * Default loop columns on product archives.
 */
function nplusone_woocommerce_loop_columns() {
    return 4;
}
add_filter('loop_shop_columns', 'nplusone_woocommerce_loop_columns');

/**
 * Products per page.
 */
function nplusone_woocommerce_products_per_page() {
    return 12;
}
add_filter('loop_shop_per_page', 'nplusone_woocommerce_products_per_page');

/**
 * Product gallery thumnbail size.
 */
function nplusone_woocommerce_gallery_thumbnail_size($size) {
    return array(
        'width'  => 100,
        'height' => 100,
        'crop'   => 1,
    );
}
add_filter('woocommerce_get_image_size_gallery_thumbnail', 'nplusone_woocommerce_gallery_thumbnail_size');

/**
 * Enable AJAX add to cart buttons on archives.
 */
function nplusone_woocommerce_enable_ajax_add_to_cart() {
    if (function_exists('is_product') && !is_product()) {
        wp_enqueue_script('wc-add-to-cart');
    }
}
add_action('wp_enqueue_scripts', 'nplusone_woocommerce_enable_ajax_add_to_cart');

/**
 * Quick View AJAX handler
 */
function nplusone_quick_view_ajax() {
    if (!isset($_POST['product_id'])) {
        wp_die();
    }

    $product_id = absint($_POST['product_id']);
    $product = wc_get_product($product_id);

    if (!$product) {
        wp_die();
    }

    ob_start();
    ?>
    <div class="quick-view-content">
        <div class="quick-view-images">
            <?php
            $attachment_ids = $product->get_gallery_image_ids();
            if (!empty($attachment_ids)) {
                foreach ($attachment_ids as $attachment_id) {
                    echo wp_get_attachment_image($attachment_id, 'woocommerce_single');
                }
            }
            ?>
        </div>
        <div class="quick-view-details">
            <h2><?php echo esc_html($product->get_name()); ?></h2>
            <div class="price"><?php echo $product->get_price_html(); ?></div>
            <div class="description"><?php echo wp_kses_post($product->get_short_description()); ?></div>
            <?php woocommerce_template_single_add_to_cart(); ?>
        </div>
    </div>
    <?php
    $output = ob_get_clean();
    wp_send_json_success($output);
}
add_action('wp_ajax_nplusone_quick_view', 'nplusone_quick_view_ajax');
add_action('wp_ajax_nopriv_nplusone_quick_view', 'nplusone_quick_view_ajax'); 