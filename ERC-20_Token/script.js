const web3=new Web3(window.ethereum);
let account='';
let tokenAddress = "0xf2F855Eee4Def023EAcf3ceacA50E898bb072bC3";


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
const addKA=document.querySelector("#add");
const showBalance=document.querySelector("#showBalance");
const balanceText = document.querySelector('.balance');
const sendBtn=document.querySelector("#send");
const s=document.querySelector("#status");


connectBtn.addEventListener('click',()=>{
    getAccount();
});

addKA.addEventListener('click',()=>{
    addKAToken();
});

showBalance.addEventListener('click',()=>{
    getBalance();
});

sendBtn.addEventListener('click',()=>{
    send();
});



function addKAToken(){
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: 'CSC',
          decimals: 18,
          image: '',
        },
      },
    })
    .then((success) => {
      if (success) {
        console.log('KammounAymen asset successfully added to wallet!');
      } else {
        throw new Error('Something went wrong.');
      }
    })
    .catch(console.error);
}


function getAccount() {
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
        account = accounts[0];
        showAccount.innerHTML = account;
    });
}

async function getBalance(){
    const balanceOfABI = [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
    ];
    const contract = new web3.eth.Contract(balanceOfABI, tokenAddress)
    const wei = await contract.methods.balanceOf(account).call();
    let balance =web3.utils.fromWei(wei);
    balanceText.innerHTML = balance;
}

async function send(){
    s.innerHTML="";
    let toAddress = document.querySelector("#to").value;

    let minABI = [

    {
        "inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
    }
    ];

    let contract =new web3.eth.Contract(minABI,tokenAddress, { from: account});

    const amountStr=document.querySelector("#amount").value;
    let amount = web3.utils.toHex(Web3.utils.toWei(amountStr));

    s.innerHTML="Sending";
    let data = contract.methods.transfer(toAddress, amount).send().then((value)=>{
        if(value.status==true)
        {
            s.innerHTML="Done!";
        }else{
            s.innerHTML="Error!";
        }
    });
    
}
