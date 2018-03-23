$.getJSON("/articles", function (data) {

    for (var i = 0; i < data.length; i++) {

        $("#articles").append("<div id='article-holder'>" + "<p class='headline' data-id='" + data[i]._id + "'>" + data[i].headline + "</p>" +
            "<p class='summary' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>" +
            "<a class='url' data-id='" + data[i]._id + "'" + "href='" + data[i].url + "'>" + data[i].url + "</a>" + "<br>" +
            "<button data-id='" + data[i]._id + "' class='save-article'>Save Article</button>" + "</div>");
    }
});



$(document).on('click', '.save-article', function () {
    let savedArticle = $(this).attr("data-id");

    $.ajax({
            method: "POST",
            url: "/articles/save/" + savedArticle
        })

        .then(function (data) {
            if (data.saved === true) {
                //not working
                $("#articles").remove(this.data)
            }
        });
})

$(document).on('click', '#view-saved', function () {
    location.href = "saved.html";
})