# NPlusOne WordPress Theme

A modern e-commerce WordPress theme for fashion and clothing stores, converted from a Next.js application.

## Features

- Responsive design for all devices
- WooCommerce integration
- Custom product layouts and quick view
- Advanced category navigation
- Hero slider
- Featured products section
- Collections showcase
- Newsletter signup
- Social media integration
- Payment methods display
- Wishlist functionality (requires YITH WooCommerce Wishlist)

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- WooCommerce 6.0 or higher
- YITH WooCommerce Wishlist (recommended)

## Installation

1. Download the theme zip file
2. Go to WordPress Admin > Appearance > Themes > Add New
3. Click "Upload Theme" and select the downloaded zip file
4. Click "Install Now"
5. After installation, click "Activate"

## Required Plugins

The theme requires the following plugins:

1. WooCommerce
2. YITH WooCommerce Wishlist (recommended)

To install the required plugins:

1. Go to WordPress Admin > Plugins > Add New
2. Search for each plugin
3. Click "Install Now" and then "Activate"

## Theme Setup

### Menus

The theme supports multiple menu locations:

1. Primary Menu (Header)
2. Mobile Menu
3. Footer Menu 1 (Quick Links)
4. Footer Menu 2 (Categories)

To set up menus:

1. Go to WordPress Admin > Appearance > Menus
2. Create a new menu or edit existing ones
3. Assign menus to their locations

### Homepage Setup

1. Create a new page
2. Set it as a static homepage:
   - Go to Settings > Reading
   - Select "A static page" for "Your homepage displays"
   - Choose your new page as "Homepage"

### Customizer Settings

Go to Appearance > Customize to configure:

1. Site Identity
   - Logo
   - Site Title
   - Favicon

2. Colors
   - Primary Color
   - Secondary Color
   - Accent Color

3. Typography
   - Font Families
   - Font Sizes

4. Header Settings
   - Sticky Header
   - Transparent Header

5. Footer Settings
   - About Text
   - Social Media Links
   - Payment Methods

6. Homepage Settings
   - Hero Slider Images
   - Featured Categories
   - Collection Display

## WooCommerce Integration

The theme is fully integrated with WooCommerce and includes:

- Custom product templates
- Quick view functionality
- Enhanced cart features
- Wishlist integration
- Product category displays
- Custom checkout process

## Customization

### CSS Customization

The theme uses modular CSS files located in:
```
src/theme/
├── index.css
├── header.css
└── [other component styles]
```

### Template Customization

Main template files:
```
├── index.php
├── header.php
├── footer.php
└── woocommerce/
    └── content-product.php
```

## Support

For support, please:

1. Check the documentation
2. Visit our support forum
3. Contact our support team

## License

This theme is licensed under the GNU General Public License v2 or later

## Credits

- Original Next.js implementation
- WooCommerce team
- WordPress community
- YITH team 