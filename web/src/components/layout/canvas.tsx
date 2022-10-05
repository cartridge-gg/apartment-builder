import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, PerspectiveCamera, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LControl = () => {
  const dom = useStore((state) => state.dom) as any
  const control = useRef(null)

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

  // @ts-ignore
  return <OrbitControls enablePan enableRotate={false} ref={control} domElement={dom.current} />
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
      <OrthographicCamera makeDefault position={[0, 0, 200]} />
      <LControl />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
