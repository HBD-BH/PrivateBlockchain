const BlockChainClass = require('./blockchain.js');
const BlockClass = require('./block.js')

const bc = new BlockChainClass.Blockchain();

bc._addBlock(new BlockClass.Block("Test data"));

const myGenblock = bc.chain[1];

myGenblock.validate().then( result => console.log(result), error => console.log(error) );
