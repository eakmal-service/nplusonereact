<?php
/**
 * The template for displaying the footer
 */
?>

</div><!-- #content -->

<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-columns">
            <!-- Need Help Column -->
            <div class="footer-column">
                <h3><?php esc_html_e('NEED HELP', 'nplusone'); ?></h3>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-1',
                    'menu_class' => 'footer-menu',
                    'container' => false,
                    'fallback_cb' => false,
                ));
                ?>
                <div class="service-features">
                    <div class="feature">
                        <span class="feature-icon">₹</span>
                        <span class="feature-text"><?php esc_html_e('COD Available', 'nplusone'); ?></span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">↺</span>
                        <span class="feature-text"><?php esc_html_e('30 Days Easy Returns & Exchanges', 'nplusone'); ?></span>
                    </div>
                </div>
            </div>

            <!-- Company Column -->
            <div class="footer-column">
                <h3><?php esc_html_e('COMPANY', 'nplusone'); ?></h3>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-2',
                    'menu_class' => 'footer-menu',
                    'container' => false,
                    'fallback_cb' => false,
                ));
                ?>
            </div>

            <!-- More Info Column -->
            <div class="footer-column">
                <h3><?php esc_html_e('MORE INFO', 'nplusone'); ?></h3>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-3',
                    'menu_class' => 'footer-menu',
                    'container' => false,
                    'fallback_cb' => false,
                ));
                ?>
            </div>
        </div>

        <!-- App Download Section -->
        <div class="app-download">
            <h3><?php esc_html_e('EXPERIENCE THE SOULED STORE APP', 'nplusone'); ?></h3>
            <div class="app-buttons">
                <a href="#" class="app-button" target="_blank" rel="noopener noreferrer">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/images/google-play.png'); ?>" alt="<?php esc_attr_e('Get it on Google Play', 'nplusone'); ?>">
                </a>
                <a href="#" class="app-button" target="_blank" rel="noopener noreferrer">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/images/app-store.png'); ?>" alt="<?php esc_attr_e('Download on the App Store', 'nplusone'); ?>">
                </a>
            </div>
        </div>

        <!-- Social Media Links -->
        <div class="social-media">
            <p><?php esc_html_e('Follow Us:', 'nplusone'); ?></p>
            <div class="social-links">
                <?php
                $social_links = array(
                    'facebook' => get_theme_mod('social_facebook', '#'),
                    'instagram' => get_theme_mod('social_instagram', '#'),
                    'snapchat' => get_theme_mod('social_snapchat', '#'),
                    'twitter' => get_theme_mod('social_twitter', '#')
                );

                foreach ($social_links as $platform => $url) : ?>
                    <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo esc_attr($platform); ?>">
                        <?php include get_template_directory() . '/images/icons/' . $platform . '.svg'; ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</footer>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html> 