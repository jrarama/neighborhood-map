## Neighborhood Map

A project that displays in a map beautiful places in my neighborhood.

### Running the application

Just [download](https://github.com/jrarama/neighborhood-map/archive/master.zip) the project and open the index.html in your favorite modern browser.

### The Search Panel

The search panel is located at the left side of the page. It is visible by default and can be hidden by clicking the less than button near the "Neighborhood Map" title. Hiding the search panel is useful when you want a wider view of the map. When the panel is hidden, clicking the hamburger menu will make it visible again.

Searching a location is as easy as typing it in the searchbox. Searching is done by checking each word of the locations if it starts with the search query. So if we have a location named "Burnham Park", it will be matched when you typed `bu` or `pa` because "Burnham" starts with `bu` and "Park" starts with `pa`. It will not be matched when you typed `ham` because no words in the location starts with `ham`.

When a location is clicked from the list, the marker corresponding it in the map will bounce and will display information in an Info Window.

### The Markers

The markers indicates the coordinates of the locations. Clicking on them will make them bounce and display information taken from Wikipedia.



