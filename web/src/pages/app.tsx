import TilemapComponent from '@/components/canvas/Map/Tilemap'
import Instructions from '@/components/dom/Instructions'
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
      <Instructions />
    </>
  )
}

Page.r3f = (props) => {
  return (
    <>
      <TilemapComponent 
        x={0}
        y={0}
        z={0}
        tileWidth={32}
        tileHeight={32}
        width={16}
        height={16}
        tilesetProps={[{
          texture: '/spritesheet.png',
          tileWidth: 32,
          tileHeight: 32,
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
