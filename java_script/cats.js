const catsBaseUrl = "https://cataas.com/";
const defaultCatImage = "images/defaultImage.png";

let view = 'list';
let cats = [];
let selectedCatTag = "";


// Returns the first 20 Cats if limit is 20
function getCats(params = {}, limit = "", tags = "") {
    const data = {...params}
    const catsRoute = "api/cats";

    $.ajax({

        method: "GET",
        url: `${catsBaseUrl}${catsRoute}${limit}${tags}`,
        data

    }).done(response => {

        cats = response;
        renderCatsListBySelectedTag();

    }).fail(response => {

        console.log(response);

    }).always(() => {

        console.log('ajax cats completed successfuly');

    });
}

// Renders all the returned Cats if no tag is selected
function renderCatsList() {
    $catView = $('#cats-view');
    $catView.empty();

    cats.forEach(cat => {
        const $catViewTemplate = getCatViewTemplate(cat);
        $catView.append($catViewTemplate);
    });
}

// Renders returned Cats by selected tag
function renderCatsListBySelectedTag() {
    $catView = $('#cats-view');
    $catView.empty();
    
    selectedCatTag = $('#cat-tag-select').val();

    if (selectedCatTag == 'no-tag-selected') {
        renderCatsList();
    } else {
        cats.forEach(cat => {
            cat.tags.forEach(tag => {
                if (tag === selectedCatTag) {
                    const $catViewByTagTemplate = getCatViewTemplate(cat);
                    $catView.append($catViewByTagTemplate);
                }
            });
        });
    }
}

function getCatViewTemplate(cat) {
    const catViewTemplateSelector = `#cats-${view}-view`;
    const $catViewTemplate = $($(catViewTemplateSelector).html());
    $catViewTemplate.find('#cat-text').text("Cat Tags: " + cat.tags);
    const catImage = `${catsBaseUrl}cat/${cat.id}` ? `${catsBaseUrl}cat/${cat.id}` : defaultCatImage;
    $catViewTemplate.find('#cat-image').attr('src', catImage);

    return $catViewTemplate;
}

// Sets the limit parameter and tags parameter of getCats() from the selected filters
function getCatsParams() {
    const maxNumberOfCatPictures = ($('#max-number-of-cat-pictures-select').val() == 'no-max-number-selected' ? "25" : $('#max-number-of-cat-pictures-select').val());
    const filterCatsBy = ($('#cat-tag-select').val() == 'no-tag-selected' ? "" : $('#cat-tag-select').val());
    const catParams = {params: [], limit: maxNumberOfCatPictures, tags: filterCatsBy};

    return catParams;
}

$('#show-cats').click(() => {
    getCats(this.getCatsParams());
})

$('#btn-list-view').click(b => {
    view = 'list';
    $(b.currentTarget).attr('disabled', true);
    $('#btn-grid-view').attr('disabled', false);
    renderCatsListBySelectedTag();
})

$('#btn-grid-view').click(b => {
    view = 'grid';
    $(b.currentTarget).attr('disabled', true);
    $('#btn-list-view').attr('disabled', false);
    renderCatsListBySelectedTag();
})

getCats(this.getCatsParams());
