var config = {
    apiKey: "AIzaSyDuF4yWNI-B4wMB7FNaqn9Umh7brVKn30A",
    authDomain: "click-project-da772.firebaseapp.com",
    databaseURL: "https://click-project-da772.firebaseio.com",
    projectId: "click-project-da772",
    storageBucket: "click-project-da772.appspot.com",
    messagingSenderId: "599823879491"
};
firebase.initializeApp(config);
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)

// Create a variable to reference the database
var database = firebase.database();

// database.ref().set(function() {});

function addTableItem(table, item) {
    var td = $("<td>");
    td.text(item);
    table.append(td);
}

function get_time_delta(firstArrival, frequencyMinutes) {
    console.log("First arrival ", firstArrival);
    var firstArrivalConverted = moment(firstArrival, "HH:mm").subtract(1, 'years');
    console.log("first time converted " + firstArrivalConverted)
        // diffDuration = now.duration(a.diff(now));
    var diffTime = moment().diff(moment(firstArrivalConverted), "minutes");
    console.log("diff time " + diffTime);
    var modulo = diffTime % frequencyMinutes;
    console.log("remainder " + modulo)
    var tMinutesTillTrain = frequencyMinutes - modulo;
    console.log("next train in min " + tMinutesTillTrain)
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainArrivalTime = moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + nextTrainArrivalTime);
    return [tMinutesTillTrain, nextTrainArrivalTime];
}

function addTableEntry(table) {
    var time_delta = get_time_delta(table.firstArrival, table.frequencyMinutes);
    console.log("p1 ", time_delta[0], " p2 ", time_delta[1])
    var tr = $("<tr>");
    addTableItem(tr, table.trainName);
    addTableItem(tr, table.destination);
    addTableItem(tr, table.frequencyMinutes);
    addTableItem(tr, time_delta[1]);
    addTableItem(tr, time_delta[0]);
    $("#tableBody").append(tr);
}

function validText(name, htmlRef) {
    var validText = false;
    if (name) {
        htmlRef.removeClass("errorShow").addClass("errorHide");
        validText = true;
    } else {
        htmlRef.removeClass("errorHide").addClass("errorShow");
    }
    return validText;
}

function validIntegerPositive(name, htmlRef) {
    var validIntegerPositive = false;
    console.log("Check Integer " + name);
    var intVal = parseInt(name);
    if (Number.isInteger(intVal) && intVal > 0) {
        htmlRef.removeClass("errorShow").addClass("errorHide");
        validIntegerPositive = true;
    } else {
        errorFound = true;
        htmlRef.removeClass("errorHide").addClass("errorShow");
    }
    return validIntegerPositive;
}

function validMilitaryTime(name, htmlRef) {
    var validMilitaryTime = true;
    console.log("Check military " + name);
    var array = name.split(':');
    console.log("Array ", array.length, " ", array, " ", array[0]);
    if (array.length != 2) {
        validMilitaryTime = false;
        console.log("array length fails");
    }
    var intVal = parseInt(array[0]);
    if (Number.isInteger(intVal) && intVal >= 0 && intVal < 24) {

    } else {
        validMilitaryTime = false;
        console.log("hours fail");
    }
    intVal = parseInt(array[1]);
    if (Number.isInteger(intVal) && intVal >= 0 && intVal < 60) {

    } else {
        validMilitaryTime = false;
        console.log("min fail");
    }

    if (!validMilitaryTime) {
        console.log("HIDE MILITARY");
        htmlRef.removeClass("errorShow").addClass("errorHide");
    } else {
        console.log("SHOW MILITARY");
        htmlRef.removeClass("errorHide").addClass("errorShow");
    }

    return validMilitaryTime;
}

$("#submitButton").click(function() {
    event.preventDefault();
    var errorInForm = false;
    var trainName = $("#trainName").val();
    if (!validText(trainName, $("#trainNameError"))) errorInForm = true;
    var destination = $("#destination").val();
    if (!validText(destination, $("#destinationError"))) errorInForm = true;
    var frequencyMinutes = $("#frequencyMinutes").val();
    if (!validText(frequencyMinutes, $("#frequencyMinutesError"))) errorInForm = true;
    if (!errorInForm) {
        if (!validIntegerPositive(frequencyMinutes, $("#frequencyMinutesIntegerError"))) errorInForm = true;
    }
    var firstArrival = $("#firstArrival").val();
    if (!validText(firstArrival, $("#firstArrivalError"))) errorInForm = true;
    if (!errorInForm) {
        if (!validMilitaryTime(firstArrival, $("#firstArrivalMilitaryTimeError"))) {
            console.log("military time error");
            errorInForm = true;
        }
    }
    var dateAdded = firebase.database.ServerValue.TIMESTAMP;
    if (!errorInForm) {
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstArrival: firstArrival,
            frequencyMinutes: frequencyMinutes,
            dateAdded: dateAdded
        });
    }
});

//limitedtolast(1).on("child_added")
//  database.ref().orderBychild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
//   database.ref().on("child_added", function(snapshot) {
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
    var table = snapshot.val();
    console.log(table.trainName);
    console.log(table.destination);
    console.log(table.firstArrival);
    console.log(table.frequencyMinutes);
    addTableEntry(table);
});