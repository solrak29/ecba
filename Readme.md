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

```

**Log**
```
Resolved   Issued   Description
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
           20180410 Fixed the name of "recipient object mispelling
           20180410 Fixed processing echo as a initial message
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
```
