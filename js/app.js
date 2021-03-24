'use strict';

$('document').ready(function () {
  let animalObject;


  function Animal (animal) {
    this.image_url = animal.image_url;
    this.title = animal.title;
    this.description = animal.description;
    this.keyword = animal.keyword;
    this.horns = animal.horns;
  }

  Animal.prototype.renderWithMustache = function () {
    let template = $('#template').html();
    let html = Mustache.render(template, this);
    let newAnimalDiv = $('<div></div>');
    newAnimalDiv.addClass(`${this.keyword} animal`);
    $(newAnimalDiv).append(html);
    $('main').append(newAnimalDiv);
  };

  Animal.prototype.generateDropDown = function() {
    let testArray = [];
    let newOption;
    if ( $('select').children().length === 0 ) {
      newOption = $('<option/>').attr({ 'value':'default'}).text('Filter by Keyword');
      $('select').append(newOption) ;
    }
    Animal.all.forEach(element => {
      if (testArray.includes(element.keyword) === false) {
        newOption = $('<option/>').attr({ 'value':`${element.keyword}`}).text(`${element.keyword}`);
        $('select').append(newOption) ;
        testArray.push(element.keyword);
      }
    });

  };

  Animal.all = [];
  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
  };


  function renderAjax(url, isRender) {
    $.ajax(url, ajaxSettings).then((data) => {
      data.forEach(animal => {
        animalObject = new Animal(animal);
        if (isRender){
          animalObject.renderWithMustache();
          Animal.all.push(animalObject);
        }
      });
      if (isRender){
        // sort the images alphabetically for the first time
        $('#sortByTitle').prop('checked',true);
        sortDefault();
        animalObject.generateDropDown();
      }
    });
  }

  renderAjax('data/page-1.json', true);
  renderAjax('data/page-2.json', false);


  // filtering by keywords
  $('select').change(function () {
    if ($(this).val() === 'default') {

      Animal.all.forEach(obj =>{
        $(`.${obj.keyword}`).removeClass('template');
      });
    }


    else{

      Animal.all.forEach(obj =>{
        $(`.${obj.keyword}`).addClass('template');
        if (obj.keyword === $(this).val()) {
          $(`.${obj.keyword}`).removeClass('template');
        }
      });
    }

  });

  $('button').click(function () {
    $('select option').remove();
    $('.animal').remove();
    Animal.all =[];
    if (this.id === 'page2') {
      renderAjax('data/page-1.json', false);
      renderAjax('data/page-2.json', true);

    }


    else{
      renderAjax('data/page-2.json', false);
      renderAjax('data/page-1.json', true);

    }

  });





  let radios = $('input:radio[name=sort]');
  for(let radio in radios) {

    if (radio === '0' || radio === '1' ) {
      console.log( radios[radio]);
      radios[radio].onclick = function() {
        if (this.value === 'SortByTitle') {

          Animal.all.sort(compareTitle);
          renderSortedArray();
          return;
        }

        else{
          Animal.all.sort(compareHorns);
          renderSortedArray();
          return;
        }
      };


    }
    else{
      break;
    }

  }
  function renderSortedArray (){
    $('.animal').remove();
    Animal.all.forEach(animal => {
      animal.renderWithMustache();
    });
  }
  function compareHorns (a, b){

    if ( a.horns < b.horns ){
      return -1;
    }
    if ( a.horns> b.horns ){
      return 1;
    }
    return 0;
  }



  function compareTitle( a, b ) {

    let title_a = a.title.replace(/[^a-z]/gi, '');
    let title_b = b.title.replace(/[^a-z]/gi, '');

    if (title_a.toLowerCase() < title_b.toLowerCase() ){
      return -1;
    }
    if (title_a.toLowerCase() > title_b.toLowerCase() ){
      return 1;
    }
    return 0;
  }

  const sortDefault = () => {
    Animal.all.sort(compareTitle);
    renderSortedArray();
  };


});




