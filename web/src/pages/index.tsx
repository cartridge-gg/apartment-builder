import dynamic from 'next/dynamic'
import { AbsoluteCenter, Box, Button, Center, Flex, HStack, Spacer, Text } from '@chakra-ui/react'
import PixelButton from '@/components/dom/PixelButton'
import Tilemap from '@/components/canvas/Map/Tilemap'
import { tilesets } from '@/hooks/tileset'
import { setState } from '@/helpers/store'
import Apartment from '@/components/canvas/Apartment'
import { useAccount, useConnectors } from '@starknet-react/core'

// Step 5 - delete Instructions components
// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
  ssr: false,
})

// dom components goes here
const Page = (props) => {
  const { connect, connectors } = useConnectors();
  const { account, address, status } = useAccount();



  return (
    <Flex height="80%" backdropFilter="blur(5px)" p="12" direction="column" position="absolute" top="15%" left="50%" transform="translateX(-50%)">
      <Spacer />
      <Text textShadow="-6px 0 black, 0 10px black, 6px 0 black, 0 -6px black"  textAlign="center" color="#94bbd6" fontFamily="Retro" fontSize={48}>
        Welcome to your future <strong>on-chain</strong> apartment
      </Text>
      <HStack gap="2px" margin="auto">
        <Button 
          height={32}
          onClick={() => {
            if (!account) {
              connect(connectors[0]);
              return;
            }


          }}
        >
          {account ? "Mint" : "Connect"}
        </Button>
        <a href="https://www.notion.so/Web3-Game-Challenges-0027871616e3499e98afd2cf895cb44e" target="_blank">
          <Button 
            height={32}
            variant="secondary"
          >
            Whitepaper
          </Button>
        </a>
      </HStack>
      <Spacer />
    </Flex>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => (
  <>
    <Apartment width={16} height={16} />
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
