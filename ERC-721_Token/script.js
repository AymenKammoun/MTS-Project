const web3 = new Web3(window.ethereum);
let account = '';
let tokenAddress = "0xc4BC1C66A9aAA077E4147F95De2B23D3E0Cb6a54"
let totalSupplyInt = 0;

console.log("Js works!")
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('You have to install MetaMask');
}
const connectBtn = document.querySelector("#connect");
const showAccount = document.querySelector('.showAccount');
const createNFT = document.querySelector('#create');
const s = document.querySelector('#status');
const show = document.querySelector('#show');
const supply = document.querySelector('#supply');
const showNTFS = document.querySelector('#showNTFS');

showNTFS.addEventListener('click', () => {
    showAllNfts();
});


show.addEventListener('click', () => {
    showSupply();
});


connectBtn.addEventListener('click', () => {
    getAccount();
});

createNFT.addEventListener('click', () => {
    send();
})

function getAccount() {
    ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        account = accounts[0];
        showAccount.innerHTML = account;
    });
}


async function send() {

    let address = document.getElementById('address').value;
    let image = document.getElementById("image").value;
    let room = document.getElementById("room").value;
    let price = document.getElementById("price").value;

    let obj = {
        address: address,
        image: image,
        room: room,
        price: price,
        account: account,
    }
    var uri = JSON.stringify(obj);

    s.innerHTML = "";
    let minABI = [{
        "inputs": [{
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }];
    let contract = new web3.eth.Contract(minABI, tokenAddress, { from: account });
    s.innerHTML = "Creating";
    let data = await contract.methods.safeMint(account, uri).send();
    console.log(data);
    s.innerHTML = "Done!";

}

function showSupply() {
    let minABI = [{
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }];

    let contract = new web3.eth.Contract(minABI, tokenAddress, { from: account });
    contract.methods.totalSupply().call().then((response) => {
        totalSupplyInt = parseInt(response, 10);
        document.querySelector("#supply").innerHTML = response;
    });
}

async function showAllNfts() {
    let minABI = [{
        "inputs": [{
            "internalType": "uint256",
            "name": "token_Id",
            "type": "uint256"
        }],
        "name": "tokenURI",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    }];

    let contract = new web3.eth.Contract(minABI, tokenAddress, { from: account });
    document.querySelector('#nftRow').innerHTML = '';
    for (let i = 0; i < totalSupplyInt; i++) {
        let response = await contract.methods.tokenURI(i).call();
        let obj = JSON.parse(response);
        let card = '<div class="col-4 my-2"><div class="card"><img src="' + obj.image + '" class="card-img-top" alt="..." style="height:300px"><div class="card-body"><h5 class="card-title">House Owner:' + obj.account + '</h5><p class="card-text"><div>Adress: <span>' + obj.address + '</span></div><div>Rooms: <span>' + obj.room + '</span></div></p><div style="display:flex;justify-content:space-between" ><a href="https://google.com" target="_blank" class="btn btn-primary">Visit house in Metaverse</a><button class="btn btn-primary" >Pay</button></div></div></div></div>\n';
        document.querySelector('#nftRow').innerHTML += card;

    }

}