/**
 * Importing the Block class
 */
//
const BlockClass = require('./block.js');

/**
 * Creating a block object
 */
const block = new BlockClass.Block("Test Block");
console.log(`${block.body}`)

// Generating the block hash
block.getBData().then((result) => {
	console.log(`Block Hash: ${result.hash}`);
	console.log(`Block: ${JSON.stringify(result)}`);
}).catch((error) => {console.log(`Something went wrong: ${error}`)});



/**
 * Step 3: Run the application in node.js
 *
 */

// From the terminal: cd into Project folder
// From the terminal: Run node app.js to run the code
