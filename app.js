let kittens = []
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let name = event.target.name.value
  let form = event.target
  if (kittens.findIndex((kitten) => kitten.name == name) != -1) {
    document.getElementById('kitten-error').innerText = "Kitten with this name already exists."
    form.reset()
  }
  else {
    kittens.push({ id:generateId(), name: name, mood: 'tolerant', affection: 5 })
    form.reset()
    document.getElementById('kitten-error').innerText = ""
    saveKittens()
    drawKittens()
  }
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens 
 */
function saveKittens() {
  window.localStorage.setItem('kittens', JSON.stringify(kittens))
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let data = JSON.parse(window.localStorage.getItem('kittens'))
  if (data) {
    kittens = data
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""
  let form = document.getElementById('kittens')
  kittens.forEach((kitten) => {
    let [kittenIdLeft, kittenIdRight] = kitten.id.split('-')
    template += `
    <div class="card 
    ${kitten.affection < 5 ? 'kitten angry': ''}
    ${kitten.affection > 5 ? 'kitten happy' : ''}
    ${kitten.affection == 5 ? 'kitten tolerant' : ''}
    ${kitten.affection == 0 ? 'kitten gone' : ''} 
    m-1" 
    style="max-width: 15%;">
      <img class="mb-3" src="happy-cat.png" alt="Happy Cat Picture">
      <p>Name: ${kitten.name}</p>
      <p>Mood: ${kitten.mood}</p>
      <p>Affection: ${kitten.affection}</p>
      <div>
        <button class="${kitten.affection == 0 ? 'hidden' : ''}" onclick="pet('${kittenIdLeft}-${kittenIdRight}')">Pet</button>
        <button class="${kitten.affection == 0 ? 'hidden' : ''}" onclick="catnip('${kittenIdLeft}-${kittenIdRight}')">Catnip</button>
      </div>
      <i onclick="deleteKitten('${kittenIdLeft}-${kittenIdRight}')" class="mt-1 fa-solid fa-trash action"></i>
    </div>`
  })
  form.innerHTML = template
}


/**
 * Find the kitten in the array by its id
 * @param {string} id 
 * @return {Kitten}
 */
function findKittenById(id) {
  return(kittens.find(kitten => kitten.id == id))
}


/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .5 
 * increase the kittens affection
 * otherwise decrease the affection
 * @param {string} id 
 */
function pet(id) {
  let rnd = Math.random()
  if (rnd > .5) {
    let kitten = findKittenById(id)
    kitten.affection += 1
    setKittenMood(kitten)
  }
  else{
    let kitten = findKittenById(id)
    kitten.affection -= 1
    setKittenMood(kitten)
  }
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id)
  kitten.affection = 5
  setKittenMood(kitten)
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten 
 */
function setKittenMood(kitten) {
  if (kitten.affection == 0){
    kitten.mood = 'gone'
  }
  else if (kitten.affection < 5) {
    kitten.mood = 'angry'
  }
  else if (kitten.affection > 5){
    kitten.mood = 'happy'
  }
  else {
    kitten.mood = 'tolerant'
  }
  let index = kittens.indexOf(kitten)
  kittens[index] = kitten
  saveKittens()
  drawKittens()
}

/**
 * Removes all of the kittens from the array
 * remember to save this change
 */
function clearKittens(){
  kittens = []
  saveKittens()
}

function deleteKitten(id) {
  let selectedKitten = findKittenById(id)
  kittens.splice(kittens.indexOf(selectedKitten), 1)
  saveKittens()
  drawKittens()
}

/**
 * Removes the welcome content and should probably draw the 
 * list of kittens to the page. Good Luck
 */
function getStarted() {
  document.getElementById("welcome").remove();
  console.log('Good Luck, Take it away')
  drawKittens();
}

// --------------------------------------------- No Changes below this line are needed

/**
 * Defines the Properties of a Kitten
 * @typedef {{id:string, name: string, mood: string, affection: number}} Kitten
 */


/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + "-" + Math.floor(Math.random() * 10000000)
}

loadKittens();
drawKittens();
