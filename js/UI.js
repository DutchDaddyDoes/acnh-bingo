class UI {
  constructor(card) {
    this.card = card

    // Define Canvas
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.width = 590
    this.canvas.height = 700
    this.ctx = this.canvas.getContext('2d')
    // Create both background images
    this.background5x5 = new Image()
    this.background5x5.src = './img/card.jpg'

    this.background4x4 = new Image()
    this.background4x4.src = './img/card4.jpg'

    // Use the 5x5 background by default
    this.background = this.background5x5

    this.background5x5.onload = () => {
      this.redrawCard()
    }

    this.firstTextPlaced = false
    this.canvas.addEventListener('click', this.clickCanvas.bind(this))
  }

  setBackground() {
    // Use the appropriate background based on card size
    this.background = this.card.cardSize === '4x4' ? this.background4x4 : this.background5x5
    this.ctx.drawImage(this.background, 0, 0)
  }

  redrawCard() {
    // Adjust canvas size based on card size
    if (this.card.cardSize === '4x4') {
      this.canvas.width = 480
      this.canvas.height = 590
    } else {
      this.canvas.width = 590
      this.canvas.height = 700
    }

    // Clear canvas and redraw background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.setBackground()

    // Reset the first text placed tracker
    this.firstTextPlaced = false
  }

  updateVillager(villagerId, villagerName, random=false) {
    if ((this.card.cardSize === '5x5' && this.card.activeSlot && this.card.activeSlot !== 13) || 
      (this.card.cardSize === '4x4' && this.card.activeSlot)) {
      let icon = new Image()
      icon.src = `https://dutchdaddydoes.github.io/ACNHAPI/images/villagers/${villagerId}.png`
      icon.crossOrigin = 'anonymous'

      let column = String(this.card.activeGridPosition)[0]
      let row = String(this.card.activeGridPosition)[2]

      icon.onload = () => {
        const columnCenter = this.card.slotData.columns[column] + 50
        const textWidth = Number(this.ctx.measureText(villagerName).width)
        const textHeightPosition = this.card.slotData.rows[row] + this.card.slotData.slotHeight - 10

        this.ctx.drawImage(icon, this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 15, 60, 60)

        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)

        this.ctx.font = '14px Balsamiq Sans'
        this.ctx.fillStyle = '#60bec3'
        this.ctx.fillText(villagerName, columnCenter - (textWidth / 2), textHeightPosition)

        // Fixes uneven text placement bug
        if (!this.firstTextPlaced) {
          this.firstTextPlaced = true
          this.ctx.fillStyle = "#fff"
          this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)

          this.ctx.font = '14px Balsamiq Sans'
          this.ctx.fillStyle = '#60bec3'
          this.ctx.fillText(villagerName, columnCenter - (Number(this.ctx.measureText(villagerName).width) / 2), textHeightPosition)
        }
      }

    }

    this.card.random = random
    this.toggleRandomVerificationElement()

    this.card.activeGridPosition = undefined
    this.card.activeSlot = undefined
    const instructions = document.getElementById('instructions')
    instructions.innerHTML = 'Select a Spot on the Bingo Card to Fill.'
  }

  toggleRandomVerificationElement() {
    if (this.card.random) {
      if (this.card.cardSize === '5x5') {
        // 5x5 card position
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(360, 677, 225, 25)

        this.ctx.font = '12px Balsamiq Sans'
        this.ctx.fillStyle = '#C0C0C0'
        this.ctx.fillText('Certified Randomly Generated Card', 370, 695)
      } else {
        // 4x4 card position at 220, 565
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(220, 565, 225, 22)

        this.ctx.font = '12px Balsamiq Sans'
        this.ctx.fillStyle = '#C0C0C0'
        this.ctx.fillText('Certified Randomly Generated Card', 230, 580)
      }
      } else {
      if (this.card.cardSize === '5x5') {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(360, 677, 225, 25)
      } else {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(220, 565, 225, 22)
      }
    }
  }

  setEventListeners() {
    // Get Elements
    let selectorsElements = document.querySelectorAll('.animal-type-portrait-container')
    selectorsElements.forEach((selectElement) => {
      selectElement.addEventListener('click', event => {
        let element = event.target
        while (element.className !== 'portrait-container') {
          element = element.parentNode
        }
        this.updateVillager(element.attributes[1]['nodeValue'], element.attributes[2]['nodeValue'])
      })
    })
  }

  renderPortraitSelectors() {
    const { animals: animalsObj } = this.card.villagers

    // Create AnimalType Container
    const villagersContainer = document.getElementById('villagers-container')
    // Remove "Loading" Text
    villagersContainer.innerHTML = ''

    for (const animalType in animalsObj) {
      // Create AnimalType Header
      const animalHeading = document.createElement('h2')
      animalHeading.innerHTML = animalsObj[animalType]['animalName']
      animalHeading.className = 'animal-type-header'
      villagersContainer.appendChild(animalHeading)

      // Create Animal Type Portraits Container
      const animalContainer = document.createElement('div')
      animalContainer.className = 'animal-type-portrait-container'

      // Create Portraits
      animalsObj[animalType][animalType].map((animal) => {
        // Create Portrait Container
        const animalPortraitContainer = document.createElement('div')
        animalPortraitContainer.className = 'portrait-container'
        animalPortraitContainer.setAttribute('data-id', animal['id'])
        animalPortraitContainer.setAttribute('data-name', animal['name']['name-USen'])

        // Create Portrait
        const animalPortrait = document.createElement('img')
        animalPortrait.src = animal['icon_uri']
        animalPortrait.className = 'animal-portrait grow'

        // Create Name Text
        const animalName = document.createElement('p')
        animalName.className = 'animal-name'
        animalName.innerHTML = animal['name']['name-USen']

        animalPortraitContainer.appendChild(animalPortrait)
        animalPortraitContainer.appendChild(animalName)
        animalContainer.appendChild(animalPortraitContainer)
      })

      villagersContainer.appendChild(animalContainer)
    }

    this.setEventListeners()
  }

  clickCanvas(e) {
    let gridPosition = this.card.slotData.detectGridPosition(e.clientX, e.clientY)
    this.card.activeGridPosition = gridPosition
    
    if (this.card.cardSize === '5x5') {
      // 5x5 mode
      this.card.activeSlot = this.card.slotData.gridToSlot[gridPosition]

      if (this.card.activeSlot && this.card.activeSlot !== 13) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Select a Villager to fill ${gridPosition.replace(/\s/g, '')}.`
      } else if (this.card.activeSlot === 13) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Cannot Replace Free Space!`
      }
    } else {
      // 4x4 mode
      this.card.activeSlot = this.card.slotData.grid4x4ToSlot[gridPosition]

      // Check if the slot is valid for 4x4 mode
      if (this.card.activeSlot) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Select a Villager to fill ${gridPosition.replace(/\s/g, '')}.`
      } else {
          // Invalid slot for 4x4 mode
          const instructions = document.getElementById('instructions')
          instructions.innerHTML = `Invalid spot for 4x4 mode. Please select a valid spot.`
      }
    }
  }
}