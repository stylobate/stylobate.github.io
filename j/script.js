// Shortcuts for Prism
Prism.languages.styl = Prism.languages.scss;
Prism.languages.html = Prism.languages.markup;

// Injecting source of examples' HTML
$('blockquote:not(:has(.example-code>.group)):not(:has(.example-source))').append($('<div class="example-code"><span class="group"></span></div>'))

$('blockquote:has(.example-code>.group)').each(function(){
    var $example_html = $(this).clone();
    $example_html.find('.example-code').remove();
    $child = $example_html.children();
    if ($child.length == 1 && $child[0].className == '') {
        $example_html = $child;
    }
    var example_html = $example_html[0].innerHTML.replace(/^\s+/,'').replace(/\s+$/,'');
    if (example_html) {
        var example_html_inner = example_html.split('\n');
        if (example_html_inner[example_html_inner.length - 1].match(/^\s\s\s\s/)) {
            example_html = example_html.replace(/\n    /g,'\n');
        }
        var $example_src = $(this).children('.example-code');
        var $example_src_code = $('<pre class="language-html is-hidden"><code></code></pre>');
        $example_src_code.children('code').text(example_html);
        $example_src.children('.group').append($('<span class="small-pseudo-button toggle-button group-item example-source js-toggler" data-toggle="html"><span class="button-content">html</span></span>'));
        $example_src.append($example_src_code);
    }
});


// Toggling code blocks
$('.js-toggler:not([data-toggle])').click(function(){
    $(this).next().toggleClass('is-hidden');
});
$('.js-toggler[data-toggle]').click(function(){
    $(this).closest('.group').siblings('[class*="language-' + $(this).data('toggle') + '"]').toggleClass('is-hidden');
});
$('.js-outer-toggler').click(function(){
    $(this).parent().next().toggleClass('is-hidden');
});
