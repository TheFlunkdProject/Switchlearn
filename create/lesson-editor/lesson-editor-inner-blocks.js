function insertInnerBox(innerBox) {
	var theResult = checkIfContentEditableAndNewLineCapable();
	if (theResult == 'nopes') {
		return;//Quit function
	}
	
	//Find out id number:
	var i=1;
	while (document.getElementById(innerBox+i.toString()) !=null) { // Different than main boxes
		i++;
	}
	var istr = i.toString();

	var innerBoxMain = createEl('div',['className',' '+innerBox,'contentEditable','false','id',innerBox+istr]);
	var controlBar = createInnerBoxControlBar(innerBox,istr);
	var innerBoxBody = createInnerBoxBody(innerBox,istr);

	innerBoxMain.appendChild(controlBar);
	innerBoxMain.appendChild(innerBoxBody);
	insertNodeAtCursor(innerBoxMain);

	//To keep typing after the innerBox is inserted: (it turns out that divs are the lines in contentEditable.)
	//insertSpaceAroundBox(innerBoxMain);
	var br1 = createEl('br',[]);
	var br2 = createEl('br',[]);
	innerBoxMain.parentNode.insertBefore(br1,innerBoxMain);
	innerBoxMain.parentNode.insertBefore(br2,innerBoxMain.nextSibling);

	if (innerBox=='textBox') {
		innerBoxBody.focus();
	}

}


function createInnerBoxControlBar(innerBox,istr) {
	var className = '';
	switch(innerBox) {
		case 'videoBox':
			className = ' videoControlBar';
			break;
		case 'imageBox': 
			className = ' imageControlBar';
			break;
	}
	var controlBar = createEl('div',['className',className,'contentEditable','false','id','controlBar'+istr]);
	
	//icons for navigation (just the trash icon right now):
	var navIconRight = createEl('div',['className',' navIconRight','id',innerBox+'IconTrash'+istr]);
	navIconRight.onclick=function() {closeInnerBox(istr,innerBox);};
	var iconImage = createEl('img',['className',' iconImage','src',"/1images/trashIcon.png",'id',innerBox+"TrashIcon"+istr]);
	appendNextElementsInList([navIconRight,iconImage, controlBar,navIconRight]);
	
	return controlBar;
}


function createInnerBoxBody(innerBox,istr) {
	var div;
	switch(innerBox) {
		case 'videoBox':
			div = createVideoBoxBody(istr);
			break;
		case 'imageBox':
			div = createImageBoxBody(istr);
			break
	}
	return div;
}



function createVideoBoxBody(istr) {
	var div6 = createEl('div',['className',' videoBoxInnerContainer','contentEditable','false','id','videoBoxInnerContainer'+istr]);
	//Embedded video:
	var div7 = createEl('div',['className',' embeddedVideoContainerEditor','id',
			' videoBoxEmbeddedVideoContainer'+istr]);//Original had lower case embedded
	var srcStr = "https://www.youtube.com/embed/qC_T9ePzANg?wmode=transparent"+
			"&rel=0&amp;modestbranding=1&amp;version=3&amp;ap=%2526fmt%3D18&amp;autohide=1&amp;fs=1&"+
			"amp;theme=light&amp;color=white";
	var iframe1 = createEl('iframe',['className',' embeddedVideoEditor','id','embeddedVideoEditor'+istr,'src',srcStr,
			'type',"application/x-shockwave-flash",'allowFullScreen','']);
	//Video URL:
	var div8 = createEl('div',['className',' videoUrlInputsContainer','id','videoUrlInputsContainer'+istr]);
	var input1 = createEl('input',['type','text','className',' videoUrlInput','placeHolder',"Video URL",'id','videoUrlInput'+istr]);
	var input2 = createEl('input',['type','button','className',' videoUrlButton','id','videoUrlButton'+istr,'value','Apply URL']);
	var hiddenInput1 = createEl('input',['type','hidden','className','videoCaptionEditor','id','videoCaptionEditor'+istr]);
	input2.onclick = function() {applyUrl(istr);};
	//Video start and end times:
	var div9 = createEl('div',['className',' videoTimeInputsContainer','id','videoTimeInputsContainer'+istr]);
	var text1=document.createTextNode('Start time:');
	var text2=document.createTextNode('End Time:');
	var input3 = createEl('input',['type','text','className',' videoStartTimeInput','id','videoStartTimeInput'+istr,'placeHolder',"hh:mm:ss"]);
	var input4 = createEl('input',['type','text','className',' videoEndTimeInput','id','videoEndTimeInput'+istr,'placeHolder',"hh:mm:ss"]);
	var input5 = createEl('input',['type','button','className',' videoTimesButton','id','videoTimesButton'+istr,'value','Apply times']);
	input5.onclick = function() {applyVideoTimes(istr);};

	//Assemble the DOM branch:
	appendNextElementsInList([div7,iframe1, div8,[input1,input2], div9,[text1,input3,text2,input4,input5], 
			div6,[div7,div8,div9,hiddenInput1]]);
	return div6;
}


function applyUrl(istr) {
	var url = document.getElementById('videoUrlInput'+istr).value;
	var k = url.indexOf('v=');
	var theId = url.substring(k+2,k+13);
	srcStr = "https://www.youtube.com/embed/"+theId+"?wmode=transparent"+
			"&rel=0&amp;modestbranding=1&amp;version=3&amp;ap=%2526fmt%3D18&amp;autohide=1&amp;fs=1&"+
			"amp;theme=light&amp;color=white";
	document.getElementById('embeddedVideoEditor'+istr).src = srcStr;
	/*var newScript = createEl('script',[ 'type','application/json', 
			'src',"http://gdata.youtube.com/feeds/api/videos/"+theId+"?v=2&amp;alt=json-in-script&amp;callback=youtubeFeedCallback"]);
	document.getElementsByTagName('body')[0].appendChild(newScript);*/
	getVideoInformation(theId);//This does some JSONC stuff. I don't understand it yet.
	setTimeout( function() {
		gEBI('videoCaptionEditor'+istr).value = gEBI('videoCaptionEditorDefault').value;
	},3000); 
}


function youtubeFeedCallback( data ) {
	var captionValue = '';
	captionValue += "Author: " + info.data.uploader;//data.entry[ "author" ][ 0 ].name.$t;
	captionValue += '<br><a href="https://www.youtube.com/watch?v='+info.data.id+'">Watch on YouTube</a>';//' + data.entry[ "media$group" ][ "media$player" ].url + '" target="_blank">Watch on YouTube</a>';
	gEBI('videoCaptionEditorDefault').value = captionValue;
}

function getVideoInformation(IDs) {
    if (IDs) {
        registerScript('https://gdata.youtube.com/feeds/api/videos/'+IDs+'?v=2&alt=jsonc&callback=videoInfoCallback');
    } else {
        alert('Please enter an id.');
    }
}

function registerScript(url) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    document.getElementsByTagName('head')[0].appendChild(s);
}
 
function videoInfoCallback(info) {
    if (info.error) {
        alert('Error\n\n' + info.error.message);
    } else {
		var captionValue = '';
		captionValue += "Author: " + info.data.uploader;
        //var captionvalue = info.data.uploader;
        captionValue += '<br><a href="https://www.youtube.com/watch?v='+info.data.id+'" target="_blank">Watch on YouTube</a>';
		gEBI('videoCaptionEditorDefault').value = captionValue;
    }
}


function applyVideoTimes(istr) {
	var oldSrc=document.getElementById('embeddedVideoEditor'+istr).src;
	var startInput=document.getElementById('videoStartTimeInput' + istr).value;
	if (startInput != "") {
		var startTime = hhmmssToSeconds(startInput);
		if (oldSrc.indexOf('start') == -1) {
			oldSrc += '&start=' + startTime.toString();
		} else {
			var si=0;
			var ii=oldSrc.indexOf('start=')+6;
			while (!isNaN(oldSrc.charAt(ii+si))) {//...so while it IS a number...
				si++;
				if (ii+si==oldSrc.length) {
					break;//Because once it gets to the end, it crashes the browser...
				}
			}
			oldSrc=oldSrc.replace('start='+oldSrc.substring(ii,ii+si), 'start='+startTime.toString());
			document.getElementById('videoUrlInput' + istr).value = oldSrc;
		}
	}
	
	var endInput=document.getElementById('videoEndTimeInput' + istr).value;
	if (endInput != "") {
		var endTime = hhmmssToSeconds(endInput);
		if (oldSrc.indexOf('end') == -1) {
			oldSrc += '&end=' + endTime.toString();
		} else {
			var si=0;
			var ii=oldSrc.indexOf('end=')+4;
			while (!isNaN(oldSrc.charAt(ii+si))) {//...so while it IS a number...
				si++;
				if (ii+si==oldSrc.length) {//Because once it gets to the end, it crashes the browser...
					break;
				}
			}
			oldSrc=oldSrc.replace('end='+oldSrc.substring(ii,ii+si), 'end='+endTime.toString());
		}
	}
	document.getElementById('embeddedVideoEditor'+istr).src = oldSrc;
}


function createImageBoxBody(istr) {
	//Container:
	var div6 = createEl('div',['className',' imageBoxInnerContainer','contentEditable','false','id','imageBoxInnerContainer'+istr]);
	// Form:
	var form1 = createEl('form',['className',' imageForm','id','imageBoxImageForm'+istr,'name','imageBoxImageForm'+istr]);
	//Container:
	var div7 = createEl('div',['className',' imageContainerEditor','id',' imageBoxImageContainer'+istr]);
	var text1 = document.createTextNode('\"A towel, [The Hitchhiker\'s Guide to the Galaxy] says, is '+
			'about the most massively useful thing an interstellar hitchhiker can have. '+
			'Partly it has great practical value. You can wrap it around you for warmth as '+
			'you bound across the cold moons of Jaglan Beta; you can lie on it on the brilliant '+
			'marble-sanded beaches of Santraginus V, inhaling the heady sea vapors; you can sleep '+
			'under it beneath the stars which shine so redly on the desert world of Kakrafoon; use '+
			'it to sail a miniraft down the slow heavy River Moth; wet it for use in hand-to-hand-combat; '+
			'wrap it round your head to ward off noxious fumes or avoid the gaze of the Ravenous Bugblatter '+
			'Beast of Traal (such a mind-boggingly stupid animal, it assumes that if you can\'t see it, it '+
			'can\'t see you); you can wave your towel in emergencies as a distress signal, and of course dry '+
			'yourself off with it if it still seems to be clean enough.\"');
	var img5 = createEl('img',['className',' previewImageEditor','src','/1images/imageIcon.jpg','id','imageBoxPreviewImageEditor'+istr]);
	//Now for the options...
	var div8 = createEl('div',['className',' imageOptionsContainer','id',' imageBoxImageOptionsContainer'+istr]);
	var input1 = createEl('input',['type','button','className',' createNewImageButton','id','imageBoxCreateNewImageButton'+istr,
			'value','Create New Image']);
	var input2 = createEl('input',['type','button','className',' loadImageButton','id',' imageBoxLoadImageButton'+istr,
			'value',"Load Image/Graph"]);
	input2.onclick = function() {showElement('imageBoxImageUploadBox'+istr);};
	var input3 = createEl('input',['type','text','className',' searchImageInput','id','imageBoxSearchImageInput',
			'placeHolder',"Search Image Library"]);
	var br1=document.createElement('br');
	var input4 = createEl('input',['type','radio','className',' searchImagesByNameRadio','id','imageBoxSearchImagesByNameRadio'+istr,
			'name','searchByRadio'+istr,'value',"Search by image name"]);
	var text2=document.createTextNode('Search by image name');
	var br2=document.createElement('br');
	var input5 = createEl('input',['type','radio','className',' searchImagesByDescriptionRadio','id','imageBoxSearchImagesByDescriptionRadio'+istr,
			'name','searchByRadio'+istr,'value',"Search by image description"]);
	var text3=document.createTextNode('Search by image description');
	var br3=document.createElement('br');
	var input6 = createEl('input',['type','button','className',' editSelectedImage','id','imageBoxEditSelectedImage'+istr,
			'value',"Edit Selected Image"]);
	var div9 = createEl('div',['className',' imagePlaceOptions','id',' imageBoxImagePlaceOptions'+istr]);
	var input7 = createEl('textarea',['className',' imageCaptionInput','id','imageBoxImageCaptionInput'+istr,'placeHolder',"Image Caption"]);
	var text4=document.createTextNode('Image Placement:');
	var input8 = createEl('input',['type','radio','className',' imagePlacementCenterRadio','id','imageBoxImagePlacementCenterRadio'+istr,
			'name','imagePlacementRadio'+istr,'value',"imagePositionCenter"]);
	input8.onclick=function() {
		updateImagePosition('imageBoxImagePlacementCenterRadio'+istr,'imageBoxPreviewImageEditor'+istr);
	};
	var text5=document.createTextNode('Center');
	var input9 = createEl('input',['type','radio','className',' imagePlacementRightRadio','id','imageBoxImagePlacementRightRadio'+istr,
			'name','imagePlacementRadio'+istr,'value',"imagePositionRight",'checked','true']);
	input9.onclick=function() {
		updateImagePosition('imageBoxImagePlacementCenterRadio'+istr,'imageBoxPreviewImageEditor'+istr);//Since there are only 2 options
	};
	var text6=document.createTextNode('Right');
	// Create the box/window that pops up when a user wants to upload an image:
	var div10=createEl('div',['className','imageUploadBox','id','imageBoxImageUploadBox'+istr]);
	var div14=createEl('div',['className','imageUploadCloseBoxButton','id','imageBoxImageUploadCloseBoxButton'+istr]);
	div14.onclick=function() {hideElement('imageBoxImageUploadBox'+istr);};
	var div15=createEl('div',['className','imageUploadCloseBar','id','imageBoxImageUploadCloseBar'+istr]);
	var div11=createEl('div',['className','imageUploadBoxContents','id','imageBoxImageUploadBoxContents'+istr]);
	var input10 = createEl('input',['type','file','className','chooseFileButton','id','imageBoxChooseFileButton'+istr,
			'name','imageBoxChooseFileButton'+istr]);
	var input11 = createEl('input',['type','button','className','uploadFileButton','id','imageBoxUploadFileButton'+istr,
			'name','imageBoxUploadFileButton'+istr,'value','Upload']);
	var br4 = document.createElement('br');
	//input11.onclick = function(){thingiverse();};
	var div12=createEl('div',['className','imageUploadOr','id','imageBoxImageUploadOr'+istr]);
	var text7=document.createTextNode('or');
	var input12 = createEl('input',['type','text','className','pasteImageURL','id','imageBoxPasteImageURL'+istr,
			'name','imageBoxPasteImageURL'+istr,'placeHolder','Paste Image URL']);
	var input13 = createEl('input',['type','button','className','saveFileFromURL','id','imageBoxSaveFileFromURL'+istr,
			'name','imageBoxSaveFileFromURL'+istr,'value','Save']);
	var br5 = document.createElement('br');
	var div13=createEl('div',['className','uploadGraphExplanation','id','imageBoxUploadedGraphExplanation'+istr]);
	var howToLoadInGraphs = 'To make graphs, go <a href="http://www.craigsmaths.com/openPlaG/openPlaG.html" target="_blank">here</a>,'+
		' create your graph, '+
		'right click on the image, then '+
		'select "copy image URL". Then paste it above in the "Paste Image URL" text field.';
	div13.innerHTML = howToLoadInGraphs;
	
	//Assemble the DOM branch:
	appendNextElementsInList([div7,[img5,text1], div8,[input1,input2,input3,br1,input4,text2,br2,input5,text3,br3,input6], 
			div9,[input7,text4,input8,text5,input9,text6], div12,[text7], div11,[input10,input11,br4,div12,input12,input13,br5,div13], 
			div15,[div14], div10,[div15,div11], form1,[div7,div8,div9], div6,[form1,div10]]);

	return div6;
}


function updateImagePosition(imagePlacementCenterRadioID,previewImageID) {
	var e=document.getElementById(imagePlacementCenterRadioID);
	if (e.checked) {
		gEBI(previewImageID).className += ' previewImageEditorCentered';
	} else {
		switchClassNameOnOff(previewImageID,' previewImageEditorCentered');
	}
}