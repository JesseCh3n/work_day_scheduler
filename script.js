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
  
  // Display current day and existing activities
  function saveScheduleToStorage(schedules) {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }
  
  // Gets activities data from local storage and displays them
  function printSchedule() {
    // clear current schedule on the page
    scheduleDisplayEl.empty();
  
    // get schedule contents from localStorage
    const schedules = readSchedulesFromStorage();
  
    // loop through each schedule item from 9AM and create a row
    for (var i = 0; i < 9; i += 1) {
      const schedule = schedules[i];
      const hours = dayjs().hour(9+i);
      //console.log(hours.hour());
      //console.log(typeof(hours.hour()));
      const hour = dayjs().hour();
      //console.log(hour);
      //console.log(typeof(hour));
  
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

  // Handle saving activities
  function handleScheduleSubmit(event) {
    event.preventDefault();

    // read user input from the input
    const scheduleIndex = parseInt($(this).attr('data-index'));
    const scheduleText = $(this).parent().children("textarea").val();
    //console.log(scheduleText);
    //console.log(typeof(scheduleText));
  
    const newItem = {
      text: scheduleText,
      index: scheduleIndex,
    };
    // console.log(newItem);
    // add schedule to local storage
    const schedules = readSchedulesFromStorage();
    schedules.splice(scheduleIndex, 1, newItem);
    // console.log(schedules);
    saveScheduleToStorage(schedules);
  
  }

  displayDate();
  printSchedule();

  scheduleDisplayEl.on('click', '.saveBtn', handleScheduleSubmit);

});
