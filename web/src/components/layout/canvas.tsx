import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MapControls, OrbitControls, OrbitControlsProps, OrthographicCamera, PerspectiveCamera, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LControl = () => {
  const dom = useStore((state) => state.dom) as any
  const control = useRef(null)
  const {camera} = useThree()

  useEffect(() => {
    if (control.current) {
      const domElement = dom.current
      const originalTouchAction = domElement.style['touch-action'] 
      domElement.style['touch-action'] = 'none'

      return () => {
        domElement.style['touch-action'] = originalTouchAction
      }
    }
  }, [dom, control])

  return <OrbitControls target={[250, 300, -400]} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2} minAzimuthAngle={Math.PI} maxAzimuthAngle={Math.PI} enableRotate={false} enablePan ref={control} domElement={dom.current} />
}

const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom) as any

  return (
    <Canvas
      // @ts-ignore
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
        backgroundColor: '#202e37',
      }}
      onCreated={(state) => state.events.connect(dom.current)}
    >
      <PerspectiveCamera makeDefault={true}/>
      <LControl />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
