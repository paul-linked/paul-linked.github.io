import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf6WZ7pucO-j1MeFTgD57_UOE9bBR128g",
  authDomain: "website-bfbf4.firebaseapp.com",
  databaseURL: "https://website-bfbf4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "website-bfbf4",
  storageBucket: "website-bfbf4.appspot.com",
  messagingSenderId: "935456433264",
  appId: "1:935456433264:web:bb36e13ebe2479bcb700b5",
  measurementId: "G-FTJZ1P942Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the "posts" node in the Firebase Realtime Database
const postsRef = database.ref('posts');

// Listen for changes to the "posts" node in the Firebase Realtime Database
postsRef.on('value', function (snapshot) {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  snapshot.forEach(function (childSnapshot) {
    const post = childSnapshot.val();
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const nameHeader = document.createElement("h3");
    nameHeader.innerText = post.name;

    const messageParagraph = document.createElement("p");
    messageParagraph.innerText = post.message;

    postDiv.appendChild(nameHeader);
    postDiv.appendChild(messageParagraph);

    postsDiv.appendChild(postDiv);
  });
});

// Handle form submission to add a new post
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");

  const name = nameInput.value;
  const message = messageInput.value;

  // Write the post data to the Firebase Realtime Database
  postsRef.push({
    name: name,
    message: message
  });

  nameInput.value = "";
  messageInput.value = "";
});
