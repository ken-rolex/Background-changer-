import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [customColor, setCustomColor] = useState('')
  const [colorHistory, setColorHistory] = useState([])
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const colors = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ffa500', // Orange
    '#800080', // Purple
    '#008000', // Dark Green
    '#000000', // Black
  ]

  const gradients = [
    'linear-gradient(to right, #ff9966, #ff5e62)',
    'linear-gradient(to right, #00c6ff, #0072ff)',
    'linear-gradient(to right, #f857a6, #ff5858)',
    'linear-gradient(to right, #4facfe, #00f2fe)',
    'linear-gradient(to right, #43e97b, #38f9d7)'
  ]

  useEffect(() => {
    // Add color to history when background changes
    if (backgroundColor !== '#ffffff' && !colorHistory.includes(backgroundColor)) {
      setColorHistory(prevHistory => {
        const newHistory = [backgroundColor, ...prevHistory].slice(0, 10)
        return newHistory
      })
    }
    
    // Trigger animation when background changes
    setShowAnimation(true)
    const timer = setTimeout(() => setShowAnimation(false), 500)
    
    return () => clearTimeout(timer)
  }, [backgroundColor])

  const changeBackground = (color) => {
    setBackgroundColor(color)
  }

  const handleCustomColorSubmit = (e) => {
    e.preventDefault()
    if (customColor) {
      changeBackground(customColor)
      setCustomColor('')
    }
  }

  const applyGradient = (gradient) => {
    document.body.style.background = gradient
    // For tracking purposes, we'll use a placeholder in the color history
    setBackgroundColor('gradient-' + gradient.substring(0, 15) + '...')
  }

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const getColorName = (hex) => {
    const colorNames = {
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#ff00ff': 'Magenta',
      '#00ffff': 'Cyan',
      '#ffa500': 'Orange',
      '#800080': 'Purple',
      '#008000': 'Dark Green',
      '#000000': 'Black',
    }
    return colorNames[hex] || hex
  }

  return (
    <div className={`app-container ${isDarkTheme ? 'dark-theme' : ''} ${showAnimation ? 'color-transition' : ''}`} 
         style={{ backgroundColor: backgroundColor.startsWith('gradient') ? 'transparent' : backgroundColor }}>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkTheme ? '☀️' : '🌙'}
      </button>
      
      <h1>Background Color Changer</h1>
      
      <div className="color-buttons">
        {colors.map((color, index) => (
          <button
            key={index}
            style={{ backgroundColor: color }}
            onClick={() => changeBackground(color)}
            className={`color-button ${backgroundColor === color ? 'active' : ''}`}
          >
            <span className="button-tooltip">{getColorName(color)}</span>
          </button>
        ))}
      </div>
      
      <div className="gradient-section-title">Gradient Backgrounds</div>
      <div className="gradient-buttons">
        {gradients.map((gradient, index) => (
          <button
            key={index}
            style={{ background: gradient }}
            onClick={() => applyGradient(gradient)}
            className="gradient-button"
          />
        ))}
      </div>
      
      <div className="custom-color-container">
        <div className="color-picker-wrapper">
          <input 
            type="color" 
            value={customColor} 
            onChange={(e) => setCustomColor(e.target.value)}
            className="color-picker"
          />
          <span>Pick a color</span>
        </div>
        
        <form onSubmit={handleCustomColorSubmit}>
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="Enter color name or hex code"
            className="custom-color-input"
          />
          <button type="submit" className="custom-color-button">Apply Color</button>
        </form>
      </div>
      
      <div className="random-button-container">
        <button 
          onClick={() => {
            const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
            changeBackground(randomColor)
          }}
          className="random-button"
        >
          Random Color
        </button>
      </div>
      
      {colorHistory.length > 0 && (
        <div className="color-history">
          <div className="history-title">Recently Used Colors</div>
          {colorHistory.map((color, index) => (
            <button
              key={index}
              style={{ 
                backgroundColor: color.startsWith('gradient') ? '#ddd' : color,
                backgroundImage: color.startsWith('gradient') ? 'linear-gradient(45deg, #ccc, #eee)' : 'none'
              }}
              onClick={() => {
                if (color.startsWith('gradient')) {
                  // This is a simplified approach - in a real app you'd store the full gradient
                  document.body.style.background = gradients[0]
                } else {
                  changeBackground(color)
                }
              }}
              className="history-color"
              title={color}
            />
          ))}
        </div>
      )}
      
      <div className="current-color" style={{ 
        backgroundColor: 'white', 
        color: 'black',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        Current color: {backgroundColor}
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button"
          onClick={() => {
            const link = document.createElement('a')
            const content = `Background color: ${backgroundColor}`
            const file = new Blob([content], { type: 'text/plain' })
            link.href = URL.createObjectURL(file)
            link.download = 'my-background-color.txt'
            link.click()
            URL.revokeObjectURL(link.href)
          }}
        >
          Save Color
        </button>
        
        <button 
          className="action-button"
          onClick={() => {
            navigator.clipboard.writeText(backgroundColor)
            alert('Color code copied to clipboard!')
          }}
        >
          Copy Color Code
        </button>
      </div>
    </div>
  )
}

export default App
