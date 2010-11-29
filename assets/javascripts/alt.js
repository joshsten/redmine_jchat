// @Author - Joshua Enfield
// @Date - Fri Nov 6 2010
// @Notes - this system is initialized by calling jchatInit()
// -----------------------------------------------------------

// Wrap the script effectively creating a namespace.
function ()
{
// Configuration Variables
var delayGradient = 1;			// Stub - Not Implemented.
var pollInterval  = 5;			// The interval of the polling.
var showMessagesAsFromMe = false;	// Flag - Should messages be altered to show from "Me"  if they are from the sender?
var colorMessagesFromMe = true;		// Flag - Should messages be altered in color if they are from the sender?
var numMessagesToShow = 15;		// The number of most recent messages to show.

// Globals
var newMessage		// Flag that tells us weather we have a new message or not. This is what the window flashing routines use.
var firstMessages=1;	// Flag to tell us if we are receiving the first round of messages.
var messages = {};	// A list (array) of our messages
var messageCount=0;	// The current message count => number of entries in messages
var pollMutex=0;	// This is a mutex (lock) so that we don't poll for the same data twice.
var mostRecentMessageId = 0;

//x 1. Set the autoscroll flag to true if the chat frame is current scrolled all the way down.
// 2. Get the newest messages. (Ajax Request)
// 3. Add them to our messages (increment newMessageCount as added)
//x 4. If  the messageCount > numMessagesToShow then shift the different off the messages list
//x 	 Reload the chat frame with the updated message list.
//x 5. Scroll to the bottom if the autoScroll flag is set.
// -----
// On the server retreive all messages > than the sent id (sanatize this => require int) with a limit of 15 and in DESC order
function getNewMessages()
{
	var newMessageCount=0;	

	var autoscroll=false;
	if ( $('chatMessages').scrollTop == $('chatMessages').scrollHeight) autoscroll=true;
	
	if (messageCount > numMessagesToShow)
	{
		while (messageCount > numMessagesToShow)
			shiftMessage();
		messages.join('<!-- New Message -->');
	}else{
		for (i=messageCount-newMessageCount;i<messageCount;i++)
			$('chatMessages').innerHTML+=messages[i];
	}
	

	if (autoscroll) scrollMessageToMostRecent();
}

// Effectively remove the first element.
// Move all messages after the first one minus one index. Then remove the end index (duplicate)
function shiftMessage()
{
	for (i=0;i<messageCount-2;i++)
		messages[i] = messages[i+1];
	messages[messageCount-1] = null;
	messageCount--;
}

// If the text field is blank don't send anything
// Otherwise reset the text field and send the message to the server
// We then call an immediate update for the chat to ensure the new message shows immediately.
function sendMessage()
{
	text=$('txtMsg').value;
      	if (text=="") return;
        $('txtMsg').value="";
      	
	var myAjax = new Ajax.Request(
      		'/chat/send_chat',
      		{method: 'post', parameters: {msg: text}}
	);

	getNewMessages();
}

// Simply scroll the chat frame to the bottom.
function scrollMessageToMostRecent()
{
	$('chatMessages').scrollTop = $('chatMessages').scrollHeight;
}

// Get the new messages
// Call self after the poll interval.
function pollMessages()
{
	getNewMessages();
	setTimeout(pollMessage, pollInterval);
}

// Initialize the chat system
// Catch the enter events in order to trigger our message sending routines.
// We also want to setup an event on the chatArea so that we can reset the new message flag when the mouse hovers over it.
window.jchatInit = function()
{
        $('txtMsg').observe('keypress', function(event){
        var key = event.which || event.keyCode;
    switch (key) {
        default:
        break;
        case Event.KEY_RETURN:
            submitMsg();
        break;
    }
});

        Event.observe('chatArea', 'mouseover', function(event) {
                newMessage=0;
        });


}
}
(function () {

var original = document.title;
var timeout;

window.flashMsg = function (newMsg) {
    function step() {
        document.title = (document.title == original) ? newMsg : original;
        $('chatFooter').innerHTML = ($('chatFooter').innerHTML == "Chat") ? newMsg : "Chat";
        if (newMessage==1) {
            timeout = setTimeout(step, 1000);
        }else{
                $('chatFooter').innerHTML = "Chat";
                document.title = original;
		clearTimeout(timeout);
        };
    };


    clearTimeout(timeout);

    step();
};

window.cancelFlashTitle = function () {
    clearTimeout(timeout);
    document.title = original;
};

}());

