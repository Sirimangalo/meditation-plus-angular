<a name="v1.11.0"></a>
# [v1.11.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.10.0...v1.11.0) (2017-06-20)

### Bug Fixes
* **general:** Fixed a bug that caused hint label of new messages in chat tab to be incorrect.
* **messages:** Fixed a bug that caused tab completion of usernames to be incorrect.
* **testimonials:** Deleted users are now displayed correctly.
* **ask/message:** Fixed a bug that caused hint label of text length to disappear.
* **ask:** Fixed a bug that caused answered dates of questions to not display.
* **online:** The list of online users is now more accurate.

### Features
* **meditation:** Push notifications are now disabled during a meditation session.
* **meditation:** It is now possible to use Push notifications in addition to the meditation alarm.
* **administration:** Administrators are now able to set the verified state of a user's email address.
* **administration:** Administrators can receive emails on new testimonials
* **general:** The number of new questions are now indicated in the home tab, too.
* **ask:** Added notifications for when an own question gets answered.
* **profile:** Improved the interface for submitting offline meditations by adding a datepicker.
* **livestream:** Added Push notification option for livestreams.
* **help:** Moved help section to new Github Wiki.
* **login:** Added a link for troubleshooting.
* **password-reset:** allow username as well as identifier for recovering passwords.
* **message/admin:** admins are now able to mention all possible users by typing '@all' into chat.
* **schedule:** added a countdown until the next appointment
* **schedule:** admins can now receive notifications for schedule changes

<a name="v1.10.0"></a>
# [v1.10.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.9.1...v1.10.0) (2017-05-13)

### Bug Fixes
* **messages**: Fixed a bug that caused a crash if the chat is empty and a user sends the first message.  

### Features
* **meditation:** increased the maximum time of walking/sitting to 240 minutes.
* **schedule:** improved the list view and added additional EST/EDT information.
* **admin:** added a statistics section.
* **registration:** we've added the activation of an account via email.
* **login:** you can now reset your password.
* **admin:** we've added the possibility to subscribe to new testimonials. You'll receive an email notification.
* **general:** usernames are back. To be able to mention a user in the chat, it's required to have a unique identifier for the user. The current names aren't unique and it's not nice to use an internal database number to mention a user. Therefore we decided to reintroduce usernames. You need to choose one on your first login. Usernames are required, unique and cannot be changed afterwards.
* **messages**: new messages will be indicated with a number on the chat tab.
* **messages**: users will receive PUSH notifications when they are mentioned in a chat message (if they gave their browsers permission to do so).
* **general:** we've made some performance improvements. 
* **general:** updated to a newer version of material2. Select boxes now have a style. 

<a name="v1.9.1"></a>
# [v1.9.1](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.9.0...v1.9.1) (2017-03-12)

### Bug Fixes
* **general:** fixed the url to the how to meditate guide.

<a name="v1.9.0"></a>
# [v1.9.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.8.0...v1.9.0) (2017-02-04)

### Bug Fixes
* **questions:** fixed displaying of answered questions.
* **user:** fixed password changing of users (for admins).
* **schedule:** display times in UTC.
* **general:** we fixed several little bugs and made a huge refactoring under the hood.

<a name="v1.8.0"></a>
# [v1.8.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.7.0...v1.8.0) (2016-11-12)

### Features
* **general:** some text and link changes.
* **schedule:** added a confirmation dialog when deleting an appointment (for admins).
* **schedule:** added support for EST and EDT.

<a name="v1.7.0"></a>
# [v1.7.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.6.0...v1.7.0) (2016-10-22)

### Bug Fixes
* **meditation:** fixed a bug that caused the meditation circles to show incorrect values.
* **questions:** deleting an answered question doesn't require a page reload anymore.
* **general:** fixed a bug that caused the app to crash when the user was inactive for some time.

### Features
* **questions:** added basic suggestions to already answered questions or Yuttadhammo's YouTube videos based on the question you are asking.
* **meditation:** we've added a commitment indicator. It shows your progress directly on the meditation page.
* **meditation:** we introduced "Stable Timer" to make the timer work on mobile phones again. You can read about it in the help section.
* **general:** it is now possible for an admin to suspend an account for a specific amount of time.

<a name="v1.6.0"></a>
# [v1.6.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.5.0...v1.6.0) (2016-09-23)

### Bug Fixes
* **messages:** fixed a style bug with the edit icon.
* **questions:** fixed a bug that caused the app to crash when a user is deleted.

### Features
* **livestream:** the view now automatically updates when the livestream goes online.
* **questions:** added links to the wiki and video section of sirimangalo.org.
* **help:** updated the GitHub links.

<a name="v1.5.0"></a>
# [v1.5.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.4.1...v1.5.0) (2016-09-14)

### Bug Fixes
* **profile:** average meditation time will be displayed as minutes.

### Features
* **questions:** questions will be sorted by the time they have been answered.
* **questions:** links to the YouTube streams will be added to the questions after the broadcast has been ended.
* **messages:** added the ability to load older messages.
* **messages:** you can now edit messages 30 minutes after they have been posted and delete them. A click on your messages opens a menu.
* **meditation:** sitting and walking time now have two separate countdowns.

<a name="v1.4.1"></a>
# [v1.4.1](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.4.0...v1.4.1) (2016-09-07)

### Bug Fixes
* **general:** removed gestures again to prevent the iOS scrolling bug.

<a name="v1.4.0"></a>
# [v1.4.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.3.1...v1.4.0) (2016-09-07)

### Bug Fixes
* **general:** fixed general layout bugs. This allows iPhone users to post questions.
* **meditation:** another try to fix the timer issues.
* **general:** fixed gestures. You should now be able to swipe left and right to switch between tabs on the main page and to open the sidenav while you're on the meditation tab.

### Features
* **profile:** added the ability to change the email address.
* **profile:** meditation times won't be displayed in days anymore.
* **profile:** you can now log 'offline' meditations for the last 30 days.
* **questions:** added rules.

<a name="v1.3.1"></a>
# [v1.3.1](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.3.0...v1.3.1) (2016-09-01)

### Bug Fixes
* **meditation:** fixed a bug which prevented resuming to the chat after meditation.
* **messages:** fixed the scrolling bug and optimized performance.

<a name="v1.3.0"></a>
# [v1.3.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.2.2...v1.3.0) (2016-09-01)

### Features
* **questions:** removed questions from chat and added a separate 'ask' tab. Commitments moved to the menu. You can like questions to get them up the queue.
* **live:** added link to the archive.
* **help:** added explanation of the badge system.
* **meditation:** added two progress circles (walking and sitting) to the meditation view.
* **general:** you can now swipe right to open the sidenav and swipe left to close it.
* **meditation:** individual anumodana buttons have been replaced by a 'give anumodana to all' button.
* **general:** you can now specify your timezone in your profile. Your stats and the meditation graph will be based on this. UTC will be used as a fallback. You will need to logout and login again after you have set your timezone.

### Bug Fixes
* **meditation:** fixed time assignment when stopping meditations.
* **commitment:** fixed calculation of weekly commitments.
* **schedule:** fixed error that showed the hangouts button on the wrong day.
* **messages:** fixed error that prevented messages to be loaded when the app hasn't been used a longer time.

<a name="v1.2.2"></a>
# [v1.2.2](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.2.1...v1.2.2) (2016-08-21)

### Features
* **messages:** added a hint for people posting a question without `Q:` or `:question:`.

### Bug Fixes
* **profile:** fixed a bug that displayed chart data of another profile when switching to the own.
* **messages:** fixed a layout bug of the character counter.
* **schedule:** fixed weekday on list view.
* **meditation:** the bell does not ring anymore when a session has been stopped.
* **meditation:** testing another fix for the timer/bell problem on mobile phones. Please let us know if you encounter any problems.

<a name="v1.2.1"></a>
# [v1.2.1](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.2.0...v1.2.1) (2016-08-19)

### Bug Fixes
* **messages:** fixed performance problems on Android.

<a name="v1.2.0"></a>
# [v1.2.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.1.1...v1.2.0) (2016-08-17)

### Bug Fixes
* **profile:** the calculation of consecutive days has been fixed.
* **testimonials:** testimonials can now be viewed on Firefox mobile and Safari.
* **testimonials:** fixed a layout bug with the textarea.
* **general:** some performance issues have been resolved.

### Features
* **general:** a green border will now be added in messages and the online list to the avatar of people having meditated recently.
* **profile:** the stats now contain units.
* **profile:** four badges of the same level will be merged to badge of the next level. (Badge levels: 1 = black, 2 = bronze, 3 = blue, 4 = gold)
* **profile:** stats can now be hidden from the public profile.
* **general:** flags support HiDPI resolutions and have been added to meditations, messages and the online list.
* **meditation:** optimized the tooltips of the chart and added tooltips for some icons.
* **meditation:** bells should now work on mobile phones when screens are off.

<a name="v1.1.1"></a>
# [v1.1.1](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.1.0...v1.1.1) (2016-08-16)

### Bug Fixes
* **online:** fixes oval pictures on smaller screens.
* **commitment:** fixes calculation.
* **profile:** forces chart to start at 0.

<a name="v1.1.0"></a>
# [v1.1.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v1.0.0...v1.1.0) (2016-08-16)

### Bug Fixes
* **meditation:** bell problems should be resolved (part 2).
* **meditation:** optimized visual like feedback.
* **meditation:** fixed layout problems with long names.
* **meditation:** fixed layout problems with 10 or more likes.
* **message:** fixed layout problems with long names.
* **schedule:** resolved some layout problems.
* **general:** resolved a bug with "Add to Homescreen" on older Android devices.
* **message:** removed duplicate emoji.

### Features
* **profile:** meditation stats have been added.
* **general:** the amount of online users is now visible everywhere (detailed view after clicking on the number).
* **general:** names are now clickable.
* **schedule:** added a list view.
* **home:** the selected tab now stays on page reload.
* **general:** added a "not found" page.
* **schedule:** appointments can now be changed directly with one click instead of first removing the old one and clicking on the new one.
* **meditation:** added a better sitting icon.
* **general:** added a page for the live stream.
* **home:** added an alternative layout without tabs. You can enable it in your profile.
* **help:** updated help to match new app.

<a name="v1.0.0"></a>
# [v1.0.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v0.8.0...v1.0.0) (2016-08-12)

### Bug Fixes
* **messages:** leaving questions only mode will now scroll to the bottom.
* **meditation:** the bell problems on iOS and Android have been fixed.
* **meditation:** the timer problem has been fixed.

### Features
* **meditation:** the last meditation times will now be saved.
* **admin:** adds administration of users and testimonials.
* **testimonials:** you can now write a testimonial.
* **meditation:** the chart has been changed to a bar chart and the current hour will be highlighted.
* **messages:** a loading animation has been added for message sending.
* **meditation:** a loading animation has been added for starting a meditation.
* **meditation:** the anumodana will now be disabled once clicked.
* **meditation:** the inputs of walking and sitting have been swapped.
* **meditation:** the visibility timespan of "finished meditating" has been increased to 3 hours.

<a name="v0.8.0"></a>
# [v0.8.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v0.7.0...v0.8.0) (2016-08-10)

### Bug Fixes
* **messages:** uppercase `:Question:` will now be recognized as a question.
* **profile:** fixed a typo.

### Features
* **meditation:** added bell sounds (choose one in your profile).
* **profile:** sidenav now displays your profile by default instead of editing it.
* **profile:** made links clickable.
* **commitment:** added tooltips with the name to user avatars.
* **messages:** added question only mode.
* **messages:** questions can be marked as answered by an admin.
* **messages:** added more emojis.

<a name="v0.7.0"></a>
# [v0.7.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v0.6.0...v0.7.0) (2016-08-07)

### Bug Fixes
* **messages:** mentioning with @ won't be converted to a twitter link anymore.
* **messages:** message times will now be updated.

### Features
* **help:** added an instruction for changing the profile image.
* **general:** added a nicer loading screen.
* **messages:** messages can now be 1000 characters long.
* **messages:** emoji sizes have been increased.
* **messages:** quesitions can be written with a prepended `Q:` again.
* **messages:** emojis are now case-insensitive.
* **meditation:** added a separate meditation screen with a stop button.

<a name="v0.6.0"></a>
# [v0.6.0](https://github.com/Sirimangalo/meditation-plus-angular/compare/v0.5.1...v0.6.0) (2016-08-06)

### Features

* **messages:** links are now transformed to clickable hyperlinks.
* **messages:** questions with the `:question:` emoji are now highlighted.
* **general:** you'll be notified when the app has been updated.
