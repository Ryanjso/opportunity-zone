const express = require('express');
const router = express.Router();
const axios = require('axios');
const tractCodeData = require('../data');

router.post('/', async (req, res) => {
  let responseFromGeocode;
  let payload = {};

  await axios
    .post(
      'https://geomap.ffiec.gov/FFIECGeocMap/GeocodeMap1.aspx/GetGeocodeData',
      req.body
    )
    .then((res) => {
      responseFromGeocode = res.data;
    })
    .catch((error) => {
      console.error(error);
      res.send({ message: error });
    });

  // If the address doesn't exist or is wrong format
  if (responseFromGeocode.d.sMsg === 'No Match.') {
    res.send({ message: responseFromGeocode.d.sMsg });
    return;
  }

  payload.message = responseFromGeocode.d.sMsg;
  payload.county = responseFromGeocode.d.sCountyName.trim();
  payload.matchedAddress = responseFromGeocode.d.sMatchAddr;

  const structuredTractCode =
    responseFromGeocode.d.sStateCode +
    responseFromGeocode.d.sCountyCode +
    responseFromGeocode.d.sTractCode.replace('.', '');

  const foundInDB = tractCodeData.ozArray.filter(
    (obj) => obj.censusTractNumber === structuredTractCode
  );

  if (foundInDB[0]) {
    payload.isInOz = true;
    payload.censusTractNumber = foundInDB[0].censusTractNumber;
    payload.tractType = foundInDB[0].tractType;
    res.send(payload);
  } else {
    payload.isInOz = false;
    res.send(payload);
  }
});

module.exports = router;
