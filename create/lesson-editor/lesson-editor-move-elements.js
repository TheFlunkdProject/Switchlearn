function divDown(istr,box) {
	var e=document.getElementById(box+istr);
	var editingSpace = document.getElementById('editingSpace');
	var trashBox = document.getElementById('trashBox');
	if (e.nextSibling) {
		while (e.nextSibling.nodeType == 3) e.parentNode.insertBefore(e.nextSibling, e);
	}
	if (e.nextSibling) {
		if (e.nextSibling.parentNode==editingSpace||trashBox){
			e.parentNode.insertBefore(e.nextSibling, e);
		}
	}
}

function divUp(istr,box) {
	var e=gEBI(box+istr);
	var editingSpace = gEBI('editingSpace');
	var trashBox = gEBI('trashBox');
	if (e.previousSibling) {
		while (e.previousSibling.nodeType == 3) e.parentNode.insertBefore(e, e.previousSibling);
	}
	if (e.previousSibling) {
		if (e.previousSibling.parentNode==editingSpace||trashBox){
			e.parentNode.insertBefore(e, e.previousSibling);
		}
	}
}

function closeBox(istr,textBox) {
	var e=document.getElementById(textBox+istr);
	var e2=document.getElementById('editingSpace');
	if (e.parentNode == e2) {
		document.getElementById('trashBox').appendChild(e);
	} else {
		e2.appendChild(e);
	}
	
}


function closeHiddenBox(istr) {
	var eBlock=document.getElementById('hiddenTextBoxEditor'+istr);
	var eBlockText = document.getElementById('textField' + istr);
	var eInline=document.getElementById('triggerBox'+istr);
	var eHiddenText=document.getElementById("triggerTextEditor"+istr);
	var editingSpace = document.getElementById('editingSpace');
	var trashBox = document.getElementById('trashBox');
	
	if (eBlock.parentNode == editingSpace) {
		//For this one, we need to get the nodes out of the inline element first (user probably wants to 
		//keep them out:
		if (eInline!=null) {
			while (eHiddenText.childNodes.length > 0) {
				eInline.parentNode.insertBefore(eHiddenText.childNodes[eHiddenText.childNodes.length-1], eInline.nextSibling);
				//that puts each node right after the inline element.
			}
		//Now we can put the inline element inside:
			eBlockText.appendChild(eInline);
		}
		//Put it in the trash:
		trashBox.appendChild(eBlock);
	} else {
		// Put the inline element at the cursor, and append the box:
		var theResult = checkIfContentEditable();
		if (theResult == 'nopes') {
			return;//Quit function
		}
		insertNodeAtCursor(eInline);
		editingSpace.appendChild(eBlock);
	}
}

function closeInlineElement(istr, inlineType) {
	var e=document.getElementById(inlineType + 'TriggerBox' + istr);
	var trashBox = document.getElementById('trashBox');
	if (e.parentNode!=trashBox) {
		trashBox.appendChild(e);
	} else {
	var theResult = checkIfContentEditable();
	if (theResult == 'nopes') {
		return;//Quit function
	}
	insertNodeAtCursor(e);
	}
}

function closeInnerBox(istr,innerBox) {
	var e=document.getElementById(innerBox+istr);
	var trashBox = document.getElementById('trashBox');
	if (e.parentNode != trashBox) {
		if (e.parentNode.className == " textField" || "textField") {
			if (e.nextSibling != undefined && e.nextSibling.firstChild) {
				if (e.nextSibling.firstChild.tagName == "BR") {
					e.parentNode.removeChild(e.nextSibling);
				}
			}
		} else if (e.parentNode.nextSibling != undefined) {
			if (e.parentNode.nextSibling.firstChild.tagName == "BR" ) {
				e.parentNode.nextSibling.parentNode.removeChild(e.parentNode.nextSibling);
			}
		}
		trashBox.appendChild(e);
	} else {
		var theResult = checkIfContentEditable();
		if (theResult == 'nopes') {
			return;//Quit function
		}
		insertNodeAtCursor(e);
		insertSpaceAroundBox(e);
	}
}

function insertSpaceAroundBox(div1) {
	// If the inner box is inserted in the first line, it will become the first element and there will be no option
	// unless we insertBefore div1 a break.
	var br11=document.createElement('br');
	var br10 = document.createElement('br');
	var div30 = document.createElement('div');
	div30.appendChild(br11);
	
	div1.parentNode.insertBefore(br10, div1);
	if (div1.nextSibling != undefined) {
		if (div1.parentNode.className==" textField" || "textField") { //if it's the first line...
			div1.parentNode.insertBefore(div30, div1.nextSibling);
			if (div1.nextSibling.tagName=='BR') {
				div1.nextSibling.parentNode.removeChild(div1.nextSibling);
			}
		} else if (div1.parentNode.parentNode.className==" textField") { //If it's not the first line
			div1.parentNode.parentNode.insertBefore(div30, div1.parentNode.nextSibling);
			if (div1.nextSibling.tagName=='BR') {
				div1.nextSibling.parentNode.removeChild(div1.nextSibling);
			}
			
		}
	} else {
		if (div1.parentNode.className==" textField" || "textField") {//if it's the first line...
			div1.parentNode.appendChild(div30)
		} /*else if (div1.parentNode.parentNode.className==" textField") {
			if (div1.nextSibling.tagName=='BR') {
				div1.nextSibling.parentNode.removeChild(div1.nextSibling);
			}
		}*/
	}
}