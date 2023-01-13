// Bring in Materialize
import 'css/materialize.min.css';
import 'css/materialize.min.js';

/**
 * @description Reads in data from the data file with custom format.
 * @param {string} filename The name of the file to read.
 * @returns {Object} The data object.
 */
function readData(filename: string): boolean{
    // Read in the data from the file
}

/**
 * @description Slides an element to the left while fading it out.
 * @param {HTMLElement} element The element to slide.
 * @param {string} direction The direction to slide.
 * @returns {void}
 */
function slideTransition(element: HTMLElement, direction: string): void{
}

/**
 * @description: Constructs the HTML for the data.
 * @param {Object} data The data object at the current level of hierarchy.
 * @returns {HTMLElement} The HTML element containing the title, question, and cards.
 */
function constructHTML(data: any): HTMLElement{
}

/** 
 * @description: Makes HTML breadcrumbs for our current location.
 * @param {Array} breadcrumbs The array of breadcrumbs (strings).
 * @returns {HTMLElement} The HTML element containing the breadcrumbs.
 */
function makeBreadcrumbs(breadcrumbs: string[]): HTMLElement{
}

/**
 * @description: Set up the link listeners.
 * @returns {void}
 */
 function setupLinkListeners(): void{
    // When someone clicks a link...
    // Get the html for where we're going
    // Slide the current page to the left and remove it
    // Reset the listeners
}

/**
 * @description: Set up the breadcrumb listeners.
 * @returns {void}
 */
function setupBreadcrumbListeners(): void{
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

let {header_box, question_box, option_box} = constructHTML(data);
setupLinkListeners();
// No need to set breadcrumb listeners on the first page
