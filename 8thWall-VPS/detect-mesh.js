export const detectMeshPipelineModule = () => {
    let mesh = null
  
    const loader = new THREE.GLTFLoader()
  
    const handleMeshUpdate = ({detail}) => {
      const {id, position, rotation} = detail
      mesh.position.set(position.x, position.y, position.z)
      mesh.quaternion.copy(rotation)
    }
  
    const handleMeshFound = ({detail}) => {
      const {id, position, rotation, geometry} = detail
      const {scene} = XR8.Threejs.xrScene()
      const texture = null
      
      const ma = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity: 0.7});
      const ge = new THREE.BufferGeometry();
      ge.setIndex( new THREE.BufferAttribute( geometry.index.array, 1 ) );
      ge.setAttribute('position',new THREE.BufferAttribute(geometry.attributes[0].array,3));
      ge.setAttribute('color',new THREE.BufferAttribute(geometry.attributes[1].array,3));
      mesh = new THREE.Mesh(ge, ma)
      mesh.name = 'vps-mesh'
      scene.add(mesh)
  
      handleMeshUpdate({detail})
    }
  
    return {
      name: 'detect-mesh',
  
      listeners: [
        {event: 'reality.meshfound', process: handleMeshFound},
        {event: 'reality.meshupdated', process: handleMeshUpdate},
      ],
    }
  }