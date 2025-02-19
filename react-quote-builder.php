<?php
/*
Plugin Name: React Quote Builder
Description: Embeds the React Quote Builder application
Version: 1.0.0
Author: Your Name
*/

if (!defined('ABSPATH')) {
    exit;
}

function enqueue_react_quote_builder() {
    $plugin_url = plugin_dir_url(__FILE__);
    $build_dir = $plugin_url . 'build/_next/static/';

    // Find the main JS file
    $js_files = glob(plugin_dir_path(__FILE__) . 'build/_next/static/js/*.js');
    if (!empty($js_files)) {
        $js_file = basename(end($js_files));
        wp_enqueue_script(
            'react-quote-builder-js',
            $build_dir . 'js/' . $js_file,
            array(),
            '1.0.0',
            true
        );
    }

    // Find the main CSS file
    $css_files = glob(plugin_dir_path(__FILE__) . 'build/_next/static/css/*.css');
    if (!empty($css_files)) {
        $css_file = basename(end($css_files));
        wp_enqueue_style(
            'react-quote-builder-css',
            $build_dir . 'css/' . $css_file,
            array(),
            '1.0.0'
        );
    }

    wp_add_inline_script('react-quote-builder-js', '
        function initReactQuoteBuilder() {
            var element = document.getElementById("react-quote-builder");
            if (element && window.ReactQuoteBuilder && window.ReactQuoteBuilder.default) {
                window.ReactQuoteBuilder.default(element);
            } else {
                console.error("React Quote Builder: Initialization failed. Element or ReactQuoteBuilder not found.");
                console.log("Element:", element);
                console.log("ReactQuoteBuilder:", window.ReactQuoteBuilder);
            }
        }

        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(initReactQuoteBuilder, 1);
        } else {
            document.addEventListener("DOMContentLoaded", initReactQuoteBuilder);
        }
    ', 'after');
}
add_action('wp_enqueue_scripts', 'enqueue_react_quote_builder');

function react_quote_builder_shortcode() {
    enqueue_react_quote_builder();
    return '<div id="react-quote-builder" class="react-quote-builder-container"></div>';
}
add_shortcode('react_quote_builder', 'react_quote_builder_shortcode');

add_action('wp_footer', function() {
    ?>
    <script>
    console.log('ReactQuoteBuilder object:', window.ReactQuoteBuilder);
    console.log('Quote builder element:', document.getElementById('react-quote-builder'));
    console.log('Main script loaded:', !!document.querySelector('script[src*="_next/static/js"]'));
    console.log('Main style loaded:', !!document.querySelector('link[href*="_next/static/css"]'));
    </script>
    <?php
});

