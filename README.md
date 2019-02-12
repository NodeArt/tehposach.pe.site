[![Build Status](https://travis-ci.com/NodeArt/tehposach.pe.site.svg?branch=master)](https://travis-ci.com/NodeArt/tehposach.pe.site)
# Tehpostach site
[Link to site](https://tehpostach.com/)

Stack: html, scss, js, gulp

Hosting: Firebase hosting, Firebase Functions for server mailing.

*Firebase secret stored in [Travis-CI](https://travis-ci)*

*Gmail secret stored in firebase secret*

In case of changing smtp server for sending mails please be aware that firebase functions allows to make free http requests only in internal gcloud network. 
For external requests you need enable paid plan. If we use gmail smtp we can use free firebase functions.
