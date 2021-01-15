'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//Functions
const displayMovements = movements => {
  containerMovements.innerHTML = '';
  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${movement}</div>
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
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements.filter(movement=>movement<0).reduce((acc,movement)=>acc+movement,0);
  labelSumOut.textContent =  `${Math.abs(outcomes)}€`;

  const interest = account.movements.filter(movement=>movement>0).map(deposit=> deposit*account.interestRate/100).filter(int=>int>=1).reduce((acc,int)=>acc+int,0);
  labelSumInterest.textContent = `${interest}€`
}


const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((acc,movment)=>acc+movment,0)
  labelBalance.textContent = `${account.balance}€`;
}

const updateUI = (account) => {

  displayMovements(account.movements);

  calcDisplayBalance(account);

  calcDisplaySummary(account);
}

let currentAccount;

//eventHandler
btnLogin.addEventListener('click',(event)=>{
  event.preventDefault();
  
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);
  console.log(currentAccount);
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