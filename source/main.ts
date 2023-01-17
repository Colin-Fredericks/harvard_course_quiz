// Bring in Materialize
// import 'css/materialize.min.css';
// import 'css/materialize.min.js';

/**
 * @description: Builds the nested structure of the data.
 * @param {Array} The array of lines of data, with depth and text.
 * @returns {Object} The nested structure of the data.
 */
function buildStructure(grid: any[], current_depth = 0): any {
  let data_structure: any = {};
  let current_line = grid.shift();

  while (current_line.depth >= current_depth) {
    let key = current_line.text.split(':');
    console.log(key);

    if (key.length === 1) {
      data_structure[key[0].trim()] = buildStructure(grid, current_depth + 1);
    } else {
      data_structure[key[0].trim()] = key[1].trim();
    }
    current_line = grid.shift();

    // Stop if we've reached the end of the file
    if (typeof current_line === 'undefined') {
      break;
    }
  }
  return data_structure;
}


/**
 * @description Processes the data from a file into a nested structure.
 * @param data The data to process, in text form.
 * @returns A nested structure of objects containing the data.
 */
async function processData(data: string): Promise<any> {
  let data_structure: any = {};
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

}

/**
 * @description Reads in data from the data file with custom format.
 * @param {string} filename The name of the file to read.
 * @returns {Object} The data object.
 */
async function readData(filename: string): Promise<string> {
  // Read in the file
  fetch('data/' + filename)
    .then((response) => response.text())
    .then(async function (data) {
      console.log(data);
      let data_structure = await processData(data);
      console.log(data_structure);
      // Parse the data into an object
      return data;
    })
    .catch((error) => {
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
function slideTransition(
  element: HTMLElement,
  direction: string,
  in_out: string
): void {
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
function constructHTML(data: any): HTMLElement {
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
function makeBreadcrumbs(breadcrumbs: string[]): HTMLElement {
  // Create the breadcrumb container
  // Create the breadcrumb elements
  // Put them together
  return document.createElement('div');
}

/**
 * @description: Set up the link listeners.
 * @returns {void}
 */
function setupLinkListeners(): void {
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
function setupBreadcrumbListeners(): void {
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
