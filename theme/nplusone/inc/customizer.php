<?php
/**
 * NPlusOne Theme Customizer
 */

function nplusone_customize_register($wp_customize) {
    // Site Identity Section is already registered by WordPress

    // Colors Section
    $wp_customize->add_setting('primary_color', array(
        'default' => '#000000',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'primary_color', array(
        'label' => __('Primary Color', 'nplusone'),
        'section' => 'colors',
    )));

    // Header Settings Section
    $wp_customize->add_section('header_settings', array(
        'title' => __('Header Settings', 'nplusone'),
        'priority' => 30,
    ));

    $wp_customize->add_setting('sticky_header', array(
        'default' => true,
        'sanitize_callback' => 'nplusone_sanitize_checkbox',
    ));

    $wp_customize->add_control('sticky_header', array(
        'type' => 'checkbox',
        'section' => 'header_settings',
        'label' => __('Enable Sticky Header', 'nplusone'),
    ));

    // Footer Settings Section
    $wp_customize->add_section('footer_settings', array(
        'title' => __('Footer Settings', 'nplusone'),
        'priority' => 90,
    ));

    $wp_customize->add_setting('footer_about_text', array(
        'default' => __('NPlusOne is your premier destination for fashion and clothing.', 'nplusone'),
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('footer_about_text', array(
        'label' => __('About Text', 'nplusone'),
        'section' => 'footer_settings',
        'type' => 'textarea',
    ));

    // Social Media Links
    $social_platforms = array('facebook', 'instagram', 'twitter', 'pinterest');

    foreach ($social_platforms as $platform) {
        $wp_customize->add_setting('social_' . $platform, array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control('social_' . $platform, array(
            'label' => sprintf(__('%s URL', 'nplusone'), ucfirst($platform)),
            'section' => 'footer_settings',
            'type' => 'url',
        ));
    }

    // Homepage Settings Section
    $wp_customize->add_section('homepage_settings', array(
        'title' => __('Homepage Settings', 'nplusone'),
        'priority' => 120,
    ));

    // Hero Slider Settings
    $wp_customize->add_setting('hero_slider_images', array(
        'default' => array(),
        'sanitize_callback' => 'nplusone_sanitize_array',
    ));

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'hero_slider_images', array(
        'label' => __('Hero Slider Images', 'nplusone'),
        'section' => 'homepage_settings',
        'mime_type' => 'image',
    )));
}
add_action('customize_register', 'nplusone_customize_register');

/**
 * Sanitize checkbox values
 */
function nplusone_sanitize_checkbox($checked) {
    return ((isset($checked) && true == $checked) ? true : false);
}

/**
 * Sanitize array values
 */
function nplusone_sanitize_array($values) {
    $multi_values = !is_array($values) ? explode(',', $values) : $values;
    return !empty($multi_values) ? array_map('sanitize_text_field', $multi_values) : array();
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function nplusone_customize_preview_js() {
    wp_enqueue_script('nplusone-customizer', get_template_directory_uri() . '/js/customizer.js', array('customize-preview'), '20151215', true);
}
add_action('customize_preview_init', 'nplusone_customize_preview_js'); 