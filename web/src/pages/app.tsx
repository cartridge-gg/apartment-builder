import Tilemap from '@/components/canvas/Map/Tilemap'
import { floors, ObjectType, TilesetProps, tilesets, TileType, walls } from '@/hooks/tileset'
import { Box, Button, Grid, GridItem, Heading, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { to } from '@react-spring/three'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import CroppedImage from "react-cropped-image";

import useStore from '@/helpers/store'
import Apartment from '@/components/canvas/Apartment'
import { EditorState, state } from '@/helpers/editorState'

const Tile = dynamic(() => import('@/components/canvas/Map/Tile'), {
  ssr: false,
})


// Step 5 - delete Instructions components
const Page = (props) => {
  return (
    <>
      <Box 
        style={{
          imageRendering: "pixelated"
        }}
        boxShadow="-5px 0 0 0 #49585e,
        5px 0 0 0 #49585e,
        0 -5px 0 0 #49585e,
        0 5px 0 0 #49585e"
        bgColor="#425156" 
        position="absolute" 
        left="5%" 
        top="10%"
        px="8"
        py="4"
        textAlign="center"
        opacity={0.7}
      >
        <Text size="h1">
          Customization
        </Text>
        <br />
        <Select color="#50885e" defaultValue={0} onChange={(e) => state.tool = e.target.value as any}>
          <option value={EditorState.None}>View</option>
          <option value={EditorState.PlacingObject}>Place object</option>
          <option value={EditorState.ReplacingFloor}>Replace floor</option>
          <option value={EditorState.ReplacingWall}>Replace wall</option>
        </Select>
        <br />
        <Tabs>
          <TabList>
            <Tab>Floor</Tab>
            <Tab>Walls</Tab>
            <Tab>Objects</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)">
                {
                  floors.map((floor, idx) => {
                    const tileset = tilesets[0];
                    const top = (Math.floor(floor / 20) * tileset.tileHeight) / 640;
                    const right = 1 - (floor % 20 * tileset.tileWidth + tileset.tileWidth) / 640;
                    const bottom = 1 - (Math.floor(floor / 20) * tileset.tileHeight + tileset.tileHeight) / 640;
                    const left = (floor % 20) * (tileset.tileWidth) / 640;

                    return <GridItem key={idx}>
                      <Box position="relative">
                        <img 
                          src={tilesets[0].sheet}
                          style={{
                            clipPath: `inset(${top * 100}% ${right * 100}% ${bottom * 100}% ${left * 100}%)`,
                            position: "absolute",
                            right: `${left*100*8}%`,
                            top: `${bottom*100*8}%`,
                            transform: "scale(8) translate(47%, -78%)"
                          }}
                        />
                        <Button transform="scale(0.8)" onClick={() => state.selectedFloor = {
                          tilesetId: 0,
                          tileId: floor,
                        }}>
                          Select
                        </Button>
                      </Box>
                    </GridItem>
                  })
                }
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)">
                {
                  walls.map((floor, idx) => {
                    const tileset = tilesets[1];
                    const top = (Math.floor(floor / 20) * tileset.tileHeight) / 640;
                    const right = 1 - (floor % 20 * tileset.tileWidth + tileset.tileWidth) / 640;
                    const bottom = 1 - (Math.floor(floor / 20) * tileset.tileHeight + tileset.tileHeight*2) / 640;
                    const left = (floor % 20) * (tileset.tileWidth) / 640;

                    return <GridItem key={idx}>
                      <Box position="relative">
                        <img 
                          src={tileset.sheet}
                          style={{
                            clipPath: `inset(${top * 100}% ${right * 100}% ${bottom * 100}% ${left * 100}%)`,
                            position: "absolute",
                            right: `${left*100*8}%`,
                            top: `${bottom*100*8}%`,
                            transform: "scale(8) translate(47%, -98%)"
                          }}
                        />
                        <br/>
                        <br />
                        <Button transform="scale(0.8)" onClick={() => state.selectedWall = {
                          tilesetId: 1,
                          tileId: floor,
                        }}>
                          Select
                        </Button>
                      </Box>
                    </GridItem>
                  })
                }
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)">
                {
                  tilesets[2].objects.map((obj, idx) => {
                    const tileset = tilesets[2];
                    const top = (Math.floor(obj.startingTile / 20) * tileset.tileHeight) / 640;
                    const right = 1 - ((obj.startingTile % 20 + obj.width - 1) * tileset.tileWidth + tileset.tileWidth) / 640;
                    const bottom = 1 - ((Math.floor(obj.startingTile / 20) + obj.height - 1) * tileset.tileHeight + tileset.tileHeight) / 640;
                    const left = (obj.startingTile % 20) * (tileset.tileWidth) / 640;

                    return <GridItem key={idx}>
                      <Box position="relative">
                        <img 
                          src={tileset.sheet}
                          style={{
                            clipPath: `inset(${top * 100}% ${right * 100}% ${bottom * 100}% ${left * 100}%)`,
                            position: "absolute",
                            right: `${left*100*8}%`,
                            top: `${bottom*100*8}%`,
                            transform: "scale(8) translate(47%, -105%)"
                          }}
                        />
                        <br/>
                        <br />
                        <Button transform="scale(0.8)" onClick={() => state.selectedObject = {
                          tilesetId: 2,
                          objectId: idx,
                        }}>
                          Select
                        </Button>
                      </Box>
                    </GridItem>
                  })
                }
              </Grid>
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
