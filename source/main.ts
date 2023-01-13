// Bring in Materialize
// import 'css/materialize.min.css';
// import 'css/materialize.min.js';

/**
 * @description Reads in data from the data file with custom format.
 * @param {string} filename The name of the file to read.
 * @returns {Object} The data object.
 */
function readData(filename: string): string {
  // Read in the file
  fetch('data/Course_Quiz.txt')
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Parse the data into an object
      return data;
    })
    .catch((error) => {
      console.log(error);
      return '';
    });
  return '';
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
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      slideTransition(
        document.querySelector('main'),
        'left', 'out');
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
// let data = readData('Course_Quiz.txt');
let header_box = document.getElementById('header');
let question_box = document.getElementById('questions');
let option_box = document.getElementById('options');

// Need to figure out how to tell it where we are.

setupLinkListeners();
// No need to set breadcrumb listeners on the first page
