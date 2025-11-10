<?php
/**
 * WordPress Cross-Linking Snippet - ELEMENTOR COMPATIBLE
 * Speciaal aangepast voor Elementor themes
 * 
 * INSTALLATIE via Code Snippets plugin:
 * 1. WordPress Dashboard → Snippets → Add New
 * 2. Plak deze code
 * 3. Kies "Run snippet everywhere"
 * 4. Activeer
 */

// ============================================
// 1. HOMEPAGE BANNER - ELEMENTOR COMPATIBLE
// ============================================

add_action('wp_footer', 'tsa_elementor_homepage_banner', 999); // Hogere priority voor Elementor
function tsa_elementor_homepage_banner() {
    // Alleen op homepage
    if (!is_front_page() && !is_home()) return;
    
    // Check of Elementor actief is
    $is_elementor = defined('ELEMENTOR_VERSION');
    ?>
    <!-- TSA Banner Debug: Elementor <?php echo $is_elementor ? 'ACTIEF' : 'NIET ACTIEF'; ?> -->
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
            z-index: 999999 !important; /* Extra hoog voor Elementor */
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        }
        .tsa-info-banner h3 {
            margin: 0 0 10px 0 !important;
            font-size: 20px !important;
            color: white !important;
            font-weight: bold !important;
        }
        .tsa-info-banner p {
            margin: 0 0 15px 0 !important;
            font-size: 16px !important;
            color: white !important;
        }
        .tsa-info-banner a {
            display: inline-block !important;
            background: white !important;
            color: #1d4ed8 !important;
            padding: 12px 30px !important;
            border-radius: 8px !important;
            text-decoration: none !important;
            font-weight: bold !important;
            margin: 0 5px !important;
            transition: transform 0.2s !important;
        }
        .tsa-info-banner a:hover {
            transform: scale(1.05) !important;
            color: #1d4ed8 !important;
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
            .tsa-info-banner { padding: 15px !important; }
            .tsa-info-banner h3 { font-size: 18px !important; }
            .tsa-info-banner p { font-size: 14px !important; }
            .tsa-info-banner a { 
                display: block !important; 
                margin: 5px 0 !important; 
                padding: 10px 20px !important;
            }
        }
    </style>
    
    <div class="tsa-info-banner" id="tsaBanner">
        <button class="tsa-banner-close" onclick="this.parentElement.style.display='none'">×</button>
        <h3>🎉 Nieuwe Informatiewebsite!</h3>
        <p>Bezoek onze nieuwe site voor uitgebreide productinformatie, blog artikelen en advies</p>
        <a href="https://technischeserviceassen.nl" target="_blank" rel="noopener">📱 Naar Info Site</a>
        <a href="https://technischeserviceassen.nl/blog" target="_blank" rel="noopener">📝 Blog & Tips</a>
    </div>
    
    <script>
    // Extra JavaScript fallback voor Elementor
    document.addEventListener('DOMContentLoaded', function() {
        var banner = document.getElementById('tsaBanner');
        if (banner) {
            banner.style.display = 'block';
            console.log('TSA Banner: Succesvol geladen via JavaScript');
        }
    });
    </script>
    <?php
}


// ============================================
// 2. PRODUCT PAGINA'S - ELEMENTOR COMPATIBLE
// ============================================

// Voor Elementor gebruiken we een hook die altijd werkt
add_action('woocommerce_after_single_product', 'tsa_elementor_product_links', 5);
function tsa_elementor_product_links() {
    global $product;
    if (!$product) return;
    
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
    
    $info_links = array_unique($info_links, SORT_REGULAR);
    
    if (!empty($info_links)) {
        echo '<div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; clear: both;">';
        echo '<h3 style="margin: 0 0 15px 0 !important; font-size: 24px !important; color: #111827 !important;">ℹ️ Meer Informatie</h3>';
        echo '<p style="margin: 0 0 20px 0 !important; color: #4b5563 !important;">Lees uitgebreide informatie, tips en ervaringen op onze informatiewebsite</p>';
        
        foreach ($info_links as $link) {
            echo '<a href="' . esc_url($link['url']) . '" target="_blank" rel="noopener" style="display: inline-block !important; background: ' . $link['color'] . ' !important; color: white !important; padding: 15px 30px !important; border-radius: 8px !important; text-decoration: none !important; font-weight: bold !important; margin: 5px !important; transition: opacity 0.2s !important;" onmouseover="this.style.opacity=\'0.9\'" onmouseout="this.style.opacity=\'1\'">';
            echo esc_html($link['text']) . ' →';
            echo '</a>';
        }
        
        echo '</div>';
    }
}


// ============================================
// 3. ELEMENTOR WIDGET (OPTIONEEL)
// ============================================

// Registreer als Elementor widget voor in de builder
add_action('elementor/widgets/widgets_registered', 'tsa_register_elementor_widget');
function tsa_register_elementor_widget() {
    if (!class_exists('Elementor\Widget_Base')) return;
    
    class TSA_Info_Widget extends \Elementor\Widget_Base {
        
        public function get_name() {
            return 'tsa_info_banner';
        }
        
        public function get_title() {
            return 'TSA Info Banner';
        }
        
        public function get_icon() {
            return 'eicon-info-circle';
        }
        
        public function get_categories() {
            return ['general'];
        }
        
        protected function render() {
            ?>
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;">
                <div style="font-size: 50px; margin-bottom: 15px;">📚</div>
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 28px;">Advies & Informatie</h3>
                <p style="margin: 0 0 20px 0; font-size: 16px;">
                    Blog artikelen, installatietips en productadvies op onze nieuwe informatiewebsite
                </p>
                <a href="https://technischeserviceassen.nl/blog" target="_blank" rel="noopener" style="display: inline-block; background: white; color: #d97706; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Naar Blog →
                </a>
            </div>
            <?php
        }
    }
    
    \Elementor\Plugin::instance()->widgets_manager->register_widget_type(new TSA_Info_Widget());
}


// ============================================
// 4. CONTACT PAGINA - ELEMENTOR COMPATIBLE
// ============================================

add_filter('the_content', 'tsa_elementor_contact_banner', 999);
function tsa_elementor_contact_banner($content) {
    if (!is_page('contact') && !is_page('contacteer-ons')) return $content;
    
    $banner = '
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; clear: both;">
        <h3 style="color: white !important; margin: 0 0 15px 0 !important; font-size: 24px !important;">💬 Liever Online?</h3>
        <p style="margin: 0 0 20px 0 !important; font-size: 16px !important; color: white !important;">
            Vraag online een offerte aan via ons nieuwe offerte formulier. 
            Binnen 24 uur krijgt u een reactie!
        </p>
        <a href="https://technischeserviceassen.nl/offerte" target="_blank" rel="noopener" style="display: inline-block !important; background: white !important; color: #059669 !important; padding: 15px 40px !important; border-radius: 8px !important; text-decoration: none !important; font-weight: bold !important; font-size: 18px !important; transition: transform 0.2s !important;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">
            📝 Online Offerte Formulier →
        </a>
    </div>';
    
    return $banner . $content;
}


// ============================================
// 5. ADMIN BAR LINK
// ============================================

add_action('admin_bar_menu', 'tsa_elementor_admin_link', 100);
function tsa_elementor_admin_link($wp_admin_bar) {
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
}


// ============================================
// 6. DASHBOARD NOTICE
// ============================================

add_action('admin_notices', 'tsa_elementor_admin_notice');
function tsa_elementor_admin_notice() {
    $screen = get_current_screen();
    if ($screen->id !== 'dashboard') return;
    ?>
    <div class="notice notice-info is-dismissible">
        <h2>🎉 Nieuwe Informatiewebsite Actief!</h2>
        <p>Elementor-compatible versie actief op <strong>technischeserviceassen.nl</strong></p>
        <p>
            <a href="https://technischeserviceassen.nl" target="_blank" class="button button-primary">📱 Bekijk Site</a>
            <a href="https://technischeserviceassen.nl/blog" target="_blank" class="button">📝 Blog</a>
        </p>
    </div>
    <?php
}
