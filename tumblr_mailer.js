var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: ''
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync("email_template.html","utf8");


function csvParse(csvFile) {
	arrayOfObjects = [];
	var splitbyLine = csvFile.split("\n");
	var header = splitbyLine[0].split(",");
	var contacts = splitbyLine.splice(1);
	// var filteredcontacts = contacts[1].split(",");

	var filteredcontacts = contacts.map(function(element) {
		return element.split(",");
	})

	// Why does it fail if I put initialize the newObj outside?
	for (var i = 0; i < filteredcontacts.length; i++) {
		newObj = {};
		for (var j = 0; j < header.length; j++) {
			newObj[header[j]] = filteredcontacts[i][j];
			// for (var key in newObj) {
			// 	newObj[key] = splitbyLine[i][j];
			// }		
		}
		arrayOfObjects.push(newObj);	
	}	

	// for (var i = 0; i < header.length; i++) {
	// 	newObj[header[i]];
	// }
	
	return arrayOfObjects;
}

friendList = csvParse(csvFile);


friendList.forEach(function(row){
    firstName = row["firstName"];
    numMonthsSinceContact = row["numMonthsSinceContact"];
    emailAddress = row["emailAddress"];
    })

client.posts('jacobjzhang.tumblr.com', function(err, blog){
 	// arrayofposts.push(blog["posts"]);
	arrayofposts = [];
	for (i = 0; i < blog["posts"].length; i++) {
		// Convert blog date to a comparable format and compare by miliseconds
		if (( (new Date() - new Date(blog["posts"][i]["date"])) / (60*60*24*1000) ) < 7) { 
		arrayofposts.push(blog["posts"][i]);
		}
		}

	customizedTemplate = ejs.render(emailTemplate, {
	firstName: firstName,  
    numMonthsSinceContact: numMonthsSinceContact,
    latestPosts: arrayofposts
	});

	 function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	    var message = {
	        "html": message_html,
	        "subject": subject,
	        "from_email": from_email,
	        "from_name": from_name,
	        "to": [{
	                "email": to_email,
	                "name": to_name
	            }],
	        "important": false,
	        "track_opens": true,    
	        "auto_html": false,
	        "preserve_recipients": true,
	        "merge": false,
	        "tags": [
	            "Fullstack_Tumblrmailer_Workshop"
	        ]    
	    };
	    var async = false;
	    var ip_pool = "Main Pool";
	    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
	        // console.log(message);
	        console.log(result);   
	    }, function(e) {
	        // Mandrill returns the error as an object with name and message keys
	        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	    });
	 }

	 sendEmail(firstName, emailAddress, 'Jake', 'jacobjzhang@gmail.com', 'Hey!', customizedTemplate );
	// console.log(customizedTemplate);

		// }
})
