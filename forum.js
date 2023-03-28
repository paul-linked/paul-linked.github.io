$('#add-comment-btn').on('click', function () {
  $('#comment-form').toggleClass('hidden');
});

var Key = config.Airtable_key;

var Airtable = require('airtable');
var base = new Airtable({ apiKey: key }).base('appVDiUQURtQ4oD82');

var loadProjects = function () {
  $('#project-list').empty();

  base('Projects').select({
    sort: [
      { field: 'Date', direction: 'desc' }
    ]
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      var $project = $('<li>');
      $project.append($('<strong>').text(record.get('Name') + ': '));
      $project.append($('<span>').text(record.get('Comment') + ' (' + record.get('Date') + ')'));

      $('#project-list').append($project);
    });

    fetchNextPage();
  }, function done(error) {
    console.log(error);
  });
};

var loadComments = function () {
  $('#comment-list').empty();

  base('Projects').select({
    sort: [
      { field: 'Date', direction: 'asc' }
    ]
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      var $comment = $('<div>').addClass('comment');
      $comment.append($('<h3>').text(record.get('Name')));
      $comment.append($('<p>').text(record.get('Comment')));

      $('#comment-list').prepend($comment);
    });

    fetchNextPage();
  }, function done(error) {
    console.log(error);
  });
};

$('#comment-form').submit(function (event) {
  event.preventDefault();

  var name = $('#name-input').val();
  var comment = $('#comment-input').val();
  var friendlyDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  $('#submit-button').attr('disabled', true);
  $('#submit-button').text('Submitting...');

  // Check if a record with the same Name and Comment fields already exists
  const escapedComment = comment.replace(/'/g, "\\'");
  base('Projects').select({
    filterByFormula: `AND(Name = '${name}', Comment = '${escapedComment}')`
  }).firstPage(function (err, records) {
    if (err) { console.log(err); return; }

    if (records.length > 0) {
      // A record with the same Name and Comment fields already exists
      $('#submit-button').removeAttr('disabled');
      $('#submit-button').text('Submit');
      return;
    }

    // No record with the same Name and Comment fields exists, so create a new one
    base('Projects').create({
      "Name": name,
      "Comment": comment,
      "Date": friendlyDate
    }, function (err, record) {
      if (err) { console.log(err); return; }
      loadProjects();
      $('#project-form').trigger('reset');
      $('#submit-button').removeAttr('disabled');
      $('#submit-button').text('Submit');
      // Load the comments again to display the newly added comment
      loadComments();
    });
  });
});


loadProjects();
loadComments();
