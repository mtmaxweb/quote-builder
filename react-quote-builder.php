<?php
/*
Plugin Name: React Quote Builder
Description: Embeds the React Quote Builder application
Version: 1.0
Author: Your Name
*/

function enqueue_react_quote_builder() {
    wp_enqueue_script('react-quote-builder', plugin_dir_url(__FILE__) . 'build/static/js/main.js', array(), '1.0', true);
    wp_enqueue_style('react-quote-builder-style', plugin_dir_url(__FILE__) . 'build/static/css/main.css');
}
add_action('wp_enqueue_scripts', 'enqueue_react_quote_builder');

function react_quote_builder_shortcode() {
    return '<div id="react-quote-builder"></div>';
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
    // You can save it to the database, send emails, etc.
    
    // For now, we'll just return a success response
    return new WP_REST_Response(array('status' => 'success'), 200);
}

