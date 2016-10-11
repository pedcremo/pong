/**
 *  Used to avoid image double click selection default behaviour 
 */
function clearSelection() {
     if(document.selection && document.selection.empty) {
         document.selection.empty();
     } else if(window.getSelection) {
         var sel = window.getSelection();
         sel.removeAllRanges();
     }
 }

 module.exports.clearSelection = clearSelection;
