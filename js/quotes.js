var quotesApp = {};

quotesApp.quotesURL = 'https://andruxnet-random-famous-quotes.p.mashape.com/';
quotesApp.textToSpeechURL = 'https://speech.platform.bing.com/synthesize';
quotesApp.googleImageSearchURL = '';

quotesApp.quoteObject = {};
quotesApp.authorImageURL = '';
quotesApp.authorImage = new Image();
quotesApp.authorImageDetails = {};
quotesApp.audio = {};
quotesApp.faceBoundingBoxURL = {};

quotesApp.volumeOn = false;

$thePic = document.getElementById('author-pic');
$volumeButton = document.getElementById('volume-control');

quotesApp.loadingScreen = $('#loading');

quotesApp.tTSToken = '';
var msg = {};

$authorImageDiv = $('#author-pic');

// Start Ajax requests
quotesApp.startAjaxRequests = function() {
	// Request a random quote object
	quotesApp.quoteObject =
	$.ajax({
		url: quotesApp.quotesURL,
		method: 'POST',
		dataType: 'json',
		headers: {"X-Mashape-Key": "I3jRLXVXDBmshledBDOuERvETlayp1QsXapjsndgAhYjI6P9Sq",
			    "Content-Type": "application/x-www-form-urlencoded",
			    "Accept": "application/json"},
		data: {
			cat: 'famous'
		}
	});
}

// Set the page to a new quote/author combination
// and cue text-to-speech for the quote
quotesApp.setNewObject = function() {
	$.when(quotesApp.quoteObject).then(function(returnedObject) {
		quotesApp.quoteObject = returnedObject;
		quotesApp.getAuthorImage(quotesApp.quoteObject.author);
		// Proper TTS through microsoft
		// quotesApp.issueTTSToken();
		quotesApp.completeSet();
	});
}

// quotesApp.setNewObjectFinish = function() {
// 	$.when(quotesApp.quoteObject, quotesApp.authorImageURL).then(function(value, data) {

// 	});
// }

quotesApp.completeSet = function() {
	$.when(quotesApp.quoteObject, quotesApp.authorImageURL).then(function(ret1, ret2) {
  quotesApp.setPageTexts(quotesApp.quoteObject.quote, quotesApp.quoteObject.author);
		// Softer HTML5 TTS
		quotesApp.authorImage.onload = function (){
        	// $thePic.style.backgroundImage = quotesApp.authorImage;
        	$thePic.style.backgroundImage = 'url(' + quotesApp.authorImageURL + ')';
        	quotesApp.textToSpeech2(quotesApp.quoteObject.quote);
			quotesApp.loadingScreen.hide();
		};
		// quotesApp.setPageTexts(quotesApp.quoteObject.quote, quotesApp.quoteObject.author);
		// // Softer HTML5 TTS
		// quotesApp.textToSpeech2(quotesApp.quoteObject.quote);
		// quotesApp.loadingScreen.hide();

	});
}

// Set the quote and author text
quotesApp.setPageTexts = function(quote, author) {
	$('#quote').text('"' + quote + '"');
	$('#author-name').text("– " + author);
	$('.twitter-share-button').attr(`href`, `https://twitter.com/intent/tweet?text=${quotesApp.quoteObject.quote} –${quotesApp.quoteObject.author} (vbar.io/quotes)`);
	$('.twitter-share-button').attr('target', '_blank');
	$('.facebook-share-button').attr(`href`, `https://www.facebook.com/sharer/sharer.php?u=vbar.io/quotes`);
	$('.facebook-share-button').attr('target', '_blank');
	
	var fbURL = 'http://www.facebook.com/sharer.php?s=100&p[title]='+encodeURIComponent('this is a title') + '&p[summary]=' + encodeURIComponent('Check check check check') + '&p[url]=' + encodeURIComponent('http://www.nufc.com') + '&p[images][0]=' + encodeURIComponent('http://www.somedomain.com/image.jpg');
	$('.facebook-share-button').attr(`href`, fbURL);
}

quotesApp.textToSpeech2 = function(quote) {
	console.log("tts1");
		msg = new SpeechSynthesisUtterance(quote);
		// console.log(quotesApp.volumeOn);
	if (quotesApp.volumeOn) {
	console.log("tts2");
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(msg);
	}
}

// Play a text-to-speech recording of the input string
quotesApp.textToSpeech = function(token, inputString) {
	console.log('Text-to-speech: ', inputString);
    var params = {
    	// Request parameters
    };

		quotesApp.audio = $.ajax({
	            url: quotesApp.textToSpeechURL + $.param(params),
	            // beforeSend: function(xhrObj){
	            //     // Request headers
	            //     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","1e54d96e1d6a4ee3b92562b6a397c860");
	            // },
	            headers: {
	            	Authorization: "Bearer " + token.access_token
	            	// Content-Type: audio/wav; codec=”audio/wav”; samplerate=16000; sourcerate=8000; trustsourcerate=false;
	            },
	            type: "POST",
	            data: {
	            	client_id: "1e54d96e1d6a4ee3b92562b6a397c860",	
	            	client_secret: "1e54d96e1d6a4ee3b92562b6a397c860"
	            }
	        })
	        .done(function(data) {
	        	console.log('TTV response: ', data)
	        })
	        // .fail(function() {
	        //     alert("error");
	        // });
}

// Issue token for text-to-speech
quotesApp.issueTTSToken = function() {
		$.ajax({
            url: 'https://oxford-speech.cloudapp.net/token/issueToken',
            type: "POST",
            data: {
            	grant_type: 'client_credential',
            	client_id: "1e54d96e1d6a4ee3b92562b6a397c860",	
            	client_secret: "1e54d96e1d6a4ee3b92562b6a397c860",
            	scope: 'https://speech.platform.bing.com'
            }
        }).done(function(returnedData) {
        	console.log('returned token:', returnedData);
        	quotesApp.textToSpeech(returnedData, quotesApp.quoteObject.quote);
        	// textToSpeech(returnedData, )
        });
}


// Set the author image
quotesApp.getAuthorImage = function(inputString) {
	console.log('Picture: ', inputString);
        var params = {
            // Request parameters
        };
      
        quotesApp.authorImageURL =
        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","485a657b20044d87b6a501f733027155");
            },
            type: "GET",
            data: {
            	q: inputString
            }
        })
        .done(function(data) {
        	var whichPic = Math.floor(Math.random()*data.value.length / 4);

        	quotesApp.authorImageDetails = data.value[whichPic];
            quotesApp.authorImageURL = data.value[whichPic].contentUrl;
            quotesApp.authorImage = new Image();
            quotesApp.authorImage.src = data.value[whichPic].contentUrl;
            // img.src = src;
            // quotesApp.authorImageHeight = 
            quotesApp.faceBoundingBoxURL =
	            $.ajax({
	            url: 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceLandmarks=true',
	            // beforeSend: function(xhrObj){
	            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","27599e9ba93845f6b427aa7f4036bc8d");
            },
            type: "POST",
            // Request body
            data: `{
    			"url": "${quotesApp.authorImageURL}"
			}`,
	        })
	        .done(function(data) {
	        	console.log(data);

	        	var percentY = (data[0].faceRectangle.top/quotesApp.authorImageDetails.height)*100;
	        	var percentX = ((data[0].faceRectangle.left + data[0].faceRectangle.width/2)/quotesApp.authorImageDetails.width)*100;

	        	if (1.75 * quotesApp.authorImageDetails.width > quotesApp.authorImageDetails.height) {
	        		percentY -= 8;
	        	}

	        	// var left = data[0].faceRectangle.left + data[0].faceRectangle.width/2;
	        	// var top = data[0].faceRectangle.top;
	        	// var top = data[0].faceRectangle.top * -1;
	        	// var left = data[0].faceRectangle.left;

	        	console.log("new style set", `${percentX} ${percentY}`);
				$thePic.style.backgroundPosition = `${percentX}% ${percentY}%`;
	        	quotesApp.faceBoundingBoxURL = ''; //something like data.url
	        })
	        .fail(function(faileData) {
	        	console.log(faileData);
	        });

            // $thePic.style.backgroundImage = 'url(' + quotesApp.faceBoundingBoxURL(quotesApp.authorImageURL) + ')';
            
            // Set div background to the image
   //          // $thePic = document.getElementById('author-pic');
			// img.onload = function (){};
   //          $thePic.style.backgroundImage = 'url(' + quotesApp.authorImageURL + ')';

            console.log("first style set");
            if ($thePic.offsetHeight < $thePic.offsetWidth) {
            	$thePic.style.backgroundPosition = '50% 25%';
            } else {
            	$thePic.style.backgroundPosition = '50% 45%';
            }

        })
        .fail(function() {
            alert("error");
        });
}

// Take a URL of a picture of a face
// Returns URL of a picture with the face
// Taking up the full
quotesApp.faceBoundingBoxURL = function(url) {
	console.log(url);

	faceBoundingBoxURL = $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","485a657b20044d87b6a501f733027155");
            },
            type: "GET",
            data: {
            	q: inputString
            }
        });

	return url;
};

quotesApp.shareQuote = function() {

}

quotesApp.replaySound = function() {
	if (quotesApp.volumeOn) {
		window.speechSynthesis.cancel();
		console.log("replaying sound");
		window.speechSynthesis.speak(msg);
	}
}

quotesApp.loadNextQuote = function() {
	quotesApp.startAjaxRequests();
	quotesApp.setNewObject();
	quotesApp.loadingScreen.show();
}

quotesApp.setReplayListener = function() {
		$('.replay-item').on('mousedown', function(event) {quotesApp.replaySound()});
		$('.next-item').on('mousedown', function(event) {quotesApp.loadNextQuote()});
		$('.share-quote').on('mousedown', function(event) {quotesApp.shareQuote()});
}

quotesApp.setVolumeControl = function() {

	$volumeButton.addEventListener('mousedown', function(event) {
		quotesApp.volumeOn = !quotesApp.volumeOn;

		if (quotesApp.volumeOn) {
	console.log('b');
			$volumeButton.className = "fa fa-volume-up";
		}
		else {
	console.log('c');
			$volumeButton.className = "fa fa-volume-off";
		}
	});
}

// Init
quotesApp.init = function() {
	console.log('INIT', 'initialized');
	
	// Starts request for a new quote object
	quotesApp.startAjaxRequests();

	// Initiate setting new object
	quotesApp.setNewObject();

	// Set button listeners
	quotesApp.setReplayListener();

	//set Volume Button listener
	quotesApp.setVolumeControl();

	quotesApp.loadingScreen.show();
}