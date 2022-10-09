import Tilemap from '@/components/canvas/Map/Tilemap'
import { ObjectType, TilesetProps, tilesets, TileType, walls } from '@/hooks/tileset'
import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { to } from '@react-spring/three'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import useStore from '@/helpers/store'
import Apartment from '@/components/canvas/Apartment'

const Tile = dynamic(() => import('@/components/canvas/Map/Tile'), {
  ssr: false,
})


// Step 5 - delete Instructions components
const Page = (props) => {
  return (
    <>
      <Box 
        bgColor="white" 
        position="absolute" 
        left="5%" 
        top="20%"
        px="8"
        py="4"
        borderRadius="lg"
        textAlign="center"
      >
        <Heading size="md">
          Customization
        </Heading>
        <Tabs>
          <TabList>
            <Tab>Floor</Tab>
            <Tab>Walls</Tab>
            <Tab>Objects</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              
            </TabPanel>
            <TabPanel>
              {walls.map((wall, idx) => {
                const tileset = tilesets.find((tileset) => tileset.tileType === TileType.Wall)
                const wallX = wall % tileset.tileWidth;
                const wallY = Math.floor(wall / tileset.tileWidth);
                
                return (
                  <Box key={idx}>
                    <Heading size="sm">
                      Wall {idx}
                    </Heading>
                  </Box>
                )
              })}
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

Page.r3f = (props) => (
  <>
    <Apartment width={16} height={16} />
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Apartment',
    },
  }
}
