Web Runtime: BetaLabsWidget Example v1.1
========================================

This web widget application allows users to browse the applications in Nokia
Beta Labs (http://betalabs.nokia.com/). The application also demonstrates how
to create the user interface using the Guarana UI, a jQuery based UI library
for Nokia WRT. In addition, the application demonstrates how to enable dynamic
scaling to different orientations by changing the style sheets (CSS) on the
fly, and how to enable a widget for the home screen. The application is
compatible with Symbian^3 and S60 5th Edition devices, and it has been
optimised for touch UI.

-------------------------------------------------------------------------------

FILES

info.plist

- The manifest file of the widget. Contains property and configuration
  information.
             
index.html

- The main HTML file. Contains the UI of the application.

script/main.js

- The main JavaScript file. Contains the main functionality of the widget.
                
script/ajax.js

- Functions related to Ajax communication.

script/common.js

- Utility functions.

style/persistent.css

- The style sheet that is always enabled (in other words, styles that are not
  related to the orientation or resolution of the device).

style/nhd_portrait.css

- The style sheet for portrait orientation in NHD resolution.

style/nhd_landscape.css

- The style sheet for landscape orientation in NHD resolution.

style/home_screen.css

- The style sheet for the home screen.

style/themes

- Themes for some of the UI components.

lib/jquery

- jQuery JavaScript library.

lib/guarana

- Guarana UI, a jQuery-based UI library for Nokia WRT.

gfx/

- The graphics folder. Contains graphics that are used, excluding the icon,
  which must be in the root directory.

icon.png

- The icon of the widget.

-------------------------------------------------------------------------------

KNOWN ISSUES

- The rating stars are not read-only.

-------------------------------------------------------------------------------

DESIGN CONSIDERATIONS

- The application dynamically scales into portrait and landscape orientations. 
  This is accomplished by using valid CSS style sheets, which are activated 
  and deactivated dynamically, depending on the resolution (orientation). For
  example, in portrait orientation in NHD resolution, the style sheet used is
  nhd_portrait.css. The following functions are related to style sheet 
  switching:
  
    main.js/windowResized()
    main.js/detectResolution()
    common.js/setActiveStyleSheet()

- Navigation between views is implemented by hiding and showing the HTML div
  elements dynamically depending on the view the user is in. The 
  implementation can be found in the activateView() function in main.js.

- The widget determines whether to activate the home screen view or the full
  screen view by comparing the window height and width to the screen height and
  width. This happens in the detectResolution() function.
  
- Simply put, displaying the widget on the home screen means applying an
  additional style sheet on top of the normal one. In this additional style
  sheet (home_screen.css), the styles are customised so that only the relevant
  information is visible, and the information looks good on the home screen.

-------------------------------------------------------------------------------
  
INSTALLATION INSTRUCTIONS

Mobile device (S60 5th Edition and Symbian^3)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. There are two ways to deploy the widget to the device.

   a) Copy the BetaLabsWidget.wgz file into a specific folder of the device
      using Nokia PC Suite (for example, into the folder
      \Phone memory\Data\Others). Then, on the device, use the File Manager
      application to find the BetaLabsWidget.wgz file.
   
   OR
   
   b) Send the widget directly to the Messaging Inbox (for example, through
      Bluetooth).

2. On the device, select the BetaLabsWidget.wgz file from the location you
   copied it to to install the widget.

3. After the installation is complete, go to the Applications menu and select
   the Applications folder.
   
4. Locate the BetaLabsWidget icon and select it to launch the widget.

Emulator
~~~~~~~~

1. Start the emulator.

2. Select File > Open...

3. Navigate to the folder where the BetaLabsWidget.wgz file can be found.

4. Select the BetaLabsWidget.wgz file to install the widget.

5. After the installation is complete, go to the Applications menu and select
   the Applications folder.
   
6. Locate the BetaLabsWidget icon and click on it to launch the widget.

-------------------------------------------------------------------------------

RUNNING THE WIDGET

Launch BetaLabsWidget on your device. A security warning prompts you to allow
the widget to access the network. Once you have allowed network access, the
list of the latest applications is downloaded from the backend and displayed 
in the Latest tab. To view the details of a single application, tap on its 
name or picture.

From the details view you can download the application in question or view its
reviews. If downloading is not possible, the Download button is greyed out.

To go back to the previous view at any time, tap on the arrow in the upper
right-hand corner of the screen.

The Popular tab shows the list of the most popular applications in Nokia Beta
Labs, and the Search tab allows you to search for applications. When you click
on the Search tab, the list of available application categories is downloaded
from the backend. Check the categories that you want and tap on 'Search' next
to the Free text search field. You can also type a search phrase into the Free
text search field and tap on 'Search'.

Beta applications matching your search criteria are listed. Again, you can 
view the details of a single application by tapping on its name or picture.

To exit the application, tap on the cross symbol in the upper right-hand 
corner of the screen.


Using the home screen
~~~~~~~~~~~~~~~~~~~~~

1. Add the widget to the home screen by long-tapping an empty slot and
   selecting Add content > BetaLabsWidget.

2. Answer Yes to 'Allow connection to network to enable updates to Home screen
   content?' The widget appears on the home screen.

3. Answer Yes if the widget prompts you to allow it to access the network.

4. Tap onto the widget on the home screen to activate the full screen view.
   Interacting with the widget is only possible in the full screen view.

-------------------------------------------------------------------------------

COMPATIBILITY

S60 5th Edition
Symbian^3

Tested on:

- Nokia N97
- Nokia 5800 XpressMusic
- Nokia N8
- Nokia E7

-------------------------------------------------------------------------------

RELATED RESOURCES

Guarana UI:
http://wiki.forum.nokia.com/index.php/Guarana_UI:_a_jQuery-Based_UI_Library_for_Nokia_WRT