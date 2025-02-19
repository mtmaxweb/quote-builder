<?php
/*
Plugin Name: React Quote Builder
Description: Embeds the React Quote Builder application
Version: 1.0
Author: Your Name
*/

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

function enqueue_react_quote_builder() {
    $plugin_url = plugin_dir_url(__FILE__);
    
    // Enqueue the main JavaScript bundle
    wp_enqueue_script(
        'react-quote-builder-js',
        $plugin_url . 'build/static/js/main.js',
        array(),
        '1.0',
        true
    );

    // Enqueue the CSS file
    wp_enqueue_style(
        'react-quote-builder-css',
        $plugin_url . 'build/static/css/main.css',
        array(),
        '1.0'
    );

    // Add initialization script
    wp_add_inline_script('react-quote-builder-js', '
        document.addEventListener("DOMContentLoaded", function() {
            var element = document.getElementById("react-quote-builder");
            if (element && window.ReactQuoteBuilder) {
                window.ReactQuoteBuilder.default(element);
            } else {
                console.error("React Quote Builder: Element or initialization function not found");
            }
        });
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_react_quote_builder');

function react_quote_builder_shortcode() {
    return '<div id="react-quote-builder" class="react-quote-builder-container"></div>';
}
add_shortcode('react_quote_builder', 'react_quote_builder_shortcode');

function register_quote_builder_api_routes() {
    register_rest_route('quote-builder/v1', '/submit', array(
        'methods' => 'POST',
        'callback' => 'handle_quote_submission',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'register_quote_builder_api_routes');

function handle_quote_submission($request) {
    $params = $request->get_params();
    
    // Process the quote submission
    // You can add email sending or database storage here
    
    return new WP_REST_Response(array('status' => 'success'), 200);
}

