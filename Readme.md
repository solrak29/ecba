# ECBA

## Enterprise Chat Bot Application

### *2018 (c)*

Programming notes and structures are based on the following website:

https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/

The idea is to ensure that code structured by features.

**Log**
```
20180406 Process message from fb and provide a response funcntionality
20180406  Validated facebook verification
20180406  Able to send message from fb page to facebook module.
```
**Todo**
```
20180407 Testing (Process message from fb and provide a response funcntionality)
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
```
