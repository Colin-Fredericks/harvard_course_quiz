// Bring in Materialize
// import 'css/materialize.min.css';
// import 'css/materialize.min.js';
/**
 * @description Reads in data from the data file with custom format.
 * @param {string} filename The name of the file to read.
 * @returns {Object} The data object.
 */
function readData(filename) {
    // Read in the file
    fetch('data/' + filename)
        .then(function (response) { return response.text(); })
        .then(function (data) {
        console.log(data);
        // Parse the data into an object
        return data;
    })["catch"](function (error) {
        console.log(error);
        return 'no data';
    });
    return 'no data';
}
/**
 * @description Slides an element to the left while fading it out.
 * @param {HTMLElement} element The element to slide.
 * @param {string} direction The direction to slide.
 * @param {string} in_out Whether to fade in or out.
 * @returns {void}
 */
function slideTransition(element, direction, in_out) {
    element.classList.add('slide-' + direction);
    element.classList.add('fade-' + in_out);
    // When the animation is done, remove the element
    element.addEventListener('animationend', function () {
        element.remove();
    });
}
/**
 * @description: Constructs the HTML for the data.
 * @param {Object} data The data object at the current level of hierarchy.
 * @returns {HTMLElement} The HTML element containing the title, question, and cards.
 */
function constructHTML(data) {
    // Get the header
    // Get the question
    // Get the options
    // Put them all together
    return document.createElement('div');
}
/**
 * @description: Makes HTML breadcrumbs for our current location.
 * @param {Array} breadcrumbs The array of breadcrumbs (strings).
 * @returns {HTMLElement} The HTML element containing the breadcrumbs.
 */
function makeBreadcrumbs(breadcrumbs) {
    // Create the breadcrumb container
    // Create the breadcrumb elements
    // Put them together
    return document.createElement('div');
}
/**
 * @description: Set up the link listeners.
 * @returns {void}
 */
function setupLinkListeners() {
    // When someone clicks a link...
    document.querySelectorAll('main a').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            slideTransition(document.querySelector('main'), 'left', 'out');
        });
    });
    // Get the html for where we're going
    // Slide the current page to the left and remove it
    // Reset the listeners
}
/**
 * @description: Set up the breadcrumb listeners.
 * @returns {void}
 */
function setupBreadcrumbListeners() {
    // When someone clicks a breadcrumb...
    // Get the html for where we're going
    // Slide the current page to the right and remove it
    // Reset the listeners
}
var depth = 0;
var data = readData('Course_Quiz.txt');
var header_box = document.getElementById('header');
var question_box = document.getElementById('questions');
var option_box = document.getElementById('options');
// Need to figure out how to tell it where we are.
setupLinkListeners();
// No need to set breadcrumb listeners on the first page
