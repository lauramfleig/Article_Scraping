$.getJSON("/articles/saved", function (data) {

    for (var i = 0; i < data.length; i++) {

        $("#saved").append("<div id='article-holder'>" + "<p class='headline' data-id='" + data[i]._id + "'>" + data[i].headline + "</p>" +
            "<p class='summary' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>" +
            "<a class='url' data-id='" + data[i]._id + "'" + "href='" + data[i].url + "'>" + data[i].url + "</a>" + "<br>" +
            "<button data-id='" + data[i]._id + "' class='delete-article'>Delete</button>" + "<br>" + "<button data-id='" + data[i]._id + "' class='write-note'>Add A Note</button>" + "</div>");
    }
});

function buildModal() {
    let modal = $('<div id="modal"></div>');
    let modalContent = $('<div class="modal-content">');
    let savedHeading = $('<p class="saved-heading">Your Notes</p>')
    let modalSaved = $('<div class="saved-notes">Your saved notes here</div>');
    let addHeading = $('<p class="add-heading">Add A Note</p>');
    let addTxtBox = $('<textarea class="text-area"></textarea><br>');
    let modalBtn = $('<button class="modalButton">Submit</button>');
    modal.prepend(modalContent);
    modalContent.append(savedHeading);
    modalContent.append(modalSaved);
    modalContent.append(addHeading);
    modalContent.append(addTxtBox);
    modalContent.append(modalBtn);
    $('#saved').prepend(modal);
}

$(document).on('click', '.go-home', function() {
    location.href = "index.html";
})

$(document).on('click', '.delete-article', function() {
    let toDelete = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + toDelete
    })

        .then(function (data) {
            
        });

})

$(document).on('click', '.write-note', function() {

    buildModal()


})