require('dotenv').config();

const express = require('express')
const app = express()

//For parsing application/json
app.use(express.json())
var iothub = require("azure-iothub");

var iothubClient = require("azure-iothub").Client;
var client = iothubClient.fromConnectionString(
  process.env.EVOLVO_IOTHUB
)
const registry = iothub.Registry.fromConnectionString(process.env.EVOLVO_IOTHUB);

app.get('/',(req,res) => {
    getDeviceRegistery()
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/getstatus', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "GetStatus",
            payload: {},
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device Not Online"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        res.status(400).send(err)
    }
})

app.post('/api/unlock', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "Unlock",
            payload: req.body,
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device Not Online"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

app.post('/api/auth_key', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "AuthorizeUser",
            payload: req.body,
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device NotOnline/Timeout"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

app.post('/api/deauth_key', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "DeauthorizeUser",
            payload: req.body,
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device Not Online"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

app.post('/api/deauth_all_key', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "DeauthorizeAll",
            payload: {},
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device Not Online"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

app.post('/api/tracking', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "AutoTracking",
            payload: JSON.stringify(req.body),
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device NotOnline/Timeout"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

app.post('/api/alarm_off', async (req, res) => {
    try 
    {
        const device_id = req.query.device_id;
        const methodParams = {
            methodName: "AlarmOff",
            payload: {},
            responseTimeoutInSeconds: 15,
          }
        const deviceResponse = await deviceMethoFunction(device_id, methodParams);
        if(!deviceResponse) res.status(404).send({error: "Device NotOnline/Timeout"})
        res.send(deviceResponse)
    } 
    catch(err)
    {
        console.log("error");
        res.status(400).send({error: err})
    }
})

async function deviceMethoFunction(device_id, methodParams) {
    return new Promise((resolve, reject) => {
      client.invokeDeviceMethod(device_id, methodParams, (err, result) => {
        if(err){
            reject(JSON.parse(err.responseBody))
        } else {
            resolve(result)
        }
      })
    });
  }

  async function getDeviceRegistery(){
    console.log("getDeviceRegistery");
    const query = registry.createQuery("SELECT * FROM devices WHERE status = 'enabled'", 100);

    query.nextAsTwin(function (err, results) {
      if (err) {
        console.error('Error querying twins: ' + err.toString());
      } else {
        results.forEach(function (twin) {
          console.log(`Device ID: ${twin.deviceId}`);
          console.log(`Status: ${twin.status}`);
          console.log(`Connection State: ${twin.connectionState}`);
          console.log('---');
        });
      }
    });
    
  }

console.log("listing to " + process.env.PORT);
app.listen(process.env.PORT || 8484)