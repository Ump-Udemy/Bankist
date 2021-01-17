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
    '2021-01-12T10:51:36.790Z',
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
const formatMovementDate = (date,locale) => {
  const calcDaysPassed = (date1,date2) => Math.round(Math.abs(date2-date1)/( 1000 * 60 * 60 * 24));
  const dayPassed =  calcDaysPassed(new Date(),date);
  if(dayPassed === 0) return 'Today';
  if(dayPassed === 1) return 'Yesterday';
  if(dayPassed <= 7) return `${dayPassed} days ago`;
  else{
    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

const formatMovement = (movement,currency,locale) => {
  const options = {
    style: 'currency',
    currency: currency,
  }
  return new Intl.NumberFormat(locale,options).format(movement)
}
const displayMovements = (account,sort = false) => {
  containerMovements.innerHTML = '';

  const movements = sort ? account.movements.slice().sort((a,b)=>a-b):account.movements ; 
  
  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date,account.locale) ;
    
    const fotmatMovement = formatMovement(movement,account.currency,account.locale);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${fotmatMovement}</div>
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
  const formattedIncomes = formatMovement(incomes,account.currency,account.locale);
  labelSumIn.textContent = `${formattedIncomes}`;

  const outcomes = account.movements.filter(movement=>movement<0).reduce((acc,movement)=>acc+movement,0);
  const formattedOutcomes = formatMovement(Math.abs(outcomes),account.currency,account.locale);
  labelSumOut.textContent =  `${formattedOutcomes}`;

  const interest = account.movements.filter(movement=>movement>0).map(deposit=> deposit*account.interestRate/100).filter(int=>int>=1).reduce((acc,int)=>acc+int,0);
  const formattedInterest = formatMovement(interest,account.currency,account.locale);
  labelSumInterest.textContent = `${formattedInterest}`
}


const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((acc,movment)=>acc+movment,0);
  const formatedBalance = formatMovement(account.balance,account.currency,account.locale);
  labelBalance.textContent = `${formatedBalance}`;
}

const updateUI = (account) => {

  displayMovements(account);

  calcDisplayBalance(account);

  calcDisplaySummary(account);
}



//eventHandler
btnLogin.addEventListener('click',(event)=>{
  event.preventDefault();
  
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute : 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }
    // const day = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth()+1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const minute = `${now.getMinutes()}`.padStart(2,0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
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

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

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

    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
})

btnSort.addEventListener('click',(event)=>{
  event.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;
})


//
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;