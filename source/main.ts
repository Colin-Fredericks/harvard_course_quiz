import { marked } from 'marked'
import { DOMPurifyI } from 'dompurify';
import * as DOMPurify from 'dompurify';

let data_file_name = 'data/Test_Quiz.txt';
let used_colors = [];


getGoing();

// TODO: the rest of the code is firing before the data is loaded.
// Need to wait for the data to load before doing anything else.

async function getGoing() {
  let path = [];

  fetch(data_file_name)
    .then((response) => response.text())
    .catch((error) => {
      console.debug(error);
      return 'no data';
    })
    .then((data) => processData(data))
    .then((data_structure) => {
      // console.debug(data_structure);

      let main = document.querySelector('main');
      let nav = document.querySelector('nav');

      let pane = constructHTML(data_structure, path);
      let breadcrumbs = makeBreadcrumbs(data_structure, path);

      main.insertBefore(pane, main.firstChild);
      nav.insertBefore(breadcrumbs, nav.firstChild);
      // Make the options visible.
      document.querySelector('.ghost').classList.remove('ghost');

      setupLinkListeners(pane, data_structure, path);
      // No need to set breadcrumb listeners on the first page
    });
}

/**
 * @description Processes the data from a file into a nested structure.
 * @param data The data to process, in text form.
 * @returns A nested structure of objects containing the data.
 */
async function processData(data: string): Promise<any> {
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

// TODO: Make this handle multiple blank items at the same level
// (Authors should be able to do that as a placeholder.)

/**
 * @description: Builds the nested structure of the data.
 * @param {Array} grid Array of lines of data, with depth and text.
 * @returns {Object} The nested structure of the data.
 */
function buildStructure(grid: any[]): any {
  let data_structure: any = { data: {}, contents: {} };
  let path: Array<string> = [];
  let last_depth = 0;

  for (let i = 0; i < grid.length; i++) {
    // Get the key and value.
    // The first colon is the separator between key and value.
    // Later colons are just part of the text.
    let pieces = grid[i].text
      .split(':')
      .map((item: string) => item.trim());

    let [key, value] = pieces;

    if (pieces.length > 2) {
      value = pieces.slice(1).join(':');
    }

    if (i === 0) {
      data_structure.data.name = key;
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
      insertData(data_structure, path, key.toLowerCase(), value);
      path.pop();
    } else {
      // If there's no key-value pair, it's a new item
      // Add the item to the contents
      path.push('contents');
      insertData(data_structure, path, key, {
        data: { path: key },
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
 * @description: Constructs the HTML for the data.
 * Note that this is transparent and hidden by default.
 * You will need to un-hide it when you're ready to display it.
 * @param {Object} data A slice of the total data object.
 * @returns {HTMLElement} The HTML element containing the title, question, and cards.
 */
function constructHTML(data: any, path: string[]): HTMLElement {
  // console.debug('constructHTML');
  // console.debug(data);

  // Make the container tag.
  let continer_div = document.createElement('div');
  continer_div.classList.add('container', 'ghost', 'bigbox');

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
  let question_text = document.createElement('div');
  question_text.classList.add('question-text');
  console.debug(data.data.text);
  question_text.innerHTML = DOMPurify.sanitize(
    marked.parse(data.data.text)
  );
  // Make any links open in a new tab
  let links = question_text.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
  }
  question.appendChild(question_text);

  let options = document.createElement('div');
  options.classList.add('row', 's12', 'center-align');
  options.id = 'options';
  question.classList.add('row', 's12', 'center-align');

  for (let key in data.contents) {
    let card = createCard(
      data.contents[key],
      Object.keys(data.contents).length
    );
    options.appendChild(card);
  }

  let divider2 = document.createElement('div');
  divider2.classList.add('divider');

  // Put them all together
  continer_div.appendChild(divider1);
  continer_div.appendChild(header);
  continer_div.appendChild(question);
  continer_div.appendChild(options);
  continer_div.appendChild(divider2);

  return continer_div;
}

/**
 * @description: Creates an option card.
 * @param {Object} data A slice of the total data object.
 * @returns {HTMLElement} The HTML element containing a single card.
 */
function createCard(data: any, num_cards: number): HTMLElement {
  // console.debug('createCard');
  // console.debug(data);
  let width = String(Math.round(12 / num_cards));

  let card = document.createElement('div');
  card.classList.add('col', 'm' + width); // Need to adjust m2/3/4/6 for number of cards
  let link = document.createElement('a');
  link.href = '#!';
  link.classList.add('card-link');
  link.dataset.path = data.data.path;
  let card_div = document.createElement('div');
  card_div.classList.add('card', getRandomColor(), 'darken-2', 'hoverable');
  let card_content = document.createElement('div');
  card_content.classList.add('card-content', 'white-text');
  let card_title = document.createElement('p');
  card_title.classList.add('flow-text');
  let card_text = document.createElement('p');
  card_text.classList.add('flow-text', 'card-text');

  card_title.innerText = data.data.title;
  if (typeof data.data.blurb === 'undefined') {
    card_text.innerText = '';
  } else {
    card_text.innerText = data.data.blurb;
  }

  card_content.appendChild(card_title);
  card_content.appendChild(card_text);
  card_div.appendChild(card_content);
  link.appendChild(card_div);
  card.appendChild(link);

  return card;
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
  element.classList.remove('slide-left', 'slide-right', 'fade-in', 'fade-out');
  element.classList.add('slide-' + direction, 'fade-' + in_out);

  // If we're sliding out, remove the element.
  if (in_out === 'out') {
    element.addEventListener('animationend', () => {
      element.remove();
    });
  }
}

/**
 * @description: Makes HTML breadcrumbs for our current location.
 * @param {Array} breadcrumbs The array of breadcrumbs (strings).
 * @returns {HTMLElement} The HTML element containing the breadcrumbs.
 */
function makeBreadcrumbs(data: any, path: string[]): HTMLElement {
  // console.debug('makeBreadcrumbs');
  // Create the breadcrumb container
  let breadcrumbs = document.createElement('div');
  breadcrumbs.classList.add('nav-wrapper');

  let home = document.createElement('a');
  home.classList.add('breadcrumb');
  home.innerText = 'Home';
  breadcrumbs.appendChild(home);

  // Create the breadcrumb elements
  for (let i = 0; i < path.length; i++) {
    let crumb = document.createElement('a');
    crumb.classList.add('breadcrumb');
    crumb.innerText = ' > ' + getData(data, path);
    breadcrumbs.appendChild(crumb);
  }

  // Put them together
  return breadcrumbs;
}

/**
 * @description: Set up the link listeners.
 * @param {HTMLElement} box The place we're attaching the listeners.
 * @param {Object} data The whole data object.
 * @param {Array} path The path to the current location.
 * @returns {void}
 */
function setupLinkListeners(pane: HTMLElement, data: any, path: string[]): void {
  // When someone clicks a link...
  document.querySelectorAll('a.card-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      // console.debug('Link clicked: ' + link.getAttribute('data-path'));
      // Add the new path to the path array
      // TODO: Need to include the "contents" containers here too.
      path.push('contents');
      path.push(link.getAttribute('data-path'));
      // Get the html for where we're going
      let new_pane = constructHTML(getData(data, path), path);
      new_pane.classList.remove('ghost');
      // Add it to the main.
      document.querySelector('main').appendChild(new_pane);
      // Slide the current page to the left and remove it
      slideTransition(pane, 'left', 'out');
      // Slide the new page in from the right
      slideTransition(new_pane, 'right', 'in');
      // Set the focus to the new pane's header.
      new_pane.querySelector('h3').focus();
      // Reset the listeners
      setupLinkListeners(new_pane, data, path);
      // Adjust the breadcrumbs
      document.querySelector('nav').innerHTML = '';
      document.querySelector('nav').appendChild(makeBreadcrumbs(data, path));
    });
  });
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
function insertData(
  data_structure: any,
  path: Array<string>,
  key: string,
  value: any
): void {
  // console.debug('inserting ' + key + ': ' + value + ' into ' + path);
  let current = data_structure;
  for (let i = 0; i < path.length; i++) {
    current = current[path[i]];
  }
  current[key] = value;
}

/**
 * @description: Gets the data at a given path.
 * @param {Object} data The nested data structure to search.
 * @param {Array} path The path to the item to get.
 * @returns {any} The data at the given path.
 */
function getData(data: any, path: Array<string>): any {
  let current = data;
  for (let i = 0; i < path.length; i++) {
    current = current[path[i]];
  }
  return current;
}

/**
 * @description: Gets a random color from the Materialize color palette.
 * Also makes sure that the color isn't already in use.
 * @returns {string} A random color.
 */
function getRandomColor(): string {
  // The brighter colors are currently commented out,
  // because the text is white. If you reverse one, reverse the other.

  let colors = [
    'red',
    // 'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    // 'light-blue',
    // 'cyan',
    'teal',
    'green',
    'light-green',
    // 'lime',
    // 'yellow',
    // 'amber',
    // 'orange',
    // 'deep-orange',
    'brown',
    // 'grey',
    'blue-grey',
  ];
  let color = colors[Math.floor(Math.random() * colors.length)];
  if (used_colors.includes(color)) {
    return getRandomColor();
  }
  used_colors.push(color);
  return color;
}