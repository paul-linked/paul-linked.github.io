var Airtable = require('airtable');
var baseImages = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appVDiUQURtQ4oD82');

var displayImages = function () {
  $('#image-list').empty();

  baseImages('Images').select({
    sort: [
      { field: 'Name', direction: 'asc' }
    ]
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      var $image = $('<div>').addClass('image');
      $image.append($('<h3>').text(record.get('Name')));
      $image.append($('<img>').attr('src', record.get('Image')[0].url));

      $('#image-list').append($image);
    });

    fetchNextPage();
  }, function done(error) {
    console.log(error);
  });
};

displayImages();
