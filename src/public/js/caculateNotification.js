function increaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text(); //chuyen string -->number
  currentValue += number;
  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");

  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}


function decreaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text(); //chuyen string -->number
  currentValue -= number;
  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");

  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}
