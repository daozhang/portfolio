import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

const WelcomeMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 2rem;
  font-weight: bold;
`

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route 
          path="/" 
          element={
            <WelcomeMessage>
              Designer Portfolio Platform - Coming Soon
            </WelcomeMessage>
          } 
        />
      </Routes>
    </AppContainer>
  )
}

export default App