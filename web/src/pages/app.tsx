import Tilemap from '@/components/canvas/Map/Tilemap'
import { ObjectType, TileType } from '@/hooks/tileset'
import { useTexture } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

const Tile = dynamic(() => import('@/components/canvas/Map/Tile'), {
  ssr: false,
})

// Step 5 - delete Instructions components
const Page = (props) => {
  return (
    <>
    </>
  )
}

Page.r3f = (props) => {
  return (
    <>
      <Tilemap 
        x={0}
        y={0}
        z={0}
        tileWidth={32}
        tileHeight={32}
        width={16}
        height={16}
        tilesetProps={[{
          tileType: TileType.Floor,
          sheet: '/spritesheet.png',
          tileWidth: 32,
          tileHeight: 32,
          objectsType: ObjectType.Furnitures,
          objects: [{
            startingTile: 0,
            width: 2,
            height: 2,
          }],
        }]} 
      />
    </>
  );
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Apartment',
    },
  }
}
