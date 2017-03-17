'use strict';

const Assistant = require('actions-on-google').ApiAiAssistant;
const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

app.post('/', function (req, res) {
  console.log(JSON.stringify(req.body));
  const assistant = new Assistant({ request: req, response: res});


  function locPermHandler(assistant) {
    let permission = assistant.SupportedPermissions.DEVICE_COARSE_LOCATION;
    assistant.askForPermission('To test zip code', permission);
  }

  function nameLocHandler(assistant) {
    let permissions = [assistant.SupportedPermissions.DEVICE_COARSE_LOCATION, assistant.SupportedPermissions.NAME];
    assistant.askForPermissions('To test zip code and name', permissions);
  }

  function afterPermissionGranted (assistant) {
    if(assistant.isPermissionGranted()) {
      let zipCode = assistant.getDeviceLocation().zipCode;
      assistant.tell('Here is the zip : ' + zipCode);

    } else {
      assistant.tell('Permission not granted');
    }
  }


  const actionMap = new Map();
  actionMap.set('ask.permission', locPermHandler);
  actionMap.set('handle.permission', afterPermissionGranted);
  actionMap.set('name_and_loc', nameLocHandler);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
