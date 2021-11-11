let isSubscribed = true;

function addFamilyMember() {
  var table = document.getElementById("famTable");
  var name = document.getElementById("inputName").value;
  var email = document.getElementById("inputEmail").value;

  row = table.insertRow(-1);
  var cell = row.insertCell(-1);
  var cell2 = row.insertCell(-1);
  cell.innerHTML = name;
  cell2.innerHTML = email;


}

function logout() {
  alert(
    "You have been logged out of the system. Please close out of all tabs."
  );
}

function toggleMembershipSubscription() {
  isSubscribed = !isSubscribed;
  document.getElementById("membershipSubscription").innerHTML = "Subscribed to membership services: " + isSubscribed;
}

