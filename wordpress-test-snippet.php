<?php
/**
 * SIMPELE TEST SNIPPET
 * Gebruik dit eerst om te testen of Code Snippets überhaupt werkt
 * 
 * INSTALLATIE:
 * 1. Snippets → Add New
 * 2. Plak deze code
 * 3. Save & Activate
 * 4. Refresh je homepage
 * 5. Zie je een RODE banner onderaan? → Code Snippets werkt! ✅
 * 6. Zie je NIETS? → Code Snippets werkt niet of cache probleem ❌
 */

add_action('wp_footer', 'test_code_snippets_werkt');
function test_code_snippets_werkt() {
    ?>
    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #ef4444; color: white; padding: 30px; text-align: center; z-index: 999999; font-size: 20px; font-weight: bold; box-shadow: 0 -4px 20px rgba(0,0,0,0.5);">
        ✅ CODE SNIPPETS WERKT! - Je ziet deze rode banner = alles werkt!
        <br>
        <small style="font-size: 14px; font-weight: normal;">
            Nu kan je deze test snippet verwijderen en de echte cross-linking snippet activeren
        </small>
    </div>
    
    <!-- DEBUG INFO IN HTML SOURCE -->
    <?php
    echo '<!-- TSA DEBUG START -->';
    echo '<!-- WordPress versie: ' . get_bloginfo('version') . ' -->';
    echo '<!-- Is Front Page: ' . (is_front_page() ? 'JA' : 'NEE') . ' -->';
    echo '<!-- Is Home: ' . (is_home() ? 'JA' : 'NEE') . ' -->';
    echo '<!-- Current URL: ' . $_SERVER['REQUEST_URI'] . ' -->';
    echo '<!-- Theme: ' . wp_get_theme()->get('Name') . ' -->';
    echo '<!-- wp_footer werkt: JA -->';
    echo '<!-- TSA DEBUG END -->';
    ?>
    <?php
}
