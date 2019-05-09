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
      fillNewRestaurantHTML();
      fillSelectCuisineHTML();
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

fillSelectCuisineHTML = (names = ['American', 'Asian', 'Pizza', 'Mexican']) => {
  const select = document.getElementById('cuisines');
  names.forEach(name => {
    const option = document.createElement('option');
    option.innerHTML = name;
    option.value = name;
    select.append(option);
  });
}

fillNewRestaurantHTML = () => {
  const container = document.getElementById('create-restaurant');
  const title = document.createElement('h2');
  title.innerHTML = 'Add New Restaurant';
  container.appendChild(title);

  const f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"");
  f.setAttribute('enctype','multipart/form-data' )

  const label1 = document.createElement('p');
  label1.innerHTML = 'Name:';

  const n = document.createElement("input");
  n.setAttribute('type',"text");
  n.setAttribute('size',"30");
  n.setAttribute('name',"restaurant_name");

  const label2 = document.createElement('p');
  label2.innerHTML = 'Address:';

  const a = document.createElement("input");
  a.setAttribute('type',"text");
  a.setAttribute('size',"30");
  a.setAttribute('name',"adress");

  const label3 = document.createElement('p');
  label3.innerHTML = 'Boro:';

  const m = document.createElement("input");
  m.setAttribute('type',"radio");
  m.setAttribute('value',"Manhattan");
  m.setAttribute('name',"boro");

  const label4 = document.createElement('span');
  label4.innerHTML = 'Manhattan ';

  const br = document.createElement('p');

  const b = document.createElement("input");
  b.setAttribute('type',"radio");
  b.setAttribute('value',"Brooklyn");
  b.setAttribute('name',"boro");

  const label5 = document.createElement('span');
  label5.innerHTML = 'Brooklyn ';

  const q = document.createElement("input");
  q.setAttribute('type',"radio");
  q.setAttribute('value',"Queens");
  q.setAttribute('name',"boro");

  const label6 = document.createElement('span');
  label6.innerHTML = 'Queens ';

  const sel = document.createElement("select");
  sel.setAttribute('id',"cuisines");
  sel.setAttribute('name',"cuisine");

  const opt = document.createElement("option");
  opt.setAttribute('value', 'all');
  opt.innerHTML = 'Cuisines';

  f.appendChild(label1);
  f.appendChild(n);
  f.appendChild(label2);
  f.appendChild(a);
  f.appendChild(label3);
  f.appendChild(m);
  f.appendChild(label4);
  f.appendChild(br);
  f.appendChild(b);
  f.appendChild(label5);
  f.appendChild(br);
  f.appendChild(q);
  f.appendChild(label6);
  f.appendChild(br);
  sel.appendChild(opt);
  f.appendChild(sel);





  container.appendChild(f);
}
