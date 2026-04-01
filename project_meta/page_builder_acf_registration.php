<?php
/**
 * Canonical ACF + WPGraphQL registration for the headless Page Builder.
 *
 * Paste this into the active WordPress theme's functions.php file
 * or, preferably, move it into a small custom plugin / mu-plugin.
 *
 * Important:
 * 1. Back up the existing ACF field group first.
 * 2. Deactivate or delete the old GUI-based "Page Builder" field group after this is active.
 *    Leaving the old group enabled can keep duplicate GraphQL types in the schema.
 */

add_action('acf/init', static function (): void {
    if (! function_exists('acf_add_local_field_group')) {
        return;
    }

    $text_field = static function (
        string $key,
        string $label,
        string $name,
        ?string $graphqlFieldName = null,
        bool $required = false
    ): array {
        return [
            'key' => $key,
            'label' => $label,
            'name' => $name,
            'type' => 'text',
            'required' => $required ? 1 : 0,
            'show_in_graphql' => 1,
            'graphql_field_name' => $graphqlFieldName ?? $name,
        ];
    };

    $textarea_field = static function (
        string $key,
        string $label,
        string $name,
        ?string $graphqlFieldName = null,
        bool $required = false
    ): array {
        return [
            'key' => $key,
            'label' => $label,
            'name' => $name,
            'type' => 'textarea',
            'required' => $required ? 1 : 0,
            'rows' => 4,
            'new_lines' => 'br',
            'show_in_graphql' => 1,
            'graphql_field_name' => $graphqlFieldName ?? $name,
        ];
    };

    $anchor_field = static function (string $key): array {
        return [
            'key' => $key,
            'label' => 'Anchor',
            'name' => 'anchor',
            'type' => 'text',
            'instructions' => 'Optional in-page anchor, for example: waitlist or features',
            'show_in_graphql' => 1,
            'graphql_field_name' => 'anchor',
        ];
    };

    $cta_group = static function (
        string $key,
        string $label,
        string $name,
        string $graphqlFieldName
    ) use ($text_field): array {
        return [
            'key' => $key,
            'label' => $label,
            'name' => $name,
            'type' => 'group',
            'layout' => 'block',
            'show_in_graphql' => 1,
            'graphql_field_name' => $graphqlFieldName,
            'sub_fields' => [
                $text_field("{$key}_label", 'Label', 'label', 'label', true),
                $text_field("{$key}_href", 'Href', 'href', 'href', true),
            ],
        ];
    };

    $item_repeater = static function (
        string $key,
        string $label,
        string $name,
        string $graphqlFieldName
    ) use ($text_field, $textarea_field): array {
        return [
            'key' => $key,
            'label' => $label,
            'name' => $name,
            'type' => 'repeater',
            'layout' => 'row',
            'button_label' => 'Add Item',
            'show_in_graphql' => 1,
            'graphql_field_name' => $graphqlFieldName,
            'sub_fields' => [
                $text_field("{$key}_title", 'Title', 'title', 'title', true),
                $textarea_field("{$key}_description", 'Description', 'description', 'description'),
                $text_field("{$key}_icon", 'Icon', 'icon', 'icon'),
            ],
        ];
    };

    acf_add_local_field_group([
        'key' => 'group_page_builder',
        'title' => 'Page Builder',
        'active' => true,
        'show_in_graphql' => 1,
        'graphql_field_name' => 'pageBuilder',
        'graphql_type_name' => 'PageBuilder',
        'map_graphql_types_from_location_rules' => 1,
        'graphql_types' => ['Page'],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ],
            ],
        ],
        'fields' => [
            [
                'key' => 'field_page_builder_sections',
                'label' => 'Sections',
                'name' => 'sections',
                'type' => 'flexible_content',
                'button_label' => 'Add Section',
                'show_in_graphql' => 1,
                'graphql_field_name' => 'sections',
                'layouts' => [
                    [
                        'key' => 'layout_page_builder_hero',
                        'name' => 'hero',
                        'label' => 'Hero',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_hero_anchor'),
                            $text_field('field_hero_eyebrow', 'Eyebrow', 'eyebrow', 'eyebrow'),
                            $text_field('field_hero_headline', 'Headline', 'headline', 'headline', true),
                            $textarea_field('field_hero_body', 'Body', 'body', 'body'),
                            $cta_group('field_hero_primarycta', 'Primary CTA', 'primarycta', 'primaryCta'),
                            $cta_group('field_hero_secondarycta', 'Secondary CTA', 'secondarycta', 'secondaryCta'),
                            [
                                'key' => 'field_hero_backgroundimage',
                                'label' => 'Background Image',
                                'name' => 'backgroundimage',
                                'type' => 'image',
                                'return_format' => 'id',
                                'preview_size' => 'medium',
                                'library' => 'all',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'backgroundImage',
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_feature_grid',
                        'name' => 'feature_grid',
                        'label' => 'Feature Grid',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_feature_grid_anchor'),
                            $text_field('field_feature_grid_headline', 'Headline', 'headline', 'headline'),
                            $textarea_field('field_feature_grid_intro', 'Intro', 'intro', 'intro'),
                            $item_repeater(
                                'field_feature_grid_items',
                                'Items',
                                'items',
                                'featureGridItems'
                            ),
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_rich_text',
                        'name' => 'rich_text',
                        'label' => 'Rich Text',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_rich_text_anchor'),
                            [
                                'key' => 'field_rich_text_html',
                                'label' => 'HTML',
                                'name' => 'html',
                                'type' => 'wysiwyg',
                                'required' => 1,
                                'tabs' => 'all',
                                'toolbar' => 'full',
                                'media_upload' => 1,
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'html',
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_problem_solution',
                        'name' => 'problem_solution',
                        'label' => 'Problem / Solution',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_problem_solution_anchor'),
                            $text_field(
                                'field_problem_solution_problem_headline',
                                'Problem Headline',
                                'problem_headline',
                                'problemHeadline',
                                true
                            ),
                            $textarea_field(
                                'field_problem_solution_problem_description',
                                'Problem Description',
                                'problem_description',
                                'problemDescription'
                            ),
                            $text_field(
                                'field_problem_solution_solution_headline',
                                'Solution Headline',
                                'solution_headline',
                                'solutionHeadline',
                                true
                            ),
                            $textarea_field(
                                'field_problem_solution_solution_description',
                                'Solution Description',
                                'solution_description',
                                'solutionDescription'
                            ),
                            [
                                'key' => 'field_problem_solution_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'id',
                                'preview_size' => 'medium',
                                'library' => 'all',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'image',
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_faq',
                        'name' => 'faq',
                        'label' => 'FAQ',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_faq_anchor'),
                            $text_field('field_faq_headline', 'Headline', 'headline', 'headline'),
                            [
                                'key' => 'field_faq_faqs',
                                'label' => 'FAQs',
                                'name' => 'faqs',
                                'type' => 'repeater',
                                'layout' => 'row',
                                'button_label' => 'Add FAQ',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'faqs',
                                'sub_fields' => [
                                    $text_field('field_faq_question', 'Question', 'question', 'question', true),
                                    [
                                        'key' => 'field_faq_answer',
                                        'label' => 'Answer',
                                        'name' => 'answer',
                                        'type' => 'wysiwyg',
                                        'required' => 1,
                                        'tabs' => 'all',
                                        'toolbar' => 'basic',
                                        'media_upload' => 0,
                                        'show_in_graphql' => 1,
                                        'graphql_field_name' => 'answer',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_cta_band',
                        'name' => 'cta_band',
                        'label' => 'CTA Band',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_cta_band_anchor'),
                            $text_field('field_cta_band_headline', 'Headline', 'headline', 'headline', true),
                            $textarea_field('field_cta_band_subheadline', 'Subheadline', 'subheadline', 'subheadline'),
                            $cta_group('field_cta_band_cta_button', 'CTA Button', 'cta_button', 'ctaButton'),
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_testimonial',
                        'name' => 'testimonial',
                        'label' => 'Testimonial',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_testimonial_anchor'),
                            $textarea_field(
                                'field_testimonial_quote',
                                'Quote',
                                'quote',
                                'quote',
                                true
                            ),
                            $text_field('field_testimonial_author', 'Author', 'author', 'author', true),
                            $text_field('field_testimonial_role', 'Role', 'role', 'role'),
                            $text_field('field_testimonial_company', 'Company', 'company', 'company'),
                            [
                                'key' => 'field_testimonial_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'id',
                                'preview_size' => 'medium',
                                'library' => 'all',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'image',
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_use_cases',
                        'name' => 'use_cases',
                        'label' => 'Use Cases',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_use_cases_anchor'),
                            $text_field('field_use_cases_headline', 'Headline', 'headline', 'headline'),
                            $item_repeater(
                                'field_use_cases_items',
                                'Items',
                                'items',
                                'useCaseItems'
                            ),
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_how_it_works',
                        'name' => 'how_it_works',
                        'label' => 'How It Works',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_how_it_works_anchor'),
                            $text_field('field_how_it_works_headline', 'Headline', 'headline', 'headline'),
                            [
                                'key' => 'field_how_it_works_steps',
                                'label' => 'Steps',
                                'name' => 'steps',
                                'type' => 'repeater',
                                'layout' => 'row',
                                'button_label' => 'Add Step',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'steps',
                                'sub_fields' => [
                                    $text_field(
                                        'field_how_it_works_step_number',
                                        'Step Number',
                                        'step_number',
                                        'stepNumber',
                                        true
                                    ),
                                    $text_field('field_how_it_works_step_title', 'Title', 'title', 'title', true),
                                    $textarea_field(
                                        'field_how_it_works_step_description',
                                        'Description',
                                        'description',
                                        'description'
                                    ),
                                ],
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_stats_strip',
                        'name' => 'stats_strip',
                        'label' => 'Stats Strip',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_stats_strip_anchor'),
                            [
                                'key' => 'field_stats_strip_stats',
                                'label' => 'Stats',
                                'name' => 'stats',
                                'type' => 'repeater',
                                'layout' => 'row',
                                'button_label' => 'Add Stat',
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'stats',
                                'sub_fields' => [
                                    $text_field('field_stats_strip_value', 'Value', 'value', 'value', true),
                                    $text_field('field_stats_strip_label', 'Label', 'label', 'label', true),
                                ],
                            ],
                        ],
                    ],
                    [
                        'key' => 'layout_page_builder_form_section',
                        'name' => 'form_section',
                        'label' => 'Form Section',
                        'display' => 'block',
                        'sub_fields' => [
                            $anchor_field('field_form_section_anchor'),
                            $text_field('field_form_section_headline', 'Headline', 'headline', 'headline', true),
                            $textarea_field('field_form_section_body', 'Body', 'body', 'body'),
                            [
                                'key' => 'field_form_section_form_type',
                                'label' => 'Form Type',
                                'name' => 'form_type',
                                'type' => 'select',
                                'choices' => [
                                    'waitlist' => 'Waitlist',
                                    'demo' => 'Demo',
                                    'contact' => 'Contact',
                                ],
                                'default_value' => 'waitlist',
                                'return_format' => 'value',
                                'allow_null' => 0,
                                'ui' => 1,
                                'show_in_graphql' => 1,
                                'graphql_field_name' => 'formType',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]);
});
