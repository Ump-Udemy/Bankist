'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;
let sorted = false;

//Functions
const displayMovements = (mov,sort = false) => {
  containerMovements.innerHTML = '';

  const movements = sort ? mov.slice().sort((a,b)=>a-b):mov ; 

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${movement.toFixed(2)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const createUsernames = accounts => {
  accounts.forEach((account)=>{
    account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);

const calcDisplaySummary = (account) => {
  const incomes = account.movements.filter(movement=> movement>0).reduce((acc,movement)=> acc+movement,0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = account.movements.filter(movement=>movement<0).reduce((acc,movement)=>acc+movement,0);
  labelSumOut.textContent =  `${Math.abs(outcomes.toFixed(2))}€`;

  const interest = account.movements.filter(movement=>movement>0).map(deposit=> deposit*account.interestRate/100).filter(int=>int>=1).reduce((acc,int)=>acc+int,0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
}


const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((acc,movment)=>acc+movment,0)
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
}

const updateUI = (account) => {

  displayMovements(account.movements);

  calcDisplayBalance(account);

  calcDisplaySummary(account);
}



//eventHandler
btnLogin.addEventListener('click',(event)=>{
  event.preventDefault();
  
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
  
   labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; 
   containerApp.style.opacity = 100;

   inputLoginUsername.value = inputLoginPin.value = '';
   inputLoginPin.blur();

   updateUI(currentAccount);

  }
});

btnTransfer.addEventListener('click',(event)=>{
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(account => account.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if(amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username ){
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
})

btnClose.addEventListener('click',(event)=>{
  event.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  if(currentAccount.username === username && currentAccount.pin === pin) {
    const index = accounts.findIndex(account=> account.username === currentAccount.username);  
    
    accounts.splice(index,1);

    containerApp.style.opacity = 0;
  };
});

btnLoan.addEventListener('click',(event)=>{
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if(amount > 0 && currentAccount.movements.some(movment=> movment >= amount*0.1)){
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
})

btnSort.addEventListener('click',(event)=>{
  event.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})

