class Card {
  constructor() {
    this.villagers = new Villagers(this)
    this.ui = new UI(this)
    this.slotData = new SlotData(this)

    this.activeSlot = undefined
    this.activeGridPosition = undefined

    this.random = false
    this.cardSize = '5x5' // Default to 5x5
  }

  setCardSize(size) {
    this.cardSize = size
    this.ui.redrawCard()
    // Reset any active selections
    this.activeGridPosition = undefined
    this.activeSlot = undefined
    const instructions = document.getElementById('instructions')
    instructions.innerHTML = 'Select a Spot on the Bingo Card to Fill.'
  }

  async init() {
    if (this.villagers.villagers) {
      // Initialize Villagers List
      if (this.villagers.villagers.length === 0) {
        // Populate `this.villagers.villagers` from API
        await this.villagers.getVillagers()
        // Call `init()` again to sort animals
        this.init()
      // After retrieving villagers, sort into Animals
      } else if (this.villagers.villagers.length === 413) {
        // Sort Villagers
        this.villagers.animals = await this.villagers.sortVillagers()
        // Render Animal List
        this.ui.renderPortraitSelectors()
      }
    } else {
      // Reset `this.villagers.villagers` if undefined
      this.villagers.villagers = new Array()
      // Call `init()` again to restart process
      setTimeout(this.init(), 5000)
    }
  }

  downloadImage(element) {
    let image = this.ui.canvas.toDataURL('image/jpg')
    element.href = image
  }

  randomizeCard() {
    // For each slot on Bingo Card (1-25, except 13)
    let numbers = Array.apply(null, {length: 413}).map(Number.call, Number);
    shuffle(numbers);

    function shuffle(numbers) {
      let currentIndex = numbers.length, randomIndex;

      while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        [numbers[currentIndex],numbers[randomIndex]] = [numbers[randomIndex],numbers[currentIndex]];
      }

      return numbers;
    }
    
    if (this.cardSize === '5x5') {
      // 5x5 card with free space
      for (let slot = 1; slot <= 25; slot++) {
        this.activeSlot = slot
        this.activeGridPosition = this.slotData.slotToGrid[slot]

        if (slot !== 13) {  
          // Get Villager
          const randomVillagerNumber = numbers[slot-1]
          const villager = this.villagers.villagers[randomVillagerNumber]

          // Call updateVillager() to place Villager on card
          this.ui.updateVillager(villager.id, villager.name['name-USen'], true)
        }
      }
    } else {
      // 4x4 card without free space
      for (let slot = 1; slot <= 16; slot++) {
        this.activeSlot = slot
        this.activeGridPosition = this.slotData.slotTo4x4Grid[slot]

        // Get Villager
        const randomVillagerNumber = numbers[slot-1]
        // Get Villager from `randomVillagerNumber`
        const villager = this.villagers.villagers[randomVillagerNumber]

        // Call updateVillager() to place Villager on card
        this.ui.updateVillager(villager.id, villager.name['name-USen'], true)
      }
    }

    this.random = true
    this.ui.toggleRandomVerificationElement()
  }
}

const card = new Card()
card.init()