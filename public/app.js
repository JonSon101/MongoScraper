$.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].summary + "<br />Get more information <a href='" + data[i].link + "'>here<a>.</p>");
    }
});

$(".scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(data) {
        location.reload();
    });
});