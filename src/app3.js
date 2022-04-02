const BlockChainClass = require('./blockchain.js');
const BlockClass = require('./block.js')

const bc = new BlockChainClass.Blockchain();

bc._addBlock(new BlockClass.Block("Test data"));

const myGenblock = bc.chain[1];

myGenblock.validate().then( result => console.log(result), error => console.log(error) );

let myAddress = "mgwUk3dFy8XfSfJaWJQ3Qhkrrem6KiYVtd";
let myMsg = "";
bc.requestMessageOwnershipVerification(myAddress).then(result => {
    myMsg = result;
    console.log(`Current msg: ${myMsg}`);
    console.log(result)

    mySig = "HxsigWQiTOrdKztXSzxXbOq7jHbeHJXTEPyOfa5/DBKBEEfPHV4YG4oR8D6b1YlRwnGq2/Z9+FnzBKddumFC2UE=";
    myStar = "Hyperion";
    bc.submitStar(myAddress, myMsg, mySig ,myStar).then(result => console.log(result)).catch(error => console.log(error));
    }
).catch(error => console.log(error));

