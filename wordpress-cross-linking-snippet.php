<?php
/**
 * WordPress Cross-Linking Snippet
 * Voegt links toe tussen technischeservice.nl (webshop) en technischeserviceassen.nl (info site)
 * 
 * INSTALLATIE:
 * 1. Ga naar WordPress Dashboard → Appearance → Theme File Editor
 * 2. Selecteer functions.php (rechterkant)
 * 3. Plak deze code ONDERAAN het bestand
 * 4. Klik "Update File"
 * 
 * OF gebruik de "Code Snippets" plugin (aanbevolen):
 * 1. Install plugin: Plugins → Add New → zoek "Code Snippets"
 * 2. Snippets → Add New
 * 3. Plak onderstaande code
 * 4. Activeer de snippet
 */

// ============================================
// 1. BANNER OP HOMEPAGE
// ============================================

add_action('wp_footer', 'tsa_add_homepage_banner');
function tsa_add_homepage_banner() {
    // Alleen op homepage tonen
    if (!is_front_page()) return;
    ?>
    <style>
        .tsa-info-banner {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        }
        .tsa-info-banner h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
            color: white;
        }
        .tsa-info-banner p {
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .tsa-info-banner a {
            display: inline-block;
            background: white;
            color: #1d4ed8;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 0 5px;
            transition: transform 0.2s;
        }
        .tsa-info-banner a:hover {
            transform: scale(1.05);
        }
        .tsa-banner-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            line-height: 1;
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        @media (max-width: 768px) {
            .tsa-info-banner { padding: 15px; }
            .tsa-info-banner h3 { font-size: 18px; }
            .tsa-info-banner p { font-size: 14px; }
            .tsa-info-banner a { 
                display: block; 
                margin: 5px 0; 
                padding: 10px 20px;
            }
        }
    </style>
    
    <div class="tsa-info-banner" id="tsaBanner">
        <button class="tsa-banner-close" onclick="document.getElementById('tsaBanner').style.display='none'">×</button>
        <h3>🎉 Nieuwe Informatiewebsite!</h3>
        <p>Bezoek onze nieuwe site voor uitgebreide productinformatie, blog artikelen en advies</p>
        <a href="https://technischeserviceassen.nl" target="_blank">📱 Naar Info Site</a>
        <a href="https://technischeserviceassen.nl/blog" target="_blank">📝 Blog & Tips</a>
    </div>
    <?php
}


// ============================================
// 2. LINKS OP PRODUCT PAGINA'S
// ============================================

add_action('woocommerce_after_single_product_summary', 'tsa_add_info_link_to_products', 5);
function tsa_add_info_link_to_products() {
    global $product;
    
    // Bepaal welke info pagina relevant is
    $categories = wp_get_post_terms($product->get_id(), 'product_cat', array('fields' => 'names'));
    
    $info_links = array();
    
    foreach ($categories as $cat) {
        $cat_lower = strtolower($cat);
        
        if (strpos($cat_lower, 'airco') !== false || strpos($cat_lower, 'sinclair') !== false || strpos($cat_lower, 'daikin') !== false) {
            $info_links[] = array(
                'url' => 'https://technischeserviceassen.nl/airco-installatie',
                'text' => '❄️ Meer info over Airco Installatie',
                'color' => '#3b82f6'
            );
        }
        
        if (strpos($cat_lower, 'quooker') !== false) {
            $info_links[] = array(
                'url' => 'https://technischeserviceassen.nl/quooker-installatie',
                'text' => '💧 Meer info over Quooker Installatie',
                'color' => '#f97316'
            );
        }
        
        if (strpos($cat_lower, 'waterontharder') !== false) {
            $info_links[] = array(
                'url' => 'https://technischeserviceassen.nl/waterontharder',
                'text' => '💎 Meer info over Waterontharders',
                'color' => '#06b6d4'
            );
        }
    }
    
    // Verwijder duplicaten
    $info_links = array_unique($info_links, SORT_REGULAR);
    
    if (!empty($info_links)) {
        echo '<div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">';
        echo '<h3 style="margin: 0 0 15px 0; font-size: 24px;">ℹ️ Meer Informatie</h3>';
        echo '<p style="margin: 0 0 20px 0; color: #4b5563;">Lees uitgebreide informatie, tips en ervaringen op onze informatiewebsite</p>';
        
        foreach ($info_links as $link) {
            echo '<a href="' . esc_url($link['url']) . '" target="_blank" style="display: inline-block; background: ' . $link['color'] . '; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 5px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.9" onmouseout="this.style.opacity=1">';
            echo esc_html($link['text']) . ' →';
            echo '</a>';
        }
        
        echo '</div>';
    }
}


// ============================================
// 3. LINK OP CONTACT PAGINA
// ============================================

add_filter('the_content', 'tsa_add_info_to_contact_page');
function tsa_add_info_to_contact_page($content) {
    // Alleen op contact pagina (pas slug aan indien nodig)
    if (is_page('contact')) {
        $extra_content = '
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <h3 style="color: white; margin: 0 0 15px 0; font-size: 24px;">💬 Liever Online?</h3>
            <p style="margin: 0 0 20px 0; font-size: 16px;">
                Vraag online een offerte aan via ons nieuwe offerte formulier. 
                Binnen 24 uur krijgt u een reactie!
            </p>
            <a href="https://technischeserviceassen.nl/offerte" target="_blank" style="display: inline-block; background: white; color: #059669; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; transition: transform 0.2s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">
                📝 Online Offerte Formulier →
            </a>
        </div>';
        
        $content = $extra_content . $content;
    }
    
    return $content;
}


// ============================================
// 4. SIDEBAR WIDGET (OPTIONEEL)
// ============================================

add_action('widgets_init', 'tsa_register_info_widget');
function tsa_register_info_widget() {
    register_sidebar(array(
        'name'          => 'TSA Info Link',
        'id'            => 'tsa-info-widget',
        'before_widget' => '<div class="tsa-info-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ));
}

add_action('woocommerce_sidebar', 'tsa_display_info_widget');
function tsa_display_info_widget() {
    ?>
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">📚</div>
        <h3 style="color: white; margin: 0 0 10px 0;">Advies & Informatie</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px;">
            Blog artikelen, installatietips en productadvies
        </p>
        <a href="https://technischeserviceassen.nl/blog" target="_blank" style="display: block; background: white; color: #d97706; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Naar Blog →
        </a>
    </div>
    <?php
}


// ============================================
// 5. LINK IN ADMIN BAR (VOOR JOU)
// ============================================

add_action('admin_bar_menu', 'tsa_add_info_site_link', 100);
function tsa_add_info_site_link($wp_admin_bar) {
    if (!current_user_can('manage_options')) return;
    
    $args = array(
        'id'    => 'tsa-info-site',
        'title' => '📱 Info Site',
        'href'  => 'https://technischeserviceassen.nl',
        'meta'  => array(
            'target' => '_blank',
            'title'  => 'Open informatiewebsite'
        )
    );
    $wp_admin_bar->add_node($args);
    
    $wp_admin_bar->add_node(array(
        'parent' => 'tsa-info-site',
        'id'     => 'tsa-info-offerte',
        'title'  => 'Offertes bekijken',
        'href'   => 'https://technischeserviceassen.nl/offerte',
        'meta'   => array('target' => '_blank')
    ));
}


// ============================================
// 6. NOTIFICATION IN ADMIN DASHBOARD
// ============================================

add_action('admin_notices', 'tsa_admin_notice');
function tsa_admin_notice() {
    $screen = get_current_screen();
    if ($screen->id !== 'dashboard') return;
    
    ?>
    <div class="notice notice-info is-dismissible">
        <h2>🎉 Nieuwe Informatiewebsite Actief!</h2>
        <p>
            Onze nieuwe informatiewebsite is live op <strong>technischeserviceassen.nl</strong>
        </p>
        <p>
            <a href="https://technischeserviceassen.nl" target="_blank" class="button button-primary">📱 Bekijk Site</a>
            <a href="https://technischeserviceassen.nl/blog" target="_blank" class="button">📝 Blog</a>
            <a href="https://technischeserviceassen.nl/portfolio" target="_blank" class="button">📸 Portfolio</a>
        </p>
    </div>
    <?php
}
