// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {

  const dayDisplayEl = $('#currentDay');
  const scheduleDisplayEl = $('#hour-list');

  function displayDate() {
    const today = dayjs().format('dddd, MMMM D');
    dayDisplayEl.text(today);
  }

  function readSchedulesFromStorage() {
    var schedules = localStorage.getItem('schedules');
    if (schedules) {
      schedules = JSON.parse(schedules);
    } else {
  /*initiate an array of 9 items */
      for (var i = 0; i < 9; i += 1) {
        let text = {
          text: '',
          index: i,
        };
        if (i == 0) {
          schedules = [text];
        } else {
          schedules.push(text);
        }
      }
    }
    return schedules;
  }
  
  // Display current day and existing project
  function saveScheduleToStorage(schedules) {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }
  
  // Gets project data from local storage and displays it
  function printSchedule() {
    // clear current schedule on the page
    scheduleDisplayEl.empty();
  
    // get schedule contents from localStorage
    const schedules = readSchedulesFromStorage();
  
    // loop through each schedule item from 9AM and create a row
    for (var i = 0; i < 9; i += 1) {
      const schedule = schedules[i];
      const hours = dayjs().hour(9+i);
      console.log(hours.hour());
      console.log(typeof(hours.hour()));
      const hour = dayjs().hour();
      console.log(hour);
      console.log(typeof(hour));
  
      // Create row and columns for the page
      const rowEl = $('<div class="row time-block"></div>');
      const hourEL = $('<div class="col-2 col-md-1 hour text-center py-3"></div>').text(hours.format('hA'));
      const textEl = $('<textarea class="col-8 col-md-10 description" rows="3"></textarea>').text(schedule.text);
  
      // Save the index of the project as a data-* attribute on the button. 
      const saveEl = $(
        '<button class="btn saveBtn col-2 col-md-1" aria-label="save" data-index="' +
          i +
          '"><i class="fas fa-save" aria-hidden="true"></i></button>'
      );
  
      // add class to row by comparing project date to today's date
      if (hours.hour() < hour) {
        rowEl.addClass('past');
      } else if (hours.hour() == hour) {
        rowEl.addClass('present');
      } else {
        rowEl.addClass('future');
      }

      // append elements to DOM to display them
      rowEl.append(hourEL, textEl, saveEl);
      scheduleDisplayEl.append(rowEl);
    }
  }

  // Removes a project from local storage and prints the project data
  function handleScheduleSubmit(event) {
    event.preventDefault();

    // read user input from the input
    const scheduleIndex = parseInt($(this).attr('data-index'));
    const scheduleText = $(this).parent().children("textarea").val();
    console.log(scheduleText);
    console.log(typeof(scheduleText));
  
    const newItem = {
      text: scheduleText,
      index: scheduleIndex,
    };
    console.log(newItem);
    // add schedule to local storage
    const schedules = readSchedulesFromStorage();
    schedules.splice(scheduleIndex, 1, newItem);
    console.log(schedules);
    saveScheduleToStorage(schedules);
  
  }

  displayDate();
  printSchedule();

  scheduleDisplayEl.on('click', '.saveBtn', handleScheduleSubmit);



  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
