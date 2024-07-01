/* I've hit a brick wall with this project. Seems I would need access to create a Service Account on GCP
(probably not allowed by Admin) and use the key in the JSON file in order to use chat.bot scope. 

If I did have this ability, I would need to utilize the following to assign Service Account in appsscript.json
in order to apply chat.bot scope:

const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account.json', // Path to service account key file
  scopes: ['https://www.googleapis.com/auth/chat.bot'], // The scope for Google Chat API
});

const chat = google.chat({version: 'v1', auth}); 

*/

function processAllChats() {
  var allChatIds = getAllChatIds(); // This function needs to fetch all chat IDs from Google Chat API
  allChatIds.forEach(function(chatId) {
    var rawData = fetchChatData(chatId); // Fetch the raw data for each chat ID
    run(chatId, rawData); // Assuming 'run' is your main function that processes each chat
  });
}

function run(chatId, rawData) {
  var data = parseMessages(rawData); // Assuming rawData is the API response that needs parsing
  saveChatAndAttachments(chatId, data);
}

function saveChatAndAttachments(chatId, data) {
  var folder = getOrCreateFolder(chatId);
  var doc = getOrCreateDoc(folder, chatId);
  var body = doc.getBody();

  data.messages.forEach(function(message) {
    if (message.text) {
      // Append text to the Google Doc
      body.appendParagraph(new Date(message.timestamp).toLocaleString() + ": " + message.text);
    }
    if (message.attachments) {
      message.attachments.forEach(function(attachment) {
        var file = saveAttachment(folder, attachment);
        // Create a link in the Google Doc to the attachment
        body.appendParagraph("Attachment: " + file.getUrl()).setLinkUrl(file.getUrl());
      });
    }
    body.appendHorizontalRule(); // Adds a divider for clarity
  });
  
  doc.saveAndClose();
}

function getOrCreateFolder(chatId) {
  var chatsFolder = getChatsParentFolder();
  var folders = chatsFolder.getFoldersByName("Chat_" + chatId);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return chatsFolder.createFolder("Chat_" + chatId);
  }
}

function getChatsParentFolder() {
  var folders = DriveApp.getFoldersByName("Chats");
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder("Chats");
  }
}


function getOrCreateDoc(folder, chatId) {
  var files = folder.getFilesByName("Chat_" + chatId + "_Conversations");
  if (files.hasNext()) {
    return DocumentApp.openById(files.next().getId());
  } else {
    var doc = DocumentApp.create("Chat_" + chatId + "_Conversations");
    var file = DriveApp.getFileById(doc.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    return doc;
  }
}

function saveAttachment(folder, attachment) {
  // Example: saving an image attachment
  var blob = Utilities.newBlob(attachment.bytes, attachment.mimeType, attachment.fileName);
  var file = folder.createFile(blob);
  return file;
}

function parseMessages(data) {
  var messages = [];
  data.messages.forEach(function(message) {
    // Assuming 'message' is the structure containing the chat message details
    var parsedMessage = {
      text: message.text, // The text of the message
      timestamp: message.createTime, // Timestamp of the message
      sender: message.sender.displayName, // Display name of the sender
      attachments: []
    };

    // Check for attachments and parse them
    if (message.attachments) {
      message.attachments.forEach(function(attachment) {
        parsedMessage.attachments.push({
          url: attachment.attachmentData.resourceUrl, // URL to the attachment
          mimeType: attachment.attachmentData.type, // MIME type of the attachment
          fileName: attachment.name // Name of the attachment file
        });
      });
    }

    messages.push(parsedMessage);
  });
  return messages;
}

function getAllChatIds() {
  var apiUrl = 'https://chat.googleapis.com/v1/spaces';  // Assuming this endpoint or similar exists
  var accessToken = ScriptApp.getOAuthToken();  // Get the OAuth token for authorization
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'muteHttpExceptions': true
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var result = JSON.parse(response.getContentText());
  
  if (response.getResponseCode() == 200) {
    var chats = result.spaces;  // Assuming the result has a 'spaces' array containing chat information
    var chatIds = chats.map(function(chat) {
      return chat.name;  // Extracting chat ID, assuming 'name' contains the ID
    });
    return chatIds;
  } else {
    Logger.log('Failed to fetch chat IDs: ' + result.error.message);
    return [];  // Return an empty array if the API call fails
  }
}