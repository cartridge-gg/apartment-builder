import Header from '@/config'
import Dom from '@/components/layout/dom'
import '@/styles/index.css'
import dynamic from 'next/dynamic'
import { ChakraProvider } from '@chakra-ui/react'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

function App({ Component, pageProps = { title: 'index' } }) {
  return (
    <>
      <ChakraProvider>
        <Header title={pageProps.title} />
          <Dom>
            <Component {...pageProps} />
          </Dom>
          {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
      </ChakraProvider>
    </>
  )
}

export default App
