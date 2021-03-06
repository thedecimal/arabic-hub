var slides = require('./slides');
var questions = require('./questions');
var constructor = require('./objects');

var factory = {
  createQuizAssets: function(){
    return {
      characters: {
        happy: this.createImage('characters/happy3.png'),
        sad: this.createImage('characters/sad1.png')
      },
      sounds: {
        correctAnswer: this.createAudio('feedback/correct.mp3'),
        wrongAnswer: this.createAudio('feedback/incorrect.mp3')
      }
    }
  },
  createSlides: function(slides){
    var slideObjects = [];
    for(var i=0; i< slides.length; i++){
      var slideObj = this.createSlide(slides[i]);
      slideObjects.push(slideObj);
    }
    return slideObjects;
  },

  createSlide: function(options){
    var slide;
    var slideOptions = {};
    if(options.intro){
      slideOptions = {
        intro: options.intro
      }
      if(options.title){
        slideOptions.title = options.title;
      }
      if(options.audio){
        slideOptions.audio = this.createAudio(options.audio);
      }
      if(options.image){
        slideOptions.image = this.createImage(options.image);
      }
      slide = slides.intro(slideOptions);
    }else if(options.question){
      var question = this.createQuestion(options.question)
      slide = slides.question(question);
    }else if(options.documentUrl){
      var opts = {
        documentUrl: options.documentUrl
      }
      if(options.audio){
        opts.audio = this.createAudio(options.audio);
      }
      slide = slides.html(opts);
    }
    return slide;
  },

  createQuestion: function(options){
    var questionBody;
    if(options.audio){
      questionBody = this.createAudio(options.audio, questionBody);
    }
    if(options.image){
      questionBody = this.createImage(options.image, questionBody);
    }
    if(options.text){
      questionBody = this.createText(options.text, questionBody);
    }

    var answers = [];
    var arr = (options.images || options.sounds || options.texts)
    for(var i=0; i< arr.length; i++){
      var obj = constructor.create();
      if(options.images){
        this.createImage(options.images[i], obj);
      }
      if(options.sounds){
        this.createAudio(options.sounds[i], obj);
      }
      if(options.texts){
        this.createText(options.texts[i], obj);
      }
      answers.push(obj);
    }

    return questions.multipleChoice({
      question: questionBody,
      answers: answers,
      correctAnswer: answers[options.correctAnswer]
    });
  },

  createAudio: function(file, obj){
    var url= "/audio/" + file;
    var result = obj || constructor.create();
    return result.extend('audio',{audioURL:url});
  },

  createImage: function(file, obj){
    var url= "/assets/img/" + file;
    var result = obj || constructor.create();
    return result.extend('image', {imageURL:url});
  },

  createText: function(text, obj){
    var result = obj || constructor.create();
    return result.extend('text', {text:text});
  }
};

module.exports = factory