tinyMCE.init({
        // General options
        mode : "textareas",
        theme : "advanced",
  //      height: 400,
        plugins : "autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

        // Theme options
        theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,strikethrough,|,hr,removeformat,table,|,bullist,numlist,|,outdent,indent,blockquote,|,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "|,code,preview,|,forecolor,backcolor,|,cite,abbr,acronym,del,ins,|,visualchars,nonbreaking,blockquote,pagebreak,|,insertfile,insertimage|,charmap,emotions,iespell,media,advhr,|,ltr,rtl,|,fullscreen",
/*        
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
*/        theme_advanced_resizing : true,

        // Skin options
  //      skin : "o2k7",
    //    skin_variant : "silver",

        // Example content CSS (should be your site CSS)
        content_css : "stylesheets/bootstrap.css",

        // Drop lists for link/image/media/template dialogs
        template_external_list_url : "js/template_list.js",
        external_link_list_url : "js/link_list.js",
        external_image_list_url : "js/image_list.js",
        media_external_list_url : "js/media_list.js",

  
});