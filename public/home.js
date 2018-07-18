var PROFILES = [];
// Display user info when logged in

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("user").innerText =
      "Welcome to Puppy Love " + user.displayName + ".";
    console.log(user);
    getUsers();
  } else {
    console.log("No one is signed in...");
  }
});

function nextPerson() {
  var profiles = document.getElementsByClassName("profile");

  console.log(PROFILES);
}

function getProfileInfo(index, key) {
  index = index - 1;
  console.log(PROFILES[index][key]);
  return PROFILES[index][key];
}

function createProfileCards() {
  var length = PROFILES.length;

  while (length > 0) {
    //create card
    var div = document.createElement("div");
    div.setAttribute("class", "card");

    //create card picture
    var img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("class", "profile-img");
    img.setAttribute("class", "img-fluid");
    img.setAttribute("height", "200");
    img.setAttribute("width", "200");
    img.setAttribute(
      "src",
      "http://www.irdconline.com/wp-content/uploads/2018/05/person-placeholder.jpg"
    );
    div.appendChild(img);

    //create h4 NAME and append it to the card div
    var h4 = document.createElement("h4");
    h4.setAttribute("class", "card-title");
    h4.innerText = getProfileInfo(length, "name");
    div.appendChild(h4);

    //create ul
    var ul = document.createElement("ul");
    ul.setAttribute("class", "card-text");
    ul.setAttribute("class", "list-group");

    //create age and bio li's
    var liAge = document.createElement("liAge");
    liAge.setAttribute("class", "list-group-item");
    liAge.innerText = getProfileInfo(length, "age");

    var liBio = document.createElement("liBio");
    liBio.setAttribute("class", "list-group-item");
    liBio.innerText = getProfileInfo(length, "bio");

    //append li's to the ul
    ul.appendChild(liAge);
    ul.appendChild(liBio);
    div.appendChild(ul);

    //add card to the list
    var pageUl = document.getElementById("profiles");
    pageUl.appendChild(div);

    length--;
    // console.log(div);
  }
}

function orderProfiles() {
  createProfileCards();
}

function accountExists() {
  var userInfo = firebase
    .database()
    .ref()
    .child("user-infos")
    .orderByChild("user_id")
    .equalTo(firebase.auth().currentUser.uid);
  userInfo.on("value", function(snapshot) {
    console.log(snapshot.val());
  });
}

function addUser() {
  //testing to see if I can add to a part of the database
  // console.log("Function is firing");

  // must define what is basically the params
  var userData = {
    user_id: "UiZRsi5XOzNjsHxwb7ONMGymQy33",
    name: "Matthew",
    email: "matthew@gmail.com"
  };

  // now we get a key/id for the new user
  var newUserKey = firebase
    .database()
    .ref()
    .child("user-infos")
    .push().key;

  console.log(newUserKey);

  // update the new, empty user that has just been created
  var updates = {};
  updates["user-infos/" + newUserKey] = userData;

  return firebase
    .database()
    .ref()
    .update(updates);
}

function getUsers() {
  // this is used to retrieve user info from the database
  var ul = document.getElementById("profiles");
  var profiles = firebase.database().ref("/profiles/");

  profiles.on("value", snap => {
    snap.forEach(function(child) {
      var user = child.val();
      PROFILES.push(user);
      // var li = document.createElement("li");
      // li.setAttribute("class", "profile");
      // ul.appendChild(li);
      // li.innerText = ;
      // console.log(child.val());
    });
    orderProfiles();
  });
}
