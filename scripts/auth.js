const userForm = document.querySelector('#user-form');
const createAccountButton = document.querySelector('#btn-create-account');
const loginButton = document.querySelector('#btn-login');

console.log(createAccountButton);
console.log(loginButton);

//Listener for when user clicks create account btn
createAccountButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = userForm['user-email'].value;
    const password = userForm['user-pass'].value;

    console.log(email);
    console.log(password);

    // Clear form
    auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
         console.log(userCredential);
         userForm.reset();
      })
      .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
      });
});

//Listener for when user clicks login
loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = userForm['user-email'].value;
    const password = userForm['user-pass'].value;

    auth.signInWithEmailAndPassword(email, password).then(userCredential => {
        console.log(userCredential);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
});