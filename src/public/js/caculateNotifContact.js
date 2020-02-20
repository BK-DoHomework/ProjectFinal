function increaseNumberNotisContact(className){
  let currentValue=+$(`.${className}`).find("em").text(); //chuyen string -->number
  currentValue +=1;
  if(currentValue===0){
    $(`.${className}`).html("");

  }else{
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}


function gecreaseNumberNotisContact(className){
  let currentValue=+$(`.${className}`).find("em").text(); //chuyen string -->number
  currentValue -=1;
  if(currentValue===0){
    $(`.${className}`).html("");

  }else{
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}
