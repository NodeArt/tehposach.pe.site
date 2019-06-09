[![Build Status](https://travis-ci.com/NodeArt/tehposach.pe.site.svg?branch=master)](https://travis-ci.com/NodeArt/tehposach.pe.site)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FNodeArt%2Ftehposach.pe.site.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FNodeArt%2Ftehposach.pe.site?ref=badge_shield)
# Tehpostach site
[Link to site](https://tehpostach.com/)

Stack: html, scss, js, gulp

Hosting: Firebase hosting, Firebase Functions for server mailing.

*Firebase secret stored in [Travis-CI](https://travis-ci.com/NodeArt/tehposach.pe.site)*

*Gmail secret stored in firebase secret*

In case of changing smtp server for sending mails please be aware that firebase functions allows to make free http requests only in internal gcloud network. 
For external requests you need enable paid plan. If we use gmail smtp we can use free firebase functions.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FNodeArt%2Ftehposach.pe.site.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FNodeArt%2Ftehposach.pe.site?ref=badge_large)