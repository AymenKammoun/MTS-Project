const web3 = new Web3(window.ethereum);
let account = '';
let NTFtokenAddress = "0x9cC87f956859484F6B36be42A113fa5574448563"
let CurrencytokenAddress = "0xf2F855Eee4Def023EAcf3ceacA50E898bb072bC3";
let totalSupplyInt = 0;

console.log("Js works!")
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('You have to install MetaMask');
}

const createNFT = document.querySelector('#create');
const s = document.querySelector('#status');
const connectBtn = document.querySelector("#connect");
const showAccount = document.querySelector('.showAccount');

createNFT.addEventListener('click', () => {
    send();
})

connectBtn.addEventListener('click', () => {
    getAccount();
});



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
    let mona = document.getElementById("mona").value;


    let obj = {
        address: address,
        image: image,
        room: room,
        price: price,
        account: account,
        mona: mona,
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
    let contract = new web3.eth.Contract(minABI, NTFtokenAddress, { from: account });
    s.innerHTML = "Creating";
    let data = await contract.methods.safeMint(account, uri).send();
    console.log(data);
    s.innerHTML = "Done!";

}
