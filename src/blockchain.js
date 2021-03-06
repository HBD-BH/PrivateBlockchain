/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message`
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialize the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to
     * create the `block hash` and push the block into the chain array. Don't forget
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention
     * that this method is a private method.
     */
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                // Set block height and timestamp
                block.height = self.height+1;
                block.time = new Date().getTime().toString().slice(0,-3); // To make compatible with UTC time stamp

                // Add previousBlockHash if we're not dealing with the Genesis
                // block
                if (block.height>0){
                    block.previousBlockHash = self.chain[self.height].hash;
                }

                // Add hash to the block
                block.hash = SHA256(JSON.stringify(block)).toString();

                // Update chain: push block and adjust height
                self.chain.push(block);
                self.height += 1;

                // Resolve with the block if the chain is valid
                self.validateChain().then(result => {
                    resolve(block);
                }).catch(error => {
                    // Or reject otherwise
                    reject(error);
                })

            } catch(err) {
                reject(err)
            }

        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            // Get current tiime stamp
            let curTime = new Date().getTime().toString().slice(0,-3);
            // Assemble message
            let myMsg = address+":"+curTime+":starRegistry";
            // and resolve
            resolve(myMsg);
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Verify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address
     * @param {*} message
     * @param {*} signature
     * @param {*} star
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                // Check time elapsed: should be below 5 minutes
                const timeRequested = parseInt(message.split(':')[1])
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                let timeElapsed = currentTime - timeRequested;
                // TODO Would be nice to check whether another star was
                // registered with the same signature, already, and reject upon
                // reusage.
                //console.log(`Elapsed time: ${timeElapsed}`)
                if (timeElapsed < 300) { // 300 s = 5 minutes
                    // Verify message
                    if (bitcoinMessage.verify(message, address, signature)) {
                        // Create block
                        self._addBlock(new BlockClass.Block(
                            {
                                owner: address,
                                data: star
                            }));
                        // Resolve with the block just added
                        resolve(self.chain.slice(-1)[0]);
                    } else {
                        // Reject with an error message about the message
                        // validation
                        reject("Could not verify message with given wallet address and signature")
                    }
                } else {
                    // Reject with an error about the elapsed time
                    reject("More than 5 minutes elapsed, sorry.")
                }
            } catch(err) {
                // Reject with a generic error
                reject(err)
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.hash === hash)[0];
            if (block){
                resolve(block);
            } else{
                resolve(null);
            }

        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object
     * with the height equal to the parameter `height`
     * @param {*} height
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
     * and belonging to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address
     */
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            try {
                // Check owner for every block except the Genesis block
                for (let block of self.chain.slice(1)) {
                    block.getBData().then( result => {
                        if (result.owner===address){
                            stars.push(result.data);
                        } else {
                            //console.log("Different owner");
                        }
                    }).catch(error => {console.log(error)});
                }
                resolve(stars);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check whether the `previousBlockHash` is correct
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            try{
                let prevHash = null;
                for (let i = 0; i < self.chain.length; i++ ) {
                    self.getBlockByHeight(i).then(result => {
                        if (result.previousBlockHash === prevHash) {
                            result.validate().catch(error => {
                                // Don't do anything if block validation is true
                                // Add error to log if block validation is false
                                errorLog.push(error);
                            })
                        } else {
                            reject(`Chain broken at height ${i}.`)
                        }
                    }).catch(error => {
                        reject(error)
                    })
                }
                resolve(errorLog);
            } catch (err) {
                reject(err);
            }

        });
    }

}

module.exports.Blockchain = Blockchain;
