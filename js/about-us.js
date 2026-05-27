import { displayMessage } from './auxiliary.js';

setTimeout(() => {
    window.history.pushState(null, "", "/about-us");
}, 700);

// const sendMessage = document.getElementById('send-message');

// sendMessage.onclick = () => {
//     const name = document.getElementById('name');
//     const email = document.getElementById('email');
//     const subject = document.getElementById('subject');
//     const message = document.getElementById('message');

//     const nameValue = name.value.trim();
//     const emailValue = email.value.trim();
//     const subjectValue = subject.value.trim();
//     const messageValue = message.value.trim();

//     if (!nameValue || !emailValue || !subjectValue || !messageValue) {
//         displayMessage('Please fill in all fields');
//         return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(emailValue)) {
//         displayMessage('Invalid email address');
//         return;
//     }

//     if (messageValue.length < 10) {
//         displayMessage('Message is too short');
//         return;
//     }

//     const messageData = {
//         name: nameValue,
//         email: emailValue,
//         subject: subjectValue,
//         message: messageValue
//     };

//     const options = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(messageData)
//     };

//     console.log(messageData);

//     setTimeout(() => {
//         name.value = '';
//         email.value = '';
//         subject.value = '';
//         message.value = '';

//         displayMessage('Email sent');
//     }, 700);
    
    // mail() doesn't work on localhost
    // fetch('/send-message', options)
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data);
    //     });
// };