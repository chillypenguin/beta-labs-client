Beta Labs Client
================

This Qt Quick application allows users to browse the applications in Nokia
Beta Labs (http://betalabs.nokia.com/). The main purpose of the application is
to demonstrate how to communicate with a web server from QML using AJAX. The
application also demonstrates how to use Qt Quick Components, and how to utilise
in-app advertising.

The application is compatible with Symbian devices.

This example application is hosted in GitHub:
https://github.com/nokia-developer/beta-labs-client

This example application demonstrates:
- Communicating with a web server from QML using AJAX
- Creating the user interface using multiple QML views
- Using Qt Quick Components
- Utilising in-app advertising using Inneractive's ad SDK

For more information on the implementation and porting, visit the wiki pages:
https://github.com/nokia-developer/beta-labs-client

What's new in 2.0
------------------

 - In-app advertising using QML API by Inneractive
   - Documentation about the implementation can be found here:
     https://github.com/nokia-developer/beta-labs-client/wiki/How-to-use-the-In-App-Advertising-API


1. Usage
-------------------------------------------------------------------------------

Launch BetaLabsClientQtQuick on your device. A security warning may prompt you
to allow the application to access the network. Once you have accepted network
access, the list of the latest applications is downloaded from the backend and
displayed in the Latest applications view. To view the details of a single
application, tap on its name or picture.

From the Details view you can download the application in question or view its
reviews. If downloading is not possible, the Download button is disabled.

To return to the view one level higher at the PageStack hierarchy, tap on the
back button in the toolbar. If you are at the top level of the hierarchy, the
back button closes the application.

The Popular view shows the list of the most popular applications in Nokia Beta
Labs, and the Search view allows you to search for applications. When you click
on the Search button in the toolbar, the list of available application
categories is downloaded from the backend. Check the categories that you want
and tap on 'Search' next to the Free text search field. You can also type a
search phrase into the Free text search field and tap on 'Search'.

Beta applications matching your search criteria are listed. Again, you can view
the details of a single application by tapping on its name or picture.

To exit the application, tap on the back button in the toolbar when you are in
the main level of the application (in the latest, popular, or search view).


2. Prerequisites
-------------------------------------------------------------------------------

 - Qt basics
 - Qt Quick basics
 - AJAX


3. Project structure and implementation
-------------------------------------------------------------------------------

3.1 Folders
-----------

 |                   The root folder contains the project file, resource file,
 |                   the license information, and this file (release notes).
 |
 |- bin              Contains the compiled binaries.
 |
 |- gfx              Contains application graphics.
 |
 |- qml              Root folder for QML files.
 |   |
 |   |- inneractive  Inneractive's ad SDK (QML files).
 |
 |- script           Root folder for JavaScript files.
 |
 |- src              Contains the Qt/C++ source code files.
 |   |
 |   |- iaad         Inneractive's ad SDK (Qt/C++ files).

3.2 Important files and classes
-------------------------------

| File                           | Description                                |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| src/main.cpp                   | The main file of the application. Creates  |
|                                | the main QML file and displays it.         |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| src/componentloader.h,         | A class that handles the displaying of the |
| src/componentloader.cpp        | splash screen and the delayed loading of   |
|                                | the main QML file.                         |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/BetaLabsClientQtQuick.qml  | The main QML file. Contains the UI of the  |
|                                | application.                               |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/BetaView.qml               | The Beta view. Lists beta applications     |
|                                | from Nokia Beta Labs.                      |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/LatestView.qml             | The Latest applications view. Lists latest |
|                                | beta applications in Nokia Beta Labs.      |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/PopularView.qml            | The Popular applications view. Lists most  |
|                                | popular applications in Nokia Beta Labs.   |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/SearchView.qml             | The Search view. Allows searching of beta  |
|                                | applications.                              |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/ResultsView.qml            | The Results view. Lists the results of the |
|                                | search.                                    |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/DetailsView.qml            | The Details view. Displays the details of  |
|                                | a beta application.                        |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/DownloadInfoView.qml       | The Download info view. Displays the       |
|                                | download info of a beta application.       |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/ReviewView.qml             | The Review view. Displays the reviews of a |
|                                | beta application.                          |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/AdContainer.qml            | The component that shows an ad and closes  |
|                                | it after specific time.                    |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/TopBar.qml                 | The component that shows the application   |
|                                | logo and the title of the current page.    |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| qml/SplashScreen.qml           | The splash screen of the application.      |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| script/ajax.js                 | Functions related to AJAX communication.   |
|                                |                                            |
|--------------------------------+--------------------------------------------|
|                                |                                            |
| script/common.js               | Utility functions.                         |
|                                |                                            |
|--------------------------------+--------------------------------------------|

3.3 Used APIs/QML elements/Qt Quick Components
----------------------------------------------

 - PageStackWindow, Page
 - BusyIndicator
 - ToolBar, ToolBarLayout, ToolButton
 - ButtonRow
 - ListView, XmlListModel, XmlRole, ListItem
 - CheckBox
 - Button
 - Timer


4. Compatibility
-------------------------------------------------------------------------------

 - Symbian devices with Qt 4.7.4, Qt Quick Components 1.1 and Qt Mobility 1.2.1.

Tested to work on Nokia 701, Nokia C7-00, Nokia E7-00 and Nokia N8-00.
Developed with Qt SDK 1.2.

4.1 Required capabilities
-------------------------

None; The application can be self signed on Symbian.

4.2 Known issues
----------------

None.


5. Building, installing, and running the application
-------------------------------------------------------------------------------

5.1 Preparations
----------------

Check that you have the latest Qt SDK installed in the development environment
and the latest Qt version on the device.

Qt Quick Components 1.1 or higher is required.

5.2 Using Qt SDK
----------------

You can install and run the application on the device by using the Qt SDK.
Open the project in the SDK, set up the correct target (depending on the device
platform), and click the Run button.

5.3 Symbian device
------------------

Make sure your device is connected to your computer. Locate the .sis
installation file and open it with Nokia Suite. Accept all requests from Nokia
Suite and the device. Note that you can also install the application by copying
the installation file onto your device and opening it with the Symbian File
Manager application.

After the application is installed, locate the application icon from the
application menu and launch the application by tapping the icon.


6. License
-------------------------------------------------------------------------------

See the license text file delivered with this project. The license file is also
available online at
https://github.com/nokia-developer/beta-labs-client/blob/master/qt_quick/Licence.txt


7. Related documentation
-------------------------------------------------------------------------------

Qt Quick Components
- http://doc.qt.nokia.com/qtquick-components-symbian-1.1/index.html


8. Version history
-------------------------------------------------------------------------------

2.0

- Implemented in-app advertising

1.1

- Official Qt Quick Components taken into use
- Added the StatusBar, ToolBar, and ScrollDecorator components
- Moved the tabs to the tool bar
- Changed the view structure to use the PageStack component instead of TabGroup
- Made the top bar scroll along with the content

1.0

- Initial release
