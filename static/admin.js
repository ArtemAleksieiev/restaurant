let names
/**
 * Fetch names as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNames();
});

fetchNames = () => {
  DBHelper.fetchNames((error, names) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.names = names;
      fillNamesHTML();
    }
  });
}

/**
 * Set names HTML.
 */

fillNamesHTML = (names = self.names) => {
  const select = document.getElementById('names-select');
  names.forEach(name => {
    const option = document.createElement('option');
    option.innerHTML = name;
    option.value = name;
    select.append(option);
  });
}
