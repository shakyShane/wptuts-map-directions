<?php

function map_config_option_text()
{}

function map_config_address(){
    printf(('<input type="text" id="map_config_address" name="map_config_address" value="%s" size="50"/>'), get_option('map_config_address'));
}

function map_config_infobox()
{
    printf(('<textarea name="map_config_infobox" id="map_config_infobox" cols="30" rows="3">%s</textarea>'), get_option('map_config_infobox'));
}

function map_config_zoom()
{
    printf(('<input name="map_config_zoom" id="map_config_zoom" value="%s" />'), get_option('map_config_zoom'));
}

function map_config_menu(){

    add_settings_section('map_config', 'Map Configuration', 'map_config_option_text', 'general');
    add_settings_field('map_config_address', 'Address - Longitude and Lattitude', 'map_config_address', 'general', 'map_config');
    add_settings_field('map_config_infobox', 'Map InfoWindow', 'map_config_infobox', 'general', 'map_config');
    add_settings_field('map_config_zoom', 'Map Zoom Level', 'map_config_zoom', 'general', 'map_config');
}
add_action('admin_menu', 'map_config_menu');



function map_init()
{
    register_setting('general', 'map_config_address');
    register_setting('general', 'map_config_infobox');
    register_setting('general', 'map_config_zoom');
}

add_action('admin_init', 'map_init');

function wpmap_map(){

    wp_register_script('google-maps', 'http://maps.google.com/maps/api/js?sensor=false');
    wp_enqueue_script('google-maps');

    wp_register_script('wptuts-custom', get_template_directory_uri() . '/map/map.js', '', '', true);
    wp_enqueue_script('wptuts-custom');

    $output = sprintf(('<div id="map-container" data-map-infowindow="%s" data-map-zoom="%s"></div>'),

        get_option('map_config_infobox'),
        get_option('map_config_zoom')

        );
    return $output;

}
add_shortcode('wpmap_map', 'wpmap_map');

function wpmap_directions(){

    $output = '<div id="dir-container" ></div>';
    return $output;

}
add_shortcode('wpmap_directions_container', 'wpmap_directions');

function wpmap_directions_input(){

    $address_to = get_option('map_config_address');

    $output = '<section id="directions" class="widget">
                <strong>For Driving Directions, Enter your Address below :</strong><br />
                <input id="from-input" type="text" value="" size="10"/>
                <select class="hidden" onchange="" id="unit-input">
                    <option value="imperial" selected="selected">Imperial</option>
                    <option value="metric">Metric</option>
                </select>
                <input id="getDirections" type="button" value="Get Directions" onclick="WPmap.getDirections();"/>
                <input id="map-config-address" type="hidden" value="' . $address_to . '"/>
               </section>';
    return $output;
}
add_shortcode('wpmap_directions_input', 'wpmap_directions_input');


