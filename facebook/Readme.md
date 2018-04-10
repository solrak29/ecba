# ECBA Facebook API documentation

### *2018 (c)*

**Introduction**
```
Facebook messaging via this api begins with Facebook page.
Then for each page there is webhook, and Facebook app.
Messages are always initiated by a person visiting your Facebook page.
Currnetly this api only supports standard messaging, but will also 
support subscription and sponsored messaging in the future.

This iteration currently will only use teh Send API for simple text
and structured messaging.  (other features will be made available on case by case basis).

```
**Step 1 Setup your webhook**
https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup

**Step 2 Setup up your app**
https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup

**Step 3 Simple processing**
https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start
```
Page-scoped ID (PSID).
    Each person that users the your Facebook Page Chat (that will talk to your bot),
    will be assigned a PSID number.  This PSID is stored in the sender_id of the message object.
    We store this in FacebookMsg class as userid.


```
