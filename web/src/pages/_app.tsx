import Header from '@/config'
import Dom from '@/components/layout/dom'
import '@/styles/index.css'
import dynamic from 'next/dynamic'
import { ChakraProvider } from '@chakra-ui/react'
import theme from "../theme";
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

const connectors = [
  new InjectedConnector({ options: { id: 'argentX' }}),
]

function App({ Component, pageProps = { title: 'index' } }) {
  return (
    <>
      <StarknetConfig connectors={connectors}>
        <ChakraProvider theme={theme}>
          <Header title={pageProps.title} />
            <Dom>
              <Component {...pageProps} />
            </Dom>
            {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
        </ChakraProvider>
      </StarknetConfig>
    </>
  )
}

export default App
