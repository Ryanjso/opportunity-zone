// 610 E South St, Mankato, KS 66956

$(document).ready(function () {
  // Get value on button click and send to server
  $('#addressForm').submit(function () {
    const address = $('#addressInput').val();
    resetResults();
    getGeocodeData(address);
    return false;
  });
});

function getGeocodeData(address) {
  const url = 'http://localhost:3095/api';
  const data = {
    sSingleLine: address,
    iCensusYear: '2020',
  };

  $.ajax({
    type: 'POST',
    url,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    success: function (res) {
      $('.apiResults').removeClass('hidden');

      if (res.message === 'No Match.') {
        addressNotRecognized();
      } else {
        addressRecognized(res);
      }

      console.log(res);
    },
    error: function (err) {
      console.log(err);
      alert(err);
    },
  });
}

function addressNotRecognized() {
  // add an error popup
  console.log('Address is not recognized');

  if ($('#errorInfo').hasClass('hidden')) {
    $('#errorInfo').removeClass('hidden');
  }
}

function addressRecognized(res) {
  $('#addressInput').val('');

  updateDataOnScreen(res);
}

function updateDataOnScreen(res) {
  console.log('yuh');

  if ($('#extraInfo').hasClass('hidden')) {
    $('#extraInfo').removeClass('hidden');
  }

  if (res.isInOz) {
    if ($('#inOz').hasClass('hidden')) {
      $('#inOz').removeClass('hidden');
    }
    if ($('#tractCodeDiv').hasClass('hidden')) {
      $('#tractCodeDiv').removeClass('hidden');
    }
    if ($('#typeDiv').hasClass('hidden')) {
      $('#typeDiv').removeClass('hidden');
    }
  } else {
    if ($('#notInOz').hasClass('hidden')) {
      $('#notInOz').removeClass('hidden');
    }
  }

  $('#address').text(res.matchedAddress);
  $('#county').text(res.county);
  $('#tractCode').text(res.censusTractNumber);
  $('#type').text(res.tractType);
}

function resetResults() {
  $('#extraInfo').addClass('hidden');
  $('#errorInfo').addClass('hidden');
  $('#inOz').addClass('hidden');
  $('#notInOz').addClass('hidden');

  // these are wrong address the divs instead
  $('#tractCodeDiv').addClass('hidden');
  $('#typeDiv').addClass('hidden');

  $('#address').text('');
  $('#county').text('');
  $('#tractCode').text('');
  $('#type').text('');
}
