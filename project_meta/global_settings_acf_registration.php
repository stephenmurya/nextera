<?php
/**
 * Canonical ACF + WPGraphQL registration for global site settings.
 *
 * Paste this into your theme's functions.php or a small custom plugin.
 * It extends the existing `globalSettings -> globalContent` contract used by Next.js.
 */

/**
 * 1. Register the ACF Options Page for Global Settings
 */
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Global Site Settings',
        'menu_title' => 'Site Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'icon_url' => 'dashicons-admin-site',
        'show_in_graphql' => true,
        'graphql_field_name' => 'globalSettings',
    ));
}

/**
 * 2. Define the Global Fields in Code
 */
if (function_exists('acf_add_local_field_group')):

acf_add_local_field_group(array(
    'key' => 'group_global_settings',
    'title' => 'Global Content',
    'fields' => array(
        array(
            'key' => 'field_site_name',
            'label' => 'Site Name',
            'name' => 'site_name',
            'type' => 'text',
            'show_in_graphql' => true,
            'graphql_field_name' => 'siteName',
        ),
        array(
            'key' => 'field_default_seo_title',
            'label' => 'Default SEO Title',
            'name' => 'default_seo_title',
            'type' => 'text',
            'show_in_graphql' => true,
            'graphql_field_name' => 'defaultSeoTitle',
        ),
        array(
            'key' => 'field_default_seo_description',
            'label' => 'Default SEO Description',
            'name' => 'default_seo_description',
            'type' => 'textarea',
            'rows' => 3,
            'show_in_graphql' => true,
            'graphql_field_name' => 'defaultSeoDescription',
        ),
        array(
            'key' => 'field_default_seo_image',
            'label' => 'Default SEO Image',
            'name' => 'default_seo_image',
            'type' => 'image',
            'return_format' => 'array',
            'preview_size' => 'medium',
            'library' => 'all',
            'show_in_graphql' => true,
            'graphql_field_name' => 'defaultSeoImage',
        ),
        array(
            'key' => 'field_twitter_handle',
            'label' => 'Twitter Handle',
            'name' => 'twitter_handle',
            'type' => 'text',
            'instructions' => 'Enter with or without the @ prefix.',
            'show_in_graphql' => true,
            'graphql_field_name' => 'twitterHandle',
        ),
        array(
            'key' => 'field_footer_contact_data',
            'label' => 'Footer Contact Data',
            'name' => 'footer_contact_data',
            'type' => 'wysiwyg',
            'toolbar' => 'basic',
            'media_upload' => 0,
            'tabs' => 'all',
            'show_in_graphql' => true,
            'graphql_field_name' => 'footerContactData',
        ),
        array(
            'key' => 'field_header_nav',
            'label' => 'Header Navigation',
            'name' => 'header_nav',
            'type' => 'repeater',
            'layout' => 'table',
            'show_in_graphql' => true,
            'graphql_field_name' => 'headerNav',
            'sub_fields' => array(
                array(
                    'key' => 'field_hn_label',
                    'label' => 'Label',
                    'name' => 'label',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'label',
                ),
                array(
                    'key' => 'field_hn_href',
                    'label' => 'URL',
                    'name' => 'href',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'href',
                ),
            ),
        ),
        array(
            'key' => 'field_footer_nav',
            'label' => 'Footer Navigation',
            'name' => 'footer_nav',
            'type' => 'repeater',
            'layout' => 'table',
            'show_in_graphql' => true,
            'graphql_field_name' => 'footerNav',
            'sub_fields' => array(
                array(
                    'key' => 'field_fn_label',
                    'label' => 'Label',
                    'name' => 'label',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'label',
                ),
                array(
                    'key' => 'field_fn_href',
                    'label' => 'URL',
                    'name' => 'href',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'href',
                ),
            ),
        ),
        array(
            'key' => 'field_social_links',
            'label' => 'Social Links',
            'name' => 'social_links',
            'type' => 'repeater',
            'layout' => 'table',
            'show_in_graphql' => true,
            'graphql_field_name' => 'socialLinks',
            'sub_fields' => array(
                array(
                    'key' => 'field_sl_platform',
                    'label' => 'Platform Name',
                    'name' => 'platform',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'platform',
                ),
                array(
                    'key' => 'field_sl_url',
                    'label' => 'URL',
                    'name' => 'url',
                    'type' => 'url',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'url',
                ),
            ),
        ),
        array(
            'key' => 'field_global_cta',
            'label' => 'Global CTA (Navbar Button)',
            'name' => 'global_cta',
            'type' => 'group',
            'show_in_graphql' => true,
            'graphql_field_name' => 'globalCta',
            'sub_fields' => array(
                array(
                    'key' => 'field_gc_label',
                    'label' => 'Label',
                    'name' => 'label',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'label',
                ),
                array(
                    'key' => 'field_gc_href',
                    'label' => 'URL',
                    'name' => 'href',
                    'type' => 'text',
                    'show_in_graphql' => true,
                    'graphql_field_name' => 'href',
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'global-settings',
            ),
        ),
    ),
    'show_in_graphql' => true,
    'graphql_field_name' => 'globalContent',
));

endif;
