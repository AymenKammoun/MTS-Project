const web3=new Web3(window.ethereum);
let account='';
let tokenAddress = "0xd3D84A7Ff1e225163Bf7673339a99c681902ED63"
let totalSupplyInt=0;

console.log("Js works!")
if (typeof window.ethereum !== 'undefined')
{
    console.log('MetaMask is installed!');
}
else
{
    console.log('You have to install MetaMask');
}
const connectBtn=document.querySelector("#connect");
const showAccount = document.querySelector('.showAccount');
const createNFT= document.querySelector('#create');
const s=document.querySelector('#status');
const show=document.querySelector('#show');
const supply=document.querySelector('#supply');
const showNTFS=document.querySelector('#showNTFS');

showNTFS.addEventListener('click',()=>{
    showAllNfts();
});


show.addEventListener('click',()=>{
    showSupply();
});


connectBtn.addEventListener('click',()=>{
    getAccount();
});

createNFT.addEventListener('click',()=>{
    send();
})

function getAccount() {
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
        account = accounts[0];
        showAccount.innerHTML = account;
    });
}


async function send(){
    s.innerHTML="";
    let uri = document.querySelector("#uri").value;

    let minABI = [
        {
            "inputs": [
                {
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
        }
    ];

    let contract =new web3.eth.Contract(minABI,tokenAddress, { from: account});


    s.innerHTML="Creating";
    let data = await contract.methods.safeMint(account, uri).send();
    console.log(data);
    s.innerHTML="Done!";
    
}

function showSupply()
{
    let minABI = [
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    let contract =new web3.eth.Contract(minABI,tokenAddress, { from: account});
    contract.methods.totalSupply().call().then((response)=>{
        totalSupplyInt=parseInt(response,10);
        document.querySelector("#supply").innerHTML=response;
    });
}

function showAllNfts()
{
    let minABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "token_Id",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    let contract =new web3.eth.Contract(minABI,tokenAddress, { from: account});
    document.querySelector('#nfts').innerHTML='';
    for(let i=0;i<totalSupplyInt;i++)
    {
        contract.methods.tokenURI(i).call().then((response)=>{
            document.querySelector('#nfts').innerHTML+=response+"<br>";
        });
    }
    
}