var PDSB = window.PDSB || {
	Namespace: function (namespace) {
		var parts = namespace.split('.'),
			bread = PDSB,
			i = 0;
		// ignore leading namespace
		parts[0] === "PDSB" && (i = 1);
		for ( i; i < parts.length; i++ ) {
			bread[parts[i]] = bread[parts[i]] || {};
			bread = bread[parts[i]];
		}
		return PDSB;
	},
	version: "3.0.0"
};
PDSB.UI = (function (PDSB, global, undefined) {
    OpenResult = function (dlgTitle, tUrl, showRibbon, callback) {
        var showRibbon = showRibbon;
        if (showRibbon === undefined)
            showRibbon = false;

        var dlgTimer = setInterval(function(){
            if (showRibbon === false)
                $('.ms-dlgFrame').contents().find("body #s4-ribbonrow").hide();
            
            if ($('.ms-dlgFrame').contents().find("body #s4-ribbonrow").length > 0)
                clearInterval(dlgTimer);
        }, 100);

        var options = {
            url: tUrl,
            title: dlgTitle,
            dialogReturnValueCallback: function(result, returnValue){
                if(result== SP.UI.DialogResult.OK){
                    SP.UI.Status.removeAllStatus(true);
                    typeof(callback) === "function" && callback();
                    SP.UI.ModalDialog.RefreshPage(result);
                }else if(result== SP.UI.DialogResult.cancel){
                    SP.UI.Status.removeAllStatus(true);
                }
            }
        };        
        SP.UI.ModalDialog.showModalDialog(options);
    },
    OpenHtml = function(dlgTitle, tHtml){
        var options = {
            html: tHtml,
            title: dlgTitle
        };        
        SP.UI.ModalDialog.showModalDialog(options);
    }
    return {
        OpenResult: OpenResult,
        OpenHtml: OpenHtml
    }
}(PDSB, this))
