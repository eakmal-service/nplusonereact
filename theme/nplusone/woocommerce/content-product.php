<?php
/**
 * The template for displaying product content within loops
 */

defined('ABSPATH') || exit;

global $product;

// Ensure visibility
if (empty($product) || !$product->is_visible()) {
    return;
}
?>
<li <?php wc_product_class('product-card', $product); ?>>
    <?php
    /**
     * Hook: woocommerce_before_shop_loop_item.
     */
    do_action('woocommerce_before_shop_loop_item');
    ?>

    <div class="product-card-image">
        <?php
        /**
         * Hook: woocommerce_before_shop_loop_item_title.
         */
        do_action('woocommerce_before_shop_loop_item_title');

        // Sale Flash
        if ($product->is_on_sale()) : ?>
            <span class="onsale"><?php esc_html_e('Sale!', 'nplusone'); ?></span>
        <?php endif;

        // Wishlist Button
        if (function_exists('YITH_WCWL')) :
            echo do_shortcode('[yith_wcwl_add_to_wishlist]');
        endif;
        ?>

        <div class="product-card-actions">
            <?php
            // Quick View Button
            if (function_exists('YITH_WCQV_Frontend')) : ?>
                <a href="#" class="quick-view" data-product_id="<?php echo esc_attr($product->get_id()); ?>">
                    <span class="screen-reader-text"><?php esc_html_e('Quick View', 'nplusone'); ?></span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                    </svg>
                </a>
            <?php endif; ?>

            <?php
            // Add to Cart Button
            woocommerce_template_loop_add_to_cart();
            ?>
        </div>
    </div>

    <div class="product-card-content">
        <?php
        /**
         * Hook: woocommerce_shop_loop_item_title.
         */
        do_action('woocommerce_shop_loop_item_title');
        ?>

        <h2 class="woocommerce-loop-product__title">
            <a href="<?php echo esc_url(get_permalink()); ?>">
                <?php echo esc_html(get_the_title()); ?>
            </a>
        </h2>

        <?php
        /**
         * Hook: woocommerce_after_shop_loop_item_title.
         */
        do_action('woocommerce_after_shop_loop_item_title');
        ?>

        <div class="price-container">
            <?php if ($price_html = $product->get_price_html()) : ?>
                <span class="price"><?php echo $price_html; ?></span>
            <?php endif; ?>
        </div>

        <?php
        // Display product categories
        echo wc_get_product_category_list($product->get_id(), ', ', '<div class="product-categories">', '</div>');
        ?>
    </div>

    <?php
    /**
     * Hook: woocommerce_after_shop_loop_item.
     */
    do_action('woocommerce_after_shop_loop_item');
    ?>
</li>

<?php
// Quick View Modal Script
if (!function_exists('nplusone_quick_view_script')) {
    function nplusone_quick_view_script() {
        ?>
        <script>
        jQuery(document).ready(function($) {
            $('.quick-view-btn').on('click', function(e) {
                e.preventDefault();
                var productId = $(this).data('product-id');
                $('#quick-view-' + productId).fadeIn();
            });

            $('.quick-view-modal').on('click', function(e) {
                if ($(e.target).hasClass('quick-view-modal')) {
                    $(this).fadeOut();
                }
            });
        });
        </script>
        <?php
    }
    add_action('wp_footer', 'nplusone_quick_view_script');
} 