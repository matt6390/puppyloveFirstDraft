function updateProfile() {
  // set age
  var age = document.getElementById("age").value;
  //set gender
  var gender = getGender();
  //set orientation
  var orientation = getOrientation();
  //set bio
  var bio = document.getElementById("bio").value;
  //set birthday
  var bday = document.getElementById("bday").value;
  //set profile
  var profileData = {
    name: firebase.auth().currentUser.displayName,
    age: age,
    gender: gender,
    orientation: orientation,
    bio: bio,
    birthday: bday
  };
  //create the user information, update if already existing
  checkProfileExists(profileData);
}

function isFileThere() {
  var file = document.getElementById("userProfilePic").files[0];
  if (file) {
    console.log(file.name);
    createStorageSlot(file);
    return true;
  } else {
    console.log("No file selected yet");
    return false;
  }
}

function createStorageSlot(file) {
  var uid = firebase.auth().currentUser.uid;
  // Create a root reference
  var storageRef = firebase.storage().ref();

  // Create a reference to the picture
  var fileRef = storageRef.child("profilePic");
  console.log(fileRef);

  // Create a reference to 'images/file'
  var fileImagesRef = storageRef.child(
    "users/" + uid + "/images/" + "profilePic"
  );
  console.log(fileImagesRef);

  var progress = 0;
  while (progress < 100) {
    document
      .getElementById("upload-progress")
      .setAttribute("style", "width: " + progress + "%");
    progress++;
  }

  //save the picture to storage
  fileImagesRef.put(file).then(function(snapshot) {
    //get downloadURL, and then create firebase/database slot to get the pic

    fileImagesRef.getDownloadURL().then(function(url) {
      document.getElementById("profile-pic").src = url;
    });
    console.log(snapshot);
  });
}

function createProfile(profileData) {
  var newProfileId = firebase
    .database()
    .ref()
    .child("profiles")
    .push(profileData).key;
  var userProfileData = {
    uid: firebase.auth().currentUser.uid,
    profileId: newProfileId
  };
  var newUserProfileId = firebase
    .database()
    .ref()
    .child("user-profiles")
    .push(userProfileData).key;
  console.log(newUserProfileId);
}

function checkProfileExists(profileData) {
  firebase
    .database()
    .ref("/user-profiles/")
    .orderByChild("uid")
    .equalTo(firebase.auth().currentUser.uid)
    .once("value")
    .then(function(snapshot) {
      if (snapshot.val() == null) {
        // console.log("Making new profile");
        createProfile(profileData);
        return false;
      } else {
        // console.log("Already had a profile");
        updateUserProfile(profileData);
        return true;
      }
    });
}

function updateUserProfile(profileData) {
  var uid = firebase.auth().currentUser.uid;
  var profileId = firebase
    .database()
    .ref("/user-profiles/")
    .orderByChild("uid")
    .equalTo(uid);
  profileId.on("value", function(snapshot) {
    snapshot.forEach(function(child) {
      profileId = child.val().profileId;

      var updates = {};
      updates["/profiles/" + profileId] = profileData;

      return firebase
        .database()
        .ref()
        .update(updates);
    });
  });

  // console.log(profileId);
}

function getGender() {
  var gender = "";
  var multiGender = document.getElementsByName("gender");
  multiGender[2].value = document.getElementById("other-gender-text").value;
  for (var i = 0; i <= 2; i++) {
    // console.log(multiGender[i].value);
    if (multiGender[i].checked) {
      gender = multiGender[i].value;
    }
  }
  return gender;
}

function changeOtherGenderRadioButton() {
  var button = document.getElementById("other-gender-radio");
  button.checked = true;
}

function changeOtherOrientationRadioButton() {
  var button = document.getElementById("other-orientation-radio");
  button.checked = true;
}

function getOrientation() {
  var orient = document.getElementById("other-orientation-text").value;
  var multiOri = document.getElementsByName("orientation");
  for (var j = 0; j <= 2; j++) {
    // console.log(multiOri[j].value);
    if (multiOri[j].checked) {
      orient = multiOri[j].value;
    }
  }
  return orient;
}

function setGender() {
  var gender = document.getElementById("other-gender-radio");
  var newGender = document.getElementById("other-gender-text");
  gender.value = newGender.value;
}
