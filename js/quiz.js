      function updateAchievements()
      {
        authentication_params = {};
        location.search.substr(1).split("&").forEach(function(item) {authentication_params[item.split("=")[0]] = item.split("=")[1]})
        $.get("http://kusuk.in/api/v1/achievements/",
          {id:authentication_params["user_id"], user_email:authentication_params["user_email"], user_token:authentication_params["user_token"] },
          function(data)
            {
              console.log(data);
              for(i=0;i<data["achievements"].length;i++)
              {
                var img_icon = document.createElement("img");
                var img_src_icon = document.createAttribute("src");
                img_src_icon.value = "http://kusuk.in/"+data["achievements"][i].icon;
                img_icon.setAttributeNode(img_src_icon);
                var img_width_icon = document.createAttribute("width");

                img_width_icon.value = "200";

                img_icon.setAttributeNode(img_width_icon);
                var img_height_icon = document.createAttribute("height");

                img_height_icon.value = "200";

                img_icon.setAttributeNode(img_height_icon);
                var img_class_icon = document.createAttribute("class");

                img_class_icon.value = "img-responsive";

                img_icon.setAttributeNode(img_class_icon);

                var para_name = document.createElement("h4");
                para_name.appendChild(document.createTextNode(data["achievements"][i].name));

                var para_description = document.createElement("span");
                var para_description_class = document.createAttribute("class");
                para_description_class.value = "text-muted";
                para_description.setAttributeNode(para_description_class);
                para_description.appendChild(document.createTextNode(data["achievements"][i].description));

                var achievement_div = document.createElement("div");
                var achievement_div_class = document.createAttribute("class");
                achievement_div_class.value = "col-xs-6 col-sm-3 placeholder";
                achievement_div.setAttributeNode(achievement_div_class);

                achievement_div.appendChild(img_icon);
                achievement_div.appendChild(para_name);
                achievement_div.appendChild(para_description);

                var achievements_div = document.getElementById("achievements_div");
                achievements_div.appendChild(achievement_div);
            }
          }
        )
      }

    window.onload = function() {

//var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'fdsa', { preload: preload, create: create, update: update, render: render });

updateAchievements();

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create });

function preload() {

    game.load.atlas('button', '/assets/game/button_texture_atlas.png', '/assets/game/button_texture_atlas.json');
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

var button_a;
var button_b;
var button_c;

var question_text;

var answer_a_text;
var answer_b_text;
var answer_c_text;

var response_text;

var current_question;

var questions=["Is the earth round?",
                "Is the sky blue?",
                "Is there life after death?"];

var answer_choices=[["Yes","No","Maybe"],
                    ["Maybe","No","Yes"],
                    ["Yes","Maybe","No"]];

var correct_answers=["Maybe",
                      "Maybe",
                      "Maybe"];

WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createQuestionText, this); },
    //active: function() { game.time.events.add(Phaser.Timer.SECOND*2, createAnswerAText, this); },
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Roboto']
    }
};

function createQuestionText() {
    question_text = game.add.text(game.world.centerX, 100, "");
    question_text.anchor.setTo(0.5);
    question_text.font = 'Roboto';
    question_text.fontSize = 60;
    question_text.fill = '#FFF';


    answer_a_text = game.add.text(300, 200, "");
    answer_a_text.font = 'Roboto';
    answer_a_text.font.align = 'left';
    answer_a_text.fontSize = 60;
    answer_a_text.fill = '#FFF';
    answer_a_text.inputEnabled = true;
    answer_a_text.events.onInputUp.add(buttonAPressed, this);

    answer_b_text = game.add.text(300, 300, "");
    answer_b_text.font = 'Roboto';
    answer_b_text.font.align = 'left';
    answer_b_text.fontSize = 60;
    answer_b_text.fill = '#FFF';
    answer_b_text.inputEnabled = true;
    answer_b_text.events.onInputUp.add(buttonBPressed, this);

    answer_c_text = game.add.text(300, 400, "");
    answer_c_text.font = 'Roboto';
    answer_c_text.font.align = 'left';
    answer_c_text.fontSize = 60;
    answer_c_text.fill = '#FFF';
    answer_c_text.inputEnabled = true;
    answer_c_text.events.onInputUp.add(buttonCPressed, this);

    response_text = game.add.text(game.world.centerX, 550, "Select your answer");
    response_text.anchor.setTo(0.5);
    response_text.font = 'Roboto';
    response_text.fontSize = 60;
    response_text.fill = '#FFF';
}

function create() {

    game.stage.backgroundColor = '#34495e';

    button_a = game.add.button(50, 200, 'button', buttonAPressed, this, 'over', 'out', 'down');
    button_a = game.add.button(50, 300, 'button', buttonBPressed, this, 'over', 'out', 'down');
    button_a = game.add.button(50, 400, 'button', buttonCPressed, this, 'over', 'out', 'down');

    current_question=0;
    //API call: retreive the progress by reading current_question value
    timer = game.time.create(2000, false);
    timer.add(1500,updateText);
    timer.start();




    game.authentication_params = {};
    location.search.substr(1).split("&").forEach(function(item) {game.authentication_params[item.split("=")[0]] = item.split("=")[1]})


    $.get("http://kusuk.in/api/v1/progress/get",{"course_id":1, user_email: game.authentication_params['user_email'], user_token: game.authentication_params['user_token']},
      function(data)
      {
        current_question=Number(jQuery.parseJSON(data["progress"])["current_question"]);
        if(current_question >= questions.length)
        {
          current_question=0;
        }
        console.log(data);
        console.log("Retreived the current question from Kusukin: "+current_question);
      })
}


function buttonAPressed () {
  if(current_question<questions.length)
  if(correct_answers[current_question]==answer_choices[current_question][0])
  {
    correctAnswer();
    if(current_question<questions.length)
    {
      updateText();
    }else {
      quizFinished();
    }
  }else {
    incorrectAnswer();
  }
}

function buttonBPressed () {
  if(current_question<questions.length)
  if(correct_answers[current_question]==answer_choices[current_question][1])
  {
    correctAnswer();
    if(current_question<questions.length)
    {
      updateText();
    }else {
      quizFinished();
    }
  }else {
    incorrectAnswer();
  }
}

function buttonCPressed () {
  if(current_question<questions.length)
  if(correct_answers[current_question]==answer_choices[current_question][2])
  {
    correctAnswer();
    if(current_question<questions.length)
    {
      updateText();
    }else {
      quizFinished();
    }
  }else {
    incorrectAnswer();
  }
}

function quizFinished()
{
  //API call: achievement unlock
  current_question=0;
  updateText();
  response_text.text="You finished the quiz!";
  $.post("http://kusuk.in/api/v1/achievements/unlock",{"achievement_id":1,user_email: game.authentication_params['user_email'], user_token: game.authentication_params['user_token']},
    function(data)
    {
      console.log(data);
      console.log("Achievement unlocked!");
    })
  updateAchievements();

}

function correctAnswer()
{
  response_text.text="Correct!";
  current_question= Number(current_question)+1;
  //API call: update progress by storing current_question
  $.post("http://kusuk.in/api/v1/progress/save",{"course_id":1,progress:{"current_question":current_question},user_email: game.authentication_params['user_email'], user_token: game.authentication_params['user_token']},
    function(data)
    {
      console.log(data)
      console.log("Stored the current question in Kusukin: "+current_question);
    })
}

function incorrectAnswer()
{
  response_text.text="Incorrect, please try again.";
}

function updateText()
{
  question_text.text = questions[current_question];
  answer_a_text.text = answer_choices[current_question][0];
  answer_b_text.text = answer_choices[current_question][1];
  answer_c_text.text = answer_choices[current_question][2];
}

    };
