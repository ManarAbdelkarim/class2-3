'use strict';


$('document').ready(function () {

  function Animal(animal) {
    this.image_url = animal.image_url;
    this.title = animal.title;
    this.description = animal.description;
    this.keyword = animal.keyword;
    this.horns = animal.horns;
  }
  Animal.all = [];
  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
  };
  let animalObject;
  $.ajax('data/page-1.json', ajaxSettings).then((data) => {
    data.forEach((animal) => {
      animalObject = new Animal(animal);
      // animalObject.renderManually();
      animalObject.cloneRender();
      Animal.all.push(animalObject);
      console.log('here it is', animalObject.all);
    });

    generateDropDown();
  });
  // Animal.prototype.renderManually = function () {
  //   $('main').append(`
  //     <div class="photo-template">
  //     <h2>${this.title}</h2>
  //     <img src="${this.image_url}" alt="${this.title}">
  //     <p>${this.description}</p>
  //   </div
  //   </div>
  //   `);
  // };

  Animal.prototype.cloneRender = function () {
    let clonedDiv = $('.photo-template').clone();
    clonedDiv.find('h2').text(`${this.title} # ${this.horns}`);
    clonedDiv.find('img').attr('src', this.image_url , 'alt', this.title);
    clonedDiv.find('p').text(this.description);
    // clonedDiv.removeClass('template');
    clonedDiv.removeClass('photo-template');
    clonedDiv.addClass(this.keyword);
    $('main').append(clonedDiv);
  };


  const generateDropDown = () => {

    let testArray = [];
    let newOption;
    Animal.all.forEach(element => {

      if (testArray.includes(element.keyword) === false) {
        newOption = $('<option/>').attr({ 'value':`${element.keyword}`}).text(`${element.keyword}`);
        $('select').append(newOption) ;
        testArray.push(element.keyword);
      }
    });

  };

  $('select').change(function () {
    if ($(this).val() === 'default') {
      // $('.filteredImages').empty();

      Animal.all.forEach(obj =>{
        $(`.${obj.keyword}`).removeClass('template');
      });
    }




    // $('.photo-template').show();

    else{
      // $('.filteredImages').empty();
      // $('.photo-template').hide();

      Animal.all.forEach(obj =>{
        $(`.${obj.keyword}`).addClass('template');
        if (obj.keyword === $(this).val()) {
        //   $('.filteredImages').append(`
        //   <div class="photo-filtered">
        //   <h2>${obj.title}</h2>
        //   <img src="${obj.image_url}" alt="${obj.title}">
        //   <p>${obj.description}</p>
        // </div
        // </div>
        // `);
          $(`.${obj.keyword}`).removeClass('template');
        }
      });
    }

  });


});


