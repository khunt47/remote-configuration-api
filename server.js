const express = require('express');
const axios = require('axios');
const path = require('path');
const { Datastore } = require('@google-cloud/datastore');

const app = express();
const datastore = new Datastore();
app.use(express.json());


//code comes here

async function saveReqBody(reqBody) {
  const key = datastore.key('RequestConfigs');

  const newReqData = {
    key,
    data: {
      reqBody,
      createdAt: new Date()
    }
  };

  const [savedKey] = await datastore.save(newReqData);
  return savedKey.id;
}


app.post('/store', async (req, res) => {
  try {
  	const reqBody = req.body;

  	if (
      !reqBody ||
      typeof reqBody !== 'object' ||
      Array.isArray(reqBody) ||
      Object.keys(reqBody).length === 0
    ) 
    {
      return res.status(400).json({
        error: 'Request body must be a non-empty JSON object.'
      });
    }

  	await saveReqBody(reqBody);
  	res.status(200).send('Saved');
  } 
  catch (err) {
    console.error('Check job failed:', err);
    res.status(500).send('Check execution error.');
  }
});


const PORT = process.env.PORT || 9085;
app.listen(PORT, () => console.log(`Remote config server listening on port ${PORT}`));