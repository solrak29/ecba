# ECBA

## Enterprise Chat Bot Application

### *2018 (c)*

**Programing Standards and Notes**
```
Programming notes and structures are based on the following website:
https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/
The idea is to ensure that code structured by features.
The idea is to use protypes for OO to save memory as talked about here:
https://veerasundar.com/blog/2014/02/javascript-prototype-methods-vs-object-methods/
No tabs in files (use expandtab in vi/vim).
Tab stops or spaces shall be 4 spaces.
[GitHust MarkeDown Format for this file](https://guides.github.com/features/mastering-markdown/)
Interesting topic on stream processing in js:
https://docs.nodejitsu.com/articles/command-line/how-to-prompt-for-command-line-input/
```

**Log**

This seciton will log my activity as I go along.  Essentially, if there is no resolved date that
simply means that the work is still in progress.  I am thinking of using the project board in
github, but it seems too combursome at this stage.  I feel it will become useful if and when I get
teams of folks working on this and/or this is live in production and issues are submitted.

```
Resolved   Issued   Description
           20180605 Get Landing page ready.
           20180605 Registerd New Facebook App with New Facebook page.
           20180605 Integrate Watson Components.
20180528   20180528 Added userid to Message object/module
20180528   20180528 Message module would not compile due to sytax errors
20180528   20180528 Get facebook to controller to console interaction 
20180507   20180425 Source callback should not require source object (right now you pass fb because of the design of fb).
20180507   20180425 Do not require call back handlers to have fb object passed. (will also have to modify test).
           20180507 Creating console message strategy to use as part of the messaging framework
20180507   20180507 Retest facebook code with it's testin code; as it depended on the facebook object (I forget why).
20180507   20180507 Fixed test code for facebook as sendMessage was renamed to sendMsg 
           20180507 Add contant message types that can be used
20180507   20180426 Deciing on Strategy Pattern or Template Pattern for Messaging.
20180507   20180425 Need to clearly define the callback and messaging across all applicaotns.  
                        Create a new message module that all interfaces will use to pass messages.
           20180425 Preliminary testing with fb to console bot (next will be console chat via control to b ot).
20180425   20180425 Uploaded console design graphic
20180423   20180422 Test where console test can communicate both ways via the std in/out on both sides.
                        Get this part to process your messages and you are able to type back; then you can 
                        easily plugin to controller piece.
                        Used prompt utility instead of readline (for now this good enough)
20180422   20180422 Added High Level Design on how controller shall work.
20180422   20180419 Console chat side sent message to bot side, but only does the the round trip once.
                        the _transform function needed to have "done" function called.
20180419   20180417 Console testing delayed as stream declaration doesn't work aa documented.
                        this caused an error: const {Readable, Writable} = require('stream');
                        had to move this wayt: const stream = require('stream').Readable for example.
20180422   20180416 Added the use of streams to have two instances of console to talk to each other. -- in progress.
20180419   20180416 Adding function to close console chat for testing different conditions
                        Leaving this out
20180419   20180415 Testing case where console is chat is not connected to console bot.
                        Testing is still in progress on the console product.
                        Decied to remove this test.
20180422   20180415 Testing console code without controller - in progress
20180422   20180415 Adding project board to this project
20180422   20180414 Testing console code without controller - in progress
           20180414 Created console bot to receive messages and test controller.
                        Will expand this to eventually handle both sides.
           20180414 Testing having controler recieve and send back message
20180412   20180412 Exited after facebook configs are not found (not reason for app to continue).
           20180412 Started Controller Code Proto
20180411   20180411 Integrated remaining facebook functions to set typing bubbles and get user details.
20180411   20180411 Controller Design
20180411   20180410 Time should be converted to readable time format.
20180411   20180410 Document what the mids string is.
20180411   20180411 Adding mandatory message type to send message function for facebook requirement as of May 2018.
20180409   20180410 Testing FBMSG1
20180410   20180410 Fixed the name of "recipient object mispelling
20180410   20180410 Fixed processing echo as a initial message
	       20180410 Fixed sending the message with every response from facebook in test.
           20180406 Document Facebook setup in this document - started
20180409   20180409 Testing FBMSG1
                    Tested validation of using sendMessage with facebookmsg type
20180408   20180408 Testing FBMSG1
                    Fixed Lexical scoping of embededed functions in processmessage of of FacebooMsg object as told here:
                    [https://stackoverflow.com/questions/4700880/this-in-function-inside-prototype-function](https://stackoverflow.com/questions/4700880/this-in-function-inside-prototype-function)
           20180407 Testing FBMSG1 (Process message from fb and provide a response funcntionality) - started
20180407   20180406 Process message from fb and provide a response funcntionality
20180406   20180406 Validated facebook verification
20180406   20180406 Able to send message from fb page to facebook module.
```
**Todo**
```
20180528 The controller module has specific calls to console to start as chat or bot.  This should not be the
         case.  We should start any module and and that module will set that object as source or destination.
         So for console, it should be the following:  console.createECBAConsole(); console.asSource(); or 
         console.createECBAConsole(AS_SOURCE).
20180425 Add the ability to manage multiple source and desitnatons
20180424 Add project dependancies (example prompt and colors need to be added)
20180422 Have to see how we make sure dependant modules have the correct function implmeneted.  It seems something like the template design patter here.
20180415 Test Console interface by having console read and write and/or integrated with controller for testing (need to decide which test is viable).
         I'ts a question of time, but discipoine would mean that interface should be testable as a standlone.
         This would mean that the conosle could function as chat interface.
20180412 Look at using the abstract and/or template pattern for the response and message objects
20180410 Test script should store the mids string to ensure that it receives all the messages that is sent.
20180410 Time should be recorded on how long it takes to receives messages.
20180407 Testing FBMSG1 (Process message from fb and provide a response funcntionality)
20180406 Document Facebook setup in this document
20180407 Logging utility to log provide log files - in fb message case to log messages that you are receiving.
20180408 Logging utility shall provide lines numbers so they can be reference by line number.
20180408 Implement typeing bubble functionality to show interaction in processMessage at main object.
             The issue is that you need to process the request object to get user id in order to send
             You may need to extract the user id and sender id before passing to FacebookMessage...
             Actually that makes sense, you should only pass the message component to FacebookMsg class.
20180408 Pass only the message component to the facebookmsg class.
20180408 Facebookiface shall extaact userid and recipent id to save objects in stack to process and log for history.
             maybe get this stuff into db (i.e. moongo db?)
20180408 Use constants for facebook message type to be used instead of relying on text as text allows for typos that can cause runtime errors.
         We want to catch these errors way before running.  Maybe with node this is not the case?  A linter will be needed?
20180408 Add a seciton for all your links below for reference with actual clickable links; fix formatting above where clickable links were attemtped.
20180410 Add constant to each module/class so that constant can be ussed at the beginning of each line for logging.
20180411 Review the Facebook Page-level subscription versus the app-level subscription that will take place in Dec, 31, 2018.
         https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions
20180411 Test typing bubbles work and getting user details; store as part of message objects
20180412 Use const values for any hardcoded text items.  Suchs as "MSG" type.
20180414 Console source/desitnation work.
20180414 Console remote implementation where users can set a remote option and use the console bot from a remote location.
         this will require a client componenet that they can use and/or download.
20180414 Console remote client application
20180415 You building the same strcuture of code for each feature you add.  You should create a utility that where you can just
         create the strcuture/template code to follow; it will save time.  Perhaps npm addFeature?  Node addfeature?
20180415  Make history lines configurable for console chat ; its noted in the code
```
