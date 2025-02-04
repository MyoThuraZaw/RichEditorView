/**
 * Copyright (C) 2015 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 "use strict";

var RE = {};

RE.editor = document.getElementById('editor');

var images;

// Not universally supported, but seems to work in iOS 7 and 8
document.addEventListener("selectionchange", function() {
    console.log("selectionchange");

    const isSelectionAnchorTag = RE.isSelectionAnchorTag();
    
    if (isSelectionAnchorTag) {
        const [isAnchor, href, text] = isSelectionAnchorTag;
        if (isAnchor) {
            console.log("selection is an anchor tag");
            console.log(`href: ${href}`);
            console.log(`text: ${text}`);
            RE.callback(`action/insideAnchorTag{"href": "${href}", "text": "${text}"}`); 
        } else {
            console.log("selection is not an anchor tag");
            RE.callback(`action/outsideAnchorTag`); 
        }        
    } else {
        console.log("selection is not an anchor tag");
        RE.callback(`action/outsideAnchorTag`);
    }
    RE.backuprange();
});

document.addEventListener('click', function(event) {
    // This code will be executed whenever a click occurs anywhere inside the document.
    // You can replace this code with any action you want to perform when a click happens.
       var items = [];
  
       if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }

    const allAppliedFormat = items.toString()
    RE.callback(allAppliedFormat)
});

//looks specifically for a Range selection and not a Caret selection
RE.rangeSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && sel.type == "Range") {
        return true;
    }
    return false;
};

RE.rangeOrCaretSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && (sel.type == "Range" || sel.type == "Caret")) {
        return true;
    }
    return false;
};

// Returns selected text range
RE.selectedText = function() {
    if (RE.rangeSelectionExists() == true) {
        return document.getSelection().toString();
    }
    return "";
};

RE.editor.addEventListener("input", function() {
    RE.updatePlaceholder();
    RE.backuprange();
    RE.callback("input");
});

RE.editor.addEventListener("focus", function() {
    RE.backuprange();
    RE.callback("focus");
});

RE.editor.addEventListener("blur", function() {
    RE.callback("blur");
});

RE.customAction = function(action) {
    RE.callback("action/" + action);
};

RE.updateHeight = function() {
    RE.callback("updateHeight");
}

RE.callbackQueue = [];
RE.runCallbackQueue = function() {
    if (RE.callbackQueue.length === 0) {
        return;
    }

    setTimeout(function() {
        window.location.href = "re-callback://";
    }, 0);
};

RE.getCommandQueue = function() {
    var commands = JSON.stringify(RE.callbackQueue);
    RE.callbackQueue = [];
    return commands;
};

RE.callback = function(method) {
    RE.callbackQueue.push(method);
    RE.runCallbackQueue();
};

RE.setHtml = function(contents) {
    var tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = contents;
    var images = tempWrapper.querySelectorAll("img");

    for (var i = 0; i < images.length; i++) {
        images[i].onload = RE.updateHeight;
    }

    RE.editor.innerHTML = tempWrapper.innerHTML;
    RE.updatePlaceholder();
};

RE.getHtml = function() {
    return RE.editor.innerHTML;
};

RE.getText = function() {
    return RE.editor.innerText;
};

RE.setBaseTextColor = function(color) {
    RE.editor.style.color  = color;
};

RE.setPlaceholderText = function(text) {
    RE.editor.setAttribute("placeholder", text);
};

RE.updatePlaceholder = function() {
    if (RE.editor.innerHTML.indexOf('img') !== -1 || (RE.editor.textContent.length > 0 && RE.editor.innerHTML.length > 0)) {
        RE.editor.classList.remove("placeholder");
    } else {
        RE.editor.classList.add("placeholder");
    }
};

RE.removeFormat = function() {
    document.execCommand('removeFormat', false, null);
};

RE.setFontSize = function(size) {
    RE.editor.style.fontSize = size;
};

RE.setBackgroundColor = function(color) {
    RE.editor.style.backgroundColor = color;
};

RE.setHeight = function(size) {
    RE.editor.style.height = size;
};

RE.undo = function() {
    document.execCommand('undo', false, null);
};

RE.redo = function() {
    document.execCommand('redo', false, null);
};

RE.setBold = function() {
    document.execCommand('bold', false, null);
};

RE.setItalic = function() {
    document.execCommand('italic', false, null);
};

RE.setSubscript = function() {
    document.execCommand('subscript', false, null);
};

RE.setSuperscript = function() {
    document.execCommand('superscript', false, null);
};

RE.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
};

RE.setUnderline = function() {
    document.execCommand('underline', false, null);
};

RE.setTextColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
};

RE.setTextBackgroundColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
};

RE.setHeading = function(heading) {
    var sel = document.getSelection().getRangeAt(0).startContainer.parentNode;
    document.execCommand('formatBlock', false, sel.tagName === `H${heading}` ? '<p>' : `<h${heading}>`);
};

RE.setIndent = function() {
    document.execCommand('indent', false, null);
};

RE.setOutdent = function() {
    document.execCommand('outdent', false, null);
};

RE.setOrderedList = function() {
    document.execCommand('insertOrderedList', false, null);
};

RE.setUnorderedList = function() {
    document.execCommand('insertUnorderedList', false, null);
};

function createCheckbox(id) {
    var el = document.querySelector("input[name='" + id + "']");
    var d = document.createElement("input");
    d.setAttribute("type", "checkbox");
    d.setAttribute("name", id);
    if(el.checked) {
        d.setAttribute("checked", null);
    }
    el.parentNode.insertBefore(d, el);
    el.parentNode.removeChild(el);
    el = document.querySelector("input[name='" + id + "']");
    el.addEventListener("change", function() {createCheckbox(id);});
};

RE.setCheckbox = function(id) {
    var el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    el.setAttribute("name", id);
    RE.insertHTML("&nbsp;" + el.outerHTML + "&nbsp;");
    el = document.querySelector("input[name='" + id + "']");
    el.addEventListener("change", function() {createCheckbox(id);});
    RE.callback("input");
};

RE.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
};

RE.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
};

RE.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
};

RE.getLineHeight = function() {
    return RE.editor.style.lineHeight;
};

RE.setLineHeight = function(height) {
    RE.editor.style.lineHeight = height;
};

RE.insertImage = function(url, alt, width) {
    var img = document.createElement('img');
    img.setAttribute("src", url);
    img.setAttribute("alt", alt);
    img.setAttribute('width', width);
    img.onload = RE.updateHeight;

    RE.insertHTML(img.outerHTML);
    RE.callback("input");

    RE.addImageTapEventListener();
};

RE.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
};

RE.insertHTML = function(html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
};

RE.insertLink = function(url, text, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        document.execCommand("insertHTML",false,"<a href='"+url+"' title='"+title+"'>"+text+"</a>");
    } else if (sel.rangeCount) {
        var el = document.createElement("a");
        el.setAttribute("href", url);
        el.setAttribute("title", title);

        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    RE.callback("input");
};

RE.updateLink = function(url, newText, newTitle) {
    RE.restorerange();
    var sel = document.getSelection();
    
    if (sel.rangeCount) {
        var anchorElement = sel.anchorNode.parentElement;
        
        // Check if the selected element is an anchor (<a>) element
        if (anchorElement && anchorElement.tagName === "A") {
            anchorElement.setAttribute("href", url);
            anchorElement.setAttribute("title", newTitle);
            anchorElement.textContent = newText;
        }
        
        RE.callback("input");
    }
};

RE.prepareInsert = function() {
    RE.backuprange();
};

RE.backuprange = function() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        RE.currentSelection = {
            "startContainer": range.startContainer,
            "startOffset": range.startOffset,
            "endContainer": range.endContainer,
            "endOffset": range.endOffset
        };
    }
};

RE.addRangeToSelection = function(selection, range) {
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

// Programatically select a DOM element
RE.selectElementContents = function(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    // this.createSelectionFromRange sel, range
    RE.addRangeToSelection(sel, range);
};

RE.restorerange = function() {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
};

RE.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.focusAtPoint = function(x, y) {
    var range = document.caretRangeFromPoint(x, y) || document.createRange();
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.blurFocus = function() {
    RE.editor.blur();
};

// User editing table functionality
RE.insertTable = function(width, height) {
    var table = document.createElement("table");
    for (let i = 0; i < height; i++) {
        var row = table.insertRow();
        for (let j = 0; j < width; j++) {
            var cell = row.insertCell();
        }
    }

    RE.insertHTML(table.outerHTML);
    RE.callback("input");
};

function getNearestTableAncestor(htmlElementNode) {
    while (htmlElementNode) {
        htmlElementNode = htmlElementNode.parentNode;
        if (htmlElementNode.tagName.toLowerCase() === 'table') {
            return htmlElementNode;
        }
    }
    return undefined;
}

RE.isCursorInTable = function() {
    return document.querySelectorAll(":hover")[elements.length - 1] instanceof HTMLTableCellElement  
};

RE.addRowBelow = function() {
    var elements = document.querySelectorAll(":hover");
    let rowIndex = elements[elements.length - 2].rowIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]);
    let columnCount = table.rows[0].cells.length;
    var row = table.insertRow(rowIndex + 1);

    for (var i = 0; i < columnCount; i++) {
        row.insertCell(i);
    }
    RE.callback("input");
};

RE.addRowAbove = function() {
    var elements = document.querySelectorAll(":hover");
    let rowIndex = elements[elements.length - 2].rowIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]);
    let columnCount = table.rows[0].cells.length;

    // Handle case when there's only one row
    if (rowIndex === 0) {
        var row = table.insertRow(0);
        for (var i = 0; i < columnCount; i++) {
            row.insertCell(i);
        }
    } else {
        var row = table.insertRow(rowIndex);
        for (var i = 0; i < columnCount; i++) {
            row.insertCell(i);
        }
    }
    RE.callback("input");
};

RE.deleteRowFromTable = function() {
    // Deletes the current cursor's row
    var elements = document.querySelectorAll(":hover");
    let rowIndex = elements[elements.length - 2].rowIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]);
    table.deleteRow(rowIndex);
    RE.callback("input");
};

RE.addColumnRight = function() {
    // Add column to the right of current cursor's
    var elements = document.querySelectorAll(":hover");
    let columnIndex = elements[elements.length - 1].cellIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]);
    let rowCount = table.rows.length;
    
    for (var i = 0; i < rowCount; i++) {
        let row = table.rows[i];
        row.insertCell(columnIndex + 1);
    }
    RE.callback("input");
}

RE.addColumnToLeft = function() {
    // Add column to the left of the current cursor's
    var elements = document.querySelectorAll(":hover");
    let columnIndex = elements[elements.length - 1].cellIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]); // Assuming you have the getNearestTableAncestor function defined

    let rowCount = table.rows.length;

    for (var i = 0; i < rowCount; i++) {
        let row = table.rows[i];
        if (columnIndex === 0) {
            // If columnIndex is 0, insert at the beginning
            let newCell = row.insertCell(0);
        } else {
            // Otherwise, insert at the specified index
            let newCell = row.insertCell(columnIndex);
        }
    }
    RE.callback("input");
};

RE.deleteColumnFromTable = function() {
    // Deletes the whole column at the current cursor's position
    var elements = document.querySelectorAll(":hover");
    let columnIndex = elements[elements.length - 1].cellIndex;
    let table = getNearestTableAncestor(elements[elements.length - 1]);

    for (var i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        if (row.cells.length > columnIndex) {
            row.deleteCell(columnIndex);
        }
    }
    RE.callback("input");
};


RE.deleteTable = function() {
    var elements = document.querySelectorAll(":hover");
    var table = getNearestTableAncestor(elements[elements.length - 1]);
    
    if (table) {
        table.parentNode.removeChild(table);
    }   
    RE.callback("input"); 
};

/**
Recursively search element ancestors to find a element nodeName e.g. A
**/
var _findNodeByNameInContainer = function(element, nodeName, rootElementId) {
    if (element.nodeName == nodeName) {
        return element;
    } else {
        if (element.id === rootElementId) {
            return null;
        }
        _findNodeByNameInContainer(element.parentElement, nodeName, rootElementId);
    }
};

var isAnchorNode = function(node) {
    return ("A" == node.nodeName);
};

RE.getAnchorTagsInNode = function(node) {
    var links = [];

    while (node.nextSibling !== null && node.nextSibling !== undefined) {
        node = node.nextSibling;
        if (isAnchorNode(node)) {
            links.push(node.getAttribute('href'));
        }
    }
    return links;
};

RE.countAnchorTagsInNode = function(node) {
    return RE.getAnchorTagsInNode(node).length;
};

/**
 * If the current selection's parent is an anchor tag, get the href.
 * @returns {string}
 */
RE.getSelectedHref = function() {
    var href, sel;
    href = '';
    sel = window.getSelection();
    if (!RE.rangeOrCaretSelectionExists()) {
        return null;
    }

    var tags = RE.getAnchorTagsInNode(sel.anchorNode);
    //if more than one link is there, return null
    if (tags.length > 1) {
        return null;
    } else if (tags.length == 1) {
        href = tags[0];
    } else {
        var node = _findNodeByNameInContainer(sel.anchorNode.parentElement, 'A', 'editor');
        href = node.href;
    }
    return href ? href : null;
};

// Returns the cursor position relative to its current position onscreen.
// Can be negative if it is above what is visible
RE.getRelativeCaretYPosition = function() {
    var y = 0;
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        var needsWorkAround = (range.startOffset == 0)
        /* Removing fixes bug when node name other than 'div' */
        // && range.startContainer.nodeName.toLowerCase() == 'div');
        if (needsWorkAround) {
            y = range.startContainer.offsetTop - window.pageYOffset;
        } else {
            if (range.getClientRects) {
                var rects = range.getClientRects();
                if (rects.length > 0) {
                    y = rects[0].top;
                }
            }
        }
    }
    return y;
};

RE.isSelectionAnchorTag = function() {
    if (window.getSelection().toString !== '') {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            if (range) {
                const startParentNode = range.startContainer.parentNode;
                const endParentNode = range.endContainer.parentNode; 
                if (startParentNode.tagName === 'A' || endParentNode.tagName === 'A') {
                    const href = startParentNode.getAttribute('href');
                    const text = startParentNode.textContent;
                    return [true, href, text];
                }
            }
        }        
    }
    return false;
}

RE.imageTapped = function(src, alt) {
    window.webkit.messageHandlers.imageTapped.postMessage({src: src, alt: alt});
}

window.onload = function() {
    RE.callback("ready");    
    RE.addImageTapEventListener();
};

RE.addImageTapEventListener = function() {
    images = document.getElementsByTagName("img");
    console.log(`images count: ${images.length}`);
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        
        // Check if the custom attribute "data-event-added" exists
        if (!image.getAttribute("data-event-added")) {
            image.addEventListener("touchend", function(event) {
                event.preventDefault();
                RE.imageTapped(event.target.src, event.target.alt);
            });
            
            // Set the custom attribute to indicate the event listener is added
            image.setAttribute("data-event-added", "true");
            console.log(`set image attribute`);
        }
    }
}