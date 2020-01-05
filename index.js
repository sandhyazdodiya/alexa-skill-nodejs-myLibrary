
  const request = require('request');
  const MySql = require('sync-mysql');
  const config = require('./config.json');
  const Alexa = require('ask-sdk');
 const https = require('https');

 
  
  var connection = new MySql({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });
  function RequestQuery(speechInput){
    request.post('https://49468404.ngrok.io', {
      json: {
      DisplayQuery: speechInput
      }
    });
  }

  function RequestData(speechOutput){
    request.post('https://49468404.ngrok.io', {
      json: {
      DisplayData: speechOutput
      }
  });
  }


 
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
    handle(handlerInput) {
      var speechInput=`Alexa Open My Library`;
      RequestQuery(speechInput);
    const speechOutput = 'Welcome to library';
    RequestData(speechOutput);
    
  return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  
    
  },
};
const CategoryHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'categoryIntent');
  },
   handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const Category = slots.category.value;
    var speechInput=`alexa ask my library to get book of my ${Category} books`;
    RequestQuery(speechInput);
    CategoryResponse = connection.query("SELECT bname from book where category='"+Category+"'");
  
    var CategoryResponseData=[];
    var speechOutput;
    
    if(CategoryResponse.length!=0)
      {
      for(var i=0;i<CategoryResponse.length;i++)
            {
              CategoryResponseData.push(CategoryResponse[i].bname);
            }
           speechOutput = Category+' '+'books are' +' '+CategoryResponseData;
      }
     else
            {
              speechOutput = 'Sorry try searching for another Category';
            }
            RequestData(speechOutput);

    
  return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
    
  },
};
const AuthorHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'authorIntent');
  },
   handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const Author = slots.author.value;
    var speechInput=`alexa ask my library to get book of author ${Author}`;
    RequestQuery(speechInput);
    AuthorResponse = connection.query("SELECT bname from book where author='"+Author+"'");
    var AuthorResponseData= [];
    var speechOutput;
    
    if(AuthorResponse.length!=0)
      {
      for(var i=0;i<AuthorResponse.length;i++)
            {
              AuthorResponseData.push(AuthorResponse[i].bname);
            }
           speechOutput = Author+' '+'books are' +' '+AuthorResponseData;
      }
     else
            {
              speechOutput = 'Sorry try searching for another Author';
            }
            RequestData(speechOutput);
   return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
    
  },
};

const BookTitleHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'booktitleIntent');
  },
   handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const BookTitle = slots.title.value;
    var speechInput=`alexa ask my library to get book titled ${BookTitle}`;
    RequestQuery(speechInput);
    BookTitleResponse = connection.query("SELECT bname from book where bname='"+BookTitle+"'");
    var BookTitleResponseData= [];
    if(BookTitleResponse.length!=0)
    {
    for(var i=0;i<BookTitleResponse.length;i++)
          {
            BookTitleResponseData.push(BookTitleResponse[i].bname);
          }
         speechOutput = BookTitle+' '+'books are' +' '+BookTitleResponseData;
    }
   else
          {
            speechOutput = 'Sorry try searching for another Title';
          }
  
          RequestData(speechOutput);
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
    
  },
};

const ListallBookHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'listAllbooksIntent');
  },
   handle(handlerInput) {
    //const slots = handlerInput.requestEnvelope.request.intent.slots;
    //const Category = slots.category.value;
    var speechInput=`alexa ask my library to list all books from my library`;
    RequestQuery(speechInput);
    ListResponse = connection.query("SELECT bname from book where bookstatus='Available'");
  
    var ListResponseData=[];
    var speechOutput;
    
    if(ListResponse.length!=0)
      {
      for(var i=0;i<ListResponse.length;i++)
            {
              ListResponseData.push(ListResponse[i].bname);
            }
           speechOutput = 'books are' +' '+ListResponseData;
      }
     else
            {
              speechOutput = 'alexa ask my library to list of my books';
            }
            RequestData(speechOutput);
  
    
  return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
    
  },
};
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'My Library';
const HELP_MESSAGE = 'You can say tell me my library, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';



const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
  .addRequestHandlers(
    ListallBookHandler,
    LaunchRequestHandler,
    CategoryHandler,
    BookTitleHandler,
    AuthorHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
  

 
      

