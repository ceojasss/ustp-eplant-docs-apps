
```
ustp_eplant_webapp
├─ api
│  ├─ app_modules
│  │  ├─ authentication
│  │  │  ├─ authentication.js
│  │  │  └─ authentication_db.js
│  │  ├─ cashbank
│  │  │  ├─ BankInformation
│  │  │  │  ├─ binfController.js
│  │  │  │  └─ binf_db.js
│  │  │  ├─ index.js
│  │  │  └─ PaymentVoucher
│  │  │     ├─ pvController.js
│  │  │     └─ pvDB.js
│  │  └─ menu
│  │     ├─ menu.js
│  │     └─ menu_db.js
│  ├─ config
│  │  ├─ devwin.env
│  │  └─ web-config.js
│  ├─ index.js
│  ├─ models
│  │  └─ users.js
│  ├─ oradb
│  │  ├─ dbCredentials.js
│  │  └─ dbHandler.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ services
│     ├─ passport.js
│     ├─ router.js
│     └─ webServer.js
└─ client
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ 404.jpg
   │  ├─ favicon.ico
   │  ├─ index.html
   │  ├─ logo192.png
   │  ├─ logo512.png
   │  ├─ manifest.json
   │  ├─ robots.txt
   │  ├─ Semantic-UI-CSS-master
   │  │  ├─ .versions
   │  │  ├─ components
   │  │  │  ├─ accordion.css
   │  │  │  ├─ accordion.js
   │  │  │  ├─ accordion.min.css
   │  │  │  ├─ accordion.min.js
   │  │  │  ├─ ad.css
   │  │  │  ├─ ad.min.css
   │  │  │  ├─ api.js
   │  │  │  ├─ api.min.js
   │  │  │  ├─ breadcrumb.css
   │  │  │  ├─ breadcrumb.min.css
   │  │  │  ├─ button.css
   │  │  │  ├─ button.min.css
   │  │  │  ├─ card.css
   │  │  │  ├─ card.min.css
   │  │  │  ├─ checkbox.css
   │  │  │  ├─ checkbox.js
   │  │  │  ├─ checkbox.min.css
   │  │  │  ├─ checkbox.min.js
   │  │  │  ├─ colorize.js
   │  │  │  ├─ colorize.min.js
   │  │  │  ├─ comment.css
   │  │  │  ├─ comment.min.css
   │  │  │  ├─ container.css
   │  │  │  ├─ container.min.css
   │  │  │  ├─ dimmer.css
   │  │  │  ├─ dimmer.js
   │  │  │  ├─ dimmer.min.css
   │  │  │  ├─ dimmer.min.js
   │  │  │  ├─ divider.css
   │  │  │  ├─ divider.min.css
   │  │  │  ├─ dropdown.css
   │  │  │  ├─ dropdown.js
   │  │  │  ├─ dropdown.min.css
   │  │  │  ├─ dropdown.min.js
   │  │  │  ├─ embed.css
   │  │  │  ├─ embed.js
   │  │  │  ├─ embed.min.css
   │  │  │  ├─ embed.min.js
   │  │  │  ├─ feed.css
   │  │  │  ├─ feed.min.css
   │  │  │  ├─ flag.css
   │  │  │  ├─ flag.min.css
   │  │  │  ├─ form.css
   │  │  │  ├─ form.js
   │  │  │  ├─ form.min.css
   │  │  │  ├─ form.min.js
   │  │  │  ├─ grid.css
   │  │  │  ├─ grid.min.css
   │  │  │  ├─ header.css
   │  │  │  ├─ header.min.css
   │  │  │  ├─ icon.css
   │  │  │  ├─ icon.min.css
   │  │  │  ├─ image.css
   │  │  │  ├─ image.min.css
   │  │  │  ├─ input.css
   │  │  │  ├─ input.min.css
   │  │  │  ├─ item.css
   │  │  │  ├─ item.min.css
   │  │  │  ├─ label.css
   │  │  │  ├─ label.min.css
   │  │  │  ├─ list.css
   │  │  │  ├─ list.min.css
   │  │  │  ├─ loader.css
   │  │  │  ├─ loader.min.css
   │  │  │  ├─ menu.css
   │  │  │  ├─ menu.min.css
   │  │  │  ├─ message.css
   │  │  │  ├─ message.min.css
   │  │  │  ├─ modal.css
   │  │  │  ├─ modal.js
   │  │  │  ├─ modal.min.css
   │  │  │  ├─ modal.min.js
   │  │  │  ├─ nag.css
   │  │  │  ├─ nag.js
   │  │  │  ├─ nag.min.css
   │  │  │  ├─ nag.min.js
   │  │  │  ├─ placeholder.css
   │  │  │  ├─ placeholder.min.css
   │  │  │  ├─ popup.css
   │  │  │  ├─ popup.js
   │  │  │  ├─ popup.min.css
   │  │  │  ├─ popup.min.js
   │  │  │  ├─ progress.css
   │  │  │  ├─ progress.js
   │  │  │  ├─ progress.min.css
   │  │  │  ├─ progress.min.js
   │  │  │  ├─ rail.css
   │  │  │  ├─ rail.min.css
   │  │  │  ├─ rating.css
   │  │  │  ├─ rating.js
   │  │  │  ├─ rating.min.css
   │  │  │  ├─ rating.min.js
   │  │  │  ├─ reset.css
   │  │  │  ├─ reset.min.css
   │  │  │  ├─ reveal.css
   │  │  │  ├─ reveal.min.css
   │  │  │  ├─ search.css
   │  │  │  ├─ search.js
   │  │  │  ├─ search.min.css
   │  │  │  ├─ search.min.js
   │  │  │  ├─ segment.css
   │  │  │  ├─ segment.min.css
   │  │  │  ├─ shape.css
   │  │  │  ├─ shape.js
   │  │  │  ├─ shape.min.css
   │  │  │  ├─ shape.min.js
   │  │  │  ├─ sidebar.css
   │  │  │  ├─ sidebar.js
   │  │  │  ├─ sidebar.min.css
   │  │  │  ├─ sidebar.min.js
   │  │  │  ├─ site.css
   │  │  │  ├─ site.js
   │  │  │  ├─ site.min.css
   │  │  │  ├─ site.min.js
   │  │  │  ├─ state.js
   │  │  │  ├─ state.min.js
   │  │  │  ├─ statistic.css
   │  │  │  ├─ statistic.min.css
   │  │  │  ├─ step.css
   │  │  │  ├─ step.min.css
   │  │  │  ├─ sticky.css
   │  │  │  ├─ sticky.js
   │  │  │  ├─ sticky.min.css
   │  │  │  ├─ sticky.min.js
   │  │  │  ├─ tab.css
   │  │  │  ├─ tab.js
   │  │  │  ├─ tab.min.css
   │  │  │  ├─ tab.min.js
   │  │  │  ├─ table.css
   │  │  │  ├─ table.min.css
   │  │  │  ├─ transition.css
   │  │  │  ├─ transition.js
   │  │  │  ├─ transition.min.css
   │  │  │  ├─ transition.min.js
   │  │  │  ├─ video.css
   │  │  │  ├─ video.js
   │  │  │  ├─ video.min.css
   │  │  │  ├─ video.min.js
   │  │  │  ├─ visibility.js
   │  │  │  ├─ visibility.min.js
   │  │  │  ├─ visit.js
   │  │  │  └─ visit.min.js
   │  │  ├─ LICENSE
   │  │  ├─ package.js
   │  │  ├─ package.json
   │  │  ├─ README.md
   │  │  ├─ semantic.css
   │  │  ├─ semantic.js
   │  │  ├─ semantic.min.css
   │  │  ├─ semantic.min.js
   │  │  └─ themes
   │  │     └─ default
   │  │        └─ assets
   │  │           ├─ fonts
   │  │           │  ├─ brand-icons.eot
   │  │           │  ├─ brand-icons.svg
   │  │           │  ├─ brand-icons.ttf
   │  │           │  ├─ brand-icons.woff
   │  │           │  ├─ brand-icons.woff2
   │  │           │  ├─ icons.eot
   │  │           │  ├─ icons.otf
   │  │           │  ├─ icons.svg
   │  │           │  ├─ icons.ttf
   │  │           │  ├─ icons.woff
   │  │           │  ├─ icons.woff2
   │  │           │  ├─ outline-icons.eot
   │  │           │  ├─ outline-icons.svg
   │  │           │  ├─ outline-icons.ttf
   │  │           │  ├─ outline-icons.woff
   │  │           │  └─ outline-icons.woff2
   │  │           └─ images
   │  │              └─ flags.png
   │  ├─ ustp.png
   │  ├─ ustpico.ico
   │  ├─ ustpico.png
   │  └─ ustp_logo.png
   ├─ README.md
   └─ src
      ├─ apis
      │  └─ eplant.js
      ├─ component
      │  ├─ App.js
      │  ├─ auth
      │  │  ├─ requireAuth.js
      │  │  ├─ Signin.js
      │  │  ├─ SigninStyle.css
      │  │  └─ Signout.js
      │  ├─ Content.js
      │  ├─ dashboard
      │  ├─ Dashboard.js
      │  ├─ forms
      │  │  └─ Input.js
      │  ├─ modules
      │  │  ├─ cashbank
      │  │  │  ├─ paymentvoucher
      │  │  │  │  ├─ PaymentvoucherList.js
      │  │  │  │  └─ PaymentvoucherReducer.js
      │  │  │  ├─ readme.md
      │  │  │  └─ setupbank
      │  │  │     ├─ Form.js
      │  │  │     ├─ SetupBankList.js
      │  │  │     └─ SetupBankReducer.js
      │  │  └─ generalsetup
      │  ├─ TemplateContent.js
      │  └─ templates
      │     ├─ ContainerHeader.js
      │     ├─ ContentHeader.js
      │     ├─ Footer.js
      │     ├─ Headers.js
      │     ├─ NotFound.js
      │     ├─ Routing.js
      │     ├─ sidebar.css
      │     └─ Sidemenu.js
      ├─ DummyData.js
      ├─ index.css
      ├─ index.js
      └─ redux
         ├─ actions
         │  ├─ index.js
         │  └─ types.js
         ├─ manager.js
         └─ reducers
            ├─ appState.js
            ├─ auth.js
            ├─ index.js
            └─ menu.js

```