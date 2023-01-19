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
getGoing();
// TODO: the rest of the code is firing before the data is loaded.
// Need to wait for the data to load before doing anything else.
function getGoing() {
    return __awaiter(this, void 0, void 0, function* () {
        let path = [];
        let data = yield readData('Course_Quiz.txt');
        let body = document.querySelector('body');
        // This is just to test that the script is loading. Take out later.
        body.insertBefore(document.createElement('hr'), body.firstChild);
        body.insertBefore(constructHTML(data), body.firstChild);
        body.insertBefore(makeBreadcrumbs(data, path), body.firstChild);
        setupLinkListeners();
        // No need to set breadcrumb listeners on the first page
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
                // console.log(data);
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
        // Remove empty lines
        grid = grid.filter((line) => line.text.length > 0);
        // console.debug(grid);
        // Build the nested structure.
        return buildStructure(grid);
    });
}
/****************************
 * Here's what the structure should look like:
 * data_structure = {
 *  "name": "ITEM_NAME",
 *  "data": {
 *   "title": "TITLE",
 *   "question": "QUESTION",
 *   "image": "IMAGE.png",
 *   etc.
 *  },
 *  "contents": {
 *   "SUBITEM_NAME":{
 *    "name": "SUBITEM_NAME",
 *    "data": { the_data },
 *    "contents": [ more nested stuff ]
 *   },
 *   "SUBITEM_NAME": { another item },
 *   "SUBITEM_NAME": { another item }, etc
 *  }
 * }
 */
// TODO: Make this handle multiple items at the same level
// (Authors should be able to do that as a placeholder.)
/**
 * @description: Builds the nested structure of the data.
 * @param {Array} grid Array of lines of data, with depth and text.
 * @returns {Object} The nested structure of the data.
 */
function buildStructure(grid) {
    let data_structure = { name: '', data: {}, contents: {} };
    let path = [];
    let last_depth = 0;
    for (let i = 0; i < grid.length; i++) {
        // Get the key and value
        let [key, value] = grid[i].text
            .split(':')
            .map((item) => item.trim());
        key = key.toLowerCase();
        // console.debug('line = ' + key + ': ' + value);
        if (i === 0) {
            data_structure.name = key;
            continue;
        }
        if (last_depth > grid[i].depth) {
            // If we're going back up the tree, remove the last item
            // and "contents" from the path for each step back
            for (let j = 0; j < last_depth - grid[i].depth; j++) {
                path.pop();
                path.pop();
            }
        }
        // If there's a key-value pair, add it to the data
        if (typeof value !== 'undefined') {
            path.push('data');
            insertData(data_structure, path, key, value);
            path.pop();
        }
        else {
            // If there's no key-value pair, it's a new item
            // Add the item to the contents
            path.push('contents');
            insertData(data_structure, path, key, {
                name: key,
                data: {},
                contents: {},
            });
            // Add the item to the path
            path.push(key);
        }
        // console.debug(data_structure);
        last_depth = grid[i].depth;
    }
    return data_structure;
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
    // TODO: handle focus
}
/**
 * @description: Constructs the HTML for the data.
 * @param {Object} data A slice of the total data object.
 * @returns {HTMLElement} The HTML element containing the title, question, and cards.
 */
function constructHTML(data) {
    console.debug('constructHTML');
    console.debug(data);
    // Make the <main> tag.
    let main = document.createElement('main');
    let divider1 = document.createElement('div');
    divider1.classList.add('divider');
    let header = document.createElement('div');
    header.id = 'header';
    header.classList.add('row', 's12');
    let header_text = document.createElement('h3');
    header_text.innerText = data.data.title;
    header.appendChild(header_text);
    let question = document.createElement('div');
    question.id = 'question';
    question.classList.add('row', 's12', 'center-align');
    let question_text = document.createElement('h3');
    question_text.innerText = data.text;
    question.appendChild(question_text);
    let options = document.createElement('div');
    options.id = 'options';
    question.classList.add('row', 's12', 'center-align');
    for (let key in data.contents) {
        let card = createCard(data.contents[key], Object.keys(data.contents).length);
        options.appendChild(card);
    }
    let divider2 = document.createElement('div');
    divider2.classList.add('divider');
    // Put them all together
    main.appendChild(divider1);
    main.appendChild(header);
    main.appendChild(question);
    main.appendChild(options);
    main.appendChild(divider2);
    return main;
}
/**
 * @description: Creates an option card.
 * @param {Object} data A slice of the total data object.
 * @returns {HTMLElement} The HTML element containing a single card.
 */
function createCard(data, num_cards) {
    console.debug('createCard');
    let width = String(Math.round(12 / num_cards));
    let card = document.createElement('div');
    card.classList.add('col', 'm' + width); // Need to adjust m2/3/4/6 for number of cards
    let link = document.createElement('a');
    link.href = '#!';
    let card_div = document.createElement('div');
    card_div.classList.add('card', 'blue-grey', 'darken-1', 'hoverable');
    let card_content = document.createElement('div');
    card_content.classList.add('card-content', 'white-text');
    let card_title = document.createElement('p');
    card_title.classList.add('flow-text');
    let card_text = document.createElement('p');
    card_text.classList.add('flow-text', 'card-text');
    card_title.innerText = data.title;
    card_text.innerText = data.text;
    card_content.appendChild(card_title);
    card_content.appendChild(card_text);
    card_div.appendChild(card_content);
    link.appendChild(card_div);
    card.appendChild(link);
    return card;
}
/**
 * @description: Makes HTML breadcrumbs for our current location.
 * @param {Array} breadcrumbs The array of breadcrumbs (strings).
 * @returns {HTMLElement} The HTML element containing the breadcrumbs.
 */
function makeBreadcrumbs(data, path) {
    console.debug('makeBreadcrumbs');
    // Create the breadcrumb container
    // Create the breadcrumb elements
    // Put them together
    let breadcrumbs = document.createElement('nav');
    breadcrumbs.id = 'breadcrumbs';
    breadcrumbs.classList.add('row', 'red', 'darken-4');
    let nav_wrapper = document.createElement('div');
    nav_wrapper.classList.add('nav-wrapper');
    nav_wrapper.innerText = 'Breadcrumbs placeholder';
    return breadcrumbs;
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
/***********************
 * UTILITY FUNCTIONS
 ***********************/
/**
 * @description: Inserts data into a nested structure.
 * @param {Object} data_structure The nested structure to insert into.
 * @param {Array} path The path to the item to insert into.
 * @param {string} key The key to insert.
 * @param {any} value The value to insert. Can be an object.
 */
function insertData(data_structure, path, key, value) {
    // console.debug('inserting ' + key + ': ' + value + ' into ' + path);
    let current = data_structure;
    for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
    }
    current[key] = value;
}
//# sourceMappingURL=main.js.map