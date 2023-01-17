// Bring in Materialize
// import 'css/materialize.min.css';
// import 'css/materialize.min.js';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @description: Builds the nested structure of the data.
 * @param {Array} The array of lines of data, with depth and text.
 * @returns {Object} The nested structure of the data.
 */
function buildStructure(grid, depth = 0) {
    let data_structure = {};
    let current_depth = depth;
    let current_line = grid.shift();
    while (current_line.depth > current_depth) {
        let key = current_line.text.split(':')[0];
        console.log(key);
        data_structure[key] = buildStructure(grid, current_depth + 1);
        current_line = grid.shift();
    }
    grid.unshift(current_line);
    return data_structure;
}
/**
 * @description Processes the data from a file into a nested structure.
 * @param data The data to process, in text form.
 * @returns A nested structure of objects containing the data.
 */
function processData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let data_structure = {};
        let lines = data.split('\n');
        // Get the depth of each line
        let grid = lines.map(function (line) {
            return {
                depth: line.split('\t').length - 1,
                text: line.trim(),
            };
        });
        // Build the nested structure.
        return buildStructure(grid);
    });
}
/**
 * @description Reads in data from the data file with custom format.
 * @param {string} filename The name of the file to read.
 * @returns {Object} The data object.
 */
function readData(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read in the file
        fetch('data/' + filename)
            .then((response) => response.text())
            .then(function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                let data_structure = yield processData(data);
                console.log(data_structure);
                // Parse the data into an object
                return data;
            });
        })
            .catch((error) => {
            console.log(error);
            return 'no data';
        });
        return 'no data';
    });
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
    element.addEventListener('animationend', () => {
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
    document.querySelectorAll('main a').forEach((link) => {
        link.addEventListener('click', (event) => {
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
let depth = 0;
let data = readData('Course_Quiz.txt');
let header_box = document.getElementById('header');
let question_box = document.getElementById('questions');
let option_box = document.getElementById('options');
// Need to figure out how to tell it where we are.
setupLinkListeners();
// No need to set breadcrumb listeners on the first page
