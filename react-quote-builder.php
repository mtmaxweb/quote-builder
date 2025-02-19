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
    
    // Get the build directory path
    $build_dir = plugin_dir_path(__FILE__) . 'build/_next/static/';
    
    // Find the JS directory (it has a dynamic hash name)
    $js_dirs = glob($build_dir . '[A-Za-z0-9]*', GLOB_ONLYDIR);
    $js_dir_name = basename(end($js_dirs)); // Get the last directory name
    
    // Enqueue the framework JS
    $framework_files = glob($build_dir . 'chunks/framework-*.js');
    if (!empty($framework_files)) {
        $framework_file = basename(end($framework_files));
        wp_enqueue_script(
            'react-quote-builder-framework',
            $plugin_url . 'build/_next/static/chunks/' . $framework_file,
            array(),
            '1.0.0',
            true
        );
    }

    // Enqueue the main JS
    $main_files = glob($build_dir . 'chunks/main-*.js');
    if (!empty($main_files)) {
        $main_file = basename(end($main_files));
        wp_enqueue_script(
            'react-quote-builder-main',
            $plugin_url . 'build/_next/static/chunks/' . $main_file,
            array('react-quote-builder-framework'),
            '1.0.0',
            true
        );
    }

    // Enqueue additional chunks if they exist
    $chunk_files = glob($build_dir . $js_dir_name . '/*.js');
    if (!empty($chunk_files)) {
        foreach ($chunk_files as $chunk_file) {
            $chunk_name = basename($chunk_file);
            wp_enqueue_script(
                'react-quote-builder-' . $chunk_name,
                $plugin_url . 'build/_next/static/' . $js_dir_name . '/' . $chunk_name,
                array('react-quote-builder-main'),
                '1.0.0',
                true
            );
        }
    }

    // Enqueue the CSS
    $css_files = glob($build_dir . 'css/*.css');
    if (!empty($css_files)) {
        foreach ($css_files as $css_file) {
            $css_name = basename($css_file);
            wp_enqueue_style(
                'react-quote-builder-' . $css_name,
                $plugin_url . 'build/_next/static/css/' . $css_name,
                array(),
                '1.0.0'
            );
        }
    }

    wp_add_inline_script('react-quote-builder-main', '
        function initReactQuoteBuilder() {
            var element = document.getElementById("react-quote-builder");
            if (element && window.ReactQuoteBuilder && window.ReactQuoteBuilder.default) {
                window.ReactQuoteBuilder.default(element);
            } else {
                console.error("React Quote Builder: Initialization failed.");
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

