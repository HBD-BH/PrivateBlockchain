# Private Blockchain Application

This repository is my solution to the first project of the Udacity "Blockchain Developer" Nanodegree. Below, you find some more information as well as some helpful screenshots.

## What problem does this private Blockchain application solve?

Your employer is trying to make a test of concept on how a Blockchain application can be implemented in his company.
He is an astronomy fan and he spends most of his free time on searching stars in the sky, that's why he would like
to create a test application that will allow him to register stars, and also some other of his friends can register stars, but making sure the application knows who owned each star.

### What is the process describe by the employer to be implemented in the application?

1. The application will create a Genesis Block when we run the application.
2. The user will request the application to send a message to be signed using a Wallet and in this way verify the ownership over the wallet address. The message format will be: `<WALLET_ADRESS>:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
3. Once the user has the message the user can use a Wallet to sign it.
4. The user will try to submit the Star object for that it will submit: `wallet address`, `message`, `signature` and the `star` object with the star information.
    The Start information will be formed in this format:
    ```json
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Some story"
		}
    ```
5. The application will verify if the time elapsed from the request of ownership (the time is contained in the message) and the time when you submit the star is less than 5 minutes.
6. If everything is okay the star information will be stored in the block and added to the `chain`
7. The application will allow us to retrieve the Star objects belonging to an owner (by their wallet address). 


## Dependencies

- Some of the libraries this project uses are:
    - "bitcoinjs-lib": "^4.0.3",
    - "bitcoinjs-message": "^2.0.0",
    - "body-parser": "^1.18.3",
    - "crypto-js": "^3.1.9-1",
    - "express": "^4.16.4",
    - "hex2ascii": "0.0.3",
    - "morgan": "^1.9.1"

Libraries' purpose:

1. `bitcoinjs-lib` and `bitcoinjs-message`. Those libraries help to verify the wallet address ownership, we are going to use it to verify the signature.
2. `express` The REST API created for the purpose of this project is created using Express.js framework.
3. `body-parser` this library will be used as middleware module for Express and helps to read the JSON data submitted in a POST request.
4. `crypto-js` This module contains some of the most important cryptographic methods and helps to create the block hash.
5. `hex2ascii` This library helps to **decode** the data saved in the body of a Block.

## Understanding the boilerplate code

The boilerplate code is a simple architecture for a Blockchain application, it includes a REST API application to expose the Blockchain application methods to your client application or users.

1. `app.js` contains the configuration and initialization of the REST API.
2. `BlockchainController.js` contains the routes of the REST API. 
3. `src` folder contains `block.js` and `blockchain.js` that contain the `Block` and `BlockChain` classes.

### Using this code

First, install all the libraries and module dependencies: `npm install`

Run the project: `node app.js`

You can check in your terminal that the Express application is listening on the PORT 8000. Feel free to use POSTMAN to interact with the application.


## How to test your application functionalities?

1. Run your application using the command `node app.js`
You should see in your terminal a message indicating that the server is listening on port 8000:
> Server Listening for port: 8000

2. Using POSTMAN to request the Genesis block:
    ![Request: http://localhost:8000/block/height/0 ](pic/getGenesisBlock.png)
3. Make your first request of ownership sending your wallet address:
    ![Request: http://localhost:8000/requestValidation ](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca36182_request-ownership/request-ownership.png)
4. Sign the message with your Wallet:
    ![Use the Wallet to sign a message](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca36182_request-ownership/request-ownership.png)
5. Submit your Star
     ![Request: http://localhost:8000/submitstar](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca365d3_signing-message/signing-message.png)
6. Retrieve Stars owned by me
    ![Request: http://localhost:8000/blocks/<WALLET_ADDRESS>](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca362b9_retrieve-stars/retrieve-stars.png)
